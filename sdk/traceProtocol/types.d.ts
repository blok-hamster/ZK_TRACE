export declare type NewTraceData = {
    verifierRoot: string;
    nullifiers: Array<string>;
    agreementUri: string;
};
export declare type verifierDetails = {
    message: string;
    details: {
        verifiersRoot: string;
        nullifiers: Array<string>;
    };
};
export declare type CreateProofReturn = {
    proofBuffer: string;
    verifierKeyBuffer: string;
    nullifier: string;
};
export declare type TraceVerfierReturn = {
    message: string;
    details: {
        verifiedCount: number;
        verified: boolean;
    };
};
export declare type InitializeAgreementReturn = {
    message: string;
    transactionHash: string;
    verificationDetails: Array<object>;
    encryptionKey: string;
};
export declare type CreateAgreementReturn = {
    message: string;
    transactionHash: string;
    details: {
        agreementAddress: string;
        agreementId: number;
    };
};
export declare type Data = {
    traceAddress: string;
    verifiersRoot: string;
    verifiers: Array<string>;
    txDetails: object;
    previousBlockCid: string;
};
