import pandas as pd
import json
import os


sihData = pd.read_excel("./resources/sihProblemStatements.xlsx")


# Create JsonData directory if it doesn't exist
json_dir = "./JsonData"
os.makedirs(json_dir, exist_ok=True)


#  unique Organizations
organizations = sihData['Organisation'].dropna().unique().tolist()
organizations_data = {
    "organizations": [{"id": i+1, "name": org} for i, org in enumerate(sorted(organizations))]
}
with open(f"{json_dir}/organizations.json", 'w', encoding='utf-8') as f:
    json.dump(organizations_data, f, indent=2, ensure_ascii=False)


#  unique Departments
departments = sihData['Department'].dropna().unique().tolist()
departments_data = {
    "departments": [{"id": i+1, "name": dept} for i, dept in enumerate(sorted(departments))]
}
with open(f"{json_dir}/departments.json", 'w', encoding='utf-8') as f:
    json.dump(departments_data, f, indent=2, ensure_ascii=False)


#  unique Categories (Themes)
categories = sihData['Category'].dropna().unique().tolist()
categories_data = {
    "categories": [{"id": i+1, "name": cat} for i, cat in enumerate(sorted(categories))]
}
with open(f"{json_dir}/categories.json", 'w', encoding='utf-8') as f:
    json.dump(categories_data, f, indent=2, ensure_ascii=False)


#  unique Technology Buckets
tech_buckets = sihData['Technology_Bucket'].dropna().unique().tolist()
tech_buckets_data = {
    "technology_buckets": [{"id": i+1, "name": tech} for i, tech in enumerate(sorted(tech_buckets))]
}
with open(f"{json_dir}/technology_buckets.json", 'w', encoding='utf-8') as f:
    json.dump(tech_buckets_data, f, indent=2, ensure_ascii=False)


# Extract Problem Statements
problem_statements = []
for index, row in sihData.iterrows():
    problem = {
        "id": row['Statement_id'],
        "title": row['Title'],
        "category": row['Category'],
        "technology_bucket": row['Technology_Bucket'],
        "description": row['Description'],
        "department": row['Department'],
        "organisation": row['Organisation']
    }
    problem_statements.append(problem)

problem_statements_data = {
    "problem_statements": problem_statements
}
with open(f"{json_dir}/problem_statements.json", 'w', encoding='utf-8') as f:
    json.dump(problem_statements_data, f, indent=2, ensure_ascii=False)



