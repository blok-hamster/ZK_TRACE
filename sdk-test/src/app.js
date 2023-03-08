import ZkTrace from "zk-trace-sdk";
import { ethers, Wallet } from "ethers";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import promptly from "promptly";
import dotenv from "dotenv";

dotenv.config();

//0x70997970C51812dc3A010C7d01b50e0d17dc79C8 verifier1
//0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC verifier2

const verifier1key =
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const verifier2key =
  "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
const verifier3key =
  "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6";

const traceClient = new ZkTrace({
  nodeEndpoint: process.env.QUICK_NODE_RPC,
  factoryAddress: "0x9A676e781A523b5d0C0e43731313A708CB607508",
  traceHubAddress: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
  web3storageApiKey: process.env.WEB3_STORAGE_KEY,
});

const main = async () => {
  (async () => {
    const func = await promptly.choose("Select Trace Protocol Function: ", [
      "createTraceAgreement",
      "acceptProposal",
      "initTraceAgreement",
      "createZkProof",
      "activateTraceAgreement",
      "verifyByOrder",
    ]);

    if (func === "createTraceAgreement") {
      createTraceAgreement();
    } else if (func === "acceptProposal") {
      acceptProposal();
    } else if (func === "initTraceAgreement") {
      init();
    } else if (func === "createZkProof") {
      createZkProof();
    } else if (func === "activateTraceAgreement") {
      activateTraceAgreement();
    } else if (func === "verifyByOrder") {
      verifyByOrder();
    }
  })();
};

const createTraceAgreement = async () => {
  (async () => {
    if (!existsSync("./traceDetails")) {
      mkdirSync("./traceDetails");
    }

    let privacy;
    const admin = await promptly.prompt("Enter Trace Admin Address: ");
    const supplier = await promptly.prompt("Enter Suppliers Address: ");
    const dataAvai = await promptly.choose("choose trace data privacy: ", [
      "Public",
      "Private",
    ]);

    if (dataAvai === "Public") {
      privacy = 1;
    } else if (dataAvai === "Private") {
      privacy = 2;
    }

    const provider = new ethers.providers.JsonRpcProvider(
      `http://127.0.0.1:8545`
    );

    const wallet = new Wallet(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    );

    const signer = wallet.connect(provider);

    const result = await traceClient.createTraceAgreement(
      admin,
      supplier,
      privacy,
      signer
    );

    writeFileSync(
      "traceDetails" + "/traceAgreement.json",
      JSON.stringify(result),
      (err) => {
        console.log(err);
      }
    );

    console.log("................................................");
    console.log("............Creating Trace Agreement............");
    console.log("................................................");

    console.log("");
    console.log("");

    console.log("Trace Agreement Address: ", result.details.agreementAddress);
    console.log("Transaction Hash: ", result.transactionHash);
  })();
};

const acceptProposal = async () => {
  (async () => {
    const traceAddress = await promptly.prompt(
      "Enter Trace Agreement Address: "
    );
    const provider = new ethers.providers.JsonRpcProvider(
      `http://127.0.0.1:8545`
    );

    const wallet = new Wallet(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    );

    const signer = wallet.connect(provider);

    const result = await traceClient.acceptProposal(traceAddress, signer);

    console.log(".....................................................");
    console.log("............ Supplier Approved Agreement ............");
    console.log(".....................................................");

    console.log(result);
  })();
};

const init = async () => {
  (async () => {
    const traceAddress = await promptly.prompt(
      "Enter Trace Agreement Address: "
    );
    const verifiers = await promptly.prompt(
      "Paste trace agreement verifiers address: "
    );

    console.log("....................................................");
    console.log("............ Initilizing TraceAgreement ............");
    console.log("....................................................");

    const _verifier = verifiers.split(" ");

    const provider = new ethers.providers.JsonRpcProvider(
      `http://127.0.0.1:8545`
    );

    const wallet = new Wallet(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    );

    const signer = wallet.connect(provider);

    const result = await traceClient.initilizeAgreement(
      _verifier,
      traceAddress,
      {
        message: "this is a test agreement",
      },
      signer
    );

    writeFileSync(
      "traceDetails" + "/initAgreementDetails.json",
      JSON.stringify(result),
      (err) => {
        console.log(err);
      }
    );

    console.log("");
    console.log("");
    console.log("");
    console.log("");
    console.log("Transaction Hash: ", result.transactionHash);
    console.log(
      `Trace agreement details saved in:  ${
        "./traceDetails" + "/initAgreementDetails.json"
      }`
    );
  })();
};

const createZkProof = async () => {
  (async () => {
    const traceAddress = await promptly.prompt(
      "Enter Trace Agreement Address: "
    );
    const proofdetails = await promptly.prompt("Enter ZK Proof credentials: ");
    const provider = new ethers.providers.JsonRpcProvider(
      `http://127.0.0.1:8545`
    );

    const wallet = new Wallet(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    );

    console.log("");
    console.log("");

    console.log("......................................................");
    console.log("............ Creating ZeroKnowledge Proof ............");
    console.log("......................................................");

    const signer = wallet.connect(provider);
    const result = await traceClient.createZkProof(
      traceAddress,
      proofdetails,
      signer
    );

    writeFileSync(
      "traceDetails" + "/zkProof.json",
      JSON.stringify(result),
      (err) => {
        console.log(err);
      }
    );

    console.log("");
    console.log("");
    console.log("Zk Proof created");
  })();
};

