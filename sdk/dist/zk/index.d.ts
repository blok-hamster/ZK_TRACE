import { Proof } from "./types";
import { Storage } from "src/storage";
export declare class Zk extends Storage {
    generateZkProof(input: Array<string>): Promise<object>;
    verifyZkProof(proof: Proof): Promise<object>;
}
