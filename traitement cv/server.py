import os
import json
import tkinter as tk
from tkinter import filedialog
import subprocess
# Importer la fonction depuis classification.py
from classification import process_json_data

def select_cv_file():
    """Ouvre une boîte de dialogue pour sélectionner un fichier CV"""
    root = tk.Tk()
    root.withdraw()  # Masquer la fenêtre principale Tkinter
    file_path = filedialog.askopenfilename(
        title="Sélectionner un CV",
        filetypes=[("Fichiers PDF", "*.pdf"), ("Fichiers texte", "*.txt"), ("Images", "*.png;*.jpg;*.jpeg")]
    )
    return file_path

def send_cv_to_processing(cv_path):
    """Envoie le CV à organisation.py et récupère le JSON depuis stdout"""
    # Chemin relatif du script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    script_path = os.path.join(current_dir, "organisation.py")
    
    try:
        result = subprocess.run(
            ["python", script_path, cv_path],
            capture_output=True,
            text=True,
            check=True
        )
        
        if result.stderr:
            print(f"Avertissement de organisation.py: {result.stderr}")
        
        output = result.stdout
        
        # Extraire le JSON de la sortie en ignorant tout texte avant
        json_start = output.find('{')
        json_end = output.rfind('}')
        
        if json_start == -1 or json_end == -1:
            print(f"Aucun JSON trouvé dans la sortie: {output[:100]}...")
            return None
            
        json_str = output[json_start:json_end+1]
        
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"Erreur de parsing du JSON : {e}")
            print(f"Sortie reçue: {output[:200]}...")
            return None
            
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors de l'exécution du fichier organisation.py : {e}")
        if e.stderr:
            print(f"Détails de l'erreur: {e.stderr}")
        return None

def save_profile_json(profile_data, base_filename):
    """Sauvegarde uniquement les données du profil dans un fichier JSON"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_filename = f"{os.path.splitext(os.path.basename(base_filename))[0]}_profile.json"
    output_path = os.path.join(base_dir, output_filename)
    
    with open(output_path, 'w', encoding='utf-8') as file:
        json.dump(profile_data, file, ensure_ascii=False, indent=2)
    
    return output_path

def main():
    """Interface principale pour sélectionner et traiter le CV"""
    cv_path = select_cv_file()
    if not cv_path:
        print("Aucun fichier sélectionné.")
        return
    
    print(f"Fichier sélectionné : {cv_path}")
    
    # Étape 1: Traiter le CV avec organisation.py
    parsed_cv = send_cv_to_processing(cv_path)
    
    if not parsed_cv:
        print("Échec du traitement du CV.")
        return
    
    # Étape 2: Classifier le profil avec classification.py
    print("Classification du profil en cours...")
    profile_result = process_json_data(parsed_cv)
    
    if profile_result:
        # Sauvegarder uniquement le JSON du profil
        profile_json_path = save_profile_json(profile_result, cv_path)
        print(f"Profil sauvegardé dans: {profile_json_path}")
        
        # Afficher le contenu du profil dans la console
        print("\nProfil classifié:")
        print(json.dumps(profile_result, ensure_ascii=False, indent=2))
    else:
        print("Échec de la classification du profil.")

if __name__ == "__main__":
    main()
