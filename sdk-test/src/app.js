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
  factoryAddress: "0xc5a5C42992dECbae36851359345FE25997F5C42d",
  traceHubAddress: "0x09635F643e140090A9A8Dcd712eD6285858ceBef",
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

const acceptProposal = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    `http://127.0.0.1:8545`
  );

  const wallet = new Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  );

  const signer = wallet.connect(provider);

  const result = await traceClient.acceptProposal(
    "0xB26376d3529C4188ef279e51d7F1eAa8999F5A91",
    signer
  );
  console.log(result);
};

const init = async () => {
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
    "0xB26376d3529C4188ef279e51d7F1eAa8999F5A91",
    {
      message: "this is a test agreement",
    },
    signer
  );

  console.log(result);
};

const createZkProof = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    `http://127.0.0.1:8545`
  );

  const wallet = new Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  );

  const signer = wallet.connect(provider);

  const result = await traceClient.createZkProof(
    "0xB26376d3529C4188ef279e51d7F1eAa8999F5A91",
    signer
  );

  console.log(result);
};

const activateTraceAgreement = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    `http://127.0.0.1:8545`
  );

  const wallet = new Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  );

  const signer = wallet.connect(provider);

  const result = await traceClient.activateTraceAgreement(
    "0xB26376d3529C4188ef279e51d7F1eAa8999F5A91",
    {
      proofBuffer:
        '{"scheme":"g16","curve":"bn128","proof":{"a":["0x1d7fd281d9ecf22aa8fefd4cc6a8eaa3e3cd204083b56f88e7857f4b1e4b7cc5","0x05909ab722a7945e5628f2d28c4ef6bf7ac7406142ef51cc8f676ea7145900df"],"b":[["0x049e24a2c346aac15fb7b8bbf492a29fc56c70cd218b07370189aae5a613db00","0x0d8e793230e2d27a122313a297f6627013dbffe2f0b1a5ec8ae1a6cea6ef1896"],["0x1ddf92d8889933b0664c88c15cc178294d59381e1d4e28c4323d01e79ba4b801","0x0daead5099daefe288b7eb73652bd71e2869bd2a9de2316900ee633db05a47fc"]],"c":["0x099f8d99affe68de744a85bf854a83423447d697908b6a9c8983da1a21f72a56","0x1a8d3d75ebafef695ccaf6a0aec8f290ad882873ff274ec909c819e7832a70a0"]},"inputs":["0x0000000000000000000000000000000030f26133059f3d678fe1c9e275b71c6f","0x00000000000000000000000000000000a1edd2b9ad65f15886c96aaca65fadde"]}',
      verifierKeyBuffer:
        '{"scheme":"g16","curve":"bn128","alpha":["0x0aec87f4d1a772f7a9b59e637a6fbd29a13aa199b23ca3afaefa93826d6e5187","0x109e3ef24738bf23dcd6c31cc3f4e7f13785e542a12125706832f87dc388e812"],"beta":[["0x10235a9d0dfb8f31789601bc510225a220762b9dbac731ba85ba88bfaf04ad62","0x0179fd27609f614033effcc597b2ab23a81cb3ee6d0ccaab4269f1467a5458d1"],["0x092185cb70cbebb3b0a232ac1d716d616f1e16f61912ad4c99454bc584adc2fb","0x175dbd07be5a9401fed645694831e3715c24de68e237bc6279a6fbb2c0690535"]],"gamma":[["0x1d8157d765cb325c1b15c0315ee10b201c4753a67f69b9ade5a9e6b7249b57bc","0x029b8ee0f647ba45459cd8030708cbc4a189a34fafeba0f40cb596cb10295c79"],["0x0abd4cb7ccd6f1f42ee7a7b9f18409470206ab78e7f59a59f1df1f72cc028df3","0x2127681452fcc46c1eef153c06722f935ac42f42d23046e3cf16e7c2a77facd2"]],"delta":[["0x0d0bbe694476b7c46499c0ddfc0bcf987c97d27ee6984e5028a517ebef5aa0a6","0x10a5d63a00d123a05de1036d3ae7cb4cfb87ead79cb8c6953cd558e65f0ea7ab"],["0x27e5437a5b4b64b11ddf1dbaa82e21f8a5a74ae6496e671982e7fda31a752c70","0x0c13aff7e8055f593dbe08039f4a0360156e8b977c12c26d3e7246851c4987fa"]],"gamma_abc":[["0x27437787a54fe3b29aa7a9e533539a4eb18034b56a92a49c770ba31127af0188","0x1e25e46baf75cbca8b51b1e53c63b96821d6e575ed9e256f9d57fcab7573a70e"],["0x038d9984facbbcc9a3f9b9ae61945e23e6107f57cda3a64eda7977e54c9a01d8","0x116522b32903a998614a54407543f33d6efbd732f089202992e2f60a1049b602"],["0x0d70562f4f421d466b2afbebef082d0a9ae3e8eeb4f1e34eb207b4023e8ba4d3","0x19313aed50bb7521c8768f574c6aab7ed62153945fd695c6dd278d4f63d679f9"]]}',
      nullifier:
        "0x50966b0fd01029f8e6527916b6c8ebaa2eef21f9cc3b94f57e15ac53ef1e2fb4",
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

//acceptProposal();

//init();

//writeCar();

//createZkProof();

//activateTraceAgreement();

//getVerifiersProof();
