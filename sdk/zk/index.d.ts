import { Proof } from "./types";
import { Storage } from "src/storage";
export declare class Zk extends Storage {
    rootFromPath: string;
    rootToPath: string;
    private randomNumber;
    getNullifier(salt: String): Promise<any>;
    private fileSystemResolver;
    private getSource;
    private getZokrateProvider;
    private getArtifacts;
    private getPreImage;
    generateZkProof(salt: string): Promise<object>;
    verifyZkProof(proofObj: Proof): Promise<object>;
    verifyZkProof1(proof: Proof): Promise<object>;
}
