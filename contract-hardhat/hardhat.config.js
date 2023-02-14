const { task } = require("hardhat/config");

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
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
    hyperspace: {
      chainId: 3141,
      url: "https://api.hyperspace.node.glif.io/rpc/v1",
      accounts: [PRIVATE_KEY],
    },

    mantle: {
      chainId: 5001,
      url: "https://rpc.testnet.mantle.xyz/",
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
