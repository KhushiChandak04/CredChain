import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox";

const { SEPOLIA_RPC_URL, PRIVATE_KEY } = process.env;

export default {
  solidity: "0.8.20", // Compatible with pragma ^0.8.0 in contract
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};
