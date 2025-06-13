
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  transaction_id: string;
  customer_id: string | null;
  transaction_type: string;
  from_account: string | null;
  to_account: string | null;
  amount: number;
  status: string;
  created_at: string;
  customer: {
    first_name: string;
    last_name: string;
  } | null;
}

const AdminTransactionLog = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          customer:profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Error",
          description: "Failed to fetch transactions",
          variant: "destructive",
        });
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-green-100 text-green-800">Complete</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTransactionTypeBadge = (type: string) => {
    const colorMap: Record<string, string> = {
      transfer: "bg-blue-100 text-blue-800",
      withdrawal: "bg-orange-100 text-orange-800",
      deposit: "bg-green-100 text-green-800",
      payment: "bg-purple-100 text-purple-800",
      fee: "bg-gray-100 text-gray-800",
      refund: "bg-teal-100 text-teal-800",
    };
    
    return (
      <Badge className={colorMap[type] || "bg-gray-100 text-gray-800"}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="p-4">Loading transactions...</div>;
  }

  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          No transactions found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-mono text-sm">
                  {transaction.transaction_id}
                </TableCell>
                <TableCell>
                  {transaction.customer ? 
                    `${transaction.customer.first_name} ${transaction.customer.last_name}` : 
                    'N/A'
                  }
                </TableCell>
                <TableCell>
                  {getTransactionTypeBadge(transaction.transaction_type)}
                </TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {transaction.from_account || 'N/A'}
                </TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {transaction.to_account || 'N/A'}
                </TableCell>
                <TableCell className="font-semibold">
                  {transaction.amount.toLocaleString()} FCFA
                </TableCell>
                <TableCell>
                  {getStatusBadge(transaction.status)}
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(transaction.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminTransactionLog;
