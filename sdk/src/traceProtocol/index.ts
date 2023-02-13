import { Zk } from "src/zk";
import { NewTraceData } from "./types";
import { traceFactoryAbi, traceHubAbi, traceAgreementAbi } from "./abi/index";
import { ethers } from "ethers";

export class TraceProtocol extends Zk {
  public async createTraceAgreement(
    adminAddress: string,
    signer: any
  ): Promise<any> {
    try {
      const provider = await this.getProvider();

      const traceFactory = new ethers.Contract(
        this.getFactoryAddress(),
        traceFactoryAbi,
        signer
      );

      let events = [];
      const tx = await traceFactory.newTraceAgreement(adminAddress, {
        gasLimit: 210000,
        maxFeePerGas: provider.getGasPrice(),
        maxPriorityFeePerGas: provider.getGasPrice(),
      });
      const receipt = await tx.wait();

      if (receipt.status != 1) {
        throw new Error("Creation Failed");
      }

      for (let item of receipt.events) {
        events.push(item.event);
      }

      const agreementAddress = await receipt.events[0].args.agreementAddress;
      const agreementId = await receipt.events[0].args.id;
      return {
        message: "ok",
        transactionHash: receipt.hash,
        details: {
          agreementAddress: agreementAddress,
          agreementId: agreementId,
        },
      };
    } catch (e) {
      console.log(e);
      return {
        message: e,
      };
    }
  }

  public async initilizeAgreement(
    data: NewTraceData,
    traceAddress: string,
    signer: any
  ): Promise<any> {
    try {
      const provider = await this.getProvider();
      const traceAgreement = new ethers.Contract(
        traceAddress,
        traceAgreementAbi,
        signer
      );

      const tx = await traceAgreement.initilize(
        data.verifierRoot,
        data.initiatorRoot,
        data.nullifiers,
        data.agreementUri,
        {
          gasLimit: 210000,
          maxFeePerGas: provider.getGasPrice(),
          maxPriorityFeePerGas: provider.getGasPrice(),
        }
      );

      const receipt = await tx.wait();
      if (receipt.status != 1) {
        throw new Error("initilization failed");
      }

      return {
        message: "ok",
        transactionHash: receipt.hash,
      };
    } catch (e) {
      console.log(e);
      return {
        message: e,
      };
    }
  }

  public async verifyByOrder(
    traceAddress: string,
    proof: Array<string>,
    nullifier: string,
    signer: any
  ): Promise<any> {
    try {
      const provider = await this.getProvider();
      const traceAgreement = new ethers.Contract(
        traceAddress,
        traceAgreementAbi,
        signer
      );
      let events = [];
      const tx = await traceAgreement.verifyByOrder(proof, nullifier, {
        gasLimit: 210000,
        maxFeePerGas: provider.getGasPrice(),
        maxPriorityFeePerGas: provider.getGasPrice(),
      });

      const receipt = await tx.wait();
      if (receipt.status != 1) {
        throw new Error("verification failed");
      }

      for (let item of receipt.events) {
        events.push(item.event);
      }
      const verifiedCount = await receipt.events[0].args.signCount;
      const verified = await receipt.events[0].args.verified;

      return {
        message: "ok",
        details: {
          verifiedCount: verifiedCount,
          verified: verified,
        },
      };
    } catch (e) {
      console.log(e);
      return {
        message: e,
      };
    }
  }
}
