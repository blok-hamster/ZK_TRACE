import { Zk } from "src/zk";
import {
  verifierDetails,
  CreateProofReturn,
  TraceVerfierReturn,
  InitializeAgreementReturn,
  CreateAgreementReturn,
  ProofDetails,
} from "./types";
import { traceFactoryAbi, traceHubAbi, traceAgreementAbi } from "./abi/index";
import keccak256 from "keccak256";
import { customAlphabet } from "nanoid";
import { ethers, Signer } from "ethers";

export class TraceProtocol extends Zk {
  public async createTraceAgreement(
    adminAddress: string,
    supplierAddress: string,
    dataAvailibality: number,
    signer: Signer
  ): Promise<CreateAgreementReturn> {
    try {
      //const provider = await this.getProvider();
      const traceFactory = new ethers.Contract(
        this.getFactoryAddress(),
        traceFactoryAbi,
        signer
      );

      let events = [];
      const tx = await traceFactory.newTraceAgreement(
        adminAddress,
        supplierAddress,
        dataAvailibality
      );
      const receipt = await tx.wait();

      if (receipt.status != 1) {
        console.log("Creation Failed");
        return;
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
      console.error(e);
      throw new Error("Create Trace Agreement failed");
    }
  }

  public async acceptProposal(
    traceAddress: string,
    signer: Signer
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
        console.log("verification failed");
        return;
      }

      for (let item of receipt.events) {
        events.push(item.event);
      }
      const accepted = await receipt.events[0].args.accepted;
      return accepted;
    } catch (e) {
      console.error(e);
      throw new Error("Accept proposal error");
    }
  }

  public async initilizeAgreement(
    verifiers: Array<string>,
    traceAddress: string,
    txDetails: object,
    signer: Signer
  ): Promise<InitializeAgreementReturn> {
    try {
      const verifierDetails: Array<any> = [];

      const abi = ethers.utils.defaultAbiCoder;
      const provider = await this.getProvider();

      const timeStamp: any = parseInt(
        Math.round(new Date().getTime() / 1000).toString()
      );
      const blockNumber = await provider.getBlockNumber();
      const traceAgreement = new ethers.Contract(
        traceAddress,
        traceAgreementAbi,
        signer
      );

      if ((await traceAgreement.checkIsInitilized) == true) {
        console.log("Trace Agreement already initilized");
        return;
      }
      const dataAvailibality = await traceAgreement.getDataAvailibality();
      const details = (await this.getVerifiersDetails(verifiers)).details;
      const keyNull = this.buff2Hex(
        keccak256(abi.encode(["uint", "uint"], [timeStamp, blockNumber]))
      );
      const nanoid = customAlphabet(keyNull, 32);
      const key = nanoid();
      let en_key: string;
      if (dataAvailibality.toString() === "1") {
        en_key = key;
      } else if (dataAvailibality.toString() === "2") {
        en_key = "";
      }
      en_key = key;
      const proofDetails = await this.getPreImage(traceAddress);
      const packedDetails = abi.encode(
        ["string"],
        [JSON.stringify(proofDetails)]
      );

      const _data = {
        traceAddress: traceAddress,
        verifiersRoot: details.verifiersRoot,
        verifiers: verifiers,
        txDetails: txDetails,
        previousBlockCid: "",
      };

      const strEncrypted = await this.encryptData(_data, key);
      const data = {
        encryptedData: strEncrypted,
      };
      const write = await this.writeCar(data, traceAddress);

      const tx = await traceAgreement.initilize(
        details.verifiersRoot,
        details.nullifiers,
        write.cid,
        en_key,
        {
          gasLimit: 21000000,
          maxFeePerGas: ethers.utils.parseUnits("80", "gwei"),
          maxPriorityFeePerGas: ethers.utils.parseUnits("80", "gwei"),
        }
      );

      const receipt = await tx.wait();

      if (receipt.status != 1) {
        console.log("initilization failed");
        return;
      }

      for (let i = 0; i < verifiers.length; i++) {
        const e = {
          verifier: verifiers[i],
          nullifier: details.nullifiers[i],
        };
        verifierDetails.push(e);
      }

      return {
        message: "ok",
        transactionHash: receipt.transactionHash,
        verificationDetails: verifierDetails,
        packedProofDetails: packedDetails,
        encryptionKey: key,
      };
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }

  public async createZkProof(
    traceAddress: string,
    proofDetails: string,
    signer: Signer
  ): Promise<CreateProofReturn> {
    try {
      const abi = ethers.utils.defaultAbiCoder;
      const provider = await this.getProvider();
      const decodeData = abi.decode(["string"], proofDetails);
      const _proofDetails: ProofDetails = JSON.parse(decodeData[0]);

      const proof = await this.generateZkProof(traceAddress, _proofDetails);

      const traceHub = new ethers.Contract(
        this.getTraceHubAddress(),
        traceHubAbi,
        signer
      );

      const approved = await traceHub.checkSupplierApproved(traceAddress);
      if (!approved) {
        console.log("Supplier has not approved");
        return;
      }
      const tx = await traceHub.zkProof(traceAddress, proof.details.nullifier, {
        gasLimit: 21000000,
        maxFeePerGas: ethers.utils.parseUnits("80", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits("80", "gwei"),
      });

      const receipt = await tx.wait();
      if (receipt.status != 1) {
        console.log("verification failed");
        return;
      }

      return proof.details;
    } catch (e) {
      console.error(e);
      throw new Error("create ZK proof error");
    }
  }

  public async activateTraceAgreement(
    traceAddress: string,
    proof: any,
    signer: Signer
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
        console.log("Invalid Nullifier");
        return;
      }
      const zkProof = await this.verifyZkProof({
        proofBuffer: proof.proofBuffer,
        verifierKeyBuffer: proof.verifierKeyBuffer,
      });

      if (zkProof.message != "Ok") {
        console.log("Invalid ZK Proof Provided");
        return;
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
        console.log("failed to initiate");
        return;
      }

      return {
        message: "ok",
      };
    } catch (e) {
      console.error(e);
      throw new Error("Trace agreement activation error");
    }
  }

  public async verifyByOrder(
    traceAddress: string,
    nullifier: string,
    signer: any,
    key?: string
  ): Promise<TraceVerfierReturn> {
    try {
      let en_key: string;

      const traceAgreement = new ethers.Contract(
        traceAddress,
        traceAgreementAbi,
        signer
      );

      const dataAvailibality = await traceAgreement.getDataAvailibality();

      if (dataAvailibality === 2 && key === undefined) {
        console.log("encryption key is not defined");
        return;
      } else if (dataAvailibality === 1) {
        en_key = await traceAgreement.getEncryptionKey();
      } else {
        en_key = key;
      }

      const cid = await traceAgreement.getAgreementUri();
      const verifiers = (await this.decryptData(cid, en_key)).verifiers;
      const proof = await this.createProof(signer.address, verifiers);

      const leaf = this.getleave(signer.address);

      let events = [];
      const tx = await traceAgreement.verifyByOrder(proof, nullifier, leaf, {
        gasLimit: 210000,
        maxFeePerGas: ethers.utils.parseUnits("80", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits("80", "gwei"),
      });

      const receipt = await tx.wait();
      if (receipt.status != 1) {
        console.log("verification failed");
        return;
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
      console.error(e);
      throw new Error("ZKTrace Verification Error");
    }
  }

  public async getVerifiersDetails(
    verifiers: Array<string>
  ): Promise<verifierDetails> {
    try {
      let nullifier: Array<string> = [];
      const abi = ethers.utils.defaultAbiCoder;

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
      console.error(e);
      throw new Error("get verifier details error");
    }
  }

  public async getVerifiersProof(verifiers: Array<string>): Promise<any> {
    try {
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
    } catch (e) {
      console.error(e);
      throw new Error("get verifier proof error");
    }
  }

  public async encryptionDetails(traceAddress: string): Promise<any> {
    try {
      const provider = await this.getProvider();

      const traceAgreement = new ethers.Contract(
        traceAddress,
        traceAgreementAbi,
        provider
      );

      const en_key = await traceAgreement.getEncryptionKey();
      const cid = await traceAgreement.getAgreementUri();

      return {
        encryptionKey: en_key,
        cid: cid,
      };
    } catch (e) {
      console.error(e);
    }
  }
}
