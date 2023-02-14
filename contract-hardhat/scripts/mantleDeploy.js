const hre = require("hardhat");
const fa = require("@glif/filecoin-address");

const hubAdmin = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

async function main() {
  // import Contracts
  const TraceAgreement = await hre.ethers.getContractFactory("TraceAgreement");
  const TraceHub = await hre.ethers.getContractFactory("TraceHub");
  const TraceFactroy = await hre.ethers.getContractFactory(
    "TraceAgreementFactory"
  );

  console.log(accounts[0]);

  // deploy contracts
  const traceAgreementImplimentation = await TraceAgreement.deploy();

  const traceHub = await TraceHub.deploy(hubAdmin);

  const traceFactory = await TraceFactroy.deploy(
    traceHub.address,
    traceAgreementImplimentation.address
  );

  const tx = await traceHub.addFactory(traceFactory.address);
  await tx.wait();

  const addresses = {
    traceFactoryAddress: {
      eipAddress: traceFactory.address,
    },
    traceHubAddress: {
      eipAddress: traceHub.address,
    },
    traceImplimentationAddress: {
      eipAddress: traceAgreementImplimentation.address,
    },
  };

  console.log(addresses);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
