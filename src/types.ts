export type HistoricalDataPoint = {
  blockNumber: number;
  baseFeePerGasMwei: number;
  timestamp: number;
  chainName: string;
};

export type Chain = {
  name: string;
  rpcUrl: string;
  icon: string;
};
