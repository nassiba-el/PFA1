import pdfplumber
import re
import ftfy

with pdfplumber.open("CV_ELABEDALY.pdf") as pdf:
    all_text = ""
    for page in pdf.pages:
        page_text = page.extract_text()
        if page_text:  # Vérifier si la page a du texte
            page_text = ftfy.fix_text(page_text)  # Corriger les problèmes d'encodage par page
            all_text += page_text + "\n"  # Ajouter saut de ligne entre pages

print(all_text)

