// Import Firebase modules    
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';    
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';    
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';    
    
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
  
// Fonction pour charger les formations depuis Firestore  
async function loadFormationsFromFirestore() {  
  try {  
    const formationsCollection = collection(db, 'formations');  
    const querySnapshot = await getDocs(formationsCollection);  
      
    const firestoreFormations = [];  
    querySnapshot.forEach((doc) => {  
      firestoreFormations.push({  
        id: doc.id,  
        ...doc.data()  
      });  
    });  
      
    console.log(`📚 ${firestoreFormations.length} formations chargées depuis Firestore`);  
    return firestoreFormations;  
      
  } catch (error) {  
    console.error('❌ Erreur lors du chargement depuis Firestore:', error);  
    return [];  
  }  
}  
  
// Vérifier l'état d'authentification    
onAuthStateChanged(auth, async (user) => {    
  if (user) {    
    await loadUserData(user.uid);    
    setupUserInterface();    
    await generateCourses(); // Maintenant asynchrone  
    setupCategoryFilters();    
    setupLogoClick();  
  } else {    
    window.location.href = "formup.html";    
  }    
});    
    
// Charger les données utilisateur depuis Firestore    
async function loadUserData(uid) {    
  try {    
    const userDoc = await getDoc(doc(db, "users", uid));    
    if (userDoc.exists()) {    
      const userData = userDoc.data();    
      updateUserInterface(userData);    
    } else {    
      updateUserInterface({     
        fullname: auth.currentUser.email,    
        email: auth.currentUser.email     
      });    
    }    
  } catch (error) {    
    console.error("Erreur lors du chargement des données utilisateur:", error);    
    updateUserInterface({     
      fullname: auth.currentUser.email,    
      email: auth.currentUser.email     
    });    
  }    
}    
    
// Mettre à jour l'interface utilisateur avec gestion du profil  
function updateUserInterface(userData) {    
  const userInitial = document.getElementById('userInitial');    
  const userName = document.getElementById('userName');    
  const userFullName = document.getElementById('userFullName');    
  const userEmail = document.getElementById('userEmail');    
  const userAvatarLarge = document.getElementById('userAvatarLarge');    
  const userProfile = document.getElementById('userProfile');  
      
  // Extraire le prénom et gérer le profil  
  const firstName = userData.fullname ? userData.fullname.split(' ')[0] : 'Utilisateur';    
  const firstLetter = userData.fullname ? firstName.charAt(0).toUpperCase() : '?';    
  const profile = userData.profile || 'Profil inconnu';  
      
  if (userInitial) userInitial.textContent = firstLetter;    
  if (userName) userName.textContent = firstName;  
  if (userFullName) userFullName.textContent = userData.fullname || 'Profil non déterminé';    
  if (userEmail) userEmail.textContent = userData.email || auth.currentUser?.email || 'email@example.com';    
  if (userAvatarLarge) userAvatarLarge.textContent = firstLetter;    
  if (userProfile) {  
    userProfile.textContent = profile;  
    userProfile.className = profile === 'Profil inconnu' ? 'user-profile unknown' : 'user-profile';  
  }  
}    
  
// Fonction pour mettre à jour le profil utilisateur après analyse CV  
async function updateUserProfile(profileData) {  
  try {  
    const user = auth.currentUser;  
    if (!user) return;  
      
    // Mettre à jour Firestore  
    const userDocRef = doc(db, "users", user.uid);  
    await updateDoc(userDocRef, {  
      profile: profileData.profil_principal || 'Profil inconnu',  
      cvAnalyzed: true,  
      lastCVUpdate: new Date().toISOString()  
    });  
      
    // Mettre à jour l'interface immédiatement  
    const userProfile = document.getElementById('userProfile');  
    if (userProfile) {  
      userProfile.textContent = profileData.profil_principal || 'Profil inconnu';  
      userProfile.className = profileData.profil_principal ? 'user-profile' : 'user-profile unknown';  
    }  
      
    console.log('Profil utilisateur mis à jour:', profileData.profil_principal);  
  } catch (error) {  
    console.error('Erreur lors de la mise à jour du profil:', error);  
  }  
}  
    
// Configurer les événements de l'interface utilisateur  
function setupUserInterface() {    
  const userAvatar = document.getElementById('userAvatar');    
  const userDropdown = document.getElementById('userDropdown');    
      
  if (userAvatar && userDropdown) {    
    userAvatar.addEventListener('click', (e) => {    
      e.stopPropagation();    
      userDropdown.classList.toggle('show');    
    });    
        
    document.addEventListener('click', () => {    
      userDropdown.classList.remove('show');    
    });    
        
    userDropdown.addEventListener('click', (e) => {    
      e.stopPropagation();    
    });    
  }    
    
  // Gestionnaires pour les nouveaux liens du menu profil    
  setupProfileMenuLinks();    
}    
    
