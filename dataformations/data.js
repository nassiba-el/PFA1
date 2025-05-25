// Import Firebase modules  
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';  
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';  
  
// Configuration Firebase (copiez depuis home.js)  
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
const db = getFirestore(app);

function transformFormation(formation) {  
  // Déterminer le niveau selon la durée  
  const heures = parseInt(formation.duration);  
  let niveau = "Débutant";  
  if (heures > 25 && heures <= 35) niveau = "Intermédiaire";  
  if (heures > 35) niveau = "Avancé";  
  
  // Mapping des catégories vers les profils standardisés  
  const profilMapping = {  
    "Génie logiciel": "génie logiciel",  
    "Cybersécurité": "sécurité informatique / cybersécurité",   
    "Data Science": "génie des données / data science",  
    "Développement web": "développement web",  
    "Intelligence artificielle": "intelligence artificielle",  
    "DevOps": "devops",  
    "Cloud Computing": "ingénierie cloud / cloud computing",  
    "Développement mobile": "développement mobile",  
    "Réseaux et télécommunications": "réseaux et télécommunications",  
    "Blockchain": "blockchain / crypto-technologies",  
    "UX/UI Design": "UX/UI design",  
    "Testing et assurance qualité": "testing et assurance qualité (QA)",  
    "Analyse de données": "analyse de données / business intelligence",  
    "Informatique embarquée": "informatique embarquée / systèmes embarqués",  
    "Réalité virtuelle et augmentée": "réalité virtuelle et augmentée (VR/AR)",  
    "Développement de jeux vidéo": "développement de jeux vidéo",  
    "Automatisation et robotique": "automatisation et robotique",  
    "Informatique quantique": "informatique quantique",  
    "Scrum Master": "scrum master / product owner",  
    "Support IT": "technicien systèmes et réseaux / support IT"  
  };  
  
  // Mapper les compétences selon la catégorie  
  const competencesMap = {  
    "Génie logiciel": ["Architecture", "Design patterns", "Développement"],  
    "Cybersécurité": ["Sécurité", "Tests de pénétration", "Protection"],  
    "Data Science": ["Machine Learning", "Python", "Analyse de données"],  
    "Développement web": ["JavaScript", "Frontend", "Backend"],  
    "Intelligence artificielle": ["IA", "Deep Learning", "TensorFlow"],  
    "DevOps": ["Docker", "Kubernetes", "CI/CD"],  
    "Cloud Computing": ["AWS", "Azure", "Architecture cloud"],  
    "Développement mobile": ["iOS", "Android", "Cross-platform"]  
  };  
  
  return {  
    categories: formation.category,  
    competencesAcquises: competencesMap[formation.category] || ["Compétences techniques"],  
    description: formation.description,  
    duree: formation.duration,  
    lien: `https://formup.com/courses/${formation.title.toLowerCase().replace(/\s+/g, '-')}`,  
    niveau: niveau,  
    profil: profilMapping[formation.category] || formation.category, // Utilise le mapping standardisé  
    titre: formation.title,  
    urlImage: formation.image,  
    instructeur: formation.instructor,  
    dateCreation: new Date().toISOString(),  
    actif: true  
  };  
}

async function uploadAllFormations() {  
  try {  
    console.log('🚀 Début upload formations...');  
      
    const formationsCollection = collection(db, 'formations');  
    let successCount = 0;  
      
    // Ajouter ici le tableau formations depuis home.js  
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
      
    for (const formation of formations) {  
      try {  
        const transformedFormation = transformFormation(formation);  
        const docRef = await addDoc(formationsCollection, transformedFormation);  
          
        console.log(`✅ "${formation.title}" ajoutée (ID: ${docRef.id})`);  
        successCount++;  
          
        // Pause pour éviter la surcharge  
        await new Promise(resolve => setTimeout(resolve, 200));  
          
      } catch (error) {  
        console.error(`❌ Erreur pour "${formation.title}":`, error);  
      }  
    }  
      
    console.log(`✅ Upload terminé: ${successCount}/${formations.length} formations ajoutées`);  
    alert(`${successCount} formations ajoutées avec succès!`);  
      
  } catch (error) {  
    console.error('💥 Erreur générale:', error);  
    alert('Erreur lors de l\'upload: ' + error.message);  
  }  
}  
  
// Exécuter automatiquement  
uploadAllFormations();