const activateTraceAgreement = async () => {
  (async () => {
    const traceAddress = await promptly.prompt(
      "Enter Trace Agreement Address: "
    );

    const nullifier = await promptly.password("Enter nullifier", {
      replace: "*",
    });

    const proof = {
      proofBuffer:
        '{"scheme":"g16","curve":"bn128","proof":{"a":["0x138e48b3c5172f7981e76e9eba69b1ad8d965afeec6a699b64dd065d68e0a936","0x0234e8338e01c1cc7bb3eab74dd65234a26e663d99a17b466a4424b1227afc1d"],"b":[["0x1411e7539de6baa28df88c81dc990d94a5880b80669d1ba948336bb6705ed5fe","0x2ecc4bba8bb23634c7bdf3ca201a7d78e7547ca3734ead8cc6a85af6933269fd"],["0x14bfee5f6f39e963439d48823a6ac7d144e5603d4473e8656ccd163f20c19599","0x0ba8d5cb97211569673b3a9d3202d9d31bfe9e462077b3ba9a2c7c5149da03b3"]],"c":["0x29f970b7998ee6e91c35d7c85676053e94528d6ed210d577b6b6bfc535d2fa49","0x0743454c25779aa2703ad907a1628ea1d8ab469d740c5fc2f1bb641134a8e3d6"]},"inputs":["0x00000000000000000000000000000000690564384f980ed1d3e8271880eae9bc","0x00000000000000000000000000000000b8815c267fed8e427c14f48507caea96"]}',
      verifierKeyBuffer:
        '{"scheme":"g16","curve":"bn128","alpha":["0x2e234ecba944fa6b9339238c0848f88f879890e227582e59482016631c3d68d8","0x22a52b98f5e7f6171b8b73d6562f4f42aa2596ec310456d59fcfeaf3f6c99afa"],"beta":[["0x21ced8df190652c6dd5b2700a17d1d18c6560f46d1427772e48486ca1ccc3262","0x029a9cf9e7db605313cce38589b5fb2f9487da84209880ac5369a962bfa1fb1a"],["0x238ffabeebabd16da5f8b773b040113c050aa3ea77e71063945c6f57d1b8955e","0x10f7a23628a3bfdd136be699224ed596ce5e2f644ac541037d98deb9abcf81ce"]],"gamma":[["0x00b69c7b9be4470e8432bddf033b1bdc67524ff887bf61c6aa07f7599a3544f1","0x11d6bf35680f65ae6743dcb07ba0884c1f8bcff3d53b28900eef46d4aba3095b"],["0x15054378e3fd99b2fe202cf103a9c68ecf05c6cb51449d6826a6a11b15d9403f","0x2925c9047e491c659732f1ffab1fefb577d3661e2bab71fa0387f0f7564ea831"]],"delta":[["0x276f048d84cfba6d130ec8669164e34ac829bb219a9719ef21660bb7d11105a6","0x1428008bfd576138a0765f5be1ebd60f7e13e89c66a0a808f65f5acf1f6e9f6e"],["0x17fe07125ff6e36c4f37e187e24c4545bd97751fbae14ba9ee673c34674ad83e","0x0046eb81a5f11a4248beb7ce87a75de5be0e44eab67266c366c61e29efdfa48f"]],"gamma_abc":[["0x0e9fb34e52686aeaa97719bdc2df1a3e7932f7dd58c6f47a76f17bba36a6a478","0x2cda0b68bd769edff0035cf9c3048ea2d596009eb12ca6ccc2fae7faae0a5bf5"],["0x0878eae259cdb2bf7d32fcdc1ce9ab5eb56ce3029175d93f2dbb3028d4c9d790","0x0cf7836237fd6a31c3b7195d649ab5d38779b2dac47cd941e86d440b3b8cc68c"],["0x02bb5032d92b409eff29e341b2b0f5ec53753b4376515bd12ad020353358de18","0x0badccd3cecb4dcd5914fac3f5ed737bc7c01bc00ae18eb84d1ddeb2d3a75b15"]]}',
      nullifier: nullifier,
    };

    const provider = new ethers.providers.JsonRpcProvider(
      `http://127.0.0.1:8545`
    );

    const wallet = new Wallet(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    );

    const signer = wallet.connect(provider);

    console.log(".......................................................");
    console.log(".............. Activating TraceAgreement ..............");
    console.log(".......................................................");

    const result = await traceClient.activateTraceAgreement(
      traceAddress,
      proof,
      signer
    );

    if (result.message === "ok") {
      console.log("");
      console.log("");
      console.log("Trace Agreement activated");
    }
  })();
};

const verifyByOrder = async () => {
  (async () => {
    const traceAddress = await promptly.prompt(
      "Enter Trace Agreement Address: "
    );
    const nullifier = await promptly.prompt("Enter Valid Nullifier: ");

    const key = await promptly.password(
      "Enter TraceAgreement IPLD decryption Key:",
      { replace: "*" }
    );

    const verifier = await promptly.choose("Choose which verifier you are: ", [
      "first",
      "second",
      "third",
    ]);

    const provider = new ethers.providers.JsonRpcProvider(
      `http://127.0.0.1:8545`
    );

    let verifierKey;

    if (verifier === "first") {
      verifierKey = verifier1key;
    } else if (verifier === "second") {
      verifierKey = verifier2key;
    } else if (verifier === "third") {
      verifierKey = verifier3key;
    }

    const wallet = new Wallet(verifierKey);

    const signer = wallet.connect(provider);

    console.log(".......................................................");
    console.log(
      `.............. verifying ${verifier} TraceAgreement ..............`
    );
    console.log(".......................................................");

    const result = await traceClient.verifyByOrder(
      traceAddress,
      nullifier,
      key,
      signer
    );

    console.log("");
    console.log("");
    console.log("Verified Count: ", result.details.verifiedCount.toString());
  })();
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
