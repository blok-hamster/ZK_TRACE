import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { initialize } from "zokrates-js";
import keccak256 from "keccak256";
import { ethers } from "ethers";
import seedRandom from "seedrandom";

import { Proof, GenerateProofReturn, ProofDetails } from "./types";
import { Storage } from "src/storage";

export class Zk extends Storage {
  rootFromPath: string = "../circuit";
  rootToPath: string = "sdk/circuit/root.zok";

  private async randomNumber(salt: String): Promise<Array<string>> {
    try {
      let randN: Array<string> = [];
      for (let i = 0; i < 4; i++) {
        const prng = seedRandom(salt, { entropy: true });
        randN.push(Math.abs(prng.int32()).toString());
      }
      return randN;
    } catch (e) {
      console.error(e);
    }
  }

  public async getNullifier(salt: String): Promise<number> {
    try {
      const prng = seedRandom(salt, { entropy: false });
      return Math.abs(prng.int32());
    } catch (e) {
      console.error(e);
    }
  }

  private async fileSystemResolver(
    fromPath: string,
    toPath: string
  ): Promise<any> {
    try {
      const location = resolve(dirname(resolve(fromPath)), toPath);
      const source = readFileSync(location).toString();
      return source;
    } catch (e) {
      console.error(e);
    }
  }

  private async getSource(fromPath: string, toPath: string): Promise<any> {
    try {
      const source = await this.fileSystemResolver(fromPath, toPath);
      return source;
    } catch (e) {
      console.error(e);
    }
  }

  private async getZokrateProvider(): Promise<any> {
    try {
      const zokratesProvider = await initialize();
      return zokratesProvider;
    } catch (e) {
      console.error(e);
    }
  }

  private async getArtifacts(source: any): Promise<any> {
    try {
      const zokratesProvider = await this.getZokrateProvider();
      const artifacts = zokratesProvider.compile(source);
      return artifacts;
    } catch (e) {
      console.error(e);
    }
  }

  public async getPreImage(salt: string): Promise<any> {
    try {
      const params: Array<string> = await this.randomNumber(salt);
      const zokratesProvider = await this.getZokrateProvider();
      const source = await this.getSource(
        `../circuit`,
        `sdk/circuit/preImage.zok`
      );
      const artifacts = await this.getArtifacts(source);
      const { output } = zokratesProvider.computeWitness(artifacts, params);
      return { params: params, preImage: JSON.parse(output) };
    } catch (e) {
      console.error(e);
      throw new Error("ZK preImage Error");
    }
  }

  public async generateZkProof(
    salt: string,
    proofDetails: ProofDetails
  ): Promise<GenerateProofReturn> {
    try {
      const abi = ethers.utils.defaultAbiCoder;
      const provider = await this.getProvider();

      const params = proofDetails.params;
      const preImage = proofDetails.preImage;

      const timeStamp: any = parseInt(
        Math.round(new Date().getTime() / 1000).toString()
      );
      const saltedNull = await this.getNullifier(salt);
      const zokratesProvider = await this.getZokrateProvider();
      const source = await this.getSource(this.rootFromPath, this.rootToPath);
      const artifacts = await this.getArtifacts(source);
      const blockNumber = await provider.getBlockNumber();
      const nullifier = this.buff2Hex(
        keccak256(
          abi.encode(
            ["uint", "uint", "uint", "string"],
            [saltedNull, timeStamp, blockNumber, salt]
          )
        )
      );

      const input = [...params, ...preImage];
      const { witness } = zokratesProvider.computeWitness(artifacts, input);

      /**
       * @dev this runs the setup ceremoney for the prover and verifier keys
       */
      const keypair = zokratesProvider.setup(artifacts.program);
      /**
       * @dev this generates the proof for the witness
       */
      const proof = zokratesProvider.generateProof(
        artifacts.program,
        witness,
        keypair.pk
      );
      const vefierKey = keypair.vk;
      const proofBuffer = JSON.stringify(proof);
      const verifierKeyBuffer = JSON.stringify(vefierKey);
      return {
        message: "ok",
        details: { proofBuffer, verifierKeyBuffer, nullifier },
      };
    } catch (e) {
      console.error(e);
      throw new Error("generate zk proof error");
    }
  }

  public async verifyZkProof(proofObj: any): Promise<any> {
    try {
      const zkP = proofObj.proofBuffer;
      const vk = proofObj.verifierKeyBuffer;
      const proof = JSON.parse(zkP);
      const verifierKey = JSON.parse(vk);
      const zokratesProvider = await this.getZokrateProvider();
      const isVerified = zokratesProvider.verify(verifierKey, proof);
      if (!isVerified) {
        return {
          message: "invalid Proof Provided",
          isVerified,
        };
      }
      return {
        message: "Ok",
        isVerified,
      };
    } catch (e) {
      console.error(e);
      throw new Error("Verify Zk Proof error");
    }
  }
}
