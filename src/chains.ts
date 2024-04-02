import { Chain } from "./types";
// @ts-ignore
import baseImage from "./assets/base.png";
// @ts-ignore
import optimismImage from "./assets/optimism.png";
// @ts-ignore
import mainnetImage from "./assets/mainnet.png";

export const chains: Chain[] = [
  {
    name: "Base",
    rpcUrl: "https://mainnet.base.org",
    icon: baseImage
  },
  {
    name: "Optimism",
    rpcUrl: "https://optimism.blockpi.network/v1/rpc/public",
    icon: optimismImage
  },
  {
    name: "Mainnet",
    rpcUrl: "https://eth.llamarpc.com",
    icon: mainnetImage
  }
];
