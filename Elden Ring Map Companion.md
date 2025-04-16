# Elden Ring Map Companion

## Présentation

Elden Ring Map Companion est une application qui améliore votre expérience de jeu en connectant la carte interactive de Map Genie directement à votre session de jeu Elden Ring. Elle vous permet de :

- **Voir votre position en temps réel** sur la carte
- **Rechercher des objets** et trouver facilement leur emplacement
- **Suivre automatiquement** les objets que vous avez déjà collectés
- **Visualiser votre progression** par catégorie d'objets

## Fonctionnalités

### Position en temps réel
L'application lit la mémoire du jeu pour déterminer votre position exacte et l'affiche sur la carte interactive, vous permettant de toujours savoir où vous vous trouvez dans l'Entre-terre.

### Recherche d'objets
Une fonction de recherche puissante vous permet de trouver rapidement n'importe quel objet dans le jeu. Les résultats sont affichés sur la carte avec des marqueurs distincts.

### Suivi des objets collectés
L'application détecte automatiquement les objets que vous avez déjà collectés et les marque sur la carte, vous évitant de perdre du temps à chercher des objets que vous possédez déjà.

### Interface intuitive
Une interface utilisateur élégante et intuitive, conçue dans le style visuel d'Elden Ring, offre une expérience immersive qui complète le jeu sans le perturber.

## Captures d'écran

*Les captures d'écran seraient incluses ici dans la version finale*

## Installation

Consultez le [Guide d'installation et d'utilisation](GUIDE.md) pour des instructions détaillées sur l'installation et l'utilisation de l'application.

## Développement

### Prérequis
- Node.js 14+
- npm 6+
- Electron
- Elden Ring (jeu)

### Installation pour le développement
```bash
# Cloner le dépôt
git clone https://github.com/votre-nom/elden-ring-map-companion.git

# Accéder au répertoire
cd elden-ring-map-companion

# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm start
```

### Structure du projet
- `main.js` - Point d'entrée de l'application Electron
- `src/` - Code source de l'application
  - `gameConnector.js` - Module de communication avec le jeu
- `public/` - Fichiers statiques et interface utilisateur
  - `index.html` - Structure HTML principale
  - `styles.css` - Styles CSS
  - `renderer.js` - Logique côté client

### Construction
```bash
# Construire l'application pour Windows
npm run build
```

## Crédits

- Carte et données d'objets basées sur [Map Genie](https://mapgenie.io/elden-ring)
- Intégration avec le jeu via [Elden Ring Debug Tool](https://github.com/Nordgaren/Elden-Ring-Debug-Tool) et/ou [libER](https://github.com/Dasaav-dsv/libER)
- Développé avec [Electron](https://www.electronjs.org/) et [Leaflet.js](https://leafletjs.com/)

## Licence

Ce projet est distribué sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Avertissement

Cette application est un outil non officiel destiné à un usage personnel. Elle ne modifie pas les fichiers du jeu et n'interfère pas avec le gameplay. Utilisez-la comme un complément à votre expérience de jeu, pas comme un remplacement de l'exploration naturelle du monde d'Elden Ring.

---

*Elden Ring est une marque déposée de FromSoftware, Inc. Cette application n'est pas affiliée à ou approuvée par FromSoftware, Inc. ou Bandai Namco Entertainment.*
