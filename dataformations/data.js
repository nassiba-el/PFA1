// Import Firebase modules    
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';    
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';    
    
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
const db = getFirestore(app);  
  
// Fonction pour générer les leçons selon la catégorie  
function generateLessons(category, title) {  
  const lessonsMap = {  
    "Génie logiciel": [  
      { titre: "Introduction à l'architecture logicielle", contenu: "<p>Découvrez les fondamentaux de l'architecture logicielle moderne, les principes SOLID et les bonnes pratiques de conception.</p>", duree: "45min" },  
      { titre: "Design patterns essentiels", contenu: "<p>Maîtrisez les patterns de conception les plus utilisés : Singleton, Factory, Observer, Strategy et MVC.</p>", duree: "60min" },  
      { titre: "Architecture en couches", contenu: "<p>Apprenez à structurer vos applications en couches logiques : présentation, métier et données.</p>", duree: "50min" },  
      { titre: "Microservices vs Monolithe", contenu: "<p>Comparez les approches architecturales et choisissez la stratégie adaptée à votre projet.</p>", duree: "40min" },  
      { titre: "Projet pratique d'architecture", contenu: "<p>Concevez une architecture complète pour un système e-commerce avec documentation technique.</p>", duree: "90min" }  
    ],  
    "Cybersécurité": [  
      { titre: "Fondamentaux de la cybersécurité", contenu: "<p>Comprenez les bases de la sécurité informatique, les types d'attaques et les mécanismes de défense.</p>", duree: "40min" },  
      { titre: "Reconnaissance et scanning", contenu: "<p>Maîtrisez les techniques de reconnaissance passive et active avec Nmap, Shodan et OSINT.</p>", duree: "55min" },  
      { titre: "Tests de pénétration web", contenu: "<p>Explorez les vulnérabilités OWASP Top 10 avec Burp Suite et techniques d'exploitation.</p>", duree: "70min" },  
      { titre: "Exploitation de vulnérabilités", contenu: "<p>Apprenez l'exploitation éthique des failles système avec Metasploit et outils spécialisés.</p>", duree: "65min" },  
      { titre: "Rapport et remédiation", contenu: "<p>Rédigez des rapports de pentest professionnels et proposez des solutions de sécurisation.</p>", duree: "45min" }  
    ],  
    "Data Science": [  
      { titre: "Introduction au Machine Learning", contenu: "<p>Découvrez les concepts fondamentaux du ML : apprentissage supervisé, non-supervisé et par renforcement.</p>", duree: "50min" },  
      { titre: "Préparation et nettoyage des données", contenu: "<p>Maîtrisez pandas, numpy pour le nettoyage, transformation et exploration des datasets.</p>", duree: "60min" },  
      { titre: "Algorithmes supervisés", contenu: "<p>Implémentez des modèles de classification et régression avec scikit-learn : SVM, Random Forest, etc.</p>", duree: "75min" },  
      { titre: "Algorithmes non-supervisés", contenu: "<p>Explorez le clustering (K-means, DBSCAN) et la réduction de dimensionnalité (PCA, t-SNE).</p>", duree: "65min" },  
      { titre: "Évaluation et déploiement", contenu: "<p>Évaluez vos modèles avec métriques appropriées et déployez-les avec Flask/FastAPI.</p>", duree: "55min" }  
    ],  
    "Développement web": [  
      { titre: "JavaScript moderne ES6+", contenu: "<p>Maîtrisez les fonctionnalités avancées : arrow functions, destructuring, async/await, modules.</p>", duree: "60min" },  
      { titre: "Frontend avec React", contenu: "<p>Créez des interfaces dynamiques avec React : composants, hooks, state management et routing.</p>", duree: "80min" },  
      { titre: "Backend avec Node.js", contenu: "<p>Développez des APIs REST robustes avec Express, middleware et authentification JWT.</p>", duree: "70min" },  
      { titre: "Bases de données et ORM", contenu: "<p>Intégrez MongoDB/PostgreSQL avec Mongoose/Sequelize pour la persistance des données.</p>", duree: "55min" },  
      { titre: "Déploiement et production", contenu: "<p>Déployez votre application full-stack sur Heroku/Vercel avec CI/CD et monitoring.</p>", duree: "50min" }  
    ],  
    "Intelligence artificielle": [  
      { titre: "Fondamentaux de l'IA", contenu: "<p>Explorez l'histoire de l'IA, les différents types d'intelligence artificielle et leurs applications.</p>", duree: "45min" },  
      { titre: "Réseaux de neurones", contenu: "<p>Comprenez le fonctionnement des perceptrons, réseaux multicouches et algorithme de rétropropagation.</p>", duree: "65min" },  
      { titre: "Deep Learning avec TensorFlow", contenu: "<p>Construisez des réseaux profonds : CNN pour la vision, RNN pour les séquences temporelles.</p>", duree: "80min" },  
      { titre: "Traitement du langage naturel", contenu: "<p>Développez des modèles NLP : classification de texte, analyse de sentiment, chatbots.</p>", duree: "70min" },  
      { titre: "Projet IA complet", contenu: "<p>Réalisez un projet end-to-end : de la collecte de données au déploiement du modèle.</p>", duree: "90min" }  
    ],  
    "DevOps": [  
      { titre: "Introduction au DevOps", contenu: "<p>Comprenez la culture DevOps, les principes d'intégration et déploiement continus.</p>", duree: "40min" },  
      { titre: "Conteneurisation avec Docker", contenu: "<p>Maîtrisez Docker : création d'images, Dockerfile, volumes et réseaux de conteneurs.</p>", duree: "60min" },  
      { titre: "Orchestration avec Kubernetes", contenu: "<p>Déployez et gérez des applications avec K8s : pods, services, deployments et ingress.</p>", duree: "75min" },  
      { titre: "CI/CD avec Jenkins/GitLab", contenu: "<p>Automatisez vos pipelines : tests automatisés, build, déploiement et rollback.</p>", duree: "65min" },  
      { titre: "Monitoring et observabilité", contenu: "<p>Surveillez vos applications avec Prometheus, Grafana et gestion des logs centralisés.</p>", duree: "50min" }  
    ],  
    "Cloud Computing": [  
      { titre: "Fondamentaux du Cloud", contenu: "<p>Découvrez les modèles de service (IaaS, PaaS, SaaS) et de déploiement cloud.</p>", duree: "45min" },  
      { titre: "Services AWS/Azure essentiels", contenu: "<p>Maîtrisez EC2, S3, RDS, Lambda et leurs équivalents Azure pour l'infrastructure.</p>", duree: "70min" },  
      { titre: "Architecture cloud scalable", contenu: "<p>Concevez des architectures haute disponibilité avec load balancers et auto-scaling.</p>", duree: "65min" },  
      { titre: "Sécurité et conformité", contenu: "<p>Implémentez la sécurité cloud : IAM, chiffrement, VPC et bonnes pratiques de sécurité.</p>", duree: "55min" },  
      { titre: "Optimisation des coûts", contenu: "<p>Optimisez vos dépenses cloud avec monitoring, reserved instances et stratégies de coûts.</p>", duree: "40min" }  
    ],  
    "Développement mobile": [  
      { titre: "Fondamentaux du mobile", contenu: "<p>Comprenez les spécificités du développement mobile : UX, performance et contraintes matérielles.</p>", duree: "40min" },  
      { titre: "React Native/Flutter", contenu: "<p>Développez des apps cross-platform avec navigation, state management et composants natifs.</p>", duree: "75min" },  
      { titre: "APIs et données mobiles", contenu: "<p>Intégrez des APIs REST, gestion offline, synchronisation et stockage local.</p>", duree: "60min" },  
      { titre: "Publication et distribution", contenu: "<p>Préparez vos apps pour les stores : signing, testing, optimisation et processus de review.</p>", duree: "50min" },  
      { titre: "Performance et optimisation", contenu: "<p>Optimisez les performances : lazy loading, mémoire, batterie et techniques avancées.</p>", duree: "55min" }  
    ],  
    "Réseaux et télécommunications": [  
      { titre: "Fondamentaux des réseaux", contenu: "<p>Comprenez les modèles OSI et TCP/IP, les protocoles de base et l'architecture réseau.</p>", duree: "50min" },  
      { titre: "Configuration et administration", contenu: "<p>Configurez routeurs, switches et équipements réseau avec CLI et interfaces graphiques.</p>", duree: "70min" },  
      { titre: "Sécurité réseau", contenu: "<p>Implémentez firewalls, VPN, et mécanismes de sécurité pour protéger l'infrastructure.</p>", duree: "65min" },  
      { titre: "Monitoring et dépannage", contenu: "<p>Surveillez les performances réseau et diagnostiquez les problèmes de connectivité.</p>", duree: "55min" },  
      { titre: "Projet d'infrastructure", contenu: "<p>Concevez et déployez une infrastructure réseau complète pour une entreprise.</p>", duree: "90min" }  
    ],  
    "Blockchain": [  
      { titre: "Introduction à la blockchain", contenu: "<p>Découvrez les concepts fondamentaux : blocks, hash, consensus et décentralisation.</p>", duree: "45min" },  
      { titre: "Smart contracts avec Solidity", contenu: "<p>Développez des contrats intelligents sur Ethereum avec le langage Solidity.</p>", duree: "80min" },  
      { titre: "DApps et Web3", contenu: "<p>Créez des applications décentralisées avec Web3.js et interfaces utilisateur.</p>", duree: "75min" },  
      { titre: "Sécurité et audit", contenu: "<p>Identifiez les vulnérabilités courantes et auditez vos smart contracts.</p>", duree: "60min" },  
      { titre: "Déploiement et tokenomics", contenu: "<p>Déployez vos contrats et concevez l'économie de vos tokens.</p>", duree: "70min" }  
    ],  
    "UX/UI Design": [  
      { titre: "Principes de design UX/UI", contenu: "<p>Maîtrisez les fondamentaux du design centré utilisateur et de l'ergonomie.</p>", duree: "50min" },  
      { titre: "Recherche utilisateur", contenu: "<p>Conduisez des interviews, tests utilisateurs et analysez les besoins.</p>", duree: "60min" },  
      { titre: "Prototypage avec Figma", contenu: "<p>Créez des wireframes, maquettes et prototypes interactifs professionnels.</p>", duree: "75min" },  
      { titre: "Design systems", contenu: "<p>Développez des systèmes de design cohérents et des bibliothèques de composants.</p>", duree: "65min" },  
      { titre: "Tests et itération", contenu: "<p>Testez vos designs, collectez les retours et itérez pour optimiser l'expérience.</p>", duree: "55min" }  
    ],  
    "Testing et assurance qualité": [  
      { titre: "Fondamentaux du testing", contenu: "<p>Comprenez les types de tests, stratégies QA et cycles de développement.</p>", duree: "45min" },  
      { titre: "Tests automatisés", contenu: "<p>Implémentez des tests unitaires, d'intégration et end-to-end avec les frameworks modernes.</p>", duree: "70min" },  
      { titre: "Outils de test avancés", contenu: "<p>Maîtrisez Selenium, Cypress, Jest et outils de performance testing.</p>", duree: "65min" },  
      { titre: "CI/CD et testing", contenu: "<p>Intégrez les tests dans vos pipelines de déploiement continu.</p>", duree: "55min" },  
      { titre: "Stratégie QA complète", contenu: "<p>Concevez une stratégie de qualité globale pour un projet réel.</p>", duree: "80min" }  
    ],  
    "Analyse de données": [  
      { titre: "Fondamentaux de l'analyse", contenu: "<p>Découvrez les concepts statistiques et les méthodes d'analyse de données.</p>", duree: "50min" },  
      { titre: "Outils de visualisation", contenu: "<p>Maîtrisez Tableau, Power BI et Python pour créer des visualisations impactantes.</p>", duree: "70min" },  
      { titre: "SQL avancé et bases de données", contenu: "<p>Exploitez les données avec des requêtes complexes et optimisations.</p>", duree: "65min" },  
      { titre: "Business Intelligence", contenu: "<p>Construisez des tableaux de bord et KPIs pour la prise de décision.</p>", duree: "60min" },  
      { titre: "Analyse prédictive", contenu: "<p>Développez des modèles prédictifs pour anticiper les tendances business.</p>", duree: "75min" }  
    ],  
    "Informatique embarquée": [  
      { titre: "Introduction aux systèmes embarqués", contenu: "<p>Découvrez l'architecture des microcontrôleurs et systèmes temps réel.</p>", duree: "45min" },  
      { titre: "Programmation Arduino", contenu: "<p>Maîtrisez la programmation C/C++ pour Arduino et capteurs.</p>", duree: "70min" },  
      { titre: "Communication IoT", contenu: "<p>Implémentez WiFi, Bluetooth et protocoles IoT pour la connectivité.</p>", duree: "65min" },  
      { titre: "Gestion de l'énergie", contenu: "<p>Optimisez la consommation et gérez l'alimentation des dispositifs.</p>", duree: "55min" },  
      { titre: "Projet IoT complet", contenu: "<p>Réalisez un système IoT de A à Z avec interface web.</p>", duree: "90min" }  
    ],  
    "Réalité virtuelle et augmentée": [  
      { titre: "Fondamentaux VR/AR", contenu: "<p>Comprenez les technologies immersives et leurs applications.</p>", duree: "45min" },  
      { titre: "Développement avec Unity", contenu: "<p>Créez des expériences VR/AR avec Unity et C#.</p>", duree: "80min" },  
      { titre: "Interaction et UI spatiale", contenu: "<p>Concevez des interfaces utilisateur adaptées aux environnements 3D.</p>", duree: "70min" },  
      { titre: "Optimisation performance", contenu: "<p>Optimisez le rendu et les performances pour les casques VR.</p>", duree: "60min" },  
      { titre: "Déploiement multi-plateforme", contenu: "<p>Publiez vos applications sur différentes plateformes VR/AR.</p>", duree: "65min" }  
    ],  
    "Développement de jeux vidéo": [  
      { titre: "Game Design et concepts", contenu: "<p>Apprenez les principes du game design et de la création d'expériences ludiques.</p>", duree: "50min" },  
      { titre: "Programmation avec Unity", contenu: "<p>Maîtrisez Unity et C# pour créer des jeux 2D et 3D.</p>", duree: "85min" },  
      { titre: "Graphismes et animation", contenu: "<p>Créez des assets visuels et animations pour vos jeux.</p>", duree: "75min" },  
      { titre: "Audio et effets sonores", contenu: "<p>Intégrez musique, effets sonores et audio spatial.</p>", duree: "60min" },  
      { titre: "Publication et monétisation", contenu: "<p>Publiez vos jeux sur les stores et explorez les modèles économiques.</p>", duree: "70min" }  
    ],  
    "Automatisation et robotique": [  
      { titre: "Introduction à la robotique", contenu: "<p>Découvrez les types de robots et leurs applications industrielles.</p>", duree: "45min" },  
      { titre: "Programmation de robots", contenu: "<p>Programmez des robots avec ROS et langages spécialisés.</p>", duree: "80min" },  
      { titre: "Capteurs et actionneurs", contenu: "<p>Intégrez capteurs, moteurs et systèmes de contrôle.</p>", duree: "70min" },  
      { titre: "Vision par ordinateur", contenu: "<p>Implémentez la reconnaissance d'objets et navigation autonome.</p>", duree: "75min" },  
      { titre: "Projet robotique", contenu: "<p>Concevez et programmez un robot autonome complet.</p>", duree: "95min" }  
    ],  
    "Informatique quantique": [  
      { titre: "Physique quantique appliquée", contenu: "<p>Comprenez les principes quantiques : superposition, intrication, mesure.</p>", duree: "60min" },  
      { titre: "Algorithmes quantiques", contenu: "<p>Explorez les algorithmes de Shor, Grover et leurs applications.</p>", duree: "70min" },  
      { titre: "Programmation quantique", contenu: "<p>Programmez avec Qiskit et simulateurs quantiques.</p>", duree: "65min" },  
      { titre: "Cryptographie quantique", contenu: "<p>Découvrez la sécurité quantique et ses implications.</p>", duree: "55min" },  
      { titre: "Applications pratiques", contenu: "<p>Explorez les cas d'usage actuels et futurs de l'informatique quantique.</p>", duree: "50min" }  
    ],  
    "Scrum Master": [  
      { titre: "Fondamentaux Agile", contenu: "<p>Maîtrisez les valeurs et principes de l'agilité et du manifeste Agile.</p>", duree: "45min" },  
      { titre: "Framework Scrum", contenu: "<p>Apprenez les rôles, événements et artefacts Scrum en détail.</p>", duree: "70min" },  
      { titre: "Facilitation d'équipe", contenu: "<p>Développez vos compétences de facilitation et coaching d'équipe.</p>", duree: "65min" },  
      { titre: "Gestion des obstacles", contenu: "<p>Identifiez et résolvez les impediments qui bloquent l'équipe.</p>", duree: "55min" },  
      { titre: "Métriques et amélioration", contenu: "<p>Utilisez les métriques Agile pour l'amélioration continue.</p>", duree: "60min" }  
    ],  
    "Support IT": [  
      { titre: "Administration système", contenu: "<p>Maîtrisez l'administration Windows et Linux en environnement professionnel.</p>", duree: "70min" },  
      { titre: "Gestion des incidents", contenu: "<p>Apprenez les processus ITIL pour la résolution d'incidents.</p>", duree: "60min" },  
      { titre: "Sécurité et maintenance", contenu: "<p>Implémentez la sécurité système et planifiez la maintenance préventive.</p>", duree: "65min" },  
      { titre: "Support utilisateur", contenu: "<p>Développez vos compétences de support et communication avec les utilisateurs.</p>", duree: "50min" },  
      { titre: "Automatisation des tâches", contenu: "<p>Automatisez les tâches répétitives avec scripts et outils.</p>", duree: "75min" }  
    ]  
  };  
    
  return lessonsMap[category] || [  
    { titre: "Introduction", contenu: `<p>Introduction complète aux concepts fondamentaux de ${title}.</p>`, duree: "30min" },  
    { titre: "Concepts avancés", contenu: `<p>Approfondissement des techniques et méthodologies avancées.</p>`, duree: "45min" },  
    { titre: "Pratique et exercices", contenu: `<p>Mise en pratique avec des exercices concrets et des cas d'usage réels.</p>`, duree: "60min" },  
    { titre: "Projet final", contenu: `<p>Réalisation d'un projet complet pour valider toutes les compétences acquises.</p>`, duree: "90min" }  
  ];  
}  
  
