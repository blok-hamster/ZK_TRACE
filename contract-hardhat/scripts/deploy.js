const hre = require("hardhat");
const fa = require("@glif/filecoin-address");

const convertContractAddress = async (address) => {
  const f4Address = fa.newDelegatedEthAddress(address).toString();
  return f4Address;
};

async function main() {
  const TraceHub = await hre.ethers.getContractFactory("TraceHub");
  const TraceFactroy = await hre.ethers.getContractFactory(
    "TraceAgreementFactory"
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
