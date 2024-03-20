import { menubar } from "menubar";
import path from "path";
import { app, ipcMain, BrowserWindow } from "electron";
import https from "https";
import fs from "fs";
import axios from "axios";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

ipcMain.on("exit-app", () => {
  app.quit();
});

const appPath = app.getAppPath();

const mb = menubar({
  icon: path.join(appPath, ".webpack/renderer/assets/menuicon@2x.png"),
  index: MAIN_WINDOW_WEBPACK_ENTRY,
  browserWindow: {
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    },
    width: 128,
    height: 34,
    roundedCorners: false
  }
});

async function getBaseFee(blockNumber?: number) {
  const nodeUrl = "https://mainnet.base.org";

  try {
    const response = await axios.post(
      nodeUrl,
      {
        jsonrpc: "2.0",
        method: "eth_getBlockByNumber",
        params: [blockNumber ?? "latest", false], // false indicates that we do not need detailed transaction info
        id: 1
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Extract the base fee per gas from the latest block and convert from hex to Wei
    const baseFeePerGasWei = parseInt(response.data.result.baseFeePerGas, 16);

    // Convert Wei to Mwei for readability
    const baseFeePerGasMwei = baseFeePerGasWei / 1e6;

    console.log("Base Fee Per Gas:", baseFeePerGasMwei, "Mwei");
    return Math.round(baseFeePerGasMwei); // Return the rounded base fee per gas in Mwei
  } catch (error) {
    console.error("Error making request or parsing response:", error);
    return null; // Return null or a suitable default/error value in case of an error
  }
}

async function refreshFee() {
  const baseFee = await getBaseFee();
  if (baseFee) {
    mb.tray.setTitle(`${baseFee} Mwei`);
  }
}

mb.on("ready", () => {
  console.log("Menubar app is ready.");
  refreshFee();
  setInterval(async () => {
    await refreshFee();
  }, 10000);
});
