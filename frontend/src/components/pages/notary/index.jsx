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
  //TODO: fetch the data some how
  const data = [
    {
      id: "123",
      title: "Car crash Affidavit",
      deadline: "14-05-2024",
      status: "pendingCustomer",
    },
    {
      id: "124",
      title: "Insurance Claim Form",
      deadline: "20-05-2024",
      status: "completed",
    },
    {
      id: "125",
      title: "Medical Report Submission",
      deadline: "22-05-2024",
      status: "pendingNotary",
    },
    {
      id: "126",
      title: "Property Damage Estimate",
      deadline: "01-06-2024",
      status: "pendingCustomer",
    },
    {
      id: "127",
      title: "Witness Statement",
      deadline: "05-06-2024",
      status: "completed",
    },
    {
      id: "128",
      title: "Accident Police Report",
      deadline: "10-06-2024",
      status: "pendingNotary",
    },
    {
      id: "129",
      title: "Vehicle Inspection Report",
      deadline: "15-06-2024",
      status: "pendingCustomer",
    },
    {
      id: "130",
      title: "Repair Cost Estimate",
      deadline: "20-06-2024",
      status: "completed",
    },
    {
      id: "131",
      title: "Traffic Camera Footage Request",
      deadline: "25-06-2024",
      status: "pendingNotary",
    },
    {
      id: "132",
      title: "Lawyer Consultation",
      deadline: "30-06-2024",
      status: "pendingCustomer",
    },
  ];

  const statusMap = {
    pendingCustomer: "Pending Customer Review",
    completed: "Completed",
    pendingNotary: "Pending Notary Review",
  };

  const StatusBadge = (status) => {
    const color = statusColorMap[status] || "gray"; // Default to gray if no match

    return <Badge className={`bg-${color}-500`}>{status}</Badge>;
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
