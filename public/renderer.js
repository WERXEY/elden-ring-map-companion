// Renderer.js - Script principal pour l'interface utilisateur
// Ce script gère la carte interactive et la communication avec le processus principal

// Accès aux API Electron
const { ipcRenderer } = require('electron');

// Configuration de la carte
let map;
let playerMarker;
let itemMarkers = {};

// Données simulées pour le prototype
const mapItems = [
    { id: 1, name: 'Golden Seed', type: 'seed', x: 320, y: 380, description: 'Augmente le nombre d\'utilisations de la Fiole Sacrée.' },
    { id: 2, name: 'Sacred Tear', type: 'tear', x: 350, y: 420, description: 'Augmente la puissance de récupération de la Fiole Sacrée.' },
    { id: 3, name: 'Map Fragment', type: 'map', x: 280, y: 400, description: 'Révèle une partie de la carte du monde.' },
    { id: 4, name: 'Golden Seed', type: 'seed', x: 260, y: 350, description: 'Augmente le nombre d\'utilisations de la Fiole Sacrée.' },
    { id: 5, name: 'Sacred Tear', type: 'tear', x: 310, y: 430, description: 'Augmente la puissance de récupération de la Fiole Sacrée.' },
    { id: 6, name: 'Map Fragment', type: 'map', x: 370, y: 390, description: 'Révèle une partie de la carte du monde.' },
    { id: 7, name: 'Golden Seed', type: 'seed', x: 330, y: 360, description: 'Augmente le nombre d\'utilisations de la Fiole Sacrée.' },
    { id: 8, name: 'Sacred Tear', type: 'tear', x: 290, y: 410, description: 'Augmente la puissance de récupération de la Fiole Sacrée.' },
    { id: 9, name: 'Map Fragment', type: 'map', x: 340, y: 370, description: 'Révèle une partie de la carte du monde.' },
    { id: 10, name: 'Golden Seed', type: 'seed', x: 300, y: 400, description: 'Augmente le nombre d\'utilisations de la Fiole Sacrée.' }
];

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupEventListeners();
    startDataUpdates();
});

// Initialisation de la carte Leaflet
function initMap() {
    // Créer la carte avec des limites adaptées à Elden Ring
    map = L.map('map-container', {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 2,
        zoomControl: true,
        attributionControl: false
    });

    // Définir les limites de la carte
    const bounds = [[0, 0], [1000, 1000]];
    map.fitBounds(bounds);

    // Ajouter une couche de tuiles personnalisée (fond noir pour le prototype)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Créer un marqueur pour le joueur
    const playerIcon = L.divIcon({
        className: 'player-marker',
        iconSize: [15, 15]
    });
    
    playerMarker = L.marker([300, 400], { icon: playerIcon }).addTo(map);
    playerMarker.bindPopup('Votre position');

    // Ajouter les marqueurs d'objets
    addItemMarkers();
}

// Ajouter les marqueurs d'objets sur la carte
function addItemMarkers() {
    mapItems.forEach(item => {
        const itemIcon = L.divIcon({
            className: `item-marker ${item.type}`,
            iconSize: [12, 12]
        });
        
        const marker = L.marker([item.x, item.y], { icon: itemIcon }).addTo(map);
        
        marker.bindPopup(`
            <div class="item-popup-title">${item.name}</div>
            <div class="item-popup-description">${item.description}</div>
            <div class="item-popup-status">Statut: Non collecté</div>
        `);
        
        itemMarkers[item.id] = marker;
    });
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Recherche d'objets
    document.getElementById('search-button').addEventListener('click', searchItems);
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchItems();
        }
    });
}

// Fonction de recherche d'objets
function searchItems() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    if (!searchTerm) {
        // Réinitialiser tous les marqueurs si la recherche est vide
        Object.values(itemMarkers).forEach(marker => {
            marker.setOpacity(1);
        });
        return;
    }
    
    // Filtrer les objets selon le terme de recherche
    mapItems.forEach(item => {
        const marker = itemMarkers[item.id];
        if (item.name.toLowerCase().includes(searchTerm) || 
            item.type.toLowerCase().includes(searchTerm)) {
            marker.setOpacity(1);
            // Mettre en évidence les résultats de recherche
            marker.setZIndexOffset(1000);
        } else {
            marker.setOpacity(0.3);
            marker.setZIndexOffset(0);
        }
    });
    
    // Trouver le premier résultat correspondant pour centrer la carte
    const firstMatch = mapItems.find(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.type.toLowerCase().includes(searchTerm)
    );
    
    if (firstMatch) {
        map.setView([firstMatch.x, firstMatch.y], 0);
        itemMarkers[firstMatch.id].openPopup();
    }
}

