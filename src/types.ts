export type HistoricalDataPoint = {
  blockNumber: number;
  baseFeePerGasMwei: number;
  timestamp: number;
};

export type Chain = {
  name: string;
  rpcUrl: string;
  icon: string;
};
