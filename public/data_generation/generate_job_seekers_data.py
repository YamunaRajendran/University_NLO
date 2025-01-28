import pandas as pd
import json

def translate_data(df):
    # Read translation mappings
    excel_data = pd.read_excel(r"C:\Users\sanav\work\D2R\NLO\University\public\data\reflected.xlsx", sheet_name=None)
    translated_results = {}
    
    for sheet_name, sheet_data in excel_data.items():
        translated_results[sheet_name] = {
            str(key).strip(): str(value).strip() if isinstance(value, str) else value
            for key, value in zip(sheet_data.iloc[:, 0], sheet_data.iloc[:, 1])
        }
    
    # Create a copy of the dataframe for translation
    translated_df = df.copy()
    
    # Apply translations
    for column, translation_dict in translated_results.items():
        if column in translated_df.columns:
            if translated_df[column].dtype == 'object':
                translated_df[column] = translated_df[column].str.strip()
            translated_df[column] = translated_df[column].map(translation_dict).fillna(translated_df[column])
    
    return translated_df

def get_job_seekers_data(df, is_english=False):
    result = {
        "totalJobSeekers": int(df[df['IndicatorDescription'] == 'Number of Job Seekers']['IndicatorValue'].sum()),
        "byGeneralMajor": []
    }
    
    # Process by General Major
    for general_major in df['GeneralMajorName'].unique():
        if pd.isna(general_major):
            continue
            
        general_major_df = df[df['GeneralMajorName'] == general_major]
        general_major_data = {
            "generalMajor": str(general_major).strip(),
            "totalJobSeekers": int(general_major_df[general_major_df['IndicatorDescription'] == 'Number of Job Seekers']['IndicatorValue'].sum()),
            "byNarrowMajor": []
        }
        
        # Process by Narrow Major within each General Major
        for narrow_major in general_major_df['NarrowMajorName'].unique():
            if pd.isna(narrow_major):
                continue
                
            narrow_major_df = general_major_df[general_major_df['NarrowMajorName'] == narrow_major]
            narrow_major_data = {
                "narrowMajor": str(narrow_major).strip(),
                "totalJobSeekers": int(narrow_major_df[narrow_major_df['IndicatorDescription'] == 'Number of Job Seekers']['IndicatorValue'].sum())
            }
            
            general_major_data["byNarrowMajor"].append(narrow_major_data)
        
        # Sort narrow majors by total job seekers
        general_major_data["byNarrowMajor"].sort(key=lambda x: x["totalJobSeekers"], reverse=True)
        result["byGeneralMajor"].append(general_major_data)
    
    # Sort general majors by total job seekers
    result["byGeneralMajor"].sort(key=lambda x: x["totalJobSeekers"], reverse=True)
    return result

def main():
    # Read the original Arabic data
    data = pd.read_excel(
        r"C:\Users\sanav\work\D2R\NLO\University\public\data\UNI-IND-2022-Jadarat.xlsx",
        dtype="object",
    )
    data.dropna(inplace=True)

    # Select required columns
    data = data[
        [
            "IndicatorDescription",
            "IndicatorValue",
            "Nationality",
            "Gender",
            "Graduation Year",
            "EducationLevel",
            "GeneralMajorName",
            "NarrowMajorName",
            "MajorNameByClassification",
            "ISCOOccupationDescription",
            "PeriodToEmployment",
        ]
    ]
    
    # Filter for Saudi nationals
    data = data[data['Nationality'] == 'سعودي']
    data.reset_index(inplace=True, drop=True)
    
    # Convert IndicatorValue to numeric
    # data['EducationLevel'] = data['EducationLevel'].str.strip()
    # data['GeneralMajorName'] = data['EducationLevel'].str.strip()
    # data['NarrowMajorName'] = data['EducationLevel'].str.strip()
    data['IndicatorValue'] = pd.to_numeric(data['IndicatorValue'], errors='coerce')
    # data.reset_index(inplace=True, drop=True)

    # Get Arabic version
    arabic_data = get_job_seekers_data(data, is_english=False)
    
    # Translate data to English
    english_data = data.copy()
    english_data = translate_data(english_data)
    
    # Get English version
    english_result = get_job_seekers_data(english_data, is_english=True)
    
    # Combine both versions
    final_result = {
        "english": english_result,
        "arabic": arabic_data
    }
    
    # Save to JSON file
    output_file = r"C:\Users\sanav\work\D2R\NLO\University\public\output\job_seekers_data.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(final_result, f, ensure_ascii=False, indent=2)
    
    print(f"Data has been saved to {output_file}")

if __name__ == "__main__":
    main()
