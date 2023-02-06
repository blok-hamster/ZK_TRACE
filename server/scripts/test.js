import * as IPFS from "ipfs";
import * as Block from "multiformats/block";
import { sha256 } from "multiformats/hashes/sha2";
import * as raw from "multiformats/codecs/raw";
import * as dagJSON from "@ipld/dag-json";
import * as dagCBOR from "@ipld/dag-cbor";

const obj = {
  hello: "world",
};
const blocks = [];
const ipfs = await IPFS.create();
const block = await Block.encode({
  value: obj,
  hasher: sha256,
  codec: dagCBOR,
});

blocks.push(block);

const cid = block.cid;

console.log(cid);
//await ipfs.block.put(block, { cid: cid.toString() });
