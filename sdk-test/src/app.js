const ZkTrace = require("zk-trace-sdk");

const traceClient = new ZkTrace({
  nodeEndpoint: "https://api.hyperspace.node.glif.io/rpc/v1",
});

const main = async () => {
  const data = await traceClient.readCid(
    "bafyreihnj6f72yj6vypmwooymwwl72jbncaogr7ddtkqx66tfafva3ghca"
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
  const result = await traceClient.createCar(carData);
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

//main();

//createCar();

//readCarData();

//uploadCar();

//updateCar();
