import { Chain } from "./types";

export const chains: Chain[] = [
  {
    name: "Base",
    rpcUrl: "https://mainnet.base.org",
    icon: "base@2x.png"
  },
  {
    name: "Optimism",
    rpcUrl: "https://optimism.blockpi.network/v1/rpc/public",
    icon: "optimism@2x.png"
  },
  {
    name: "Mainnet",
    rpcUrl: "https://eth.llamarpc.com",
    icon: "mainnet@2x.png"
  }
];
