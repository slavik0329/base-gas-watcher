import { Chain } from "./types";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  exitApp: () => ipcRenderer.send("exit-app"),
  getHistory: () => ipcRenderer.invoke("getHistory"),
  setChain: (chain: Chain) => ipcRenderer.send("setChain", chain)
});
