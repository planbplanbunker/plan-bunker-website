/**
 * PlanBPlanBunker - Script FAQ simplifié
 * Version simplifiée et garantie fonctionnelle pour l'accordéon et la recherche
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Chargement du script FAQ simplifié');

    // ACCORDÉON - implémentation simple et directe
    document.querySelectorAll('.faq-question').forEach(function(question) {
        console.log('Attachement d\'un événement de clic à une question FAQ');

        question.addEventListener('click', function() {
            console.log('Question cliquée');

            // Toggle la classe "active" sur l'élément parent (faq-item)
            const faqItem = this.parentElement;
            faqItem.classList.toggle('active');

            console.log('État de l\'item après clic:', faqItem.classList.contains('active') ? 'ouvert' : 'fermé');
        });
    });

    // RECHERCHE - implémentation simplifiée
    const searchInput = document.getElementById('faq-search');
    const searchButton = document.querySelector('.search-btn');

    if (searchInput && searchButton) {
        console.log('Éléments de recherche trouvés, attachement des événements');

        // Fonction de recherche
        function performSearch() {
            const searchTerm = searchInput.value.trim().toLowerCase();
            console.log('Recherche pour:', searchTerm);

            if (searchTerm === '') {
                // Réinitialiser tous les éléments si la recherche est vide
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.style.display = 'block';
                });
                document.querySelectorAll('.faq-category').forEach(cat => {
                    cat.style.display = 'block';
                });
                document.getElementById('faq-no-results').style.display = 'none';
                return;
            }

            let resultsFound = false;

            // Parcourir tous les éléments FAQ
            document.querySelectorAll('.faq-item').forEach(item => {
                const questionText = item.querySelector('.faq-question h3').textContent.toLowerCase();
                const answerText = item.querySelector('.faq-answer').textContent.toLowerCase();

                if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
                    item.style.display = 'block';
                    item.classList.add('active'); // Ouvrir les résultats
                    resultsFound = true;
                } else {
                    item.style.display = 'none';
                }
            });

            // Vérifier chaque catégorie pour voir si elle a des résultats visibles
            document.querySelectorAll('.faq-category').forEach(category => {
                const visibleItems = Array.from(category.querySelectorAll('.faq-item')).filter(
                    item => item.style.display !== 'none'
                );

                category.style.display = visibleItems.length > 0 ? 'block' : 'none';
            });

            // Afficher le message "Aucun résultat" si nécessaire
            document.getElementById('faq-no-results').style.display = resultsFound ? 'none' : 'block';
        }

        // Attacher les événements de recherche
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    // FILTRAGE PAR CATÉGORIE
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            console.log('Filtrage par catégorie:', category);

            // Réinitialiser la recherche
            if (searchInput) searchInput.value = '';

            // Mettre à jour les boutons actifs
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            // Filtrer les catégories
            if (category === 'all') {
                document.querySelectorAll('.faq-category').forEach(cat => {
                    cat.style.display = 'block';
                });
            } else {
                document.querySelectorAll('.faq-category').forEach(cat => {
                    cat.style.display = cat.id === category ? 'block' : 'none';
                });
            }

            // Masquer le message "Aucun résultat"
            document.getElementById('faq-no-results').style.display = 'none';
        });
    });

    console.log('Initialisation du script FAQ terminée');
});