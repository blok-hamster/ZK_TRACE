const { task } = require("hardhat/config");

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
//require("hardhat-contract-sizer");
require("@nomiclabs/hardhat-waffle");
//require("hardhat-gas-reporter");
require("solidity-docgen");
require("dotenv").config();
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
    filecoin: {
      chainId: 3141,
      url: "https://filecoin-hyperspace.chainstacklabs.com/rpc/v1",
      accounts: [PRIVATE_KEY],
    },

    mantle: {
      chainId: 5001,
      url: "https://rpc.testnet.mantle.xyz/",
      accounts: [PRIVATE_KEY],
    },

    polygon: {
      chainId: 137,
      url: "",
      accounts: [PRIVATE_KEY],
    },

    polygonMumbai: {
      chainId: 80001,
      url: "",
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
};
