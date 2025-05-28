from flask import Flask, request, jsonify  
from flask_cors import CORS  
import os  
import json  
from pathlib import Path  
from classification import CVProfileExtractor  
from organization import parse_cv_with_llm  # Votre fichier de structuration  
import firebase_admin  
from firebase_admin import credentials, firestore  
from classification import CVProfileExtractor
from classification import classify_profil_llm  # Votre fichier de classification

# Initialiser Firebase  
if not firebase_admin._apps:    
    cred = credentials.Certificate("./serviceAccountKey.json")    
    firebase_admin.initialize_app(cred)    
db = firestore.client()

app = Flask(__name__)  
CORS(app)  
  
# Initialiser l'extracteur pour l'extraction de texte  
extractor = CVProfileExtractor("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")  
  
@app.route('/api/structure-cv', methods=['POST'])  
def structure_cv():  
    if 'cv_file' not in request.files:  
        return jsonify({'error': 'Aucun fichier fourni'}), 400  
      
    file = request.files['cv_file']  
    if file.filename == '':  
        return jsonify({'error': 'Nom de fichier vide'}), 400  
      
    # Sauvegarder temporairement le fichier  
    temp_path = f"temp_{file.filename}"  
    file.save(temp_path)  
      
    try:  
        # ÉTAPE 1: Extraire le texte du CV  
        cv_text = extractor.process_cv_file(temp_path)  
        if not cv_text:  
            return jsonify({'error': 'Impossible d\'extraire le texte du CV'}), 500  
          
        # ÉTAPE 2: Structurer avec votre code organization.py  
        structured_data = parse_cv_with_llm(cv_text)  
        if not structured_data:  
            return jsonify({'error': 'Impossible de structurer le CV'}), 500  
        
        # ÉTAPE 3: Classifier le profil  
        profile_result = classify_profil_llm(structured_data)  
        profile = profile_result['profile'][0]['profile'] if profile_result and profile_result.get('profile') else "profil général"  
  
        # ÉTAPE 4: Recommander des formations  
        formations_recommandees = get_formations_by_profile(profile)
          
        # Générer le fichier JSON structuré  
        structured_json_file = f"cv_structure_{Path(temp_path).stem}.json"  
        with open(structured_json_file, 'w', encoding='utf-8') as f:  
            json.dump(structured_data, f, ensure_ascii=False, indent=2)  
          
        # Retourner les données structurées et le nom du fichier généré  
        return jsonify({  
            'structured_data': structured_data,  
            'profil_principal': profile,  
            'formations_recommandees': formations_recommandees,  
            'json_file': structured_json_file,  
            'message': 'CV structuré avec succès'  
        }) 
      
    finally:  
        # Nettoyer le fichier temporaire  
        if os.path.exists(temp_path):  
            os.remove(temp_path)  
  
if __name__ == '__main__':  
    app.run(debug=True, port=5000)


def get_formations_by_profile(profile: str):  
    try:  
        formations_ref = db.collection('formations')  
        query = formations_ref.where('categorie', '==', profile).limit(10)  # Changé 'profil' en 'categorie'  
        formations = query.stream()  
          
        recommended_formations = []  
        for formation in formations:  
            data = formation.to_dict()  
            recommended_formations.append({  
                "titre": data.get('titre'),  
                "description": data.get('description'),  
                "lien": data.get('lien'),  
                "niveau": data.get('niveau'),  
                "duree": data.get('duree'),  
                "instructeur": data.get('instructeur')  
            })  
          
        return recommended_formations  
    except Exception as e:  
        print(f"Erreur lors de la récupération des formations: {e}")  
        return []