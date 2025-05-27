import json
import time
import logging
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
- Do *NOT propose irrelevant profiles*. Do NOT include profiles that do not directly match the candidate’s main skills and experience just to fill 1 result.
- The percentage represents how well the candidate matches each job profile.  
- Only include profiles with a *relevance score of 70% or higher*.
- Return the top 1 best-matching profiles with their *relevance percentage* (0–100%).

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
json
{
  "profile": [
    {
      "profile": "Data Scientist",
      "relevance": 90
    },
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
                model="llama-3.3-70b-versatile",
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