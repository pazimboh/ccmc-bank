
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Sample transaction data
const transactionData = [
  {
    id: "TXN-45678",
    type: "transfer",
    from: "Alex Johnson (ID: 1)",
    to: "Sarah Lee (ID: 4)",
    amount: 300000.00,
    date: "2023-05-18T09:30:00Z",
    status: "complete",
  },
  {
    id: "TXN-45677",
    type: "withdrawal",
    from: "Maria Garcia (ID: 2)",
    to: "ATM #4532",
    amount: 120000.00,
    date: "2023-05-17T15:45:00Z",
    status: "complete",
  },
  {
    id: "TXN-45676",
    type: "deposit",
    from: "Cash Deposit",
    to: "John Smith (ID: 3)",
    amount: 600000.00,
    date: "2023-05-17T11:20:00Z",
    status: "complete",
  },
  {
    id: "TXN-45675",
    type: "payment",
    from: "Robert Chen (ID: 5)",
    to: "Mortgage Payment",
    amount: 750000.00,
    date: "2023-05-15T08:15:00Z",
    status: "complete",
  },
  {
    id: "TXN-45674",
    type: "fee",
    from: "System",
    to: "Alex Johnson (ID: 1)",
    amount: 15000.00,
    date: "2023-05-14T00:00:00Z",
    status: "complete",
  },
  {
    id: "TXN-45673",
    type: "transfer",
    from: "Maria Garcia (ID: 2)",
    to: "External Account",
    amount: 210000.00,
    date: "2023-05-12T16:30:00Z",
    status: "pending",
  },
  {
    id: "TXN-45672",
    type: "refund",
    from: "Merchant Refund",
    to: "John Smith (ID: 3)",
    amount: 45300.00,
    date: "2023-05-10T13:40:00Z",
    status: "complete",
  },
];

const AdminTransactionLog = () => {
  const [transactions, setTransactions] = useState(transactionData);
  
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "transfer":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Transfer</Badge>;
      case "withdrawal":
        return <Badge variant="outline" className="border-red-500 text-red-500">Withdrawal</Badge>;
      case "deposit":
        return <Badge variant="outline" className="border-green-500 text-green-500">Deposit</Badge>;
      case "payment":
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Payment</Badge>;
      case "fee":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Fee</Badge>;
      case "refund":
        return <Badge variant="outline" className="border-teal-500 text-teal-500">Refund</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <span className="text-green-500 text-sm">Complete</span>;
      case "pending":
        return <span className="text-yellow-500 text-sm">Pending</span>;
      case "failed":
        return <span className="text-red-500 text-sm">Failed</span>;
      default:
        return <span className="text-gray-500 text-sm">{status}</span>;
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
              <TableCell>{getTypeBadge(transaction.type)}</TableCell>
              <TableCell>{transaction.from}</TableCell>
              <TableCell>{transaction.to}</TableCell>
              <TableCell className="font-medium">{transaction.amount.toLocaleString()} FCFA</TableCell>
              <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-between p-4">
        <div className="text-sm text-muted-foreground">
          Showing <strong>7</strong> of <strong>240</strong> transactions
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-2 py-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-2 py-1 text-sm bg-primary/10 rounded text-primary">1</button>
          <button className="px-2 py-1 text-sm text-muted-foreground hover:text-foreground">2</button>
          <button className="px-2 py-1 text-sm text-muted-foreground hover:text-foreground">3</button>
          <button className="px-2 py-1 text-sm text-muted-foreground hover:text-foreground">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionLog;
