import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button"; // shadcn button
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // shadcn card
import { Separator } from "@/components/ui/separator"; // shadcn separator for styling
import Link from "next/link";
import {
  useDynamicContext, DynamicWidget 
} from "@dynamic-labs/sdk-react-core";
import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";



export default function AttestationDetail() {
  const [data, setData] = useState(null); // Data from the API
  const [error, setError] = useState(null); // Error state
  const router = useRouter();
  const { id } = router.query;

  const { primaryWallet } = useDynamicContext();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch attestation details using the given ID
        const response = await fetch(
          `/api/querySingleAttestation?attestation_id=${id}&schema=pending`,
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result.data); // Store data
        console.log("DATA", data);
      } catch (error) {
        setError("Failed to load attestation data");
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  if (!data && !error) {
    return <div>Loading...</div>;
  }

  const handleSign = () => {
    console.log("signing document");
  };


  async function notaryStampOfApproval() {

    if (primaryWallet) {
      try {
        const publicClient = await primaryWallet.getPublicClient();
        const walletClient = await primaryWallet.getWalletClient()

        const client = new SignProtocolClient(SpMode.OnChain, {
          account: publicClient.account,
          walletClient,
          chain: EvmChains.polygonAmoy,
        });


        // const signer = publicClient.account

        console.log('about to stamp ')

        

        const attestationRes = await client.createAttestation({
          schemaId: "0x78",

          data: {

            notaries: data.notaries,
            document_title: data.document_title,
            attestation_status: data.attestation_status,
            synaps_session_id: data.synaps_session_id,
            file_url: data.file_url,
            case_status: "complete",
            notary_approved: true,
            paid: true,
            notary: primaryWallet.address,
            submitter_attest_id: data.id
          },
          indexingValue: String(primaryWallet.address).toLowerCase()
        });

        console.log("attestationRes", attestationRes)
      } catch (e) {
        console.log('e', e)
      }
    }
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Attestation Details</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="space-y-4">
              <div>
                <strong>Document Title: </strong>
                {data.document_title || "N/A"}
              </div>
              <Separator />
              <div>
                <strong>
                  {data.notary_approved
                    ? "Approved Date:"
                    : "Attestation Date:"}{" "}
                </strong>
                {Date(data.date) || "N/A"}
              </div>
              <Separator />
              <div>
                <strong>Notaries: </strong>
                {data.notaries?.join(", ") || "N/A"}
              </div>
              <Separator />
              <div>
                <strong>Attestation Status: </strong>
                {data.attestation_status || "N/A"}
              </div>
              <Separator />
              <div>
                <strong>Synaps Session ID: </strong>
                {data.synaps_session_id || "N/A"}
              </div>

              <Separator />
              <div>
                <strong>File URL: </strong>
                <Link href={data.file_url || "N/A"}>{data.file_url || "N/A"}</Link>
              </div>

              <Separator />
              <div>
                <strong>Case Status: </strong>
                {data.case_status || "N/A"}
              </div>
              <Separator />
              <div>
                <strong>Paid: </strong>
                {data.paid ? "Yes" : "No"}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-center space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
        {!data.notary_approved && <Button onClick={notaryStampOfApproval}>Sign</Button>}
      </div>
      {/* <DynamicWidget /> */}
    </div>
  );
}
