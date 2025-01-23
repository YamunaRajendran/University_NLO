import pandas as pd
import numpy as np
from typing import Dict, List, Any

class EducationInsights:
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

    def __init__(self, df: pd.DataFrame):
        """Initialize with the dataframe containing education data"""
        self.df = df

    def get_total_metrics(self) -> Dict:
        """Calculate total metrics across all education levels"""
        # Total graduates
        total_graduates = self.df[
            self.df['IndicatorDescription'].isin(self.GRADUATE_INDICATORS)
        ]['IndicatorValue'].sum()
        
        # Employment rate
        total_employed = self.df[
            self.df['IndicatorDescription'].isin(self.EMPLOYMENT_INDICATORS)
        ]['IndicatorValue'].sum()
        employment_rate = round((total_employed / total_graduates * 100), 1) if total_graduates > 0 else 0
        
        # Average salary
        total_salary = self.df[
            self.df['IndicatorDescription'] == 'Total salaries of employees after graduation'
        ]['IndicatorValue'].astype(float).sum()
        average_salary = round(total_salary / total_employed) if total_employed > 0 else 0
        
        # Time to employment calculation
        before_grad = self.df[
            (self.df['PeriodToEmployment'] == 'Before graduation') &
            (self.df['IndicatorDescription'].isin(self.EMPLOYMENT_INDICATORS))
        ]['IndicatorValue'].sum()
        
        within_year = self.df[
            (self.df['PeriodToEmployment'] == 'Within a year') &
            (self.df['IndicatorDescription'].isin([
                'Number of graduates who are employed before graduation',
                'Number of graduates who are employed after graduation'
            ]))
        ]['IndicatorValue'].sum()
        
        after_year = self.df[
            (self.df['PeriodToEmployment'] == 'More than a year') &
            (self.df['IndicatorDescription'].isin([
                'Number of graduates who are employed before graduation',
                'Number of graduates who are employed after graduation'
            ]))
        ]['IndicatorValue'].sum()
        
        total = before_grad + within_year + after_year
        if total > 0:
            before_grad_pct = before_grad / total
            within_year_pct = within_year / total
            after_year_pct = after_year / total
            
            # Calculate average time (in days)
            time_to_employment = round(
                before_grad_pct * 0 +  # Before graduation
                within_year_pct * (365/2) +  # Average of 6 months for within first year
                after_year_pct * 365  # 12 months for after first year
            )
        else:
            time_to_employment = 0
        
        return {
            "graduates": int(total_graduates),
            "graduatesPercentage": 100.0,  # Since this is total, it's 100%
            "employmentRate": employment_rate,
            "averageSalary": average_salary,
            "timeToEmployment": time_to_employment
        }
    
    def get_basic_metrics(self) -> List[Dict]:
        """Calculate basic metrics for each education level"""
        metrics = []
        for level in self.df['EducationLevel'].unique():
            if pd.isna(level):
                continue
                
            level_df = self.df[self.df['EducationLevel'] == level]
            
            # Calculate total graduates
            total_graduates = level_df[
                level_df['IndicatorDescription'].isin(self.GRADUATE_INDICATORS)
            ]['IndicatorValue'].sum()
            
            # Calculate total graduates percentage
            all_graduates = self.df[
                self.df['IndicatorDescription'].isin(self.GRADUATE_INDICATORS)
            ]['IndicatorValue'].sum()
            graduates_percentage = round((total_graduates / all_graduates * 100), 1) if all_graduates > 0 else 0
            
            # Calculate employment rate
            employed_count = level_df[
                level_df['IndicatorDescription'].isin(self.EMPLOYMENT_INDICATORS)
            ]['IndicatorValue'].sum()
            employment_rate = round((employed_count / total_graduates * 100), 1) if total_graduates > 0 else 0
            
            # Calculate average salary
            total_salary = level_df[
                level_df['IndicatorDescription'] == 'Total salaries of employees after graduation'
            ]['IndicatorValue'].astype(float).sum()
            average_salary = round(total_salary / employed_count) if employed_count > 0 else 0
            
            # Calculate average time to employment
            timing_df = level_df[level_df['IndicatorDescription'].isin([
                'Number of graduates who are employed before graduation',
                'Number of graduates who are employed after graduation'
            ])]
            
            before_grad = timing_df[timing_df['PeriodToEmployment'] == 'Before graduation']['IndicatorValue'].sum()
            within_year = timing_df[timing_df['PeriodToEmployment'] == 'Within a year']['IndicatorValue'].sum()
            after_year = timing_df[timing_df['PeriodToEmployment'] == 'More than a year']['IndicatorValue'].sum()
            
            total_employed = before_grad + within_year + after_year
            if total_employed > 0:
                avg_time = round(
                    (before_grad * 0 + within_year * (365/2) + after_year * 365) / total_employed
                )
            else:
                avg_time = 0
            
            metrics.append({
                "educationLevel": level,
                "graduates": int(total_graduates),
                "graduatesPercentage": graduates_percentage,
                "employmentRate": employment_rate,
                "averageSalary": average_salary,
                "timeToEmployment": avg_time
            })
        
        return sorted(metrics, key=lambda x: x['graduates'], reverse=True)
    
    def get_top_education_insights(self) -> Dict:
        """Get top insights for education levels"""
        basic_metrics = self.get_basic_metrics()
        
        # Most popular - already sorted by graduates
        most_popular = [{
            "educationLevel": m["educationLevel"],
            "graduates": m["graduates"],
            "percentage": m["graduatesPercentage"]
        } for m in basic_metrics][:5]  # Only top 5
        
        # Most employable
        most_employable = sorted([{
            "educationLevel": m["educationLevel"],
            "employmentRate": m["employmentRate"],
            "graduates": m["graduates"]
        } for m in basic_metrics], key=lambda x: x['employmentRate'], reverse=True)[:5]  # Only top 5
        
        # Highest paying
        highest_paying = sorted([{
            "educationLevel": m["educationLevel"],
            "averageSalary": m["averageSalary"],
            "graduates": m["graduates"]
        } for m in basic_metrics], key=lambda x: x['averageSalary'], reverse=True)[:5]  # Only top 5
        
        return {
            "mostPopular": most_popular,
            "mostEmployable": most_employable,
            "highestPaying": highest_paying,
            "topOccupationsByGender": self.get_top_occupations_by_gender()
        }
    
    def get_gender_gap_rankings(self) -> Dict:
        """Calculate gender gap rankings for education levels"""
        gender_gaps = []
        for level in self.df['EducationLevel'].unique():
            if pd.isna(level):
                continue
                
            level_df = self.df[
                (self.df['EducationLevel'] == level) & 
                (self.df['IndicatorDescription'].isin(self.GRADUATE_INDICATORS))
            ]
            
            total = level_df['IndicatorValue'].sum()
            male_count = level_df[level_df['Gender'] == 'Male']['IndicatorValue'].sum()
            female_count = level_df[level_df['Gender'] == 'Female']['IndicatorValue'].sum()
            
            if total > 0:
                male_pct = round(male_count / total * 100, 1)
                female_pct = round(female_count / total * 100, 1)
                gender_gap = round(male_pct - female_pct, 1)
                
                gender_gaps.append({
                    "educationLevel": level,
                    "malePercentage": male_pct,
                    "femalePercentage": female_pct,
                    "genderGap": gender_gap,
                    "graduates": int(total)
                })
        
        return {
            "rankings": sorted(gender_gaps, key=lambda x: abs(x['genderGap']), reverse=True)[:5]  # Only top 5
        }
    
    def get_salary_distribution(self) -> List[Dict]:
        """Calculate salary distribution across education levels"""
        salary_dist = []
        all_graduates = self.df[
            self.df['IndicatorDescription'].isin(self.GRADUATE_INDICATORS)
        ]['IndicatorValue'].sum()
        
        for level in self.df['EducationLevel'].unique():
            if pd.isna(level):
                continue
                
            level_df = self.df[self.df['EducationLevel'] == level]
            
            total_graduates = level_df[
                level_df['IndicatorDescription'].isin(self.GRADUATE_INDICATORS)
            ]['IndicatorValue'].sum()
            
            total_salary = level_df[
                level_df['IndicatorDescription'] == 'Total salaries of employees after graduation'
            ]['IndicatorValue'].astype(float).sum()
            
            employed_count = level_df[
                level_df['IndicatorDescription'].isin(self.EMPLOYMENT_INDICATORS)
            ]['IndicatorValue'].sum()
            
            if employed_count > 0:
                average_salary = round(total_salary / employed_count)
                median_salary = round(average_salary * 0.95)  # Estimated median
                percentage = round((total_graduates / all_graduates * 100), 1) if all_graduates > 0 else 0
                
                salary_dist.append({
                    "educationLevel": level,
                    "salary": average_salary,
                    "percentage": percentage,
                    "median": median_salary
                })
        
        return sorted(salary_dist, key=lambda x: x['salary'], reverse=True)[:5]  # Only top 5
    
    def get_employment_timing(self) -> List[Dict]:
        """Calculate employment timing metrics for education levels"""
        timing_data = []
        
        for level in self.df['EducationLevel'].unique():
            if pd.isna(level):
                continue
                
            level_df = self.df[self.df['EducationLevel'] == level]
            
            # Before graduation
            before_grad = level_df[
                (level_df['PeriodToEmployment'] == 'Before graduation') &
                (level_df['IndicatorDescription'].isin(self.EMPLOYMENT_INDICATORS))
            ]['IndicatorValue'].sum()
            
            # Within first year
            within_year = level_df[
                (level_df['PeriodToEmployment'] == 'Within a year') &
                (level_df['IndicatorDescription'].isin([
                    'Number of graduates who are employed before graduation',
                    'Number of graduates who are employed after graduation'
                ]))
            ]['IndicatorValue'].sum()
            
            # After first year
            after_year = level_df[
                (level_df['PeriodToEmployment'] == 'More than a year') &
                (level_df['IndicatorDescription'].isin([
                    'Number of graduates who are employed before graduation',
                    'Number of graduates who are employed after graduation'
                ]))
            ]['IndicatorValue'].sum()
            
            total = before_grad + within_year + after_year
            
            if total > 0:
                timing_data.append({
                    "educationLevel": level,
                    "beforeGraduation": {
                        "count": int(before_grad),
                        "percentage": round(before_grad / total * 100)
                    },
                    "withinYear": {
                        "count": int(within_year),
                        "percentage": round(within_year / total * 100)
                    },
                    "afterYear": {
                        "count": int(after_year),
                        "percentage": round(after_year / total * 100)
                    }
                })
        
        # Sort by total employed graduates
        sorted_timing = sorted(timing_data, key=lambda x: sum([
            x["beforeGraduation"]["count"],
            x["withinYear"]["count"],
            x["afterYear"]["count"]
        ]), reverse=True)
        return sorted_timing[:5]  # Only top 5
    
    def get_employment_timeline(self) -> List[Dict]:
        """Calculate employment timeline metrics for education levels"""
        timeline_data = []
        
        for level in self.df['EducationLevel'].unique():
            if pd.isna(level):
                continue
                
            level_df = self.df[self.df['EducationLevel'] == level]
            
            # Calculate employment periods based on actual data
            before_grad = level_df[
                (level_df['PeriodToEmployment'] == 'Before graduation') &
                (level_df['IndicatorDescription'].isin(self.EMPLOYMENT_INDICATORS))
            ]['IndicatorValue'].sum()
            
            within_year = level_df[
                (level_df['PeriodToEmployment'] == 'Within a year') &
                (level_df['IndicatorDescription'].isin([
                    'Number of graduates who are employed before graduation',
                    'Number of graduates who are employed after graduation'
                ]))
            ]['IndicatorValue'].sum()
            
            after_year = level_df[
                (level_df['PeriodToEmployment'] == 'More than a year') &
                (level_df['IndicatorDescription'].isin([
                    'Number of graduates who are employed before graduation',
                    'Number of graduates who are employed after graduation'
                ]))
            ]['IndicatorValue'].sum()
            
            total = before_grad + within_year + after_year
            
            if total > 0:
                # Calculate percentages
                before_grad_pct = before_grad / total
                within_year_pct = within_year / total
                after_year_pct = after_year / total
                
                # Calculate average time (in days) based on employment periods
                avg_time = (
                    before_grad_pct * 0 +  # Before graduation
                    within_year_pct * (365/2) +  # Average of 6 months for within first year
                    after_year_pct * 365  # 12 months for after first year
                )
                
                # Calculate quick employment rate (employed within 3 months)
                quick_employment = before_grad + (within_year * 0.4)  # Assuming 40% of within_year are employed in first 3 months
                quick_rate = round((quick_employment / total) * 100)
                
                # Calculate waiting periods based on employment timing
                waiting_periods = {
                    "beforeGraduation": {
                        "count": int(before_grad),
                        "percentage": round(before_grad / total * 100)
                    },
                    "withinYear": {
                        "count": int(within_year),
                        "percentage": round(within_year / total * 100)
                    },
                    "afterYear": {
                        "count": int(after_year),
                        "percentage": round(after_year / total * 100)
                    }
                }
                
                timeline_data.append({
                    "educationLevel": level,
                    "averageTime": round(avg_time),
                    "quickEmploymentRate": quick_rate,
                    "waitingPeriods": waiting_periods
                })
        
        # Sort by quick employment rate
        sorted_timeline = sorted(timeline_data, key=lambda x: x['quickEmploymentRate'], reverse=True)
        return sorted_timeline[:5]  # Only top 5
    
    def get_top_occupations_by_gender(self) -> Dict:
        """Calculate top occupations for each gender"""
        gender_occupations = {"male": [], "female": []}
        
        for gender in ['Male', 'Female']:
            gender_df = self.df[
                (self.df['Gender'] == gender) &
                (self.df['IndicatorDescription'].isin(self.EMPLOYMENT_INDICATORS))
            ]
            
            # Group by occupation and calculate metrics
            occupation_metrics = []
            for occupation in gender_df['ISCOOccupationDescription'].unique():
                if pd.isna(occupation) or occupation == 0:  # Skip invalid occupations
                    continue
                    
                occ_df = gender_df[gender_df['ISCOOccupationDescription'] == occupation]
                
                # Calculate total employed
                employed_count = occ_df['IndicatorValue'].sum()
                
                # Calculate average salary
                salary_df = self.df[
                    (self.df['Gender'] == gender) &
                    (self.df['ISCOOccupationDescription'] == occupation) &
                    (self.df['IndicatorDescription'] == 'Total salaries of employees after graduation')
                ]
                total_salary = salary_df['IndicatorValue'].astype(float).sum()
                avg_salary = round(total_salary / employed_count) if employed_count > 0 else 0
                
                occupation_metrics.append({
                    "occupation": occupation,
                    "count": int(employed_count),
                    "averageSalary": avg_salary
                })
            
            # Sort by count and get top 5
            sorted_metrics = sorted(occupation_metrics, key=lambda x: x['count'], reverse=True)[:5]
            gender_occupations[gender.lower()] = sorted_metrics
        
        return gender_occupations

    def calculate_education_insights(self) -> Dict[str, Any]:
        """Generate comprehensive education insights"""
        return {
            "totalMetrics": self.get_total_metrics(),
            "overall": {
                "basicMetrics": self.get_basic_metrics(),
                "topInsights": self.get_top_education_insights(),
                "genderGap": self.get_gender_gap_rankings(),
                "salaryDistribution": self.get_salary_distribution(),
                "employmentTiming": self.get_employment_timing(),
                "employmentTimeline": self.get_employment_timeline()
            }
        }