// Configurer les liens du menu profil    
function setupProfileMenuLinks() {    
  const profileLink = document.getElementById('profileLink');    
  const settingsLink = document.getElementById('settingsLink');    
  const achievementsLink = document.getElementById('achievementsLink');    
      
  if (profileLink) {    
    profileLink.addEventListener('click', function(e) {    
      e.preventDefault();    
      window.location.href = 'profile.html';    
    });    
  }    
      
  if (settingsLink) {    
    settingsLink.addEventListener('click', function(e) {    
      e.preventDefault();    
      window.location.href = 'settings.html';    
    });    
  }    
      
  if (achievementsLink) {    
    achievementsLink.addEventListener('click', function(e) {    
      e.preventDefault();    
      window.location.href = 'achievements.html';    
    });    
  }
  const helpLink = document.getElementById('helpLink');  
  
if (helpLink) {  
  helpLink.addEventListener('click', function(e) {  
    e.preventDefault();  
    window.location.href = 'help.html';  
  });  
}    
}    
    
// Gestion du clic sur le logo    
function setupLogoClick() {    
  const logoLink = document.getElementById('logoLink');    
  if (logoLink) {    
    logoLink.addEventListener('click', function(e) {    
      e.preventDefault();    
          
      // Retirer toutes les classes active des catégories    
      const categoryBadges = document.querySelectorAll('.categories .category-badge');    
      categoryBadges.forEach(badge => badge.classList.remove('active'));    
          
      // Afficher toutes les formations    
      showAllCourses();    
          
      // Faire défiler vers la section des formations    
      const coursesSection = document.getElementById('courses-section');    
      if (coursesSection) {    
        coursesSection.scrollIntoView({     
          behavior: 'smooth',    
          block: 'start'    
        });    
      }    
    });    
  }    
}    
    
// Générer les cartes de formations depuis Firestore  
async function generateCourses() {    
  const coursesGrid = document.getElementById('coursesGrid');    
  if (!coursesGrid) return;    
    
  coursesGrid.innerHTML = '<div style="text-align: center; padding: 40px;"><p>🔄 Chargement des formations...</p></div>';  
    
  // Charger depuis Firestore  
  const firestoreFormations = await loadFormationsFromFirestore();  
    
  if (firestoreFormations.length === 0) {  
    coursesGrid.innerHTML = '<div style="text-align: center; padding: 40px;"><p>❌ Aucune formation disponible</p></div>';  
    return;  
  }  
    
  coursesGrid.innerHTML = '';  
    
  firestoreFormations.forEach((formation, index) => {  
    const courseCard = document.createElement('div');  
    courseCard.className = 'course-card';  
    courseCard.style.opacity = '0';  
    courseCard.style.transform = 'translateY(20px)';  
    courseCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';  
      
    courseCard.innerHTML = `  
      <img src="${formation.urlImage}" alt="${formation.titre}" class="course-image">  
      <div class="course-content">  
        <div class="course-meta">  
          <span class="course-category category-badge">${formation.categories}</span>  
          <span class="course-level" style="background: #e0f2fe; color: #0277bd; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 8px;">${formation.niveau}</span>  
        </div>  
        <h3 class="course-title">${formation.titre}</h3>  
        <p class="course-description">${formation.description}</p>  
        <div class="course-skills" style="margin: 10px 0; font-size: 14px;">  
          <strong>🎯 Compétences:</strong> ${formation.competencesAcquises.slice(0, 3).join(', ')}${formation.competencesAcquises.length > 3 ? '...' : ''}  
        </div>  
        <p class="course-instructor" style="color: #666; font-size: 14px;">👨‍🏫 ${formation.instructeur}</p>  
        <div class="course-stats">  
          <div class="course-info">  
            <span>⏱ ${formation.duree}</span>  
          </div>  
        </div>  
        <button class="course-button" onclick="window.open('${formation.lien}', '_blank')">  
          Commencer le cours  
        </button>  
      </div>  
    `;  
      
    coursesGrid.appendChild(courseCard);  
  });  
    
  setupScrollAnimation();  
}    
  
