// home.js  
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";  
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";  
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";  
  
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
  
// Vérifier l'état d'authentification  
onAuthStateChanged(auth, async (user) => {  
  if (user) {  
    await loadUserData(user.uid);  
    setupUserInterface();  
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
      updateUserInterface({ fullname: auth.currentUser.email });  
    }  
  } catch (error) {  
    console.error("Erreur lors du chargement des données utilisateur:", error);  
    updateUserInterface({ fullname: auth.currentUser.email });  
  }  
}  
  
// Mettre à jour l'interface utilisateur  
function updateUserInterface(userData) {  
  const userInitial = document.getElementById('userInitial');  
  const userName = document.getElementById('userName');  
    
  const firstLetter = userData.fullname ? userData.fullname.charAt(0).toUpperCase() : 'U';  
    
  userInitial.textContent = firstLetter;  
  userName.textContent = userData.fullname || 'Utilisateur';  
}  
  
// Configurer les événements de l'interface utilisateur  
function setupUserInterface() {  
  const userAvatar = document.getElementById('userAvatar');  
  const userDropdown = document.getElementById('userDropdown');  
    
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
  
// Fonction pour gérer l'upload de CV  
window.handleFileUpload = function(event) {  
  const file = event.target.files[0];  
  const fileNameDiv = document.getElementById('fileName');  
    
  if (file) {  
    if (file.size > 5 * 1024 * 1024) {  
      alert('Le fichier est trop volumineux. Taille maximale : 5MB');  
      return;  
    }  
      
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];  
    if (!allowedTypes.includes(file.type)) {  
      alert('Type de fichier non supporté. Utilisez PDF, DOC ou DOCX');  
      return;  
    }  
      
    fileNameDiv.textContent = file.name;  
    uploadCVToFirebase(file);  
  } else {  
    fileNameDiv.textContent = 'Aucun fichier sélectionné';  
  }  
};  
  
// Fonction pour uploader vers Firebase Storage  
async function uploadCVToFirebase(file) {  
  try {  
    console.log('Upload du CV:', file.name);  
    alert('CV uploadé avec succès : ' + file.name);  
  } catch (error) {  
    console.error('Erreur lors de l\'upload:', error);  
    alert('Erreur lors de l\'upload du CV');  
  }  
}  
  
// Fonction de déconnexion  
window.logout = async function() {  
  try {  
    await signOut(auth);  
    alert("Déconnexion réussie !");  
    window.location.href = "formup.html";  
  } catch (error) {  
    console.error("Erreur lors de la déconnexion:", error);  
    alert("Erreur lors de la déconnexion : " + error.message);  
  }  
};