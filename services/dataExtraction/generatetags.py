import json
import google.generativeai as genai
import os
from dotenv import load_dotenv
import time

load_dotenv()

def setup_gemini():
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        return None
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-1.5-flash')

def generate_tags_for_statement(model, statement):
    prompt = f"""
    Analyze this problem statement and generate 5-8 relevant tags that describe:
    - Key technologies mentioned
    - Application domains
    - Target industries
    - Problem categories
    - Solution types
    
    Problem Statement:
    Title: {statement.get('Title', '')}
    Description: {statement.get('Description', '')}
    Category: {statement.get('Category', '')}
    Technology Bucket: {statement.get('Technology_Bucket', '')}
    
    Return only a comma-separated list of tags (no explanations):
    """
    
    try:
        response = model.generate_content(prompt)
        return [tag.strip() for tag in response.text.split(',')]
    except:
        return []

def process_problem_statements():
    model = setup_gemini()
    if not model:
        return
    
    with open("../../frontend/src/data/problem_statements.json", 'r', encoding='utf-8') as f:
        problem_statements = json.load(f)
    
    for i, statement in enumerate(problem_statements):
        tags = generate_tags_for_statement(model, statement)
        statement['Generated_Tags'] = tags
        time.sleep(1)
        
        if (i + 1) % 10 == 0:
            save_results(problem_statements, "problem_statements_with_tags_progress.json")
    
    save_results(problem_statements, "problem_statements_with_tags.json")

def save_results(data, filename):
    with open(f"../../frontend/src/data/{filename}", 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    process_problem_statements()