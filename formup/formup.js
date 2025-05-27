// Configuration et initialisation  
document.addEventListener('DOMContentLoaded', function() {  
  console.log('FormUp Landing Page chargée');  
    
  // Animation d'entrée pour le contenu hero  
  animateHeroContent();  
    
  // Gestion des boutons avec animations  
  setupButtonAnimations();  
});  
  
// Animation du contenu hero  
function animateHeroContent() {  
  const heroContent = document.querySelector('.hero-content');  
  const heroTitle = document.querySelector('.hero-title');  
  const heroDescription = document.querySelector('.hero-description');  
  const heroButtons = document.querySelector('.hero-buttons');  
    
  if (heroContent) {  
    // Animation d'apparition progressive  
    setTimeout(() => {  
      heroTitle.style.opacity = '0';  
      heroTitle.style.transform = 'translateY(30px)';  
      heroTitle.style.transition = 'all 0.8s ease';  
        
      setTimeout(() => {  
        heroTitle.style.opacity = '1';  
        heroTitle.style.transform = 'translateY(0)';  
      }, 100);  
        
      setTimeout(() => {  
        heroDescription.style.opacity = '0';  
        heroDescription.style.transform = 'translateY(20px)';  
        heroDescription.style.transition = 'all 0.8s ease';  
          
        setTimeout(() => {  
          heroDescription.style.opacity = '1';  
          heroDescription.style.transform = 'translateY(0)';  
        }, 100);  
      }, 300);  
        
      setTimeout(() => {  
        heroButtons.style.opacity = '0';  
        heroButtons.style.transform = 'translateY(20px)';  
        heroButtons.style.transition = 'all 0.8s ease';  
          
        setTimeout(() => {  
          heroButtons.style.opacity = '1';  
          heroButtons.style.transform = 'translateY(0)';  
        }, 100);  
      }, 600);  
    }, 200);  
  }  
}  
  
// Configuration des animations des boutons  
function setupButtonAnimations() {  
  const buttons = document.querySelectorAll('.btn-primary, .btn-outline');  
    
  buttons.forEach(button => {  
    // Effet de pulsation au survol  
    button.addEventListener('mouseenter', function() {  
      this.style.transform = 'translateY(-2px) scale(1.02)';  
    });  
      
    button.addEventListener('mouseleave', function() {  
      this.style.transform = 'translateY(0) scale(1)';  
    });  
      
    // Effet de clic  
    button.addEventListener('mousedown', function() {  
      this.style.transform = 'translateY(0) scale(0.98)';  
    });  
      
    button.addEventListener('mouseup', function() {  
      this.style.transform = 'translateY(-2px) scale(1.02)';  
    });  
  });  
}  
  
// Gestion du redimensionnement de la fenêtre  
window.addEventListener('resize', function() {  
  // Ajustement responsive si nécessaire  
  adjustResponsiveLayout();  
});  
  
function adjustResponsiveLayout() {  
  const heroContent = document.querySelector('.hero-content');  
  const windowWidth = window.innerWidth;  
    
  if (windowWidth < 768) {  
    // Ajustements pour mobile  
    heroContent.style.padding = '0 1rem';  
  } else {  
    // Ajustements pour desktop  
    heroContent.style.padding = '0 2rem';  
  }  
}  
  
// Fonction utilitaire pour la navigation  
function navigateToPage(url) {  
  window.location.href = url;  
}  
  
// Export des fonctions pour utilisation externe si nécessaire  
window.FormUpLanding = {  
  navigateToPage,  
  animateHeroContent,  
  setupButtonAnimations  
};