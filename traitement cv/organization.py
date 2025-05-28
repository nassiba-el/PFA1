import os
import json
import time
import re
from groq import Groq

def parse_cv_with_llm(cv_text, max_retries=3, retry_delay=5):
    client = Groq(api_key="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")

    system_prompt ='''You are a professional CV parser. Analyze the following CV text and structure it into JSON format.

## Instructions :
- Extract all information *accurately and completely* from the CV.
- *Do NOT truncate any descriptions.* Extract all details *verbatim*, including bullet points.
- If the CV contains *structured lists (e.g., bullet points for job responsibilities or project details), preserve them in the description.*
- *Internships (stages) and jobs must be placed under "work_experience" and NOT under "projects".*
- A *"stage" (internship) or employment should be categorized as work experience*, while personal, academic, or freelance projects should go under "projects".
- *In education, extract both the degree AND field of study (filière).*
- *In work experience, specify the contract type (e.g., stage, CDI, CDD, freelance, alternance).*
- Do NOT split the job description into separate parts (i.e., brief description and technologies). *Keep it intact* as a single string under the "description" field.
- Ensure the skills section contains *ALL* mentioned skills without categorization.
- Ensure all fields (personal info, education, work experience, projects, skills, etc.) are extracted *completely*.
- Preprocess the text to *remove any non-alphanumeric characters, emojis, or icons (e.g., ✉, 📞, 🔗, etc.) from contact fields like email, phone, LinkedIn, GitHub, and website.*
- *Keep URLs in full format* for LinkedIn, GitHub, and personal websites.
- If any information is missing, replace it with null.
- Maintain consistent date formats (YYYY-YYYY for education, MM/YYYY for work experience except for present, aujourdhui, etc).

## Expected JSON Structure:  
{
  "personal_info": {
    "name": "Full Name",
    "email": "email@example.com :remove icons before email or something like envlope or email",
    "phone": "+123456789",
    "location": "City, Country",
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "website": "https://personalwebsite.com"
  },
  "education": [
    {
      "degree": "Degree Name",
      "field": "Field of Study (Filière)",
      "institution": "Institution Name",
      "years": "YYYY-YYYY"
    }
  ],
  "work_experience": [
    {
      "position": "Job Title",
      "company": "Company Name",
      "type": "Contract Type (e.g., Stage, CDI, CDD, Freelance, Alternance)",
      "start_date": "MM/YYYY",
      "end_date": "MM/YYYY",
      "description": "Full Job description",
      "technologies": ["Tech1", "Tech2"]
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Full project description",
      "technologies": ["Tech1", "Tech2"]
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "organization": "Issuing Organization",
      "year": "YYYY"
    }
  ],
  "skills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5"],
  "languages": ["Language1", "Language2"]
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
                    {"role": "user", "content": cv_text}
                ],
                temperature=0.1
            )

            if not response.choices or not response.choices[0].message.content.strip():
                raise ValueError("Empty response received from the API.")

            json_response = response.choices[0].message.content.strip()
            json_response = re.sub(r'^\s*json|\s*$', '', json_response, flags=re.MULTILINE).strip()
            
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