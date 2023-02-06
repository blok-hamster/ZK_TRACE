import express from "express";
const router = express.Router();
import dotenv from "dotenv";
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
dotenv.config();

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { initialize } from "zokrates-js";

router
  .route(`/generateProof`, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .post(async (req, res) => {
    const input = req.body.input;
    const proof = await generateProof(input);
    res.status(200).json({
      message: "Zk proof generated",
      proof: proof,
    });
  });

router
  .route(`/verifyProof`, {
    headers: {
      "Content-Type":
        "application/json, text/plain, */*, multipart/form-data, application/x-www-form-urlencoded,",
    },
  })
  .get(async (req, res) => {
    const proofDetails = req.body;
    console.log(proofDetails);
    const zkP = proofDetails.proofBuffer;
    const vk = proofDetails.verifierKeyBuffer;

    // console.log("proof", zkP);
    // console.log("vk", vk);

    const proof = JSON.parse(zkP);
    const verifierKey = JSON.parse(vk);

    const isVerified = await verifyProof(proof, verifierKey);
    if (isVerified) {
      res.status(200).json({ message: "Proof Verified", verified: 1 });
    } else {
      res.json({ message: "invalid Proof Provided", verified: 0 });
    }
  });

const from = "../circuit";
const to = "server/circuit/root.zok";

const fileSystemResolver = () => {
  const location = resolve(dirname(resolve(from)), to);
  const source = readFileSync(location).toString();
  return source;
};

const getZokrateProvider = async () => {
  const zokratesProvider = await initialize();
  return zokratesProvider;
};

const getArtifacts = async () => {
  const source = fileSystemResolver();
  const zokratesProvider = await getZokrateProvider();
  const artifacts = zokratesProvider.compile(source);
  return artifacts;
};

// @ts-ignore
const verifyProof = async (proof, verifierKey) => {
  try {
    const zokratesProvider = await getZokrateProvider();
    const isVerified = zokratesProvider.verify(verifierKey, proof);
    console.log(isVerified);
    return isVerified;
  } catch (error) {
    console.log(error);
  }
};

// @ts-ignore
const exportVerifier = async (verifyKey) => {
  try {
    if (!existsSync("./contract")) {
      mkdirSync("./contract");
    }
    const path = "./contract/Verifier.sol";

    const zokratesProvider = await getZokrateProvider();
    const verifier = zokratesProvider.exportSolidityVerifier(verifyKey);

    writeFileSync(path, verifier);

    console.log(`Verifier contract is exported to ${path}`);
    return verifier;
  } catch (error) {
    console.log(error);
  }
};

// @ts-ignore
const generateProof = async (params) => {
  try {
    const zokratesProvider = await getZokrateProvider();
    const artifacts = await getArtifacts();

    /**
     * @params is always an array of strings
     */
    // @ts-ignore
    const { witness, output } = zokratesProvider.computeWitness(
      artifacts,
      params
    );

    /**
     * @dev this runs the setup ceremoney for the prover and verifier keys
     */
    const keypair = zokratesProvider.setup(artifacts.program);

    /**
     * @dev this generates the proof for the witness
     */
    const proof = zokratesProvider.generateProof(
      artifacts.program,
      witness,
      keypair.pk
    );

    const vefierKey = keypair.vk;

    const proofBuffer = JSON.stringify(proof);
    const verifierKeyBuffer = JSON.stringify(vefierKey);

    //exportVerifier(vefierKey);

    console.log(`Verifier Key:${verifierKeyBuffer}`, `Proof :${proofBuffer}`);

    return { proofBuffer, verifierKeyBuffer };
  } catch (error) {
    console.log(error);
  }
};

// verifyProof();

export default router;
