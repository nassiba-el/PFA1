// Import Firebase modules  
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';  
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';  
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';  
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
let userAchievements = {};  
  
// Vérifier l'état d'authentification  
onAuthStateChanged(auth, async (user) => {  
  if (user) {  
    currentUser = user;  
    await loadUserAchievements(user.uid);  
    generateAchievementsData();  
    setupProgressChart();  
  } else {  
    window.location.href = "formup.html";  
  }  
});  
  
// Charger les accomplissements utilisateur  
async function loadUserAchievements(uid) {  
  try {  
    const userDoc = await getDoc(doc(db, "users", uid));  
      
    if (userDoc.exists()) {  
      userAchievements = userDoc.data();  
    } else {  
      // Données par défaut pour un nouvel utilisateur  
      userAchievements = {  
        totalCourses: 0,  
        completedCourses: 0,  
        totalHours: 0,  
        badges: [],  
        certificates: [],  
        currentCourses: []  
      };  
    }  
  } catch (error) {  
    console.error("Erreur lors du chargement des accomplissements:", error);  
  }  
}  
  
// Générer les données d'accomplissements  
function generateAchievementsData() {  
  // Mettre à jour les statistiques globales  
  updateGlobalStats();  
    
  // Générer les formations en cours  
  generateCurrentCourses();  
    
  // Générer les badges  
  generateBadges();  
    
  // Générer les certificats  
  generateCertificates();  
}  
  
// Mettre à jour les statistiques globales  
function updateGlobalStats() {  
  // Données simulées basées sur l'activité utilisateur  
  const stats = {  
    totalCourses: userAchievements.totalCourses || Math.floor(Math.random() * 15) + 5,  
    completedCourses: userAchievements.completedCourses || Math.floor(Math.random() * 8) + 2,  
    totalBadges: userAchievements.badges?.length || Math.floor(Math.random() * 6) + 3,  
    totalHours: userAchievements.totalHours || Math.floor(Math.random() * 120) + 30  
  };  
  
  document.getElementById('totalCourses').textContent = stats.totalCourses;  
  document.getElementById('completedCourses').textContent = stats.completedCourses;  
  document.getElementById('totalBadges').textContent = stats.totalBadges;  
  document.getElementById('totalHours').textContent = `${stats.totalHours}h`;  
}  
  
// Générer les formations en cours  
function generateCurrentCourses() {  
  const coursesProgress = document.getElementById('coursesProgress');  
    
  const currentCourses = userAchievements.currentCourses || [  
    { title: "JavaScript Avancé", progress: 75 },  
    { title: "React Development", progress: 45 },  
    { title: "Node.js Backend", progress: 30 },  
    { title: "Data Science avec Python", progress: 60 }  
  ];  
  
  coursesProgress.innerHTML = '';  
    
  currentCourses.forEach(course => {  
    const courseItem = document.createElement('div');  
    courseItem.className = 'course-progress-item';  
    courseItem.innerHTML = `  
      <div class="course-progress-header">  
        <span class="course-title">${course.title}</span>  
        <span class="course-percentage">${course.progress}%</span>  
      </div>  
      <div class="progress-bar">  
        <div class="progress-fill" style="width: ${course.progress}%"></div>  
      </div>  
    `;  
    coursesProgress.appendChild(courseItem);  
  });  
}  
  
// Générer les badges  
function generateBadges() {  
  const badgesGrid = document.getElementById('badgesGrid');  
    
  const badges = userAchievements.badges || [  
    { icon: "🎯", name: "Premier pas", description: "Premier cours complété" },  
    { icon: "🔥", name: "Série de 7", description: "7 jours consécutifs" },  
    { icon: "📚", name: "Lecteur assidu", description: "10 formations suivies" },  
    { icon: "⭐", name: "Excellence", description: "Note moyenne > 4.5" },  
    { icon: "🚀", name: "Rapide", description: "Formation en moins de 2h" },  
    { icon: "💎", name: "Perfectionniste", description: "100% sur 3 formations" }  
  ];  
  
  badgesGrid.innerHTML = '';  
    
  badges.forEach(badge => {  
    const badgeItem = document.createElement('div');  
    badgeItem.className = 'badge-item';  
    badgeItem.innerHTML = `  
      <div class="badge-icon">${badge.icon}</div>  
      <div class="badge-name">${badge.name}</div>  
      <div class="badge-description">${badge.description}</div>  
    `;  
    badgesGrid.appendChild(badgeItem);  
  });  
}  
  
