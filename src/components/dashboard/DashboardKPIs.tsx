
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CreditCard, PiggyBank, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardKPIs {
  totalBalance: number;
  monthlySpending: number;
  savingsGoalProgress?: number;
  savingsGoalAmount?: number;
  savingsCurrentAmount?: number;
}

interface DashboardKPIsProps {
  kpis: DashboardKPIs;
  onCreateAccount: () => void;
}

const DashboardKPIsComponent = ({ kpis, onCreateAccount }: DashboardKPIsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Total Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.totalBalance.toLocaleString()} FCFA</div>
          <p className="text-xs text-muted-foreground">
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
          <p className="text-xs text-muted-foreground">
            Track your monthly budget
          </p>
        </CardContent>
      </Card>
      <Card>
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
        </CardContent>
      </Card>
      <Card className="border-dashed border-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button variant="outline" size="sm" className="justify-start" onClick={onCreateAccount}>
            <Plus className="mr-2 h-4 w-4" /> Add Account
          </Button>
          <Link to="/transfer">
            <Button variant="outline" size="sm" className="justify-start w-full">
              <ArrowUpRight className="mr-2 h-4 w-4" /> Make Transfer
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardKPIsComponent;
