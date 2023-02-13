export declare type NewTraceData = {
    verifierRoot: string;
    nullifiers: Array<string>;
    agreementUri: string;
};
export declare type Data = {
    traceAddress: string;
    verifiersRoot: string;
    verifiers: Array<string>;
    txDetails: object;
    previousBlockCid: string;
};
export declare type verifierDetails = {
    message: string;
    details: {
        verifiersRoot: string;
        nullifiers: Array<string>;
        argumentUri: string;
    };
};
