import Store from "electron-store";
import { HistoricalDataPoint } from "./types";

type StoreType = {
  rpcUrl: string;
  chainIcon: string;
  cachedDataPoints: HistoricalDataPoint[];
};

export const store = new Store<StoreType>({
  defaults: {
    chainIcon: "base@2x.png",
    rpcUrl: "https://mainnet.base.org",
    cachedDataPoints: []
  }
});
