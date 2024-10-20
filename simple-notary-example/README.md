`node --env-file=.env index.js`

# Proposed Flow

## Offline

1. Create schema with https://app.sign.global/create-schema
```json
{
    "fileURL": "https://...",
    "identity": "12345"
}
```
1. Take note of full schema ID

## Client side (this is the person requesting the notarization)
1. Upload file to blockchain and fetch the URL
1. Call the identity verification and fetch the URL
    - Somehow need to tie together the responses from 1 & 2 - think of it as proving that the files uploaded were actually from the client.
1. Store this information in the schema format somewhere onchanin??.
1. Create a unique URL to send to the Notary (described below).

## Notary side (this is the person who "stamps" the document)

1. Opening the unique URL will open the prepopulated onchain schema in step 3 above.
    - The notary will have the populated `fileURL` and `identity` data.
1. Create the attestation:
```javascript
const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.polygonAmoy,
    account: privateKeyToAccount(privateKey), // This is to prove the notary is... the notary. Nobody else but the notary can sign attestations since the private key is unique.
});

const attestationRes = await client.createAttestation({
    schemaId: schemaId,
    data: {
        fileURL: "https://....",
        identity: "12345"
    },
    indexingValue: signer.toLowerCase() // this doesn't matter
});
```

## View the attestation
1. Navigate to the [attestation viewer](https://testnet-scan.sign.global/attestation/onchain_evm_80002_0x70).
    - `Attester` == the address of the Notary (this is implicitly populated when the Notary creates the attestation)
    - `Decoded Data` will contain the `fileURL` and the `identity`, which can be used to verify.