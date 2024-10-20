`node --env-file=.env index.js`

# Proposed Flow

## Offline

1. Create CLIENT schema with https://app.sign.global/create-schema
```json
{
    "fileURL": "https://...",
    "sessionId": "synaps.io"
}
```

1. Create NOTARY schema
```json
{
    "clientSchemaID": "..._5d"
}
```

## Client side (this is the person requesting the notarization)
1. Upload file to blockchain and fetch the URL
1. Call the identity verification and fetch the sessionID
1. Store `fileURL` and `sessionID` in the schema and attest using the client's private key.
```javascript
const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.polygonAmoy,
    account: privateKeyToAccount(privateKey), // Client's wallet private key
});

const attestationRes = await client.createAttestation({
    schemaId: schemaId,
    data: {
        fileURL: "...",
        sessionId: "..."
    },
    indexingValue: signer.toLowerCase() // this doesn't matter
});
```
1. The important thing here is to be able to cryptographically prove that the client's wallet address (the `attestor` address on sign protocol) is linked to to Synaps.io `sessionId`. Someone needs to look into this.
1. Create a unique URL and send the client attestation ID to the Notary (described below).

## Notary side (this is the person who "stamps" the document)

1. Opening the unique URL will provide the client attestation address in step 3 above.
    - Think of it the client first provided the document and signed. Now the notary has the client's ID verfication and the client's wallet address, and if they match then the Notary will provide its own attestation (like a real notary)
1. Create the attestation:
```javascript
const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.polygonAmoy,
    account: privateKeyToAccount(privateKey), // This is to prove the notary is... the notary. Nobody else but the notary can sign attestations since the private key is unique.
});

const attestationRes = await client.createAttestation({
    schemaId: schemaId,
    data: {
        clientSchemaId: "_5d"
    },
    indexingValue: signer.toLowerCase() // this doesn't matter
});
```

## View the attestation(s)
1. Navigate to the [attestation viewer](https://testnet-scan.sign.global/attestation/onchain_evm_80002_0x70).
    - `Attester` == the address of the Notary (this is implicitly populated when the Notary creates the attestation)
    - `Decoded Data` will contain the `fileURL` and the `identity`, which can be used to verify.
