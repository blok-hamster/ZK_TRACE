import express from "express";
const router = express.Router();
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

import { Web3Storage, File } from "web3.storage";
import * as IPFS from "ipfs";
import * as AWS from "aws-sdk";
import { CarReader } from "@ipld/car/reader";
import * as fs from "fs";
import { Readable } from "stream";
import * as Block from "multiformats/block";
import { sha256 } from "multiformats/hashes/sha2";
import dotenv from "dotenv";
import * as raw from "multiformats/codecs/raw";
import * as dagJSON from "@ipld/dag-json";
import * as dagCBOR from "@ipld/dag-cbor";
import { CarWriter } from "@ipld/car/writer";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import axios from "axios";

dotenv.config();

router
  .route(`/createCar/:traceAddress`, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .post(async (req, res) => {
    const treeDetails = await getMerkelTree(req.body.verifiers);
    const data = {
      traceAddress: req.params.traceAddress,
      verifiersRoot: treeDetails.root,
      verifiers: req.body.verifiers,
      txDetails: req.body.txDetails,
      previousBlockCid: req.body.previousBlockCid,
    };

    await writeCar(data, data.traceAddress);
    res.status(200).json({
      message: "Car file created",
      data: data,
    });
    console.log(data);
  })

  .get(async (req, res) => {
    const traceAddress = req.params.traceAddress;
    const { ...data } = await read(traceAddress);
    res.status(200).json({
      blockCid: data.blockCid,
      data: data.data,
      traceAddress: traceAddress,
    });
  })

  .put(async (req, res) => {
    const traceAddress = req.params.traceAddress;
    const data = req.body;

    const cid = await updateCar(data, traceAddress);

    res.status(200).json({
      message: `Car file updated`,
      cid: cid,
    });
  });

router
  .route(`/uploadCar/:traceAddress`, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .post(async (req, res) => {
    const traceAddress = req.params.traceAddress;
    const cid = await uploadCarToIPFS(traceAddress);
    res.status(200).json({
      message: "car uploaded To ipfs",
      ipfsCid: cid,
    });
  });

router
  .route(`/getMerkelProof/:traceAddress/:verifier`, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .get(async (req, res) => {
    const traceAddress = req.params.traceAddress;
    const verifierAddr = req.params.verifier;
    const proof = await createProof(verifierAddr, traceAddress);
    res.status(200).json({
      message: "Proof created",
      proof: proof,
    });
  });

router
  .route(`/readData/:cid`, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .get(async (req, res) => {
    const cid = req.params.cid;
    let data = await readData(cid);
    console.log(data);

    res.status(200).json({
      message: "ok",
      data: data,
    });
  });

//IPLD & IPFS Handlers
const initilizeWeb3Storage = async () => {
  const storage = new Web3Storage({ token: process.env.WEB3_STORAGE_API });
  return storage;
};

const initPrivateStorage = async () => {
  AWS.config.update({ region: `us-east-1`, endpoint: ep });
  const ep = new AWS.Endpoint(`https://s3-storj.oortech.com`);
  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: process.env.OORT_KEY,
      secretAccessKey: process.env.OORT_SECRETE,
    },
  });

  return s3;
};

//const ipfs = await IPFS.create();
const uploadCarToIPFS = async (traceAddress) => {
  try {
    const storage = await initilizeWeb3Storage();
    const inStream = fs.createReadStream(`./cars/${traceAddress}.car`);
    const reader = await CarReader.fromIterable(inStream);

    const cid = await storage.putCar(reader, {
      name: `${traceAddress}.car`,
      decoders: [dagCBOR],
    });
    console.log(`IPFS CID: ${cid}`);
    return cid;
  } catch (e) {
    console.log(e);
  }
};

/**
 *
 * @param {string} traceAddress
 * @notice This function is used to upload the car file to Storj Cloud for privacy storage
 */
const uploadToPrivateStorage = async (traceAddress) => {
  try {
    const s3 = await initPrivateStorage();
    const inStream = fs.createReadStream(`./cars/${traceAddress}.car`);
    const reader = await CarReader.fromIterable(inStream);

    const uploadParams = {
      Bucket: "tracebucket",
      Key: `${traceAddress}.car`,
      Body: reader,
      ContentType: application / vnd.curl.car,
    };
    s3.upload(uploadParams, (err, data) => {
      err && console.log("error", err);
      data && console.log("uploaded", data.Location);
    });
  } catch (e) {
    console.log(e);
  }
};

const readData = async (cid) => {
  let data;
  try {
    await axios
      .get(`https://ipfs.io/api/v0/dag/get/${cid}`)
      .then((result) => {
        //console.log(result.data.data);
        data = result.data.data;
      })
      .catch((err) => {
        console.log(err);
      });

    return data;
  } catch (e) {
    console.log(e);
  }
};

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();

/**
 *
 * @param {string} data is a string version of a json object that contains the data to be stored in the car file
 */
const createBlock = async (data) => {
  const blocks = [];
  try {
    const dataLeaf = await Block.encode({
      value: { data },
      hasher: sha256,
      codec: dagCBOR,
    });
    blocks.push(dataLeaf);

    console.log(blocks);
    console.log(dataLeaf.cid);
    return { blocks, roots: [dataLeaf.cid] };
  } catch (e) {
    console.log(e);
  }
};

/**
 *
 * @param roots of the roots of the car file
 * @param blocks of the blocks of the car file
 */
// @ts-ignore
const write = async (roots, blocks, traceAddress) => {
  try {
    const { writer, out } = CarWriter.create(roots);
    if (!fs.existsSync("./cars")) {
      fs.mkdirSync("./cars");
    }
    Readable.from(out).pipe(fs.createWriteStream(`cars/${traceAddress}.car`));
    // @ts-ignore
    for (const block of blocks) {
      await writer.put(block);
      await writer.close();
    }
    return out;
  } catch (e) {
    console.log(e);
  }
};

// @ts-ignore
const read = async (traceAddress) => {
  const codecs = {
    [raw.code]: raw,
    [dagJSON.code]: dagJSON,
    [dagCBOR.code]: dagCBOR,
  };

  const hashes = {
    [sha256.code]: sha256,
  };

  try {
    const instream = fs.createReadStream(`./cars/${traceAddress}.car`);
    const reader = await CarReader.fromIterable(instream);

    const roots = await reader.getRoots();
    const blocks = [];
    let data;
    let blockCid;
    for await (const { cid, bytes } of reader.blocks()) {
      const block = await Block.create({
        cid,
        bytes,
        codec: codecs[cid.code],
        hasher: hashes[cid.multihash.code],
      });

      blocks.push(block);

      const res =
        block.value instanceof Uint8Array
          ? utf8Decoder.decode(block.value)
          : block.value;

      const newData = JSON.parse(JSON.stringify(res.data));
      data = newData;
      blockCid = cid.toString();

      console.log(
        `Previous Block CID: ${
          newData.previousBlockCid
        }, New Block CID: ${cid.toString()}`
      );
    }
    return { blockCid, data };
  } catch (e) {
    console.log(e);
  }
};

const updatPreviousBlockCid = (data, blockCid) => {
  let newData = data;
  newData.previousBlockCid = blockCid;
  return newData;
};

const updateCar = async (data, traceAddress) => {
  let cid;
  try {
    const { blockCid } = await read(traceAddress);
    const newData = updatPreviousBlockCid(data, blockCid);
    const { blocks, roots } = await createBlock(newData);
    await write(roots, blocks, traceAddress);
    cid = await uploadCarToIPFS(traceAddress);
  } catch (e) {
    console.log(e);
  }
  console.log(`Car Packed at: cars/${traceAddress}.car , CID: ${cid}`);
  return cid;
};

const writeCar = async (data, traceAddress) => {
  try {
    let cid;
    const { blocks, roots } = await createBlock(data);
    await write(roots, blocks, traceAddress);
    cid = await uploadCarToIPFS(traceAddress);
    console.log(`Car Packed at: cars/${traceAddress}.car`);
    console.log(cid);

    console.log(`Car Packed at: cars/${traceAddress}.car`);
  } catch (e) {
    console.log(e);
  }
};

///MERKEL TREE HANDLER
const buff2Hex = (X) => "0x" + X.toString("hex");

// @ts-ignore
const getMerkelTree = async (params) => {
  try {
    // @ts-ignore
    const leaves = params.map((item) => keccak256(item));
    const tree = new MerkleTree(leaves, keccak256); //, { sortPairs: true });
    const root = buff2Hex(tree.getRoot());
    return { tree, root };
  } catch (e) {
    console.log(e);
  }
};

// @ts-ignore
const getleave = (address) => {
  const hexLeaf = buff2Hex(keccak256(address));
  return hexLeaf;
};

// @ts-ignore
const getMerkelProof = async (leaf, params) => {
  try {
    const { tree } = await getMerkelTree(params);
    const proof = await tree.getProof(leaf).map((item) => buff2Hex(item.data));
    return proof;
  } catch (e) {
    console.log(e);
  }
};

// @ts-ignore
const createProof = async (address, traceAddress) => {
  try {
    const { ...data } = await read(traceAddress);
    const hexLeaf = getleave(address);
    const proof = await getMerkelProof(hexLeaf, data.data.verifiers);
    console.log(proof);
    return proof;
  } catch (e) {
    console.log(e);
  }
};

export default router;
