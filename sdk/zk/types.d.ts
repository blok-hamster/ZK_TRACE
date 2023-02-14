export declare type Proof = {
    proofBuffer: string;
    verifierKeyBuffer: string;
};
export declare type GenerateProofReturn = {
    message: string;
    details: {
        proofBuffer: string;
        verifierKeyBuffer: string;
        nullifier: string;
    };
};
