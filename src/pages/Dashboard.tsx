import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import AccountSummary from "@/components/dashboard/AccountSummary";
<<<<<<< HEAD
import { ArrowUpRight, CreditCard, DollarSign, PiggyBank, Plus, AlertCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom"; // Imported useSearchParams
import { useAuth } from "@/contexts/AuthContext";
=======
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import DepositRequest from "@/components/dashboard/DepositRequest";
import TwoFactorNotification from "@/components/auth/TwoFactorNotification";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
>>>>>>> 13ce39cf6e5937ccecb11ac700a85fb78b0b4f5d
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { Plus, Building2, CreditCard, PiggyBank } from "lucide-react";

interface DashboardTransactionItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  icon: any;
  color: string;
  status: string;
}

interface AccountWithDetails extends Tables<"accounts"> {
  // Add any additional fields if needed
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [accounts, setAccounts] = useState<AccountWithDetails[]>([]);
  const [transactions, setTransactions] = useState<DashboardTransactionItem[]>([]);
  const [deposits, setDeposits] = useState<Tables<"deposits">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAccount, setNewAccount] = useState({
    account_type: '',
    account_name: ''
  });
  const [depositData, setDepositData] = useState({
    account_id: '',
    amount: '',
    description: ''
  });
  
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Dashboard - CCMC Bank";
    if (profile?.id) {
      fetchAccountsAndTransactions();
      fetchDeposits();
    }
  }, [profile?.id]);

<<<<<<< HEAD
  // Effect to sync activeTab with URL query parameter 'tab'
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const tabFromQuery = searchParams.get("tab");
    if (tabFromQuery === "accounts") {
      setActiveTab("accounts");
    } else { // Default to overview if tab is not 'accounts' or not present
      setActiveTab("overview");
    }
  }, [searchParams]); // Removed setActiveTab from deps as it's a stable setter

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !profile?.id) {
        setIsLoading(false);
        return;
      }
