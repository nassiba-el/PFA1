// Import Firebase modules  
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';  
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';  
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';  
  
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
  
// Données des 30 formations avec nouvelles catégories  
const formations = [  
  {  
    category: "Génie logiciel",  
    title: "Architecture logicielle moderne",  
    description: "Maîtrisez les principes de l'architecture logicielle et les design patterns.",  
    instructor: "Jean Dupont",  
    duration: "30 heures",  
    students: "1,500",  
    rating: "4.9",  
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Cybersécurité",  
    title: "Ethical Hacking et Pentesting",  
    description: "Apprenez les techniques de test de pénétration éthique.",  
    instructor: "Marie Sécurité",  
    duration: "40 heures",  
    students: "800",  
    rating: "4.8",  
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Data Science",  
    title: "Machine Learning avec Python",  
    description: "Maîtrisez les algorithmes de machine learning avec Python.",  
    instructor: "Pierre Data",  
    duration: "35 heures",  
    students: "2,000",  
    rating: "4.9",  
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Développement web",  
    title: "Full Stack JavaScript",  
    description: "Développez des applications web complètes avec Node.js et React.",  
    instructor: "Sophie Web",  
    duration: "45 heures",  
    students: "3,200",  
    rating: "4.7",  
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Intelligence artificielle",  
    title: "Deep Learning avec TensorFlow",  
    description: "Créez des réseaux de neurones profonds avec TensorFlow.",  
    instructor: "Marc IA",  
    duration: "50 heures",  
    students: "1,800",  
    rating: "4.8",  
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop"  
  },  
  {  
    category: "DevOps",  
    title: "Docker et Kubernetes",  
    description: "Maîtrisez la conteneurisation et l'orchestration.",  
    instructor: "Paul DevOps",  
    duration: "38 heures",  
    students: "1,400",  
    rating: "4.6",  
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Cloud Computing",  
    title: "AWS Solutions Architect",  
    description: "Concevez des architectures cloud scalables sur AWS.",  
    instructor: "Anne Cloud",  
    duration: "42 heures",  
    students: "2,500",  
    rating: "4.9",  
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Développement mobile",  
    title: "React Native Cross-Platform",  
    description: "Développez des applications mobiles pour iOS et Android.",  
    instructor: "Lucas Mobile",  
    duration: "35 heures",  
    students: "1,600",  
    rating: "4.7",  
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Réseaux et télécommunications",  
    title: "Administration réseau avancée",  
    description: "Maîtrisez la configuration et la sécurisation des réseaux.",  
    instructor: "Thomas Réseau",  
    duration: "32 heures",  
    students: "900",  
    rating: "4.5",  
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Blockchain",  
    title: "Développement Blockchain Ethereum",  
    description: "Créez des smart contracts et des DApps sur Ethereum.",  
    instructor: "Julie Blockchain",  
    duration: "28 heures",  
    students: "1,100",  
    rating: "4.8",  
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop"  
  },  
  {  
    category: "UX/UI Design",  
    title: "Design d'interfaces modernes",  
    description: "Créez des interfaces utilisateur attrayantes et fonctionnelles.",  
    instructor: "Emma Design",  
    duration: "25 heures",  
    students: "2,200",  
    rating: "4.6",  
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Testing et assurance qualité",  
    title: "Tests automatisés avec Selenium",  
    description: "Automatisez vos tests pour garantir la qualité logicielle.",  
    instructor: "Alex QA",  
    duration: "30 heures",  
    students: "1,300",  
    rating: "4.4",  
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Analyse de données",  
    title: "Business Intelligence avec Power BI",  
    description: "Transformez vos données en insights business.",  
    instructor: "Sarah BI",  
    duration: "26 heures",  
    students: "1,700",  
    rating: "4.7",  
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Informatique embarquée",  
    title: "Programmation Arduino et IoT",  
    description: "Développez des systèmes embarqués connectés.",  
    instructor: "Kevin IoT",  
    duration: "33 heures",  
    students: "850",  
    rating: "4.5",  
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Réalité virtuelle et augmentée",  
    title: "Développement VR/AR avec Unity",  
    description: "Créez des expériences immersives en réalité virtuelle.",  
    instructor: "Nina VR",  
    duration: "40 heures",  
    students: "650",  
    rating: "4.8",  
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Développement de jeux vidéo",  
    title: "Game Development avec Unity",  
    description: "Développez vos propres jeux vidéo 2D et 3D.",  
    instructor: "Max Game",  
    duration: "48 heures",  
    students: "1,900",  
    rating: "4.9",  
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Automatisation et robotique",  
    title: "Robotique industrielle",  
    description: "Programmez et contrôlez des robots industriels.",  
    instructor: "Robert Robot",  
    duration: "36 heures",  
    students: "750",  
    rating: "4.6",  
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Informatique quantique",  
    title: "Introduction au calcul quantique",  
    description: "Explorez les principes de l'informatique quantique.",  
    instructor: "Quantum Alice",  
    duration: "20 heures",  
    students: "400",  
    rating: "4.7",  
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Scrum Master",  
    title: "Certification Scrum Master",  
    description: "Devenez un Scrum Master certifié et agile.",  
    instructor: "Agile Sam",  
    duration: "24 heures",  
    students: "2,100",  
    rating: "4.8",  
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Support IT",  
    title: "Administration systèmes Windows/Linux",  
    description: "Maîtrisez l'administration des systèmes d'exploitation.",  
    instructor: "Admin Steve",  
    duration: "35 heures",  
    students: "1,500",  
    rating: "4.5",  
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Génie logiciel",  
    title: "Microservices avec Spring Boot",  
    description: "Architecturez des applications avec des microservices.",  
    instructor: "Spring Master",  
    duration: "38 heures",  
    students: "1,800",  
    rating: "4.7",  
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Cybersécurité",  
    title: "Sécurité des applications web",  
    description: "Sécurisez vos applications contre les cyberattaques.",  
    instructor: "Cyber Guard",  
    duration: "32 heures",  
    students: "1,200",  
    rating: "4.8",  
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Data Science",  
    title: "Big Data avec Apache Spark",  
    description: "Traitez de gros volumes de données avec Spark.",  
    instructor: "Big Data Bob",  
    duration: "42 heures",  
    students: "1,100",  
    rating: "4.6",  
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Développement web",  
    title: "Vue.js et Nuxt.js",  
    description: "Développez des applications web modernes avec Vue.js.",  
    instructor: "Vue Expert",  
    duration: "30 heures",  
    students: "1,600",  
    rating: "4.7",  
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Intelligence artificielle",  
    title: "Computer Vision avec OpenCV",  
    description: "Développez des applications de vision par ordinateur.",  
    instructor: "Vision Pro",  
    duration: "35 heures",  
    students: "950",  
    rating: "4.8",  
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop"  
  },  
  {  
    category: "DevOps",  
    title: "CI/CD avec Jenkins et GitLab",  
    description: "Automatisez vos déploiements avec CI/CD.",  
    instructor: "Deploy Dan",  
    duration: "28 heures",  
    students: "1,400",  
    rating: "4.6",  
    image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Cloud Computing",  
    title: "Microsoft Azure Fundamentals",  
    description: "Maîtrisez les services cloud de Microsoft Azure.",  
    instructor: "Azure Ann",  
    duration: "30 heures",  
    students: "2,000",  
    rating: "4.7",  
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Développement mobile",  
    title: "Flutter pour iOS et Android",  
    description: "Créez des applications mobiles avec Flutter.",  
    instructor: "Flutter Fred",  
    duration: "32 heures",  
    students: "1,300",  
    rating: "4.8",  
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop"  
  }, 
   {  
    category: "UX/UI Design",  
    title: "Prototypage avec Figma",  
    description: "Créez des prototypes interactifs avec Figma pour vos projets.",  
    instructor: "Design Pro",  
    duration: "22 heures",  
    students: "1,800",  
    rating: "4.7",  
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Testing et assurance qualité",  
    title: "Automatisation des tests avec Cypress",  
    description: "Maîtrisez les tests end-to-end avec Cypress.",  
    instructor: "Test Master",  
    duration: "28 heures",  
    students: "1,100",  
    rating: "4.5",  
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop"  
  },  
  {  
    category: "Analyse de données",  
    title: "Tableau et visualisation de données",  
    description: "Créez des tableaux de bord interactifs avec Tableau.",  
    instructor: "Viz Expert",  
    duration: "24 heures",  
    students: "1,400",  
    rating: "4.6",  
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop"  
  }  
];  
  
