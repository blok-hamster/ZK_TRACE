import { ethers } from "ethers";
import fetch from "isomorphic-unfetch";

type Config = {
  nodeEndpoint?: string;
  apikey?: string;
  baseUri?: string;
};

export abstract class Base {
  private nodeEndpoint: string;
  private apikey: string;
  private baseUrl: string;

  constructor(config: Config) {
    this.nodeEndpoint =
      config.nodeEndpoint || `https://api.hyperspace.node.glif.io/rpc/v1`;
    this.baseUrl = config.baseUri || `http://localhost:5000/`;
    this.apikey = config.apikey;
  }

  protected invoke<T>(endpoint: string, options?: RequestInit): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "content-type": "application/json",
      apiKey: this.apikey,
    };

    const config = {
      ...options,
      headers,
    };

    return fetch(url, config).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("call failed");
      }
    });
  }

  protected async getProvider(): Promise<any> {
    return new ethers.providers.JsonRpcProvider(this.nodeEndpoint);
  }
}
