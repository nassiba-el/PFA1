import os
import json
import sys
import time
import re
import PyPDF2
from groq import Groq
import pytesseract
from PIL import Image
import traceback

def extract_text_from_pdf(pdf_path):
    """Extrait le texte d'un fichier PDF"""
    text = ""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            extracted = page.extract_text() or ""  # Évite l’erreur NoneType
            text += extracted
    return text

def extract_text_from_image(image_path):
    """Extrait le texte d'une image via OCR (pytesseract)"""
    image = Image.open(image_path)
    text = pytesseract.image_to_string(image)
    return text

def parse_cv_with_llm(cv_text, max_retries=3, retry_delay=5):
    """Analyse le CV et le convertit en JSON via Groq API"""
    client = Groq(api_key="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")

    system_prompt =     system_prompt ='''You are a professional CV parser. Analyze the following CV text and structure it into JSON format.

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
return only one json file do not return deplicated json file
'''

    attempts = 0
    while attempts < max_retries:
        try:
            response = client.chat.completions.create(
                model="llama3-70b-8192",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": cv_text}
                ],
                temperature=0.1
            )

            if not response.choices or not response.choices[0].message.content.strip():
                raise ValueError("Empty response received from the API.")

            json_response = response.choices[0].message.content.strip()
            # print("API RESPONSE:", json_response)  # Debugging : voir la réponse brute

            # Nettoyage et vérification des JSON
            json_objects = re.findall(r'{.*}', json_response, re.DOTALL)  # Capture tous les objets JSON

            if len(json_objects) > 1:
                print("⚠️ Plusieurs JSON détectés, utilisation du premier.")
            
            json_cleaned = json_objects[0] if json_objects else json_response  # Utiliser uniquement le premier JSON


            # Vérifier si l’API a bien renvoyé un JSON
            if not json_response.startswith("{") or not json_response.endswith("}"):
                print("❌ Réponse API non valide :", json_response, file=sys.stderr)
                return None

            # Nettoyage des caractères de contrôle ASCII invisibles
            json_response = re.sub(r'[\x00-\x1F\x7F]', '', json_response)

            # Vérification et parsing sécurisé du JSON
            try:
                parsed_response = json.loads(json_response)
            except json.JSONDecodeError as e:
                print(f"❌ Erreur parsing JSON : {e}. Contenu brut :", json_response, file=sys.stderr)
                return None
            
            return parsed_response
        
        except Exception as e:
            print(f"❌ Erreur API ou parsing : {e}", file=sys.stderr)
            traceback.print_exc()

        attempts += 1
        if attempts < max_retries:
            print(f"🔄 Retrying... ({attempts}/{max_retries})")
            time.sleep(retry_delay)
        else:
            print("❌ Max retries reached. Failed.", file=sys.stderr)
            return None

def main(cv_path):
    """Traitement du CV et envoi du JSON à stdout"""
    if not os.path.exists(cv_path):
        print("❌ Fichier introuvable.", file=sys.stderr)
        return

    try:
        if cv_path.lower().endswith('.pdf'):
            text = extract_text_from_pdf(cv_path)
        elif cv_path.lower().endswith('.txt'):
            with open(cv_path, 'r', encoding='utf-8') as f:
                text = f.read()
        elif cv_path.lower().endswith(('.png', '.jpg', '.jpeg')):
            text = extract_text_from_image(cv_path)
        else:
            print("❌ Format non supporté.", file=sys.stderr)
            return
    except Exception as e:
        print(f"❌ Erreur d'extraction : {e}", file=sys.stderr)
        traceback.print_exc()
        return

    parsed_cv = parse_cv_with_llm(text)
    if not parsed_cv:
        print("❌ Échec de l'analyse.", file=sys.stderr)
        return

    # Renvoi du JSON à stdout pour server.py
    print(json.dumps(parsed_cv, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    # Vérifier que le chemin du fichier est fourni en argument
    if len(sys.argv) < 2:
        print("Usage: python organisation.py <chemin_vers_cv>", file=sys.stderr)
        sys.exit(1)
    
    cv_path = sys.argv[1]
    
    # Vérifier si le fichier existe
    if not os.path.exists(cv_path):
        print(f"Erreur: Le fichier {cv_path} n'existe pas.", file=sys.stderr)
        sys.exit(1)
    
    # Extraire le texte selon le type de fichier
    _, file_extension = os.path.splitext(cv_path)
    
    if file_extension.lower() in ['.pdf']:
        cv_text = extract_text_from_pdf(cv_path)
    elif file_extension.lower() in ['.jpg', '.jpeg', '.png']:
        cv_text = extract_text_from_image(cv_path)
    elif file_extension.lower() in ['.txt']:
        with open(cv_path, 'r', encoding='utf-8') as file:
            cv_text = file.read()
    else:
        print(f"Format de fichier non pris en charge: {file_extension}", file=sys.stderr)
        sys.exit(1)
    
    # Analyser le CV avec LLM
    parsed_cv = parse_cv_with_llm(cv_text)
    
    if parsed_cv:
        # Imprimer le JSON sur stdout pour que server.py puisse le récupérer
        print(json.dumps(parsed_cv, ensure_ascii=False))
    else:
        print("Échec de l'analyse du CV.", file=sys.stderr)
        sys.exit(1)

