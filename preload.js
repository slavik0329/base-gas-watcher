// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  exitApp: () => ipcRenderer.send("exit-app")
});
