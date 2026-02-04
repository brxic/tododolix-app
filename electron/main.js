const { app, BrowserWindow } = require('electron');
const path = require('path');

const devUrl = process.env.ELECTRON_START_URL;

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setMenuBarVisibility(false);
  win.removeMenu();

  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load', { errorCode, errorDescription, validatedURL });
  });

  if (process.env.ELECTRON_DEBUG === '1') {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  if (devUrl) {
    win.loadURL(devUrl);
  } else {
    win.loadFile(
      path.join(__dirname, '..', 'dist', 'tododolix-basil', 'browser', 'index.html')
    );
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
