/**
 * Nos-Bunkers.fr - Script pour la page FAQ
 * Ce fichier gère les fonctionnalités interactives de la page FAQ (accordéon, recherche, filtrage)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const faqItems = document.querySelectorAll('.faq-item');
    const searchInput = document.getElementById('faq-search');
    const topicTags = document.querySelectorAll('.topic-tag');

    // Initialiser les accordéons FAQ
    initAccordion();

    // Initialiser la recherche
    initSearch();

    // Initialiser le filtrage par catégorie
    initTopicFilters();

    /**
     * Initialisation de l'accordéon pour les éléments FAQ
     */
    function initAccordion() {
        if (!faqItems.length) return;

        // Fermer tous les éléments sauf le premier
        faqItems.forEach((item, index) => {
            if (index === 0) {
                item.classList.add('active');
            }
        });

        // Ajouter des événements de clic à toutes les questions
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', () => {
                // Si l'élément est déjà actif, le fermer
                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                } else {
                    // Fermer tous les autres éléments ouverts de la même catégorie
                    const category = item.closest('.faq-category');
                    if (category) {
                        const categoryItems = category.querySelectorAll('.faq-item');
                        categoryItems.forEach(otherItem => {
                            if (otherItem !== item && otherItem.classList.contains('active')) {
                                otherItem.classList.remove('active');
                            }
                        });
                    }

                    // Ouvrir l'élément actuel
                    item.classList.add('active');

                    // Faire défiler jusqu'à l'élément si nécessaire
                    scrollToElement(item);
                }
            });
        });
    }

    /**
     * Initialisation de la fonctionnalité de recherche
     */
    function initSearch() {
        if (!searchInput) return;

        // Créer un élément pour "aucun résultat"
        const noResultsEl = document.createElement('div');
        noResultsEl.className = 'no-results';
        noResultsEl.innerHTML = '<p>Aucun résultat trouvé pour votre recherche. Veuillez essayer d\'autres termes ou <a href="contact.html">contactez-nous</a> pour une assistance personnalisée.</p>';

        const faqContainer = document.querySelector('.faq-container');
        if (faqContainer) {
            faqContainer.appendChild(noResultsEl);
        }

        // Événement de saisie pour la recherche en temps réel
        searchInput.addEventListener('input', debounce(function() {
            const searchText = this.value.trim().toLowerCase();

            // Si le champ de recherche est vide, réinitialiser tout
            if (searchText === '') {
                resetSearch();
                return;
            }

            // Compter les résultats
            let resultCount = 0;

            // Pour chaque catégorie
            document.querySelectorAll('.faq-category').forEach(category => {
                let categoryHasResults = false;

                // Pour chaque élément FAQ dans cette catégorie
                category.querySelectorAll('.faq-item').forEach(item => {
                    const question = item.querySelector('.faq-question h3').innerText.toLowerCase();
                    const answer = item.querySelector('.faq-answer').innerText.toLowerCase();

                    // Vérifier si le texte de recherche est trouvé
                    if (question.includes(searchText) || answer.includes(searchText)) {
                        // Ouvrir l'élément et mettre en évidence les résultats
                        item.classList.add('active');
                        highlightText(item, searchText);
                        item.style.display = 'block';
                        categoryHasResults = true;
                        resultCount++;
                    } else {
                        // Masquer l'élément
                        item.style.display = 'none';
                    }
                });

                // Afficher ou masquer la catégorie en fonction des résultats
                if (categoryHasResults) {
                    category.style.display = 'block';
                } else {
                    category.style.display = 'none';
                }
            });

            // Afficher le message "aucun résultat" si nécessaire
            if (resultCount === 0) {
                noResultsEl.classList.add('visible');
            } else {
                noResultsEl.classList.remove('visible');
            }

        }, 300));

        // Bouton de recherche
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                // Déclencher l'événement input pour lancer la recherche
                const event = new Event('input');
                searchInput.dispatchEvent(event);
            });
        }

        // Touche Entrée pour rechercher
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const event = new Event('input');
                searchInput.dispatchEvent(event);
            }
        });

        // Fonction pour mettre en évidence le texte recherché
        function highlightText(item, searchText) {
            // Supprimer les mises en évidence existantes
            const highlights = item.querySelectorAll('.highlight');
            highlights.forEach(highlight => {
                const parent = highlight.parentNode;
                parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                parent.normalize();
            });

            // Fonction récursive pour parcourir tous les nœuds de texte
            function traverseNodes(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    const lowerText = text.toLowerCase();
                    const index = lowerText.indexOf(searchText);

                    if (index >= 0) {
                        // Créer un élément span pour la mise en évidence
                        const span = document.createElement('span');
                        span.className = 'highlight';

                        // Diviser le texte en trois parties
                        const before = text.substring(0, index);
                        const match = text.substring(index, index + searchText.length);
                        const after = text.substring(index + searchText.length);

                        // Ajouter le texte avant la correspondance
                        const beforeNode = document.createTextNode(before);
                        node.parentNode.insertBefore(beforeNode, node);

                        // Ajouter la correspondance mise en évidence
                        span.textContent = match;
                        node.parentNode.insertBefore(span, node);

                        // Remplacer le nœud actuel par le texte après la correspondance
                        const afterNode = document.createTextNode(after);
                        node.parentNode.replaceChild(afterNode, node);

                        // Continuer la recherche dans le reste du texte
                        traverseNodes(afterNode);
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'SCRIPT') {
                    // Parcourir les enfants pour les nœuds d'élément
                    Array.from(node.childNodes).forEach(child => {
                        traverseNodes(child);
                    });
                }
            }

            // Appliquer la mise en évidence à la question et à la réponse
            const question = item.querySelector('.faq-question h3');
            const answer = item.querySelector('.faq-answer');

            traverseNodes(question);
            traverseNodes(answer);
        }

        // Réinitialiser la recherche
        function resetSearch() {
            // Restaurer tous les éléments
            document.querySelectorAll('.faq-category').forEach(category => {
                category.style.display = 'block';

                category.querySelectorAll('.faq-item').forEach(item => {
                    item.style.display = 'block';

                    // Supprimer les mises en évidence
                    const highlights = item.querySelectorAll('.highlight');
                    highlights.forEach(highlight => {
                        const parent = highlight.parentNode;
                        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                        parent.normalize();
                    });

                    // Fermer tous les éléments sauf le premier de chaque catégorie
                    if (item !== category.querySelector('.faq-item')) {
                        item.classList.remove('active');
                    }
                });
            });

            // Masquer le message "aucun résultat"
            document.querySelector('.no-results').classList.remove('visible');
        }
    }

    /**
     * Initialisation du filtrage par catégorie
     */
    function initTopicFilters() {
        if (!topicTags.length) return;

        topicTags.forEach(tag => {
            tag.addEventListener('click', function(e) {
                e.preventDefault();

                // Récupérer l'ID de la catégorie cible
                const targetId = this.getAttribute('href').substring(1);
                const targetCategory = document.getElementById(targetId);

                if (targetCategory) {
                    // Réinitialiser la recherche
                    if (searchInput) {
                        searchInput.value = '';
                        const event = new Event('input');
                        searchInput.dispatchEvent(event);
                    }

                    // Faire défiler jusqu'à la catégorie
                    targetCategory.scrollIntoView({ behavior: 'smooth', block: 'start' });

                    // Ajouter une légère animation pour attirer l'attention
                    targetCategory.classList.add('fade-in');
                    setTimeout(() => {
                        targetCategory.classList.remove('fade-in');
                    }, 1000);
                }
            });
        });
    }

    /**
     * Fonction utilitaire pour faire défiler l'écran vers un élément
     */
    function scrollToElement(element) {
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight - 20;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Fonction utilitaire pour débouncer les événements
     */
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
});