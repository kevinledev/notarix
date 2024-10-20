import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AttestationDetail() {
  const [data, setData] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        //TODO: store attestor id on sign in
        const attestor_id = "0x00B4be811627409dfEFaa7188c56aeAC7474B21b";
        console.log("HHEHEHE", id);
        const response = await fetch(
          `/api/querySingleAttestation?attestation_id=${id}`,
        ); // Call the API route
        if (!response.ok) {
          console.error(response.message);
          throw new Error("Network response was not ok");
        }
        const result = await response.json();

        setData(result.data);
      } catch (error) {}
    };

    fetchData();
  }, [id]);

  console.log("hi", data);

  return <>{data.document_title}</>;
}
