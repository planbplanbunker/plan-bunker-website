/**
 * Nos-Bunkers.fr - Script de gestion des formulaires
 * Ce fichier contient les fonctionnalités pour la validation et la soumission des formulaires
 */

document.addEventListener('DOMContentLoaded', function() {
    // Formulaire d'inscription principal
    const registrationForm = document.getElementById('registration-form');
    const interestSelect = document.getElementById('interests');
    const skillsFields = document.querySelectorAll('.skills-field');

    // Modal de succès
    const successModal = document.getElementById('success-modal');

    // Préparation du formulaire
    if (registrationForm) {
        // Gestion conditionnelle des champs selon la sélection d'intérêt
        if (interestSelect) {
            // Cacher initialement les champs de compétences
            skillsFields.forEach(field => {
                field.style.display = 'none';
            });

            // Afficher/masquer les champs selon la sélection
            interestSelect.addEventListener('change', function() {
                if (this.value === 'contribute') {
                    // Afficher les champs de compétences
                    skillsFields.forEach(field => {
                        field.style.display = 'block';
                    });
                } else {
                    // Masquer les champs de compétences
                    skillsFields.forEach(field => {
                        field.style.display = 'none';
                    });
                }
            });
        }

        // Validation du formulaire à la soumission
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validation basique des champs requis
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    highlightError(field);
                } else {
                    removeError(field);
                }
            });

            // Validation spécifique de l'email
            const emailField = this.querySelector('input[type="email"]');
            if (emailField && !validateEmail(emailField.value)) {
                isValid = false;
                highlightError(emailField, 'Veuillez entrer une adresse email valide');
            }

            // Validation spécifique du téléphone
            const phoneField = this.querySelector('input[type="tel"]');
            if (phoneField && !validatePhone(phoneField.value)) {
                isValid = false;
                highlightError(phoneField, 'Veuillez entrer un numéro de téléphone valide');
            }

            // Si le champ de compétences est visible, s'assurer qu'il est rempli
            if (interestSelect && interestSelect.value === 'contribute') {
                const skillsField = document.getElementById('skills');
                if (skillsField && !skillsField.value.trim()) {
                    isValid = false;
                    highlightError(skillsField, 'Veuillez indiquer au moins une compétence');
                }
            }

            // Si le formulaire est valide, procéder à la soumission
            if (isValid) {
                submitForm(this);
            }
        });

        // Supprimer les messages d'erreur lors de la modification des champs
        registrationForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', function() {
                removeError(this);
            });
        });
    }

    // Formulaire de newsletter
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');

            if (!emailInput || !validateEmail(emailInput.value)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }

            // Simuler l'envoi de la newsletter
            const submitButton = this.querySelector('button');
            const originalText = submitButton.innerHTML;

            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inscription...';

            setTimeout(() => {
                this.reset();
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;

                // Afficher un message de confirmation
                const form = this;
                const confirmationMessage = document.createElement('div');
                confirmationMessage.className = 'newsletter-confirmation';
                confirmationMessage.innerHTML = '<i class="fas fa-check-circle"></i> Merci pour votre inscription à notre newsletter !';

                form.parentNode.insertBefore(confirmationMessage, form.nextSibling);

                // Supprimer le message après 5 secondes
                setTimeout(() => {
                    confirmationMessage.style.opacity = '0';
                    setTimeout(() => {
                        confirmationMessage.remove();
                    }, 500);
                }, 5000);
            }, 1500);
        });
    }

    /**
     * Fonctions utilitaires
     */

    // Mettre en évidence un champ avec erreur
    function highlightError(field, message = 'Ce champ est requis') {
        // Supprimer l'erreur existante si elle existe
        removeError(field);

        // Ajouter la classe d'erreur
        field.classList.add('error');

        // Créer et ajouter le message d'erreur
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;

        // Ajouter le message après le champ
        field.parentNode.appendChild(errorMessage);
    }

    // Supprimer l'indication d'erreur
    function removeError(field) {
        field.classList.remove('error');

        // Supprimer le message d'erreur s'il existe
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Valider le format d'email
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Valider le format de téléphone (format français)
    function validatePhone(phone) {
        // Accepte les formats: 06XXXXXXXX, 07XXXXXXXX, +33XXXXXXXXX, etc.
        // Supprime les espaces, tirets, points et parenthèses pour la validation
        const cleanPhone = phone.replace(/[\s\-\.\(\)]/g, '');

        // Format français
        const reFR = /^(0[1-9])(\d{8})$|^(\+33|0033)[1-9](\d{8})$/;

        return reFR.test(cleanPhone);
    }

    // Soumettre le formulaire
    function submitForm(form) {
        // Récupérer les données du formulaire
        const formData = new FormData(form);
        const formObject = {};

        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        console.log('Données du formulaire:', formObject);

        // Simuler un envoi vers le serveur
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement en cours...';

        // Simuler une requête réseau
        setTimeout(() => {
            // Dans un cas réel, vous enverriez les données à votre serveur ici
            // et attendriez une réponse avant de poursuivre

            // Réinitialiser le formulaire
            form.reset();

            // Masquer les champs conditionnels
            skillsFields.forEach(field => {
                field.style.display = 'none';
            });

            // Rétablir le bouton
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;

            // Afficher le modal de confirmation
            if (successModal) {
                successModal.classList.add('active');

                // Ajouter la gestion des boutons de partage
                const shareBtn = successModal.querySelector('.share-btn');
                if (shareBtn) {
                    shareBtn.addEventListener('click', function(e) {
                        e.preventDefault();

                        // Utiliser l'API Web Share si disponible
                        if (navigator.share) {
                            navigator.share({
                                title: 'Nos-Bunkers.fr - Sécurisez votre avenir',
                                text: 'J\'ai rejoint ce projet de bunkers communautaires pour assurer ma sécurité et celle de mes proches. Découvrez-le !',
                                url: window.location.href,
                            })
                                .catch(error => console.log('Erreur de partage:', error));
                        } else {
                            // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
                            const tempInput = document.createElement('input');
                            tempInput.value = window.location.href;
                            document.body.appendChild(tempInput);
                            tempInput.select();
                            document.execCommand('copy');
                            document.body.removeChild(tempInput);

                            alert('Lien copié dans le presse-papier ! Partagez-le avec vos proches.');
                        }
                    });
                }
            }

            // Mettre à jour le compteur de participants (simulé)
            const participantsCounter = document.querySelector('.counter-item .count[data-count="1250"]');
            if (participantsCounter) {
                const currentCount = parseInt(participantsCounter.getAttribute('data-count'));
                participantsCounter.setAttribute('data-count', currentCount + 1);
                participantsCounter.textContent = currentCount + 1;
            }

        }, 2000);
    }

    // Ajouter des styles CSS pour les erreurs
    const errorStyles = document.createElement('style');
    errorStyles.textContent = `
        input.error, select.error, textarea.error {
            border-color: var(--primary);
            background-color: rgba(230, 57, 70, 0.05);
        }
        
        .error-message {
            color: var(--primary);
            font-size: 0.8rem;
            margin-top: 5px;
        }
        
        .newsletter-confirmation {
            background-color: var(--success);
            color: white;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
            text-align: center;
            opacity: 1;
            transition: opacity 0.5s;
        }
        
        .newsletter-confirmation i {
            margin-right: 5px;
        }
    `;
    document.head.appendChild(errorStyles);
});