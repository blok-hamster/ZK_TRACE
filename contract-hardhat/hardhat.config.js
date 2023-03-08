const { task } = require("hardhat/config");

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
//require("hardhat-contract-sizer");
require("@nomiclabs/hardhat-waffle");
//require("hardhat-gas-reporter");
require("solidity-docgen");
const dotenv = require("dotenv").config();
const PRIVATE_KEY = process.env.PRIVATE_KEY;

task("accounts", "Prints The List Of Accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      // See its defaults
    },

    polygon: {
      chainId: 137,
      url: "",
      accounts: [PRIVATE_KEY],
    },

    fantomTestnet: {
      chainId: 4002,
      url: "https://rpc.testnet.fantom.network",
      accounts: [PRIVATE_KEY],
    },

    fantom: {
      chainId: 250,
      url: "https://rpc2.fantom.network",
      accounts: [PRIVATE_KEY],
    },
  },

  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },

      {
        version: "0.7.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },
    ],
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },

  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: [],
  },

  gasReporter: {
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },

  etherscan: {
    apiKey: process.env.FTM_SCAN_KEY,
  },
};
