// Import Firebase modules  
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';  
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';  
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';  
  
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
  
// Vérifier l'état d'authentification  
onAuthStateChanged(auth, (user) => {  
  if (user) {  
    currentUser = user;  
    // Pré-remplir l'email dans le formulaire de contact  
    const contactEmail = document.getElementById('contactEmail');  
    if (contactEmail) {  
      contactEmail.value = user.email;  
    }  
  } else {  
    // Rediriger vers la page de connexion si pas authentifié  
    window.location.href = "formup.html";  
  }  
});  
  
// Initialisation une fois le DOM chargé  
document.addEventListener('DOMContentLoaded', function() {  
  setupNavigation();  
  setupFAQ();  
  setupSearch();  
  setupContactForm();  
  console.log('Help.js chargé avec succès');  
});  
  
// Configuration de la navigation entre sections  
function setupNavigation() {  
  const navButtons = document.querySelectorAll('.nav-btn');  
  const sections = document.querySelectorAll('.help-section');  
  
  navButtons.forEach(button => {  
    button.addEventListener('click', () => {  
      const targetSection = button.getAttribute('data-section');  
        
      // Mettre à jour les boutons actifs  
      navButtons.forEach(btn => btn.classList.remove('active'));  
      button.classList.add('active');  
        
      // Afficher la section correspondante  
      sections.forEach(section => {  
        section.classList.remove('active');  
        if (section.id === `${targetSection}-section`) {  
          section.classList.add('active');  
        }  
      });  
    });  
  });  
}  
  
// Configuration des FAQ accordéons  
function setupFAQ() {  
  const faqItems = document.querySelectorAll('.faq-item');  
    
  faqItems.forEach(item => {  
    const question = item.querySelector('.faq-question');  
      
    question.addEventListener('click', () => {  
      const isOpen = item.classList.contains('open');  
        
      // Fermer tous les autres items  
      faqItems.forEach(otherItem => {  
        otherItem.classList.remove('open');  
      });  
        
      // Ouvrir/fermer l'item cliqué  
      if (!isOpen) {  
        item.classList.add('open');  
      }  
    });  
  });  
}  
  
// Configuration de la recherche  
function setupSearch() {  
  const searchInput = document.getElementById('searchInput');  
  const faqItems = document.querySelectorAll('.faq-item');  
    
  searchInput.addEventListener('input', (e) => {  
    const searchTerm = e.target.value.toLowerCase();  
      
    if (searchTerm === '') {  
      // Afficher tous les items si la recherche est vide  
      faqItems.forEach(item => {  
        item.style.display = 'block';  
      });  
      return;  
    }  
      
    // Filtrer les FAQ selon le terme de recherche  
    faqItems.forEach(item => {  
      const question = item.querySelector('.faq-question h3').textContent.toLowerCase();  
      const answer = item.querySelector('.faq-answer').textContent.toLowerCase();  
        
      if (question.includes(searchTerm) || answer.includes(searchTerm)) {  
        item.style.display = 'block';  
        // Surligner le terme recherché  
        highlightSearchTerm(item, searchTerm);  
      } else {  
        item.style.display = 'none';  
      }  
    });  
    // Basculer automatiquement vers la section FAQ lors de la recherche  
    if (searchTerm !== '') {  
      const faqButton = document.querySelector('[data-section="faq"]');  
      if (faqButton && !faqButton.classList.contains('active')) {  
        faqButton.click();  
      }  
    }  
  });  
}  
  
// Fonction pour surligner les termes de recherche  
function highlightSearchTerm(item, searchTerm) {  
  const question = item.querySelector('.faq-question h3');  
  const answer = item.querySelector('.faq-answer');  
    
  // Restaurer le texte original  
  const originalQuestion = question.textContent;  
  const originalAnswer = answer.textContent;  
    
  // Créer une regex pour le terme de recherche (insensible à la casse)  
  const regex = new RegExp(`(${searchTerm})`, 'gi');  
    
  // Surligner dans la question  
  const highlightedQuestion = originalQuestion.replace(regex, '<mark>$1</mark>');  
  question.innerHTML = highlightedQuestion;  
    
  // Surligner dans la réponse  
  const highlightedAnswer = originalAnswer.replace(regex, '<mark>$1</mark>');  
  answer.innerHTML = answer.innerHTML.replace(originalAnswer, highlightedAnswer);  
}  
  
