// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  exitApp: () => ipcRenderer.send("exit-app"),
  getHistory: () => ipcRenderer.invoke("getHistory"),
  setChain: (chain: string) => ipcRenderer.send("setChain", chain)
});
