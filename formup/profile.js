// Import Firebase modules  
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';  
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';  
import { getFirestore, doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';  
  
// Configuration Firebase (même que home.js)  
const firebaseConfig = {  
  apiKey: "AIzaSyDeyI1BJtOWozGGJAThWRccar0NTunRgZ0",  
  authDomain: "pfaouafaa.firebaseapp.com",  
  projectId: "pfaouafaa",  
  storageBucket: "pfaouafaa.firebasestorage.app",  
  messagingSenderId: "793502569049",  
  appId: "1:793502569049:web:00625bf0f7344b21301748",  
  measurementId: "G-KF7CNM89K2"  
};  
  
// Initialiser Firebase  
const app = initializeApp(firebaseConfig);  
const auth = getAuth(app);  
const db = getFirestore(app);  
  
// Variables globales  
let currentUser = null;  
let userData = {};  
  
// Vérifier l'état d'authentification  
onAuthStateChanged(auth, async (user) => {  
  if (user) {  
    currentUser = user;  
    await loadUserProfile(user.uid);  
    setupFormHandlers();  
  } else {  
    window.location.href = "formup.html";  
  }  
});  
  
// Charger le profil utilisateur  
async function loadUserProfile(uid) {  
  try {  
    const userDoc = await getDoc(doc(db, "users", uid));  
      
    if (userDoc.exists()) {  
      userData = userDoc.data();  
      populateForm(userData);  
      updateProfileAvatar(userData);  
    } else {  
      // Créer un profil de base avec les données d'authentification  
      userData = {  
        fullname: auth.currentUser.email,  
        email: auth.currentUser.email,  
        headline: '',  
        bio: '',  
        language: 'fr-FR',  
        portfolio: '',  
        linkedin: '',  
        github: ''  
      };  
      populateForm(userData);  
    }  
  } catch (error) {  
    console.error("Erreur lors du chargement du profil:", error);  
    showNotification("Erreur lors du chargement du profil", "error");  
  }  
}  
  
// Remplir le formulaire avec les données utilisateur  
function populateForm(data) {  
  document.getElementById('fullname').value = data.fullname || '';  
  document.getElementById('email').value = data.email || '';  
  document.getElementById('headline').value = data.headline || '';  
  document.getElementById('bio').value = data.bio || '';  
  document.getElementById('language').value = data.language || 'fr-FR';  
  document.getElementById('portfolio').value = data.portfolio || '';  
  document.getElementById('linkedin').value = data.linkedin || '';  
  document.getElementById('github').value = data.github || '';  
}  
  
// Mettre à jour l'avatar du profil  
// Mettre à jour l'avatar du profil  
function updateProfileAvatar(data) {  
  const avatar = document.getElementById('profileAvatar');  
  if (avatar && data.fullname) {  
    const firstLetter = data.fullname.charAt(0).toUpperCase();  
    avatar.textContent = firstLetter;  
  } else if (avatar) {  
    avatar.textContent = 'U';  
  }  
}  
  
// Configuration des gestionnaires d'événements du formulaire  
function setupFormHandlers() {  
  const form = document.getElementById('profileForm');  
  const saveButton = document.getElementById('saveButton');  
    
  if (form) {  
    form.addEventListener('submit', handleFormSubmit);  
  }  
    
  // Validation en temps réel  
  const inputs = form.querySelectorAll('input, textarea, select');  
  inputs.forEach(input => {  
    input.addEventListener('input', validateForm);  
  });  
}  
  
// Gestionnaire de soumission du formulaire  
async function handleFormSubmit(event) {  
  event.preventDefault();  
    
  const saveButton = document.getElementById('saveButton');  
  const originalText = saveButton.innerHTML;  
    
  // État de chargement  
  saveButton.disabled = true;  
  saveButton.innerHTML = `  
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="animate-spin">  
      <circle cx="12" cy="12" r="10"/>  
      <path d="M12 6v6l4 2"/>  
    </svg>  
    Enregistrement...  
  `;  
    
  try {  
    const formData = getFormData();  
    await saveUserProfile(formData);  
    showNotification("Profil mis à jour avec succès !", "success");  
  } catch (error) {  
    console.error("Erreur lors de la sauvegarde:", error);  
    showNotification("Erreur lors de la sauvegarde du profil", "error");  
  } finally {  
    // Restaurer le bouton  
    saveButton.disabled = false;  
    saveButton.innerHTML = originalText;  
  }  
}  
  
// Récupérer les données du formulaire  
function getFormData() {  
  return {  
    fullname: document.getElementById('fullname').value.trim(),  
    email: document.getElementById('email').value.trim(),  
    headline: document.getElementById('headline').value.trim(),  
    bio: document.getElementById('bio').value.trim(),  
    language: document.getElementById('language').value,  
    portfolio: document.getElementById('portfolio').value.trim(),  
    linkedin: document.getElementById('linkedin').value.trim(),  
    github: document.getElementById('github').value.trim()  
  };  
}  
  
// Sauvegarder le profil utilisateur dans Firestore  
async function saveUserProfile(profileData) {  
  if (!currentUser) {  
    throw new Error("Utilisateur non authentifié");  
  }  
    
  const userDocRef = doc(db, "users", currentUser.uid);  
    
  // Préparer les données à sauvegarder  
  const updateData = {  
    fullname: profileData.fullname,  
    headline: profileData.headline,  
    bio: profileData.bio,  
    language: profileData.language,  
    portfolio: profileData.portfolio,  
    linkedin: profileData.linkedin,  
    github: profileData.github,  
    lastProfileUpdate: new Date().toISOString()  
  };  
    
  // Supprimer les champs vides pour éviter de stocker des chaînes vides  
  Object.keys(updateData).forEach(key => {  
    if (updateData[key] === '' && key !== 'fullname') {  
      delete updateData[key];  
    }  
  });  
    
  await updateDoc(userDocRef, updateData);  
    
  // Mettre à jour les données locales  
  userData = { ...userData, ...updateData };  
  updateProfileAvatar(userData);  
}  
  
// Validation du formulaire  
function validateForm() {  
  const fullname = document.getElementById('fullname').value.trim();  
  const saveButton = document.getElementById('saveButton');  
    
  // Le nom complet est obligatoire  
  if (fullname.length < 2) {  
    saveButton.disabled = true;  
    return false;  
  }  
    
  // Validation des URLs si elles sont renseignées  
  const urlFields = ['portfolio', 'linkedin', 'github'];  
  for (const field of urlFields) {  
    const value = document.getElementById(field).value.trim();  
    if (value && !isValidUrl(value)) {  
      saveButton.disabled = true;  
      return false;  
    }  
  }  
    
  saveButton.disabled = false;  
  return true;  
}  
  
// Validation d'URL  
function isValidUrl(string) {  
  try {  
    new URL(string);  
    return true;  
  } catch (_) {  
    return false;  
  }  
}  
  
// Afficher une notification  
function showNotification(message, type = 'info') {  
  // Supprimer les notifications existantes  
  const existingNotifications = document.querySelectorAll('.notification');  
  existingNotifications.forEach(notif => notif.remove());  
    
  // Créer la nouvelle notification  
  const notification = document.createElement('div');  
  notification.className = `notification notification-${type}`;  
  notification.innerHTML = `  
    <div class="notification-content">  
      <span class="notification-message">${message}</span>  
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">  
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">  
          <line x1="18" y1="6" x2="6" y2="18"></line>  
          <line x1="6" y1="6" x2="18" y2="18"></line>  
        </svg>  
      </button>  
    </div>  
  `;  
    
  // Ajouter les styles pour la notification  
  if (!document.querySelector('#notification-styles')) {  
    const styles = document.createElement('style');  
    styles.id = 'notification-styles';  
    styles.textContent = `  
      .notification {  
        position: fixed;  
        top: 20px;  
        right: 20px;  
        z-index: 1000;  
        max-width: 400px;  
        border-radius: 8px;  
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);  
        animation: slideIn 0.3s ease-out;  
      }  
        
      .notification-success {  
        background: #10b981;  
        color: white;  
      }  
        
      .notification-error {  
        background: #ef4444;  
        color: white;  
      }  
        
      .notification-info {  
        background: #3b82f6;  
        color: white;  
      }  
        
      .notification-content {  
        display: flex;  
        align-items: center;  
        justify-content: space-between;  
        padding: 12px 16px;  
      }  
        
      .notification-message {  
        flex: 1;  
        margin-right: 12px;  
      }  
        
      .notification-close {  
        background: none;  
        border: none;  
        color: inherit;  
        cursor: pointer;  
        padding: 4px;  
        border-radius: 4px;  
        opacity: 0.8;  
        transition: opacity 0.2s;  
      }  
        
      .notification-close:hover {  
        opacity: 1;  
        background: rgba(255, 255, 255, 0.1);  
      }  
        
      @keyframes slideIn {  
        from {  
          transform: translateX(100%);  
          opacity: 0;  
        }  
        to {  
          transform: translateX(0);  
          opacity: 1;  
        }  
      }  
    `;  
    document.head.appendChild(styles);  
  }  
    
  // Ajouter la notification au DOM  
  document.body.appendChild(notification);  
    
  // Supprimer automatiquement après 5 secondes  
  setTimeout(() => {  
    if (notification.parentElement) {  
      notification.remove();  
    }  
  }, 5000);  
}  
  
// Gestion des raccourcis clavier  
document.addEventListener('keydown', function(event) {  
  // Ctrl+S ou Cmd+S pour sauvegarder  
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {  
    event.preventDefault();  
    const form = document.getElementById('profileForm');  
    if (form) {  
      form.dispatchEvent(new Event('submit'));  
    }  
  }  
    
  // Échap pour annuler  
  if (event.key === 'Escape') {  
    window.location.href = 'home.html';  
  }  
});  
  
// Initialisation une fois le DOM chargé  
document.addEventListener('DOMContentLoaded', function() {  
  // Validation initiale  
  validateForm();  
});  
  
console.log('Profile.js chargé avec succès');


