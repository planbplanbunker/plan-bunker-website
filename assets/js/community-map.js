/**
 * Nos-Bunkers.fr - Script pour la carte des communautés
 * Ce fichier gère la carte interactive qui affiche les communautés à travers la France
 * Utilise l'API Google Maps pour le rendu de la carte
 */

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'élément de carte existe
    const mapElement = document.getElementById('community-map');

    if (!mapElement) return;

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

    // Données des communautés (à remplacer par vos données réelles)
    const communityData = [
        {
            type: 'active',          // Communauté active (>150 membres)
            position: {lat: 48.8566, lng: 2.3522},
            name: "Paris & Île-de-France",
            members: 315,
            status: "Construction en cours (75%)",
            location: "20km à l'est de Paris",
            capacity: 500,
            meeting: "15 mars 2025"
        },
        {
            type: 'active',          // Communauté active (>150 membres)
            position: {lat: 43.2965, lng: 5.3698},
            name: "Marseille & environs",
            members: 278,
            status: "Construction en cours (90%)",
            location: "15km au nord de Marseille",
            capacity: 300,
            meeting: "12 mars 2025"
        },
        {
            type: 'forming',         // Groupe en formation (50-150 membres)
            position: {lat: 45.764043, lng: 4.835659},
            name: "Lyon Métropole",
            members: 124,
            status: "Développement (30%)",
            location: "En recherche",
            capacity: 400,
            meeting: "14 mars 2025"
        },
        {
            type: 'forming',         // Groupe en formation (50-150 membres)
            position: {lat: 44.837789, lng: -0.579180},
            name: "Bordeaux & Gironde",
            members: 108,
            status: "Développement (20%)",
            location: "En recherche",
            capacity: 250,
            meeting: "18 mars 2025"
        },
        {
            type: 'emerging',        // Intérêt émergent (<50 membres)
            position: {lat: 47.218371, lng: -1.553621},
            name: "Nantes Atlantique",
            members: 76,
            status: "En formation",
            location: "À déterminer",
            capacity: 300,
            meeting: "20 mars 2025"
        },
        {
            type: 'emerging',        // Intérêt émergent (<50 membres)
            position: {lat: 43.604652, lng: 1.444209},
            name: "Toulouse Occitanie",
            members: 82,
            status: "En formation",
            location: "À déterminer",
            capacity: 350,
            meeting: "16 mars 2025"
        },
        {
            type: 'emerging',        // Intérêt émergent (<50 membres)
            position: {lat: 48.5734, lng: 7.7521},
            name: "Strasbourg Alsace",
            members: 45,
            status: "En formation",
            location: "À déterminer",
            capacity: 200,
            meeting: "22 mars 2025"
        },
        {
            type: 'emerging',        // Intérêt émergent (<50 membres)
            position: {lat: 43.7102, lng: 7.2620},
            name: "Nice Côte d'Azur",
            members: 38,
            status: "En formation",
            location: "À déterminer",
            capacity: 150,
            meeting: "25 mars 2025"
        }
    ];

    // Créer des marqueurs personnalisés par type
    const createMarker = (data) => {
        let markerColor;

        switch(data.type) {
            case 'active':
                markerColor = '#4CAF50'; // Vert
                break;
            case 'forming':
                markerColor = '#FF9800'; // Orange
                break;
            case 'emerging':
                markerColor = '#2196F3'; // Bleu
                break;
            default:
                markerColor = '#CCCCCC';
        }

        // Créer une icône personnalisée avec un nombre à l'intérieur
        const markerLabel = {
            text: data.members.toString(),
            color: "#FFFFFF",
            fontSize: "10px",
            fontWeight: "bold"
        };

        // Créer le marqueur avec l'icône personnalisée
        const marker = new google.maps.Marker({
            position: data.position,
            map: map,
            label: markerLabel,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: markerColor,
                fillOpacity: 0.9,
                strokeWeight: 2,
                strokeColor: '#FFFFFF',
                scale: 15
            },
            title: data.name
        });

        // Préparer le contenu de l'infoWindow
        const popupContent = `
            <div class="popup-content">
                <h3>${data.name}</h3>
                <p><strong>Membres :</strong> ${data.members}</p>
                <p><strong>Statut :</strong> ${data.status}</p>
                <p><strong>Localisation :</strong> ${data.location}</p>
                <p><strong>Capacité :</strong> ${data.capacity} personnes</p>
                <p><strong>Prochaine réunion :</strong> ${data.meeting}</p>
                <button class="btn-map">Rejoindre cette communauté</button>
            </div>
        `;

        // Créer une infoWindow
        const infoWindow = new google.maps.InfoWindow({
            content: popupContent,
            maxWidth: 300
        });

        // Ajouter un événement de clic pour afficher l'infoWindow
        marker.addListener('click', () => {
            infoWindow.open(map, marker);

            // Ajouter un gestionnaire d'événements pour le bouton du popup
            google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
                const btnMap = document.querySelector('.btn-map');
                if (btnMap) {
                    btnMap.addEventListener('click', function() {
                        // Faire défiler jusqu'au formulaire d'inscription
                        const joinSection = document.getElementById('join-community');
                        if (joinSection) {
                            joinSection.scrollIntoView({ behavior: 'smooth' });

                            // Pré-remplir le formulaire si nécessaire
                            const interestsSelect = document.getElementById('interests');
                            if (interestsSelect) {
                                interestsSelect.value = 'join_existing';

                                // Remplir le champ de message avec la communauté sélectionnée
                                const messageField = document.getElementById('message');
                                if (messageField) {
                                    messageField.value = `Je souhaite rejoindre la communauté "${data.name}" que j'ai vue sur la carte.`;
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
    const markers = communityData.map(data => createMarker(data));

    // Ajouter des styles CSS personnalisés pour les popups
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
            text-align: left;
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
        .create-community-button {
            position: absolute;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            background-color: var(--primary, #e63946);
            color: white;
            padding: 10px 15px;
            border-radius: 25px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            font-size: 14px;
        }
        .create-community-button:hover {
            background-color: #d12836;
            transform: scale(1.05);
        }
        .create-community-button i {
            margin-right: 5px;
        }
    `;
    document.head.appendChild(style);

    // Gestion de la liste des communautés
    const showCommunitiesBtn = document.getElementById('show-communities');
    const communityList = document.getElementById('community-list');

    if (showCommunitiesBtn && communityList) {
        showCommunitiesBtn.addEventListener('click', function() {
            if (communityList.classList.contains('active')) {
                communityList.classList.remove('active');
                this.textContent = 'Voir la liste des communautés';
            } else {
                communityList.classList.add('active');
                this.textContent = 'Masquer la liste des communautés';
            }
        });
    }

    // Ajouter une recherche par ville pour la carte
    const searchContainer = document.createElement('div');
    searchContainer.className = 'map-search';
    searchContainer.innerHTML = `
        <input type="text" placeholder="Rechercher une ville...">
        <button><i class="fas fa-search"></i></button>
    `;

    // Ajouter la recherche au conteneur de la carte
    const mapContainer = document.querySelector('.map-container');
    mapContainer.appendChild(searchContainer);

    // Logique de recherche avec le service Geocoding de Google Maps
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

                // Créer une infoWindow pour le résultat de recherche
                const searchInfoWindow = new google.maps.InfoWindow({
                    content: `
                        <div class="popup-content">
                            <h3>${results[0].formatted_address}</h3>
                            <p>Vous cherchez une communauté à proximité de ${query}?</p>
                            <button class="btn-map" id="create-community-btn">Créer une communauté ici</button>
                        </div>
                    `
                });

                searchInfoWindow.open(map, searchMarker);

                // Ajouter un gestionnaire d'événements pour le bouton
                google.maps.event.addListenerOnce(searchInfoWindow, 'domready', () => {
                    const createBtn = document.getElementById('create-community-btn');
                    if (createBtn) {
                        createBtn.addEventListener('click', function() {
                            const joinSection = document.getElementById('join-community');
                            if (joinSection) {
                                joinSection.scrollIntoView({ behavior: 'smooth' });

                                // Pré-remplir le formulaire
                                const interestsSelect = document.getElementById('interests');
                                const locationField = document.getElementById('location');
                                const messageField = document.getElementById('message');

                                if (interestsSelect) interestsSelect.value = 'create_new';
                                if (locationField) locationField.value = results[0].formatted_address;
                                if (messageField) messageField.value = `Je souhaite créer une communauté dans la région de ${query}.`;
                            }
                        });
                    }
                });

                // Supprimer le marqueur après 10 secondes
                setTimeout(() => {
                    searchMarker.setMap(null);
                }, 10000);
            } else {
                alert("Aucun résultat trouvé pour cette recherche. Essayez une autre ville.");
            }
        });
    }

    // Ajouter un bouton pour créer une communauté
    const createButton = document.createElement('div');
    createButton.className = 'create-community-button';
    createButton.innerHTML = '<i class="fas fa-plus"></i> Créer une communauté';

    // Ajouter le bouton au conteneur de la carte
    mapContainer.appendChild(createButton);

    // Événement de clic sur le bouton
    createButton.addEventListener('click', function() {
        const joinSection = document.getElementById('join-community');
        if (joinSection) {
            joinSection.scrollIntoView({ behavior: 'smooth' });

            // Pré-remplir le formulaire
            const interestsSelect = document.getElementById('interests');
            if (interestsSelect) {
                interestsSelect.value = 'create_new';

                // Déclencher l'événement change si nécessaire
                const event = new Event('change');
                interestsSelect.dispatchEvent(event);
            }
        }
    });
});