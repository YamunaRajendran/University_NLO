import pandas as pd
from typing import Dict

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

class CompareInsights:
    def __init__(self, df: pd.DataFrame):
        self.df = df
        
    def calculate_compare_chart_insights(self) -> Dict:
        """Calculate insights for comparison charts including graduate, employment and timing metrics"""
        return {
            "graduateMetrics": self._get_graduate_metrics(),
            "employmentMetrics": self._get_employment_metrics(),
            "timingMetrics": self._get_timing_metrics()
        }
    
    def _get_graduate_metrics(self):
        metrics = {
            "generalMajors": [],
            "narrowMajors": [],
            "majors": []
        }
        
        # Get all general majors
        general_majors = self.df.groupby('GeneralMajorName').agg({
            'IndicatorValue': lambda x: x[self.df['IndicatorDescription'].isin(GRADUATE_INDICATORS)].sum()
        }).reset_index()
        general_majors = general_majors.sort_values('IndicatorValue', ascending=False)
        
        for _, row in general_majors.iterrows():
            major = row['GeneralMajorName']
            if pd.isna(major):
                continue
                
            major_df = self.df[self.df['GeneralMajorName'] == major]
            
            total = major_df[major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
            male = major_df[
                (major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)) & 
                (major_df['Gender'] == 'Male')
            ]['IndicatorValue'].sum()
            female = major_df[
                (major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)) & 
                (major_df['Gender'] == 'Female')
            ]['IndicatorValue'].sum()
            
            if total > 0:  # Only include majors with graduates
                metrics["generalMajors"].append({
                    "name": major,
                    "totalGraduates": int(total),
                    "maleGraduates": int(male),
                    "femaleGraduates": int(female)
                })
        
        # Get all narrow majors
        narrow_majors = self.df.groupby('NarrowMajorName').agg({
            'IndicatorValue': lambda x: x[self.df['IndicatorDescription'].isin(GRADUATE_INDICATORS)].sum()
        }).reset_index()
        narrow_majors = narrow_majors.sort_values('IndicatorValue', ascending=False)
        
        for _, row in narrow_majors.iterrows():
            major = row['NarrowMajorName']
            if pd.isna(major):
                continue
                
            major_df = self.df[self.df['NarrowMajorName'] == major]
            
            total = major_df[major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
            male = major_df[
                (major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)) & 
                (major_df['Gender'] == 'Male')
            ]['IndicatorValue'].sum()
            female = major_df[
                (major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)) & 
                (major_df['Gender'] == 'Female')
            ]['IndicatorValue'].sum()
            
            if total > 0:  # Only include majors with graduates
                metrics["narrowMajors"].append({
                    "name": major,
                    "totalGraduates": int(total),
                    "maleGraduates": int(male),
                    "femaleGraduates": int(female)
                })
        
        # Get all major classifications
        majors = self.df.groupby('MajorNameByClassification').agg({
            'IndicatorValue': lambda x: x[self.df['IndicatorDescription'].isin(GRADUATE_INDICATORS)].sum()
        }).reset_index()
        majors = majors.sort_values('IndicatorValue', ascending=False)
        
        for _, row in majors.iterrows():
            major = row['MajorNameByClassification']
            if pd.isna(major):
                continue
                
            major_df = self.df[self.df['MajorNameByClassification'] == major]
            
            total = major_df[major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
            male = major_df[
                (major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)) & 
                (major_df['Gender'] == 'Male')
            ]['IndicatorValue'].sum()
            female = major_df[
                (major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)) & 
                (major_df['Gender'] == 'Female')
            ]['IndicatorValue'].sum()
            
            if total > 0:  # Only include majors with graduates
                metrics["majors"].append({
                    "name": major,
                    "totalGraduates": int(total),
                    "maleGraduates": int(male),
                    "femaleGraduates": int(female)
                })
        
        return metrics
    
    def _get_employment_metrics(self):
        metrics = {
            "generalMajors": [],
            "narrowMajors": [],
            "majors": []
        }
        
        # Get all general majors
        general_majors = self.df.groupby('GeneralMajorName').agg({
            'IndicatorValue': lambda x: x[self.df['IndicatorDescription'].isin(GRADUATE_INDICATORS)].sum()
        }).reset_index()
        general_majors = general_majors.sort_values('IndicatorValue', ascending=False)
        
        for _, row in general_majors.iterrows():
            major = row['GeneralMajorName']
            if pd.isna(major):
                continue
                
            major_df = self.df[self.df['GeneralMajorName'] == major]
            
            # Calculate employment rate
            total_graduates = major_df[major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
            employed = major_df[major_df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)]['IndicatorValue'].sum()
            
            if total_graduates > 0:  # Only include majors with graduates
                employment_rate = round((employed / total_graduates * 100) if total_graduates > 0 else 0)
                
                # Calculate average salary
                total_salary = major_df[
                    major_df['IndicatorDescription'] == 'Total salaries of employees after graduation'
                ]['IndicatorValue'].astype(float).sum()
                avg_salary = round(total_salary / employed) if employed > 0 else 0
                
                # Calculate average time to employment
                timing_df = major_df[major_df['IndicatorDescription'].isin([
                    'Number of graduates who are employed before graduation',
                    'Number of graduates who are employed after graduation'
                ])]
                
                before_grad = timing_df[timing_df['PeriodToEmployment'] == 'Before graduation']['IndicatorValue'].sum()
                within_year = timing_df[timing_df['PeriodToEmployment'] == 'Within a year']['IndicatorValue'].sum()
                after_year = timing_df[timing_df['PeriodToEmployment'] == 'More than a year']['IndicatorValue'].sum()
                
                total = before_grad + within_year + after_year
                if total > 0:
                    avg_time = round(
                        (before_grad * 0 + within_year * (365/2) + after_year * 365) / total
                    )
                else:
                    avg_time = 0
                
                metrics["generalMajors"].append({
                    "name": major,
                    "employmentRate": employment_rate,
                    "averageSalary": avg_salary,
                    "averageTimeToEmployment": avg_time
                })
        
        # Get all narrow majors
        narrow_majors = self.df.groupby('NarrowMajorName').agg({
            'IndicatorValue': lambda x: x[self.df['IndicatorDescription'].isin(GRADUATE_INDICATORS)].sum()
        }).reset_index()
        narrow_majors = narrow_majors.sort_values('IndicatorValue', ascending=False)
        
        for _, row in narrow_majors.iterrows():
            major = row['NarrowMajorName']
            if pd.isna(major):
                continue
                
            major_df = self.df[self.df['NarrowMajorName'] == major]
            
            # Calculate employment rate
            total_graduates = major_df[major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
            employed = major_df[major_df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)]['IndicatorValue'].sum()
            
            if total_graduates > 0:  # Only include majors with graduates
                employment_rate = round((employed / total_graduates * 100) if total_graduates > 0 else 0)
                
                # Calculate average salary
                total_salary = major_df[
                    major_df['IndicatorDescription'] == 'Total salaries of employees after graduation'
                ]['IndicatorValue'].astype(float).sum()
                avg_salary = round(total_salary / employed) if employed > 0 else 0
                
                # Calculate average time to employment
                timing_df = major_df[major_df['IndicatorDescription'].isin([
                    'Number of graduates who are employed before graduation',
                    'Number of graduates who are employed after graduation'
                ])]
                
                before_grad = timing_df[timing_df['PeriodToEmployment'] == 'Before graduation']['IndicatorValue'].sum()
                within_year = timing_df[timing_df['PeriodToEmployment'] == 'Within a year']['IndicatorValue'].sum()
                after_year = timing_df[timing_df['PeriodToEmployment'] == 'More than a year']['IndicatorValue'].sum()
                
                total = before_grad + within_year + after_year
                if total > 0:
                    avg_time = round(
                        (before_grad * 0 + within_year * (365/2) + after_year * 365) / total
                    )
                else:
                    avg_time = 0
                
                metrics["narrowMajors"].append({
                    "name": major,
                    "employmentRate": employment_rate,
                    "averageSalary": avg_salary,
                    "averageTimeToEmployment": avg_time
                })
        
        # Get all major classifications
        majors = self.df.groupby('MajorNameByClassification').agg({
            'IndicatorValue': lambda x: x[self.df['IndicatorDescription'].isin(GRADUATE_INDICATORS)].sum()
        }).reset_index()
        majors = majors.sort_values('IndicatorValue', ascending=False)
        
        for _, row in majors.iterrows():
            major = row['MajorNameByClassification']
            if pd.isna(major):
                continue
                
            major_df = self.df[self.df['MajorNameByClassification'] == major]
            
            # Calculate employment rate
            total_graduates = major_df[major_df['IndicatorDescription'].isin(GRADUATE_INDICATORS)]['IndicatorValue'].sum()
            employed = major_df[major_df['IndicatorDescription'].isin(EMPLOYMENT_INDICATORS)]['IndicatorValue'].sum()
            
            if total_graduates > 0:  # Only include majors with graduates
                employment_rate = round((employed / total_graduates * 100) if total_graduates > 0 else 0)
                
                # Calculate average salary
                total_salary = major_df[
                    major_df['IndicatorDescription'] == 'Total salaries of employees after graduation'
                ]['IndicatorValue'].astype(float).sum()
                avg_salary = round(total_salary / employed) if employed > 0 else 0
                
                # Calculate average time to employment
                timing_df = major_df[major_df['IndicatorDescription'].isin([
                    'Number of graduates who are employed before graduation',
                    'Number of graduates who are employed after graduation'
                ])]
                
                before_grad = timing_df[timing_df['PeriodToEmployment'] == 'Before graduation']['IndicatorValue'].sum()
                within_year = timing_df[timing_df['PeriodToEmployment'] == 'Within a year']['IndicatorValue'].sum()
                after_year = timing_df[timing_df['PeriodToEmployment'] == 'More than a year']['IndicatorValue'].sum()
                
                total = before_grad + within_year + after_year
                if total > 0:
                    avg_time = round(
                        (before_grad * 0 + within_year * (365/2) + after_year * 365) / total
                    )
                else:
                    avg_time = 0
                
                metrics["majors"].append({
                    "name": major,
                    "employmentRate": employment_rate,
                    "averageSalary": avg_salary,
                    "averageTimeToEmployment": avg_time
                })
        
        return metrics
    
    def _get_timing_metrics(self):
        metrics = {
            "generalMajors": [],
            "narrowMajors": [],
            "majors": []
        }
        
        # Get all general majors
        general_majors = self.df.groupby('GeneralMajorName').agg({
            'IndicatorValue': lambda x: x[self.df['IndicatorDescription'].isin(GRADUATE_INDICATORS)].sum()
        }).reset_index()
        general_majors = general_majors.sort_values('IndicatorValue', ascending=False)
        
        for _, row in general_majors.iterrows():
            major = row['GeneralMajorName']
            if pd.isna(major):
                continue
                
            major_df = self.df[self.df['GeneralMajorName'] == major]
            
            timing_df = major_df[major_df['IndicatorDescription'].isin([
                'Number of graduates who are employed before graduation',
                'Number of graduates who are employed after graduation'
            ])]
            
            before_grad = timing_df[timing_df['PeriodToEmployment'] == 'Before graduation']['IndicatorValue'].sum()
            within_year = timing_df[timing_df['PeriodToEmployment'] == 'Within a year']['IndicatorValue'].sum()
            after_year = timing_df[timing_df['PeriodToEmployment'] == 'More than a year']['IndicatorValue'].sum()
            
            total = before_grad + within_year + after_year
            if total > 0:  # Only include majors with employed graduates
                metrics["generalMajors"].append({
                    "name": major,
                    "beforeGraduation": round(before_grad / total * 100),
                    "withinYear": round(within_year / total * 100),
                    "afterYear": round(after_year / total * 100)
                })
        
        # Get all narrow majors
        narrow_majors = self.df.groupby('NarrowMajorName').agg({
            'IndicatorValue': lambda x: x[self.df['IndicatorDescription'].isin(GRADUATE_INDICATORS)].sum()
        }).reset_index()
        narrow_majors = narrow_majors.sort_values('IndicatorValue', ascending=False)
        
        for _, row in narrow_majors.iterrows():
            major = row['NarrowMajorName']
            if pd.isna(major):
                continue
                
            major_df = self.df[self.df['NarrowMajorName'] == major]
            
            timing_df = major_df[major_df['IndicatorDescription'].isin([
                'Number of graduates who are employed before graduation',
                'Number of graduates who are employed after graduation'
            ])]
            
            before_grad = timing_df[timing_df['PeriodToEmployment'] == 'Before graduation']['IndicatorValue'].sum()
            within_year = timing_df[timing_df['PeriodToEmployment'] == 'Within a year']['IndicatorValue'].sum()
            after_year = timing_df[timing_df['PeriodToEmployment'] == 'More than a year']['IndicatorValue'].sum()
            
            total = before_grad + within_year + after_year
            if total > 0:  # Only include majors with employed graduates
                metrics["narrowMajors"].append({
                    "name": major,
                    "beforeGraduation": round(before_grad / total * 100),
                    "withinYear": round(within_year / total * 100),
                    "afterYear": round(after_year / total * 100)
                })
        
        # Get all major classifications
        majors = self.df.groupby('MajorNameByClassification').agg({
            'IndicatorValue': lambda x: x[self.df['IndicatorDescription'].isin(GRADUATE_INDICATORS)].sum()
        }).reset_index()
        majors = majors.sort_values('IndicatorValue', ascending=False)
        
        for _, row in majors.iterrows():
            major = row['MajorNameByClassification']
            if pd.isna(major):
                continue
                
            major_df = self.df[self.df['MajorNameByClassification'] == major]
            
            timing_df = major_df[major_df['IndicatorDescription'].isin([
                'Number of graduates who are employed before graduation',
                'Number of graduates who are employed after graduation'
            ])]
            
            before_grad = timing_df[timing_df['PeriodToEmployment'] == 'Before graduation']['IndicatorValue'].sum()
            within_year = timing_df[timing_df['PeriodToEmployment'] == 'Within a year']['IndicatorValue'].sum()
            after_year = timing_df[timing_df['PeriodToEmployment'] == 'More than a year']['IndicatorValue'].sum()
            
            total = before_grad + within_year + after_year
            if total > 0:  # Only include majors with employed graduates
                metrics["majors"].append({
                    "name": major,
                    "beforeGraduation": round(before_grad / total * 100),
                    "withinYear": round(within_year / total * 100),
                    "afterYear": round(after_year / total * 100)
                })
        
        return metrics
