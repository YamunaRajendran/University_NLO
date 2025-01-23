import pandas as pd
import numpy as np
from typing import Dict, List, Any
import json

GRADUATE_INDICATORS = [
    'Number of Graduates',
    'Number of graduates who are employed before graduation',
    'Number of graduates who are employed after graduation',
    'Number of graduates with salary who are employed after graduation'
]

EMPLOYMENT_INDICATORS = [
    'Number of graduates who are employed before graduation',
    'Number of graduates who are employed after graduation',
    'Number of graduates with salary who are employed after graduation'
]

class MajorInsights:
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.original_df = df.copy()
        
        # Only create masks if DataFrame is not empty
        if not df.empty and 'IndicatorDescription' in df.columns:
            # Pre-calculate common filters
            self.GRADUATE_INDICATORS = GRADUATE_INDICATORS
            self.EMPLOYMENT_INDICATORS = EMPLOYMENT_INDICATORS
            
            # Cache common groupby operations if needed
            self.major_groups = self.df.groupby('GeneralMajorName')
            self.gender_groups = self.df.groupby(['GeneralMajorName', 'Gender'])
        else:
            self.major_groups = None
            self.gender_groups = None
        
    def get_total_metrics(self, df: pd.DataFrame = None) -> Dict:
        df = df if df is not None else self.df
        
        # Total graduates
        total_graduates = df[df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
        
        # Employment rate
        total_employed = df[df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)]['IndicatorValue'].sum()
        employment_rate = round((total_employed / total_graduates * 100), 1) if total_graduates > 0 else 0
        
        # Average salary
        total_salary = df[df['IndicatorDescription'] == 'Total salaries of employees after graduation']['IndicatorValue'].astype(float).sum()
        employed_after_graduation = df[df['IndicatorDescription'] == 'Number of graduates with salary who are employed after graduation']['IndicatorValue'].sum()
        average_salary = round(total_salary / employed_after_graduation) if employed_after_graduation > 0 else 0
        
        # Time to employment calculation
        time_to_employment = df[df['IndicatorDescription'] == 'Total number of days until the first job']['IndicatorValue'].sum()
        time_to_employment = round(time_to_employment / total_employed) if total_employed > 0 else 0
        
        return {
            "graduates": int(total_graduates),
            # "graduatesPercentage": 100.0,
            "employmentRate": employment_rate,
            "averageSalary": average_salary,
            "timeToEmployment": time_to_employment
        }

    def get_basic_metrics(self, df: pd.DataFrame = None, level: str = 'general', limit: int = None) -> List[Dict]:

        df = df if df is not None else self.df
        metrics = []
        
        # Determine which column to group by based on the level
        group_by_col = {
            'general': 'GeneralMajorName',
            'narrow': 'NarrowMajorName',
            'major': 'MajorNameByClassification',
            "individual": "MajorNameByClassification"
        }.get(level, 'GeneralMajorName')
        
        # Process metrics for each major in the provided DataFrame
        for major_name in df[group_by_col].unique():
            if pd.isna(major_name):
                continue
                
            major_df = df[df[group_by_col] == major_name]
            
            # Calculate total graduates
            total_graduates = major_df[major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
            
            # Calculate total graduates percentage using original dataset
            all_graduates = self.df[self.df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
            graduates_percentage = round((total_graduates / all_graduates * 100), 1) if all_graduates > 0 else 0
            
            # Calculate employment rate
            employed_count = major_df[major_df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)]['IndicatorValue'].sum()
            employment_rate = round((employed_count / total_graduates * 100), 1) if total_graduates > 0 else 0
            
            # Calculate average salary
            total_salary = major_df[major_df['IndicatorDescription'] == 'Total salaries of employees after graduation']['IndicatorValue'].astype(float).sum()
            employed_after_graduation = major_df[major_df['IndicatorDescription'] == 'Number of graduates with salary who are employed after graduation']['IndicatorValue'].sum()
            average_salary = round(total_salary / employed_after_graduation) if employed_after_graduation > 0 else 0
            
            # Calculate average time to employment
            time_to_employment = major_df[major_df['IndicatorDescription'] == 'Total number of days until the first job']['IndicatorValue'].sum()
            avg_time = round(time_to_employment / employed_count) if employed_count > 0 else 0
            
            # Create metrics dictionary with appropriate key based on level
            metrics_dict = {}

            if level == 'general':
                metrics_dict["generalMajor"] = major_name
            elif level == 'narrow':
                metrics_dict["narrowMajor"] = major_name
            elif level == 'major':
                metrics_dict["name"] = major_name

            metrics_dict.update({
                "graduates": int(total_graduates),
                "graduatesPercentage": graduates_percentage,
                "employmentRate": employment_rate,
                "averageSalary": average_salary,
                "timeToEmployment": avg_time
            })
            
            metrics.append(metrics_dict)
        
        # Sort by graduates count and limit results if specified
        metrics = sorted(metrics, key=lambda x: x['graduates'], reverse=True)
        if limit is not None:
            metrics = metrics[:limit]
        return metrics

    def get_top_general_majors_insights(self, df: pd.DataFrame = None, level: str = 'general') -> Dict:
        df = df if df is not None else self.df
        basic_metrics = self.get_basic_metrics(df, level=level)
        
        # Get the correct major key based on level
        major_key = {
            'general': 'generalMajor',
            'narrow': 'narrowMajor',
            'major': 'name',
            
        }.get(level, 'generalMajor')
        
        # Most popular - already sorted by graduates
        most_popular = [{major_key: m[major_key], "graduates": m["graduates"], "percentage": m["graduatesPercentage"]} for m in basic_metrics[:5]]
        
        # Most employable
        most_employable = sorted([{major_key: m[major_key], "employmentRate": m["employmentRate"], "graduates": m["graduates"]} for m in basic_metrics], key=lambda x: x['employmentRate'], reverse=True)
        
        # Highest paying
        highest_paying = sorted([{major_key: m[major_key], "averageSalary": m["averageSalary"], "graduates": m["graduates"]} for m in basic_metrics], key=lambda x: x['averageSalary'], reverse=True)
        
        # By gender gap
        by_gender_gap = self.get_gender_gap_rankings(df, level=level)
        
        return {
            "mostPopular": most_popular,
            "mostEmployable": most_employable[:5],
            "highestPaying": highest_paying[:5],
            "byGenderGap": by_gender_gap
        }

    def get_gender_gap_rankings(self, df: pd.DataFrame = None, level: str = 'general') -> Dict:
        df = df if df is not None else self.df
        gender_gaps = []
        
        # Determine which column to group by based on the level
        group_by_col = {
            'general': 'GeneralMajorName',
            'narrow': 'NarrowMajorName',
            'major': 'MajorNameByClassification'
        }.get(level, 'GeneralMajorName')
        
        major_groups = df.groupby(group_by_col)
        
        # Get the correct major key based on level
        major_key = {
            'general': 'generalMajor',
            'narrow': 'narrowMajor',
            'major': 'name'
        }.get(level, 'generalMajor')
        
        for major in major_groups.groups:
            if pd.isna(major):
                continue
                
            major_df = major_groups.get_group(major)
            
            total = major_df[major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
            male_count = major_df[(major_df['Gender'] == 'Male') & major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
            female_count = major_df[(major_df['Gender'] == 'Female') & major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
            
            if total > 0:
                male_pct = round(male_count / total * 100, 1)
                female_pct = round(female_count / total * 100, 1)
                gender_gap = round(male_pct - female_pct, 1)
                
                gender_gap_dict = {}
                gender_gap_dict[major_key] = major
                gender_gap_dict.update({
                    "malePercentage": male_pct,
                    "femalePercentage": female_pct,
                    "genderGap": gender_gap,
                    "graduates": int(total)
                })
                gender_gaps.append(gender_gap_dict)
        
        return sorted(gender_gaps, key=lambda x: abs(x['genderGap']), reverse=True)[:5]

    def get_gender_distribution(self, df: pd.DataFrame = None, level: str = 'general'):
        df = df if df is not None else self.df
        if df.empty:
            return []

        # Determine which column to group by based on the level
        group_by_col = {
            'general': 'GeneralMajorName',
            'narrow': 'NarrowMajorName',
            'major': 'MajorNameByClassification',
            "individual": "MajorNameByClassification"
        }.get(level, 'GeneralMajorName')
        
        # Get the correct major key based on level
        major_key = {
            'general': 'generalMajor',
            'narrow': 'narrowMajor',
            'major': 'name'
        }.get(level, 'generalMajor')

        gender_distribution = []
        for major in df[group_by_col].unique():
            if pd.isna(major):
                continue
                
            major_data = df[df[group_by_col] == major]
            total_students = major_data[major_data['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
            if total_students == 0:
                continue
            
            male_count = major_data[(major_data['Gender'] == 'Male') & (major_data['IndicatorDescription'].isin(GRADUATE_INDICATORS))]['IndicatorValue'].sum()
            female_count = major_data[(major_data['Gender'] == 'Female') & (major_data['IndicatorDescription'].isin(GRADUATE_INDICATORS))]['IndicatorValue'].sum()
            
            employment_gender_gap = {
                "beforeGraduation": self.calculate_gender_gap_for_period(major_data, "Before graduation"),
                "withinFirstYear": self.calculate_gender_gap_for_period(major_data, "Within a year"),
                "afterFirstYear": self.calculate_gender_gap_for_period(major_data, "More than a year")
            }
            
            gender_dist_dict = {
                "male": {"count": int(male_count), "percentage": round((male_count / total_students * 100), 1) if total_students > 0 else 0},
                "female": {"count": int(female_count), "percentage": round((female_count / total_students * 100), 1) if total_students > 0 else 0},
                "employmentGenderGap": employment_gender_gap
            }
            gender_dist_dict[major_key] = major
            gender_distribution.append(gender_dist_dict)
        
        return sorted(gender_distribution, key=lambda x: x['male']['count'], reverse=True)[:5]
    
    def calculate_gender_gap_for_period(self, major_data, period):
        period_data = major_data[(major_data['PeriodToEmployment'] == period) & (major_data['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS))]
        total_in_period = period_data['IndicatorValue'].sum()

        if total_in_period == 0:
            return {"male": {"count": 0, "percentage": 0}, "female": {"count": 0, "percentage": 0}, "genderGap": 0}
        
        male_count = period_data[period_data['Gender'] == 'Male']['IndicatorValue'].sum()
        female_count = period_data[period_data['Gender'] == 'Female']['IndicatorValue'].sum()
        
        male_percentage = round((male_count / total_in_period * 100), 1)
        female_percentage = round((female_count / total_in_period * 100), 1)
        
        return {
            "male": {"count": int(male_count), "percentage": male_percentage},
            "female": {"count": int(female_count), "percentage": female_percentage},
            "genderGap": round(male_percentage - female_percentage, 1)
        }

    def get_salary_distribution(self, df: pd.DataFrame = None, level: str = 'general') -> List[Dict]:
        df = df if df is not None else self.df
        salary_dist = []
        all_graduates = df[df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
        
        # Determine which column to group by based on the level
        group_by_col = {
            'general': 'GeneralMajorName',
            'narrow': 'NarrowMajorName',
            'major': 'MajorNameByClassification'
        }.get(level, 'GeneralMajorName')
        
        # Get the correct major key based on level
        major_key = {
            'general': 'generalMajor',
            'narrow': 'narrowMajor',
            'major': 'name'
        }.get(level, 'generalMajor')
        
        major_groups = df.groupby(group_by_col)
        
        for major in major_groups.groups:
            if pd.isna(major):
                continue
                
            major_df = major_groups.get_group(major)
            
            total_graduates = major_df[major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
            
            salary_data = major_df[major_df['IndicatorDescription'] == 'Total salaries of employees after graduation']['IndicatorValue'].astype(float)
            employed_with_salary = major_df[major_df['IndicatorDescription'] == 'Number of graduates with salary who are employed after graduation']['IndicatorValue'].sum()
            
            if employed_with_salary > 0:
                average_salary = round(salary_data.sum() / employed_with_salary)
                median_salary = int(salary_data.median()) if not salary_data.empty else 0
                percentage = round((total_graduates / all_graduates * 100), 1) if all_graduates > 0 else 0
                
                salary_dict = {}
                salary_dict[major_key] = major
                salary_dict.update({
                    "salary": int(average_salary), "percentage": percentage, "median": median_salary
                })
                salary_dist.append(salary_dict)
        
        return sorted(salary_dist, key=lambda x: x['salary'], reverse=True)[:5]

    def get_employment_timing(self, df: pd.DataFrame = None, level: str = 'general') -> List[Dict]:
        df = df if df is not None else self.df
        timing_data = []
        
        # Determine which column to group by based on the level
        group_by_col = {
            'general': 'GeneralMajorName',
            'narrow': 'NarrowMajorName',
            'major': 'MajorNameByClassification'
        }.get(level, 'GeneralMajorName')
        
        # Get the correct major key based on level
        major_key = {
            'general': 'generalMajor',
            'narrow': 'narrowMajor',
            'major': 'name'
        }.get(level, 'generalMajor')
        
        major_groups = df.groupby(group_by_col)
        
        for major in major_groups.groups:
            if pd.isna(major):
                continue
                
            major_df = major_groups.get_group(major)
            
            before_grad = major_df[
                (major_df['PeriodToEmployment'] == 'Before graduation') &
                (major_df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS))
            ]['IndicatorValue'].sum()
            
            within_year = major_df[
                (major_df['PeriodToEmployment'] == 'Within a year') &
                (major_df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS))
            ]['IndicatorValue'].sum()
            
            after_year = major_df[
                (major_df['PeriodToEmployment'] == 'More than a year') &
                (major_df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS))
            ]['IndicatorValue'].sum()
            
            total = before_grad + within_year + after_year
            
            if total > 0:
                timing_dict = {}
                timing_dict[major_key] = major
                timing_dict.update({
                    "beforeGraduation": {"count": int(before_grad), "percentage": round(before_grad / total * 100)},
                    "withinYear": {"count": int(within_year), "percentage": round(within_year / total * 100)},
                    "afterYear": {"count": int(after_year), "percentage": round(after_year / total * 100)}
                })
                timing_data.append(timing_dict)
        
        return sorted(timing_data, key=lambda x: x['beforeGraduation']['count'], reverse=True)[:5]

    def get_employment_timeline(self, df: pd.DataFrame = None, level: str = 'general') -> List[Dict]:
        df = df if df is not None else self.df
        timeline_data = []
        
        # Determine which column to group by based on the level
        group_by_col = {
            'general': 'GeneralMajorName',
            'narrow': 'NarrowMajorName',
            'major': 'MajorNameByClassification'
        }.get(level, 'GeneralMajorName')
        
        # Get the correct major key based on level
        major_key = {
            'general': 'generalMajor',
            'narrow': 'narrowMajor',
            'major': 'name'
        }.get(level, 'generalMajor')
        
        major_groups = df.groupby(group_by_col)
        
        for major in major_groups.groups:
            if pd.isna(major):
                continue
                
            major_df = major_groups.get_group(major)
            
            before_grad = major_df[
                (major_df['PeriodToEmployment'] == 'Before graduation') &
                (major_df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS))
            ]['IndicatorValue'].sum()
            
            within_year = major_df[
                (major_df['PeriodToEmployment'] == 'Within a year') &
                (major_df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS))
            ]['IndicatorValue'].sum()
            
            after_year = major_df[
                (major_df['PeriodToEmployment'] == 'More than a year') &
                (major_df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS))
            ]['IndicatorValue'].sum()
            
            total = before_grad + within_year + after_year
            
            if total > 0:
                total_days = major_df[
                    major_df['IndicatorDescription'] == 'Total number of days until the first job'
                ]['IndicatorValue'].sum()
                
                avg_time = round(total_days / total) if total > 0 else 0
                quick_employment_rate = round(((before_grad) / total * 100)) if total > 0 else 0
                
                timeline_dict = {}
                timeline_dict[major_key] = major
                timeline_dict.update({
                    "averageTime": avg_time,
                    "quickEmploymentRate": quick_employment_rate,
                    "waitingPeriods": {
                        "beforeGraduation": {"count": int(before_grad), "percentage": round(before_grad / total * 100)},
                        "withinYear": {"count": int(within_year), "percentage": round(within_year / total * 100)},
                        "afterYear": {"count": int(after_year), "percentage": round(after_year / total * 100)}
                    }
                })
                timeline_data.append(timeline_dict)
        
        return sorted(timeline_data, key=lambda x: x['averageTime'], reverse=True)[:5]

    def get_top_majors_by_occupation(self, df: pd.DataFrame = None, level: str = 'general'):
        df = df if df is not None else self.df
        if df.empty:
            return {"occupations": []}

        occupations = []
        occupation_data = df[df['ISCOOccupationDescription'] != 0]  # Filter out invalid occupations
        occupation_data.reset_index(drop=True, inplace=True)
        
        for occupation in occupation_data['ISCOOccupationDescription'].unique():
            if pd.isna(occupation):
                continue
                
            occ_data = occupation_data[occupation_data['ISCOOccupationDescription'] == occupation]
            
            total_graduates = occ_data[occ_data['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
            
            if total_graduates == 0:
                continue
                
            male_count = occ_data[
                (occ_data['Gender'] == 'Male') & 
                (occ_data['IndicatorDescription'].isin(GRADUATE_INDICATORS))
            ]['IndicatorValue'].sum()
            
            female_count = occ_data[
                (occ_data['Gender'] == 'Female') & 
                (occ_data['IndicatorDescription'].isin(GRADUATE_INDICATORS))
            ]['IndicatorValue'].sum()
            
            male_percentage = round((male_count / total_graduates * 100), 1)
            female_percentage = round((female_count / total_graduates * 100), 1)
            
            # Calculate occupation level metrics
            total_employed = occ_data[occ_data['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)]['IndicatorValue'].sum()
            employment_rate = round((total_employed / total_graduates * 100), 1) if total_graduates > 0 else 0
            
            total_salary = occ_data[
                occ_data['IndicatorDescription'] == 'Total salaries of employees after graduation'
            ]['IndicatorValue'].astype(float).sum()
            
            employed_with_salary = occ_data[
                occ_data['IndicatorDescription'] == 'Number of graduates with salary who are employed after graduation'
            ]['IndicatorValue'].sum()
            average_salary = round(total_salary / employed_with_salary) if employed_with_salary > 0 else 0
            
            occupation_dict = {}
            occupation_dict["name"] = occupation
            occupation_dict.update({
                "metrics": {
                    "graduates": int(total_graduates),
                    "employmentRate": employment_rate,
                    "averageSalary": average_salary,
                    "genderDistribution": {
                        "male": {"count": int(male_count), "percentage": male_percentage},
                        "female": {"count": int(female_count), "percentage": female_percentage},
                        "genderGap": round(male_percentage - female_percentage, 1)
                    },
                    "employmentGenderGap": {
                        "beforeGraduation": self.calculate_gender_gap_for_period(occ_data, "Before graduation"),
                        "withinFirstYear": self.calculate_gender_gap_for_period(occ_data, "Within a year"),
                        "afterFirstYear": self.calculate_gender_gap_for_period(occ_data, "More than a year")
                    }
                }
            })
            
            occupations.append(occupation_dict)
        
        occupations.sort(key=lambda x: x['metrics']['graduates'], reverse=True)
        occupations = occupations[:5]
        
        return {"occupations": occupations}

    def get_education_level_insights(self, df: pd.DataFrame = None, level: str = 'general'):
        df = df if df is not None else self.df
        if df.empty:
            return []

        education_insights = []
        for education_level in df['EducationLevel'].unique():
            if pd.isna(education_level) or education_level == 'Unclassified':
                continue
                
            # Filter data for this education level
            education_data = df[df['EducationLevel'] == education_level]
            
            # Calculate basic metrics
            total_graduates = education_data[education_data['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
            if total_graduates == 0:
                continue
                
            # Calculate employment metrics
            total_employed = education_data[education_data['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)]['IndicatorValue'].sum()
            employment_rate = round((total_employed / total_graduates * 100), 1) if total_graduates > 0 else 0
            
            # Calculate salary metrics
            total_salary = education_data[
                education_data['IndicatorDescription'] == 'Total salaries of employees after graduation'
            ]['IndicatorValue'].astype(float).sum()
            
            employed_with_salary = education_data[
                education_data['IndicatorDescription'] == 'Number of graduates with salary who are employed after graduation'
            ]['IndicatorValue'].sum()
            average_salary = round(total_salary / employed_with_salary) if employed_with_salary > 0 else 0
            
            # Calculate time to employment
            total_days = education_data[
                education_data['IndicatorDescription'] == 'Total number of days until the first job'
            ]['IndicatorValue'].sum()
            
            total_employed = education_data[education_data['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)]['IndicatorValue'].sum()
            avg_time = round(total_days / total_employed) if total_employed > 0 else 0
            
            # Calculate gender distribution
            male_count = education_data[
                (education_data['Gender'] == 'Male') & 
                (education_data['IndicatorDescription'].isin(GRADUATE_INDICATORS))
            ]['IndicatorValue'].sum()
            
            female_count = education_data[
                (education_data['Gender'] == 'Female') & 
                (education_data['IndicatorDescription'].isin(GRADUATE_INDICATORS))
            ]['IndicatorValue'].sum()
            
            male_percentage = round((male_count / total_graduates * 100), 1)
            female_percentage = round((female_count / total_graduates * 100), 1)
            
            # Create education level insights dictionary
            education_dict = {}
            education_dict["educationLevel"] = education_level
            education_dict.update({
                "metrics": {
                    "graduates": int(total_graduates),
                    "employmentRate": employment_rate,
                    "averageSalary": average_salary,
                    "timeToEmployment": avg_time,
                    "genderDistribution": {
                        "male": {"count": int(male_count), "percentage": male_percentage},
                        "female": {"count": int(female_count), "percentage": female_percentage},
                        "genderGap": round(male_percentage - female_percentage, 1)
                    },
                    "employmentGenderGap": {
                        "beforeGraduation": self.calculate_gender_gap_for_period(education_data, "Before graduation"),
                        "withinFirstYear": self.calculate_gender_gap_for_period(education_data, "Within a year"),
                        "afterFirstYear": self.calculate_gender_gap_for_period(education_data, "More than a year")
                    }
                }
            })
            
            education_insights.append(education_dict)
        
        # Sort by total graduates and return top 5
        education_insights.sort(key=lambda x: x['metrics']['graduates'], reverse=True)
        # return education_insights[:5]
        return education_insights

    def get_by_general_major(self):
        general_majors = []
        
        for general_major in self.df['GeneralMajorName'].unique():
            if pd.isna(general_major):
                continue
                
            # Filter data for this general major
            general_major_data = self.df[self.df['GeneralMajorName'] == general_major].copy()
            print(f"Processing general major: {general_major}, rows: {len(general_major_data)}")
            
            # Get overall metrics for general major using filtered data
            general_major_overall = {
                "basicMetrics": self.get_basic_metrics(general_major_data, level='narrow'),
                "topNarrowMajorsInsights": self.get_top_general_majors_insights(general_major_data, level='narrow'),
                "topMajorsByOccupation": self.get_top_majors_by_occupation(general_major_data, level='narrow'),
                "educationLevelInsights": self.get_education_level_insights(general_major_data, level='narrow'),
                "genderDistribution": self.get_gender_distribution(general_major_data, level='narrow'),
                "salaryDistribution": self.get_salary_distribution(general_major_data, level='narrow'),
                "employmentTiming": self.get_employment_timing(general_major_data, level='narrow'),
                "employmentTimeline": self.get_employment_timeline(general_major_data, level='narrow')
            }
            
            # Process narrow majors
            narrow_majors = []
            for narrow_major in general_major_data['NarrowMajorName'].unique():
                if pd.isna(narrow_major):
                    continue
                    
                # Filter data for this narrow major
                narrow_major_data = general_major_data[general_major_data['NarrowMajorName'] == narrow_major].copy()
                print(f"  Processing narrow major: {narrow_major}, rows: {len(narrow_major_data)}")
                
                # Get overall metrics for narrow major using filtered data
                narrow_major_overall = {
                    "basicMetrics": self.get_basic_metrics(narrow_major_data, level='major', limit=5),
                    "topMajorsInsights": self.get_top_general_majors_insights(narrow_major_data, level='major'),
                    # "topMajorsByOccupation": self.get_top_majors_by_occupation(narrow_major_data, level='major'),
                    "genderDistribution": self.get_gender_distribution(narrow_major_data, level='major'),
                    "salaryDistribution": self.get_salary_distribution(narrow_major_data, level='major'),
                    "employmentTiming": self.get_employment_timing(narrow_major_data, level='major'),
                    "employmentTimeline": self.get_employment_timeline(narrow_major_data, level='major')
                }
                
                # Process individual majors
                majors = []
                for major in narrow_major_data['MajorNameByClassification'].unique():
                    if pd.isna(major):
                        continue
                        
                    # Filter data for this major
                    major_data = narrow_major_data[narrow_major_data['MajorNameByClassification'] == major].copy()
                    print(f"    Processing major: {major}, rows: {len(major_data)}")
                    
                    # Get overall metrics for individual major using filtered data
                    major_overall = {
                        "basicMetrics": self.get_basic_metrics(major_data, level='individual'),
                        "genderDistribution": self.get_gender_distribution(major_data, level='individual'),
                        "salaryDistribution": self.get_salary_distribution(major_data, level='individual'),
                        "employmentTiming": self.get_employment_timing(major_data, level='individual'),
                        "employmentTimeline": self.get_employment_timeline(major_data, level='individual')
                    }
                    
                    majors.append({
                        "name": major,
                        "overall": major_overall
                    })
                
                # Sort majors by total count and take top 5
                majors.sort(key=lambda x: x['overall']['basicMetrics'][0]['graduates'], reverse=True)
                majors = majors[:5]
                
                narrow_majors.append({
                    "name": narrow_major,
                    "overall": narrow_major_overall,
                    "byMajor": {
                        "majors": majors
                    }
                })
            
            general_majors.append({
                "name": general_major,
                "overall": general_major_overall,
                "byNarrowMajor": {
                    "narrowMajors": narrow_majors
                }
            })
        
        return {"generalMajors": general_majors}
    
    # Calculate all major insights
    def get_all_major_insights(self):
        print("Generating all major insights...")
        return {
            "totalMetrics": self.get_total_metrics(),
            "overall": {
                "basicMetrics": self.get_basic_metrics(level='general'),
                "topGeneralMajorsInsights": self.get_top_general_majors_insights(level='general'),
                "topMajorsByOccupation": self.get_top_majors_by_occupation(level='general'),
                "genderDistribution": self.get_gender_distribution(level='general'),
                "salaryDistribution": self.get_salary_distribution(level='general'),
                "employmentTiming": self.get_employment_timing(level='general'),
                "employmentTimeline": self.get_employment_timeline(level='general')
            },
            "byGeneralMajor": self.get_by_general_major()
        }
