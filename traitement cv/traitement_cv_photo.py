import pytesseract
from PIL import Image

# Si Tesseract n'est pas dans le PATH, spécifiez son emplacement (Windows)
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Charger l'image
image = Image.open("cv_image.png")

# Extraire le texte
texte = pytesseract.image_to_string(image, lang='fra')  # 'fra' pour le français

# Afficher le résultat
print(texte)

# # Optionnel : sauvegarder dans un fichier
# with open("texte_extraite.txt", "w", encoding="utf-8") as fichier:
#     fichier.write(texte)