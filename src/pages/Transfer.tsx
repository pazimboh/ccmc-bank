
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { Send, ArrowUpRight, ArrowDownLeft, Building2 } from "lucide-react";

<<<<<<< HEAD:src/pages/Transfer.tsx
const Transfer = () => { // Renamed component
  const [activeTab, setActiveTab] = useState("transfer"); // Updated activeTab
  const { profile, user, isLoading: authLoading, refreshUserData } = useAuth();
  const { toast } = useToast();

=======
const Payments = () => {
  const [activeTab, setActiveTab] = useState("payments");
>>>>>>> 13ce39cf6e5937ccecb11ac700a85fb78b0b4f5d:src/pages/Payments.tsx
  const [accounts, setAccounts] = useState<Tables<"accounts">[]>([]);
  const [transfers, setTransfers] = useState<Tables<"transfers">[]>([]);
  const [transferData, setTransferData] = useState({
    from_account_id: '',
    recipient_account_number: '',
    recipient_name: '',
    amount: '',
    transfer_type: 'external',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
<<<<<<< HEAD:src/pages/Transfer.tsx
    document.title = "Transfer - CCMC Bank"; // Updated document title
  }, []);

  useEffect(() => {
    if (!authLoading && user && profile?.id) {
      fetchPageData();
    } else if (!authLoading) {
      setIsLoading(false); // Auth not loading, but no user/profile
=======
    document.title = "Payments - CCMC Bank";
    if (profile?.id) {
      fetchAccountsAndTransfers();
>>>>>>> 13ce39cf6e5937ccecb11ac700a85fb78b0b4f5d:src/pages/Payments.tsx
    }
  }, [profile?.id]);

  const fetchAccountsAndTransfers = async () => {
    try {
      // Fetch user accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', profile?.id);

      if (accountsError) throw accountsError;
      setAccounts(accountsData || []);

      // Fetch transfers
      const { data: transfersData, error: transfersError } = await supabase
        .from('transfers')
        .select('*')
        .eq('from_user_id', profile?.id)
        .order('created_at', { ascending: false });

      if (transfersError) throw transfersError;
      setTransfers(transfersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferData.from_account_id || !transferData.recipient_account_number || 
        !transferData.recipient_name || !transferData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find the from account
      const fromAccount = accounts.find(acc => acc.id === transferData.from_account_id);
      if (!fromAccount) {
        toast({
          title: "Error",
          description: "Invalid account selected",
          variant: "destructive",
        });
        return;
      }

      // Check if sufficient balance
      if (Number(fromAccount.balance) < Number(transferData.amount)) {
        toast({
          title: "Error",
          description: "Insufficient balance",
          variant: "destructive",
        });
        return;
      }

      // Check if account is frozen
      if (fromAccount.status === 'frozen') {
        toast({
          title: "Error",
          description: "Cannot transfer from a frozen account",
          variant: "destructive",
        });
        return;
      }

      // Generate reference number
      const referenceNumber = 'TXN' + Math.random().toString().substr(2, 8);

      // Create transfer record
      const { error: transferError } = await supabase
        .from('transfers')
        .insert({
          from_user_id: profile?.id,
          from_account_id: transferData.from_account_id,
          recipient_account_number: transferData.recipient_account_number,
          recipient_name: transferData.recipient_name,
          amount: Number(transferData.amount),
          currency: 'FCFA',
          transfer_type: transferData.transfer_type,
          description: transferData.description,
          reference_number: referenceNumber,
          status: 'completed'
        });

      if (transferError) throw transferError;

      // Update account balance
      const newBalance = Number(fromAccount.balance) - Number(transferData.amount);
      const { error: balanceError } = await supabase
        .from('accounts')
        .update({ balance: newBalance })
        .eq('id', transferData.from_account_id);

      if (balanceError) throw balanceError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          customer_id: profile?.id,
          account_id: transferData.from_account_id,
          transaction_id: referenceNumber,
          transaction_type: 'transfer',
          amount: Number(transferData.amount),
          status: 'complete',
          description: `Transfer to ${transferData.recipient_name}`,
          reference_number: referenceNumber,
          currency: 'FCFA',
          to_account: transferData.recipient_account_number
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Success",
        description: "Transfer completed successfully",
      });

      // Reset form
      setTransferData({
        from_account_id: '',
        recipient_account_number: '',
        recipient_name: '',
        amount: '',
        transfer_type: 'external',
        description: ''
      });

      // Refresh data
      fetchAccountsAndTransfers();
    } catch (error) {
      console.error('Error processing transfer:', error);
      toast({
        title: "Error",
        description: "Failed to process transfer",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6">
          <div className="container mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Payments & Transfers</h1>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Transfer Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send Money
                  </CardTitle>
                  <CardDescription>
                    Transfer money to another account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="from_account">From Account</Label>
                    <Select value={transferData.from_account_id} onValueChange={(value) => setTransferData({...transferData, from_account_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.account_name} - {Number(account.balance).toLocaleString()} FCFA
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="recipient_account">Recipient Account Number</Label>
                    <Input
                      id="recipient_account"
                      value={transferData.recipient_account_number}
                      onChange={(e) => setTransferData({...transferData, recipient_account_number: e.target.value})}
                      placeholder="Enter account number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="recipient_name">Recipient Name</Label>
                    <Input
                      id="recipient_name"
                      value={transferData.recipient_name}
                      onChange={(e) => setTransferData({...transferData, recipient_name: e.target.value})}
                      placeholder="Enter recipient name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount (FCFA)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={transferData.amount}
                      onChange={(e) => setTransferData({...transferData, amount: e.target.value})}
                      placeholder="Enter amount"
                    />
                  </div>

                  <div>
                    <Label htmlFor="transfer_type">Transfer Type</Label>
                    <Select value={transferData.transfer_type} onValueChange={(value) => setTransferData({...transferData, transfer_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Internal Transfer</SelectItem>
                        <SelectItem value="external">External Transfer</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={transferData.description}
                      onChange={(e) => setTransferData({...transferData, description: e.target.value})}
                      placeholder="Enter description"
                    />
                  </div>

                  <Button onClick={handleTransfer} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Money
                  </Button>
                </CardContent>
              </Card>

              {/* Account Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Your Accounts
                  </CardTitle>
                  <CardDescription>
                    Quick overview of your accounts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {accounts.map((account) => (
                    <div key={account.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{account.account_name}</h4>
                          <p className="text-sm text-muted-foreground">{account.account_number}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {Number(account.balance).toLocaleString()} {account.currency}
                          </p>
                          <Badge variant={account.status === 'active' ? 'default' : account.status === 'frozen' ? 'destructive' : 'secondary'}>
                            {account.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Transfer History */}
            <Card>
              <CardHeader>
                <CardTitle>Transfer History</CardTitle>
                <CardDescription>
                  Your recent transfers and payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transfers.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No transfers found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transfers.map((transfer) => (
                        <TableRow key={transfer.id}>
                          <TableCell className="text-sm">
                            {new Date(transfer.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{transfer.recipient_name}</div>
                              <div className="text-sm text-muted-foreground">{transfer.recipient_account_number}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {Number(transfer.amount).toLocaleString()} {transfer.currency}
                          </TableCell>
                          <TableCell className="capitalize">{transfer.transfer_type}</TableCell>
                          <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                          <TableCell className="font-mono text-sm">{transfer.reference_number}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Transfer; // Updated export
