import { Zk } from "src/zk";
import { verifierDetails, CreateProofReturn, TraceVerfierReturn, InitializeAgreementReturn, CreateAgreementReturn } from "./types";
import { Signer } from "ethers";
export declare class TraceProtocol extends Zk {
    createTraceAgreement(adminAddress: string, supplierAddress: string, dataAvailibality: number, signer: Signer): Promise<CreateAgreementReturn>;
    acceptProposal(traceAddress: string, signer: Signer): Promise<boolean>;
    initilizeAgreement(verifiers: Array<string>, traceAddress: string, txDetails: object, signer: Signer): Promise<InitializeAgreementReturn>;
    createZkProof(traceAddress: string, proofDetails: string, signer: Signer): Promise<CreateProofReturn>;
    activateTraceAgreement(traceAddress: string, proof: any, signer: Signer): Promise<any>;
    verifyByOrder(traceAddress: string, nullifier: string, key: string, signer: any): Promise<TraceVerfierReturn>;
    getVerifiersDetails(verifiers: Array<string>): Promise<verifierDetails>;
    getVerifiersProof(verifiers: Array<string>): Promise<any>;
    encryptionDetails(traceAddress: string): Promise<any>;
}
