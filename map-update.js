/**
 * Nos-Bunkers.fr - Script amélioré pour la carte interactive
 * Ce fichier gère la carte interactive qui affiche les projets communautaires à travers la France
 */

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'élément de carte existe
    const mapElement = document.getElementById('community-map') || document.getElementById('interactive-map');

    if (!mapElement) return;

    // Initialiser la carte OpenStreetMap (gratuit, sans clé API nécessaire)
    const map = L.map(mapElement).setView([46.603354, 1.888334], 6);

    // Ajouter la couche de carte OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Données des projets communautaires
    const projectData = [
        {
            type: 'active',
            position: [48.8566, 2.3522],
            name: "Paris & Île-de-France",
            members: 315,
            status: "Construction en cours (75%)",
            location: "20km à l'est de Paris",
            capacity: 500,
            meeting: "15 mars 2025",
            contributions: "4.2 millions €",
            volunteers: 78
        },
        {
            type: 'active',
            position: [43.2965, 5.3698],
            name: "Marseille & environs",
            members: 278,
            status: "Construction en cours (90%)",
            location: "15km au nord de Marseille",
            capacity: 300,
            meeting: "12 mars 2025",
            contributions: "3.8 millions €",
            volunteers: 65
        },
        {
            type: 'forming',
            position: [45.764043, 4.835659],
            name: "Lyon Métropole",
            members: 124,
            status: "Développement (30%)",
            location: "En recherche",
            capacity: 400,
            meeting: "14 mars 2025",
            contributions: "1.9 millions €",
            volunteers: 42
        },
        {
            type: 'forming',
            position: [44.837789, -0.579180],
            name: "Bordeaux & Gironde",
            members: 108,
            status: "Développement (20%)",
            location: "En recherche",
            capacity: 250,
            meeting: "18 mars 2025",
            contributions: "1.5 millions €",
            volunteers: 36
        },
        {
            type: 'emerging',
            position: [47.218371, -1.553621],
            name: "Nantes Atlantique",
            members: 76,
            status: "En formation",
            location: "À déterminer",
            capacity: 300,
            meeting: "20 mars 2025",
            contributions: "0.8 million €",
            volunteers: 28
        },
        {
            type: 'emerging',
            position: [43.604652, 1.444209],
            name: "Toulouse Occitanie",
            members: 82,
            status: "En formation",
            location: "À déterminer",
            capacity: 350,
            meeting: "16 mars 2025",
            contributions: "0.95 million €",
            volunteers: 31
        },
        {
            type: 'emerging',
            position: [48.5734, 7.7521],
            name: "Strasbourg Alsace",
            members: 45,
            status: "En formation",
            location: "À déterminer",
            capacity: 200,
            meeting: "22 mars 2025",
            contributions: "0.6 million €",
            volunteers: 18
        },
        {
            type: 'emerging',
            position: [43.7102, 7.2620],
            name: "Nice Côte d'Azur",
            members: 38,
            status: "En formation",
            location: "À déterminer",
            capacity: 150,
            meeting: "25 mars 2025",
            contributions: "0.5 million €",
            volunteers: 15
        }
    ];

    // Icônes personnalisées selon le type de projet
    const createCustomIcon = (type) => {
        let color;
        let size;

        switch(type) {
            case 'active':
                color = '#4CAF50'; // Vert
                size = 15;
                break;
            case 'forming':
                color = '#FF9800'; // Orange
                size = 12;
                break;
            case 'emerging':
                color = '#2196F3'; // Bleu
                size = 10;
                break;
            default:
                color = '#CCCCCC';
                size = 8;
        }

        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [size, size],
            iconAnchor: [size/2, size/2]
        });
    };

    // Ajouter les marqueurs à la carte
    projectData.forEach(project => {
        const marker = L.marker(project.position, {
            icon: createCustomIcon(project.type)
        }).addTo(map);

        // Contenu du popup
        const popupContent = `
            <div class="popup-content">
                <h3>${project.name}</h3>
                <p><strong>Membres :</strong> ${project.members}</p>
                <p><strong>Contributions :</strong> ${project.contributions}</p>
                <p><strong>Bénévoles actifs :</strong> ${project.volunteers}</p>
                <p><strong>Statut :</strong> ${project.status}</p>
                <p><strong>Localisation :</strong> ${project.location}</p>
                <p><strong>Capacité prévue :</strong> ${project.capacity} personnes</p>
                <p><strong>Prochaine réunion :</strong> ${project.meeting}</p>
                <button class="btn-map" id="join-project-${project.name.replace(/\s+/g, '-').toLowerCase()}">Rejoindre ce projet</button>
            </div>
        `;

        // Créer le popup
        const popup = L.popup().setContent(popupContent);
        marker.bindPopup(popup);

        // Ajouter un événement au clic sur le marqueur
        marker.on('click', function() {
            // Ouvrir le popup
            marker.openPopup();

            // Attendre que le popup soit intégré au DOM
            setTimeout(() => {
                // Ajouter un gestionnaire de clic pour le bouton
                const joinButton = document.getElementById(`join-project-${project.name.replace(/\s+/g, '-').toLowerCase()}`);
                if (joinButton) {
                    joinButton.addEventListener('click', function() {
                        // Défiler jusqu'au formulaire d'inscription
                        const joinSection = document.getElementById('join-community') || document.getElementById('join-now');
                        if (joinSection) {
                            joinSection.scrollIntoView({ behavior: 'smooth' });

                            // Pré-remplir le formulaire
                            const locationField = document.getElementById('location');
                            const messageField = document.getElementById('message');
                            const interestsSelect = document.getElementById('interests');

                            if (locationField) {
                                locationField.value = project.name;
                            }

                            if (messageField) {
                                messageField.value = `Je souhaite rejoindre le projet "${project.name}" que j'ai vu sur la carte.`;
                            }

                            if (interestsSelect) {
                                // Si le projet est déjà actif ou en formation
                                if (project.type === 'active' || project.type === 'forming') {
                                    interestsSelect.value = 'join_existing';
                                } else {
                                    interestsSelect.value = 'create_new';
                                }
                            }
                        }
                    });
                }
            }, 100);
        });
    });

    // Ajouter une recherche de localisation à la carte
    const searchControl = L.control({ position: 'topleft' });

    searchControl.onAdd = function() {
        const container = L.DomUtil.create('div', 'map-search-control');
        container.innerHTML = `
            <div class="map-search">
                <input type="text" id="location-search" placeholder="Rechercher une ville...">
                <button id="search-button"><i class="fas fa-search"></i></button>
            </div>
        `;
        return container;
    };

    searchControl.addTo(map);

    // Gérer la recherche
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'search-button') {
            performSearch();
        }
    });

    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.id === 'location-search') {
            performSearch();
        }
    });

    function performSearch() {
        const searchInput = document.getElementById('location-search');
        const query = searchInput.value.trim();
        
        if (!query) return;

        // Utiliser l'API de géocodage Nominatim d'OpenStreetMap
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)},France`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const result = data[0];
                    const lat = parseFloat(result.lat);
                    const lon = parseFloat(result.lon);
                    
                    // Centrer la carte sur le résultat
                    map.setView([lat, lon], 12);

                    // Créer un marqueur temporaire
                    const searchMarker = L.marker([lat, lon], {
                        icon: L.divIcon({
                            className: 'custom-marker',
                            html: '<div style="background-color: #673AB7; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white;"></div>',
                            iconSize: [15, 15],
                            iconAnchor: [7.5, 7.5]
                        })
                    }).addTo(map);
                    
                    // Créer un popup pour le marqueur
                    const popupContent = `
                        <div class="popup-content">
                            <h3>${result.display_name}</h3>
                            <p>Aucun projet encore à cet endroit.</p>
                            <p>Voulez-vous initier un projet ici?</p>
                            <button class="btn-map" id="create-project-btn">Créer un projet ici</button>
                        </div>
                    `;
                    
                    const popup = L.popup().setContent(popupContent);
                    searchMarker.bindPopup(popup).openPopup();
                    
                    // Ajouter un gestionnaire de clic pour le bouton
                    setTimeout(() => {
                        const createProjectBtn = document.getElementById('create-project-btn');
                        if (createProjectBtn) {
                            createProjectBtn.addEventListener('click', function() {
                                const joinSection = document.getElementById('join-community') || document.getElementById('join-now');
                                if (joinSection) {
                                    joinSection.scrollIntoView({ behavior: 'smooth' });
                                    
                                    // Pré-remplir le formulaire
                                    const locationField = document.getElementById('location');
                                    const messageField = document.getElementById('message');
                                    const interestsSelect = document.getElementById('interests');
                                    
                                    if (locationField) {
                                        locationField.value = result.display_name;
                                    }
                                    
                                    if (messageField) {
                                        messageField.value = `Je souhaite initier un projet dans la région de ${query}.`;
                                    }
                                    
                                    if (interestsSelect) {
                                        interestsSelect.value = 'create_new';
                                        
                                        // Déclencher l'événement change
                                        const event = new Event('change');
                                        interestsSelect.dispatchEvent(event);
                                    }
                                }
                            });
                        }
                    }, 100);
                    
                    // Supprimer le marqueur après un certain temps
                    setTimeout(() => {
                        map.removeLayer(searchMarker);
                    }, 30000);
                } else {
                    alert("Aucun résultat trouvé pour cette recherche. Essayez une autre ville.");
                }
            })
            .catch(error => {
                console.error("Erreur lors de la recherche:", error);
                alert("Une erreur s'est produite lors de la recherche. Veuillez réessayer.");
            });
    }

    // Ajouter une légende à la carte
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'map-legend');
        div.innerHTML = `
            <div class="legend-item">
                <span class="marker marker-green"></span>
                <p>Projet actif (>150 membres)</p>
            </div>
            <div class="legend-item">
                <span class="marker marker-orange"></span>
                <p>Projet en formation (50-150 membres)</p>
            </div>
            <div class="legend-item">
                <span class="marker marker-blue"></span>
                <p>Initiative émergente (<50 membres)</p>
            </div>
        `;
        return div;
    };

    legend.addTo(map);

    // Ajouter un bouton pour initier un nouveau projet
    const createButton = L.control({ position: 'bottomleft' });

    createButton.onAdd = function() {
        const div = L.DomUtil.create('div', 'create-project-button');
        div.innerHTML = '<i class="fas fa-plus"></i> Initier un nouveau projet';
        return div;
    };

    createButton.addTo(map);

    // Gestionnaire d'événements pour le bouton de création
    document.addEventListener('click', function(e) {
        if (e.target.closest('.create-project-button')) {
            const joinSection = document.getElementById('join-community') || document.getElementById('join-now');
            if (joinSection) {
                joinSection.scrollIntoView({ behavior: 'smooth' });

                // Pré-remplir le formulaire
                const interestsSelect = document.getElementById('interests');
                if (interestsSelect) {
                    interestsSelect.value = 'create_new';
                    
                    // Déclencher l'événement change
                    const event = new Event('change');
                    interestsSelect.dispatchEvent(event);
                }
            }
        }
    });

    // Styles CSS pour la carte
    const style = document.createElement('style');
    style.textContent = `
        .custom-marker {
            background: transparent;
            border: none;
        }
        
        .map-search-control {
            background: white;
            padding: 8px;
            border-radius: 4px;
            box-shadow: 0 1px 5px rgba(0,0,0,0.4);
            margin: 10px;
        }
        
        .map-search {
            display: flex;
            width: 300px;
        }
        
        .map-search input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 4px 0 0 4px;
            font-size: 14px;
        }
        
        .map-search button {
            background-color: var(--primary, #e63946);
            color: white;
            border: none;
            padding: 0 15px;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
        }
        
        .map-legend {
            background: white;
            padding: 10px;
            border-radius: 4px;
            box-shadow: 0 1px 5px rgba(0,0,0,0.4);
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            font-size: 12px;
        }
        
        .marker {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
            border: 1px solid white;
        }
        
        .marker-green {
            background-color: #4CAF50;
        }
        
        .marker-orange {
            background-color: #FF9800;
        }
        
        .marker-blue {
            background-color: #2196F3;
        }
        
        .create-project-button {
            background-color: var(--primary, #e63946);
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            box-shadow: 0 1px 5px rgba(0,0,0,0.4);
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            align-items: center;
        }
        
        .create-project-button i {
            margin-right: 8px;
        }
        
        .popup-content {
            padding: 10px;
            font-size: 14px;
        }
        
        .popup-content h3 {
            margin-bottom: 8px;
            color: var(--secondary, #1d3557);
            font-size: 16px;
        }
        
        .popup-content p {
            margin: 5px 0;
        }
        
        .btn-map {
            background-color: var(--primary, #e63946);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
            font-size: 14px;
            display: block;
            width: 100%;
            text-align: center;
        }
        
        .btn-map:hover {
            background-color: #d12836;
        }
    `;
    document.head.appendChild(style);

    // Ajouter le CSS requis pour Leaflet si ce n'est pas déjà inclus
    if (!document.querySelector('link[href*="leaflet.css"]')) {
        const leafletCss = document.createElement('link');
        leafletCss.rel = 'stylesheet';
        leafletCss.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaf