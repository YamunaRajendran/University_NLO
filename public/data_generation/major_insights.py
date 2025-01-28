import pandas as pd
import numpy as np
from typing import Dict, List, Any

GRADUATE_INDICATORS = ['Number of Graduates']

EMPLOYMENT_INDICATORS = [
    'Number of graduates who are employed before graduation',
    'Number of graduates who are employed after graduation',
]

IGNORE_VALUES = [
    'Unclassified',
    'Unknown programs',
    'Unclassified programs',
    'Unknown Specializations',
    '0',
    "غير محدد",
    "غير معرف",
    "برامج غير محددة",
    "برامج غير معروفة",
    "برامج غير معروفة",
    "تخصصات غير معروفة"
]

class MajorInsights:
    def __init__(self, df: pd.DataFrame, language: str = 'english', job_seekers: Dict = None):
        self.df = df
        self.original_df = df.copy()
        self.language = language.lower()
        self.job_seekers = job_seekers
        
        if not df.empty and 'IndicatorDescription' in df.columns:
            self.GRADUATE_INDICATORS = GRADUATE_INDICATORS
            self.EMPLOYMENT_INDICATORS = EMPLOYMENT_INDICATORS
            self.major_groups = self.df.groupby('GeneralMajorName')
            self.gender_groups = self.df.groupby(['GeneralMajorName', 'Gender'])
            self.gender_labels = {
                'male': 'Male' if self.language == 'english' else 'ذكر',
                'female': 'Female' if self.language == 'english' else 'أنثى'
            }
            self.period_labels = {
                'beforeGraduation': 'Before graduation' if self.language == 'english' else 'قبل التخرج',
                'withinFirstYear': 'Within a year' if self.language == 'english' else 'خلال سنة',
                'afterFirstYear': 'More than a year' if self.language == 'english' else 'أكثر من سنة'
            }
        else:
            self.major_groups = None
            self.gender_groups = None
        
    def get_total_metrics(self, df: pd.DataFrame = None, job_seekers_data: Dict = None) -> Dict:
        df = df if df is not None else self.df
        job_seekers_data = job_seekers_data if job_seekers_data is not None else self.job_seekers
        
        total_graduates = df[df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
        male_count = df[(df['Gender'] == self.gender_labels['male']) & (df['IndicatorDescription'].isin(GRADUATE_INDICATORS))]['IndicatorValue'].sum()
        female_count = df[(df['Gender'] == self.gender_labels['female']) & (df['IndicatorDescription'].isin(GRADUATE_INDICATORS))]['IndicatorValue'].sum()
        
        male_percentage = round((male_count / total_graduates * 100), 2) if total_graduates > 0 else 0
        female_percentage = round((female_count / total_graduates * 100), 2) if total_graduates > 0 else 0

        total_graduates_data = {
            "totalGraduates": int(total_graduates),
            "male": {"count": int(male_count), "percentage": male_percentage},
            "female": {"count": int(female_count), "percentage": female_percentage}
        }
        
        # Employment rate
        total_employed = df[df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)]['IndicatorValue'].sum()
        employment_rate = round((total_employed / total_graduates * 100), 2) if total_graduates > 0 else 0
        
        # Average salary
        total_salary = df[df['IndicatorDescription'] == 'Total salaries of employees after graduation']['IndicatorValue'].astype(float).sum()
        employed_after_graduation = df[df['IndicatorDescription'] == 'Number of graduates with salary who are employed after graduation']['IndicatorValue'].sum()
        average_salary = round(total_salary / employed_after_graduation) if employed_after_graduation > 0 else 0
        
        # Time to employment by period
        employment_timing = {
            "overall": {"days": 0, "percentage": 0},
            "beforeGraduation": {"days": 0, "percentage": 0},
            "withinFirstYear": {"days": 0, "percentage": 0},
            "afterFirstYear": {"days": 0, "percentage": 0}
        }
        
        # Overall time to employment
        total_days = df[df['IndicatorDescription'] == 'Total number of days until the first job']['IndicatorValue'].sum()
        employed_after_grad = df[df['IndicatorDescription'] == 'Number of graduates who are employed after graduation']['IndicatorValue'].sum()
        # employment_timing["overall"]["days"] = round(total_days / employed_after_grad) if employed_after_grad > 0 else 0
        employment_timing["overall"]["days"] = round((total_days / employed_after_grad) / 30, 1) if employed_after_grad > 0 else 0
        employment_timing["overall"]["percentage"] = round((total_employed / total_graduates * 100), 2) if total_graduates > 0 else 0
        
        for period_name, period_label in [
            ("beforeGraduation", self.period_labels['beforeGraduation']),
            ("withinFirstYear", self.period_labels['withinFirstYear']),
            ("afterFirstYear", self.period_labels['afterFirstYear'])
        ]:
            period_df = df[df['PeriodToEmployment'] == period_label]
            period_days = period_df[period_df['IndicatorDescription'] == 'Total number of days until the first job']['IndicatorValue'].sum()
            period_employed = period_df[period_df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)]['IndicatorValue'].sum()
            # period_employed = period_df[period_df['IndicatorDescription'] == 'Number of graduates who are employed after graduation']['IndicatorValue'].sum()
            # employment_timing[period_name]["days"] = round(period_days / period_employed) if period_employed > 0 else 0
            employment_timing[period_name]["days"] = round((period_days / period_employed) / 30, 1) if period_employed > 0 else 0
            # employment_timing[period_name]["percentage"] = round((period_employed / total_graduates * 100), 2) if total_graduates > 0 else 0
            employment_timing[period_name]["percentage"] = round((period_employed / total_graduates * 100), 2) if total_graduates > 0 else 0
        
        education_insights = self.get_education_level_insights(df)
        
        # University information
        university_data = {
            "total": 55,
            "public": 29,
            "private": 26
        }

        total_job_seekers = job_seekers_data.get('totalJobSeekers', 0) if job_seekers_data else 0
        
        return {
            "graduates": total_graduates_data,
            "employmentRate": employment_rate,
            "averageSalary": average_salary,
            "timeToEmployment": employment_timing,
            "educationLevelInsights": education_insights,
            "universities": university_data,
            "totalJobSeekers": total_job_seekers
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
            if pd.isna(major_name) or any(ignore in str(major_name) for ignore in IGNORE_VALUES):
                continue
                
            major_df = df[df[group_by_col] == major_name]

            general_major_job_seekers = next(
                (item for item in self.job_seekers.get('byGeneralMajor', []) if item['generalMajor'] == major_name),
                {'totalJobSeekers': 0, 'byNarrowMajor': []}
            )
            
            # Get metrics using get_total_metrics
            major_metrics = self.get_total_metrics(major_df, general_major_job_seekers)
            
            # Create metrics dictionary with appropriate key based on level
            metrics_dict = {}
            if level == 'general':
                metrics_dict["generalMajor"] = major_name
            elif level == 'narrow':
                metrics_dict["narrowMajor"] = major_name
            elif level == 'major':
                metrics_dict["name"] = major_name

            metrics_dict.update(major_metrics)
            metrics.append(metrics_dict)
        
        # Sort by graduates count and limit results if specified
        metrics = sorted(metrics, key=lambda x: x['graduates']['totalGraduates'], reverse=True)
        if limit is not None:
            metrics = metrics[:limit]
        return metrics

    def get_top_occupations_by_salary(self, df: pd.DataFrame = None, level: str = 'general') -> List[Dict]:
        df = df if df is not None else self.df
        
        # Get occupation data
        occupation_data = []
        for occupation in df['ISCOOccupationDescription'].unique():
            if pd.isna(occupation) or any(ignore in str(occupation) for ignore in IGNORE_VALUES):
                continue
                
            occupation_df = df[df['ISCOOccupationDescription'] == occupation]
            
            # Calculate total salary and number of employed graduates
            total_salary = occupation_df[
                occupation_df['IndicatorDescription'] == 'Total salaries of employees after graduation'
            ]['IndicatorValue'].astype(float).sum()
            
            employed_count = occupation_df[
                occupation_df['IndicatorDescription'] == 'Number of graduates with salary who are employed after graduation'
            ]['IndicatorValue'].sum()
            
            if employed_count == 0:
                continue
                
            average_salary = round(total_salary / employed_count) if employed_count > 0 else 0
            
            occupation_data.append({
                "occupation": occupation,
                "averageSalary": average_salary,
                "employedCount": int(employed_count)
            })
        
        # Sort by average salary and get top 5
        occupation_data.sort(key=lambda x: x['averageSalary'], reverse=True)
        return occupation_data[:5]

    def get_top_occupations_insights(self, df: pd.DataFrame = None, level: str = 'general') -> Dict:
        df = df if df is not None else self.df
        
        # Get occupation data
        occupation_data = []
        for occupation in df['ISCOOccupationDescription'].unique():
            if pd.isna(occupation) or any(ignore in str(occupation) for ignore in IGNORE_VALUES):
                continue
                
            occupation_df = df[df['ISCOOccupationDescription'] == occupation]
            
            # Calculate total graduates
            total_graduates = occupation_df[
                occupation_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)
            ]['IndicatorValue'].sum()
            
            if total_graduates == 0:
                continue
            
            # Calculate employed count for employment rate
            employed_count = occupation_df[
                occupation_df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)
            ]['IndicatorValue'].sum()
            
            # Calculate employment rate
            employment_rate = round((employed_count / total_graduates * 100), 1) if total_graduates > 0 else 0
            
            # Calculate total salary and number of employed graduates with salary
            total_salary = occupation_df[
                occupation_df['IndicatorDescription'] == 'Total salaries of employees after graduation'
            ]['IndicatorValue'].astype(float).sum()
            
            employed_with_salary = occupation_df[
                occupation_df['IndicatorDescription'] == 'Number of graduates with salary who are employed after graduation'
            ]['IndicatorValue'].sum()
            
            average_salary = round(total_salary / employed_with_salary) if employed_with_salary > 0 else 0
            
            occupation_data.append({
                "occupation": occupation,
                "averageSalary": average_salary,
                "employedCount": int(employed_count),
                "totalGraduates": int(total_graduates),
                "employmentRate": employment_rate
            })
        
        # Sort by total graduates for most popular
        # by_popularity = sorted(occupation_data, key=lambda x: x['employedCount'], reverse=True)[:5]
        by_popularity = sorted(occupation_data, key=lambda x: x['totalGraduates'], reverse=True)[:10]
        
        # Sort by average salary for highest paying
        by_salary = sorted(occupation_data, key=lambda x: x['averageSalary'], reverse=True)[:5]
        
        return {
            "mostPopular": by_popularity,
            "highestPaying": by_salary
        }

    def get_education_level_insights(self, df: pd.DataFrame = None, level: str = 'general'):
        df = df if df is not None else self.df
        if df.empty:
            return []
        entire_total_graduates = df[df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
        education_insights = []
        for education_level in df['EducationLevel'].unique():
            if pd.isna(education_level) or any(ignore in str(education_level) for ignore in IGNORE_VALUES):
                continue
                
            # Filter data for this education level
            education_data = df[df['EducationLevel'] == education_level]
            
            # Calculate total graduates
            total_graduates = education_data[education_data['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
            
            if total_graduates == 0:
                continue
            
            # Calculate gender distribution
            male_count = education_data[
                (education_data['Gender'] == self.gender_labels['male']) & 
                (education_data['IndicatorDescription'].isin(GRADUATE_INDICATORS))
            ]['IndicatorValue'].sum()
            
            female_count = education_data[
                (education_data['Gender'] == self.gender_labels['female']) & 
                (education_data['IndicatorDescription'].isin(GRADUATE_INDICATORS))
            ]['IndicatorValue'].sum()
            
            male_percentage = round((male_count / total_graduates * 100), 1)
            female_percentage = round((female_count / total_graduates * 100), 1)
            
            # Calculate employment rate
            total_employed = education_data[
                education_data['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)
            ]['IndicatorValue'].sum()
            employment_rate = round((total_employed / total_graduates * 100), 1) if total_graduates > 0 else 0
            # employment_rate = round((total_employed / entire_total_graduates * 100), 1) if entire_total_graduates > 0 else 0
            
            education_insights.append({
                "educationLevel": education_level,
                "totalGraduates": int(total_graduates),
                "malePercentage": male_percentage,
                "femalePercentage": female_percentage,
                "employmentRate": employment_rate
            })
        
        # Sort by total graduates
        education_insights.sort(key=lambda x: x['totalGraduates'], reverse=True)
        return education_insights

    def get_major_additional_insights(self, df: pd.DataFrame = None, level: str = 'general') -> Dict:
        """
        Calculate additional insights for majors including employment rate and gender distribution
        Returns top 5 majors by employment rate and gender distribution
        """
        df = df if df is not None else self.df
        
        # Get major column name based on level
        major_col = {
            'general': 'GeneralMajorName',
            'narrow': 'NarrowMajorName',
            'major': 'MajorNameByClassification'
        }.get(level, 'GeneralMajorName')

        # Filter out ignored values before grouping
        df = df[~df[major_col].isin(IGNORE_VALUES) & ~df[major_col].isna()]

        # Calculate employment rate for each major
        total_graduates = df[df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].groupby(df[major_col]).sum()
        total_employed = df[df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)]['IndicatorValue'].groupby(df[major_col]).sum()

        # Get gender distribution
        male_graduates = df[
            (df['IndicatorDescription'].isin(GRADUATE_INDICATORS)) &
            (df['Gender'] == self.gender_labels['male'])
        ]['IndicatorValue'].groupby(df[major_col]).sum()

        female_graduates = df[
            (df['IndicatorDescription'].isin(GRADUATE_INDICATORS)) &
            (df['Gender'] == self.gender_labels['female'])
        ]['IndicatorValue'].groupby(df[major_col]).sum()

        # Prepare results
        major_insights = []
        for major in total_graduates.index:
            grad_count = total_graduates[major]
            employed_count = total_employed.get(major, 0)
            male_count = int(male_graduates.get(major, 0))
            female_count = int(female_graduates.get(major, 0))
            
            # Calculate employment rate
            employment_rate = round((employed_count / grad_count * 100), 1) if grad_count > 0 else 0
            
            # Calculate gender percentages
            total_gender = male_count + female_count
            male_percentage = round((male_count / total_gender * 100), 1) if total_gender > 0 else 0
            female_percentage = round((female_count / total_gender * 100), 1) if total_gender > 0 else 0
            
            # Use the correct key based on the level
            major_key = {
                'GeneralMajorName': 'generalMajor',
                'NarrowMajorName': 'narrowMajor',
                'MajorNameByClassification': 'name'
            }.get(major_col)
            
            major_insights.append({
                major_key: major,
                "graduates": int(grad_count),
                "employmentRate": employment_rate,
                "genderDistribution": {
                    "male": {
                        "count": male_count,
                        "percentage": male_percentage
                    },
                    "female": {
                        "count": female_count,
                        "percentage": female_percentage
                    }
                }
            })
        
        # Sort by employment rate for employment rate insights
        by_employment_rate = sorted(major_insights, key=lambda x: x["employmentRate"], reverse=True)[:5]
        
        # Sort by gender difference for gender insights (majors with highest female percentage)
        by_gender = sorted(major_insights, key=lambda x: x["genderDistribution"]["male"]["percentage"], reverse=True)[:5]
        
        return {
            "topByEmploymentRate": by_employment_rate,
            "topByGender": by_gender
        }

    def get_employment_timing_insights(self, df: pd.DataFrame = None, level: str = 'general') -> Dict:
        """
        Calculate employment timing insights based on when graduates found employment
        Returns percentage and count of graduates employed before graduation, within first year, and after first year
        """
        df = df if df is not None else self.df
        
        # Get major column name based on level
        major_col = {
            'general': 'GeneralMajorName',
            'narrow': 'NarrowMajorName',
            'major': 'MajorNameByClassification'
        }.get(level, 'GeneralMajorName')

        # Get total graduates for each major
        total_graduates = df[df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].groupby(df[major_col]).sum()

        # Get employment timing data based on PeriodToEmployment
        employed_before = df[
            (df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)) &
            (df['PeriodToEmployment'] == self.period_labels['beforeGraduation'])
        ]['IndicatorValue'].groupby(df[major_col]).sum()

        employed_within_year = df[
            (df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)) &
            (df['PeriodToEmployment'] == self.period_labels['withinFirstYear'])
        ]['IndicatorValue'].groupby(df[major_col]).sum()

        employed_after_year = df[
            (df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)) &
            (df['PeriodToEmployment'] == self.period_labels['afterFirstYear'])
        ]['IndicatorValue'].groupby(df[major_col]).sum()

        # Prepare results
        employment_timing = []
        for major in total_graduates.index:
            total = total_graduates[major]
            before_count = int(employed_before.get(major, 0))
            within_count = int(employed_within_year.get(major, 0))
            after_count = int(employed_after_year.get(major, 0))
            
            # Calculate total employed for percentage calculation
            total_employed = before_count + within_count + after_count
            
            # Calculate percentages based on total employed
            before_percentage = round((before_count / total_employed * 100), 1) if total_employed > 0 else 0
            within_percentage = round((within_count / total_employed * 100), 1) if total_employed > 0 else 0
            after_percentage = round((after_count / total_employed * 100), 1) if total_employed > 0 else 0
            
            # Use the correct key based on the level
            major_key = {
                'GeneralMajorName': 'generalMajor',
                'NarrowMajorName': 'narrowMajor',
                'MajorNameByClassification': 'name'
            }.get(major_col)
            
            employment_timing.append({
                major_key: major,
                "graduates": int(total),
                "employmentTiming": {
                    "beforeGraduation": {
                        "count": before_count,
                        "percentage": before_percentage
                    },
                    "withinFirstYear": {
                        "count": within_count,
                        "percentage": within_percentage
                    },
                    "afterFirstYear": {
                        "count": after_count,
                        "percentage": after_percentage
                    }
                }
            })
        
        # Sort by total graduates and return top 5
        employment_timing.sort(key=lambda x: x["graduates"], reverse=True)
        return {
            "topByEmploymentTiming": employment_timing[:5],
            **self.get_major_additional_insights(df, level)
        }

    def get_by_general_major(self):
        general_majors = []
        
        for general_major in self.df['GeneralMajorName'].unique():
            # if pd.isna(general_major) or any(ignore in str(general_major) for ignore in IGNORE_VALUES):
            if pd.isna(general_major) or (str(general_major) in IGNORE_VALUES):
                continue
                
            # Filter data for this general major
            general_major_data = self.df[self.df['GeneralMajorName'] == general_major].copy()
            print(f"Processing general major: {general_major}, rows: {len(general_major_data)}")
            
            # Get overall metrics for general major using filtered data
            
            general_major_job_seekers = next(
                (item for item in self.job_seekers.get('byGeneralMajor', []) if item['generalMajor'] == general_major),
                {'totalJobSeekers': 0, 'byNarrowMajor': []}
            )
            # if general_major_job_seekers:
            #     print("general_major_job_seekers", general_major_job_seekers)
            #     print("general_major name is ", general_major)
            
            general_major_overall = {
                "totalMetrics": self.get_total_metrics(general_major_data, general_major_job_seekers),
                "topNarrowMajorsInsights": self.get_employment_timing_insights(general_major_data, level='narrow'),
                "topOccupationsInsights": self.get_top_occupations_insights(general_major_data, level='narrow')
            }
            
            # Process narrow majors
            narrow_majors = []
            for narrow_major in general_major_data['NarrowMajorName'].unique():
                # print("narrow_major is ",narrow_major)
                # if pd.isna(narrow_major) or any(ignore in str(narrow_major) for ignore in IGNORE_VALUES):
                if pd.isna(narrow_major) or (str(narrow_major) in IGNORE_VALUES):
                    continue
                    
                # Filter data for this narrow major
                narrow_major_data = general_major_data[general_major_data['NarrowMajorName'] == narrow_major].copy()
                print(f"  Processing narrow major: {narrow_major}, rows: {len(narrow_major_data)}")
                
                # Get overall metrics for narrow major using filtered data
                narrow_major_job_seekers = next(
                    (item for item in general_major_job_seekers.get('byNarrowMajor', []) if item['narrowMajor'] == narrow_major),
                    {'totalJobSeekers': 0}
                )

                # if narrow_major_job_seekers:
                #     print("general_major_job_seekers", narrow_major_job_seekers)
                #     print("general_major name is ", narrow_major)
                
                narrow_major_overall = {
                    "totalMetrics": self.get_total_metrics(narrow_major_data, narrow_major_job_seekers),
                    "topMajorsInsights": self.get_employment_timing_insights(narrow_major_data, level='major'),
                    "topOccupationsInsights": self.get_top_occupations_insights(narrow_major_data, level='major')
                }
                
                narrow_majors.append({
                    "narrowMajor": narrow_major,
                    "overall": narrow_major_overall
                })
            
            general_majors.append({
                "generalMajor": general_major,
                "overall": general_major_overall,
                "byNarrowMajor": {
                    "narrowMajors": narrow_majors
                }
            })
            # break
        
        return {"generalMajors": general_majors}

    # Calculate all major insights
    def get_all_major_insights(self):
        print("Generating all major insights...")
        return {
            "totalMetrics": self.get_total_metrics(),
            "overall": {
                "basicMetrics": self.get_basic_metrics(level='general')
            },
            "byGeneralMajor": self.get_by_general_major()
        }
