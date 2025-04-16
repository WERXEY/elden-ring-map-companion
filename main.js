const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

// Gardez une référence globale de l'objet window, sinon la fenêtre sera
// fermée automatiquement quand l'objet JavaScript sera garbage collected.
let mainWindow;

function createWindow() {
  // Créer la fenêtre du navigateur.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // et charger le fichier index.html de l'application.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'public/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Ouvrir les DevTools en mode développement
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Émis lorsque la fenêtre est fermée.
  mainWindow.on('closed', function () {
    // Dé-référence l'objet window, normalement, vous stockeriez les fenêtres
    // dans un tableau si votre application supporte le multi-fenêtre. C'est le moment
    // où vous devriez supprimer l'élément correspondant.
    mainWindow = null;
  });
}

// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigateur.
// Certaines APIs peuvent être utilisées uniquement après cet événement.
app.on('ready', createWindow);

// Quitter quand toutes les fenêtres sont fermées.
app.on('window-all-closed', function () {
  // Sur macOS, il est commun pour une application et leur barre de menu
  // de rester active tant que l'utilisateur ne quitte pas explicitement avec Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // Sur macOS, il est commun de re-créer une fenêtre de l'application quand
  // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres d'ouvertes.
  if (mainWindow === null) {
    createWindow();
  }
});

// Dans ce fichier, vous pouvez inclure le reste du code spécifique au processus principal de
// votre application. Vous pouvez également le mettre dans des fichiers séparés et les inclure ici.

// Module de communication avec le jeu
const gameConnector = require('./src/gameConnector');

// Écouter les demandes de position du joueur
ipcMain.handle('get-player-position', async () => {
  try {
    // Simulation pour le prototype
    // Dans la version finale, cela utilisera Elden Ring Debug Tool ou libER
    return {
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 10
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de la position du joueur:', error);
    return null;
  }
});

// Écouter les demandes d'objets collectés
ipcMain.handle('get-collected-items', async () => {
  try {
    // Simulation pour le prototype
    // Dans la version finale, cela lira la mémoire du jeu
    return [
      { id: 1, name: 'Golden Seed', collected: true },
      { id: 2, name: 'Sacred Tear', collected: false },
      { id: 3, name: 'Map Fragment', collected: true }
    ];
  } catch (error) {
    console.error('Erreur lors de la récupération des objets collectés:', error);
    return [];
  }
});
