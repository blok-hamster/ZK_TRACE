import { Zk } from "src/zk";
export declare class TraceProtocol extends Zk {
    createTraceAgreement(adminAddress: string, signer: any): Promise<any>;
    initilizeAgreement(verifiers: Array<string>, traceAddress: string, signer: any): Promise<any>;
    private getVerifiersDetails;
    verifyByOrder(traceAddress: string, proof: Array<string>, nullifier: string, signer: any): Promise<any>;
}
