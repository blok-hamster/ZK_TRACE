import { Base } from "src/base";
import { Data, CarData, CreateCarReturn, IpfsReturn } from "./types";

import { Web3Storage, File } from "web3.storage";
import { CarReader } from "@ipld/car/reader";
import * as fs from "fs";
import { Readable } from "readable-stream";
import * as Block from "multiformats/block";
import { sha256 } from "multiformats/hashes/sha2";
import * as raw from "multiformats/codecs/raw";
import * as dagJSON from "@ipld/dag-json";
import * as dagCBOR from "@ipld/dag-cbor";
import { CarWriter } from "@ipld/car/writer";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import axios from "axios";

export class Storage extends Base {
  //RestApi Methods

  public async readCid(cid: string): Promise<Data> {
    return this.invoke(`storage/readData/${cid}`);
  }

  public async readCarData(traceAddress: string): Promise<CarData> {
    return this.invoke(`storage/createCar/${traceAddress}`);
  }

  public async createCar(
    data: Data,
    traceAddress: string
  ): Promise<CreateCarReturn> {
    return this.invoke(`storage/createCar/${traceAddress}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  public async uploadCar(traceAddress: string): Promise<IpfsReturn> {
    return this.invoke(`storage/uploadCar/${traceAddress}`, {
      method: "POST",
    });
  }

  public async updateCar(
    data: Data,
    traceAddress: string
  ): Promise<IpfsReturn> {
    return this.invoke(`storage/createCar/${traceAddress}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  public async getMerkelProof(
    traceAddress: string,
    verifierAddress: string
  ): Promise<object> {
    return this.invoke(
      `storage/getMerkelProof/${traceAddress}/${verifierAddress}`,
      {
        method: "GET",
      }
    );
  }

  /// Helpers

  private initilizeWeb3Storage = async () => {
    const storage = new Web3Storage({ token: await this.getWeb3StorageKey() });
    return storage;
  };

  private uploadCarToIPFS = async (traceAddress: string) => {
    try {
      const storage = await this.initilizeWeb3Storage();
      const inStream = fs.createReadStream(`./cars/${traceAddress}.car`);
      const reader = await CarReader.fromIterable(inStream);

      const cid = await storage.putCar(reader, {
        name: `${traceAddress}.car`,
        decoders: [dagCBOR],
      });
      return cid;
    } catch (e) {
      throw new Error(e);
    }
  };

  public readData = async (cid: string) => {
    let data: object;
    try {
      await axios
        .get(`https://ipfs.io/api/v0/dag/get/${cid}`)
        .then((result) => {
          data = result.data.data;
        })
        .catch((err) => {
          throw new Error(err);
        });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  };

  utf8Encoder = new TextEncoder();
  utf8Decoder = new TextDecoder();

  /**
   *
   * @param {string} data is a string version of a json object that contains the data to be stored in the car file
   */
  private createBlock = async (data: any) => {
    const blocks = [];
    try {
      const dataLeaf = await Block.encode({
        value: { data },
        hasher: sha256,
        codec: dagCBOR,
      });
      blocks.push(dataLeaf);
      return { blocks, roots: [dataLeaf.cid] };
    } catch (e) {
      throw new Error(e);
    }
  };

  /**
   *
   * @param roots of the roots of the car file
   * @param blocks of the blocks of the car file
   */
  // @ts-ignore
  private write = async (roots: any, blocks: any, traceAddress: string) => {
    try {
      if (!fs.existsSync("./cars")) {
        fs.mkdirSync("./cars");
      }
      const { writer, out } = CarWriter.create(roots);
      Readable.from(out).pipe(fs.createWriteStream(`cars/${traceAddress}.car`));
      // @ts-ignore
      for (const block of blocks) {
        await writer.put(block);
        await writer.close();
      }
      return out;
    } catch (e) {
      throw new Error(e);
    }
  };

  // @ts-ignore
  public readCar = async (path: string) => {
    //`./cars/${traceAddress}.car`
    const codecs = {
      [raw.code]: raw,
      [dagJSON.code]: dagJSON,
      [dagCBOR.code]: dagCBOR,
    };

    const hashes = {
      [sha256.code]: sha256,
    };

    try {
      const instream = fs.createReadStream(path);
      const reader = await CarReader.fromIterable(instream);

      const roots = await reader.getRoots();
      const blocks = [];
      let data: any;
      let blockCid: string;
      for await (const { cid, bytes } of reader.blocks()) {
        const block = await Block.create({
          cid,
          bytes,
          codec: codecs[cid.code],
          hasher: hashes[cid.multihash.code],
        });

        blocks.push(block);

        const res: any =
          block.value instanceof Uint8Array
            ? this.utf8Decoder.decode(block.value)
            : block.value;

        const newData = JSON.parse(JSON.stringify(res.data));
        data = newData;
        blockCid = cid.toString();
      }
      return { blockCid, data };
    } catch (e) {
      throw new Error(e);
    }
  };

  private updatPreviousBlockCid = (data: any, blockCid: string) => {
    let newData = data;
    newData.previousBlockCid = blockCid;
    return newData;
  };

  updateCar1 = async (data: any, traceAddress: string, blockCid: string) => {
    let cid: string;
    try {
      const newData = this.updatPreviousBlockCid(data, blockCid);
      const { blocks, roots } = await this.createBlock(newData);
      await this.write(roots, blocks, traceAddress);
      cid = await this.uploadCarToIPFS(traceAddress);
      return cid;
    } catch (e) {
      throw new Error(e);
    }
  };

  public writeCar = async (data: any, traceAddress: string) => {
    let cid: string;
    try {
      const { blocks, roots } = await this.createBlock(data);
      await this.write(roots, blocks, traceAddress);
      cid = await this.uploadCarToIPFS(traceAddress);
      return {
        message: "ok",
        cid: cid,
      };
    } catch (e) {
      throw new Error(e);
    }
  };

  ///MERKEL TREE HANDLER
  public buff2Hex = (x: any) => "0x" + x.toString("hex");

  // @ts-ignore
  getMerkelTree = async (params: Array<string>) => {
    try {
      // @ts-ignore
      const leaves = params.map((item) => keccak256(item));
      const tree = new MerkleTree(leaves, keccak256); //, { sortPairs: true });
      const root = this.buff2Hex(tree.getRoot());
      return { tree, root };
    } catch (e) {
      throw new Error(e);
    }
  };

  // @ts-ignore
  getleave = (address: string) => {
    const hexLeaf = this.buff2Hex(keccak256(address));
    return hexLeaf;
  };

  // @ts-ignore
  private async getMerkelProof1(leaf: string, params: Array<string>) {
    try {
      const { tree } = await this.getMerkelTree(params);
      const proof = tree.getProof(leaf).map((item) => this.buff2Hex(item.data));
      return proof;
    } catch (e) {
      throw new Error(e);
    }
  }

  // @ts-ignore
  public createProof = async (
    address: string,
    params: Array<string>
  ): Promise<any> => {
    try {
      const hexLeaf = this.getleave(address);
      const proof = await this.getMerkelProof1(hexLeaf, params);
      return proof;
    } catch (e) {
      throw new Error(e);
    }
  };
}
