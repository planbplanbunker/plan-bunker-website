/**
 * Nos-Bunkers.fr - Script pour la gestion des abonnements
 * Ce fichier gère les fonctionnalités spécifiques à la page d'abonnement
 */

document.addEventListener('DOMContentLoaded', function() {
    // Éléments du formulaire d'abonnement
    const subscriptionForm = document.getElementById('subscription-form');
    const formSteps = document.querySelectorAll('.form-steps .step');
    const formPanels = document.querySelectorAll('.form-panel');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');

    // Options d'abonnement
    const planOptions = document.querySelectorAll('input[name="plan"]');
    const freqOptions = document.querySelectorAll('input[name="frequency"]');
    const addonCheckboxes = document.querySelectorAll('input[type="checkbox"][name="addon[]"]');

    // Champs additionnels
    const extraPlacesQty = document.getElementById('extra-places-qty');
    const storageQty = document.getElementById('storage-qty');
    const equipmentQty = document.getElementById('equipment-qty');

    // Méthodes de paiement
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const cardPaymentFields = document.getElementById('card-payment-fields');
    const sepaPaymentFields = document.getElementById('sepa-payment-fields');

    // Résumé des prix
    const totalPrice = document.getElementById('total-price');
    const summaryRows = document.querySelector('.price-summary');

    // Initialisation du formulaire par étapes
    if (subscriptionForm) {
        initFormSteps();
        initPriceCalculator();
        initPaymentMethods();
        initAddonFields();
    }

    /**
     * Initialisation de la navigation par étapes du formulaire
     */
    function initFormSteps() {
        // Gestion des boutons suivant/précédent
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const currentPanel = this.closest('.form-panel');
                const nextPanelId = this.getAttribute('data-next');
                const nextPanel = document.getElementById('panel-' + nextPanelId);

                // Valider l'étape actuelle avant de passer à la suivante
                if (validateStep(currentPanel)) {
                    // Masquer le panneau actuel
                    currentPanel.classList.remove('active');

                    // Afficher le panneau suivant
                    nextPanel.classList.add('active');

                    // Mettre à jour les indicateurs d'étape
                    updateSteps(nextPanelId);

                    // Faire défiler vers le haut du formulaire
                    scrollToForm();
                }
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const currentPanel = this.closest('.form-panel');
                const prevPanelId = this.getAttribute('data-prev');
                const prevPanel = document.getElementById('panel-' + prevPanelId);

                // Masquer le panneau actuel
                currentPanel.classList.remove('active');

                // Afficher le panneau précédent
                prevPanel.classList.add('active');

                // Mettre à jour les indicateurs d'étape
                updateSteps(prevPanelId);

                // Faire défiler vers le haut du formulaire
                scrollToForm();
            });
        });

        // Validation du formulaire final
        subscriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Valider l'étape finale
            if (validateStep(document.getElementById('panel-3'))) {
                simulateSubmission();
            }
        });
    }

    /**
     * Mise à jour des indicateurs d'étape
     */
    function updateSteps(activeStepId) {
        formSteps.forEach(step => {
            const stepId = step.getAttribute('data-step');
            if (stepId === activeStepId) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    /**
     * Initialisation du calculateur de prix
     */
    function initPriceCalculator() {
        // Mise à jour du prix lors du changement de plan
        planOptions.forEach(option => {
            option.addEventListener('change', updateTotalPrice);
        });

        // Mise à jour du prix lors du changement de fréquence
        freqOptions.forEach(option => {
            option.addEventListener('change', updateTotalPrice);
        });

        // Mise à jour du prix lors du changement d'options complémentaires
        addonCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const relatedField = this.parentNode.querySelector('select, input[type="number"]');
                if (relatedField) {
                    relatedField.disabled = !this.checked;
                    if (this.checked) {
                        relatedField.focus();
                    }
                }
                updateTotalPrice();
            });
        });

        // Mise à jour du prix lors du changement de quantité
        [extraPlacesQty, storageQty, equipmentQty].forEach(field => {
            if (field) {
                field.addEventListener('change', updateTotalPrice);
            }
        });

        // Calculer le prix initial
        updateTotalPrice();
    }

    /**
     * Calcul et mise à jour du prix total
     */
    function updateTotalPrice() {
        let basePrice = 0;
        let addonsPrice = 0;
        let discount = 1; // Pas de réduction par défaut
        let planName = '';

        // Prix de base selon le plan
        const selectedPlan = document.querySelector('input[name="plan"]:checked');
        if (selectedPlan) {
            switch (selectedPlan.value) {
                case 'standard':
                    basePrice = 350;
                    planName = 'Formule Standard';
                    break;
                case 'family':
                    basePrice = 950;
                    planName = 'Formule Famille';
                    break;
                case 'premium':
                    basePrice = 1500;
                    planName = 'Formule Premium';
                    break;
            }
        }

        // Appliquer la réduction si paiement annuel
        const selectedFreq = document.querySelector('input[name="frequency"]:checked');
        if (selectedFreq && selectedFreq.value === 'annual') {
            discount = 0.9; // Réduction de 10%
        }

        // Calculer le prix des options complémentaires
        if (document.getElementById('addon-places') && document.getElementById('addon-places').checked) {
            const qty = parseInt(extraPlacesQty.value) || 1;
            addonsPrice += 150 * qty;
        }

        if (document.getElementById('addon-storage') && document.getElementById('addon-storage').checked) {
            const kg = parseInt(storageQty.value) || 10;
            addonsPrice += 5 * kg;
        }

        if (document.getElementById('addon-equipment') && document.getElementById('addon-equipment').checked) {
            const qty = parseInt(equipmentQty.value) || 1;
            addonsPrice += 75 * qty;
        }

        // Calculer le prix total
        const total = (basePrice + addonsPrice) * discount;

        // Mettre à jour l'affichage du prix
        if (totalPrice) {
            const frequencyLabel = selectedFreq && selectedFreq.value === 'annual' ? '/an' : '/mois';
            totalPrice.textContent = `${total.toFixed(0)}€${frequencyLabel}`;
        }

        // Mettre à jour le résumé
        updatePriceSummary(planName, basePrice, addonsPrice, discount, selectedFreq && selectedFreq.value === 'annual');
    }

    /**
     * Mise à jour du résumé des prix
     */
    function updatePriceSummary(planName, basePrice, addonsPrice, discount, isAnnual) {
        if (!summaryRows) return;

        // Vider le résumé existant sauf la ligne de total
        const rowsToRemove = summaryRows.querySelectorAll('.summary-row:not(:last-child)');
        rowsToRemove.forEach(row => row.remove());

        // Ajouter la ligne du plan de base
        const planRow = document.createElement('div');
        planRow.className = 'summary-row';
        planRow.innerHTML = `<span>${planName}</span><span>${basePrice}€/mois</span>`;
        summaryRows.insertBefore(planRow, summaryRows.lastElementChild);

        // Ajouter des lignes pour les options si elles sont sélectionnées
        if (document.getElementById('addon-places') && document.getElementById('addon-places').checked) {
            const qty = parseInt(extraPlacesQty.value) || 1;
            const price = 150 * qty;
            const addonRow = document.createElement('div');
            addonRow.className = 'summary-row';
            addonRow.innerHTML = `<span>Places supplémentaires (${qty})</span><span>+${price}€/mois</span>`;
            summaryRows.insertBefore(addonRow, summaryRows.lastElementChild);
        }

        if (document.getElementById('addon-storage') && document.getElementById('addon-storage').checked) {
            const kg = parseInt(storageQty.value) || 10;
            const price = 5 * kg;
            const addonRow = document.createElement('div');
            addonRow.className = 'summary-row';
            addonRow.innerHTML = `<span>Stockage supplémentaire (${kg}kg)</span><span>+${price}€/mois</span>`;
            summaryRows.insertBefore(addonRow, summaryRows.lastElementChild);
        }

        if (document.getElementById('addon-equipment') && document.getElementById('addon-equipment').checked) {
            const qty = parseInt(equipmentQty.value) || 1;
            const price = 75 * qty;
            const addonRow = document.createElement('div');
            addonRow.className = 'summary-row';
            addonRow.innerHTML = `<span>Pack équipement (${qty})</span><span>+${price}€/mois</span>`;
            summaryRows.insertBefore(addonRow, summaryRows.lastElementChild);
        }

        // Ajouter une ligne de réduction si paiement annuel
        if (isAnnual) {
            const discountRow = document.createElement('div');
            discountRow.className = 'summary-row discount';
            discountRow.innerHTML = `<span>Réduction paiement annuel</span><span>-10%</span>`;
            summaryRows.insertBefore(discountRow, summaryRows.lastElementChild);
        }

        // Mettre à jour le total
        const total = ((basePrice + addonsPrice) * discount).toFixed(0);
        const frequency = isAnnual ? '/an' : '/mois';
        const totalElement = summaryRows.querySelector('.summary-total span:last-child');
        if (totalElement) {
            totalElement.textContent = `${total}€${frequency}`;
        }
    }

    /**
     * Initialisation des méthodes de paiement
     */
    function initPaymentMethods() {
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                if (this.value === 'card') {
                    cardPaymentFields.style.display = 'block';
                    sepaPaymentFields.style.display = 'none';
                } else if (this.value === 'sepa') {
                    cardPaymentFields.style.display = 'none';
                    sepaPaymentFields.style.display = 'block';
                }
            });
        });
    }

    /**
     * Initialisation des champs d'options complémentaires
     */
    function initAddonFields() {
        // Désactiver les champs liés aux options non sélectionnées
        addonCheckboxes.forEach(checkbox => {
            const relatedField = checkbox.parentNode.querySelector('select, input[type="number"]');
            if (relatedField) {
                relatedField.disabled = !checkbox.checked;
            }
        });
    }

    /**
     * Validation d'une étape du formulaire
     * @param {Element} panel - Le panneau à valider
     * @returns {boolean} - true si valide, false sinon
     */
    function validateStep(panel) {
        let isValid = true;

        // Récupérer tous les champs requis du panneau actuel
        const requiredFields = panel.querySelectorAll('input[required], select[required], textarea[required]');

        requiredFields.forEach(field => {
            // Ne valider que les champs visibles
            if (field.offsetParent !== null && !field.disabled) {
                if (!field.value.trim()) {
                    isValid = false;
                    highlightError(field);
                } else {
                    removeError(field);
                }
            }
        });

        // Validation spécifique selon l'étape
        const panelId = panel.id;

        if (panelId === 'panel-3') {
            // Validation des champs de carte bancaire
            if (document.querySelector('input[name="payment-method"]:checked').value === 'card') {
                const cardNumber = document.getElementById('card-number');
                if (cardNumber && !validateCardNumber(cardNumber.value)) {
                    isValid = false;
                    highlightError(cardNumber, 'Numéro de carte invalide');
                }

                const cardExpiry = document.getElementById('card-expiry');
                if (cardExpiry && !validateCardExpiry(cardExpiry.value)) {
                    isValid = false;
                    highlightError(cardExpiry, 'Date d\'expiration invalide');
                }

                const cardCVC = document.getElementById('card-cvc');
                if (cardCVC && !validateCardCVC(cardCVC.value)) {
                    isValid = false;
                    highlightError(cardCVC, 'Code de sécurité invalide');
                }
            } else {
                // Validation des champs SEPA
                const iban = document.getElementById('iban');
                if (iban && !validateIBAN(iban.value)) {
                    isValid = false;
                    highlightError(iban, 'IBAN invalide');
                }

                const bic = document.getElementById('bic');
                if (bic && !validateBIC(bic.value)) {
                    isValid = false;
                    highlightError(bic, 'BIC invalide');
                }
            }
        }

        return isValid;
    }

    /**
     * Mise en évidence d'un champ en erreur
     */
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

    /**
     * Suppression de l'indication d'erreur
     */
    function removeError(field) {
        field.classList.remove('error');

        // Supprimer le message d'erreur s'il existe
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    /**
     * Validation du numéro de carte bancaire (simple vérification de format)
     */
    function validateCardNumber(cardNumber) {
        const cleaned = cardNumber.replace(/\s+/g, '');
        return /^\d{16}$/.test(cleaned);
    }

    /**
     * Validation de la date d'expiration (format MM/AA)
     */
    function validateCardExpiry(expiry) {
        return /^\d{2}\/\d{2}$/.test(expiry);
    }

    /**
     * Validation du code CVC (3 ou 4 chiffres)
     */
    function validateCardCVC(cvc) {
        return /^\d{3,4}$/.test(cvc);
    }

    /**
     * Validation basique d'un IBAN
     */
    function validateIBAN(iban) {
        const cleaned = iban.replace(/\s+/g, '');
        return cleaned.length >= 15 && cleaned.length <= 34;
    }

    /**
     * Validation basique d'un BIC
     */
    function validateBIC(bic) {
        const cleaned = bic.replace(/\s+/g, '');
        return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleaned);
    }

    /**
     * Simulation de la soumission du formulaire
     */
    function simulateSubmission() {
        // Récupérer les données du formulaire
        const formData = new FormData(subscriptionForm);
        const formObject = {};

        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        console.log('Données du formulaire d\'abonnement:', formObject);

        // Simuler un envoi vers le serveur
        const submitButton = subscriptionForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement en cours...';

        // Simuler une requête réseau
        setTimeout(() => {
            // Réinitialiser le bouton
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;

            // Afficher le modal de confirmation
            const successModal = document.getElementById('success-modal');
            if (successModal) {
                successModal.classList.add('active');

                // Ajouter la gestion des boutons de fermeture
                const closeModalBtns = successModal.querySelectorAll('.close-modal, .close-modal-btn');
                closeModalBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        successModal.classList.remove('active');
                    });
                });
            }
        }, 2000);
    }

    /**
     * Faire défiler la page vers le formulaire
     */
    function scrollToForm() {
        const formRect = subscriptionForm.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const offsetTop = formRect.top + scrollTop - 120; // 120px pour la marge supérieure

        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    // Ajouter des formats de saisie pour les champs de paiement
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            this.value = formatCardNumber(this.value);
        });
    }

    const cardExpiryInput = document.getElementById('card-expiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function() {
            this.value = formatCardExpiry(this.value);
        });
    }

    const ibanInput = document.getElementById('iban');
    if (ibanInput) {
        ibanInput.addEventListener('input', function() {
            this.value = formatIBAN(this.value);
        });
    }

    /**
     * Format d'affichage du numéro de carte
     */
    function formatCardNumber(value) {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    }

    /**
     * Format d'affichage de la date d'expiration
     */
    function formatCardExpiry(value) {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

        if (v.length >= 2) {
            return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
        }

        return v;
    }

    /**
     * Format d'affichage de l'IBAN
     */
    function formatIBAN(value) {
        const v = value.replace(/\s+/g, '').toUpperCase();
        let result = '';

        for (let i = 0; i < v.length; i++) {
            if (i % 4 === 0 && i > 0) {
                result += ' ';
            }
            result += v[i];
        }

        return result;
    }
});