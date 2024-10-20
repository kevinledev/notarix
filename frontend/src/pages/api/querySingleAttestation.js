import { decodeSignData } from "@/lib/utils";
import { IndexService } from "@ethsign/sp-sdk";

export default async function handler(req, res) {
  try {
    const { attestation_id } = req.query;
    console.log("WE GONN TRU", req.query);
    const indexService = new IndexService("testnet");
    const result = await indexService.queryAttestation(attestation_id);

    const decodedResult = decodeSignData(result.data);
    console.log(decodedResult);

    return res.status(200).json({ success: true, data: decodedResult });
  } catch (error) {
    console.log("WE FAILED", error);
    return res.status(400).json({
      success: false,
      data: null,
    });
  }
}
