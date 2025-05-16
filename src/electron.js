// src/electron.js
const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const os = require('os');
const sparseClone = require('./scripts/sparseCheckout'); // ← Import it at the top
const { updateElectronApp } = require('update-electron-app');
// ─── Dev Hot-Reload ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
    forceHardReset: true,
    hardResetMethod: 'exit',
  });
}

let mainWindow;

async function createWindow() {
  updateElectronApp(); // additional configuration options available
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the static build (no localhost)
  const indexPath = path.join(__dirname, '../build/index.html');
  await mainWindow.loadFile(indexPath);

  // Open DevTools in dev mode
  if (process.env.NODE_ENV !== 'production') {
    mainWindow.webContents.openDevTools();
  }
  // ✅ Run sparseClone after the window is created and loaded
  try {
    await sparseClone();
    console.log('✅ sparseClone completed after window load.');
  } catch (err) {
    console.error('❌ Failed to run sparseClone:', err);
  }
}

app.whenReady().then(async () => {
  // (Optional) load React DevTools on macOS
  if (process.env.NODE_ENV !== 'production') {
    const reactDevToolsPath = path.join(
      os.homedir(),
      '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.9.0_0'
    );
    try {
      await session.defaultSession.loadExtension(reactDevToolsPath);
      console.log('✅ React DevTools loaded');
    } catch (e) {
      console.warn('⚠️ Failed to load React DevTools:', e.message);
    }
  }

  await createWindow();

  // On macOS re-create window when clicking dock icon
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


