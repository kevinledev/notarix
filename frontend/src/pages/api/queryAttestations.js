import {
  IndexService,
  decodeOnChainData,
  DataLocationOnChain,
} from "@ethsign/sp-sdk";

const SCHEMA_DETAILS = [
  { name: "notaries", type: "string[]" },
  { name: "document_title", type: "string" },
  { name: "attestation_status", type: "string" },
  { name: "synaps_session_id", type: "string" },
  { name: "affadavit_recording", type: "string" },
  { name: "case_status", type: "string" },
  { name: "paid", type: "bool" },
];

export default async function handler(req, res) {
  try {
    const indexService = new IndexService("testnet");

    const response = await indexService.queryAttestationList({
      schemaId: "onchain_evm_80002_0x6d", // Your full schema's ID
      attester: req.attester_id, // Alice's address
      page: 1,
      mode: "onchain", // Data storage location
    });

    const decodedResponse = response.rows.map((row) => {
      return decodeOnChainData(
        row.data,
        DataLocationOnChain.ONCHAIN,
        SCHEMA_DETAILS,
      );
    });

    return res.status(200).json({ success: true, data: decodedResponse });
  } catch (error) {
    console.log("WE FAILED", error);
    return res.status(400).json({
      success: false,
      data: null,
    });
  }
}
