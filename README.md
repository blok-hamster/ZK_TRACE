# zkTrace (Blockchain native supply chain managment protocol)

zkTrace is a protocol that combines the power of blockchain for trustlessness, and zero knowledge for privacy, to provide safe and confidential business processes, correctly order events and increase work flow at no cost (gasless).

The protocol provides the Trace Agreement smart contract that handles the entire lifecycle of the supply chain. The Trace Agreement contract becomes active after an agreement has been met between supplier and buyer. A cryptographic zero knowledge proof is generated for the trace agreement. This is to validate the private collaborations between parties without leaking sensitive data.

It is built to ensure easy and trustless agreement between corporations and entities.

zkTrace allows you to customize and describe business processes, regardless of how complex they are, using smart contracts.

All Trace agreement business logic and data are encrypted and stored on IPFS using IPLD (Inter-Planetary-Linked-Data). This ensures the Trace agreement data can always be traced and verified.

## Verifying Trace agreement

The verifier addresses are not stored on the smart contract. They are encrypted and added to the trace data stored on IPFS on intilization of trace agreemenmt. zkTrace uses MerkelTree and unique nullifiers to ensure privacy and coustomization of the different stages of the supply chain. Hence there are no limit to the amount of verifiers a Trace agreement contract can have.

## Interracting with the protocol

zkTrace protocol provides a javascript SDK the can be used to interract with the protocol. This SDK provides all the methods to needed integrate or build with zkTrace

### Using zk-trace-sdk @v1.0.0

First import zk-trace-sdk

```
npm i zk-trace-sdk

```

```
import ZkTrace from "zk-trace-sdk";
import { ethers, Wallet } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const traceClient = new ZkTrace({
  nodeEndpoint: process.env.NODE_RPC_URL,
  factoryAddress: "0x00a95101C4fe0fb4Cf659A6903703e10F7544059", //Filecoin-hyperspace testnet
  traceHubAddress: "0x0DA397b9575429f25918592174103EecfF5a781A", //Filecoin-hyperspace testnet
  web3storageApiKey: process.env.WEB3_STORAGE_KEY,
});

@params privacy can either be (1 for public) or (2 for private)

const creatTraceAgreement = async (traceAdmin, supplier, privacy) = {

    const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_RPC_URL);

    /**
     const provider = await traceClient.getProvider()
     */

    const wallet = new Wallet(process.env.PRIVATE_KEY);
    const signer = wallet.connect(provider);

    const result = await traceClient.createTraceAgreement(
      traceAdmin,
      supplier,
      privacy,
      signer
    );

    console.log(result);

    /**
        {
            message: "ok",
            transactionHash: "0x1669b851a52e88d8e8ba5de03c24216e0f33b7e4f0dc35ccee65edfea81fd074",
            details: {
                agreementAddress: "0x09bE60B98b1766bFD5318bc649fdC5de3498F847",
                agreementId: "10"
            }
        }
    */
}

```

web3.storage is used as a pinning service for easy pinning of The IPLD data blocks or CAR file.
web3StorageApiKey is used to create a storage instance in the SDK. This can be gotten from https://web3.storage/
-Create an account
-Request an apiKey.

## View encrypted IPLD data

```
import ZkTrace from "zk-trace-sdk";
import { ethers, Wallet } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const traceClient = new ZkTrace({
  nodeEndpoint: process.env.NODE_RPC_URL,
  factoryAddress: "0x00a95101C4fe0fb4Cf659A6903703e10F7544059", //Filecoin-hyperspace testnet
  traceHubAddress: "0x0DA397b9575429f25918592174103EecfF5a781A", //Filecoin-hyperspace testnet
  web3storageApiKey: process.env.WEB3_STORAGE_KEY,
});

const readData = async (cid, key) => {
    const result = await traceClient.decryptData(cid, key);
    console.log(result);

    /**
        {
            previousBlockId: "",
            verifiers: [
                <VERIFIER 1 ADDRESS>,
                <VERIFIER 2 ADDRESS>,
                <VERIFIER 3 ADDRESS>,
                <VERIFIER 4 ADDRESS>
                ],
            txDetails: {
                supplier: <SUPPLIER ADDRESS>,
                pickupDate: <DATE IN UINX TIMESTAMP>,
                totalPrice: <PRICE>,
                location: <PICKUP VERIFIED PICKUP LOCATION>,
                items: [
                    {name: "Under armour", quantity: 10000,},
                    {name: "Nike", quantity: 2000}
                ],
            }
        }
     */

     //@notice data returned is equal to data encrypted.
     //@dev The txDetails object is fully customizable to your need / data modual you wish to follow.
}

```

## Deployed addresses

### Famtom Testnet

| Smart contract             | Address                                    |
| -------------------------- | ------------------------------------------ |
| traceFactoryAddress        | 0x3907977976DBB9eAd7e825b3d34B5d0F97D22bC5 |
| traceHubAddress            | 0x839201D2756E8fe9ee9a32170EC295E40F5fb22d |
| traceImplimentationAddress | 0x8E895b6A4440b797D7b2d018a3f105F59fB26D3d |

@v1.0.0:
-Initial implementation.

@v1.0.1:
-Added method to view IPLD encrypted data.
-EIP1559 support
