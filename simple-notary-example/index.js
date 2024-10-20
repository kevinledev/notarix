'use strict';

import { SignProtocolClient, SpMode, EvmChains, IndexService } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";

// network: polygon amoy
// schema URL: https://testnet-scan.sign.global/schema/onchain_evm_80002_0x5d

const privateKey = process.env.PRIVATE_KEY;
const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.polygonAmoy,
    account: privateKeyToAccount(privateKey), // Optional, depending on environment
});

(async function() {

    ////////////////////////////////////////
    //////////   CREATE SCHEMA    //////////
    ////////////////////////////////////////

    // This will create the schema (this is stored on-chain presumably)
    // this only needs to be run one time pretty sure.

    // const schemaRes = await client.createSchema({
    //     name: "Simple Notary Example",
    //     data: [
    //         { name: "contractDetails", type: "string" },
    //         { name: "signer", type: "address" },
    //     ],
    // });

    // returns something like
    const schemaRes = {
        schemaId: '0x5d',
        txHash: '0xebd9d8bc3a66dfe207a4c99ce9ce50df48d2323c4021ab185089f88fc8f865e3'
    }; // TODO: hardcoded for test.

    console.log(schemaRes);

    const schemaShortId = schemaRes.schemaId;

    ////////////////////////////////////////
    ////////// CREATE ATTESTATION //////////
    ////////////////////////////////////////

    const signer = process.env.TEST_SIGNER_ADDRESS;

    // const attestationRes = await client.createAttestation({
    //     schemaId: schemaId,
    //     data: {
    //         contractDetails: "test attestation",
    //         signer: signer
    //     },
    //     indexingValue: signer.toLowerCase()
    // });

    // returns something like
    const attestationRes = {
        attestationId: '0x70',
        txHash: '0x315bdc3f925f048215eca34c7bf9c88231bb78ad774410027359b82bc058b598',
        indexingValue: '0x088f72c9d2a23e825435d0c28c0e1ece09f0eeec'
    }; // TODO: hardcoded for test.

    console.log(attestationRes);

    const attestationShortId = attestationRes.attestationId;

    ////////////////////////////////////////
    ////////// QUERY ATTESTATION  //////////
    ////////////////////////////////////////

    // construct the full IDs
    const chainId = 80002;

    const fullSchemaId = `onchain_evm_${chainId}_${schemaShortId}`;
    const attestationId = `onchain_evm_${chainId}_${attestationShortId}`;

    console.log("Full Schema ID: " + fullSchemaId);
    console.log("Full Attestation ID: " + attestationId);

    // perform the query
    const indexService = new IndexService("testnet");
    const attestationListRes = await indexService.queryAttestationList({
        schemaId: fullSchemaId,
        attester: process.env.TEST_SIGNER_ADDRESS,
        page: 1,
        mode: "onchain",
        indexingValue: process.env.TEST_SIGNER_ADDRESS.toLowerCase(), // this is the address the attestation was requested for.
    });

    console.log(attestationListRes);
})();
