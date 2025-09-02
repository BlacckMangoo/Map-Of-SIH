import json
import google.generativeai as genai
import os
from dotenv import load_dotenv
import time
import random
from datetime import datetime

load_dotenv()

def setup_gemini():
    """Set up and configure the Gemini API client."""
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable not found.")
        return None
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-1.5-flash')

def generate_tags_for_statement(model, statement):
    """Generate tags for a single problem statement."""
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
    except Exception as e:
        print(f"Error generating tags for statement {statement.get('Statement_id')}: {e}")
        return []

def generate_tags_for_batch(model, statements, batch_size=3):
    """
    Generate tags for a batch of statements at once.
    Returns a dictionary mapping statement IDs to their tags.
    """
    if not statements:
        return {}
    
    # Create a batch of statements up to the batch_size
    batch = statements[:batch_size]
    
    # Create a prompt that processes multiple statements at once
    prompt = """
    Analyze the following problem statements and generate 5-8 relevant tags for each that describe:
    - Key technologies mentioned
    - Application domains
    - Target industries
    - Problem categories
    - Solution types
    
    For each problem statement, provide ONLY a comma-separated list of tags.
    Format your response as a JSON object with statement IDs as keys and tags as values.
    
    Problem Statements:
    """
    
    # Add each statement to the prompt
    for statement in batch:
        statement_id = statement.get('Statement_id', '')
        prompt += f"\nID: {statement_id}\n"
        prompt += f"Title: {statement.get('Title', '')}\n"
        prompt += f"Description: {statement.get('Description', '')[:300]}...\n"  # Limit description length
        prompt += f"Category: {statement.get('Category', '')}\n"
        prompt += f"Technology Bucket: {statement.get('Technology_Bucket', '')}\n"
        prompt += "---\n"
    
    prompt += "\nReturn only a JSON object with statement IDs as keys and arrays of tags as values. For example:\n"
    prompt += """
    {
        "SIH1234": ["AI", "Machine Learning", "Healthcare", "Mobile App", "Data Analytics"],
        "SIH5678": ["IoT", "Smart Cities", "Environmental Monitoring", "Sensors", "Real-time Data"]
    }
    """
    
    try:
        response = model.generate_content(prompt)
        response_text = response.text
        
        # Extract the JSON from the response
        if '{' in response_text and '}' in response_text:
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            json_str = response_text[json_start:json_end]
            
            # Parse the JSON response
            try:
                tags_dict = json.loads(json_str)
                return tags_dict
            except json.JSONDecodeError:
                print(f"Error parsing JSON response: {response_text}")
                return {}
        else:
            print(f"No JSON found in response: {response_text}")
            return {}
    except Exception as e:
        print(f"API error: {e}")
        return {}

def process_problem_statements(use_batch=True, batch_size=3, max_retries=3, retry_delay=60):
    """Process all problem statements, generating tags in batches or individually."""
    model = setup_gemini()
    if not model:
        return
    
    # Load problem statements
    input_file = "../../frontend/src/data/problem_statements.json"
    output_file = "problem_statements_with_tags.json"
    progress_file = "problem_statements_with_tags_progress.json"
    
    # Load existing progress if any
    try:
        with open(progress_file, 'r', encoding='utf-8') as f:
            problem_statements = json.load(f)
            print(f"Loaded {len(problem_statements)} statements from progress file.")
    except (FileNotFoundError, json.JSONDecodeError):
        try:
            # If no progress file, load from output file
            with open(output_file, 'r', encoding='utf-8') as f:
                problem_statements = json.load(f)
                print(f"Loaded {len(problem_statements)} statements from output file.")
        except (FileNotFoundError, json.JSONDecodeError):
            # If no output file either, load from input file
            with open(input_file, 'r', encoding='utf-8') as f:
                problem_statements = json.load(f)
                print(f"Loaded {len(problem_statements)} statements from input file.")
    
    # Find statements without tags
    untagged_statements = [s for s in problem_statements if not s.get('Generated_Tags')]
    total_untagged = len(untagged_statements)
    print(f"Found {total_untagged} statements without tags.")
    
    if total_untagged == 0:
        print("All statements already have tags. Nothing to do.")
        return
    
    processed_count = 0
    retry_count = 0
    
    if use_batch:
        # Process in batches
        while untagged_statements and retry_count < max_retries:
            current_batch = untagged_statements[:batch_size]
            batch_ids = [s.get('Statement_id') for s in current_batch]
            
            print(f"Processing batch with IDs: {batch_ids}")
            tags_dict = generate_tags_for_batch(model, current_batch, batch_size)
            
            if tags_dict:
                # Update statements with tags
                for statement in problem_statements:
                    if statement['Statement_id'] in tags_dict:
                        statement['Generated_Tags'] = tags_dict[statement['Statement_id']]
                        processed_count += 1
                
                # Save progress after each successful batch
                save_results(problem_statements, progress_file)
                print(f"Saved progress. Processed {processed_count}/{total_untagged} statements.")
                
                # Remove processed statements from untagged list
                untagged_statements = [s for s in untagged_statements if s['Statement_id'] not in tags_dict]
                
                # Reset retry counter on success
                retry_count = 0
                
                # Add a small delay between batches to avoid rate limiting
                if untagged_statements:
                    delay = random.uniform(2, 5)
                    print(f"Waiting {delay:.2f} seconds before next batch...")
                    time.sleep(delay)
            else:
                retry_count += 1
                if retry_count < max_retries:
                    print(f"Batch processing failed. Retry {retry_count}/{max_retries} in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                else:
                    print("Maximum retries reached. Saving progress and stopping.")
    else:
        # Process one by one (original method)
        for i, statement in enumerate(untagged_statements):
            statement_id = statement.get('Statement_id', '')
            print(f"Processing statement {statement_id} ({i+1}/{total_untagged})")
            
            # Find the statement in the original list
            for s in problem_statements:
                if s['Statement_id'] == statement_id:
                    tags = generate_tags_for_statement(model, s)
                    if tags:
                        s['Generated_Tags'] = tags
                        processed_count += 1
                        print(f"Generated tags: {tags}")
                    else:
                        print(f"Failed to generate tags for {statement_id}")
                    break
            
            # Save progress periodically
            if (i + 1) % 5 == 0 or i == len(untagged_statements) - 1:
                save_results(problem_statements, progress_file)
                print(f"Saved progress. Processed {processed_count}/{total_untagged} statements.")
            
            # Add a delay to avoid rate limiting
            delay = random.uniform(1, 3)
            print(f"Waiting {delay:.2f} seconds before next statement...")
            time.sleep(delay)
    
    # Final save to the output file
    if processed_count > 0:
        save_results(problem_statements, output_file)
        print(f"All done! Generated tags for {processed_count} statements.")
    else:
        print("No new tags were generated. Check for API issues.")

def save_results(data, filename):
    """Save the data to a JSON file with a timestamp comment."""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    filepath = f"../../frontend/src/data/{filename}"
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Saved data to {filename} at {timestamp}")

if __name__ == "__main__":
    # Set use_batch=True to use batch processing (more efficient)
    # Set batch_size to control how many statements are processed in each API call
    # Increase batch_size to process more statements per API call (saves API quota)
    # Decrease batch_size if you encounter response errors
    process_problem_statements(use_batch=True, batch_size=3)