const { menubar } = require("menubar");
const https = require("https");
const { app, Menu, Tray, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

ipcMain.on("exit-app", () => {
  app.quit();
});

console.log({
  message: JSON.stringify(fs.readdirSync(path.join(__dirname)))
});

const mb = menubar({
  icon: path.join(__dirname, "icon.png"),
  browserWindow: {
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
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
        const baseFeePerGasGwei = baseFeePerGasWei / 1e9;
        console.log("Base Fee Per Gas:", baseFeePerGasGwei, "Gwei");
        mb.tray.setTitle(` ${baseFeePerGasGwei.toPrecision(4)} Gwei`);
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
