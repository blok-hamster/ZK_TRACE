import { Zk } from "src/zk";
import {
  verifierDetails,
  CreateProofReturn,
  TraceVerfierReturn,
  InitializeAgreementReturn,
  CreateAgreementReturn,
} from "./types";
import { traceFactoryAbi, traceHubAbi, traceAgreementAbi } from "./abi/index";
import keccak256 from "keccak256";
import { ethers } from "ethers";

export class TraceProtocol extends Zk {
  public async createTraceAgreement(
    adminAddress: string,
    supplierAddress: string,
    signer: any
  ): Promise<CreateAgreementReturn> {
    try {
      const provider = await this.getProvider();
      const traceFactory = new ethers.Contract(
        this.getFactoryAddress(),
        traceFactoryAbi,
        signer
      );

      let events = [];
      const tx = await traceFactory.newTraceAgreement(
        adminAddress,
        supplierAddress
      );
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
        transactionHash: receipt.transactionHash,
        details: {
          agreementAddress: agreementAddress,
          agreementId: agreementId.toString(),
        },
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  public async acceptProposal(
    traceAddress: string,
    signer: any
  ): Promise<boolean> {
    try {
      let events = [];
      const traceHub = new ethers.Contract(
        this.getTraceHubAddress(),
        traceHubAbi,
        signer
      );

      const tx = await traceHub.acceptProposal(traceAddress, {
        gasLimit: 210000,
        maxFeePerGas: ethers.utils.parseUnits("80", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits("80", "gwei"),
      });

      const receipt = await tx.wait();
      if (receipt.status != 1) {
        throw new Error("verification failed");
      }

      for (let item of receipt.events) {
        events.push(item.event);
      }
      const accepted = await receipt.events[0].args.accepted;
      return accepted;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async initilizeAgreement(
    verifiers: Array<string>,
    traceAddress: string,
    txDetails: object,
    signer: any
  ): Promise<InitializeAgreementReturn> {
    try {
      const verifierDetails: Array<any> = [];
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
          gasLimit: 21000000,
          maxFeePerGas: ethers.utils.parseUnits("80", "gwei"),
          maxPriorityFeePerGas: ethers.utils.parseUnits("80", "gwei"),
        }
      );

      const receipt = await tx.wait();
      if (receipt.status != 1) {
        throw new Error("initilization failed");
      }

      for (let i = 0; i < verifiers.length; i++) {
        const proof = await this.createProof(verifiers[i], verifiers);
        const e = {
          verifier: verifiers[i],
          nullifier: details.nullifiers[i],
          merkelProof: await proof,
        };

        verifierDetails.push(e);
      }

      return {
        message: "ok",
        transactionHash: receipt.transactionHash,
        verificationDetails: verifierDetails,
      };
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  public async getVerifiersProof(verifiers: Array<string>): Promise<any> {
    const verifierDetails: Array<any> = [];
    for (let i = 0; i < verifiers.length; i++) {
      const proof = await this.createProof(verifiers[i], verifiers);
      const e = {
        verifier: verifiers[i],
        merkelProof: await proof,
      };

      verifierDetails.push(e);
    }

    return verifierDetails;
  }

  public async verifyByOrder(
    traceAddress: string,
    proof: Array<string>,
    nullifier: string,
    signer: any
  ): Promise<TraceVerfierReturn> {
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
        maxFeePerGas: ethers.utils.parseUnits("80", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits("80", "gwei"),
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
      throw new Error(e);
    }
  }

  public async createZkProof(
    traceAddress: string,
    signer: any
  ): Promise<CreateProofReturn> {
    try {
      const provider = await this.getProvider();
      const proof = await this.generateZkProof(traceAddress);

      const traceHub = new ethers.Contract(
        this.getTraceHubAddress(),
        traceHubAbi,
        signer
      );

      const approved = await traceHub.checkSupplierApproved(traceAddress);
      if (!approved) {
        throw new Error("Supplier has not approved");
      }
      const tx = await traceHub.zkProof(traceAddress, proof.details.nullifier, {
        gasLimit: 21000000,
        maxFeePerGas: ethers.utils.parseUnits("80", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits("80", "gwei"),
      });

      const receipt = await tx.wait();
      if (receipt.status != 1) {
        throw new Error("verification failed");
      }

      return proof.details;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async activateTraceAgreement(
    traceAddress: string,
    proof: any,
    signer: any
  ): Promise<any> {
    try {
      const provider = await this.getProvider();
      const traceHub = new ethers.Contract(
        this.getTraceHubAddress(),
        traceHubAbi,
        signer
      );
      let nullExist = await traceHub.checkNullExist(
        traceAddress,
        proof.nullifier
      );

      if (!nullExist) {
        throw new Error("Invalid Nullifier");
      }
      const zkProof = await this.verifyZkProof({
        proofBuffer: proof.proofBuffer,
        verifierKeyBuffer: proof.verifierKeyBuffer,
      });

      if (zkProof.message != "Ok") {
        throw new Error("Invalid ZK Proof Provided");
      }

      const tx = await traceHub.initiateAgreement(
        traceAddress,
        proof.nullifier,
        {
          gasLimit: 21000000,
          maxFeePerGas: ethers.utils.parseUnits("80", "gwei"),
          maxPriorityFeePerGas: ethers.utils.parseUnits("80", "gwei"),
        }
      );

      const receipt = await tx.wait();
      if (receipt.status != 1) {
        throw new Error("failed to initiate");
      }

      return {
        message: "ok",
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  public async getVerifiersDetails(
    verifiers: Array<string>
  ): Promise<verifierDetails> {
    try {
      let nullifier: Array<string> = [];
      const abi = ethers.utils.defaultAbiCoder;
      const provider = await this.getProvider();
      const { root } = await this.getMerkelTree(verifiers);
      const timeStamp: any = parseInt(
        Math.round(new Date().getTime() / 1000).toString()
      );
      verifiers.forEach(async (verifier) => {
        const saltedNull: any = await this.getNullifier(verifier);
        nullifier.push(
          this.buff2Hex(
            keccak256(abi.encode(["uint", "uint"], [saltedNull, timeStamp]))
          )
        );
      });

      return {
        message: "ok",
        details: {
          verifiersRoot: root,
          nullifiers: nullifier,
        },
      };
    } catch (e) {
      throw new Error(e);
    }
  }
}
