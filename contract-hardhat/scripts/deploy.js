const hre = require("hardhat");

const hubAdmin = "0x23142E15b262D787344671C4B079A0510C682527";

async function main() {
  // import Contracts
  const TraceAgreement = await hre.ethers.getContractFactory("TraceAgreement");
  const TraceHub = await hre.ethers.getContractFactory("TraceHub");
  const TraceFactroy = await hre.ethers.getContractFactory(
    "TraceAgreementFactory"
  );

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
