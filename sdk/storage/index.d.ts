import { Base } from "src/base";
import { Data, CarData, CreateCarReturn, IpfsReturn } from "./types";
import { Web3Storage } from "web3.storage";
import { MerkleTree } from "merkletreejs";
export declare class Storage extends Base {
    readCid(cid: string): Promise<Data>;
    readCarData(traceAddress: string): Promise<CarData>;
    createCar(data: Data, traceAddress: string): Promise<CreateCarReturn>;
    uploadCar(traceAddress: string): Promise<IpfsReturn>;
    updateCar(data: Data, traceAddress: string): Promise<IpfsReturn>;
    getMerkelProof(traceAddress: string, verifierAddress: string): Promise<object>;
    initilizeWeb3Storage: () => Promise<Web3Storage>;
    uploadCarToIPFS: (traceAddress: string) => Promise<import("web3.storage/dist/src/lib/interface").CIDString>;
    readData: (cid: string) => Promise<object>;
    utf8Encoder: TextEncoder;
    utf8Decoder: TextDecoder;
    createBlock: (data: any) => Promise<{
        blocks: any[];
        roots: import("multiformats/cid").CID[];
    }>;
    write: (roots: any, blocks: any, traceAddress: string) => Promise<AsyncIterable<Uint8Array>>;
    read: (traceAddress: string) => Promise<{
        blockCid: string;
        data: any;
    }>;
    updatPreviousBlockCid: (data: any, blockCid: string) => any;
    updateCar1: (data: any, traceAddress: string) => Promise<string>;
    writeCar: (data: any, traceAddress: string) => Promise<void>;
    buff2Hex: (x: any) => string;
    getMerkelTree: (params: Array<string>) => Promise<{
        tree: MerkleTree;
        root: string;
    }>;
    getleave: (address: string) => string;
    getMerkelProof: (traceAddress: string, verifierAddress: string) => Promise<object>;
    createProof: (address: string, traceAddress: string) => Promise<object>;
}
