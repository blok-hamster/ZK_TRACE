import { Base } from "src/base";
import { Data, CarData, CreateCarReturn, IpfsReturn } from "./types";
import { MerkleTree } from "merkletreejs";
export declare class Storage extends Base {
    readCid(cid: string): Promise<Data>;
    readCarData(traceAddress: string): Promise<CarData>;
    createCar(data: Data, traceAddress: string): Promise<CreateCarReturn>;
    uploadCar(traceAddress: string): Promise<IpfsReturn>;
    updateCar(data: Data, traceAddress: string): Promise<IpfsReturn>;
    getMerkelProof(traceAddress: string, verifierAddress: string): Promise<object>;
    private initilizeWeb3Storage;
    private uploadCarToIPFS;
    readData: (cid: string) => Promise<any>;
    utf8Encoder: TextEncoder;
    utf8Decoder: TextDecoder;
    private createBlock;
    private write;
    readCar: (path: string) => Promise<{
        blockCid: string;
        data: any;
    }>;
    private updatPreviousBlockCid;
    updateCar1: (data: any, traceAddress: string, blockCid: string) => Promise<string>;
    writeCar: (data: any, traceAddress: string) => Promise<{
        message: string;
        cid: string;
    }>;
    buff2Hex: (x: any) => string;
    getMerkelTree: (params: Array<string>) => Promise<{
        tree: MerkleTree;
        root: string;
    }>;
    getleave: (address: string) => string;
    private getMerkelProof1;
    verifyMerkelProof: (proof: Array<string>, address: string, params: Array<string>) => Promise<boolean>;
    createProof: (address: string, params: Array<string>) => Promise<any>;
    encryptData(data: Data, key: string): Promise<string>;
    decryptData(cid: string, key: string): Promise<Data>;
}
