from flask import Flask, request, jsonify  
from flask_cors import CORS  
import os  
from classification import CVProfileExtractor  
  
app = Flask(__name__)  
CORS(app)  
  
# Initialiser l'extracteur avec votre clé API Groq  
extractor = CVProfileExtractor("votre_cle_groq_api")  
  
@app.route('/api/analyze-cv', methods=['POST'])  
def analyze_cv():  
    if 'cv_file' not in request.files:  
        return jsonify({'error': 'Aucun fichier fourni'}), 400  
      
    file = request.files['cv_file']  
    if file.filename == '':  
        return jsonify({'error': 'Nom de fichier vide'}), 400  
      
    # Sauvegarder temporairement le fichier  
    temp_path = f"temp_{file.filename}"  
    file.save(temp_path)  
      
    try:  
        # Analyser le CV  
        result = extractor.analyze_and_display_cv(temp_path)  
          
        if result and result['profil_analyse']:  
            return jsonify(result['profil_analyse'])  
        else:  
            return jsonify({'error': 'Impossible d\'analyser le CV'}), 500  
      
    finally:  
        # Nettoyer le fichier temporaire  
        if os.path.exists(temp_path):  
            os.remove(temp_path)  
  
if __name__ == '__main__':  
    app.run(debug=True, port=5000)