import json
import time
import re
import os
from groq import Groq

def classify_profil_llm(candidat_info, max_retries=3, retry_delay=5):
    client = Groq(api_key="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")

    system_prompt = '''You are a professional career classifier. Based on the following work experience, skills, certifications, projects, and technologies, classify the candidate into 1 top most relevant job profile.

## Instructions:  
- Analyze the candidate's *work experience, skills, education, certifications, projects, and technologies*.
- Evaluate each profile's relevance based on:
  - education
  - Specific job titles and responsibilities
  - Technical skills and technologies
  - Recent and relevant projects
  - Certifications (if relevant)
- Relevance scores must be *absolute, based on how well the candidate matches **industry-standard expectations* for each job profile.
- Prioritize *recent* work experience and projects.
- Do *NOT propose irrelevant profiles*. Do NOT include profiles that do not directly match the candidate's main skills and experience just to fill 1 result.
- The percentage represents how well the candidate matches each job profile.  
- Only include profiles with a *relevance score of 70% or higher*.
- Return the top 1 best-matching profiles with their *relevance percentage* (0-100%).

## Job Profiles:  
génie logiciel
sécurité informatique / cybersécurité
génie des données / data science
développement web
intelligence artificielle
devops
informatique embarquée / systèmes embarqués
ingénierie cloud / cloud computing
réseaux et télécommunications
réalité virtuelle et augmentée (VR/AR)
développement mobile
blockchain / crypto-technologies
analyse de données / business intelligence
UX/UI design
développement de jeux vidéo
automatisation et robotique
testing et assurance qualité (QA)
informatique quantique
scrum master / product owner
technicien systèmes et réseaux / support IT 

## Expected JSON Output:  
{
  "profile": [
    {
      "profile": "Data Scientist",
      "relevance": 90,
      "skills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5"]
    }
  ]
}
Return ONLY valid JSON without any formatting or additional text.
Return only the JSON as a string.
Don't start with any text, only the JSON without explanation.
'''
    attempts = 0
    while attempts < max_retries:
        try:
            response = client.chat.completions.create(
                model="llama3-70b-8192",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": str(candidat_info)}
                ],
                temperature=0
            )

            if not response.choices or not response.choices[0].message.content.strip():
                raise ValueError("Empty response received from the API.")

            json_response = response.choices[0].message.content.strip()
            json_response = re.sub(r'^\s*json|\s*```$', '', json_response, flags=re.MULTILINE).strip()
            
            parsed_response = json.loads(json_response)
            return parsed_response
        
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
        except Exception as e:
            print(f"API call error: {e}")

        attempts += 1
        if attempts < max_retries:
            print(f"Retrying... ({attempts}/{max_retries})")
            time.sleep(retry_delay)
        else:
            print("Max retries reached. Failed.")
            return None

def process_json_data(input_data, output_file_path=None):
    """
    Traite les données JSON directement en mémoire et renvoie le résultat
    
    Args:
        input_data: Dictionnaire JSON déjà chargé en mémoire
        output_file_path: Chemin optionnel où sauvegarder le résultat
        
    Returns:
        Le résultat de la classification
    """
    result = classify_profil_llm(input_data)
    
    if result and output_file_path:
        with open(output_file_path, 'w', encoding='utf-8') as file:
            json.dump(result, file, indent=2, ensure_ascii=False)
        
        print(f"Classification terminée. Résultat sauvegardé dans : {output_file_path}")
    
    return result

def process_json_file(input_file_path):
    # Normalize path for Windows
    input_file_path = os.path.normpath(input_file_path)
    
    # Debug: Print the path being checked
    print(f"Checking file at: {os.path.abspath(input_file_path)}")
    
    if not os.path.exists(input_file_path):
        # Try alternative path formats
        alt_path1 = input_file_path.replace('/', '\\')
        alt_path2 = input_file_path.replace('\\', '/')
        
        if os.path.exists(alt_path1):
            input_file_path = alt_path1
        elif os.path.exists(alt_path2):
            input_file_path = alt_path2
        else:
            raise FileNotFoundError(
                f"File not found at:\n"
                f"- {input_file_path}\n"
                f"- {alt_path1}\n"
                f"- {alt_path2}\n"
                f"Current working directory: {os.getcwd()}"
            )
    
    try:
        with open(input_file_path, 'r', encoding='utf-8') as file:
            input_data = json.load(file)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON file: {str(e)}")
    
    result = classify_profil_llm(input_data)
    
    if result:
        base_dir = os.path.dirname(input_file_path)
        base_name = os.path.splitext(os.path.basename(input_file_path))[0]
        output_file_path = os.path.join(base_dir, f"{base_name}_output.json")
        
        with open(output_file_path, 'w', encoding='utf-8') as file:
            json.dump(result, file, indent=2, ensure_ascii=False)
        
        print(f"Processing complete. Output saved to: {output_file_path}")
        return output_file_path
    else:
        print("Processing failed. No output file was created.")
        return None

if __name__ == "__main__":
    print("Current working directory:", os.getcwd())
    print("Available files in directory:", os.listdir('.'))
    
    input_path = input("Entrez le chemin du fichier JSON à traiter: ").strip('"\'')
    
    try:
        output_path = process_json_file(input_path)
        if output_path:
            print(f"Success! Output file created at: {output_path}")
    except Exception as e:
        print(f"Error: {str(e)}")
        print("\nTroubleshooting tips:")
        print("- Try using a relative path like 'traitement cv/cv_result.json'")
        print("- Or the full path without quotes: C:/Users/amdou/Desktop/PFA/traitement cv/cv_result.json")
        print("- You can drag-and-drop the file into the terminal window")