// Filtrer les formations par catégorie depuis Firestore  
async function filterCoursesByCategory(selectedCategory) {    
  const coursesGrid = document.getElementById('coursesGrid');    
  if (!coursesGrid) return;    
      
  coursesGrid.innerHTML = '<div style="text-align: center; padding: 40px;"><p>🔄 Filtrage des formations...</p></div>';  
    
  // Charger toutes les formations depuis Firestore  
  const allFormations = await loadFormationsFromFirestore();  
    
  // Mapper les catégories de navigation aux profils Firestore  
  const categoryMap = {    
    'Data Science': ['génie des données / data science', 'analyse de données / business intelligence'],    
    'Développement web': ['développement web'],    
    'DevOps': ['devops'],    
    'Sécurité': ['sécurité informatique / cybersécurité']    
  };    
      
  const filteredFormations = allFormations.filter(formation => {    
    return categoryMap[selectedCategory]?.includes(formation.profil);    
  });    
      
  coursesGrid.innerHTML = '';  
    
  // Afficher les formations filtrées    
  filteredFormations.forEach((formation, index) => {    
    const courseCard = document.createElement('div');    
    courseCard.className = 'course-card';    
    courseCard.style.opacity = '0';    
    courseCard.style.transform = 'translateY(20px)';    
    courseCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';    
        
    courseCard.innerHTML = `    
      <img src="${formation.urlImage}" alt="${formation.titre}" class="course-image">    
      <div class="course-content">    
        <div class="course-meta">    
          <span class="course-category category-badge">${formation.categories}</span>  
          <span class="course-level" style="background: #e0f2fe; color: #0277bd; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 8px;">${formation.niveau}</span>  
        </div>    
        <h3 class="course-title">${formation.titre}</h3>    
        <p class="course-description">${formation.description}</p>    
        <div class="course-skills" style="margin: 10px 0; font-size: 14px;">  
          <strong>🎯 Compétences:</strong> ${formation.competencesAcquises.slice(0, 3).join(', ')}${formation.competencesAcquises.length > 3 ? '...' : ''}  
        </div>  
        <p class="course-instructor" style="color: #666; font-size: 14px;">👨‍🏫 ${formation.instructeur}</p>    
        <div class="course-stats">    
          <div class="course-info">    
            <span>⏱ ${formation.duree}</span>    
          </div>    
        </div>    
        <button class="course-button" onclick="window.open('${formation.lien}', '_blank')">Commencer le cours</button>    
      </div>    
    `;    
        
    coursesGrid.appendChild(courseCard);    
  });    
      
  setupScrollAnimation();    
}    
  
// Afficher toutes les formations  
async function showAllCourses() {  
  await generateCourses();  
} 

// Configuration des filtres de catégories  
function setupCategoryFilters() {  
  const categoryBadges = document.querySelectorAll('.categories .category-badge');  
    
  categoryBadges.forEach(badge => {  
    badge.addEventListener('click', function(e) {  
      e.preventDefault();  
        
      // Retirer la classe active de tous les badges  
      categoryBadges.forEach(b => b.classList.remove('active'));  
        
      // Ajouter la classe active au badge cliqué  
      this.classList.add('active');  
        
      const categoryText = this.textContent.trim();  
        
      // Faire défiler vers la section des formations  
      const coursesSection = document.getElementById('courses-section');  
      if (coursesSection) {  
        coursesSection.scrollIntoView({   
          behavior: 'smooth',  
          block: 'start'  
        });  
      }  
        
      // Filtrer les formations après un petit délai pour le scroll  
      setTimeout(() => {  
        filterCoursesByCategory(categoryText);  
      }, 500);  
    });  
  });  
}  
  
// Configuration de l'animation au scroll  
function setupScrollAnimation() {  
  const observerOptions = {  
    threshold: 0.1,  
    rootMargin: '0px 0px -50px 0px'  
  };  
    
  const observer = new IntersectionObserver((entries) => {  
    entries.forEach(entry => {  
      if (entry.isIntersecting) {  
        entry.target.style.opacity = '1';  
        entry.target.style.transform = 'translateY(0)';  
      }  
    });  
  }, observerOptions);  
    
  document.querySelectorAll('.course-card').forEach(card => {  
    observer.observe(card);  
  });  
}  
  
// Gestion de l'upload CV avec intégration future du système d'analyse  
function handleFileUpload(event) {  
  const file = event.target.files[0];  
  if (!file) return;  
    
  const allowedTypes = [  
    'application/pdf',  
    'application/msword',  
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'  
  ];  
    
  if (file.size > 5 * 1024 * 1024) {  
    alert('Le fichier est trop volumineux (max 5MB)');  
    return;  
  }  
    
  if (!allowedTypes.includes(file.type)) {  
    alert('Type de fichier non supporté. Utilisez PDF, DOC ou DOCX.');  
    return;  
  }  
    
  console.log('CV uploadé:', file.name);  
    
  // Simulation de l'analyse (à remplacer par l'appel au service Python)  
  setTimeout(() => {  
    // Exemple de données retournées par le service Python  
    const mockProfileData = {  
      profil_principal: 'développement web', // ou null pour profil inconnu  
      niveau_confiance: 85,  
      competences_cles: ['JavaScript', 'React', 'Node.js']  
    };  
      
    updateUserProfile(mockProfileData);  
    alert(`CV "${file.name}" traité avec succès! Profil mis à jour.`);  
  }, 1000);  
}  
  
// Fonction de déconnexion  
function logout() {  
  signOut(auth).then(() => {  
    console.log('Utilisateur déconnecté');  
    window.location.href = "formup.html";  
  }).catch((error) => {  
    console.error('Erreur lors de la déconnexion:', error);  
  });  
}  
  
// Initialisation des gestionnaires d'événements pour l'upload CV  
document.addEventListener('DOMContentLoaded', function() {  
  const cvFileInput = document.getElementById('cvFile');  
  if (cvFileInput) {  
    cvFileInput.addEventListener('change', handleFileUpload);  
  }  
    
  // Gestionnaire pour le bouton de déconnexion  
  const logoutBtn = document.getElementById('logoutBtn');  
  if (logoutBtn) {  
    logoutBtn.addEventListener('click', logout);  
  }  
});