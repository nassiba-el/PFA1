    // Import Firebase modules
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

    // Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyDTXKERrlU7d1kbBjBjbzQOOBYvWjQgMaE",
      authDomain: "pfaouafaa.firebaseapp.com",
      projectId: "pfaouafaa",
      storageBucket: "pfaouafaa.firebasestorage.app",
      messagingSenderId: "1062998313084",
      appId: "1:1062998313084:web:7c7a9b9b9b9b9b9b9b9b9b",
      measurementId: "G-KF7CNM89K2"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    // Search functionality
    document.querySelector('.search-input').addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      console.log('Recherche:', searchTerm);
      // Ici vous pouvez ajouter la logique de recherche
    });

    // Category click handlers
    document.querySelectorAll('.category-badge').forEach(badge => {
      badge.addEventListener('click', function(e) {
        e.preventDefault();
        const category = this.textContent;
        console.log('Catégorie sélectionnée:', category);
        // Ici vous pouvez ajouter la logique de filtrage par catégorie
      });
    });

    // Smooth scroll animations
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

    // Initialize animations
    document.addEventListener('DOMContentLoaded', function() {
      // Animate hero content
      const heroContent = document.querySelector('.hero-content');
      heroContent.style.opacity = '0';
      heroContent.style.transform = 'translateY(30px)';
      heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      
      setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
      }, 300);
    });

    // Header scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
      const header = document.querySelector('.header');
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
      }
      lastScrollTop = scrollTop;
    });