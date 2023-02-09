export declare type Data = {
  traceAddress: string;
  verifiersRoot: string;
  verifiers: Array<string>;
  txDetails: object;
  previousBlockCid: string;
};

export declare type CarData = {
  blockCid: string;
  data: object;
  traceAddress: string;
};

export declare type CreateCarReturn = {
  message: string;
  data: object;
};

export declare type IpfsReturn = {
  message: string;
  IpfsCid: string;
};
