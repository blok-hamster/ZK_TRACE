import { Base } from "src/base";
import { Data, CarData, CreateCarReturn, IpfsReturn } from "./types";

export class Storage extends Base {
  public async readCid(cid: string): Promise<Data> {
    return this.invoke(`storage/readData/${cid}`);
  }

  public async readCarData(traceAddress: string): Promise<CarData> {
    return this.invoke(`storage/createCar/${traceAddress}`);
  }

  public async createCar(data: Data): Promise<CreateCarReturn> {
    return this.invoke(`storage/createCar`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  public async uploadCar(traceAddress: string): Promise<IpfsReturn> {
    return this.invoke(`storage/uploadCar/${traceAddress}`, {
      method: "POST",
    });
  }

  public async updateCar(
    data: Data,
    traceAddress: string
  ): Promise<IpfsReturn> {
    return this.invoke(`storage/createCar/${traceAddress}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}
