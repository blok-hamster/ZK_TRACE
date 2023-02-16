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
  factoryAddress: "0xBEc49fA140aCaA83533fB00A2BB19bDdd0290f25",
  traceHubAddress: "0x4EE6eCAD1c2Dae9f525404De8555724e3c35d07B",
  web3storageApiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZlOTA3MkJhNDkwZTZhNTE1NzE2MjBDMDFEMDIzNTA2ZTUzNkQ1NTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTY4OTMwNDEyNDQsIm5hbWUiOiJwaWNhcmR5X3Byb2ZpbGUifQ.d6_elcpPQfa69XyTHpp_iEvMbAMjoAkba5OFYJv28Xk",
});

const main = async () => {
  const data = await traceClient.readData(
    "bafyreidfxlikkwv42bobiyv7fi5x4kespo4lhf7ov6zu65yoivwffjfzq4"
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
  const result = await traceClient.generateZkProof("2kh2evubsjaejhlei");
  //console.log(typeof result);
  console.log(result);
};

const verifyZkProof = async () => {
  const result = await traceClient.verifyZkProof({
    proofBuffer:
      '{"scheme":"g16","curve":"bn128","proof":{"a":["0x1d7fd281d9ecf22aa8fefd4cc6a8eaa3e3cd204083b56f88e7857f4b1e4b7cc5","0x05909ab722a7945e5628f2d28c4ef6bf7ac7406142ef51cc8f676ea7145900df"],"b":[["0x049e24a2c346aac15fb7b8bbf492a29fc56c70cd218b07370189aae5a613db00","0x0d8e793230e2d27a122313a297f6627013dbffe2f0b1a5ec8ae1a6cea6ef1896"],["0x1ddf92d8889933b0664c88c15cc178294d59381e1d4e28c4323d01e79ba4b801","0x0daead5099daefe288b7eb73652bd71e2869bd2a9de2316900ee633db05a47fc"]],"c":["0x099f8d99affe68de744a85bf854a83423447d697908b6a9c8983da1a21f72a56","0x1a8d3d75ebafef695ccaf6a0aec8f290ad882873ff274ec909c819e7832a70a0"]},"inputs":["0x0000000000000000000000000000000030f26133059f3d678fe1c9e275b71c6f","0x00000000000000000000000000000000a1edd2b9ad65f15886c96aaca65fadde"]}',
    verifierKeyBuffer:
      '{"scheme":"g16","curve":"bn128","alpha":["0x0aec87f4d1a772f7a9b59e637a6fbd29a13aa199b23ca3afaefa93826d6e5187","0x109e3ef24738bf23dcd6c31cc3f4e7f13785e542a12125706832f87dc388e812"],"beta":[["0x10235a9d0dfb8f31789601bc510225a220762b9dbac731ba85ba88bfaf04ad62","0x0179fd27609f614033effcc597b2ab23a81cb3ee6d0ccaab4269f1467a5458d1"],["0x092185cb70cbebb3b0a232ac1d716d616f1e16f61912ad4c99454bc584adc2fb","0x175dbd07be5a9401fed645694831e3715c24de68e237bc6279a6fbb2c0690535"]],"gamma":[["0x1d8157d765cb325c1b15c0315ee10b201c4753a67f69b9ade5a9e6b7249b57bc","0x029b8ee0f647ba45459cd8030708cbc4a189a34fafeba0f40cb596cb10295c79"],["0x0abd4cb7ccd6f1f42ee7a7b9f18409470206ab78e7f59a59f1df1f72cc028df3","0x2127681452fcc46c1eef153c06722f935ac42f42d23046e3cf16e7c2a77facd2"]],"delta":[["0x0d0bbe694476b7c46499c0ddfc0bcf987c97d27ee6984e5028a517ebef5aa0a6","0x10a5d63a00d123a05de1036d3ae7cb4cfb87ead79cb8c6953cd558e65f0ea7ab"],["0x27e5437a5b4b64b11ddf1dbaa82e21f8a5a74ae6496e671982e7fda31a752c70","0x0c13aff7e8055f593dbe08039f4a0360156e8b977c12c26d3e7246851c4987fa"]],"gamma_abc":[["0x27437787a54fe3b29aa7a9e533539a4eb18034b56a92a49c770ba31127af0188","0x1e25e46baf75cbca8b51b1e53c63b96821d6e575ed9e256f9d57fcab7573a70e"],["0x038d9984facbbcc9a3f9b9ae61945e23e6107f57cda3a64eda7977e54c9a01d8","0x116522b32903a998614a54407543f33d6efbd732f089202992e2f60a1049b602"],["0x0d70562f4f421d466b2afbebef082d0a9ae3e8eeb4f1e34eb207b4023e8ba4d3","0x19313aed50bb7521c8768f574c6aab7ed62153945fd695c6dd278d4f63d679f9"]]}',
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
        '{"scheme":"g16","curve":"bn128","proof":{"a":["0x238337005821ee2cbd4a79e7606e0e6eac28c92caeb6f24fa19a758f7677797e","0x19c5032e4014160f58dfef3b4d6a4c20118c7a5bf6acd4e57ffdfb28206c647d"],"b":[["0x036334590f3a151d81f0fbd249f29140b5a8393f4b747bbb7a79c60292e38dd3","0x046c33ba1748a1b32bcd5484a16b6c58415bc84ec22c1ad4a14eab5934a23a2e"],["0x25cd57fde39f74e9000c26c1fd07200726d8d6fc8e936c62eda34d385fc6cdf5","0x0a9526b980e0c33428ed803ed69a50e048bcbdd0d033108e96851c03f029a5b8"]],"c":["0x2965b53f4b95c534e3352754060ef2601d943fcc568400ab6a6e97d01b40f580","0x1e185f70a2b5dde68a00590c2228561dfe48b95c2687887a33f65ab281f64801"]},"inputs":["0x00000000000000000000000000000000a527bdfda55f91477c389a8b6d52a910","0x000000000000000000000000000000007c0f2b563d068ab1b5976dd4ca982bb4"]}',
      verifierKeyBuffer:
        '{"scheme":"g16","curve":"bn128","alpha":["0x1d6877c6b50d19e4f050b51975c0849c45c6607a9c1a111b438ee5fdfdffc5e6","0x1feae3887326d0ce8ee61a223925cb4e47c9e7097db1673f56c85a993cedba2f"],"beta":[["0x1fc930b97a4cd5347f17dd09b30333636320f524db3516c1a7c35d7d1f4ced90","0x0a96e230d044f2b614c6f48d37054c18be545f3e33e1929435e3bc99505ef2df"],["0x0e599a92acb177be154d3adc329b24820b4b7d5cb1c968a4646f8ee144828c59","0x1b6c40763a36f6e7a4ecce71ca8a3b883e6769df9c0a2d6bffb3b6682bb56280"]],"gamma":[["0x1de523c88ce8d5f6b008fe5181cb3fdd83490affe814c66dc45fb7947764de5e","0x1d4cc2b2e3c78b2b0676624f5c5c4649fa7d1e700650f093381856498e4f008d"],["0x100edd5f4836b5cd415d29adba76d61eb253819cbe604bf929e19b0bf91f6f7e","0x13372bba36211a23f9f00af61c0e8e7fa7706a0d2ba7442fb30626e5f1266676"]],"delta":[["0x245b32648a8cb96057e51d79e9575ea22a5262da1249cf53b9afb3be37b350e3","0x2eb149b04ee5c81e9dd71d4d38c00add9b2a4cf74b023bf35df23f70a91ff919"],["0x031fc8c60695d97703e5506948d05a61997e61cf18e2cec21961e55cb4840f8c","0x20dc0be4a164810f90ab99fa15c96930a72a2561fc62e54198688a28259a8e80"]],"gamma_abc":[["0x1b7562f23c6614104e2c452fa3ac44cad45c85d589487efbdd5cd9b4e24e3909","0x28225ccc744bc4cada349e800f30cf7ab6a94dd239d69b8b8fa1c666cd019f52"],["0x002ea999f94c6aef116a70bf182040d2d2b4b12593d866770cdff6b54177c4a4","0x13914275d7e02502d7841a9017c376a8f3f12b48d97a4280cef5103bebdf3831"],["0x1590d251e3200c9761183e71a40dc35b6450557b3b4c99558f54fe285e130c11","0x14070e48c352b97313a99c39b671497ed9ec99adffe3e1cb6c8dcd7cb9d94b84"]]}',
      nullifier:
        "0xa3acdbea68a65e6accc18c8909803db35c281b78d86320e25f6307889d4baddc",
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

const verifyByOrder = async (traceAddress, proof, nullifier) => {
  const provider = new ethers.providers.JsonRpcProvider(
    `http://127.0.0.1:8545`
  );

  const wallet = new Wallet(verifier3key);

  const signer = wallet.connect(provider);
  const result = await traceClient.verifyByOrder(
    traceAddress,
    proof,
    nullifier,
    signer
  );

  console.log(result.details.verifiedCount.toString());
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

//createTraceAgreement();

//acceptProposal("0x3B853997e2376c0aE23D20a1832acaEA3955Ae36");

//init("0x3B853997e2376c0aE23D20a1832acaEA3955Ae36");

//writeCar();

//createZkProof("0x3B853997e2376c0aE23D20a1832acaEA3955Ae36");

//activateTraceAgreement("0x3B853997e2376c0aE23D20a1832acaEA3955Ae36");

// verifyByOrder(
//   "0x3B853997e2376c0aE23D20a1832acaEA3955Ae36",
//   ["0x343750465941b29921f50a28e0e43050e5e1c2611a3ea8d7fe1001090d5e1436"],
//   "0x28d26f9eb862456054139fea3778dafe80cdbf35d29a8d57c8f43f15e8e8d51e"
// );

//getVerifiersProof();

//verifyMerkelProf();

// checkNullifier(
//   "0x3B853997e2376c0aE23D20a1832acaEA3955Ae36",
//   "0x343750465941b29921f50a28e0e43050e5e1c2611a3ea8d7fe1001090d5e1436"
// );
