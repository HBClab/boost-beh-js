// src/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onLog: cb => ipcRenderer.on('sparse-log', (_evt, msg) => cb(msg)),
  onDone: cb => ipcRenderer.once('sparse-done', () => cb())
});
