// src/electron.js
const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const os = require('os');
const sparseClone = require('./scripts/sparseCheckout'); // ← Import it at the top
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
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  // Load the static build (no localhost)
  const indexPath = path.join(__dirname, '../build/index.html');
  // first load the React app at #/init-load
  await mainWindow.loadURL(`file://${indexPath}#/init-load`);

  // Open DevTools in dev mode
  if (process.env.NODE_ENV !== 'production') {
    mainWindow.webContents.openDevTools();
  }
  // now run sparseClone, sending each message to the renderer
  try {
    await sparseClone(msg => {
      console.log(msg);
      mainWindow.webContents.send('sparse-log', msg);
    });
    // tell the UI we're done
    mainWindow.webContents.send('sparse-done');
  } catch (err) {
    console.error('❌ Failed to run sparseClone:', err);
    mainWindow.webContents.send('sparse-log', `❌ ${err.message}`);
    mainWindow.webContents.send('sparse-done');
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


