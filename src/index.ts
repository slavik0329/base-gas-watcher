import { menubar } from "menubar";
import path from "path";
import { app, ipcMain, BrowserWindow } from "electron";
import https from "https";
import fs from "fs";

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

function getBaseFee() {
  // Replace with your Geth node RPC URL
  const nodeUrl = "https://mainnet.base.org";

  // Prepare the JSON-RPC request payload to get the latest block
  const data = JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_getBlockByNumber",
    params: ["latest", false], // false indicates that we do not need detailed transaction info
    id: 1
  });

  const options = {
    hostname: new URL(nodeUrl).hostname,
    port: new URL(nodeUrl).port,
    path: new URL(nodeUrl).pathname,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length
    }
  };

  const req = https.request(options, res => {
    let responseBody = "";

    res.on("data", chunk => {
      responseBody += chunk;
    });

    res.on("end", () => {
      try {
        const response = JSON.parse(responseBody);

        // Extract the base fee per gas from the latest block and convert from hex to Wei
        const baseFeePerGasWei = parseInt(response.result.baseFeePerGas, 16);

        // Convert Wei to Gwei for readability
        const baseFeePerGasMwei = baseFeePerGasWei / 1e6;
        // const baseFeePerGasGwei = baseFeePerGasWei / 1e9;
        console.log("Base Fee Per Gas:", baseFeePerGasMwei, "Mwei");
        mb.tray.setTitle(` ${Math.round(baseFeePerGasMwei)} Mwei`);
      } catch (error) {
        console.error("Error parsing response:", error);
      }
    });
  });

  req.on("error", error => {
    console.error("Error making request:", error);
  });

  req.write(data);
  req.end();
}

mb.on("ready", () => {
  console.log("Menubar app is ready.");
  getBaseFee();
  setInterval(getBaseFee, 10000);
});
