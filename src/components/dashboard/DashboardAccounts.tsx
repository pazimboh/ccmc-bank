
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/integrations/supabase/types";
import RecentTransactions from "./RecentTransactions";

interface DashboardAccountsProps {
  accountsData: Tables<"accounts">[];
  transactionsData: Tables<"transactions">[];
  isLoading: boolean;
  onCreateAccount: () => void;
}

const DashboardAccounts = ({ accountsData, transactionsData, isLoading, onCreateAccount }: DashboardAccountsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Your Accounts</h1>
          <p className="text-muted-foreground">Manage all your accounts in one place</p>
        </div>
        <Button onClick={onCreateAccount}>
          <Plus className="mr-2 h-4 w-4" /> Open New Account
        </Button>
      </div>

      <div className="grid gap-6">
        {isLoading && accountsData.length === 0 ? (
           <p>Loading accounts...</p>
        ) : accountsData.length > 0 ? (
          accountsData.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{account.account_name}</CardTitle>
                    <CardDescription>Account Number: {account.account_number}</CardDescription>
                  </div>
                  <Badge variant={account.account_status === 'active' ? 'default' : 'secondary'}>
                    {account.account_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-3xl font-bold">{Number(account.balance).toLocaleString()} FCFA</p>
                  </div>
                  <div className="space-x-2">
                    <Button 
                      size="sm" 
                      disabled={account.account_status === 'frozen'}
                      title={account.account_status === 'frozen' ? 'Account is frozen' : ''}
                    >
                      Transfer
                    </Button>
                    <Button size="sm" variant="outline">Statements</Button>
                  </div>
                </div>
                {account.account_status === 'frozen' && (
                  <div className="mt-4 text-sm text-orange-600 bg-orange-50 p-3 rounded">
                    <strong>Account Frozen:</strong> This account can receive funds but withdrawals and transfers are disabled. Contact support for assistance.
                  </div>
                )}
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
           <div className="text-center py-12">
             <p className="text-muted-foreground mb-4">No accounts found.</p>
             <Button onClick={onCreateAccount}>
               <Plus className="mr-2 h-4 w-4" /> Open Your First Account
             </Button>
           </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAccounts;
