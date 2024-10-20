import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Notary() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //TODO: store attestor id on sign in
        const attestor_id = "0x00B4be811627409dfEFaa7188c56aeAC7474B21b";
        const response = await fetch(
          `/api/queryAttestations?attester_id=${attestor_id}`,
        ); // Call the API route
        if (!response.ok) {
          console.error(response.message);
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const parsedResult = await result.data.map((data) => {
          return {
            id: data.synaps_session_id,
            title: data.document_title,
            status: data.case_status,
            deadline: "20-05-2024",
          };
        });

        setData(parsedResult);
      } catch (error) {}
    };

    fetchData();
  }, []);

  const statusMap = {
    pendingCustomer: "Pending Customer Review",
    completed: "Completed",
    pendingNotary: "Pending Notary Review",
  };

  return (
    <Table>
      <TableCaption>List of Attestations</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Deadline</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((val) => (
          <TableRow key={val.id}>
            <TableCell className="font-medium">{val.id}</TableCell>
            <TableCell>{val.title}</TableCell>
            <TableCell>
              <Badge variant={val.status}>{statusMap[val.status]}</Badge>
            </TableCell>
            <TableCell>{val.deadline}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
