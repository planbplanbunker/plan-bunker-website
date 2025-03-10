/**
 * PlanBPlanBunker - Script pour la carte de contact
 * Ce fichier gère la carte Google Maps qui affiche l'emplacement du siège
 */

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'élément de carte existe
    const mapElement = document.getElementById('contact-map');

    if (!mapElement) return;

    // Coordonnées de PlanBPlanBunker (fictif - centre de Paris)
    const officeLocation = {lat: 48.8588, lng: 2.35};

    // Initialiser la carte Google Maps centrée sur Paris
    const map = new google.maps.Map(mapElement, {
        center: officeLocation,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: true,
        styles: [
            {
                "featureType": "poi",
                "stylers": [{"visibility": "simplified"}]
            }
        ]
    });

    // Créer un marqueur personnalisé
    const marker = new google.maps.Marker({
        position: officeLocation,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#e63946',
            fillOpacity: 0.9,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            scale: 15,
            labelOrigin: new google.maps.Point(0, 0)
        },
        title: 'PlanBPlanBunker'
    });

    // Ajouter une infoWindow pour afficher les informations du siège
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="office-popup">
                <h3>PlanBPlanBunker</h3>
                <p>1 rue de la Sécurité<br>75001 Paris</p>
                <p><strong>Tél:</strong> +33 (0)1 23 45 67 89</p>
                <p><strong>Email:</strong> contact@PlanBPlanBunker</p>
            </div>
        `,
        maxWidth: 250
    });

    // Ouvrir l'infoWindow par défaut
    infoWindow.open(map, marker);

    // Ajouter un événement de clic sur le marqueur pour ouvrir l'infoWindow
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    // Ajouter un cercle autour du marqueur pour le mettre en évidence
    const circle = new google.maps.Circle({
        strokeColor: '#e63946',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#e63946',
        fillOpacity: 0.1,
        map: map,
        center: officeLocation,
        radius: 200
    });

    // Ajouter des styles pour le popup
    const popupStyle = document.createElement('style');
    popupStyle.textContent = `
        .office-popup {
            padding: 10px;
            font-family: var(--font-main, sans-serif);
        }
        
        .office-popup h3 {
            margin: 0 0 5px 0;
            color: var(--secondary, #1d3557);
            font-size: 16px;
        }
        
        .office-popup p {
            margin: 5px 0;
            font-size: 14px;
        }
        
        .directions-button {
            position: absolute;
            bottom: 10px;
            left: 10px;
            z-index: 1000;
            background-color: var(--primary, #e63946);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .directions-button:hover {
            background-color: #d12836;
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(popupStyle);

    // Ajouter un bouton pour obtenir l'itinéraire
    const directionsButton = document.createElement('button');
    directionsButton.className = 'directions-button';
    directionsButton.innerHTML = '<i class="fas fa-directions"></i> Itinéraire';

    // Ajouter le bouton à la carte
    mapElement.appendChild(directionsButton);

    // Gestionnaire d'événements pour le bouton d'itinéraire
    directionsButton.addEventListener('click', function() {
        // Détecter l'appareil de l'utilisateur
        const userAgent = navigator.userAgent.toLowerCase();
        let mapsUrl;

        // Adapter l'URL selon l'appareil
        if (userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1) {
            // URL pour Apple Maps
            mapsUrl = `https://maps.apple.com/?q=PlanBPlanBunker&ll=${officeLocation.lat},${officeLocation.lng}&dirflg=d`;
        } else {
            // URL pour Google Maps (Android et autres)
            mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${officeLocation.lat},${officeLocation.lng}&destination_place_id=PlanBPlanBunker&travelmode=driving`;
        }

        // Ouvrir l'URL dans un nouvel onglet
        window.open(mapsUrl, '_blank');
    });

    // Désactiver le zoom par défaut pour éviter les problèmes de défilement sur mobile
    map.setOptions({ scrollwheel: false });

    // Activer l'interaction de la carte uniquement au survol pour éviter
    // les problèmes de défilement sur mobile
    mapElement.addEventListener('mouseenter', function() {
        map.setOptions({ scrollwheel: true });
    });

    mapElement.addEventListener('mouseleave', function() {
        map.setOptions({ scrollwheel: false });
    });

    // Fonction pour mettre à jour la carte lorsqu'un onglet ou une section est affiché
    function updateMapOnTabShow() {
        google.maps.event.trigger(map, 'resize');
        map.setCenter(officeLocation);
    }

    // Appliquer la fonction lors de changements d'onglets (si applicable)
    document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', updateMapOnTabShow);
    });
});