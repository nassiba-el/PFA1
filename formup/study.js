// Import Firebase modules    
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';    
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';    
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';    
    
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
    
const app = initializeApp(firebaseConfig);    
const auth = getAuth(app);    
const db = getFirestore(app);    
    
let currentUser = null;    
let currentFormation = null;    
let currentLesson = 0;    
let lessons = [];    
    
// Vérifier l'authentification    
onAuthStateChanged(auth, async (user) => {    
  if (user) {    
    currentUser = user;    
    await loadFormation();    
  } else {    
    window.location.href = "formup.html";    
  }    
});    
    
// Charger la formation depuis l'URL    
async function loadFormation() {    
  const urlParams = new URLSearchParams(window.location.search);    
  const formationId = urlParams.get('id');    
      
  if (!formationId) {    
    window.location.href = "home.html";    
    return;    
  }    
      
  try {    
    const formationDoc = await getDoc(doc(db, "formations", formationId));    
    if (formationDoc.exists()) {    
      currentFormation = { id: formationId, ...formationDoc.data() };    
      lessons = currentFormation.lessons || [];    
          
      // Afficher le nom de la formation et l'instructeur  
      document.getElementById('formationTitle').textContent = currentFormation.titre;  
      document.getElementById('formationInstructor').textContent = `Par ${currentFormation.instructeur}`;  
        
      loadLesson(0);    
      await updateProgress();    
    }    
  } catch (error) {    
    console.error("Erreur lors du chargement de la formation:", error);    
  }    
}    
    
// Charger une leçon    
function loadLesson(lessonIndex) {    
  if (lessonIndex < 0 || lessonIndex >= lessons.length) return;    
      
  currentLesson = lessonIndex;    
  const lesson = lessons[lessonIndex];    
      
  document.getElementById('lessonContent').innerHTML = `    
    <h2>${lesson.titre}</h2>    
    <div class="lesson-duration" style="color: #6B7280; font-size: 14px; margin-bottom: 1rem;">  
      Durée: ${lesson.duree}  
    </div>  
    <div class="lesson-body">${lesson.contenu}</div>    
  `;    
      
  // Mettre à jour les boutons de navigation    
  document.getElementById('prevBtn').disabled = lessonIndex === 0;    
  document.getElementById('nextBtn').disabled = lessonIndex === lessons.length - 1;    
      
  updateProgress();    
}    
    
// Leçon suivante    
async function nextLesson() {    
  if (currentLesson < lessons.length - 1) {    
    await markLessonCompleted(currentLesson);    
    loadLesson(currentLesson + 1);    
  } else {  
    // Si c'est la dernière leçon, la marquer comme terminée  
    await markLessonCompleted(currentLesson);  
    await markFormationCompleted();  
  }  
}    
    
// Leçon précédente    
function previousLesson() {    
  if (currentLesson > 0) {    
    loadLesson(currentLesson - 1);    
  }    
}    
    
// Marquer une leçon comme terminée    
async function markLessonCompleted(lessonIndex) {    
  try {    
    const userDocRef = doc(db, "users", currentUser.uid);    
    const userDoc = await getDoc(userDocRef);    
        
    if (userDoc.exists()) {    
      const userData = userDoc.data();    
      const completedLessons = userData.completedLessons || {};    
          
      if (!completedLessons[currentFormation.id]) {    
        completedLessons[currentFormation.id] = [];    
      }    
          
      if (!completedLessons[currentFormation.id].includes(lessonIndex)) {    
        completedLessons[currentFormation.id].push(lessonIndex);    
            
        await updateDoc(userDocRef, {    
          completedLessons: completedLessons,    
          formations_etudiees: arrayUnion(currentFormation.id)    
        });    
      }    
    }    
  } catch (error) {    
    console.error("Erreur lors de la sauvegarde:", error);    
  }    
}  
  
// Marquer la formation comme terminée  
async function markFormationCompleted() {  
  try {  
    const userDocRef = doc(db, "users", currentUser.uid);  
    const userDoc = await getDoc(userDocRef);  
      
    if (userDoc.exists()) {  
      const userData = userDoc.data();  
      const completedFormations = userData.completedFormations || [];  
        
      if (!completedFormations.includes(currentFormation.id)) {  
        await updateDoc(userDocRef, {  
          completedFormations: arrayUnion(currentFormation.id),  
          totalCompletedCourses: (userData.totalCompletedCourses || 0) + 1  
        });  
          
        // Afficher un message de félicitations  
        showCompletionMessage();  
      }  
    }  
  } catch (error) {  
    console.error("Erreur lors de la sauvegarde de la formation terminée:", error);  
  }  
}  
  
