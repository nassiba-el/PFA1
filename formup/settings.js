// Import Firebase modules  
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';  
import { getAuth, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';  
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';  
  
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
let userSettings = {};  
  
// Vérifier l'état d'authentification  
onAuthStateChanged(auth, async (user) => {  
  if (user) {  
    currentUser = user;  
    await loadUserSettings(user.uid);  
    setupEventHandlers();  
  } else {  
    window.location.href = "formup.html";  
  }  
});  
  
// Charger les paramètres utilisateur  
async function loadUserSettings(uid) {  
  try {  
    const userDoc = await getDoc(doc(db, "users", uid));  
        
    if (userDoc.exists()) {  
      userSettings = userDoc.data();  
      applySettings(userSettings);  
    } else {  
      // Paramètres par défaut  
      userSettings = {  
        theme: 'light',  
        language: 'fr-FR',  
        emailNotifications: true,  
        recommendations: true,  
        twoFactor: false  
      };  
      applySettings(userSettings);  
    }  
  } catch (error) {  
    console.error("Erreur lors du chargement des paramètres:", error);  
    showNotification("Erreur lors du chargement des paramètres", "error");  
  }  
}  
  
// Appliquer les paramètres à l'interface  
function applySettings(settings) {  
  // Thème  
  const themeSelect = document.getElementById('themeSelect');  
  if (themeSelect) {  
    themeSelect.value = settings.theme || 'light';  
    applyTheme(settings.theme || 'light');  
  }  
    
  // Langue  
  const languageSelect = document.getElementById('languageSelect');  
  if (languageSelect) {  
    languageSelect.value = settings.language || 'fr-FR';  
  }  
    
  // Notifications email  
  const emailToggle = document.getElementById('emailNotificationsToggle');  
  if (emailToggle) {  
    emailToggle.checked = settings.emailNotifications !== false;  
  }  
    
  // Recommandations  
  const recommendationsToggle = document.getElementById('recommendationsToggle');  
  if (recommendationsToggle) {  
    recommendationsToggle.checked = settings.recommendations !== false;  
  }  
    
  // 2FA  
  const twoFactorToggle = document.getElementById('twoFactorToggle');  
  if (twoFactorToggle) {  
    twoFactorToggle.checked = settings.twoFactor === true;  
  }  
}  
  
// Appliquer le thème  
function applyTheme(theme) {  
  const body = document.body;  
      
  if (theme === 'dark') {  
    body.classList.add('dark-theme');  
  } else if (theme === 'auto') {  
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;  
    if (prefersDark) {  
      body.classList.add('dark-theme');  
    } else {  
      body.classList.remove('dark-theme');  
    }  
  } else {  
    body.classList.remove('dark-theme');  
  }  
}  
  
// Configuration des gestionnaires d'événements  
function setupEventHandlers() {  
  // Changement de mot de passe  
  const changePasswordBtn = document.getElementById('changePasswordBtn');  
  const passwordModal = document.getElementById('passwordModal');  
  const closePasswordModal = document.getElementById('closePasswordModal');  
  const cancelPasswordChange = document.getElementById('cancelPasswordChange');  
  const passwordForm = document.getElementById('passwordForm');  
    
  if (changePasswordBtn) {  
    changePasswordBtn.addEventListener('click', () => {  
      passwordModal.style.display = 'block';  
    });  
  }  
    
  if (closePasswordModal) {  
    closePasswordModal.addEventListener('click', () => {  
      passwordModal.style.display = 'none';  
    });  
  }  
    
  if (cancelPasswordChange) {  
    cancelPasswordChange.addEventListener('click', () => {  
      passwordModal.style.display = 'none';  
    });  
  }  
    
  if (passwordForm) {  
    passwordForm.addEventListener('submit', handlePasswordChange);  
  }  
    
  // Fermer modal en cliquant à l'extérieur  
  window.addEventListener('click', (event) => {  
    if (event.target === passwordModal) {  
      passwordModal.style.display = 'none';  
    }  
  });  
    
  // Changement de thème  
  const themeSelect = document.getElementById('themeSelect');  
  if (themeSelect) {  
    themeSelect.addEventListener('change', async (e) => {  
      const newTheme = e.target.value;  
      applyTheme(newTheme);  
      await saveSettings({ theme: newTheme });  
    });  
  }  
    
  // Changement de langue  
  const languageSelect = document.getElementById('languageSelect');  
  if (languageSelect) {  
    languageSelect.addEventListener('change', async (e) => {  
      const newLanguage = e.target.value;  
      await saveSettings({ language: newLanguage });  
    });  
  }  
    
  // Notifications email  
  const emailToggle = document.getElementById('emailNotificationsToggle');  
  if (emailToggle) {  
    emailToggle.addEventListener('change', async (e) => {  
      await saveSettings({ emailNotifications: e.target.checked });  
    });  
  }  
    
  // Recommandations  
  const recommendationsToggle = document.getElementById('recommendationsToggle');  
  if (recommendationsToggle) {  
    recommendationsToggle.addEventListener('change', async (e) => {  
      await saveSettings({ recommendations: e.target.checked });  
    });  
  }  
    
  // 2FA  
  const twoFactorToggle = document.getElementById('twoFactorToggle');  
  if (twoFactorToggle) {  
    twoFactorToggle.addEventListener('change', async (e) => {  
      if (e.target.checked) {  
        showNotification("La 2FA sera bientôt disponible", "info");  
        e.target.checked = false;  
      } else {  
        await saveSettings({ twoFactor: false });  
      }  
    });  
  }  
    
  // Suppression du compte  
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');  
  if (deleteAccountBtn) {  
    deleteAccountBtn.addEventListener('click', handleAccountDeletion);  
  }  
}  
  
// Gestionnaire de changement de mot de passe  
async function handlePasswordChange(event) {  
  event.preventDefault();  
      
  const currentPassword = document.getElementById('currentPassword').value;  
  const newPassword = document.getElementById('newPassword').value;  
  const confirmPassword = document.getElementById('confirmPassword').value;  
    
  // Validation  
  if (newPassword !== confirmPassword) {  
    showNotification("Les mots de passe ne correspondent pas", "error");  
    return;  
  }  
    
  if (newPassword.length < 6) {  
    showNotification("Le mot de passe doit contenir au moins 6 caractères", "error");  
    return;  
  }  
    
  try {  
    // Réauthentifier l'utilisateur  
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);  
    await reauthenticateWithCredential(currentUser, credential);  
    
    // Mettre à jour le mot de passe  
    await updatePassword(currentUser, newPassword);  
    
    showNotification("Mot de passe mis à jour avec succès", "success");  
    document.getElementById('passwordModal').style.display = 'none';  
    document.getElementById('passwordForm').reset();  
    
  } catch (error) {  
    console.error("Erreur lors du changement de mot de passe:", error);  
    if (error.code === 'auth/wrong-password') {  
      showNotification("Mot de passe actuel incorrect", "error");  
    } else {  
      showNotification("Erreur lors du changement de mot de passe", "error");  
    }  
  }  
}  
  
