// Import Firebase modules    
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';    
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';    
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';    
    
// Configuration Firebase (utilisez la même que dans les autres fichiers)    
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
    
// Fonction pour charger tous les utilisateurs    
async function loadAllUsers() {    
  try {    
    const usersCollection = collection(db, 'users');    
    const querySnapshot = await getDocs(usersCollection);    
        
    const ADMIN_EMAILS = ['nassibanassiba99@gmail.com']; // Liste des emails admin    
        
    const students = [];    
    querySnapshot.forEach((doc) => {    
      const userData = doc.data();    
          
      // Exclure les administrateurs    
      if (!ADMIN_EMAILS.includes(userData.email)) {    
        students.push({    
          id: doc.id,    
          fullname: userData.fullname || 'Nom non défini',    
          email: userData.email || 'Email non défini',    
          coursesInProgress: userData.coursesInProgress || 0,    
          completedCourses: userData.completedCourses || 0    
        });    
      }    
    });    
        
    displayUsersInTable(students);    
        
  } catch (error) {    
    console.error("Erreur lors du chargement des utilisateurs:", error);    
  }    
}  
    
// Fonction pour afficher les utilisateurs dans le tableau    
function displayUsersInTable(users) {    
  const tbody = document.querySelector('.users-table tbody');    
  tbody.innerHTML = ''; // Vider le tableau existant    
      
  users.forEach(user => {    
    const row = document.createElement('tr');    
    row.innerHTML = `    
      <td>${user.fullname}</td>    
      <td>${user.email}</td>    
      <td>${user.coursesInProgress}</td>    
      <td>${user.completedCourses}</td>    
    `;    
    tbody.appendChild(row);    
  });    
}    
    
// Vérifier l'authentification et charger les données    
onAuthStateChanged(auth, (user) => {    
  if (user) {    
    loadAllUsers();    
  } else {    
    window.location.href = "formup.html";    
  }    
});    
    
// Fonction de déconnexion    
function logout() {    
  signOut(auth).then(() => {    
    console.log('Utilisateur déconnecté');    
    window.location.href = "formup.html";    
  }).catch((error) => {    
    console.error('Erreur lors de la déconnexion:', error);    
  });    
}    
    
// Configuration du gestionnaire d'événement    
document.addEventListener('DOMContentLoaded', function() {    
  const logoutBtn = document.getElementById('logoutBtn');    
  if (logoutBtn) {    
    logoutBtn.addEventListener('click', logout);    
  }    
});