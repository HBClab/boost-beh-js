const { contextBridge } = require('electron');

// You can expose safe APIs here if needed:
contextBridge.exposeInMainWorld('electronAPI', {
  // placeholder
});
