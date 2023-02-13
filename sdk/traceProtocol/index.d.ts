import { Zk } from "src/zk";
import { NewTraceData } from "./types";
export declare class TraceProtocol extends Zk {
    createTraceAgreement(traceData: NewTraceData, factoryAddress: string, signer: any): Promise<any>;
}
