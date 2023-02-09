const ZkTrace = require("zk-trace-sdk");

const main = async () => {
  const traceClient = await new ZkTrace({
    nodeEndpoint: "https://api.hyperspace.node.glif.io/rpc/v1",
  });
  const data = await traceClient.readCid(
    "bafyreihcjv7n6abajmzzjrwez4in4jbvt2naz3n7pqtdpz7bzwolicu5ci"
  );

  console.log(data);
};

main();
