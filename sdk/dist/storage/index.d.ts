import { Base } from "src/base";
import { Data } from "./types";
export declare class Storage extends Base {
    readCid(cid: string): Promise<Data>;
}