function generatePrerequisites(category) {  
  const prerequisitesMap = {  
    "Génie logiciel": ["Programmation orientée objet", "Bases de données relationnelles", "Algorithmique et structures de données"],  
    "Cybersécurité": ["Réseaux informatiques TCP/IP", "Systèmes d'exploitation Linux/Windows", "Programmation (Python/Bash)"],  
    "Data Science": ["Mathématiques (statistiques, algèbre)", "Programmation Python", "Bases de données SQL"],  
    "Développement web": ["HTML/CSS avancé", "JavaScript ES6+", "Concepts de bases de données"],  
    "Intelligence artificielle": ["Mathématiques (calcul, statistiques)", "Programmation Python", "Algorithmique"],  
    "DevOps": ["Administration système Linux", "Réseaux et protocoles", "Programmation/scripting"],  
    "Cloud Computing": ["Réseaux et infrastructure", "Virtualisation", "Administration système"],  
    "Développement mobile": ["Programmation orientée objet", "APIs REST", "Bases du développement web"],  
    "Réseaux et télécommunications": ["Mathématiques appliquées", "Électronique de base", "Protocoles réseau"],  
    "Blockchain": ["Cryptographie", "Programmation (Solidity/JavaScript)", "Réseaux distribués"],  
    "UX/UI Design": ["Design graphique", "Psychologie cognitive", "Outils de design (Figma/Adobe)"],  
    "Testing et assurance qualité": ["Programmation", "Méthodologies de développement", "Bases de données"],  
    "Analyse de données": ["Statistiques", "SQL", "Excel avancé"],  
    "Informatique embarquée": ["Électronique", "Programmation C/C++", "Systèmes temps réel"],  
    "Réalité virtuelle et augmentée": ["Programmation 3D", "Mathématiques 3D", "Unity/Unreal Engine"],  
    "Développement de jeux vidéo": ["Programmation orientée objet", "Mathématiques 3D", "Design de jeux"],  
    "Automatisation et robotique": ["Électronique", "Programmation", "Mathématiques appliquées"],  
    "Informatique quantique": ["Physique quantique", "Mathématiques avancées", "Algorithmique"],  
    "Scrum Master": ["Gestion de projet", "Méthodologies agiles", "Communication"],  
    "Support IT": ["Systèmes d'exploitation", "Réseaux", "Hardware informatique"]  
  };  
    
  return prerequisitesMap[category] || ["Connaissances informatiques de base", "Logique et résolution de problèmes"];  
}  
  
