/**
 * PlanBPlanBunker - Script pour le carrousel de témoignages
 * Ce fichier gère le carrousel de témoignages sur la page communauté
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner les éléments du carrousel
    const testimonialContainer = document.querySelector('.testimonials-container');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');

    // Vérifier si les éléments existent
    if (!testimonialContainer || !testimonialCards.length || !prevBtn || !nextBtn || !dots.length) return;

    // Variables du carrousel
    let currentIndex = 0;
    const totalSlides = testimonialCards.length;

    // Initialiser le carrousel
    initCarousel();

    // Configurer le carrousel
    function initCarousel() {
        // Masquer tous les témoignages sauf le premier
        testimonialCards.forEach((card, index) => {
            if (index !== 0) {
                card.style.display = 'none';
            }
        });

        // Ajouter des gestionnaires d'événements pour les boutons
        prevBtn.addEventListener('click', showPreviousSlide);
        nextBtn.addEventListener('click', showNextSlide);

        // Ajouter des gestionnaires d'événements pour les points
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });

        // Démarrer le défilement automatique
        startAutoSlide();
    }

    // Fonction pour afficher la diapositive précédente
    function showPreviousSlide() {
        goToSlide(currentIndex - 1);
    }

    // Fonction pour afficher la diapositive suivante
    function showNextSlide() {
        goToSlide(currentIndex + 1);
    }

    // Fonction pour aller à une diapositive spécifique
    function goToSlide(index) {
        // Gérer les limites
        if (index < 0) {
            index = totalSlides - 1;
        } else if (index >= totalSlides) {
            index = 0;
        }

        // Masquer le témoignage actuel
        testimonialCards[currentIndex].style.display = 'none';
        dots[currentIndex].classList.remove('active');

        // Afficher le nouveau témoignage
        testimonialCards[index].style.display = 'flex';
        dots[index].classList.add('active');

        // Mettre à jour l'index actuel
        currentIndex = index;

        // Réinitialiser le défilement automatique
        resetAutoSlide();
    }

    // Variables pour le défilement automatique
    let autoSlideInterval;
    const autoSlideDelay = 5000; // 5 secondes

    // Fonction pour démarrer le défilement automatique
    function startAutoSlide() {
        autoSlideInterval = setInterval(showNextSlide, autoSlideDelay);
    }

    // Fonction pour réinitialiser le défilement automatique
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Pause du défilement au survol du carrousel
    testimonialContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    // Reprise du défilement à la sortie du carrousel
    testimonialContainer.addEventListener('mouseleave', startAutoSlide);

    // Gestion des événements tactiles pour les appareils mobiles
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    testimonialContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50; // Distance minimale pour considérer comme un swipe

        // Swipe vers la gauche
        if (touchEndX < touchStartX - swipeThreshold) {
            showNextSlide();
        }

        // Swipe vers la droite
        if (touchEndX > touchStartX + swipeThreshold) {
            showPreviousSlide();
        }
    }

    // Animation d'entrée et de sortie des témoignages
    function animateSlideTransition(outCard, inCard) {
        // Animations avec des classes CSS
        outCard.classList.add('slide-out');

        setTimeout(() => {
            outCard.style.display = 'none';
            outCard.classList.remove('slide-out');

            inCard.classList.add('slide-in');
            inCard.style.display = 'flex';

            setTimeout(() => {
                inCard.classList.remove('slide-in');
            }, 500);
        }, 500);
    }

    // Ajouter des styles pour les animations
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50px);
            }
        }
        
        .slide-in {
            animation: slideIn 0.5s ease forwards;
        }
        
        .slide-out {
            animation: slideOut 0.5s ease forwards;
        }
    `;
    document.head.appendChild(styleElement);

    // Amélioration de l'accessibilité
    prevBtn.setAttribute('aria-label', 'Témoignage précédent');
    nextBtn.setAttribute('aria-label', 'Témoignage suivant');

    dots.forEach((dot, index) => {
        dot.setAttribute('aria-label', `Témoignage ${index + 1} sur ${totalSlides}`);
    });
});