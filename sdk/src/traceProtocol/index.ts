import { Zk } from "src/zk";
import { NewTraceData } from "./types";
import { traceFactoryAbi, traceHubAbi, traceAgreementAbi } from "./abi/index";
import { ethers } from "ethers";

export class TraceProtocol extends Zk {
  public async createTraceAgreement(
    traceData: NewTraceData,
    factoryAddress: string,
    signer: any
  ): Promise<any> {
    try {
      const traceFactory = new ethers.Contract(
        factoryAddress,
        traceFactoryAbi,
        signer
      );
    } catch (e) {
      console.log(e);
    }
  }
}
