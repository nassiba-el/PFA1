from flask import Flask, request, jsonify  
from flask_cors import CORS  
import os  
import json  
from pathlib import Path  
from traitement_cv import CVProfileExtractor  
from organization import parse_cv_with_llm  # Votre fichier de structuration  
  
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
          
        # Générer le fichier JSON structuré  
        structured_json_file = f"cv_structure_{Path(temp_path).stem}.json"  
        with open(structured_json_file, 'w', encoding='utf-8') as f:  
            json.dump(structured_data, f, ensure_ascii=False, indent=2)  
          
        # Retourner les données structurées et le nom du fichier généré  
        return jsonify({  
            'structured_data': structured_data,  
            'json_file': structured_json_file,  
            'message': 'CV structuré avec succès'  
        })  
      
    finally:  
        # Nettoyer le fichier temporaire  
        if os.path.exists(temp_path):  
            os.remove(temp_path)  
  
if __name__ == '__main__':  
    app.run(debug=True, port=5000)