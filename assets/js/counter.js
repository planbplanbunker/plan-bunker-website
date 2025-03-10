/**
 * Nos-Bunkers.fr - Script d'animation des compteurs
 * Ce fichier gère l'animation des compteurs de statistiques sur la page d'accueil
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner tous les éléments compteurs
    const counters = document.querySelectorAll('.count');

    // Si aucun compteur n'est trouvé, ne rien faire
    if (!counters.length) return;

    // Observer l'intersection pour démarrer l'animation lors du scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Si l'élément est visible
            if (entry.isIntersecting) {
                // Initialiser le compteur à zéro
                const counter = entry.target;
                counter.innerText = '0';

                // Récupérer la valeur cible depuis l'attribut data-count
                const target = parseInt(counter.getAttribute('data-count'));

                // Calculer la durée de l'animation
                const duration = 2000; // ms
                // Calculer le pas pour atteindre la cible
                const step = (target / duration) * 10;

                // Démarrer l'animation
                animateCounter(counter, 0, target, step);

                // Arrêter d'observer cet élément
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5, // Déclencher lorsque 50% de l'élément est visible
        rootMargin: '0px 0px -100px 0px' // Marge négative pour déclencher plus tôt
    });

    // Observer chaque compteur
    counters.forEach(counter => {
        observer.observe(counter);
    });

    /**
     * Animer un compteur de sa valeur actuelle à la valeur cible
     * @param {Element} counter - L'élément DOM du compteur
     * @param {number} current - La valeur actuelle
     * @param {number} target - La valeur cible
     * @param {number} step - Le pas d'incrémentation
     */
    function animateCounter(counter, current, target, step) {
        // Calculer la nouvelle valeur
        current += step;

        // Si nous avons dépassé la cible, fixer à la cible
        if (current >= target) {
            counter.innerText = formatNumber(target);

            // Ajouter une petite animation une fois terminé
            counter.style.transform = 'scale(1.2)';
            setTimeout(() => {
                counter.style.transform = 'scale(1)';
            }, 200);

            return;
        }

        // Mettre à jour le compteur avec la valeur formatée
        counter.innerText = formatNumber(Math.floor(current));

        // Continuer l'animation
        requestAnimationFrame(() => {
            animateCounter(counter, current, target, step);
        });
    }

    /**
     * Formater un nombre avec des séparateurs de milliers
     * @param {number} num - Le nombre à formater
     * @return {string} - Le nombre formaté
     */
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    }

    /**
     * Créer des nombres qui montent et descendent aléatoirement pour simuler des mises à jour en temps réel
     */
    function simulateLiveUpdates() {
        // Sélectionner tous les compteurs
        const participantsCounter = document.querySelector('.counter-item .count[data-count="1250"]');
        const bunkersCounter = document.querySelector('.counter-item .count[data-count="8"]');

        if (participantsCounter) {
            // Toutes les 3-7 secondes, ajouter 1-3 participants
            setInterval(() => {
                const currentParticipants = parseInt(participantsCounter.innerText.replace(/\s/g, ''));
                const increment = Math.floor(Math.random() * 3) + 1;
                const newValue = currentParticipants + increment;

                // Animation d'incrémentation douce
                let current = currentParticipants;
                const animateIncrement = () => {
                    current++;
                    participantsCounter.innerText = formatNumber(current);

                    if (current < newValue) {
                        setTimeout(animateIncrement, 300);
                    } else {
                        // Mettre à jour l'attribut data-count
                        participantsCounter.setAttribute('data-count', newValue);

                        // Ajouter une petite animation
                        participantsCounter.style.color = '#4CAF50';
                        setTimeout(() => {
                            participantsCounter.style.color = '';
                        }, 1000);
                    }
                };

                animateIncrement();
            }, Math.floor(Math.random() * 4000) + 3000);
        }

        if (bunkersCounter) {
            // Toutes les 30-60 secondes, peut-être ajouter un bunker (25% de chances)
            setInterval(() => {
                // 25% de chances d'ajouter un bunker
                if (Math.random() < 0.25) {
                    const currentBunkers = parseInt(bunkersCounter.innerText.replace(/\s/g, ''));
                    const newValue = currentBunkers + 1;

                    // Animation d'incrémentation
                    bunkersCounter.style.transition = 'all 0.5s';
                    bunkersCounter.style.transform = 'scale(1.5)';
                    bunkersCounter.style.color = '#4CAF50';

                    setTimeout(() => {
                        bunkersCounter.innerText = formatNumber(newValue);
                        bunkersCounter.setAttribute('data-count', newValue);

                        setTimeout(() => {
                            bunkersCounter.style.transform = 'scale(1)';
                            bunkersCounter.style.color = '';
                        }, 500);
                    }, 500);
                }
            }, Math.floor(Math.random() * 30000) + 30000);
        }
    }

    // Démarrer la simulation de mises à jour en temps réel après 10 secondes
    setTimeout(simulateLiveUpdates, 10000);

    /**
     * Animation spéciale pour le compteur de capacité d'autonomie
     * Fait "respirer" le compteur pour attirer l'attention
     */
    function animateAutonomyCounter() {
        const autonomyCounter = document.querySelector('.counter-item .count[data-count="150"]');

        if (!autonomyCounter) return;

        // Animation subtile de respiration
        setInterval(() => {
            autonomyCounter.style.transition = 'all 2s ease-in-out';
            autonomyCounter.style.textShadow = '0 0 10px rgba(255, 183, 3, 0.7)';

            setTimeout(() => {
                autonomyCounter.style.textShadow = 'none';
            }, 2000);
        }, 10000);
    }

    // Démarrer l'animation du compteur d'autonomie après 15 secondes
    setTimeout(animateAutonomyCounter, 15000);
});