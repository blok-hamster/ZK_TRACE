import { GenerateProofReturn, ProofDetails } from "./types";
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
    getPreImage(salt: string): Promise<any>;
    generateZkProof(salt: string, proofDetails: ProofDetails): Promise<GenerateProofReturn>;
    verifyZkProof(proofObj: any): Promise<any>;
}
