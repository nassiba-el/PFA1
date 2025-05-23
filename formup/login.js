// login.js  
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";  
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";  
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";  
  
// Configuration Firebase (même que signup.js)  
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
  
// Fonction de connexion  
window.logIn = async function(event) {  
  event.preventDefault();  
    
  const email = document.getElementById("email").value;  
  const password = document.getElementById("password").value;  
  
  // Validation des champs  
  if (!email || !password) {  
    alert("Veuillez remplir tous les champs !");  
    return;  
  }  
  
  try {  
    // Connexion avec Firebase Auth  
    const userCredential = await signInWithEmailAndPassword(auth, email, password);  
    const user = userCredential.user;  
  
    // Mettre à jour la dernière connexion dans Firestore  
    const userDocRef = doc(db, "users", user.uid);  
    await updateDoc(userDocRef, {  
      lastLogin: new Date().toISOString()  
    });  
  
    // Récupérer les données utilisateur  
    const userDoc = await getDoc(userDocRef);  
    if (userDoc.exists()) {  
      const userData = userDoc.data();  
      alert("Connexion réussie ! Bienvenue " + userData.fullname + " !");  
    } else {  
      alert("Connexion réussie !");  
    }  
  
    // Redirection vers la page principale  
    window.location.href = "formup.html";  
  
  } catch (error) {  
    console.error("Erreur lors de la connexion:", error);  
      
    // Messages d'erreur personnalisés  
    let errorMessage = "Une erreur est survenue lors de la connexion.";  
      
    switch (error.code) {  
      case 'auth/user-not-found':  
        errorMessage = "Aucun compte trouvé avec cette adresse email.";  
        break;  
      case 'auth/wrong-password':  
        errorMessage = "Mot de passe incorrect.";  
        break;  
      case 'auth/invalid-email':  
        errorMessage = "L'adresse email n'est pas valide.";  
        break;  
      case 'auth/too-many-requests':  
        errorMessage = "Trop de tentatives de connexion. Veuillez réessayer plus tard.";  
        break;  
      default:  
        errorMessage = error.message;  
    }  
      
    alert("Erreur : " + errorMessage);  
  }  
};