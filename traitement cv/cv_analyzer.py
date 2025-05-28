# cv_analyzer.py  
import json  
import re  
from typing import Dict, List  
import firebase_admin  # Ajoutez cette ligne  
from firebase_admin import credentials, firestore  
  
class CVAnalyzer:  
    def __init__(self):  
        # Initialiser Firebase Admin SDK  
        if not firebase_admin._apps:  
            cred = credentials.Certificate("path/to/serviceAccountKey.json")  
            firebase_admin.initialize_app(cred)  
        self.db = firestore.client() 
class CVAnalyzer:  
    def __init__(self):  
        # Initialisation Firebase Admin SDK  
        if not firebase_admin._apps:  
            cred = credentials.Certificate("path/to/serviceAccountKey.json")  
            firebase_admin.initialize_app(cred)  
        self.db = firestore.client()  
      
    # Vos autres méthodes existantes...  
      
    def get_formations_by_profile(self, profile: str) -> List[Dict]:  
        try:  
            # Requête Firestore pour récupérer SEULEMENT les formations de cette catégorie  
            formations_ref = self.db.collection('formations')  
            query = formations_ref.where('profil', '==', profile).limit(10)  
            formations = query.stream()  
              
            recommended_formations = []  
            for formation in formations:  
                data = formation.to_dict()  
                recommended_formations.append({  
                    "titre": data.get('titre'),  
                    "description": data.get('description'),  
                    "lien": data.get('lien'),  
                    "niveau": data.get('niveau'),  
                    "profil": data.get('profil')  # Confirmer la catégorie  
                })  
              
            return recommended_formations  
        except Exception as e:  
            return []