const ZkTrace = require("zk-trace-sdk");

const traceClient = new ZkTrace({
  nodeEndpoint: "https://api.hyperspace.node.glif.io/rpc/v1",
});

const main = async () => {
  const data = await traceClient.readCid(
    "bafyreidlky6nmgbsj4xx67uzn2o4gf2ses5ncx5hyvorm74e2luehzghue"
  );

  console.log(data);
};

const createCar = async () => {
  let carData = {
    traceAddress: "0x123",
    verifiersRoot: "",
    verifiers: ["0x12", "0x13", "0x14", "0x1122"],
    txDetails: {
      supplier: "0x112234eljfrlmdkhrk6",
      buyer: "0x2wdjnctr4ryjasn3kci",
    },
    previousBlockCid: "",
  };
  const result = await traceClient.createCar(carData, "0x123");
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
  const result = await traceClient.generateZkProof(["25", "625"]);
  console.log(result);
};

const verifyZkProof = async () => {
  const result = await traceClient.verifyZkProof({
    proofBuffer:
      '{"scheme":"g16","curve":"bn128","proof":{"a":["0x031c58bb691ff9cc21c670b03ab8ddcf8a39c2c35363054688ca380a8620027a","0x080a5de3f51997b2c616874cf61dfbb5d20454fe377b2d0c3c8ddc96f6621289"],"b":[["0x11fa6f347491abfaf2659efe12567989ea144201fbfb3573762a03ef79bfc707","0x1260638ad9bc3c707696dabde99e440decd617cbd0b0ab49ecf4ae74ad721d02"],["0x222bee5f5faf339edc50df8832630633649cca6d7865495760fbe426f58ac57c","0x10fa34973e19851232fd6af907871be38d04a59f5f9ae6df4218a82ff46aa084"]],"c":["0x0dbd4c95afbbf14a8d2cbaddc663b61de1476f511206c37397eb037bf740b434","0x26714b702f9b788a0c984b6635896df943841ccaaeb523f414bd2b98207445e7"]},"inputs":[]}',
    verifierKeyBuffer:
      '{"scheme":"g16","curve":"bn128","alpha":["0x08c5b6bab6ed08ec159c34aa02d469b346bb0f291238078a6feffaab7d75ee01","0x1325f6fca12d307b8cd98e86be737f3a4d10e4aefe2eae33230311d2dd7cbe93"],"beta":[["0x0a4e3161cf6486656fde7387da916606aad4638a6dfb4c1cfe57d5ba621a4f37","0x1e0f8edb8c3182b365490b5e74a2fb6fa7f66dca47528e6317a3e846592c7d1d"],["0x0765efc3dc0c31def31caba116e86b6bb791866119d689959463c36ad29a8a22","0x2bf719de07579ce2344ea58313b3eabea3bc8042d81271a58ac5b4c6fe42ea6f"]],"gamma":[["0x2a0a1c75963ad7355fe4de2eed3be97362f9a32928b7d58814e11e56a99b22f3","0x18b28a61ead1641a370e029234d54c645daf8900eba03c87003dc25647569222"],["0x147f93af61507428bde40748c2881282f6e2b77356200b81ab73aee229bfdb53","0x0d26a16f6a53c024ae1317a4bc0a349cc38678f950c28564194da2e41ca47161"]],"delta":[["0x2e6f40095544b1f14e72cc86d194c551aaafa889d74bf78666aef8167cca1555","0x13b39842a8c69cd0a16ea55783809c886eca024356393ecf836c5cadbd94cf8d"],["0x225edb021925546d31f6bc9fe9e45eee792bc569c044f7855ecea611e30b4a3a","0x02e88fbb78a1fc248d7be07d7f2dc489814961ac06ac93751a3a444a5337c506"]],"gamma_abc":[["0x26f72d96203c1e91da0ca500c75f22d3beaafca2f8d6875f12f5593bb98cec5f","0x2b87dffbb0074dc48131ad8dce8c870e5970ecd9f436fa91e3437373b0887332"]]}',
  });

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
