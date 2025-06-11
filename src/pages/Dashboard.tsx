
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import AccountSummary from "@/components/dashboard/AccountSummary";
import { ArrowUpRight, CreditCard, DollarSign, PiggyBank, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data - will be replaced with real data from Supabase later
  const accounts = [
    {
      id: "1",
      name: "Primary Checking",
      type: "checking",
      balance: 2450.65,
      accountNumber: "****4567",
    },
    {
      id: "2",
      name: "Savings Account",
      type: "savings",
      balance: 15720.42,
      accountNumber: "****7890",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="flex">
        <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="accounts">Accounts</TabsTrigger>
                <TabsTrigger value="transfers">Transfers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <h1 className="text-3xl font-bold">Welcome back, Alex</h1>
                <p className="text-muted-foreground">Here's an overview of your finances</p>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Balance
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$18,171.07</div>
                      <p className="text-xs text-muted-foreground">
                        +$892.00 from last month
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
                      <div className="text-2xl font-bold">$1,420.35</div>
                      <p className="text-xs text-muted-foreground">
                        68% of monthly budget
                      </p>
                      <Progress value={68} className="mt-2 h-1" />
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
                      <div className="text-2xl font-bold">$15,720.42</div>
                      <p className="text-xs text-muted-foreground">
                        78% of $20,000 goal
                      </p>
                      <Progress value={78} className="mt-2 h-1" />
                    </CardContent>
                  </Card>
                  <Card className="border-dashed border-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="justify-start">
                        <Plus className="mr-2 h-4 w-4" /> Add Account
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <ArrowUpRight className="mr-2 h-4 w-4" /> Make Transfer
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="col-span-1">
                    <CardHeader>
                      <CardTitle>Your Accounts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {accounts.map((account) => (
                        <AccountSummary key={account.id} account={account} />
                      ))}
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
                      <RecentTransactions />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="accounts" className="space-y-6">
                <h1 className="text-3xl font-bold">Your Accounts</h1>
                <p className="text-muted-foreground">Manage all your accounts in one place</p>
                
                <div className="grid gap-6">
                  {accounts.map((account) => (
                    <Card key={account.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{account.name}</CardTitle>
                          <Button variant="outline" size="sm">Manage</Button>
                        </div>
                        <CardDescription>Account Number: {account.accountNumber}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Available Balance</p>
                            <p className="text-3xl font-bold">${account.balance.toFixed(2)}</p>
                          </div>
                          <div className="space-x-2">
                            <Button size="sm">Transfer</Button>
                            <Button size="sm" variant="outline">Statements</Button>
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <h4 className="font-semibold mb-2">Recent Activity</h4>
                        <RecentTransactions limit={3} />
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Card className="border-dashed border-2">
                    <CardContent className="flex items-center justify-center p-6">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" /> Open New Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="transfers" className="space-y-6">
                <h1 className="text-3xl font-bold">Transfer Money</h1>
                <p className="text-muted-foreground">Move money between your accounts or to other recipients</p>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Make a Transfer</CardTitle>
                      <CardDescription>Transfer funds between your accounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-muted-foreground p-6">
                        Transfer functionality will be implemented when connected to Supabase backend.
                      </p>
                      <Button className="w-full" disabled>
                        Transfer Funds
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Pay Someone</CardTitle>
                      <CardDescription>Send money to other people or businesses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-muted-foreground p-6">
                        Payment functionality will be implemented when connected to Supabase backend.
                      </p>
                      <Button className="w-full" disabled>
                        Make Payment
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