=======
  const fetchAccountsAndTransactions = async () => {
    try {
      // Fetch accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false });
>>>>>>> 13ce39cf6e5937ccecb11ac700a85fb78b0b4f5d

      if (accountsError) throw accountsError;
      setAccounts(accountsData || []);

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('customer_id', profile?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionsError) throw transactionsError;

      // Transform transactions to match DashboardTransactionItem interface
      const transformedTransactions: DashboardTransactionItem[] = transactionsData?.map(transaction => ({
        id: transaction.id,
        date: new Date(transaction.created_at).toLocaleDateString(),
        description: transaction.description || `${transaction.transaction_type} transaction`,
        amount: Number(transaction.amount),
        type: transaction.transaction_type,
        icon: transaction.transaction_type === 'deposit' ? Plus : 
              transaction.transaction_type === 'withdrawal' ? CreditCard : Building2,
        color: transaction.transaction_type === 'deposit' ? 'text-green-600' : 
               transaction.transaction_type === 'withdrawal' ? 'text-red-600' : 'text-blue-600',
        status: transaction.status
      })) || [];

      setTransactions(transformedTransactions);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch account data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDeposits = async () => {
    try {
      const { data, error } = await supabase
        .from('deposits')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeposits(data || []);
    } catch (error) {
      console.error('Error fetching deposits:', error);
    }
  };

  const createAccount = async () => {
    if (!newAccount.account_type || !newAccount.account_name) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate account number
      const accountNumber = 'ACC' + Math.random().toString().substr(2, 7);
      
      const { error } = await supabase
        .from('accounts')
        .insert({
          user_id: profile?.id,
          account_number: accountNumber,
          account_type: newAccount.account_type,
          account_name: newAccount.account_name,
          balance: 0,
          currency: 'FCFA',
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account created successfully",
      });

      setShowCreateAccount(false);
      setNewAccount({ account_type: '', account_name: '' });
      fetchAccountsAndTransactions();
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    }
  };

  const submitDepositRequest = async () => {
    if (!depositData.account_id || !depositData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const referenceNumber = 'DEP' + Math.random().toString().substr(2, 6);
      
      const { error } = await supabase
        .from('deposits')
        .insert({
          user_id: profile?.id,
          account_id: depositData.account_id,
          amount: Number(depositData.amount),
          description: depositData.description,
          reference_number: referenceNumber,
          currency: 'FCFA',
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deposit request submitted successfully",
      });

      setShowDepositModal(false);
      setDepositData({ account_id: '', amount: '', description: '' });
      fetchDeposits();
    } catch (error) {
      console.error('Error submitting deposit:', error);
      toast({
        title: "Error",
        description: "Failed to submit deposit request",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TwoFactorNotification />
      <DashboardHeader />

      <div className="flex">
        <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6">
          <div className="container mx-auto">
<<<<<<< HEAD
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-2"> {/* Changed grid-cols-3 to grid-cols-2 */}
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="accounts">Accounts</TabsTrigger>
                {/* Removed Transfers tab trigger */}
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <h1 className="text-3xl font-bold">Welcome back, {profile?.first_name}</h1>
                <p className="text-muted-foreground">Here's an overview of your finances</p>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Balance
                      </CardTitle>
                      {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{kpis.totalBalance.toLocaleString()} FCFA</div>
                      <p className="text-xs text-muted-foreground">
                        {/* TODO: Fetch last month's change data - placeholder retained */}
                        +{(892.00).toLocaleString()} FCFA from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Monthly Spending
                      </CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{kpis.monthlySpending.toLocaleString()} FCFA</div>
                      {/* TODO: Budget related text needs data source */}
                      <p className="text-xs text-muted-foreground">
                        Track your monthly budget
                      </p>
                      {/* <Progress value={68} className="mt-2 h-1" /> */}
                    </CardContent>
                  </Card>
                  <Card>
                    {/* Savings Goal Card - Omitted for now as data source is unclear */}
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Savings Goal
                      </CardTitle>
                      <PiggyBank className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">N/A</div>
                      <p className="text-xs text-muted-foreground">
                        Feature coming soon
                      </p>
                      {/* <Progress value={78} className="mt-2 h-1" /> */}
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="justify-start" disabled title="Feature coming soon">
                        <Plus className="mr-2 h-4 w-4" /> Add Account
                      </Button>
                      <Link to="/transfer">
                        <Button variant="outline" size="sm" className="justify-start w-full"> {/* Ensure button takes full width of link if needed */}
                          <ArrowUpRight className="mr-2 h-4 w-4" /> Make Transfer
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
=======
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold">Dashboard</h1>
>>>>>>> 13ce39cf6e5937ccecb11ac700a85fb78b0b4f5d
                </div>
                
                {/* Show account summaries */}
                {accounts.length > 0 && (
                  <div className="grid gap-4">
                    {accounts.map((account) => (
                      <AccountSummary 
                        key={account.id}
                        account={{
                          id: account.id,
                          name: account.account_name,
                          type: account.account_type,
                          balance: Number(account.balance),
                          accountNumber: account.account_number
                        }}
                      />
                    ))}
                  </div>
                )}
                
                {/* Accounts Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Accounts</CardTitle>
                    <CardDescription>Manage your bank accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {accounts.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">No accounts found</p>
                        <Button onClick={() => setShowCreateAccount(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Account
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Account Summary</h3>
                          <div className="space-x-2">
                            <Button onClick={() => setShowCreateAccount(true)} variant="outline">
                              <Plus className="w-4 h-4 mr-2" />
                              Create Account
                            </Button>
                            <Button onClick={() => setShowDepositModal(true)}>
                              Request Deposit
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid gap-4">
                          {accounts.map((account) => (
                            <div key={account.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{account.account_name}</h4>
                                  <p className="text-sm text-muted-foreground">{account.account_number}</p>
                                  <p className="text-xs text-muted-foreground capitalize">{account.account_type}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold">
                                    {Number(account.balance).toLocaleString()} {account.currency}
                                  </p>
                                  <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                                    {account.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
<<<<<<< HEAD
                            <div className="space-x-2">
                              <Button size="sm">Transfer</Button>
                              <Button size="sm" variant="outline">Statements</Button>
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <h4 className="font-semibold mb-2">Recent Activity</h4>
                          <RecentTransactions
                            transactions={transactionsData.filter(t => t.from_account === account.account_number || t.to_account === account.account_number)}
                            limit={3}
                          />
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                     <p>No accounts found.</p>
                  )}
                  
                  <Card className="border-dashed border-2">
                    <CardContent className="flex items-center justify-center p-6">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" /> Open New Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Removed TabsContent for value="transfers" */}
            </Tabs>
=======
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <RecentTransactions 
                  transactions={transactions.map(t => ({
                    ...t,
                    // Map to match RecentTransactions expected interface
                    account_id: null,
                    created_at: t.date,
                    currency: 'FCFA',
                    customer_id: null,
                    from_account: null,
                    reference_number: null,
                    to_account: null,
                    transaction_id: t.id,
                    transaction_type: t.type
                  }))}
                />
              </div>
            )}

            {activeTab === "deposit" && <DepositRequest />}
>>>>>>> 13ce39cf6e5937ccecb11ac700a85fb78b0b4f5d
          </div>
        </main>
      </div>

      {/* Create Account Dialog */}
      <Dialog open={showCreateAccount} onOpenChange={setShowCreateAccount}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
            <DialogDescription>
              Create a new bank account to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="account_type">Account Type</Label>
              <Select value={newAccount.account_type} onValueChange={(value) => setNewAccount({...newAccount, account_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="account_name">Account Name</Label>
              <Input
                id="account_name"
                value={newAccount.account_name}
                onChange={(e) => setNewAccount({...newAccount, account_name: e.target.value})}
                placeholder="Enter account name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateAccount(false)}>
              Cancel
            </Button>
            <Button onClick={createAccount}>
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deposit Request Dialog */}
      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Deposit</DialogTitle>
            <DialogDescription>
              Submit a deposit request for admin validation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="deposit_account">Account</Label>
              <Select value={depositData.account_id} onValueChange={(value) => setDepositData({...depositData, account_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.account_name} - {account.account_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="deposit_amount">Amount (FCFA)</Label>
              <Input
                id="deposit_amount"
                type="number"
                value={depositData.amount}
                onChange={(e) => setDepositData({...depositData, amount: e.target.value})}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label htmlFor="deposit_description">Description (Optional)</Label>
              <Textarea
                id="deposit_description"
                value={depositData.description}
                onChange={(e) => setDepositData({...depositData, description: e.target.value})}
                placeholder="Enter description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDepositModal(false)}>
              Cancel
            </Button>
            <Button onClick={submitDepositRequest}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
