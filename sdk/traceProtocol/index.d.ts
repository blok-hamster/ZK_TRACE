import { Zk } from "src/zk";
import { verifierDetails, CreateProofReturn, TraceVerfierReturn, InitializeAgreementReturn, CreateAgreementReturn } from "./types";
export declare class TraceProtocol extends Zk {
    createTraceAgreement(adminAddress: string, supplierAddress: string, signer: any): Promise<CreateAgreementReturn>;
    acceptProposal(traceAddress: string, signer: any): Promise<boolean>;
    initilizeAgreement(verifiers: Array<string>, traceAddress: string, txDetails: object, signer: any): Promise<InitializeAgreementReturn>;
    getVerifiersProof(verifiers: Array<string>): Promise<any>;
    verifyByOrder(traceAddress: string, proof: Array<string>, nullifier: string, signer: any): Promise<TraceVerfierReturn>;
    createZkProof(traceAddress: string, signer: any): Promise<CreateProofReturn>;
    activateTraceAgreement(traceAddress: string, proof: any, signer: any): Promise<any>;
    getVerifiersDetails(verifiers: Array<string>): Promise<verifierDetails>;
}
