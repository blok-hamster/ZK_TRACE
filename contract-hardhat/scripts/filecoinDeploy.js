const hre = require("hardhat");
const fa = require("@glif/filecoin-address");

const hubAdmin = "0x23142E15b262D787344671C4B079A0510C682527";
const provider = new hre.ethers.providers.JsonRpcProvider(
  "https://filecoin-hyperspace.chainstacklabs.com/rpc/v1"
);

const convertContractAddress = async (address) => {
  const f4Address = fa.newDelegatedEthAddress(address).toString();
  return f4Address;
};

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
  const f4_traceImplimentationAddress = await convertContractAddress(
    traceAgreementImplimentation.address
  );

  const traceHub = await TraceHub.deploy(hubAdmin, fee);
  const f4_traceHub = await convertContractAddress(traceHub.address);

  const traceFactory = await TraceFactroy.deploy(
    traceHub.address,
    traceAgreementImplimentation.address,
    fee
  );
  const f4_traceFactory = await convertContractAddress(traceFactory.address);

  const tx = await traceHub.addFactory(traceFactory.address, fee);
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

const deployedAddresses = {
  traceFactoryAddress: {
    f4Address: "f410facuvcaoe7yh3jt3ftjuqg4b6cd3viqczqyvs24y",
    eipAddress: "0x00a95101C4fe0fb4Cf659A6903703e10F7544059",
  },
  traceHubAddress: {
    f4Address: "f410fbwrzpokxkqu7ewiyleqxieb65t7vu6a2kxxrdrq",
    eipAddress: "0x0DA397b9575429f25918592174103EecfF5a781A",
  },
  traceImplimentationAddress: {
    f4Address: "f410fn74cnkwk5jahcpnkancdjepqp7c2ksonv2q5x3i",
    eipAddress: "0x6FF826aacAea40713DAA03443491f07Fc5A549CD",
  },
};
