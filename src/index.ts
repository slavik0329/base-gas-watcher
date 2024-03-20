import { menubar } from "menubar";
import path from "path";
import { app, ipcMain } from "electron";
import axios from "axios";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const nodeUrl = "https://mainnet.base.org";

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
    width: 400,
    height: 300,
    roundedCorners: false
  }
});

async function getBaseFee(blockNumber?: number) {
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

async function getHistoricalGasPrices() {
  const blocksPerPeriod = 630; // Approximate number of blocks to skip for 20 data points over 48 hours
  let historicalData = [];

  try {
    // Get the current block number
    const currentBlockResponse = await axios.post(
      nodeUrl,
      {
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    let currentBlockNumber = parseInt(currentBlockResponse.data.result, 16);
    const startBlock = currentBlockNumber - 6630; // Approximate start block for 48 hours ago

    // Loop to collect data points
    for (let i = 0; i < 20; i++) {
      const blockNumberHex = "0x" + currentBlockNumber.toString(16);
      const response = await axios.post(
        nodeUrl,
        {
          jsonrpc: "2.0",
          method: "eth_getBlockByNumber",
          params: [blockNumberHex, false], // false for transaction details not required
          id: 1
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const baseFeePerGasWei = parseInt(response.data.result.baseFeePerGas, 16);
      const baseFeePerGasMwei = baseFeePerGasWei / 1e6;
      const timestamp = parseInt(response.data.result.timestamp, 16);

      historicalData.push({
        blockNumber: currentBlockNumber,
        baseFeePerGasMwei: Math.round(baseFeePerGasMwei),
        timestamp
      });

      // Move to the next block to sample
      currentBlockNumber -= blocksPerPeriod;
      if (currentBlockNumber < startBlock) break; // Safety check to avoid going before the start block
    }

    return historicalData; // Return the collected historical data with timestamps
  } catch (error) {
    console.error("Error retrieving historical gas prices:", error);
    return []; // Return an empty array or suitable error value
  }
}

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
});
