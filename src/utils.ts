import axios from "axios";
import { store } from "./store";
import { HistoricalDataPoint } from "./types";
import { chains } from "./chains";

export let nodeUrl = store.get("rpcUrl");

async function getBlock(blockNumberHex: string) {
  return await axios.post(
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
}

export async function getBaseFee(blockNumber?: number) {
  try {
    const response = await getBlock(
      blockNumber ? "0x" + blockNumber.toString(16) : "latest"
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

export async function getHistoricalGasPrices(): Promise<HistoricalDataPoint[]> {
  const blocksPerPeriod = 1200; // Approximate number of blocks to skip for 20 data points over 48 hours

  let historicalData: HistoricalDataPoint[] = [];

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
    const startBlock = currentBlockNumber - 34400;

    // Loop to collect data points
    for (let i = 0; i < 200; i++) {
      const blockNumberHex = "0x" + currentBlockNumber.toString(16);
      const response = await getBlock(blockNumberHex);

      const baseFeePerGasWei = parseInt(response.data.result.baseFeePerGas, 16);
      const baseFeePerGasMwei = baseFeePerGasWei / 1e6;
      const timestamp = parseInt(response.data.result.timestamp, 16);

      const chainWithRpc = chains.find(chain => chain.rpcUrl === nodeUrl);

      if (!chainWithRpc) {
        throw new Error("Chain not found");
      }

      historicalData.push({
        blockNumber: currentBlockNumber,
        baseFeePerGasMwei: Math.round(baseFeePerGasMwei),
        timestamp,
        chainName: chainWithRpc.name
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
