// signup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Configuration Firebase (tu peux la copier depuis formup.html)
const firebaseConfig = {
  apiKey: "AIzaSyDeyI1BJtOWozGGJAThWRccar0NTunRgZ0",
  authDomain: "pfaouafaa.firebaseapp.com",
  projectId: "pfaouafaa",
  storageBucket: "pfaouafaa.firebasestorage.app",
  messagingSenderId: "793502569049",
  appId: "1:793502569049:web:00625bf0f7344b21301748",
  measurementId: "G-KF7CNM89K2"
};

const app = initializeApp(firebaseConfig);

const signUp=document.getElementById("submitSignUp");
signUp.addEventListener("click",(event)=>{
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const fullname = document.getElementById("fullname").value;

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredental) =>{
    const user=userCredental.user;
    const userData={
      email:email,
      fullname:fullname,
    }
  })
})










// // Fonction inscription
// window.signUp = function (e) {
//   e.preventDefault(); // pour éviter le rechargement de la page


//   createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       alert("Inscription réussie !");
//       window.location.href = "formup.html";
//     })
//     .catch((error) => {
//       alert("Erreur : " + error.message);
//     });
// };