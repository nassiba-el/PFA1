// signup.js  
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";  
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";  
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";  
  
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
  
// Gestionnaire d'événement pour l'inscription  
const signUp = document.getElementById("submitSignUp");  
signUp.addEventListener("click", async (event) => {  
  event.preventDefault();  
    
  const email = document.getElementById("email").value;  
  const password = document.getElementById("password").value;  
  const fullname = document.getElementById("fullname").value;  
  const confirmPassword = document.getElementById("confirm-password").value;  
  
  // Validation des mots de passe  
  if (password !== confirmPassword) {  
    alert("Les mots de passe ne correspondent pas !");  
    return;  
  }  
  
  try {  
    // Créer le compte utilisateur avec Firebase Auth  
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);  
    const user = userCredential.user;  
  
    // Préparer les données utilisateur  
    const userData = {  
      uid: user.uid,  
      email: email,  
      fullname: fullname,  
      createdAt: new Date().toISOString()  
    };  
  
    // SAUVEGARDER dans Firestore  
    await setDoc(doc(db, "users", user.uid), userData);  
  
    alert("Inscription réussie ! Bienvenue " + fullname + " !");  
    window.location.href = "login.html";  
  
  } catch (error) {  
    console.error("Erreur lors de l'inscription:", error);  
    alert("Erreur : " + error.message);  
  }  
});