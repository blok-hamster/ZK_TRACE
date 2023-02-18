import ZkTrace from "zk-trace-sdk";
import { ethers, Wallet } from "ethers";

const verifier1key =
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const verifier2key =
  "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
const verifier3key =
  "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6";

const traceClient = new ZkTrace({
  nodeEndpoint: "http://127.0.0.1:8545",
  factoryAddress: "0x34B40BA116d5Dec75548a9e9A8f15411461E8c70",
  traceHubAddress: "0xc96304e3c037f81dA488ed9dEa1D8F2a48278a75",
  web3storageApiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZlOTA3MkJhNDkwZTZhNTE1NzE2MjBDMDFEMDIzNTA2ZTUzNkQ1NTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTY4OTMwNDEyNDQsIm5hbWUiOiJwaWNhcmR5X3Byb2ZpbGUifQ.d6_elcpPQfa69XyTHpp_iEvMbAMjoAkba5OFYJv28Xk",
});

const main = async () => {
  const data = await traceClient.readData(
    "bafyreih5egpnr6ujzsqmfsjc26yvfaxdkuuholjtdj5srba3ynlykueb2u"
  );

  console.log(data);
};

const createCar = async () => {
  let carData = {
    traceAddress: "",
    verifiersRoot: "",
    verifiers: ["0x12", "0x13", "0x14", "0x1122"],
    txDetails: {
      supplier: "0x112234eljfrlmdkhrk6",
      buyer: "0x2wdjnctr4ryjasn3kci",
    },
    previousBlockCid: "",
  };
  const result = await traceClient.createCar(carData, "0x12345");
  console.log(result);
};

const readCarData = async () => {
  const result = await traceClient.readCarData("0x123");
  console.log(result);
};

const uploadCar = async () => {
  const result = await traceClient.uploadCar("0x123");
  console.log(result);
};

const updateCar = async () => {
  let carData = {
    traceAddress: "0x123",
    verifiersRoot: "",
    verifiers: ["0x12", "0x13", "0x14", "0x1122", "0x2234dk"],
    txDetails: {
      supplier: "0x112234eljfrlmdkhrk6",
      buyer: "0x2wdjnctr4ryjasn3kci",
    },
    previousBlockCid: "",
  };
  const result = await traceClient.updateCar(carData, "0x123");
  console.log(result);
};

const getVerifierProof = async () => {
  const result = await traceClient.getMerkelProof("0x123", "0x13");
  console.log(result);
};

const generateZKProof = async () => {
  const result = await traceClient.generateZkProof(
    "0x610D048cBeB90c9d09086d31A4A5c0ED15bbBc0D"
  );
  //console.log(typeof result);
  console.log(result);
};

const verifyZkProof = async () => {
  const result = await traceClient.verifyZkProof({
    proofBuffer:
      '{"scheme":"g16","curve":"bn128","proof":{"a":["0x0a54aace630c346e9c8199ad54cc3626502db878117df610b573bb146ab30a47","0x089a1bfbbbb8b01e66a04a296e501cc63ce61eb4560c81ebb3b92a1bf8e21e37"],"b":[["0x101961dd57d4e0dfa25b8f9bb480521c6f33ee70ef4503e8c106802fe24f2da3","0x1c4c870c76dfa6fd71134b8a9eda0c2d651c054badbdbec74108fcf7cd60da41"],["0x10fab89f4fc0af971702c636e59b0db8230d308dbbfe8a136315f745b51018e4","0x132c586e82923b8b572d9d4333cdbbfc6cce1db0173fc3d0f57e1c5212a924bd"]],"c":["0x30221351c0f5f8b8806a93f62cc64f01a5d809c0fe822cc2171a6ee09212e674","0x17cb21ffa7d9ae7dd49fbabaacc17e76996d9b73039aec74c1b2ea0da1808726"]},"inputs":["0x0000000000000000000000000000000023eb158a8d494cef3bbf2731245d0687","0x0000000000000000000000000000000042a583c8a30c34e0f546672bf0332d10"]}',
    verifierKeyBuffer:
      '{"scheme":"g16","curve":"bn128","alpha":["0x2d8faced24ff26eadbdcb9304b36d01acb24a54869485a2b48c73c21843b6ea2","0x1e352adbde5db6156e4715588d816a3bdb8116d5e0423eed7cad2789c3781205"],"beta":[["0x251b9b6779ac00bf9c287741bcd8d45e85a89c1abf904464227ec2686f068d22","0x243df62d3e73df516dd61c0778e61aa7445a156e2b33a0ea0f6b9bbea5957352"],["0x215f5b057a916a3e4b009300b5ea663a025fb9c9fa8e9811e621b348bc8f34ac","0x1df20d31af4e67364b4a7bdcb5f55206520c8155e190977ecc1b2bfaa21cf93b"]],"gamma":[["0x20fadc006370b43a73bb28889bdd3e66c8b0b6d0b21faa7ee320785ff1b4bcf6","0x2345ecfabe46aa8752e628dc461b99b5bffd62de5612ad7be722d3be4a2b3443"],["0x0588fd8340da3c59d6074e4b555f644dafc1cbebc25e819cdb01f536bbdb50b4","0x1649812ced9f09330d824f658d9c23d63f19b2fe3c7278fb05fe69cd5b7b262a"]],"delta":[["0x2e714aa4de58b1d9c89358c939c7f7c649b83f0f955be26c4fbbe3c6cdff41b4","0x2ce1bf2744d2ea0f50c7e56626fbfb2622da0a30841434b93357d86a0a110f1d"],["0x0db884b44db2d4ac7ebd2af74ab87a8637ff750826810cc262b53ddaef601a87","0x0825e5f622b7728e44d1be54b84f4c95dc031eedcaeef9aff1b0d0bf43a37d1f"]],"gamma_abc":[["0x05a36d9d10cc39f969f8eecb215d070a6f3d9870dc9238097c6093914e9ca1dc","0x0d25889728219bf4141261eb26450b2ba5897de18337eda93f1adf8879c9c5eb"],["0x0915bbf896e4c62da5457575027d6f18ce768d1745ced44725653de16cee02e2","0x0e86b226f327bea22857a234f2af048f88aad6e447498852823f15f0b991f18a"],["0x2a348bdb6a05340527819f8a0e112d0ab9e603fb4b82ac54cbbfd299d0afa3e2","0x1f5624fd2df762ee8dc17a74596ab7547a1377f01e67b92234c19deee7549638"]]}',
  });

  console.log(result);
};

