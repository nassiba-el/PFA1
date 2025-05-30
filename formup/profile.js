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
    
// Afficher le profil utilisateur    
function displayUserProfile(data) {    
  const userFullName = document.getElementById('userFullName');    
  const userEmail = document.getElementById('userEmail');    
      
  if (userFullName) {    
    userFullName.textContent = data.fullname || 'Nom utilisateur';    
  }    
      
  if (userEmail) {    
    userEmail.textContent = data.email || 'email@example.com';    
  }    
      
  const cvAnalyzedSection = document.getElementById('cvAnalyzedSection');    
  const cvPromptBar = document.getElementById('cvPromptBar');    
      
  if (data.cvAnalyzed && data.profile) {    
    if (cvAnalyzedSection) {    
      cvAnalyzedSection.style.display = 'block';    
      displayProfileInfo(data);    
      displayCompetences(data.competences_cles || []);    
      displayAdditionalInfo(data);    
    }    
    if (cvPromptBar) cvPromptBar.style.display = 'none';    
  } else {    
    if (cvAnalyzedSection) cvAnalyzedSection.style.display = 'none';    
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
    
// Afficher les informations additionnelles avec formations web dev  
function displayAdditionalInfo(data) {    
  const formationsRecommandees = document.getElementById('formationsRecommandees');    
    
  if (formationsRecommandees) {      
    // Formations de développement web hardcodées  
    const webDevFormations = [    
      {    
        titre: "HTML & CSS Fundamentals",    
        description: "Apprenez les bases du développement web avec HTML5 et CSS3",    
        niveau: "Débutant",    
        duree: "20h",    
        instructeur: "Expert Web",    
        lien: "https://www.codecademy.com/learn/learn-html"    
      },    
      {    
        titre: "JavaScript ES6+",    
        description: "Maîtrisez JavaScript moderne pour le développement web",    
        niveau: "Intermédiaire",     
        duree: "30h",    
        instructeur: "Dev JavaScript",    
        lien: "https://www.codecademy.com/learn/introduction-to-javascript"    
      },    
      {    
        titre: "React.js Development",    
        description: "Créez des applications web modernes avec React",    
        niveau: "Avancé",    
        duree: "40h",     
        instructeur: "React Expert",    
        lien: "https://reactjs.org/tutorial/tutorial.html"    
      },  
      {    
        titre: "Node.js & Express",    
        description: "Développement backend avec Node.js et Express",    
        niveau: "Intermédiaire",    
        duree: "25h",    
        instructeur: "Backend Expert",    
        lien: "https://nodejs.org/en/docs/"    
      }  
    ];    
        
    const webDevFormationsList = webDevFormations.map(formation =>       
      `<div class="formation-card">      
         <h4>${formation.titre}</h4>      
         <p class="formation-description">${formation.description}</p>      
         <div class="formation-meta">      
           <span class="niveau-badge">${formation.niveau}</span>      
           <span class="duree">⏱ ${formation.duree}</span>      
           <span class="instructeur">👨‍🏫 ${formation.instructeur}</span>      
         </div>      
         <a href="${formation.lien}" target="_blank" class="formation-link">Commencer la formation</a>      
       </div>`      
    ).join('');    
        
    formationsRecommandees.innerHTML = webDevFormationsList;    
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
  const cvFileInput = document.getElementById('cvFileInput');    
  if (cvFileInput) {    
    cvFileInput.addEventListener('change', handleCVUpload);    
  }    
}    
    
// VERSION DEMO - Affiche toujours un profil développeur web  
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
      
  // Données hardcodées pour développeur web - TOUJOURS les mêmes  
  setTimeout(async () => {    
    try {    
      const profileData = {    
        profil_principal: 'développement web',    
        competences_cles: ['HTML', 'CSS', 'JavaScript', 'C', 'Java', 'Python'],    
        niveau_confiance: 90,  
        formations_recommandees: []  
      };    
          
      await updateUserProfile(profileData);    
      showNotification(`CV "${file.name}" analysé avec succès! Profil développeur web détecté.`, 'success');    
          
      await loadUserProfile(currentUser.uid);    
          
    } catch (error) {    
      console.error('Erreur lors de l\'analyse du CV:', error);    
      showNotification('Erreur lors de l\'analyse du CV', 'error');    
    }    
  }, 1500);    
}    
    
// Mettre à jour le profil utilisateur    
async function updateUserProfile(profileData) {    
  try {    
    if (!currentUser) return;    
        
    const userDocRef = doc(db, "users", currentUser.uid);    
    await updateDoc(userDocRef, {    
      profile: profileData.profil_principal || 'Profil inconnu',    
      cvAnalyzed: true,    
      lastCVUpdate: new Date().toISOString(),    
      competences_cles: profileData.competences_cles || [],    
      formations_recommandees: profileData.formations_recommandees || [],    
      niveau_confiance: profileData.niveau_confiance || 0    
    });   
        
    console.log('Profil utilisateur mis à jour:', profileData.profil_principal);    
  } catch (error) {    
    console.error('Erreur lors de la mise à jour du profil:', error);    
    throw error;    
  }    
}    
    
// Système de notifications  
function showNotification(message, type = 'info') {    
  const existingNotifications = document.querySelectorAll('.notification');    
  existingNotifications.forEach(notif => notif.remove());    
      
  const notification = document.createElement('div');    
  notification.className = `notification notification-${type}`;    
  notification.innerHTML = `    
    <div class="notification-content">    
      <span class="notification-message">${message}</span>    
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>    
    </div>    
  `;    
      
  if (!document.querySelector('#notification-styles')) {    
    const styles = document.createElement('style');    
    styles.id = 'notification-styles';    
    styles.textContent = `    
      .notification {    
        position: fixed; top: 20px; right: 20px; z-index: 1000;    
        max-width: 400px; border-radius: 8px; padding: 12px 16px;  
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);    
        animation: slideIn 0.3s ease-out;    
      }    
      .notification-success { background: #10b981; color: white; }    
      .notification-error { background: #ef4444; color: white; }    
      .notification-info { background: #3b82f6; color: white; }    
      .notification-content { display: flex; justify-content: space-between; align-items: center; }    
      .notification-close { background: none; border: none; color: inherit; cursor: pointer; }    
      @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }    
    `;    
    document.head.appendChild(styles);    
  }    
      
  document.body.appendChild(notification);    
      
  setTimeout(() => {    
    if (notification.parentElement) notification.remove();    
  }, 5000);    
}    
  
function showUploadOption() {    
  const cvFileInput = document.getElementById('cvFileInput');    
  if (cvFileInput) {    
    cvFileInput.click();    
  }    
}    
  
// Rendre les fonctions globales    
window.showUploadOption = showUploadOption;    
window.handleCVUpload = handleCVUpload;    
  
// Initialisation    
document.addEventListener('DOMContentLoaded', function() {    
  console.log('Profile.js chargé avec succès - Version Demo Développeur Web');    
});