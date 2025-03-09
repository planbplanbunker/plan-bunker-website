/**
 * Nos-Bunkers.fr - Script pour la carte interactive
 * Ce fichier gère la carte interactive qui affiche les emplacements des bunkers
 * Utilise l'API Google Maps pour le rendu de la carte
 */

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'élément de carte existe
    const mapElement = document.getElementById('interactive-map');

    if (!mapElement) return;

    // Données des bunkers (à remplacer par vos données réelles)
    const bunkerData = [
        {
            type: 'construction',    // Bunker en construction
            position: {lat: 48.8566, lng: 2.3522},
            name: "Bunker Paris",
            capacity: 500,
            progress: 75
        },
        {
            type: 'construction',    // Bunker en construction
            position: {lat: 43.2965, lng: 5.3698},
            name: "Bunker Marseille",
            capacity: 300,
            progress: 90
        },
        {
            type: 'development',     // Projet en développement
            position: {lat: 45.764043, lng: 4.835659},
            name: "Bunker Lyon",
            capacity: 400,
            progress: 30
        },
        {
            type: 'development',     // Projet en développement
            position: {lat: 44.837789, lng: -0.579180},
            name: "Bunker Bordeaux",
            capacity: 250,
            progress: 20
        },
        {
            type: 'interest',        // Zone d'intérêt
            position: {lat: 47.218371, lng: -1.553621},
            name: "Zone Nantes",
            interest: 120
        },
        {
            type: 'interest',        // Zone d'intérêt
            position: {lat: 43.604652, lng: 1.444209},
            name: "Zone Toulouse",
            interest: 140
        },
        {
            type: 'interest',        // Zone d'intérêt
            position: {lat: 47.478419, lng: -0.563166},
            name: "Zone Angers",
            interest: 90
        }
    ];

    // Initialiser la carte Google Maps centrée sur la France
    const map = new google.maps.Map(mapElement, {
        center: {lat: 46.603354, lng: 1.888334},
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [{"visibility": "on"}]
            },
            {
                "featureType": "poi",
                "stylers": [{"visibility": "simplified"}]
            }
        ]
    });

    // Variable pour stocker les informations du bunker le plus proche
    let nearestBunkers = [];
    let nearestBunkersContainer = null;

    // Fonction pour créer un marqueur selon le type de bunker
    const createMarker = (data) => {
        let markerColor;
        let markerIcon;

        switch(data.type) {
            case 'construction':
                markerColor = '#4CAF50'; // Vert
                break;
            case 'development':
                markerColor = '#FF9800'; // Orange
                break;
            case 'interest':
                markerColor = '#2196F3'; // Bleu
                break;
            default:
                markerColor = '#CCCCCC';
        }

        // Créer une icône SVG personnalisée
        const svgMarker = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: markerColor,
            fillOpacity: 0.9,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            scale: 10
        };

        // Créer le marqueur
        const marker = new google.maps.Marker({
            position: data.position,
            map: map,
            icon: svgMarker,
            title: data.name
        });

        // Contenu du popup selon le type
        let popupContent = '';

        if (data.type === 'construction') {
            popupContent = `
                <div class="popup-content">
                    <h3>${data.name}</h3>
                    <p>Capacité: ${data.capacity} personnes</p>
                    <p>État: En construction</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${data.progress}%"></div>
                    </div>
                    <p>${data.progress}% terminé</p>
                    <button class="btn-map">En savoir plus</button>
                </div>
            `;
        } else if (data.type === 'development') {
            popupContent = `
                <div class="popup-content">
                    <h3>${data.name}</h3>
                    <p>Capacité prévue: ${data.capacity} personnes</p>
                    <p>État: En développement</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${data.progress}%"></div>
                    </div>
                    <p>${data.progress}% du projet</p>
                    <button class="btn-map">Contribuer au projet</button>
                </div>
            `;
        } else if (data.type === 'interest') {
            popupContent = `
                <div class="popup-content">
                    <h3>${data.name}</h3>
                    <p>Intérêt actuel: ${data.interest} personnes</p>
                    <p>Encore ${150 - data.interest} inscriptions nécessaires pour lancer le projet</p>
                    <button class="btn-map">Manifester mon intérêt</button>
                </div>
            `;
        }

        // Créer une infowindow Google Maps
        const infowindow = new google.maps.InfoWindow({
            content: popupContent,
            maxWidth: 300
        });

        // Ajouter l'événement de clic pour afficher l'infoWindow
        marker.addListener('click', () => {
            infowindow.open(map, marker);

            // Ajouter un gestionnaire d'événements pour le bouton du popup
            // On doit le faire après l'ouverture de l'infoWindow car le contenu n'est pas dans le DOM avant
            google.maps.event.addListenerOnce(infowindow, 'domready', () => {
                const btnMap = document.querySelector('.btn-map');
                if (btnMap) {
                    btnMap.addEventListener('click', function() {
                        // Faire défiler jusqu'au formulaire d'inscription
                        const joinSection = document.getElementById('join-now');
                        if (joinSection) {
                            joinSection.scrollIntoView({ behavior: 'smooth' });

                            // Pré-remplir le formulaire si nécessaire
                            const interestsSelect = document.getElementById('interests');
                            if (interestsSelect) {
                                if (data.type === 'development') {
                                    interestsSelect.value = 'contribute';

                                    // Déclencher l'événement change pour afficher le champ de compétences
                                    const event = new Event('change');
                                    interestsSelect.dispatchEvent(event);
                                } else {
                                    interestsSelect.value = 'subscribe';
                                }
                            }
                        }
                    });
                }
            });
        });

        return marker;
    };

    // Ajouter tous les marqueurs à la carte
    const markers = bunkerData.map(data => createMarker(data));

    // Styles CSS pour les popups et autres éléments
    const style = document.createElement('style');
    style.textContent = `
        .popup-content {
            padding: 10px;
            text-align: center;
            font-family: var(--font-main, sans-serif);
        }
        .popup-content h3 {
            color: var(--secondary, #1d3557);
            margin-bottom: 5px;
            font-size: 16px;
        }
        .popup-content p {
            margin: 5px 0;
            font-size: 14px;
        }
        .progress-bar {
            height: 10px;
            background-color: #f0f0f0;
            border-radius: 5px;
            margin: 10px 0;
            overflow: hidden;
        }
        .progress {
            height: 100%;
            background-color: var(--primary, #e63946);
        }
        .btn-map {
            background-color: var(--primary, #e63946);
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
            font-size: 14px;
            transition: background-color 0.3s;
        }
        .btn-map:hover {
            background-color: #d12836;
        }
        .nearest-bunkers {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-width: 300px;
        }
        .nearest-bunkers h3 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 16px;
            color: var(--secondary, #1d3557);
        }
        .nearest-bunkers ul {
            list-style: none;
            padding: 0;
            margin: 0 0 15px 0;
        }
        .nearest-bunkers li {
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        .nearest-bunkers li:last-child {
            border-bottom: none;
        }
        .bunker-status {
            font-size: 12px;
            color: var(--gray, #8d99ae);
            margin-top: 3px;
        }
        .nearest-bunkers p {
            font-size: 14px;
            margin-bottom: 10px;
        }
        .location-button {
            position: absolute;
            bottom: 20px;
            left: 20px;
            z-index: 1000;
            background-color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        .location-button:hover {
            background-color: #f0f0f0;
            transform: scale(1.1);
        }
        .location-button i {
            color: var(--primary, #e63946);
            font-size: 18px;
        }
        .map-search {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            display: flex;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            overflow: hidden;
            width: 80%;
            max-width: 400px;
        }
        .map-search input {
            flex: 1;
            padding: 10px 15px;
            border: none;
            outline: none;
            font-size: 14px;
        }
        .map-search button {
            background-color: var(--primary, #e63946);
            border: none;
            color: white;
            padding: 0 15px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .map-search button:hover {
            background-color: #d12836;
        }
    `;
    document.head.appendChild(style);

    // Géolocalisation de l'utilisateur
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const userPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Créer un marqueur pour la position de l'utilisateur
                const userMarker = new google.maps.Marker({
                    position: userPosition,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#e63946',
                        fillOpacity: 0.9,
                        strokeWeight: 2,
                        strokeColor: '#FFFFFF',
                        scale: 10
                    },
                    title: 'Votre position'
                });

                // Créer une infowindow pour la position de l'utilisateur
                const userInfoWindow = new google.maps.InfoWindow({
                    content: '<div class="popup-content"><h3>Votre position</h3><p>C\'est ici que vous vous trouvez actuellement.</p></div>'
                });

                // Ajouter un événement de clic pour afficher l'infoWindow
                userMarker.addListener('click', () => {
                    userInfoWindow.open(map, userMarker);
                });

                // Centrer la carte sur la position de l'utilisateur
                map.setCenter(userPosition);
                map.setZoom(8);

                // Chercher les bunkers les plus proches
                findNearestBunkers(userPosition);
            }, function(error) {
                console.log('Erreur de géolocalisation:', error);
            });
        }
    }

    // Trouver les bunkers les plus proches de l'utilisateur
    function findNearestBunkers(userPosition) {
        // Calculer la distance pour chaque bunker
        const bunkersWithDistance = bunkerData.map(bunker => {
            const bunkerLatLng = new google.maps.LatLng(bunker.position.lat, bunker.position.lng);
            const userLatLng = new google.maps.LatLng(userPosition.lat, userPosition.lng);

            // Calculer la distance en mètres
            const distance = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, bunkerLatLng);

            // Convertir en km et arrondir à 1 décimale
            const distanceInKm = (distance / 1000).toFixed(1);

            return { ...bunker, distance: distanceInKm };
        });

        // Trier par distance
        nearestBunkers = bunkersWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 3);

        // Afficher les informations des bunkers les plus proches
        displayNearestBunkers(nearestBunkers);
    }

    // Afficher les informations des bunkers les plus proches
    function displayNearestBunkers(nearestBunkers) {
        // Supprimer l'ancien conteneur s'il existe
        if (nearestBunkersContainer) {
            nearestBunkersContainer.remove();
        }

        // Créer un élément pour afficher les bunkers les plus proches
        nearestBunkersContainer = document.createElement('div');
        nearestBunkersContainer.className = 'nearest-bunkers';

        // Titre
        const title = document.createElement('h3');
        title.textContent = 'Bunkers les plus proches de vous';
        nearestBunkersContainer.appendChild(title);

        // Liste des bunkers
        const bunkersList = document.createElement('ul');

        nearestBunkers.forEach(bunker => {
            const item = document.createElement('li');
            let statusText = '';

            switch(bunker.type) {
                case 'construction':
                    statusText = `En construction (${bunker.progress}%)`;
                    break;
                case 'development':
                    statusText = `En développement (${bunker.progress}%)`;
                    break;
                case 'interest':
                    statusText = `Zone d'intérêt (${bunker.interest}/150 inscrits)`;
                    break;
            }

            item.innerHTML = `
                <strong>${bunker.name}</strong> - <span>${bunker.distance} km</span>
                <div class="bunker-status">${statusText}</div>
            `;
            bunkersList.appendChild(item);
        });

        nearestBunkersContainer.appendChild(bunkersList);

        // Ajouter une note
        const note = document.createElement('p');
        note.textContent = 'Rejoignez le projet pour garantir votre place dans ces bunkers.';
        nearestBunkersContainer.appendChild(note);

        // Ajouter un bouton de réservation
        const reserveButton = document.createElement('button');
        reserveButton.className = 'btn btn-primary';
        reserveButton.textContent = 'Réserver ma place';
        reserveButton.addEventListener('click', function() {
            const joinSection = document.getElementById('join-now');
            if (joinSection) {
                joinSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        nearestBunkersContainer.appendChild(reserveButton);

        // Ajouter au conteneur de la carte
        const mapContainer = document.querySelector('.map-container');
        mapContainer.appendChild(nearestBunkersContainer);
    }

    // Bouton pour demander la géolocalisation
    const locationButton = document.createElement('button');
    locationButton.className = 'location-button';
    locationButton.innerHTML = '<i class="fas fa-location-arrow"></i>';
    locationButton.title = 'Trouver les bunkers près de chez moi';

    // Ajouter le bouton au conteneur de la carte
    const mapContainer = document.querySelector('.map-container');
    mapContainer.appendChild(locationButton);

    // Événement de clic sur le bouton de géolocalisation
    locationButton.addEventListener('click', getUserLocation);

    // Ajouter une recherche par code postal ou ville
    const searchContainer = document.createElement('div');
    searchContainer.className = 'map-search';
    searchContainer.innerHTML = `
        <input type="text" placeholder="Rechercher par ville ou code postal...">
        <button><i class="fas fa-search"></i></button>
    `;

    // Ajouter la recherche au conteneur de la carte
    mapContainer.appendChild(searchContainer);

    // Logique de recherche avec l'API Geocoding de Google
    const searchInput = searchContainer.querySelector('input');
    const searchButton = searchContainer.querySelector('button');

    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });

    function performSearch(query) {
        if (!query.trim()) return;

        // Utiliser le service de géocodage de Google Maps
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address: query + ', France' }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK && results[0]) {
                const position = results[0].geometry.location;

                // Centrer la carte sur le résultat
                map.setCenter(position);
                map.setZoom(12);

                // Ajouter un marqueur temporaire
                const searchMarker = new google.maps.Marker({
                    position: position,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#673AB7',
                        fillOpacity: 0.9,
                        strokeWeight: 2,
                        strokeColor: '#FFFFFF',
                        scale: 10
                    },
                    title: 'Résultat de recherche'
                });

                // Créer une infowindow pour le résultat de recherche
                const searchInfoWindow = new google.maps.InfoWindow({
                    content: `
                        <div class="popup-content">
                            <h3>${results[0].formatted_address}</h3>
                            <p>Rechercher des bunkers dans cette zone</p>
                            <button class="btn-map" id="create-bunker-btn">Créer un bunker ici</button>
                        </div>
                    `
                });

                searchInfoWindow.open(map, searchMarker);

                // Ajouter un gestionnaire d'événements pour le bouton
                google.maps.event.addListenerOnce(searchInfoWindow, 'domready', () => {
                    const createBunkerBtn = document.getElementById('create-bunker-btn');
                    if (createBunkerBtn) {
                        createBunkerBtn.addEventListener('click', function() {
                            const joinSection = document.getElementById('join-now');
                            if (joinSection) {
                                joinSection.scrollIntoView({ behavior: 'smooth' });

                                // Pré-remplir le formulaire
                                const locationField = document.getElementById('location');
                                if (locationField) {
                                    locationField.value = results[0].formatted_address;
                                }

                                const interestsSelect = document.getElementById('interests');
                                if (interestsSelect) {
                                    interestsSelect.value = 'terrain';
                                }
                            }
                        });
                    }
                });

                // Supprimer le marqueur après 10 secondes
                setTimeout(() => {
                    searchMarker.setMap(null);
                }, 10000);
            } else {
                alert("Aucun résultat trouvé pour cette recherche. Essayez une autre ville ou un autre code postal.");
            }
        });
    }
});