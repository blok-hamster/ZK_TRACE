const hre = require("hardhat");

const hubAdmin = "0x23142e15b262d787344671c4b079a0510c682527";
//const hubAdmin = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

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

const addresses = {
  traceFactoryAddress: {
    eipAddress: "0x3907977976DBB9eAd7e825b3d34B5d0F97D22bC5",
  },
  traceHubAddress: { eipAddress: "0x839201D2756E8fe9ee9a32170EC295E40F5fb22d" },
  traceImplimentationAddress: {
    eipAddress: "0x8E895b6A4440b797D7b2d018a3f105F59fB26D3d",
  },
};