// Configuration du formulaire de contact  
function setupContactForm() {  
  const contactForm = document.getElementById('contactForm');  
    
  if (contactForm) {  
    contactForm.addEventListener('submit', handleContactSubmit);  
  }  
}  
  
// Gestionnaire de soumission du formulaire de contact  
async function handleContactSubmit(event) {  
  event.preventDefault();  
    
  const submitBtn = document.querySelector('.submit-btn');  
  const originalText = submitBtn.innerHTML;  
    
  // État de chargement  
  submitBtn.disabled = true;  
  submitBtn.innerHTML = `  
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="animate-spin">  
      <circle cx="12" cy="12" r="10"/>  
      <path d="M12 6v6l4 2"/>  
    </svg>  
    Envoi en cours...  
  `;  
    
  try {  
    const formData = {  
      subject: document.getElementById('contactSubject').value,  
      message: document.getElementById('contactMessage').value,  
      email: document.getElementById('contactEmail').value,  
      userId: currentUser ? currentUser.uid : null,  
      timestamp: new Date().toISOString(),  
      status: 'nouveau'  
    };  
      
    // Sauvegarder le message dans Firestore  
    await addDoc(collection(db, 'support_messages'), formData);  
      
    showNotification('Message envoyé avec succès ! Notre équipe vous répondra sous 24h.', 'success');  
      
    // Réinitialiser le formulaire  
    document.getElementById('contactForm').reset();  
      
    // Pré-remplir à nouveau l'email si l'utilisateur est connecté  
    if (currentUser) {  
      document.getElementById('contactEmail').value = currentUser.email;  
    }  
      
  } catch (error) {  
    console.error('Erreur lors de l\'envoi du message:', error);  
    showNotification('Erreur lors de l\'envoi du message. Veuillez réessayer.', 'error');  
  } finally {  
    // Restaurer le bouton  
    submitBtn.disabled = false;  
    submitBtn.innerHTML = originalText;  
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
    
  // Ajouter les styles pour la notification si pas déjà présents  
  if (!document.querySelector('#notification-styles')) {  
    const styles = document.createElement('style');  
    styles.id = 'notification-styles';  
    styles.textContent = `  
      .notification {  
        position: fixed;  
        top: 20px;  
        right: 20px;  
        z-index: 1001;  
        max-width: 400px;  
        border-radius: 8px;  
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);  
        animation: slideInRight 0.3s ease-out;  
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
        font-size: 14px;  
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
        
      @keyframes slideInRight {  
        from {  
          transform: translateX(100%);  
          opacity: 0;  
        }  
        to {  
          transform: translateX(0);  
          opacity: 1;  
        }  
      }  
        
      .animate-spin {  
        animation: spin 1s linear infinite;  
      }  
        
      @keyframes spin {  
        from { transform: rotate(0deg); }  
        to { transform: rotate(360deg); }  
      }  
    `;  
    document.head.appendChild(styles);  
  }  
    
  // Ajouter la notification au DOM  
  document.body.appendChild(notification);  
    
  // Supprimer automatiquement après 5 secondes  
  setTimeout(() => {  
    if (notification.parentElement) {  
      notification.style.animation = 'slideInRight 0.3s ease-out reverse';  
      setTimeout(() => notification.remove(), 300);  
    }  
  }, 5000);  
}  
  
// Gestion des raccourcis clavier  
document.addEventListener('keydown', function(event) {  
  // Échap pour fermer les FAQ ouvertes  
  if (event.key === 'Escape') {  
    const openFaqItems = document.querySelectorAll('.faq-item.open');  
    openFaqItems.forEach(item => item.classList.remove('open'));  
  }  
    
  // Ctrl+F ou Cmd+F pour focus sur la recherche  
  if ((event.ctrlKey || event.metaKey) && event.key === 'f') {  
    event.preventDefault();  
    const searchInput = document.getElementById('searchInput');  
    if (searchInput) {  
      searchInput.focus();  
    }  
  }  
});  
  
// Ajouter le gestionnaire d'événements pour le lien Centre d'aide dans home.js  
// Cette fonction sera appelée depuis home.js pour configurer la navigation  
window.setupHelpLink = function() {  
  const helpLink = document.getElementById('helpLink');  
  if (helpLink) {  
    helpLink.addEventListener('click', function(e) {  
      e.preventDefault();  
      window.location.href = 'help.html';  
    });  
  }  
};  
  
console.log('Help.js chargé avec succès');
