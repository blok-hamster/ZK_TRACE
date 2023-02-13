type Config = {
    nodeEndpoint?: string;
    apikey?: string;
    baseUri?: string;
};
export declare abstract class Base {
    private nodeEndpoint;
    private apikey;
    private baseUrl;
    constructor(config: Config);
    protected invoke<T>(endpoint: string, options?: RequestInit): Promise<any>;
    protected getProvider(): Promise<any>;
}
export {};