// Afficher un message de félicitations  
function showCompletionMessage() {  
  const message = document.createElement('div');  
  message.style.cssText = `  
    position: fixed;  
    top: 50%;  
    left: 50%;  
    transform: translate(-50%, -50%);  
    background: white;  
    padding: 2rem;  
    border-radius: 16px;  
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);  
    text-align: center;  
    z-index: 1000;  
    max-width: 400px;  
  `;  
    
  message.innerHTML = `  
    <h3 style="color: #1F2937; margin-bottom: 1rem;">🎉 Félicitations !</h3>  
    <p style="color: #6B7280; margin-bottom: 1.5rem;">  
      Vous avez terminé la formation "${currentFormation.titre}" avec succès !  
    </p>  
    <button onclick="this.parentElement.remove()" style="  
      background: #1F2937;  
      color: white;  
      border: none;  
      padding: 10px 20px;  
      border-radius: 8px;  
      cursor: pointer;  
    ">Fermer</button>  
  `;  
    
  document.body.appendChild(message);  
    
  // Supprimer automatiquement après 5 secondes  
  setTimeout(() => {  
    if (message.parentElement) {  
      message.remove();  
    }  
  }, 5000);  
}  
    
// Mettre à jour la barre de progression avec pourcentage détaillé  
async function updateProgress() {    
  try {    
    const userDocRef = doc(db, "users", currentUser.uid);    
    const userDoc = await getDoc(userDocRef);    
        
    let completedCount = 0;    
    if (userDoc.exists()) {    
      const userData = userDoc.data();    
      const completedLessons = userData.completedLessons || {};    
      completedCount = completedLessons[currentFormation.id]?.length || 0;    
    }    
        
    const progress = Math.round((completedCount / lessons.length) * 100);    
    const progressFill = document.getElementById('progressFill');  
    const progressText = document.getElementById('progressText');  
      
    // Animation de la barre de progression  
    progressFill.style.width = `${progress}%`;  
    progressText.textContent = `${progress}% (${completedCount}/${lessons.length})`;  
      
    // Changer la couleur selon le pourcentage  
    if (progress === 100) {  
      progressFill.style.background = 'linear-gradient(90deg, #10B981 0%, #059669 100%)'; // Vert  
    } else if (progress >= 75) {  
      progressFill.style.background = 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)'; // Orange  
    } else {  
      progressFill.style.background = 'linear-gradient(90deg, #3B82F6 0%, #1D4ED8 100%)'; // Bleu  
    }  
      
  } catch (error) {    
    console.error("Erreur lors du calcul de progression:", error);    
  }    
}  
  
// Fonction pour retourner à la page des formations  
function goBackToHome() {  
  window.location.href = "home.html";  
}  
    
// Retour à la page précédente (fonction existante)  
function goBack() {    
  window.history.back();    
}  
  
// Fonction pour obtenir le pourcentage global de l'utilisateur  
async function getUserGlobalProgress() {  
  try {  
    const userDocRef = doc(db, "users", currentUser.uid);  
    const userDoc = await getDoc(userDocRef);  
      
    if (userDoc.exists()) {  
      const userData = userDoc.data();  
      const totalFormations = userData.formations_etudiees?.length || 0;  
      const completedFormations = userData.completedFormations?.length || 0;  
        
      return {  
        totalFormations,  
        completedFormations,  
        globalProgress: totalFormations > 0 ? Math.round((completedFormations / totalFormations) * 100) : 0  
      };  
    }  
    return { totalFormations: 0, completedFormations: 0, globalProgress: 0 };  
  } catch (error) {  
    console.error("Erreur lors du calcul du progrès global:", error);  
    return { totalFormations: 0, completedFormations: 0, globalProgress: 0 };  
  }  
}  
  
// Afficher les statistiques de progression dans la console (optionnel)  
async function logProgressStats() {  
  const stats = await getUserGlobalProgress();  
  console.log(`📊 Statistiques de progression:  
    - Formations étudiées: ${stats.totalFormations}  
    - Formations terminées: ${stats.completedFormations}  
    - Progression globale: ${stats.globalProgress}%  
  `);  
}  
    
// Rendre les fonctions globales pour les boutons HTML  
window.nextLesson = nextLesson;    
window.previousLesson = previousLesson;    
window.goBack = goBack;  
window.goBackToHome = goBackToHome;  
  
// Optionnel: Afficher les stats au chargement  
window.addEventListener('load', () => {  
  setTimeout(logProgressStats, 1000);  
});