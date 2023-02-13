type Config = {
    nodeEndpoint?: string;
    apikey?: string;
    baseUri?: string;
    web3storageApiKey?: string;
    factoryAddress?: string;
};
export declare abstract class Base {
    private nodeEndpoint;
    private web3storageApiKey;
    private factoryAddress;
    private apikey;
    private baseUrl;
    constructor(config: Config);
    protected invoke<T>(endpoint: string, options?: RequestInit): Promise<any>;
    protected getWeb3StorageKey(): string;
    protected getProvider(): Promise<any>;
    protected getFactoryAddress(): string;
}
export {};
