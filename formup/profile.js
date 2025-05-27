// Import Firebase modules  
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';  
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';  
import { getFirestore, doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';  
  
// Configuration Firebase  
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
    setupEventHandlers();  
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
      displayUserProfile(userData);  
      updateProfileAvatar(userData);  
    } else {  
      // Créer un profil de base avec les données d'authentification  
      userData = {  
        fullname: auth.currentUser.email,  
        email: auth.currentUser.email,  
        cvAnalyzed: false,  
        profile: null,  
        competences_cles: []  
      };  
      displayUserProfile(userData);  
    }  
  } catch (error) {  
    console.error("Erreur lors du chargement du profil:", error);  
    showNotification("Erreur lors du chargement du profil", "error");  
  }  
}  
  
// Afficher le profil utilisateur (version simplifiée)  
function displayUserProfile(data) {  
  // Afficher nom et email (toujours visible)  
  const userFullName = document.getElementById('userFullName');  
  const userEmail = document.getElementById('userEmail');  
    
  if (userFullName) {  
    userFullName.textContent = data.fullname || 'Nom utilisateur';  
  }  
    
  if (userEmail) {  
    userEmail.textContent = data.email || 'email@example.com';  
  }  
    
  // Gestion conditionnelle selon le statut CV  
  const cvAnalyzedSection = document.getElementById('cvAnalyzedSection');  
  const noCvSection = document.getElementById('noCvSection');  
  const cvPromptBar = document.getElementById('cvPromptBar');  
    
  if (data.cvAnalyzed && data.profile) {  
    // CV analysé : afficher profil et compétences  
    if (cvAnalyzedSection) {  
      cvAnalyzedSection.style.display = 'block';  
      displayProfileInfo(data);  
      displayCompetences(data.competences_cles || []);  
      displayAdditionalInfo(data);  
    }  
      
    if (noCvSection) noCvSection.style.display = 'none';  
    if (cvPromptBar) cvPromptBar.style.display = 'none';  
      
  } else {  
    // Pas de CV : afficher barre d'encouragement  
    if (cvAnalyzedSection) cvAnalyzedSection.style.display = 'none';  
    if (noCvSection) noCvSection.style.display = 'block';  
    if (cvPromptBar) cvPromptBar.style.display = 'block';  
  }  
}  
  
// Afficher les informations de profil  
function displayProfileInfo(data) {  
  const userProfile = document.getElementById('userProfile');  
  const lastCVUpdate = document.getElementById('lastCVUpdate');  
    
  if (userProfile) {  
    userProfile.textContent = data.profile || 'Profil inconnu';  
  }  
    
  if (lastCVUpdate && data.lastCVUpdate) {  
    const date = new Date(data.lastCVUpdate);  
    lastCVUpdate.textContent = date.toLocaleDateString('fr-FR');  
  }  
}  
  
// Afficher les compétences  
function displayCompetences(competences) {  
  const competencesList = document.getElementById('competencesList');  
    
  if (competencesList) {  
    competencesList.innerHTML = '';  
      
    if (competences && competences.length > 0) {  
      competences.forEach(competence => {  
        const competenceItem = document.createElement('div');  
        competenceItem.className = 'competence-item';  
        competenceItem.textContent = competence;  
        competencesList.appendChild(competenceItem);  
      });  
    } else {  
      competencesList.innerHTML = '<p>Aucune compétence détectée</p>';  
    }  
  }  
}  
  
// Afficher les informations additionnelles  
function displayAdditionalInfo(data) {  
  const userHeadline = document.getElementById('userHeadline');  
  const userBio = document.getElementById('userBio');  
  const userPortfolio = document.getElementById('userPortfolio');  
  const userLinkedin = document.getElementById('userLinkedin');  
  const userGithub = document.getElementById('userGithub');  
    
  if (userHeadline) {  
    userHeadline.textContent = data.headline || 'Non renseigné';  
  }  
    
  if (userBio) {  
    userBio.textContent = data.bio || 'Non renseignée';  
  }  
    
  if (userPortfolio) {  
    if (data.portfolio) {  
      userPortfolio.innerHTML = `<a href="${data.portfolio}" target="_blank">${data.portfolio}</a>`;  
    } else {  
      userPortfolio.textContent = 'Non renseigné';  
    }  
  }  
    
  if (userLinkedin) {  
    if (data.linkedin) {  
      userLinkedin.innerHTML = `<a href="${data.linkedin}" target="_blank">${data.linkedin}</a>`;  
    } else {  
      userLinkedin.textContent = 'Non renseigné';  
    }  
  }  
    
  if (userGithub) {  
    if (data.github) {  
      userGithub.innerHTML = `<a href="${data.github}" target="_blank">${data.github}</a>`;  
    } else {  
      userGithub.textContent = 'Non renseigné';  
    }  
  }  
}  
  
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
  
