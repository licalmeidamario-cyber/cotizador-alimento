const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopUpdater', {
  installUpdate: () => ipcRenderer.invoke('update:install'),
  reloadWindow: () => ipcRenderer.invoke('update:reload'),
  relaunchWindow: () => ipcRenderer.invoke('update:relaunch')
});