const getRand = async () => {
  const rnd = await traceClient.randomNumber("2kh2evubsjaejhlei");
  console.log(await rnd);
};

const getVerifiersDetails = async () => {
  const details = await traceClient.getVerifiersDetails([
    "test1",
    "test2",
    "vest",
    "crew",
    "kldnsk",
    "ljenslk",
  ]);
  console.log(details);
};

const createTraceAgreement = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    `http://127.0.0.1:8545`
  );

  const wallet = new Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  );

  const signer = wallet.connect(provider);

  const result = await traceClient.createTraceAgreement(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    1,
    signer
  );

  console.log(result);
};

const acceptProposal = async (traceAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(
    `http://127.0.0.1:8545`
  );

  const wallet = new Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  );

  const signer = wallet.connect(provider);

  const result = await traceClient.acceptProposal(traceAddress, signer);
  console.log(result);
};

const init = async (traceAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(
    `http://127.0.0.1:8545`
  );

  const wallet = new Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  );

  const signer = wallet.connect(provider);

  const result = await traceClient.initilizeAgreement(
    [
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    ],
    traceAddress,
    {
      message: "this is a test agreement",
    },
    signer
  );

  console.log(result);
};

const createZkProof = async (traceAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(
    `http://127.0.0.1:8545`
  );

  const wallet = new Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  );

  const signer = wallet.connect(provider);

  const result = await traceClient.createZkProof(traceAddress, signer);

  console.log(result);
};

const activateTraceAgreement = async (traceAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(
    `http://127.0.0.1:8545`
  );

  const wallet = new Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  );

  const signer = wallet.connect(provider);

  const result = await traceClient.activateTraceAgreement(
    traceAddress,
    {
      proofBuffer:
        '{"scheme":"g16","curve":"bn128","proof":{"a":["0x14f0c1c515611b9906a1ec9bee976902d96df8ab1707b220dee212f196981174","0x2644ee5edb11aff1bc3dfc091d45e354cb7892b026706da982a96d1bb102aeff"],"b":[["0x26f20665948ae128cc69834fc891532e50f2fc78e738bd2798357b68e6c673a8","0x1f3b7e65a719b457308631b35498d9b8079c40d8ff40f392c434fb5626e26159"],["0x171e0a688590c0ca0dc0d5a1025bbbd93bef4547dc1497887ecfbed4bb22e534","0x25fdfb9eefa60bfd0aa039f7e0e770a73c8dc087d8a1f5d41631e3964a93288e"]],"c":["0x26fefeaad7422088abc7580c2b9e493bd76128ff8061f6e056ef18867fdd3ada","0x1ae717627e0c4181ed4d5eed6b3aefa5d584788d0aa958e3133778576e8ddb3a"]},"inputs":["0x00000000000000000000000000000000e837818af5f4653ae8d04b5f0342b3af","0x000000000000000000000000000000000a698978978bb5ede70e0c8953f38cec"]}',
      verifierKeyBuffer:
        '{"scheme":"g16","curve":"bn128","alpha":["0x20bc0edd185c7d9b15c04e0a630790c8a260b9f59c776016220af4dadf8462db","0x1d8b994805ae09d724eb1df390daba4ad9b1aeea4648d1a6558bcdd93845db15"],"beta":[["0x0a3d843dabfaed6828dab573f875b22ff678b5f37d262841ce92dec09fffec9b","0x26f4fb7a9c50957d6bded6035504842174f24f034e46be74c5bb91195adf2570"],["0x132b396b8f5ea7bbebc61a44fd0cadb521152b1cf90ad9305e6c51994fff0c26","0x09a1e4b2bd4ff1220c4fceab673f7a68640747c80edea7cbe0d6f561889cbe83"]],"gamma":[["0x14dc464f674067060a58f6946abe5947e13a609baeaa46e915ed3d6d7dbd991","0x1d5eff77bea8d02a9f4b9460424f3178fa5ad7279f42893b0b07c5fc555e31d2"],["0x2c8f40ea8a3535644720dce1af35f2fb14f694e45de46ccb3b495b7718306b77","0x1cd683ce40d090b5a8cdb654881a1304afad1cf31d9f43c44510bc5aef60a294"]],"delta":[["0x00c5ec4562d15e637e43cebfd0a418448cca54d8c46088eb57bd5aab94db223d","0x175b8d29f186ebed1067b1c7188089f3779a795a8208d0f9e5c7c0ea2bfee232"],["0x082894122b868c47729f9219e27f64a91b32db995fec132aace5436186acf9cf","0x283e0eb19c0cc512c4c84d3c9109e45433f4f42ddcc5991c62ea488e8f3c179e"]],"gamma_abc":[["0x0b28e31b54701c06db06ca0e06ce09fcd1c3dfa348dc7644b4294ff97339c8ba","0x175c46c10fda6f1dd9f2838524adf231030e494e9d486f6b21816728465aab4f"],["0x20d040e26d847f85f5055e723070eae874abafb5799f02ac9f818c7ecf9194a1","0x2cf4c084d686f723324a27663a3bd4db1674f435e7f2c254401a012710f9d8ae"],["0x2a4cf74549b94e08bf0e8bc4b585de510ec0c4d83f3fd3b6d4f973157a098365","0x1d9e2df496d1373489509e3ad8b3216b29fb550ed8dc27223f229d5d4a944b8d"]]}',
      nullifier:
        "0xe284bae110402255ef9caa837085447884a5a271df538ba0ee71929308608e74",
    },
    signer
  );

  console.log(result);
};

