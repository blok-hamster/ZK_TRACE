import { Proof } from "./types";
import { Storage } from "src/storage";

export class Zk extends Storage {
  public async generateZkProof(input: Array<string>): Promise<object> {
    return this.invoke(`zk/generateProof`, {
      method: "POST",
      body: JSON.stringify({ input: input }),
    });
  }

  public async verifyZkProof(proof: Proof): Promise<object> {
    return this.invoke(`zk/verifyProof`, {
      method: "POST",
      body: JSON.stringify(proof),
    });
  }
}