// Générer les certificats  
function generateCertificates() {  
  const certificatesGrid = document.getElementById('certificatesGrid');  
    
  const certificates = userAchievements.certificates || [  
    { title: "Développement Web Frontend", date: "2024-03-15" },  
    { title: "JavaScript ES6+", date: "2024-02-28" },  
    { title: "Bases de données SQL", date: "2024-01-20" }  
  ];  
  
  certificatesGrid.innerHTML = '';  
    
  if (certificates.length === 0) {  
    certificatesGrid.innerHTML = `  
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #6b7280;">  
        <p>Aucun certificat obtenu pour le moment.</p>  
        <p>Terminez vos formations pour débloquer vos premiers certificats !</p>  
      </div>  
    `;  
    return;  
  }  
    
  certificates.forEach(certificate => {  
    const certificateItem = document.createElement('div');  
    certificateItem.className = 'certificate-item';  
    certificateItem.innerHTML = `  
      <div class="certificate-icon">🎓</div>  
      <div class="certificate-title">${certificate.title}</div>  
      <div class="certificate-date">Obtenu le ${new Date(certificate.date).toLocaleDateString('fr-FR')}</div>  
    `;  
    certificatesGrid.appendChild(certificateItem);  
  });  
}  
  
// Configuration du graphique de progression  
function setupProgressChart() {  
  const canvas = document.getElementById('progressChart');  
  const ctx = canvas.getContext('2d');  
    
  // Données simulées de progression sur les 7 derniers jours  
  const progressData = [  
    { day: 'Lun', hours: 2 },  
    { day: 'Mar', hours: 1.5 },  
    { day: 'Mer', hours: 3 },  
    { day: 'Jeu', hours: 2.5 },  
    { day: 'Ven', hours: 1 },  
    { day: 'Sam', hours: 4 },  
    { day: 'Dim', hours: 2 }  
  ];  
    
  drawProgressChart(ctx, canvas, progressData);  
}  
  
// Dessiner le graphique de progression  
function drawProgressChart(ctx, canvas, data) {  
  const padding = 40;  
  const chartWidth = canvas.width - 2 * padding;  
  const chartHeight = canvas.height - 2 * padding;  
  const maxHours = Math.max(...data.map(d => d.hours));  
    
  // Effacer le canvas  
  ctx.clearRect(0, 0, canvas.width, canvas.height);  
    
  // Style du graphique  
  ctx.fillStyle = '#f8fafc';  
  ctx.fillRect(0, 0, canvas.width, canvas.height);  
    
  // Dessiner les barres  
  const barWidth = chartWidth / data.length * 0.6;  
  const barSpacing = chartWidth / data.length;  
    
  data.forEach((item, index) => {  
    const barHeight = (item.hours / maxHours) * chartHeight;  
    const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;  
    const y = padding + chartHeight - barHeight;  
      
    // Gradient pour les barres  
    const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);  
    gradient.addColorStop(0, '#667eea');  
    gradient.addColorStop(1, '#764ba2');  
      
    ctx.fillStyle = gradient;  
    ctx.fillRect(x, y, barWidth, barHeight);  
      
    // Labels des jours  
    ctx.fillStyle = '#374151';  
    ctx.font = '12px Inter';  
    ctx.textAlign = 'center';  
    ctx.fillText(item.day, x + barWidth / 2, canvas.height - 10);  
      
    // Valeurs des heures  
    ctx.fillStyle = '#6b7280';  
    ctx.font = '10px Inter';  
    ctx.fillText(`${item.hours}h`, x + barWidth / 2, y - 5);  
  });  
    
  // Titre du graphique  
  ctx.fillStyle = '#1f2937';  
  ctx.font = 'bold 14px Inter';  
  ctx.textAlign = 'center';  
  ctx.fillText('Heures d\'apprentissage cette semaine', canvas.width / 2, 20);  
}  
  
// Mettre à jour l'avatar des accomplissements  
function updateAchievementAvatar() {  
  const avatar = document.getElementById('achievementAvatar');  
  if (currentUser && userAchievements.fullname) {  
    const firstLetter = userAchievements.fullname.charAt(0).toUpperCase();  
    avatar.textContent = firstLetter;  
  }  
}  
  
// Animation d'entrée pour les éléments  
function setupAnimations() {  
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
  
  // Observer les sections  
  document.querySelectorAll('.stats-section, .progress-chart-section, .current-courses-section, .badges-section, .certificates-section').forEach(section => {  
    section.style.opacity = '0';  
    section.style.transform = 'translateY(20px)';  
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';  
    observer.observe(section);  
  });  
}  
  
// Initialisation une fois le DOM chargé  
document.addEventListener('DOMContentLoaded', function() {  
  setupAnimations();  
  console.log('Achievements.js chargé avec succès');  
});  
  
console.log('Achievements module initialized');
