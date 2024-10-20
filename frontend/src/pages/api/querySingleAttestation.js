import { decodeSignData } from "@/lib/utils";
import { IndexService } from "@ethsign/sp-sdk";

export default async function handler(req, res) {
  try {
    const { attestation_id, schema } = req.query;
    const indexService = new IndexService("testnet");
    const result = await indexService.queryAttestation(attestation_id);
    console.log("JEHEHEHE", result);

    const decodedResult = {
      id: result.id,
      date: result.attestTimestamp,
      ...decodeSignData(result.data, schema),
    };
    console.log(decodedResult);

    return res.status(200).json({ success: true, data: decodedResult });
  } catch (error) {
    return res.status(400).json({
      success: false,
      data: null,
    });
  }
}
