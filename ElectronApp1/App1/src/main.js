const { app, BrowserWindow,screen } = require('electron');
const path = require('path');
const { title } = require('process');
const fs  = require('fs');
//const socket = require('socket.io-client')('http://localhost:3000');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: screen.width,
    height: screen.height,
    fullscreen: true,
    title:'JBase',
    icon: path.join(__dirname, '/Icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation:false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  
    app.quit();
  
});



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
