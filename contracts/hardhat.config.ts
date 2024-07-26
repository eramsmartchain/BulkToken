import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const zedxMainnet: NetworkUserConfig = {
  url: "https://mainnet-rpc.eramscan.com",
  chainId: 721529,
  accounts: [process.env.KEY!],
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    ...(process.env.KEY && { zedxMainnet }),
  },
  etherscan: {
    apiKey: {
      zedxMainnet: process.env.API_KEY!,
    },
    customChains: [
      {
        network: "eramMainnet",
        chainId: 721529,
        urls: {
          apiURL: "https://eramscan.com/api",
          browserURL: "https://eramscan.com",
        },
      },
    ],
  },
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 99999,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
