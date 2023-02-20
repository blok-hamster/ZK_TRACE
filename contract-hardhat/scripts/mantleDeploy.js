const hre = require("hardhat");

const hubAdmin = "0x23142E15b262D787344671C4B079A0510C682527";

async function main() {
  const feeData = await provider.getFeeData();
  const fee = {
    maxFeePerGas: feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    //gasPrice: feeData.gasPrice,
  };
  // import Contracts
  const TraceAgreement = await hre.ethers.getContractFactory("TraceAgreement");
  const TraceHub = await hre.ethers.getContractFactory("TraceHub");
  const TraceFactroy = await hre.ethers.getContractFactory(
    "TraceAgreementFactory"
  );

  // deploy contracts
  const traceAgreementImplimentation = await TraceAgreement.deploy(fee);

  const traceHub = await TraceHub.deploy(hubAdmin, fee);

  const traceFactory = await TraceFactroy.deploy(
    traceHub.address,
    traceAgreementImplimentation.address,
    fee
  );

  const tx = await traceHub.addFactory(traceFactory.address, fee);
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
