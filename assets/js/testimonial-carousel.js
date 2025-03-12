/**
 * Script pour gérer le carrousel de témoignages
 */
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner le carrousel
    const carousel = document.querySelector('.testimonial-carousel');

    // Si le carrousel n'existe pas, ne rien faire
    if (!carousel) return;

    // Sélectionner les éléments nécessaires
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const indicators = carousel.querySelectorAll('.indicator');

    // Définir les variables de contrôle
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 6000; // 6 secondes par slide

    // Fonction pour initialiser le carrousel
    function initCarousel() {
        // S'assurer que le premier slide est actif
        slides[0].classList.add('active');
        indicators[0].classList.add('active');

        // Démarrer le défilement automatique
        startAutoSlide();

        // Ajouter les événements aux indicateurs
        setupIndicators();

        // Ajouter les événements de pause au survol
        setupHoverPause();
    }

    // Fonction pour passer au slide suivant
    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    // Fonction pour passer à un slide spécifique
    function goToSlide(index) {
        // Masquer le slide actuel
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');

        // Définir le nouveau slide
        currentSlide = index;

        // Afficher le nouveau slide
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    // Démarrer le défilement automatique
    function startAutoSlide() {
        // Arrêter l'intervalle existant si présent
        if (slideInterval) {
            clearInterval(slideInterval);
        }

        // Démarrer un nouvel intervalle
        slideInterval = setInterval(function() {
            nextSlide();
        }, intervalTime);
    }

    // Configurer les indicateurs
    function setupIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                goToSlide(index);
                startAutoSlide(); // Redémarrer l'intervalle
            });
        });
    }

    // Configurer la pause au survol
    function setupHoverPause() {
        carousel.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });

        carousel.addEventListener('mouseleave', function() {
            startAutoSlide();
        });
    }

    // Initialiser le carrousel
    initCarousel();
});