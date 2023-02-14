import { Proof, GenerateProofReturn } from "./types";
import { Storage } from "src/storage";
export declare class Zk extends Storage {
    rootFromPath: string;
    rootToPath: string;
    private randomNumber;
    getNullifier(salt: String): Promise<number>;
    private fileSystemResolver;
    private getSource;
    private getZokrateProvider;
    private getArtifacts;
    private getPreImage;
    generateZkProof(salt: string): Promise<GenerateProofReturn>;
    verifyZkProof(proofObj: any): Promise<any>;
    verifyZkProof1(proof: Proof): Promise<object>;
}