// Sauvegarder les paramètres  
async function saveSettings(newSettings) {  
  if (!currentUser) return;  
    
  try {  
    const userDocRef = doc(db, "users", currentUser.uid);  
        
    // Fusionner avec les paramètres existants  
    userSettings = { ...userSettings, ...newSettings };  
        
    await updateDoc(userDocRef, {  
      settings: userSettings,  
      lastSettingsUpdate: new Date().toISOString()  
    });  
    
    console.log('Paramètres sauvegardés:', newSettings);  
  } catch (error) {  
    console.error('Erreur lors de la sauvegarde des paramètres:', error);  
    showNotification("Erreur lors de la sauvegarde", "error");  
  }  
}  
  
// Gestionnaire de suppression du compte  
async function handleAccountDeletion() {  
  const confirmed = confirm(  
    "⚠️ ATTENTION ⚠️\n\n" +  
    "Cette action supprimera définitivement votre compte et toutes vos données.\n" +  
    "Cette action est irréversible.\n\n" +  
    "Êtes-vous sûr de vouloir continuer ?"  
  );  
    
  if (!confirmed) return;  
    
  const doubleConfirm = confirm(  
    "Dernière confirmation :\n\n" +  
    "Tapez 'SUPPRIMER' dans la prochaine boîte de dialogue pour confirmer la suppression de votre compte."  
  );  
    
  if (!doubleConfirm) return;  
    
  const confirmText = prompt("Tapez 'SUPPRIMER' pour confirmer :");  
      
  if (confirmText !== 'SUPPRIMER') {  
    showNotification("Suppression annulée", "info");  
    return;  
  }  
    
  try {  
    // Supprimer les données utilisateur de Firestore  
    const userDocRef = doc(db, "users", currentUser.uid);  
    await deleteDoc(userDocRef);  
    
    // Supprimer le compte utilisateur  
    await deleteUser(currentUser);  
    
    alert("Votre compte a été supprimé avec succès. Vous allez être redirigé vers la page d'accueil.");  
    window.location.href = "formup.html";  
    
  } catch (error) {  
    console.error("Erreur lors de la suppression du compte:", error);  
    if (error.code === 'auth/requires-recent-login') {  
      showNotification("Veuillez vous reconnecter avant de supprimer votre compte", "error");  
    } else {  
      showNotification("Erreur lors de la suppression du compte", "error");  
    }  
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
  // Échap pour fermer les modals  
  if (event.key === 'Escape') {  
    const passwordModal = document.getElementById('passwordModal');  
    if (passwordModal && passwordModal.style.display === 'block') {  
      passwordModal.style.display = 'none';  
    }  
  }  
});  
  
// Écouter les changements de préférence système pour le thème auto  
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {  
  const themeSelect = document.getElementById('themeSelect');  
  if (themeSelect && themeSelect.value === 'auto') {  
    applyTheme('auto');  
  }  
});  
  
// Initialisation une fois le DOM chargé  
document.addEventListener('DOMContentLoaded', function() {  
  console.log('Settings.js chargé avec succès');  
});  
  
console.log('Settings module initialized');
