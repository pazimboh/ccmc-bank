
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";
import AccountSummary from "./AccountSummary";
import RecentTransactions from "./RecentTransactions";
import DashboardKPIs from "./DashboardKPIs";

interface DashboardKPIsData {
  totalBalance: number;
  monthlySpending: number;
  savingsGoalProgress?: number;
  savingsGoalAmount?: number;
  savingsCurrentAmount?: number;
}

interface DashboardOverviewProps {
  profileFirstName?: string;
  kpis: DashboardKPIsData;
  accountsData: Tables<"accounts">[];
  transactionsData: Tables<"transactions">[];
  isLoading: boolean;
  error: string | null;
  onCreateAccount: () => void;
  onDeposit: () => void;
}

const DashboardOverview = ({ 
  profileFirstName, 
  kpis, 
  accountsData, 
  transactionsData, 
  isLoading, 
  error, 
  onCreateAccount, 
  onDeposit 
}: DashboardOverviewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profileFirstName}</h1>
          <p className="text-muted-foreground">Here's an overview of your finances</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onDeposit}>
            Make Deposit
          </Button>
          <Button variant="outline" onClick={onCreateAccount}>
            Open Account
          </Button>
        </div>
      </div>
      
      <DashboardKPIs kpis={kpis} onCreateAccount={onCreateAccount} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Your Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && accountsData.length === 0 ? (
              <p>Loading accounts...</p>
            ) : accountsData.length > 0 ? (
              accountsData.map((account) => (
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
              ))
            ) : (
              <p>No accounts found.</p>
            )}
            <div className="pt-4">
              <Link to="/accounts">
                <Button variant="outline" className="w-full">
                  View All Accounts
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions
              transactions={transactionsData}
              isLoading={isLoading && transactionsData.length === 0}
              error={error}
              limit={5}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