// Vérifier l'état d'authentification  
onAuthStateChanged(auth, async (user) => {  
  if (user) {  
    await loadUserData(user.uid);  
    setupUserInterface();  
    generateCourses();  
    setupCategoryFilters();  
    setupLogoClick(); // Nouvelle fonction  
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
  
// Mettre à jour l'interface utilisateur (MODIFIÉ pour prénom + dropdown enrichi)  
function updateUserInterface(userData) {  
  const userInitial = document.getElementById('userInitial');  
  const userName = document.getElementById('userName');  
  const userFullName = document.getElementById('userFullName');  
  const userEmail = document.getElementById('userEmail');  
  const userAvatarLarge = document.getElementById('userAvatarLarge');  
    
  // Extraire le prénom (premier mot) au lieu du nom complet  
  const firstName = userData.fullname ? userData.fullname.split(' ')[0] : 'Utilisateur';  
  const firstLetter = firstName.charAt(0).toUpperCase();  
    
  if (userInitial) userInitial.textContent = firstLetter;  
  if (userName) userName.textContent = firstName; // Affiche seulement le prénom  
  if (userFullName) userFullName.textContent = userData.fullname || 'Utilisateur';  
  if (userEmail) userEmail.textContent = userData.email || auth.currentUser?.email || 'email@example.com';  
  if (userAvatarLarge) userAvatarLarge.textContent = firstLetter;  
}  
  
// Configurer les événements de l'interface utilisateur (ÉTENDU)  
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
  
// NOUVELLE FONCTION : Configurer les liens du menu profil  
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
}  
  
// NOUVELLE FONCTION : Gestion du clic sur le logo  
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
  
// Générer les cartes de formations dynamiquement  
function generateCourses() {  
  const coursesGrid = document.getElementById('coursesGrid');  
  if (!coursesGrid) return;  
    
  coursesGrid.innerHTML = '';  
    
  formations.forEach((formation, index) => {  
    const courseCard = document.createElement('div');  
    courseCard.className = 'course-card';  
    courseCard.style.opacity = '0';  
    courseCard.style.transform = 'translateY(20px)';  
    courseCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';  
      
    courseCard.innerHTML = `  
      <img src="${formation.image}" alt="${formation.title}" class="course-image">  
      <div class="course-content">  
        <div class="course-meta">  
          <span class="course-category category-badge">${formation.category}</span>  
        </div>  
        <h3 class="course-title">${formation.title}</h3>  
        <p class="course-description">${formation.description}</p>  
        <p class="course-instructor">${formation.instructor}</p>  
        <div class="course-stats">  
          <div class="course-info">  
            <span>⏱ ${formation.duration}</span>  
            <span>👥 ${formation.students}</span>  
          </div>  
          <div class="course-rating">  
            <span class="star">⭐</span>  
            <span>${formation.rating}</span>  
          </div>  
        </div>  
        <button class="course-button">Commencer le cours</button>  
      </div>  
    `;  
      
    coursesGrid.appendChild(courseCard);  
  });  
    
  setupScrollAnimation();  
}  
  
// NOUVELLE FONCTION : Filtrer les formations par catégorie  
function filterCoursesByCategory(selectedCategory) {  
  const coursesGrid = document.getElementById('coursesGrid');  
  if (!coursesGrid) return;  
    
  coursesGrid.innerHTML = '';  
    
  // Mapper les catégories de navigation aux catégories des formations  
  const categoryMap = {  
    'Data Science': ['Data Science', 'Analyse de données'],  
    'Développement web': ['Développement web'],  
    'DevOps': ['DevOps'],  
    'Sécurité': ['Cybersécurité']  
  };  
    
  const filteredFormations = formations.filter(formation => {  
    return categoryMap[selectedCategory]?.includes(formation.category);  
  });  
    
  // Afficher les formations filtrées  
  filteredFormations.forEach((formation, index) => {  
    const courseCard = document.createElement('div');  
    courseCard.className = 'course-card';  
    courseCard.style.opacity = '0';  
    courseCard.style.transform = 'translateY(20px)';  
    courseCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';  
      
    courseCard.innerHTML = `  
      <img src="${formation.image}" alt="${formation.title}" class="course-image">  
      <div class="course-content">  
        <div class="course-meta">  
          <span class="course-category category-badge">${formation.category}</span>  
        </div>  
        <h3 class="course-title">${formation.title}</h3>  
        <p class="course-description">${formation.description}</p>  
        <p class="course-instructor">${formation.instructor}</p>  
        <div class="course-stats">  
          <div class="course-info">  
            <span>⏱ ${formation.duration}</span>  
            <span>👥 ${formation.students}</span>  
          </div>  
          <div class="course-rating">  
            <span class="star">⭐</span>  
            <span>${formation.rating}</span>  
          </div>  
        </div>  
        <button class="course-button">Commencer le cours</button>  
      </div>  
    `;  
      
    coursesGrid.appendChild(courseCard);  
  });  
    
  setupScrollAnimation();  
}  
  
// Fonction pour afficher toutes les formations  
function showAllCourses() {  
  generateCourses();  
}  
  
// NOUVELLE FONCTION : Configurer les filtres de catégories  
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
  
// Gestion de l'upload CV  
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
  setTimeout(() => {  
    alert(`CV "${file.name}" traité avec succès! Recommandations mises à jour.`);  
  }, 1000);  
}  
  
// Fonction de déconnexion  
function logout() {  
  signOut(auth).then(() => {  
    window.location.href = "formup.html";  
  }).catch((error) => {  
    console.error("Erreur lors de la déconnexion:", error);  
  });  
}  
  
// Exposer les fonctions globalement  
window.handleFileUpload = handleFileUpload;  
window.logout = logout;  
window.showAllCourses = showAllCourses;  
  
// Initialisation des événements  
document.addEventListener('DOMContentLoaded', function() {  
  // Gestion de l'upload CV  
  const cvFile = document.getElementById('cvFile');  
  if (cvFile) {  
    cvFile.addEventListener('change', handleFileUpload);  
  }  
    
  // Smooth scroll pour le bouton "Explorer les formations"  
  const exploreBtn = document.querySelector('a[href="#courses-section"]');  
  if (exploreBtn) {  
    exploreBtn.addEventListener('click', function(e) {  
      e.preventDefault();  
      const coursesSection = document.getElementById('courses-section');  
      if (coursesSection) {  
        coursesSection.scrollIntoView({   
          behavior: 'smooth',  
          block: 'start'  
        });  
      }  
    });  
  }  
});