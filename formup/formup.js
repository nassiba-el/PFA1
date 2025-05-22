// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeyI1BJtOWozGGJAThWRccar0NTunRgZ0",
  authDomain: "pfaouafaa.firebaseapp.com",
  projectId: "pfaouafaa",
  storageBucket: "pfaouafaa.firebasestorage.app",
  messagingSenderId: "793502569049",
  appId: "1:793502569049:web:00625bf0f7344b21301748",
  measurementId: "G-KF7CNM89K2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);