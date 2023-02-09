import { Base } from "src/base";
import { Data, CarData, CreateCarReturn, IpfsReturn } from "./types";
export declare class Storage extends Base {
    readCid(cid: string): Promise<Data>;
    readCarData(traceAddress: string): Promise<CarData>;
    createCar(data: Data): Promise<CreateCarReturn>;
    uploadCar(traceAddress: string): Promise<IpfsReturn>;
    updateCar(data: Data, traceAddress: string): Promise<IpfsReturn>;
}
