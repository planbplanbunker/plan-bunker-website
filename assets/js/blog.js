/**
 * Nos-Bunkers.fr - Script pour la page blog
 * Ce fichier gère les fonctionnalités interactives pour la page blog
 */

document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const blogSearch = document.getElementById('blog-search');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const postCards = document.querySelectorAll('.post-card');
    const featuredPost = document.querySelector('.featured-post');

    // Initialiser la recherche
    initSearch();

    // Initialiser le filtrage par catégorie
    initCategoryFilters();

    /**
     * Initialisation de la fonctionnalité de recherche
     */
    function initSearch() {
        if (!blogSearch) return;

        // Élément pour "aucun résultat"
        const noResultsElement = document.createElement('div');
        noResultsElement.className = 'no-results';
        noResultsElement.innerHTML = '<p>Aucun résultat trouvé pour votre recherche. Essayez d\'autres termes ou <a href="contact.html">contactez-nous</a> pour plus d\'informations.</p>';
        noResultsElement.style.display = 'none';

        // Ajouter l'élément au contenu
        const blogContent = document.querySelector('.blog-content');
        if (blogContent) {
            blogContent.appendChild(noResultsElement);
        }

        // Événement de saisie pour la recherche en temps réel
        blogSearch.addEventListener('input', debounce(function() {
            const searchText = this.value.trim().toLowerCase();

            // Si le champ de recherche est vide, réinitialiser tout
            if (searchText === '') {
                resetSearch();
                return;
            }

            // Compteur de résultats
            let resultCount = 0;

            // Rechercher dans l'article mis en avant
            if (featuredPost) {
                const featuredTitle = featuredPost.querySelector('h2').textContent.toLowerCase();
                const featuredExcerpt = featuredPost.querySelector('.post-excerpt').textContent.toLowerCase();

                if (featuredTitle.includes(searchText) || featuredExcerpt.includes(searchText)) {
                    featuredPost.style.display = 'block';
                    highlightText(featuredPost, searchText);
                    resultCount++;
                } else {
                    featuredPost.style.display = 'none';
                }
            }

            // Rechercher dans les articles
            postCards.forEach(card => {
                const cardTitle = card.querySelector('h3').textContent.toLowerCase();
                const cardExcerpt = card.querySelector('.post-excerpt').textContent.toLowerCase();

                if (cardTitle.includes(searchText) || cardExcerpt.includes(searchText)) {
                    card.style.display = 'flex';
                    highlightText(card, searchText);
                    resultCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Afficher ou masquer le message "aucun résultat"
            if (resultCount === 0) {
                noResultsElement.style.display = 'block';
            } else {
                noResultsElement.style.display = 'none';
            }

        }, 300));

        // Bouton de recherche
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                // Déclencher l'événement input pour lancer la recherche
                const event = new Event('input');
                blogSearch.dispatchEvent(event);
            });
        }

        // Touche Entrée pour rechercher
        blogSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const event = new Event('input');
                blogSearch.dispatchEvent(event);
            }
        });
    }

    /**
     * Mettre en évidence le texte recherché
     */
    function highlightText(element, searchText) {
        // Supprimer les mises en évidence existantes
        const highlights = element.querySelectorAll('.highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });

        // Mettre en évidence dans le titre
        const title = element.querySelector('h2, h3');
        if (title) {
            highlightTextInNode(title, searchText);
        }

        // Mettre en évidence dans l'extrait
        const excerpt = element.querySelector('.post-excerpt');
        if (excerpt) {
            highlightTextInNode(excerpt, searchText);
        }
    }

    /**
     * Mettre en évidence le texte dans un nœud spécifique
     */
    function highlightTextInNode(node, searchText) {
        const innerHTML = node.innerHTML;
        const index = innerHTML.toLowerCase().indexOf(searchText);

        if (index >= 0) {
            const before = innerHTML.substring(0, index);
            const match = innerHTML.substring(index, index + searchText.length);
            const after = innerHTML.substring(index + searchText.length);

            node.innerHTML = before + '<span class="highlight">' + match + '</span>' + after;
        }
    }

    /**
     * Réinitialiser la recherche
     */
    function resetSearch() {
        // Réinitialiser l'article mis en avant
        if (featuredPost) {
            featuredPost.style.display = 'block';

            // Supprimer les mises en évidence
            const featuredHighlights = featuredPost.querySelectorAll('.highlight');
            featuredHighlights.forEach(highlight => {
                const parent = highlight.parentNode;
                parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                parent.normalize();
            });
        }

        // Réinitialiser tous les articles
        postCards.forEach(card => {
            card.style.display = 'flex';

            // Supprimer les mises en évidence
            const cardHighlights = card.querySelectorAll('.highlight');
            cardHighlights.forEach(highlight => {
                const parent = highlight.parentNode;
                parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                parent.normalize();
            });
        });

        // Masquer le message "aucun résultat"
        const noResultsElement = document.querySelector('.no-results');
        if (noResultsElement) {
            noResultsElement.style.display = 'none';
        }
    }

    /**
     * Initialisation du filtrage par catégorie
     */
    function initCategoryFilters() {
        if (!categoryButtons.length) return;

        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Supprimer la classe active de tous les boutons
                categoryButtons.forEach(btn => {
                    btn.classList.remove('active');
                });

                // Ajouter la classe active au bouton cliqué
                this.classList.add('active');

                // Récupérer la catégorie sélectionnée
                const category = this.getAttribute('data-category');

                // Réinitialiser le champ de recherche
                if (blogSearch) {
                    blogSearch.value = '';
                }

                // Filtrer les articles
                filterPosts(category);
            });
        });
    }

    /**
     * Filtrer les articles selon la catégorie
     */
    function filterPosts(category) {
        // Réinitialiser l'article mis en avant
        if (featuredPost) {
            featuredPost.style.display = 'block';
        }

        // Si la catégorie est "all", afficher tous les articles
        if (category === 'all') {
            postCards.forEach(card => {
                card.style.display = 'flex';
            });
            return;
        }

        // Sinon, filtrer les articles selon la catégorie
        postCards.forEach(card => {
            const cardTag = card.querySelector('.post-tag').textContent.toLowerCase();

            if (cardTag === category) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        // Filtrer également l'article mis en avant
        if (featuredPost) {
            const featuredTag = featuredPost.querySelector('.post-tag').textContent.toLowerCase();

            if (featuredTag !== category) {
                featuredPost.style.display = 'none';
            }
        }
    }

    /**
     * Fonction debounce pour limiter les appels à une fonction
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

    // Newsletter du blog
    const sidebarNewsletterForm = document.querySelector('.sidebar-newsletter-form');
    if (sidebarNewsletterForm) {
        sidebarNewsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simuler l'envoi
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            if (!emailInput || !validateEmail(emailInput.value)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }

            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inscription...';

            // Simuler un délai
            setTimeout(() => {
                // Réinitialiser le formulaire
                emailInput.value = '';
                submitButton.disabled = false;
                submitButton.textContent = originalText;

                // Afficher un message de confirmation
                const confirmationMessage = document.createElement('div');
                confirmationMessage.className = 'newsletter-confirmation';
                confirmationMessage.innerHTML = '<i class="fas fa-check-circle"></i> Merci pour votre inscription !';
                confirmationMessage.style.backgroundColor = 'var(--success)';
                confirmationMessage.style.color = 'white';
                confirmationMessage.style.padding = '10px';
                confirmationMessage.style.borderRadius = '4px';
                confirmationMessage.style.marginTop = '10px';
                confirmationMessage.style.textAlign = 'center';

                sidebarNewsletterForm.parentNode.insertBefore(confirmationMessage, sidebarNewsletterForm.nextSibling);

                // Supprimer le message après quelques secondes
                setTimeout(() => {
                    confirmationMessage.style.opacity = '0';
                    confirmationMessage.style.transition = 'opacity 0.5s';
                    setTimeout(() => {
                        confirmationMessage.remove();
                    }, 500);
                }, 3000);
            }, 1000);
        });
    }

    /**
     * Valider le format d'un email
     */
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Animation des éléments au scroll
    const animateElements = document.querySelectorAll('.post-card, .featured-post, .sidebar-widget');

    if (animateElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(element);
        });
    }

    // Classe pour animation
    function addFadeInClass() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .fade-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(styleSheet);
    }

    addFadeInClass();
});