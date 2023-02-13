import { Proof } from "./types";
import { Storage } from "src/storage";
export declare class Zk extends Storage {
    rootFromPath: string;
    rootToPath: string;
    private randomNumber;
    getNullifier(salt: String): Promise<any>;
    generateZkProof(input: Array<string>): Promise<object>;
    verifyZkProof(proof: Proof): Promise<object>;
    private fileSystemResolver;
    private getSource;
    private getZokrateProvider;
    private getArtifacts;
    private getPreImage;
    generateZkProof1(salt: string): Promise<object>;
    verifyZkProof1(proofObj: Proof): Promise<object>;
}