// Démarrer les mises à jour périodiques des données
function startDataUpdates() {
    // Mettre à jour la position du joueur toutes les secondes
    setInterval(updatePlayerPosition, 1000);
    
    // Mettre à jour les objets collectés toutes les 5 secondes
    setInterval(updateCollectedItems, 5000);
}

// Mettre à jour la position du joueur
async function updatePlayerPosition() {
    try {
        // Demander la position au processus principal
        const position = await ipcRenderer.invoke('get-player-position');
        
        if (position) {
            // Mettre à jour le marqueur du joueur
            playerMarker.setLatLng([position.x, position.y]);
            
            // Mettre à jour l'affichage des coordonnées
            document.getElementById('player-position').textContent = 
                `Position: X: ${Math.round(position.x)}, Y: ${Math.round(position.y)}, Z: ${Math.round(position.z)}`;
            
            // Déterminer la zone approximative (simulé pour le prototype)
            const area = determinePlayerArea(position.x, position.y);
            document.getElementById('player-area').textContent = `Zone: ${area}`;
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la position:', error);
        document.getElementById('connection-status').textContent = 'Statut: Déconnecté du jeu';
        document.getElementById('connection-status').style.color = '#ff4500';
    }
}

// Déterminer la zone du joueur en fonction des coordonnées (simulé)
function determinePlayerArea(x, y) {
    // Logique simplifiée pour le prototype
    if (x < 250 && y < 350) return 'Limgrave Nord';
    if (x < 250) return 'Limgrave Sud';
    if (x < 350 && y < 350) return 'Péninsule des Larmes';
    if (x < 350) return 'Château de Morne';
    if (y < 400) return 'Lac Liurnia';
    return 'Académie de Raya Lucaria';
}

// Mettre à jour les objets collectés
async function updateCollectedItems() {
    try {
        // Demander les objets collectés au processus principal
        const collectedItems = await ipcRenderer.invoke('get-collected-items');
        
        if (collectedItems && collectedItems.length > 0) {
            // Créer un ensemble d'IDs d'objets collectés pour une recherche rapide
            const collectedIds = new Set(collectedItems.filter(item => item.collected).map(item => item.id));
            
            // Mettre à jour l'apparence des marqueurs
            mapItems.forEach(item => {
                const marker = itemMarkers[item.id];
                const isCollected = collectedIds.has(item.id);
                
                // Mettre à jour la classe CSS du marqueur
                const icon = marker.getIcon();
                icon.options.className = `item-marker ${item.type}${isCollected ? ' collected' : ''}`;
                marker.setIcon(icon);
                
                // Mettre à jour le contenu de la popup
                marker.getPopup().setContent(`
                    <div class="item-popup-title">${item.name}</div>
                    <div class="item-popup-description">${item.description}</div>
                    <div class="item-popup-status">Statut: ${isCollected ? 'Collecté' : 'Non collecté'}</div>
                `);
            });
            
            // Mettre à jour les barres de progression
            updateProgressBars(collectedIds);
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour des objets collectés:', error);
    }
}

// Mettre à jour les barres de progression
function updateProgressBars(collectedIds) {
    // Calculer la progression pour chaque type d'objet
    const seedItems = mapItems.filter(item => item.type === 'seed');
    const tearItems = mapItems.filter(item => item.type === 'tear');
    const mapItems = mapItems.filter(item => item.type === 'map');
    
    const seedCollected = seedItems.filter(item => collectedIds.has(item.id)).length;
    const tearCollected = tearItems.filter(item => collectedIds.has(item.id)).length;
    const mapCollected = mapItems.filter(item => collectedIds.has(item.id)).length;
    
    // Calculer les pourcentages
    const seedPercent = seedItems.length > 0 ? Math.round((seedCollected / seedItems.length) * 100) : 0;
    const tearPercent = tearItems.length > 0 ? Math.round((tearCollected / tearItems.length) * 100) : 0;
    const mapPercent = mapItems.length > 0 ? Math.round((mapCollected / mapItems.length) * 100) : 0;
    
    // Mettre à jour l'interface
    const progressBars = document.querySelectorAll('.progress-category');
    
    // Graines dorées
    progressBars[0].querySelector('.progress-fill').style.width = `${seedPercent}%`;
    progressBars[0].querySelector('span:last-child').textContent = `${seedPercent}%`;
    
    // Larmes sacrées
    progressBars[1].querySelector('.progress-fill').style.width = `${tearPercent}%`;
    progressBars[1].querySelector('span:last-child').textContent = `${tearPercent}%`;
    
    // Fragments de carte
    progressBars[2].querySelector('.progress-fill').style.width = `${mapPercent}%`;
    progressBars[2].querySelector('span:last-child').textContent = `${mapPercent}%`;
}
