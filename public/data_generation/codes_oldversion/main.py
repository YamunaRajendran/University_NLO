import pandas as pd
import json
from overview_insights import OverviewInsights
from education_insights import EducationInsights
from major_insights import MajorInsights
from compare_insights import CompareInsights

def main():
    df = pd.read_json(r"C:\Users\sanav\work\D2R\NLO\University\public\output\translated_full_data.json", orient="records", dtype='object')
    print("Data is loaded")
    # overview_insights = OverviewInsights(df).generate_overview_insights()
    # education_insights = EducationInsights(df).calculate_education_insights()
    major_insights = MajorInsights(df).get_all_major_insights()
    # compare_insights = CompareInsights(df).calculate_compare_chart_insights()
    

    output_file = r"C:\Users\sanav\work\D2R\NLO\University\public\output\major_insights.json"
    with open(output_file, "w", encoding='utf-8') as f:
        # json.dump({"OverViewInsights": overview_insights, "majorsInsights": majors_insights, "educationInsights": educationInsights, "compareChartInsights": compare_chart_insights}, f, indent=2, ensure_ascii=False)
        
        # json.dump({"OverViewInsights": overview_insights}, f, indent=2, ensure_ascii=False)
        json.dump({"majorsInsights": major_insights}, f, indent=2, ensure_ascii=False)
        # json.dump({"educationInsights": education_insights}, f, indent=2, ensure_ascii=False)
        # json.dump({"compareChartInsights": compare_insights}, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()