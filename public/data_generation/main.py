import pandas as pd
import json
import argparse
from major_insights import MajorInsights
import os

def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Generate major insights with language support')
    parser.add_argument('--language', type=str, choices=['english', 'arabic'], default='english',
                       help='Language for the output (english or arabic)')
    args = parser.parse_args()

    # Set file paths based on language
    input_file = 'translated_full_data.json' if args.language == 'english' else 'translated_full_data_arabic.json'
    input_path = os.path.join('public', 'output', input_file)
    output_path = os.path.join('public', 'output', f'major_insights_{args.language}.json')
    job_seekers_path = os.path.join('public', 'output', 'job_seekers_data.json')

    # Read the main data
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    df = pd.DataFrame(data)

    # Read job seekers data
    with open(job_seekers_path, 'r', encoding='utf-8') as f:
        job_seekers_data = json.load(f)
        # Select data based on language
        job_seekers = job_seekers_data[args.language]
        # print(job_seekers)

    # Initialize MajorInsights with both dataframe and job seekers data
    insights = MajorInsights(df, language=args.language, job_seekers=job_seekers).get_all_major_insights()

    # Save results
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(insights, f, ensure_ascii=False, indent=2)
    
    print(f'Successfully generated insights in {args.language}')
    print(f'Output saved to: {output_path}')

if __name__ == "__main__":
    main()