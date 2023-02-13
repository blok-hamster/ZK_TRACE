import ZkTrace from "zk-trace-sdk";

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
  const result = await traceClient.generateZkProof1("2kh2evubsjaejhlei");
  //console.log(typeof result);
  console.log(result);
};

const verifyZkProof = async () => {
  const result = await traceClient.verifyZkProof({
    proofBuffer:
      '{"scheme":"g16","curve":"bn128","proof":{"a":["0x2d4f1feb664ad9cc6f67e92bcd7e2798d7e7bc0e141ec39a5c6c99e41b3438f9","0x27b67214fbcc26b3b53dbb604c66961232a61a90124b28aa1ef8ff3273aeb2a9"],"b":[["0x2690b4096df4025aa4042dc82571f8c930dee55c2b1550debfbdbd1fdc4c206d","0x26de60fb9beab4943bebe497dbf03b0473c339c4123023f0b63c2f2afd0eec5e"],["0x1d82704655a45d8eec5bbee5981d25a8ecb4e8b055603401646ef67d92ea7a2b","0x0ff7fce44005f74cb2fae6fea17a0481d0e1128ab8ae4c2f5097c5b8695a9e6b"]],"c":["0x0e33e2c5b3c5d71e8c880aa23657894838fffa8166643d444ad8ba49bb62186b","0x1ddcd26136f11e9db70b740f2c04465b59ad9f25cc1ce44dcad4a3c4e8d9386f"]},"inputs":["0x000000000000000000000000000000008c60f771ec4133a6f9d8c8eab1a4b991","0x00000000000000000000000000000000f0ba7e69edd3c33bbcaee7e5f1a543ef"]}',
    verifierKeyBuffer:
      '{"scheme":"g16","curve":"bn128","alpha":["0x1e569b8587b0bee518f3da30a337f2a65c30e3a092e4bba74efaab3ca65ca193","0x1bed9edc607d37670af3e26067ed72c531d9fb4161d734eda177519f3ef6924c"],"beta":[["0x2c30d6524a7cc3ee81f4d3426f20e3060d864b0add6a2f9e98fc61a3f81d9080","0x07e2504067933726cf366dd4ad4bba8eb2d7b0fb13cf6a6153c95ee87516c21a"],["0x20405ce4cb4faf9deff8cb32ec5ffb08860e995c0f26cc314af906824f4e42a8","0x251e9072df9d90f758b84c99bd67db942cfaccfb2ff74efbd3fb8eda823f2e57"]],"gamma":[["0x2b11aed691e3c25771ba2f4a7a111c1c36e0b4f2c83889196564d8e2b8b9000c","0x29e87588a857278ac265a9f12fe524b0322dc1ff410aeecbdd081407c14328de"],["0x01c753c733576591e92121751b8ee5444a041418ee415811709b541597d5016f","0x0c56bd3ac60a3bd314c7b2e77541922ab63b69dba01abe8648799d4eeb02d074"]],"delta":[["0x253c7421fd8fac503a098460021263143325e1491342f3c2f1db6962bed9c34d","0x29911864d1376e13c54844e7492a1701b4a2af21ec202837357679656c279d6c"],["0x0aeb2660697d7e58735a753e9537d098b9327b80fc94a817aa9eb794fb3d9ffd","0x26eb9aa330be357368033380fa8f22547fb1fb85f45f2d46a1aa4eb0502cbbf7"]],"gamma_abc":[["0x0fedbaddeb8f4365ddaf20b83162210209effe005e426acec0a984165093abd4","0x2670e71416a3f94f0c6f85e55ec0e7ea45eba83824165f0cb3b214602e7557cf"],["0x2f0748b409fe959d333851abe791caf23e52b9927bfb40199b7b1fef18cbf2b8","0x0c414e203801b3fbe3883eea14e33f15efe1fac4c6108ee82c4e2959c8634541"],["0x164845a138edbf16b11972c62d3651b6c9404c8a75a411d150d8a097ece896bf","0x19c155e811d8fc1953b0379a139d03c76dbeaf61aaf31ab96398f34442ea6b47"]]}',
  });

  console.log(result);
};

const getRand = async () => {
  const rnd = await traceClient.randomNumber("2kh2evubsjaejhlei");
  console.log(await rnd);
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
