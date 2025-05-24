import pdfplumber
import pytesseract
from PIL import Image
import ftfy
import re
import requests
import json
from pathlib import Path

class CVProfileExtractor:
    def __init__(self, groq_api_key):
        self.groq_api_key = groq_api_key
        self.groq_url = "https://api.groq.com/openai/v1/chat/completions"

        # Types de fichiers supportés
        self.pdf_extensions = ['.pdf']
        self.image_extensions = ['.png', '.jpg', '.jpeg', '.tiff', '.bmp']

        # Profils cibles étendus
        self.target_profiles = [
            "génie logiciel",
            "sécurité informatique / cybersécurité",
            "génie des données / data science",
            "développement web",
            "intelligence artificielle",
            "devops",
            "informatique embarquée / systèmes embarqués",
            "ingénierie cloud / cloud computing",
            "réseaux et télécommunications",
            "réalité virtuelle et augmentée (VR/AR)",
            "développement mobile",
            "blockchain / crypto-technologies",
            "analyse de données / business intelligence",
            "UX/UI design",
            "développement de jeux vidéo",
            "automatisation et robotique",
            "testing et assurance qualité (QA)",
            "informatique quantique",
            "scrum master / product owner",
            "technicien systèmes et réseaux / support IT"
        ]

    def extract_text_from_pdf(self, pdf_path):
        """Extrait le texte d'un fichier PDF"""
        try:
            with pdfplumber.open(pdf_path) as pdf:
                all_text = ""
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        page_text = ftfy.fix_text(page_text)
                        all_text += page_text + "\n"
                return all_text
        except Exception as e:
            print(f"Erreur lors du traitement PDF: {e}")
            return None

    def extract_text_from_image(self, image_path):
        """Extrait le texte d'une image via OCR"""
        try:
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image, lang='fra')
            text = ftfy.fix_text(text)
            return text
        except Exception as e:
            print(f"Erreur lors du traitement image: {e}")
            return None

    def process_cv_file(self, file_path):
        """Traite un fichier CV et retourne le texte extrait"""
        file_path = Path(file_path)
        file_extension = file_path.suffix.lower()

        if file_extension in self.pdf_extensions:
            return self.extract_text_from_pdf(file_path)
        elif file_extension in self.image_extensions:
            return self.extract_text_from_image(file_path)
        else:
            print(f"Type de fichier non supporté: {file_extension}")
            return None

    def extract_profile_with_groq(self, cv_text):
        """Analyse le texte du CV avec l'API Groq pour identifier le profil"""

        profiles_list = "\n".join([f"- {profile}" for profile in self.target_profiles])

        prompt = f"""
Tu es un expert en recrutement tech. Analyse attentivement ce CV pour identifier le profil professionnel principal du candidat, uniquement parmi cette liste :

{profiles_list}

Tu dois baser ton choix sur :
- Le vocabulaire technique utilisé
- Les expériences professionnelles et projets cités
- Les diplômes ou certifications
- Les outils, langages ou technologies mentionnés

⚠️ Ne crée **aucune catégorie nouvelle**. Choisis uniquement l’un des profils listés ci-dessus.
Si plusieurs profils semblent correspondre, choisis celui **le plus représentatif de l’ensemble du CV**.

Donne ta réponse au format JSON suivant :

{{
   "profil_principal": "nom du profil exact de la liste",
   "niveau_confiance": "pourcentage de 0 à 100",
   "competences_cles": ["compétence1", "compétence2", "compétence3"],
   "technologies": ["tech1", "tech2", "tech3"],
   "justification": "résumé clair et concis de ton raisonnement"
}}

Texte extrait du CV à analyser (limité aux 3000 premiers caractères) :

{cv_text[:3000]}
"""

        headers = {
            "Authorization": f"Bearer {self.groq_api_key}",
            "Content-Type": "application/json"
        }

        data = {
            "model": "llama3-8b-8192",
            "messages": [
                {
                    "role": "system",
                    "content": "Tu es un expert en analyse de CV et classification de profils professionnels IT. Tu dois choisir UNIQUEMENT parmi les profils fournis dans la liste."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.1,
            "max_tokens": 1000
        }

        try:
            response = requests.post(self.groq_url, headers=headers, json=data)
            response.raise_for_status()

            result = response.json()
            content = result['choices'][0]['message']['content']

            try:
                profile_data = json.loads(content)
                return profile_data
            except json.JSONDecodeError:
                return {
                    "profil_principal": "non déterminé",
                    "niveau_confiance": "0",
                    "competences_cles": [],
                    "experience_annees": "non spécifié",
                    "technologies": [],
                    "justification": content
                }

        except Exception as e:
            print(f"Erreur lors de l'appel à Groq API: {e}")
            return None

    def analyze_and_display_cv(self, file_path):
        """Analyse un CV et affiche les résultats"""
        print(f"\n{'='*60}")
        print(f"ANALYSE DU CV: {Path(file_path).name}")
        print(f"{'='*60}")

        cv_text = self.process_cv_file(file_path)
        if not cv_text:
            print("❌ Impossible d'extraire le texte du CV")
            return None

        print(f"\n📋 DONNÉES EXTRAITES DU CV:")
        print("-" * 40)
        cleaned_text = re.sub(r'\n\s*\n', '\n\n', cv_text.strip())
        preview = cleaned_text[:500] + "..." if len(cleaned_text) > 500 else cleaned_text
        print(preview)

        print(f"\n🤖 ANALYSE DU PROFIL EN COURS...")
        profile = self.extract_profile_with_groq(cleaned_text)

        if profile:
            print(f"\n👤 PROFIL PROFESSIONNEL IDENTIFIÉ:")
            print("-" * 40)
            print(f"🎯 Profil principal: {profile.get('profil_principal', 'N/A')}")
            print(f"📊 Niveau de confiance: {profile.get('niveau_confiance', 'N/A')}%")
            print(f"💼 Expérience estimée: {profile.get('experience_annees', 'N/A')} ans")
            print(f"🔧 Compétences clés: {', '.join(profile.get('competences_cles', []))}")
            print(f"💻 Technologies: {', '.join(profile.get('technologies', []))}")
            print(f"📝 Justification: {profile.get('justification', 'N/A')}")
        else:
            print("❌ Impossible d'analyser le profil")

        print(f"\n{'='*60}")

        return {
            "fichier": str(file_path),
            "texte_extrait": cleaned_text,
            "profil_analyse": profile
        }

# Script de test
def main():
    groq_api_key = "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"

    extractor = CVProfileExtractor(groq_api_key)
    cv_file = "CV_ELABEDALY.pdf"

    result = extractor.analyze_and_display_cv(cv_file)

    if result:
        output_file = f"analyse_{Path(cv_file).stem}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(f"\n💾 Résultats sauvegardés dans: {output_file}")

if __name__ == "__main__":
    main()
