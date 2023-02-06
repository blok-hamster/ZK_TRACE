import { Base } from "src/base";
import { Data } from "./types";

export class Storage extends Base {
  public async readCid(cid: string): Promise<Data> {
    return this.invoke(`storage/readData/${cid}`);
  }
}
