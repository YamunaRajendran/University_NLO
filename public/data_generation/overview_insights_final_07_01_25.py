import pandas as pd
import numpy as np
from typing import Dict, List, Any, Union
import json

def round_percentage(value: float) -> Union[int, float]:
    rounded = round(value, 1)
    return int(rounded) if float(rounded).is_integer() else rounded

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


class OverviewInsights:
    def __init__(self, df: pd.DataFrame):
        self.df = df
        
        # Pre-calculate common filters if DataFrame is not empty
        if not df.empty:
            # Cache common groupby operations if needed
            self.major_groups = self.df.groupby('GeneralMajorName')
            self.gender_groups = self.df.groupby(['GeneralMajorName', 'Gender'])
        else:
            self.major_groups = None
            self.gender_groups = None

    def calculate_gender_distribution(self) -> Dict:
        """Calculate overall gender distribution"""
        gender_counts = self.df[self.df['IndicatorDescription'].isin(GRADUATE_INDICATORS)].groupby('Gender')['IndicatorValue'].sum()
        total = gender_counts.sum()
        
        return {
            "male": {
                "count": int(gender_counts.get('Male', 0)),
                "percentage": round_percentage(gender_counts.get('Male', 0) / total * 100 if total > 0 else 0)
            },
            "female": {
                "count": int(gender_counts.get('Female', 0)),
                "percentage": round_percentage(gender_counts.get('Female', 0) / total * 100 if total > 0 else 0)
            }
        }


    def calculate_salary_ranges(self, df: pd.DataFrame) -> Dict:
        """Calculate salary distribution using NumPy binning"""
        import numpy as np

        # Get salary data
        salary_df = df[df['IndicatorDescription'] == 'Total salaries of employees after graduation']
        salary_values = pd.to_numeric(salary_df['IndicatorValue'], errors='coerce')
        
        # Define bin edges
        # bin_edges = [0, 2000, 2500, 3000, float('inf')]
        # bin_labels = ['0-2000', '2001-2500', '2501-3000', '3001+']
        bin_edges = [0, 5000, 10000, 15000, float('inf')]
        bin_labels = ['0-5000', '5001-10000', '10001-15000', '15001+']
        
        # Use numpy histogram to calculate the distribution
        hist, _ = np.histogram(salary_values, bins=bin_edges)
        total_count = len(salary_values)
        
        # Create the ranges dictionary with the same keys
        ranges = {}
        for i, label in enumerate(bin_labels):
            count = int(hist[i])
            percentage = round_percentage(count / total_count * 100 if total_count > 0 else 0)
            ranges[label] = {
                "count": count,
                "percentage": percentage
            }
        
        return ranges

    def calculate_salary_by_category(self, df: pd.DataFrame, category_column: str) -> List[Dict]:
        """Calculate salary distribution by category using NumPy binning"""
        import numpy as np
        
        # Define bin edges and labels
        # bin_edges = [0, 2000, 2500, 3000, float('inf')]
        # bin_labels = ['0-2000', '2001-2500', '2501-3000', '3001+']
        bin_edges = [0, 5000, 10000, 15000, float('inf')]
        bin_labels = ['0-5000', '5001-10000', '10001-15000', '15001+']
        
        result = []
        for category in df[category_column].unique():
            if pd.isna(category) or category == 0:
                continue
                
            category_df = df[df[category_column] == category]
            salary_df = category_df[category_df['IndicatorDescription'] == 'Total salaries of employees after graduation']
            salary_values = pd.to_numeric(salary_df['IndicatorValue'], errors='coerce')
            
            if len(salary_values) == 0:
                continue
            
            # Calculate histogram
            hist, _ = np.histogram(salary_values, bins=bin_edges)
            total_count = len(salary_values)
            
            # Calculate ranges
            ranges = {}
            for i, label in enumerate(bin_labels):
                count = int(hist[i])
                percentage = round_percentage(count / total_count * 100 if total_count > 0 else 0)
                ranges[label] = {
                    "count": count,
                    "percentage": percentage
                }
            
            # Calculate average salary
            average_salary = round(salary_values.mean(), 2) if len(salary_values) > 0 else 0
            
            result.append({
                "name": category,
                "ranges": ranges,
                "average": average_salary
            })
        
        # Sort by average salary and get top results
        return sorted(result, key=lambda x: x['average'], reverse=True)

    def get_salary_distribution(self) -> Dict:
        """Get overall salary distribution and distribution by categories"""
        return {
            "ranges": self.calculate_salary_ranges(self.df),
            "byGeneralMajor": self.calculate_salary_by_category(self.df, 'GeneralMajorName'),
            "byEducationLevel": self.calculate_salary_by_category(self.df, 'EducationLevel')
        }

    def calculate_employment_timing(self, filtered_df=None) -> Dict:
        """Calculate employment timing distribution"""
        df_to_use = filtered_df if filtered_df is not None else self.df
        timing_df = df_to_use[df_to_use['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)]
        
        total_employed = timing_df['IndicatorValue'].sum()
        
        pre_grad = timing_df[timing_df['PeriodToEmployment'] == 'Before graduation']['IndicatorValue'].sum()
        within_year = timing_df[timing_df['PeriodToEmployment'] == 'Within a year']['IndicatorValue'].sum()
        after_year = timing_df[timing_df['PeriodToEmployment'] == 'More than a year']['IndicatorValue'].sum()
        
        return {
            "preGraduation": {
                "count": int(pre_grad),
                "percentage": round_percentage(pre_grad / total_employed * 100 if total_employed > 0 else 0)
            },
            "withinYear": {
                "count": int(within_year),
                "percentage": round_percentage(within_year / total_employed * 100 if total_employed > 0 else 0)
            },
            "afterYear": {
                "count": int(after_year),
                "percentage": round_percentage(after_year / total_employed * 100 if total_employed > 0 else 0)
            }
        }

    def calculate_employment_by_major(self) -> List[Dict]:
        """Calculate employment timing by general major"""
        major_timing = []
        
        for major in self.df['GeneralMajorName'].unique():
            if pd.isna(major):
                continue
                
            major_df = self.df[self.df['GeneralMajorName'] == major]
            timing_dist = self.calculate_employment_timing(filtered_df=major_df)
            
            if sum(item['count'] for item in timing_dist.values()) > 0:
                major_timing.append({
                    "name": major,
                    **timing_dist
                })
        
        return sorted(major_timing, 
                     key=lambda x: x['preGraduation']['percentage'] + x['withinYear']['percentage'], 
                     reverse=True)[:5]

    def calculate_employment_by_education(self) -> List[Dict]:
        """Calculate employment timing by education level"""
        edu_timing = []
        
        for level in self.df['EducationLevel'].unique():
            if pd.isna(level):
                continue
                
            level_df = self.df[self.df['EducationLevel'] == level]
            timing_dist = self.calculate_employment_timing(filtered_df=level_df)
            
            if sum(item['count'] for item in timing_dist.values()) > 0:
                edu_timing.append({
                    "level": level,
                    **timing_dist
                })
        
        return sorted(edu_timing, 
                     key=lambda x: x['preGraduation']['percentage'] + x['withinYear']['percentage'], 
                     reverse=True)[:5]

    def calculate_top_general_majors(self) -> Dict:
        """Calculate top general majors by graduates, employment rate, average salary, and gender gap"""
        
        def get_graduates_by_major():
            major_data = []
            for major in self.df['GeneralMajorName'].unique():
                major_df = self.df[
                    (self.df['GeneralMajorName'] == major) & 
                    (self.df['IndicatorDescription'].isin(GRADUATE_INDICATORS))
                ]
                
                if major_df.empty:
                    continue
                    
                total = major_df['IndicatorValue'].sum()
                male_count = major_df[major_df['Gender'] == 'Male']['IndicatorValue'].sum()
                female_count = major_df[major_df['Gender'] == 'Female']['IndicatorValue'].sum()
                
                if total > 0:
                    major_data.append({
                        "generalMajor": major,
                        "value": int(total),
                        "male": {
                            "count": int(male_count),
                            "percentage": round_percentage(male_count / total * 100)
                        },
                        "female": {
                            "count": int(female_count),
                            "percentage": round_percentage(female_count / total * 100)
                        }
                    })
            
            return sorted(major_data, key=lambda x: x['value'], reverse=True)[:5]
        
        def get_employment_rate_by_major():
            major_data = []
            for major in self.df['GeneralMajorName'].unique():
                major_df = self.df[self.df['GeneralMajorName'] == major]
                
                total_students = major_df[
                    major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)
                ]['IndicatorValue'].sum()
                
                employed_students = major_df[
                    major_df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)
                ]['IndicatorValue'].sum()
                
                if total_students > 0:
                    major_data.append({
                        "generalMajor": major,
                        "value": round_percentage(employed_students / total_students * 100),
                        "totalStudents": int(total_students),
                        "employedStudents": int(employed_students)
                    })
            
            return sorted(major_data, key=lambda x: x['value'], reverse=True)[:5]
        
        def get_salary_by_major():
            major_data = []
            for major in self.df['GeneralMajorName'].unique():
                major_df = self.df[self.df['GeneralMajorName'] == major]
                
                total_salary = major_df[
                    major_df['IndicatorDescription'] == 'Total salaries of employees after graduation'
                ]['IndicatorValue'].astype(float).sum()
                
                # employed_count = major_df[
                #     major_df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)
                # ]['IndicatorValue'].sum()
                employed_count = self.df[self.df['IndicatorDescription'] == 'Number of graduates with salary who are employed after graduation']['IndicatorValue'].sum()
                
                if employed_count > 0:
                    avg_salary = total_salary / employed_count
                    major_data.append({
                        "generalMajor": major,
                        "value": round(avg_salary, 2)
                    })
            
            return sorted(major_data, key=lambda x: x['value'], reverse=True)[:5]
        
        def get_gender_gap_by_major():
            major_data = []
            for major in self.df['GeneralMajorName'].unique():
                major_df = self.df[
                    (self.df['GeneralMajorName'] == major) & 
                    (self.df['IndicatorDescription'].isin(GRADUATE_INDICATORS))
                ]
                
                total = major_df['IndicatorValue'].sum()
                male_count = major_df[major_df['Gender'] == 'Male']['IndicatorValue'].sum()
                female_count = major_df[major_df['Gender'] == 'Female']['IndicatorValue'].sum()
                
                if total > 0:
                    male_pct = round_percentage(male_count / total * 100)
                    female_pct = round_percentage(female_count / total * 100)
                    gender_gap = round_percentage(male_pct - female_pct)
                    
                    major_data.append({
                        "generalMajor": major,
                        "malePercentage": male_pct,
                        "femalePercentage": female_pct,
                        "genderGap": gender_gap
                    })
            
            return sorted(major_data, key=lambda x: abs(x['genderGap']), reverse=True)[:5]
        
        return {
            "byGraduates": {
                "rankings": get_graduates_by_major()
            },
            "byEmploymentRate": {
                "rankings": get_employment_rate_by_major()
            },
            "byAverageSalary": {
                "rankings": get_salary_by_major()
            },
            "byGenderGap": {
                "rankings": get_gender_gap_by_major()
            }
        }

    def calculate_isco_occupations(self) -> Dict:
        """Calculate ISCO occupations metrics"""
        
        def get_graduates_by_occupation():
            occupation_data = []
            for occupation in self.df['ISCOOccupationDescription'].unique():
                if pd.isna(occupation):
                    continue
                    
                occupation_df = self.df[self.df['ISCOOccupationDescription'] == occupation]
                total = occupation_df[occupation_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
                
                if total > 0:
                #     # Get top majors for this occupation
                #     major_counts = []
                #     for major in occupation_df['MajorNameByClassification'].unique():
                #         if pd.isna(major):
                #             continue
                #         major_count = occupation_df[
                #             (occupation_df['MajorNameByClassification'] == major) & 
                #             (occupation_df['IndicatorDescription'].isin(GRADUATE_INDICATORS))
                #         ]['IndicatorValue'].sum()
                #         if major_count > 0:
                #             major_counts.append({"major": major, "count": int(major_count)})
                    
                #     major_counts = sorted(major_counts, key=lambda x: x['count'], reverse=True)[:5]
                    
                    occupation_data.append({
                        "occupation": occupation,
                        "value": int(total),
                        # "topMajors": major_counts
                    })
            
            return sorted(occupation_data, key=lambda x: x['value'], reverse=True)[:5]
        
        def get_salary_by_occupation():
            occupation_data = []
            for occupation in self.df['ISCOOccupationDescription'].unique():
                if pd.isna(occupation):
                    continue
                    
                occupation_df = self.df[self.df['ISCOOccupationDescription'] == occupation]
                
                total_salary = occupation_df[
                    occupation_df['IndicatorDescription'] == 'Total salaries of employees after graduation'
                ]['IndicatorValue'].astype(float).sum()
                
                # employed_count = occupation_df[
                #     occupation_df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)
                # ]['IndicatorValue'].sum()
                employed_count = self.df[self.df['IndicatorDescription'] == 'Number of graduates with salary who are employed after graduation']['IndicatorValue'].sum()
                
                if employed_count > 0:
                    avg_salary = total_salary / employed_count
                    
                    # # Get top majors by average salary
                    # major_salaries = []
                    # for major in occupation_df['MajorNameByClassification'].unique():
                    #     if pd.isna(major):
                    #         continue
                    #     major_df = occupation_df[occupation_df['MajorNameByClassification'] == major]
                    #     major_total_salary = major_df[
                    #         major_df['IndicatorDescription'] == 'Total salaries of employees after graduation'
                    #     ]['IndicatorValue'].astype(float).sum()
                    #     # major_employed = major_df[
                    #     #     major_df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)
                    #     # ]['IndicatorValue'].sum()
                    #     major_employed = self.df[self.df['IndicatorDescription'] == 'Number of graduates with salary who are employed after graduation']['IndicatorValue'].sum()
                        
                    #     if major_employed > 0:
                    #         major_avg_salary = major_total_salary / major_employed
                    #         major_salaries.append({
                    #             "major": major,
                    #             "averageSalary": round(major_avg_salary, 2)
                    #         })
                    
                    # major_salaries = sorted(major_salaries, key=lambda x: x['averageSalary'], reverse=True)[:5]
                    
                    occupation_data.append({
                        "occupation": occupation,
                        "value": round(avg_salary, 2),
                        # "topMajors": major_salaries
                    })
            
            return sorted(occupation_data, key=lambda x: x['value'], reverse=True)[:5]
        
        def get_gender_gap_by_occupation():
            occupation_data = []
            for occupation in self.df['ISCOOccupationDescription'].unique():
                if pd.isna(occupation):
                    continue
                    
                occupation_df = self.df[
                    (self.df['ISCOOccupationDescription'] == occupation) & 
                    (self.df['IndicatorDescription'].isin(GRADUATE_INDICATORS))
                ]
                
                total = occupation_df['IndicatorValue'].sum()
                male_count = occupation_df[occupation_df['Gender'] == 'Male']['IndicatorValue'].sum()
                female_count = occupation_df[occupation_df['Gender'] == 'Female']['IndicatorValue'].sum()
                
                if total > 0:
                    male_pct = round_percentage(male_count / total * 100)
                    female_pct = round_percentage(female_count / total * 100)
                    gender_gap = round_percentage(male_pct - female_pct)
                    
                    # Get top majors by gender gap
                    # major_gaps = []
                    # for major in occupation_df['MajorNameByClassification'].unique():
                    #     if pd.isna(major):
                    #         continue
                    #     major_df = occupation_df[occupation_df['MajorNameByClassification'] == major]
                    #     major_total = major_df['IndicatorValue'].sum()
                    #     major_male = major_df[major_df['Gender'] == 'Male']['IndicatorValue'].sum()
                    #     major_female = major_df[major_df['Gender'] == 'Female']['IndicatorValue'].sum()
                        
                    #     if major_total > 0:
                    #         major_male_pct = round_percentage(major_male / major_total * 100)
                    #         major_female_pct = round_percentage(major_female / major_total * 100)
                    #         major_gap = round_percentage(major_male_pct - major_female_pct)
                    #         major_gaps.append({
                    #             "major": major,
                    #             "malePercentage": major_male_pct,
                    #             "femalePercentage": major_female_pct,
                    #             "genderGap": major_gap
                    #         })
                    
                    # major_gaps = sorted(major_gaps, key=lambda x: abs(x['genderGap']), reverse=True)[:5]
                    
                    occupation_data.append({
                        "occupation": occupation,
                        "malePercentage": male_pct,
                        "femalePercentage": female_pct,
                        "genderGap": gender_gap,
                        # "topMajors": major_gaps
                    })

            
            # by_gender_gap = sorted(
            #     occupation_data, 
            #     key=lambda x: x['genderGap'] if x['genderGap'] is not None else 0,
            #     reverse=True
            # )[:5]
            
            # return by_gender_gap

            
            # Sort and select diverse gender gaps
            sorted_data = sorted(occupation_data, key=lambda x: x['genderGap'] if x['genderGap'] is not None else 0, reverse=True)
            
            result = []
            seen_gaps = set()
            
            # Get highest positive gap (if exists)
            for item in sorted_data:
                if item['genderGap'] not in seen_gaps:
                    result.append(item)
                    seen_gaps.add(item['genderGap'])
                    break
            
            # Get highest negative gap (if exists)
            for item in reversed(sorted_data):
                if item['genderGap'] not in seen_gaps and item['genderGap'] < 0:
                    result.append(item)
                    seen_gaps.add(item['genderGap'])
                    break
            
            # Get middle range gaps
            for item in sorted_data:
                if len(result) >= 5:  # Stop if we already have 5 items
                    break
                if (item['genderGap'] not in seen_gaps and 
                    abs(item['genderGap']) < 100):  # Only include gaps less than 100%
                    result.append(item)
                    seen_gaps.add(item['genderGap'])
            
            return result
        
        return {
            "byGraduates": {
                "rankings": get_graduates_by_occupation()
            },
            "byAverageSalary": {
                "rankings": get_salary_by_occupation()
            },
            "byGenderGap": {
                "rankings": get_gender_gap_by_occupation()
            }
        }

    def generate_overview_insights(self) -> Dict:
        """Generate complete overview insights structure"""
        # Calculate total graduates by summing all graduate indicators
        total_graduates = self.df[self.df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
        
        # Calculate employment rate using all employment indicators
        total_employed = self.df[self.df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)]['IndicatorValue'].sum()
        employment_rate = round_percentage(total_employed / total_graduates * 100 if total_graduates > 0 else 0)
        
        # Calculate average salary
        total_salary = self.df[
            self.df['IndicatorDescription'] == 'Total salaries of employees after graduation'
        ]['IndicatorValue'].astype(float).sum()
        employed_after_graduation = self.df[self.df['IndicatorDescription'] == 'Number of graduates with salary who are employed after graduation']['IndicatorValue'].sum()
        
        avg_salary = round(total_salary / employed_after_graduation) if employed_after_graduation > 0 else 0
        
        # Calculate average time to employment
        time_to_employment = self.df[self.df['IndicatorDescription'] == 'Total number of days until the first job']['IndicatorValue'].mean()
        
        overview_insights = {
            "summaryCards": {
                "totalGraduates": int(total_graduates),
                "overallEmploymentRate": employment_rate,
                "averageSalary": avg_salary,
                "averageTimeToEmployment": round(time_to_employment if not pd.isna(time_to_employment) else 0)
            },
            "topGeneralMajors": self.calculate_top_general_majors(),
            "genderDistribution": self.calculate_gender_distribution(),
            "salaryDistribution": self.get_salary_distribution(),
            "employmentTiming": {
                **self.calculate_employment_timing(),
                "byGeneralMajor": self.calculate_employment_by_major(),
                "byEducationLevel": self.calculate_employment_by_education()
            },
            "topISCOOccupations": self.calculate_isco_occupations()
        }
        
        return overview_insights
