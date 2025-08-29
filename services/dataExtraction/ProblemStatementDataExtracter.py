import pandas as pd
import os
import json


script_dir = os.path.dirname(os.path.abspath(__file__))
excel_path = os.path.join(script_dir, 'resources', 'sihProblemStatements.xlsx')

sihData = pd.read_excel(excel_path)
sihData['DepartmentOrg'] = sihData['Department'] + ' - ' + sihData['Organisation']

all_data = {
    'titles': sihData['Title'].tolist(),
    'tech_buckets': sihData['Technology_Bucket'].tolist(),
    'descriptions': sihData['Description'].tolist(),
    'statement_ids': sihData['Statement_id'].tolist(),
    'categories': sihData['Category'].tolist(),
    'department_orgs': sihData['DepartmentOrg'].tolist()
}


resources_dir = os.path.join(script_dir, 'resources/JsonData')
os.makedirs(resources_dir, exist_ok=True)

for key, data in all_data.items():
    filename = f'{key}.json'
    data = pd.Series(data).unique().tolist()
    with open(os.path.join(resources_dir, filename), 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)


problem_statements = []
for index, row in sihData.iterrows():
    problem_statements.append({
        "Statement_id": row['Statement_id'],
        "Title": row['Title'],
        "Category": row['Category'],
        "Technology_Bucket": row['Technology_Bucket'],
        "Description": row['Description'],
        "DepartmentOrg": row['DepartmentOrg']
    })

# Save combined data
with open(os.path.join(resources_dir, 'problem_statements.json'), 'w', encoding='utf-8') as f:
    json.dump(problem_statements, f, indent=2)

print(f"All JSON files have been created in: {resources_dir}")

