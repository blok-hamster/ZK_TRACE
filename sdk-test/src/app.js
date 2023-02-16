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
  factoryAddress: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
  traceHubAddress: "0x0B306BF915C4d645ff596e518fAf3F9669b97016",
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
        '{"scheme":"g16","curve":"bn128","proof":{"a":["0x00becdf6cfe7f7cbf6026b5c22762bdd6d44ae76cecd13fa7123ff6f269276e5","0x237aaee5f3fea710a9e65a91b260085a98893c5354cbb7e45b0569f04202edc1"],"b":[["0x0f85cc63d45050c1a9f8f7dfa739a7ba0e4659853dd63eb81fa8bd057f2b326c","0x290e8c150b5322c4fac3886b968e99d007926a19596df92661f2e8a466bb1816"],["0x105d7a7aff31099f07c3ad4c7c0d1479355942b9a35f4aa62bf46dd9be245588","0x128a3f363ee30a695d883a6c0306741cc1a52c20a4ac91d5edb94801f23580ec"]],"c":["0x2b14fe4a432e266487ee60fa0b2fe0940c15cda99f22b4c523276c1ede8ad5fa","0x0cf28baa908723c64f50b3c2e82533b02cc8976a887a9d6ed11b4dc4d0fdf1e0"]},"inputs":["0x00000000000000000000000000000000d72244db9ac411a157043ecae532605b","0x000000000000000000000000000000009e00b3d39ab3d112043883cba5ee922e"]}',
      verifierKeyBuffer:
        '{"scheme":"g16","curve":"bn128","alpha":["0x03f346c2d2a8e78bc19475966f41d876dbd8ec4112dad79f7182c53fdd1c6566","0x03387021b7e5e1d4847fab3841e22e095625b1e7ab739867e16afc707293d8af"],"beta":[["0x1ee1385c8898cef1962573570c8444e67d6b0c48c2ae794964a4c2f941958f32","0x27ea28ff3e9731aa7992d0a5f1f66e0aeffa71b014ff49310f8ca349bf71cd2f"],["0x058e5988de237923e6304fc0a8584060cf729f8bdc588fec89c81141d4776236","0x1d9b41036870c887b9c8809f8d6bd3d4ae03820b62f4c0176e09c78438c17102"]],"gamma":[["0x16d1f7277a2ba10aa1065db55f93332bfa42b174971cc8ad674d16769e4c41e4","0x1eae8aa3af13b4fc5e2be48139c38df3cf8f318d8f8f012041ee48dc766f04df"],["0x22f27276a46dae84fa2c1379109fc228dc15c53268be70e2867178a54f32c185","0x2f75f5643f4c43131a5e251f720c0211d2323b4feaebf4c32b90bb0a5582d1f0"]],"delta":[["0x0d2cb24119206d2e025fe21bea4d8341e0fe45f02f6d77e8736799e5c7617a2f","0x1bd9bc6633208d3f2882afc700449eaf9fcbf3697dfa0bf13ef5be39718320a2"],["0x05acb45252419c3b3bbe182acc94f6d3d26a2f6b046dbd638d5736d170c48611","0x2d50e82d691067fa94fdda1759c10170dc71f52fec9b46d91227d6a2afecaf49"]],"gamma_abc":[["0x2f3e1af9dc3d46b1b25595ee56cea7a990a51b56c0fd89fc9ce455cd907dca2e","0x091ea30e294b16db038d343e1a877ce2306e8fdb13d242d88c23bf802096a2d1"],["0x2fe20ffe1699cd433b4a211eb63057ac4817d5e525269d072c4cfa5733d2d5cb","0x174cd950adcfa404bf08a63ae20c844c80dc7528ddb03305bb0a4ff9202a971b"],["0x26d943ae62ff05dc0311b492be1d53bc2b5ed071e4d5112d30ed11fe1dc00e9b","0x15822fb1b615ab88834c95c16f9cd3ffc7810609f937a6c9fc87dee56d7d92eb"]]}',
      nullifier:
        "0x52bb3cd72903d82f3eb8f75e8f8686176fefd7b05fd537d6dbef522b596135db",
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

const verifyByOrder = async (traceAddress, proof, nullifier) => {
  const provider = new ethers.providers.JsonRpcProvider(
    `http://127.0.0.1:8545`
  );

  const wallet = new Wallet(verifier1key);

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

//acceptProposal("0xbc4687BFc037B3a42C14De6Aad558A4b927546e6");

//init("0xbc4687BFc037B3a42C14De6Aad558A4b927546e6");

//writeCar();

//createZkProof("0xbc4687BFc037B3a42C14De6Aad558A4b927546e6");

//activateTraceAgreement("0xbc4687BFc037B3a42C14De6Aad558A4b927546e6");

verifyByOrder(
  "0xbc4687BFc037B3a42C14De6Aad558A4b927546e6",
  [
    "0x00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0",
    "0x1ebaa930b8e9130423c183bf38b0564b0103180b7dad301013b18e59880541ae",
  ],
  "0x44408614cbec39c6fe6cce215e68e0828b961047bc1f4f54e5bd5a56f2cd480b"
);

//getVerifiersProof();

//verifyMerkelProf();
