
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, Check, X } from "lucide-react";

interface Deposit {
  id: string;
  user_id: string;
  account_id: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  deposit_method: string | null;
  reference_number: string;
  admin_notes: string | null;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
  accounts: {
    account_name: string;
    account_number: string;
  };
}

const AdminDepositValidation = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const { toast } = useToast();

  const fetchDeposits = async () => {
    try {
      const { data, error } = await supabase
        .from('deposits')
        .select(`
          *,
          profiles(first_name, last_name),
          accounts(account_name, account_number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeposits(data || []);
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

  const handleDepositAction = async (depositId: string, newStatus: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('deposits')
        .update({ 
          status: newStatus,
          admin_notes: notes || null,
          validated_at: new Date().toISOString(),
          validated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', depositId);

      if (error) throw error;

      setDeposits(deposits.map(deposit => 
        deposit.id === depositId 
          ? { ...deposit, status: newStatus, admin_notes: notes || null }
          : deposit
      ));

      toast({
        title: "Success",
        description: `Deposit ${newStatus} successfully`,
      });

      setSelectedDeposit(null);
      setAdminNotes("");
    } catch (error) {
      console.error('Error updating deposit:', error);
      toast({
        title: "Error",
        description: "Failed to update deposit status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
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
      </CardHeader>
      <CardContent>
        {deposits.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No deposits found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
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
                        {deposit.profiles.first_name} {deposit.profiles.last_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{deposit.accounts.account_name}</div>
                      <div className="text-sm text-muted-foreground">{deposit.accounts.account_number}</div>
                    </div>
                  </TableCell>
                  <TableCell>{deposit.amount.toLocaleString()} {deposit.currency}</TableCell>
                  <TableCell>{deposit.deposit_method || 'N/A'}</TableCell>
                  <TableCell className="font-mono text-sm">{deposit.reference_number}</TableCell>
                  <TableCell>{getStatusBadge(deposit.status)}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(deposit.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedDeposit(deposit);
                              setAdminNotes(deposit.admin_notes || "");
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Deposit Details</DialogTitle>
                          </DialogHeader>
                          {selectedDeposit && (
                            <div className="space-y-4">
                              <div>
                                <strong>Customer:</strong> {selectedDeposit.profiles.first_name} {selectedDeposit.profiles.last_name}
                              </div>
                              <div>
                                <strong>Amount:</strong> {selectedDeposit.amount.toLocaleString()} {selectedDeposit.currency}
                              </div>
                              <div>
                                <strong>Description:</strong> {selectedDeposit.description || 'N/A'}
                              </div>
                              <div>
                                <strong>Admin Notes:</strong>
                                <Textarea
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="Add notes about this deposit..."
                                  className="mt-2"
                                />
                              </div>
                              {selectedDeposit.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleDepositAction(selectedDeposit.id, 'approved', adminNotes)}
                                    className="flex-1"
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDepositAction(selectedDeposit.id, 'rejected', adminNotes)}
                                    className="flex-1"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {deposit.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleDepositAction(deposit.id, 'approved')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDepositAction(deposit.id, 'rejected')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
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
