
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface DepositWithDetails extends Tables<"deposits"> {
  profiles?: {
    first_name: string;
    last_name: string;
  } | null;
  accounts?: {
    account_name: string;
    account_number: string;
  } | null;
}

const AdminDepositValidation = () => {
  const [deposits, setDeposits] = useState<DepositWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedDeposit, setSelectedDeposit] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDeposits = async () => {
    try {
      const { data, error } = await supabase
        .from('deposits')
        .select(`
          *,
          profiles!user_id(first_name, last_name),
          accounts!account_id(account_name, account_number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Handle the data properly by ensuring it matches our interface
      const processedData = (data || []).map(deposit => ({
        ...deposit,
        profiles: Array.isArray(deposit.profiles) ? deposit.profiles[0] : deposit.profiles,
        accounts: Array.isArray(deposit.accounts) ? deposit.accounts[0] : deposit.accounts
      }));
      
      setDeposits(processedData);
    } catch (error) {
      console.error('Error fetching deposits:', error);
      toast({
        title: "Error",
        description: "Failed to fetch deposits",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleDepositAction = async (depositId: string, action: 'approved' | 'rejected', reason?: string) => {
    try {
      const updateData: any = {
        status: action,
        validated_at: new Date().toISOString(),
      };

      if (action === 'rejected' && reason) {
        updateData.rejection_reason = reason;
      }

      const { error } = await supabase
        .from('deposits')
        .update(updateData)
        .eq('id', depositId);

      if (error) throw error;

      // If approved, update account balance manually
      if (action === 'approved') {
        const deposit = deposits.find(d => d.id === depositId);
        if (deposit) {
          // Get current account balance
          const { data: accountData, error: accountError } = await supabase
            .from('accounts')
            .select('balance')
            .eq('id', deposit.account_id)
            .single();

          if (accountError) throw accountError;

          // Update balance
          const newBalance = Number(accountData.balance) + Number(deposit.amount);
          const { error: updateError } = await supabase
            .from('accounts')
            .update({ balance: newBalance })
            .eq('id', deposit.account_id);

          if (updateError) throw updateError;
        }
      }

      await fetchDeposits();
      toast({
        title: "Success",
        description: `Deposit ${action} successfully`,
      });

      setRejectionReason("");
      setSelectedDeposit(null);
    } catch (error) {
      console.error('Error updating deposit:', error);
      toast({
        title: "Error",
        description: "Failed to update deposit",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading deposits...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposit Validation</CardTitle>
        <CardDescription>Review and validate customer deposit requests</CardDescription>
      </CardHeader>
      <CardContent>
        {deposits.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No deposit requests found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deposits.map((deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {deposit.profiles?.first_name} {deposit.profiles?.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {deposit.description || 'No description'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{deposit.accounts?.account_name}</div>
                      <div className="text-sm text-muted-foreground">{deposit.accounts?.account_number}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {Number(deposit.amount).toLocaleString()} {deposit.currency}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{deposit.reference_number}</TableCell>
                  <TableCell>{getStatusBadge(deposit.status)}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(deposit.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {deposit.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleDepositAction(deposit.id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedDeposit(deposit.id)}
                            >
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Deposit</DialogTitle>
                              <DialogDescription>
                                Please provide a reason for rejecting this deposit request.
                              </DialogDescription>
                            </DialogHeader>
                            <Textarea
                              placeholder="Enter rejection reason..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                            />
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setRejectionReason("");
                                  setSelectedDeposit(null);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  if (selectedDeposit) {
                                    handleDepositAction(selectedDeposit, 'rejected', rejectionReason);
                                  }
                                }}
                                disabled={!rejectionReason.trim()}
                              >
                                Reject Deposit
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDepositValidation;
