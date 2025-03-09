/**
 * Nos-Bunkers.fr - Script principal
 * Ce fichier contient les fonctionnalités JavaScript générales du site
 */

document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const header = document.querySelector('.main-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const alertBanner = document.querySelector('.alert-banner');
    const closeBannerBtn = document.querySelector('.close-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    const registrationForm = document.getElementById('registration-form');
    const interestSelect = document.getElementById('interests');
    const skillsField = document.querySelector('.skills-field');
    const modal = document.getElementById('success-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal, .close-modal-btn');

    // Effet de scroll pour l'en-tête
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Menu mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            document.body.classList.toggle('menu-open');

            // Animation des barres du menu burger
            const spans = menuToggle.querySelectorAll('span');
            spans[0].classList.toggle('rotate-down');
            spans[1].classList.toggle('fade-out');
            spans[2].classList.toggle('rotate-up');
        });
    }

    // Fermeture de la bannière d'alerte
    if (closeBannerBtn && alertBanner) {
        closeBannerBtn.addEventListener('click', function() {
            alertBanner.style.height = alertBanner.offsetHeight + 'px';
            setTimeout(() => {
                alertBanner.style.height = '0';
                alertBanner.style.padding = '0';
                alertBanner.style.opacity = '0';

                // Stockage de l'état dans localStorage
                localStorage.setItem('alertBannerClosed', 'true');

                // Suppression complète après la transition
                setTimeout(() => {
                    alertBanner.style.display = 'none';
                }, 500);
            }, 10);
        });

        // Vérifier si la bannière a déjà été fermée
        if (localStorage.getItem('alertBannerClosed') === 'true') {
            alertBanner.style.display = 'none';
        }
    }

    // Accordéon FAQ
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', () => {
                // Fermer les autres éléments
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });

                // Basculer l'état actif de l'élément actuel
                item.classList.toggle('active');
            });
        });
    }

    // Gestion du formulaire d'inscription
    if (registrationForm) {
        // Afficher/masquer le champ de compétences en fonction de la sélection
        if (interestSelect && skillsField) {
            interestSelect.addEventListener('change', function() {
                if (this.value === 'contribute') {
                    document.querySelectorAll('.skills-field').forEach(field => {
                        field.style.display = 'block';
                    });
                } else {
                    document.querySelectorAll('.skills-field').forEach(field => {
                        field.style.display = 'none';
                    });
                }
            });
        }

        // Soumission du formulaire
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simuler l'envoi des données (à remplacer par votre propre logique d'API)
            const formData = new FormData(this);
            const formObject = {};

            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            console.log('Form data:', formObject);

            // Simuler un délai d'envoi
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

            setTimeout(() => {
                // Réinitialiser le formulaire
                this.reset();

                // Réinitialiser le bouton
                submitButton.disabled = false;
                submitButton.innerHTML = 'Rejoindre le projet';

                // Afficher le modal de succès
                if (modal) {
                    modal.classList.add('active');
                }

                // Mettre à jour le compteur (simulé)
                const participantsCounter = document.querySelector('.counter-item .count[data-count="1250"]');
                if (participantsCounter) {
                    const currentCount = parseInt(participantsCounter.getAttribute('data-count'));
                    participantsCounter.setAttribute('data-count', currentCount + 1);
                    updateCounter(participantsCounter);
                }
            }, 2000);
        });
    }

    // Fermeture du modal
    if (closeModalBtns.length > 0) {
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
        });

        // Fermer le modal en cliquant à l'extérieur
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Activer les liens du menu en fonction de la section active
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-list a');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Scroll doux pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Ignorer les liens qui ne pointent pas vers un élément existant
            if (targetId === '#' || !document.querySelector(targetId)) {
                return;
            }

            e.preventDefault();

            // Fermer le menu mobile si ouvert
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                document.body.classList.remove('menu-open');
            }

            const targetElement = document.querySelector(targetId);
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Initialiser les compteurs
    const counters = document.querySelectorAll('.count');

    if (counters.length > 0) {
        // Fonction pour animer les compteurs
        function updateCounter(counter) {
            const target = parseInt(counter.getAttribute('data-count'));
            const count = parseInt(counter.innerText);
            const increment = target / 100;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => updateCounter(counter), 20);
            } else {
                counter.innerText = target;
            }
        }

        // Observer l'intersection pour démarrer l'animation au scroll
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    // Animation d'apparition des éléments au scroll
    const animateElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right');

    if (animateElements.length > 0) {
        const appearOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -100px 0px"
        };

        const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            });
        }, appearOptions);

        animateElements.forEach(element => {
            appearOnScroll.observe(element);
        });
    }
});

// Ajouter les classes d'animation aux éléments
window.addEventListener('load', function() {
    // Hero Section
    document.querySelector('.hero-content h1').classList.add('fade-in');
    document.querySelector('.hero-content p').classList.add('fade-in');
    document.querySelector('.hero-cta').classList.add('fade-in');

    // Problem Section
    document.querySelectorAll('.problem-text, .problem-image').forEach(el => {
        el.classList.add('slide-up');
    });

    // Solution Section
    document.querySelectorAll('.card').forEach((card, index) => {
        card.classList.add('slide-up');
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Pricing Section
    document.querySelectorAll('.pricing-card').forEach((card, index) => {
        card.classList.add('slide-up');
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Join Section
    document.querySelector('.join-form').classList.add('slide-in-left');
    document.querySelector('.join-info').classList.add('slide-in-right');
});