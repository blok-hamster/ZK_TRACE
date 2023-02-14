import { ethers } from "ethers";
import fetch from "isomorphic-unfetch";

type Config = {
  nodeEndpoint?: string;
  apikey?: string;
  baseUri?: string;
  web3storageApiKey?: string;
  factoryAddress?: string;
  traceHubAddress?: string;
};

export abstract class Base {
  private nodeEndpoint: string;
  private web3storageApiKey: string;
  private factoryAddress: string;
  private apikey: string;
  private baseUrl: string;
  private traceHubAddress: string;

  constructor(config: Config) {
    this.nodeEndpoint = config.nodeEndpoint || `http://127.0.0.1:8545`;
    this.baseUrl = config.baseUri || `http://localhost:5000/`;
    this.apikey = config.apikey;
    this.web3storageApiKey = config.web3storageApiKey;
    this.factoryAddress =
      config.factoryAddress || "0x610178da211fef7d417bc0e6fed39f05609ad788";
    this.traceHubAddress =
      config.traceHubAddress || "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
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

  protected getWeb3StorageKey(): string {
    return this.web3storageApiKey;
  }

  protected async getProvider(): Promise<any> {
    return new ethers.providers.JsonRpcProvider(this.nodeEndpoint);
  }

  protected getFactoryAddress(): string {
    return this.factoryAddress;
  }

  protected getTraceHubAddress(): string {
    return this.traceHubAddress;
  }
}
