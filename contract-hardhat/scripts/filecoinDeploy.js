const hre = require("hardhat");
const fa = require("@glif/filecoin-address");

const hubAdmin = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

const convertContractAddress = async (address) => {
  const f4Address = fa.newDelegatedEthAddress(address).toString();
  return f4Address;
};

async function main() {
  // import Contracts
  const TraceAgreement = await hre.ethers.getContractFactory("TraceAgreement");
  const TraceHub = await hre.ethers.getContractFactory("TraceHub");
  const TraceFactroy = await hre.ethers.getContractFactory(
    "TraceAgreementFactory"
  );

  // deploy contracts
  const traceAgreementImplimentation = await TraceAgreement.deploy();
  const f4_traceImplimentationAddress = await convertContractAddress(
    traceAgreementImplimentation.address
  );

  const traceHub = await TraceHub.deploy(hubAdmin);
  const f4_traceHub = await convertContractAddress(traceHub.address);

  const traceFactory = await TraceFactroy.deploy(
    traceHub.address,
    traceAgreementImplimentation.address
  );
  const f4_traceFactory = await convertContractAddress(traceFactory.address);

  const tx = await traceHub.addFactory(traceFactory.address);
  await tx.wait();

  const addresses = {
    traceFactoryAddress: {
      f4Address: f4_traceFactory,
      eipAddress: traceFactory.address,
    },
    traceHubAddress: {
      f4Address: f4_traceHub,
      eipAddress: traceHub.address,
    },
    traceImplimentationAddress: {
      f4Address: f4_traceImplimentationAddress,
      eipAddress: traceAgreementImplimentation.address,
    },
  };

  console.log(addresses);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
