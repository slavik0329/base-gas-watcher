import { menubar } from "menubar";
import path from "path";
import { app, ipcMain } from "electron";
import Store from "electron-store";
import { Chain } from "./types";
import { getBaseFee, getHistoricalGasPrices, nodeUrl } from "./utils";
import { store } from "./store";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

ipcMain.on("exit-app", () => {
  app.quit();
});

const appPath = app.getAppPath();

const mb = menubar({
  // icon: path.join(appPath, `.webpack/renderer/assets/base@2x.png`),
  icon: path.join(
    appPath,
    `.webpack/renderer/assets/${store.get("chainIcon")}`
  ),
  index: MAIN_WINDOW_WEBPACK_ENTRY,
  browserWindow: {
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
      // devTools: true
    },
    width: 400,
    height: 300,
    roundedCorners: false
  }
});

async function refreshFee() {
  const baseFee = await getBaseFee();
  if (baseFee) {
    mb.tray.setTitle(`${baseFee} Mwei`);
  }
}

mb.on("ready", async () => {
  console.log("Menubar app is ready.");
  refreshFee();
  setInterval(async () => {
    await refreshFee();
  }, 10000);
});

app.whenReady().then(() => {
  ipcMain.handle("getHistory", async () => {
    console.log("Received getHistory request from renderer process");

    const historicalGasPrices = await getHistoricalGasPrices();
    console.log("Historical Gas Prices:", historicalGasPrices);

    return historicalGasPrices;
  });

  ipcMain.on("setChain", async (event, chain: Chain) => {
    console.log("set chain to", chain);

    store.set("chainIcon", chain.icon);
    store.set("rpcUrl", chain.rpcUrl);

    mb.tray.setImage(
      path.join(appPath, `.webpack/renderer/assets/${chain.icon}`)
    );

    mb.tray.setTitle("...");

    refreshFee();
  });
});
