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

const deployed = {
  traceFactoryAddress: {
    eipAddress: "0x0DA397b9575429f25918592174103EecfF5a781A",
  },
  traceHubAddress: { eipAddress: "0x6FF826aacAea40713DAA03443491f07Fc5A549CD" },
  traceImplimentationAddress: {
    eipAddress: "0x3907977976DBB9eAd7e825b3d34B5d0F97D22bC5",
  },
};
