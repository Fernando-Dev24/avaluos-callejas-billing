const { app, BrowserWindow, dialog } = require('electron');
const path = require("path");
const url = require('url');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');

// Global variable
let win;

// Function to create a new window when app is initialized
const createWindow = async () => {
   win = new BrowserWindow({
      width: 1366,
      height: 768,
      webPreferences: {
         nodeIntegration: true,
         enableRemoteModule: true,
      },
   });

   // win load
   win.loadURL(
      isDev
      ? 'http://localhost:3000'
      : url.format({
         pathname: path.join(__dirname, 'index.html'),
         protocol: "file",
         slashes: true,
      }),
   );

   // Open dev tools
   isDev && win.webContents.openDevTools({ mode: 'detach' });

   // Check if there is a new version or update for the app
   if( !isDev ) {
      autoUpdater.checkForUpdates();
   };
};

// This method will be called when Electron's initialization will be over and ready to create a new browser window (NOTE: Some API'S can be only be used after this event occurs)
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, is common for apps and their menu bar to stay active until user quits explicity with CMD + Q
app.on('window-all-closed', () => {
   process.platform !== 'darwin' && app.quit();
});

// Limit the possibility to just open one window
app.on('activate', () => {
   BrowserWindow.getAllWindows().length === 0 && createWindow();
});

// AutoUpdater dialogs
// This dialog will be open just when there is a new GitHub release. This first dialog will be show a short message that is going to notice the user the update is downloading.
autoUpdater.on('update-available', (_event, releaseNotes, releaseName) => {
   const dialogOptions = {
      type: 'info',
      buttons: ["Entendido"],
      title: 'ACTUALIZACIÓN: Avalúos Callejas - Facturación',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'La actualización se está descargando, te notificaremos cuando esté lista para instalar',
   };
   dialog.showMessageBox(dialogOptions, (res) => {
      // Do something
   });
});

// This dialog is gonna show another dialog modal with two buttons. One for install the update now, and the other one to install when app is quit.
autoUpdater.on('update-downloaded', (_event, releaseNotes, releaseName) => {
   const dialogOptions = {
      type: 'info',
      buttons: ["Instalar ahora", "Instalar luego"],
      title: 'ACTUALIZACIÓN: Avalúos Callejas - Facturación',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'La descarga ha terminado. ¿Qué deseas hacer?'
   };
   dialog.showMessageBox(dialogOptions).then((returnValue) => {
      returnValue.response === 0 && autoUpdater.quitAndInstall();
   });
});