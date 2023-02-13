import { Zk } from "src/zk";
import { verifierDetails } from "./types";
import { traceFactoryAbi, traceHubAbi, traceAgreementAbi } from "./abi/index";
import keccak256 from "keccak256";
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
        gasLimit: 21000,
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
    verifiers: Array<string>,
    traceAddress: string,
    txDetails: object,
    signer: any
  ): Promise<any> {
    try {
      const verifierDetails: Array<object> = [];
      const provider = await this.getProvider();
      const traceAgreement = new ethers.Contract(
        traceAddress,
        traceAgreementAbi,
        signer
      );

      const details = (await this.getVerifiersDetails(verifiers)).details;
      const data = {
        traceAddress: traceAddress,
        verifiersRoot: details.verifiersRoot,
        verifiers: verifiers,
        txDetails: txDetails,
        previousBlockCid: "",
      };

      const write = await this.writeCar(data, traceAddress);

      const tx = await traceAgreement.initilize(
        details.verifiersRoot,
        details.nullifiers,
        write.cid,
        {
          gasLimit: 21000,
          maxFeePerGas: provider.getGasPrice(),
          maxPriorityFeePerGas: provider.getGasPrice(),
        }
      );

      const receipt = await tx.wait();
      if (receipt.status != 1) {
        throw new Error("initilization failed");
      }

      for (let i = 0; i < verifiers.length; i++) {
        const e = {
          verifier: verifiers[i],
          nullifier: details.nullifiers[i],
          merkelProof: await this.createProof(verifiers[i], verifiers),
        };

        verifierDetails.push(e);
      }

      return {
        message: "ok",
        transactionHash: receipt.hash,
        verificationDetails: verifierDetails,
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

  public async createZkProof(
    traceAddress: string,
    traceHubAddress: string,
    signer: any
  ): Promise<object> {
    const proof = await this.generateZkProof(traceAddress);
    const provider = await this.getProvider();

    const traceHub = new ethers.Contract(
      traceHubAddress,
      traceHubAbi,
      provider
    );

    const traceAgreement = new ethers.Contract(
      traceAddress,
      traceAgreementAbi,
      signer
    );

    const approved = await traceHub.checkSupplierApproved(traceAddress);
    if (!approved) {
      throw new Error("Supplier has not approved");
    }

    const zkProof = await this.generateZkProof(traceAddress);
  }

  private async getVerifiersDetails(
    verifiers: Array<string>
  ): Promise<verifierDetails> {
    try {
      const abi = ethers.utils.defaultAbiCoder;
      const provider = await this.getProvider();
      const { root } = await this.getMerkelTree(verifiers);

      const timeStamp: any = Math.round(new Date().getTime() / 1000).toString();
      const nullifiers: any = verifiers.forEach((verifier) => {
        const saltedNull: any = this.getNullifier(verifier);
        const params: number =
          saltedNull * provider.getBlockNumber() + timeStamp;
        keccak256(abi.encode(["uint"], [params]));
      });

      return {
        message: "ok",
        details: {
          verifiersRoot: root,
          nullifiers: nullifiers,
        },
      };
    } catch (e) {
      console.log(e);
    }
  }
}
