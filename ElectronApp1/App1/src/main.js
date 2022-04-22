const { app, BrowserWindow,screen } = require('electron');
const path = require('path');
const { title } = require('process');
const fs  = require('fs');
var reloaded = true;
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
    title:'JBase',
    icon: path.join(__dirname, '/Icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation:false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.setMenu(null);
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  
  
      mainWindow.webContents.on('dom-ready',()=>{
        mainWindow.webContents.closeDevTools();
        mainWindow.minimize();
        mainWindow.maximize();
        console.log('triggered');
      });
    
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {

    app.quit();
    active = false;
});

async function windowRegulator(){
  while (active){
    
  }
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
