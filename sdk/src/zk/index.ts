import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { initialize } from "zokrates-js";
import seedRandom from "seedrandom";

import { Proof } from "./types";
import { Storage } from "src/storage";

export class Zk extends Storage {
  rootFromPath: string = "../circuit";
  rootToPath: string = "sdk/circuit/root.zok";

  private async randomNumber(salt: String): Promise<any> {
    let randN: Array<string> = [];
    for (let i = 0; i < 4; i++) {
      const prng = seedRandom(salt, { entropy: true });
      randN.push(Math.abs(prng.int32()).toString());
    }
    return randN;
  }

  public async getNullifier(salt: String): Promise<any> {
    const prng = seedRandom(salt, { entropy: false });
    return Math.abs(prng.int32());
  }

  private async fileSystemResolver(
    fromPath: string,
    toPath: string
  ): Promise<any> {
    const location = resolve(dirname(resolve(fromPath)), toPath);
    const source = readFileSync(location).toString();
    return source;
  }

  private async getSource(fromPath: string, toPath: string): Promise<any> {
    const source = await this.fileSystemResolver(fromPath, toPath);
    return source;
  }

  private async getZokrateProvider(): Promise<any> {
    const zokratesProvider = await initialize();
    return zokratesProvider;
  }

  private async getArtifacts(source: any): Promise<any> {
    const zokratesProvider = await this.getZokrateProvider();
    const artifacts = zokratesProvider.compile(source);
    return artifacts;
  }

  private async getPreImage(params: Array<string>): Promise<any> {
    try {
      const zokratesProvider = await this.getZokrateProvider();
      const source = await this.getSource(
        `../circuit`,
        `sdk/circuit/preImage.zok`
      );
      const artifacts = await this.getArtifacts(source);
      const { output } = zokratesProvider.computeWitness(artifacts, params);
      return JSON.parse(output);
    } catch (error) {
      console.log(error);
    }
  }

  public async generateZkProof(salt: string): Promise<object> {
    try {
      const params: Array<string> = await this.randomNumber(salt);
      const zokratesProvider = await this.getZokrateProvider();
      const source = await this.getSource(this.rootFromPath, this.rootToPath);
      const artifacts = await this.getArtifacts(source);
      const preImage = await this.getPreImage(params);

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
        details: { proofBuffer, verifierKeyBuffer },
      };
    } catch (error) {
      console.log(error);
      return {
        message: error,
      };
    }
  }

  public async verifyZkProof(proofObj: Proof): Promise<object> {
    const zkP = proofObj.proofBuffer;
    const vk = proofObj.verifierKeyBuffer;
    const proof = JSON.parse(zkP);
    const verifierKey = JSON.parse(vk);
    try {
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
    } catch (error) {
      console.log(error);
      return { message: error };
    }
  }

  public async verifyZkProof1(proof: Proof): Promise<object> {
    return this.invoke(`zk/verifyProof`, {
      method: "POST",
      body: JSON.stringify(proof),
    });
  }
}