const getVerifiersProof = async () => {
  const result = await traceClient.getVerifiersProof([
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  ]);

  console.log(await result);
};

const writeCar = async () => {
  let carData = {
    traceAddress: "",
    verifiersRoot: "",
    verifiers: ["0x12", "0x13", "0x14", "0x1122"],
    txDetails: {
      supplier: "0x112234eljfrlmdkhrk6",
      buyer: "0x2wdjnctr4ryjasn3kci",
    },
    previousBlockCid: "",
  };
  const result = await traceClient.writeCar(
    carData,
    "0x3BBF1bDfd68995301Ea893d712a5738201dcA736"
  );

  console.log(result);
};

const verifyMerkelProf = async () => {
  const result = await traceClient.verifyMerkelProof(
    [
      "0x00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0",
      "0x1ebaa930b8e9130423c183bf38b0564b0103180b7dad301013b18e59880541ae",
    ],
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    [
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    ]
  );

  console.log(result);
};

const checkNullifier = async (traceAddress, nullifier) => {
  const result = await traceClient.checkNullifier(traceAddress, nullifier);
  console.log(result);
};

const verifyByOrder = async (traceAddress, nullifier) => {
  const provider = new ethers.providers.JsonRpcProvider(
    `http://127.0.0.1:8545`
  );

  const wallet = new Wallet(verifier3key);

  const signer = wallet.connect(provider);
  const result = await traceClient.verifyByOrder(
    traceAddress,
    nullifier,
    signer
  );

  console.log(result.details.verifiedCount.toString());
};

const encryptData = async () => {
  const data = {
    message: "test",
  };
  const result = await traceClient.encryptData(data, "jlnecwnjklo2enkejxiue");
  console.log(result);
};

const encryptionDetails = async (traceAddress) => {
  const result = await traceClient.encryptionDetails(traceAddress);
  console.log(result);
};
//main();

//createCar();

//readCarData();

//uploadCar();

//updateCar();

//getVerifierProof();

//generateZKProof();

//verifyZkProof();

//getRand();

//getVerifiersDetails();

createTraceAgreement();

//acceptProposal("0x610D048cBeB90c9d09086d31A4A5c0ED15bbBc0D");

//init("0x610D048cBeB90c9d09086d31A4A5c0ED15bbBc0D");

//writeCar();

//createZkProof("0x610D048cBeB90c9d09086d31A4A5c0ED15bbBc0D");

//activateTraceAgreement("0x610D048cBeB90c9d09086d31A4A5c0ED15bbBc0D");

// verifyByOrder(
//   "0x610D048cBeB90c9d09086d31A4A5c0ED15bbBc0D",
//   "0x79e9de7c4098d57245063b79a2ac6fa576987c0419ebff9d6525ba8e437f4961"
// );

//getVerifiersProof();

//verifyMerkelProf();

// checkNullifier(
//   "0x3B853997e2376c0aE23D20a1832acaEA3955Ae36",
//   "0x343750465941b29921f50a28e0e43050e5e1c2611a3ea8d7fe1001090d5e1436"
// );

//encryptData();

//encryptionDetails("0x411fc24357ca3a3e7ed23f3ab97195d0f8eb13c1");
