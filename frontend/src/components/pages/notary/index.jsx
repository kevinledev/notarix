import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Notary() {
  const [pendingData, setPendingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    //NOTE: completed data
    const fetchData = async () => {
      try {
        //TODO: store attestor id on sign in
        const attestor_id = "0x00B4be811627409dfEFaa7188c56aeAC7474B21b";
        const response = await fetch(
          `/api/queryAttestations?schema_id=onchain_evm_80002_0x78&attester_id=${attestor_id}&schema=completed`,
        ); // Call the API route
        if (!response.ok) {
          console.error(response.message);
          throw new Error("Network response was not ok");
        }
        const result = await response.json();

        const parsedResult = await result.data.map((data) => {
          return {
            id: data.id,
            title: data.document_title,
            status: data.case_status,
            date_completed: data.date,
            submitter_attest_id: data.submitter_attest_id,
          };
        });

        setCompletedData(parsedResult);
      } catch (error) {}
    };

    fetchData();
  }, []);

  useEffect(() => {
    //TODO: pending data
    const fetchData = async () => {
      try {
        //TODO: store attestor id on sign in
        const attestor_id = "0x00B4be811627409dfEFaa7188c56aeAC7474B21b";
        const response = await fetch(
          `/api/queryAttestations?schema_id=onchain_evm_80002_0x72&attestor_id=${attestor_id}&schema=pending`,
        ); // Call the API route
        if (!response.ok) {
          console.error(response.message);
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log("complete", completedData);
        const parsedResult = await result.data
          .map((data) => {
            return {
              id: data.id,
              title: data.document_title,
              status: data.case_status,
              deadline: data.date_submitted,
              date_submitted: data.date,
            };
          })
          .filter((parsedData) => {
            // Assuming completedData is available in the current scope
            return !completedData.some(
              (completedItem) =>
                completedItem.submitter_attest_id === parsedData.id,
            );
          });

        setPendingData(parsedResult);
      } catch (error) {}
    };

    fetchData();
  }, [completedData]);

  const statusMap = {
    pending: "Pending",
    complete: "Completed",
  };

  const handleViewPendingDetails = (id) => {
    router.push(`/notary/pending/${id}`);
  };

  const handleViewCompletedDetails = (id) => {
    router.push(`/notary/completed/${id}`);
  };
  return (
    <div className="space-y-8 p-4">
      <div>
        <h2 className="text-center text-xl font-bold mb-4">
          Requested Attestations
        </h2>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingData.map((val) => (
              <TableRow
                key={val.id}
                onClick={() => handleViewPendingDetails(val.id)}
              >
                <TableCell className="font-medium">{val.id}</TableCell>
                <TableCell>{val.title}</TableCell>
                <TableCell>
                  <Badge variant={val.status}>{statusMap[val.status]}</Badge>
                </TableCell>
                <TableCell>{Date(val.date_submitted)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Separator />

      <div>
        <h2 className="text-center text-xl font-bold mb-4">
          Completed Attestations
        </h2>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {completedData.map((val) => (
              <TableRow
                key={val.id}
                onClick={() => handleViewCompletedDetails(val.id)}
              >
                <TableCell className="font-medium">{val.id}</TableCell>
                <TableCell>{val.title}</TableCell>
                <TableCell>
                  <Badge variant={val.status}>{statusMap[val.status]}</Badge>
                </TableCell>
                <TableCell>{Date(val.date_completed)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
