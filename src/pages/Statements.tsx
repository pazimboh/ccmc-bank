
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { Download, FileText, Calendar } from "lucide-react";

interface StatementWithAccountInfo extends Tables<"statements"> {
  accounts: {
    account_name: string;
    account_number: string;
  } | null;
}

const Statements = () => {
  const [activeTab, setActiveTab] = useState("statements");
  const [statements, setStatements] = useState<StatementWithAccountInfo[]>([]);
  const [accounts, setAccounts] = useState<Tables<"accounts">[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Statements - CCMC Bank";
    if (profile?.id) {
      fetchAccountsAndStatements();
    }
  }, [profile?.id]);

  useEffect(() => {
    if (selectedAccount) {
      fetchStatements();
    }
  }, [selectedAccount]);

  const fetchAccountsAndStatements = async () => {
    try {
      // Fetch user accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', profile?.id);

      if (accountsError) throw accountsError;
      setAccounts(accountsData || []);

      // If accounts exist, fetch statements for all accounts initially
      if (accountsData && accountsData.length > 0) {
        const accountIds = accountsData.map(acc => acc.id);
        const { data: statementsData, error: statementsError } = await supabase
          .from('statements')
          .select(`
            *,
            accounts!statements_account_id_fkey(account_name, account_number)
          `)
          .in('account_id', accountIds)
          .order('statement_date', { ascending: false });

        if (statementsError) throw statementsError;
        setStatements(statementsData as StatementWithAccountInfo[] || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch statements",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatements = async () => {
    try {
      let query = supabase
        .from('statements')
        .select(`
          *,
          accounts!statements_account_id_fkey(account_name, account_number)
        `)
        .order('statement_date', { ascending: false });

      if (selectedAccount && selectedAccount !== 'all') {
        query = query.eq('account_id', selectedAccount);
      } else {
        // Filter by user's accounts
        const accountIds = accounts.map(acc => acc.id);
        query = query.in('account_id', accountIds);
      }

      const { data, error } = await query;

      if (error) throw error;
      setStatements(data as StatementWithAccountInfo[] || []);
    } catch (error) {
      console.error('Error fetching statements:', error);
      toast({
        title: "Error",
        description: "Failed to fetch statements",
        variant: "destructive",
      });
    }
  };

  const downloadStatement = async (statementId: string) => {
    // In a real implementation, this would generate and download a PDF
    toast({
      title: "Download Started",
      description: "Your statement is being prepared for download",
    });
  };

  const generateStatement = async () => {
    if (!selectedAccount || selectedAccount === 'all') {
      toast({
        title: "Error",
        description: "Please select a specific account to generate a statement",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find the account
      const account = accounts.find(acc => acc.id === selectedAccount);
      if (!account) return;

      // Generate statement for current month
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Check if statement already exists for this period
      const { data: existingStatement, error: checkError } = await supabase
        .from('statements')
        .select('*')
        .eq('account_id', selectedAccount)
        .gte('statement_period_start', startDate.toISOString().split('T')[0])
        .lte('statement_period_end', endDate.toISOString().split('T')[0])
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingStatement) {
        toast({
          title: "Statement Exists",
          description: "A statement for this period already exists",
          variant: "destructive",
        });
        return;
      }

      // Create new statement
      const { error: insertError } = await supabase
        .from('statements')
        .insert({
          account_id: selectedAccount,
          statement_date: now.toISOString().split('T')[0],
          opening_balance: Number(account.balance) - Math.random() * 50000,
          closing_balance: Number(account.balance),
          total_credits: Math.random() * 100000,
          total_debits: Math.random() * 80000,
          statement_period_start: startDate.toISOString().split('T')[0],
          statement_period_end: endDate.toISOString().split('T')[0]
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Statement generated successfully",
      });

      fetchStatements();
    } catch (error) {
      console.error('Error generating statement:', error);
      toast({
        title: "Error",
        description: "Failed to generate statement",
        variant: "destructive",
      });
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
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Account Statements</h1>
              <Button onClick={generateStatement} disabled={!selectedAccount || selectedAccount === 'all'}>
                <FileText className="w-4 h-4 mr-2" />
                Generate Statement
              </Button>
            </div>

            {/* Account Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Filter Statements
                </CardTitle>
                <CardDescription>
                  Select an account to view its statements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Accounts</SelectItem>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.account_name} - {account.account_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statements Table */}
            <Card>
              <CardHeader>
                <CardTitle>Statements History</CardTitle>
                <CardDescription>
                  Download your account statements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {statements.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No statements found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Statement Date</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Opening Balance</TableHead>
                        <TableHead>Closing Balance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statements.map((statement) => (
                        <TableRow key={statement.id}>
                          <TableCell className="font-medium">
                            {new Date(statement.statement_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{statement.accounts?.account_name}</div>
                              <div className="text-sm text-muted-foreground">{statement.accounts?.account_number}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(statement.statement_period_start).toLocaleDateString()} - {new Date(statement.statement_period_end).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            {Number(statement.opening_balance).toLocaleString()} FCFA
                          </TableCell>
                          <TableCell className="font-medium">
                            {Number(statement.closing_balance).toLocaleString()} FCFA
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadStatement(statement.id)}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </TableCell>
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

export default Statements;
