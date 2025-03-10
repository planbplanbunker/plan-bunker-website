/**
 * Nos-Bunkers.fr - Script optimisé pour la FAQ
 * Ce fichier gère toutes les interactions de la FAQ : accordéon, recherche, filtrage
 */

document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const faqItems = document.querySelectorAll('.faq-item');
    const searchInput = document.getElementById('faq-search');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const faqCategories = document.querySelectorAll('.faq-category');
    
    // S'assurer que le premier élément de chaque catégorie est ouvert par défaut
    faqCategories.forEach(category => {
        const firstItem = category.querySelector('.faq-item');
        if (firstItem) {
            firstItem.classList.add('active');
        }
    });

    // Initialiser l'accordéon FAQ
    initAccordion();

    // Initialiser la recherche
    if (searchInput) {
        initSearch();
    }

    // Initialiser le filtrage par catégorie
    if (categoryButtons.length > 0) {
        initCategoryFilter();
    }

    /**
     * Initialisation de l'accordéon pour les éléments FAQ
     */
    function initAccordion() {
        if (!faqItems.length) return;

        // Ajouter des événements de clic à toutes les questions
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (!question) return;

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
        // Créer un élément pour "aucun résultat" s'il n'existe pas déjà
        let noResultsEl = document.querySelector('.faq-no-results');
        if (!noResultsEl) {
            noResultsEl = document.createElement('div');
            noResultsEl.className = 'faq-no-results';
            noResultsEl.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>Aucun résultat trouvé</h3>
                    <p>Essayez d'autres termes de recherche ou explorez les catégories.</p>
                    <p>Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à <a href="contact.html">nous contacter directement</a>.</p>
                </div>
            `;
            const faqMainSection = document.querySelector('.faq-main-section .container');
            if (faqMainSection) {
                faqMainSection.prepend(noResultsEl);
            }
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
            faqCategories.forEach(category => {
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
                noResultsEl.style.display = 'block';
            } else {
                noResultsEl.style.display = 'none';
            }

        }, 300));

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

            if (question) traverseNodes(question);
            if (answer) traverseNodes(answer);
        }

        // Réinitialiser la recherche
        function resetSearch() {
            // Restaurer tous les éléments
            faqCategories.forEach(category => {
                category.style.display = 'block';

                category.querySelectorAll('.faq-item').forEach((item, index) => {
                    item.style.display = 'block';

                    // Supprimer les mises en évidence
                    const highlights = item.querySelectorAll('.highlight');
                    highlights.forEach(highlight => {
                        const parent = highlight.parentNode;
                        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                        parent.normalize();
                    });

                    // Fermer tous les éléments sauf le premier de chaque catégorie
                    if (index !== 0) {
                        item.classList.remove('active');
                    } else {
                        item.classList.add('active');
                    }
                });
            });

            // Masquer le message "aucun résultat"
            const noResults = document.querySelector('.faq-no-results');
            if (noResults) {
                noResults.style.display = 'none';
            }
        }

        // Ajouter un événement au bouton de recherche
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
    }

    /**
     * Initialisation du filtrage par catégorie
     */
    function initCategoryFilter() {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Retirer la classe active de tous les boutons
                categoryButtons.forEach(btn => {
                    btn.classList.remove('active');
                });

                // Ajouter la classe active au bouton cliqué
                this.classList.add('active');

                // Obtenir la catégorie à filtrer
                const filter = this.getAttribute('data-category');

                // Si "all", afficher toutes les catégories
                if (filter === 'all') {
                    faqCategories.forEach(category => {
                        category.style.display = 'block';
                    });
                } else {
                    // Sinon, filtrer par catégorie
                    faqCategories.forEach(category => {
                        const categoryId = category.getAttribute('id');
                        if (categoryId === filter) {
                            category.style.display = 'block';
                            // Faire défiler jusqu'à la catégorie
                            scrollToElement(category);
                        } else {
                            category.style.display = 'none';
                        }
                    });
                }

                // Réinitialiser la recherche
                if (searchInput) {
                    searchInput.value = '';
                    const event = new Event('input');
                    searchInput.dispatchEvent(event);
                }
            });
        });

        // Ajouter des liens aux tags de sujet dans le contenu
        document.querySelectorAll('.topic-tag').forEach(tag => {
            tag.addEventListener('click', function(e) {
                e.preventDefault();

                // Obtenir l'ID de la catégorie cible
                const targetId = this.getAttribute('href').substring(1);
                const targetCategory = document.getElementById(targetId);

                // Trouver le bouton de catégorie correspondant
                categoryButtons.forEach(btn => {
                    if (btn.getAttribute('data-category') === targetId) {
                        // Simuler un clic sur ce bouton
                        btn.click();
                    }
                });

                if (targetCategory) {
                    // Faire défiler jusqu'à la catégorie
                    scrollToElement(targetCategory);
                }
            });
        });
    }

    /**
     * Fonction utilitaire pour faire défiler l'écran vers un élément
     */
    function scrollToElement(element) {
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;
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