function generateCertification(category, title) {  
  return {  
    nom: `Certification FormUp - ${title}`,  
    organisme: "FormUp Academy",  
    prix: "GRATUITE",  
    validite: "2 ans",  
    conditions: "Réussir l'examen final avec 80% minimum et compléter le projet pratique",  
    reconnaissance: "Reconnue par les entreprises partenaires FormUp",  
    avantages: "Accès gratuit à toutes nos certifications professionnelles"  
  };  
}  
  
function generateObjectifs(category) {  
  const objectifsMap = {  
    "Génie logiciel": [  
      "Maîtriser les principes d'architecture logicielle moderne",  
      "Appliquer les design patterns dans des projets réels",  
      "Concevoir des systèmes scalables et maintenables",  
      "Documenter et communiquer efficacement les choix techniques"  
    ],  
    "Cybersécurité": [  
      "Identifier et évaluer les vulnérabilités de sécurité",  
      "Réaliser des tests de pénétration éthiques",  
      "Proposer des solutions de sécurisation adaptées",  
      "Rédiger des rapports de sécurité professionnels"  
    ],  
    "Data Science": [  
      "Maîtriser le cycle complet d'un projet data science",  
      "Implémenter des algorithmes de machine learning",  
      "Analyser et visualiser des données complexes",  
      "Déployer des modèles en production"  
    ],  
    "Développement web": [  
      "Développer des applications web full-stack modernes",  
      "Maîtriser les frameworks frontend et backend",  
      "Implémenter des APIs REST sécurisées",  
      "Déployer et maintenir des applications en production"  
    ],  
    "Intelligence artificielle": [  
      "Comprendre les fondamentaux de l'intelligence artificielle",  
      "Développer des modèles de deep learning",  
      "Traiter des données complexes avec l'IA",  
      "Déployer des solutions IA en production"  
    ]  
  };  
    
  return objectifsMap[category] || [  
    `Maîtriser les concepts fondamentaux de ${category.toLowerCase()}`,  
    "Appliquer les bonnes pratiques de l'industrie",  
    "Réaliser des projets pratiques concrets",  
    "Développer une expertise professionnelle"  
  ];  
}  
  
