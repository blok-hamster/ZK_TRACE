require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("dotenv").config();

const fa = require("@glif/filecoin-address");
const PRIVATE_KEY = process.env.PRIVATE_KEY;

task(
  "get-address",
  "Gets Filecoin f4 address and corresponding Ethereum address."
).setAction(async (taskArgs) => {
  //create new Wallet object from private key
  const DEPLOYER_PRIVATE_KEY = network.config.accounts[0];
  const deployer = new ethers.Wallet(PRIVATE_KEY);

  //Convert Ethereum address to f4 address
  const f4Address = fa.newDelegatedEthAddress(deployer.address).toString();
  console.log(
    "Ethereum address (this addresss should work for most tools):",
    deployer.address
  );
  console.log("f4address (also known as t4 address on testnets):", f4Address);
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "hyperspace",
  networks: {
    hyperspace: {
      chainId: 3141,
      url: "https://api.hyperspace.node.glif.io/rpc/v1",
      accounts: [PRIVATE_KEY],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