// Configuration des gestionnaires d'événements  
function setupEventHandlers() {  
  // Gestionnaire pour l'upload de CV  
  const cvFileInput = document.getElementById('cvFileInput');  
  if (cvFileInput) {  
    cvFileInput.addEventListener('change', handleCVUpload);  
  }  
}  
  
// Gestion de l'upload CV  
async function handleCVUpload(event) {  
  const file = event.target.files[0];  
  if (!file) return;  
    
  const allowedTypes = [  
    'application/pdf',  
    'application/msword',  
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'  
  ];  
    
  if (file.size > 5 * 1024 * 1024) {  
    showNotification('Le fichier est trop volumineux (max 5MB)', 'error');  
    return;  
  }  
    
  if (!allowedTypes.includes(file.type)) {  
    showNotification('Type de fichier non supporté. Utilisez PDF, DOC ou DOCX.', 'error');  
    return;  
  }  
    
  showNotification('CV en cours d\'analyse...', 'info');  
    
  // Simulation de l'analyse (à remplacer par l'appel au service Python)  
  setTimeout(async () => {  
    try {  
      // Exemple de données retournées par le service Python  
      const mockProfileData = {  
        profil_principal: 'développement web',  
        niveau_confiance: 85,  
        competences_cles: ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML']  
      };  
        
      await updateUserProfile(mockProfileData);  
      showNotification(`CV "${file.name}" traité avec succès! Profil mis à jour.`, 'success');  
        
      // Recharger le profil pour afficher les nouvelles données  
      await loadUserProfile(currentUser.uid);  
        
    } catch (error) {  
      console.error('Erreur lors de l\'analyse du CV:', error);  
      showNotification('Erreur lors de l\'analyse du CV', 'error');  
    }  
  }, 2000);  
}  
  
// Mettre à jour le profil utilisateur après analyse CV  
async function updateUserProfile(profileData) {  
  try {  
    if (!currentUser) return;  
      
    const userDocRef = doc(db, "users", currentUser.uid);  
    await updateDoc(userDocRef, {  
      profile: profileData.profil_principal || 'Profil inconnu',  
      cvAnalyzed: true,  
      lastCVUpdate: new Date().toISOString(),  
      competences_cles: profileData.competences_cles || [],  
      niveau_confiance: profileData.niveau_confiance || 0  
    });  
      
    console.log('Profil utilisateur mis à jour:', profileData.profil_principal);  
  } catch (error) {  
    console.error('Erreur lors de la mise à jour du profil:', error);  
    throw error;  
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
  
// Fonction pour afficher l'option d'upload (appelée depuis le bouton "Mettre à jour mon CV")  
function showUploadOption() {  
  const cvFileInput = document.getElementById('cvFileInput');  
  if (cvFileInput) {  
    cvFileInput.click();  
  }  
}  
// Supprimer les données CV  
async function deleteCVData() {  
  const confirmed = confirm(  
    "⚠️ Attention ⚠️\n\n" +  
    "Cette action supprimera définitivement :\n" +  
    "- Votre profil professionnel détecté\n" +  
    "- Vos compétences analysées\n" +  
    "- L'historique d'analyse de votre CV\n\n" +  
    "Êtes-vous sûr de vouloir continuer ?"  
  );  
    
  if (!confirmed) return;  
    
  try {  
    if (!currentUser) {  
      showNotification("Utilisateur non authentifié", "error");  
      return;  
    }  
      
    const userDocRef = doc(db, "users", currentUser.uid);  
    await updateDoc(userDocRef, {  
      profile: null,  
      cvAnalyzed: false,  
      lastCVUpdate: null,  
      competences_cles: [],  
      niveau_confiance: 0  
    });  
      
    // Mettre à jour les données locales  
    userData.profile = null;  
    userData.cvAnalyzed = false;  
    userData.lastCVUpdate = null;  
    userData.competences_cles = [];  
    userData.niveau_confiance = 0;  
      
    // Rafraîchir l'affichage  
    displayUserProfile(userData);  
      
    showNotification("Données CV supprimées avec succès", "success");  
      
  } catch (error) {  
    console.error('Erreur lors de la suppression des données CV:', error);  
    showNotification('Erreur lors de la suppression des données CV', 'error');  
  }  
}
// Rendre la fonction globale pour l'utiliser dans le HTML  
window.showUploadOption = showUploadOption;  
window.handleCVUpload = handleCVUpload;  
  
// Initialisation une fois le DOM chargé  
document.addEventListener('DOMContentLoaded', function() {  
  console.log('Profile.js chargé avec succès');  
});  
 // Rendre les fonctions globales pour l'utiliser dans le HTML  
window.showUploadOption = showUploadOption;  
window.handleCVUpload = handleCVUpload;  
window.deleteCVData = deleteCVData; 
console.log('Profile.js chargé avec succès');