function transformFormation(formation) {    
  const heures = parseInt(formation.duration);    
  let niveau = "Débutant";    
  if (heures > 25 && heures <= 35) niveau = "Intermédiaire";    
  if (heures > 35) niveau = "Avancé";    
    
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
    
  const competencesMap = {    
    "Génie logiciel": ["Architecture", "Design patterns", "Développement"],    
    "Cybersécurité": ["Sécurité", "Tests de pénétration", "Protection"],    
    "Data Science": ["Machine Learning", "Python", "Analyse de données"],    
    "Développement web": ["JavaScript", "Frontend", "Backend"],    
    "Intelligence artificielle": ["IA", "Deep Learning", "TensorFlow"],    
    "DevOps": ["Docker", "Kubernetes", "CI/CD"],  
      "Cloud Computing": ["AWS", "Azure", "Architecture cloud"],    
    "Développement mobile": ["iOS", "Android", "Cross-platform"],  
    "Réseaux et télécommunications": ["TCP/IP", "Sécurité réseau", "Administration"],  
    "Blockchain": ["Smart Contracts", "Solidity", "Web3"],  
    "UX/UI Design": ["Figma", "Prototypage", "Design System"],  
    "Testing et assurance qualité": ["Selenium", "Cypress", "Automatisation"],  
    "Analyse de données": ["Power BI", "Tableau", "SQL"],  
    "Informatique embarquée": ["Arduino", "IoT", "Capteurs"],  
    "Réalité virtuelle et augmentée": ["Unity", "VR/AR", "3D"],  
    "Développement de jeux vidéo": ["Unity", "Game Design", "C#"],  
    "Automatisation et robotique": ["ROS", "Capteurs", "Programmation"],  
    "Informatique quantique": ["Qiskit", "Algorithmes quantiques", "Physique"],  
    "Scrum Master": ["Agile", "Facilitation", "Gestion d'équipe"],  
    "Support IT": ["Windows", "Linux", "ITIL"]  
  };    
    
  return {    
    id: `formation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,  
    categories: formation.category,    
    competencesAcquises: competencesMap[formation.category] || ["Compétences techniques"],    
    description: formation.description,    
    duree: formation.duration,    
    lien: `https://formup.com/courses/${formation.title.toLowerCase().replace(/\s+/g, '-')}`,    
    niveau: niveau,    
    profil: profilMapping[formation.category] || formation.category,    
    titre: formation.title,    
    urlImage: formation.image,    
    instructeur: formation.instructor,  
    rating: formation.rating,  
    students: formation.students,  
    dateCreation: new Date().toISOString(),    
    actif: true,  
      
    // Nouvelles sections enrichies  
    lessons: generateLessons(formation.category, formation.title),  
    prerequis: generatePrerequisites(formation.category),  
    certification: generateCertification(formation.category, formation.title),  
    objectifsPedagogiques: generateObjectifs(formation.category),  
    ressources: [  
      { type: "PDF", nom: "Guide de référence", taille: "2.5 MB" },  
      { type: "Vidéo", nom: "Démonstrations pratiques", duree: "3h30" },  
      { type: "Code", nom: "Exemples et exercices", format: "GitHub" },  
      { type: "Quiz", nom: "Évaluations interactives", nombre: 15 }  
    ],  
    evaluation: {  
      type: "Mixte",  
      composantes: [  
        { nom: "Quiz intermédiaires", poids: "30%" },  
        { nom: "Projet pratique", poids: "50%" },  
        { nom: "Examen final", poids: "20%" }  
      ],  
      noteMinimale: "12/20"  
    },  
    support: {  
      forum: true,  
      mentoring: "1h/semaine",  
      assistance: "Email sous 24h"  
    }  
  };    
}  
  
async function uploadAllFormations() {    
  try {    
    console.log('🚀 Début upload formations enrichies...');    
        
    const formationsCollection = collection(db, 'formations');    
    let successCount = 0;    
        
    const formations = [ // Toutes les 31 formations avec leurs données complètes  
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
            
        console.log(`✅ "${formation.title}" enrichie et ajoutée (ID: ${docRef.id})`);    
        successCount++;    
            
        // Pause pour éviter la surcharge    
        await new Promise(resolve => setTimeout(resolve, 200));    
            
      } catch (error) {    
        console.error(`❌ Erreur pour "${formation.title}":`, error);    
      }    
    }    
        
    console.log(`✅ Upload terminé: ${successCount}/${formations.length} formations enrichies ajoutées`);    
    alert(`${successCount} formations enrichies ajoutées avec succès!`);    
        
  } catch (error) {    
    console.error('💥 Erreur générale:', error);    
    alert('Erreur lors de l\'upload: ' + error.message);    
  }    
}    
    
// Exécuter automatiquement    
uploadAllFormations();