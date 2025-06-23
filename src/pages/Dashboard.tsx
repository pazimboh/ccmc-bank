
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardAccounts from "@/components/dashboard/DashboardAccounts";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CreateAccountModal from "@/components/customer/CreateAccountModal";
import DepositModal from "@/components/customer/DepositModal";
import TwoFactorNotification from "@/components/TwoFactorNotification";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { profile } = useAuth();
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  const {
    accountsData,
    transactionsData,
    kpis,
    error,
    refetchData
  } = useDashboardData();

  useEffect(() => {
    document.title = "Dashboard - CCMC Bank";
  }, []);

  // Effect to sync activeTab with URL query parameter 'tab'
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const tabFromQuery = searchParams.get("tab");
    if (tabFromQuery === "accounts") {
      setActiveTab("accounts");
    } else {
      setActiveTab("overview");
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive flex items-center">
              <AlertCircle className="mr-2 h-6 w-6" /> Dashboard Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Sorry, we couldn't load your dashboard data at this time.</p>
            <p className="text-sm text-muted-foreground mt-2">Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <TwoFactorNotification />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="accounts">Accounts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <DashboardOverview
                  profileFirstName={profile?.first_name}
                  kpis={kpis}
                  accountsData={accountsData}
                  transactionsData={transactionsData}
                  isLoading={false}
                  error={error}
                  onCreateAccount={() => setShowCreateAccount(true)}
                  onDeposit={() => setShowDepositModal(true)}
                />
              </TabsContent>

              <TabsContent value="accounts" className="space-y-6">
                <DashboardAccounts
                  accountsData={accountsData}
                  transactionsData={transactionsData}
                  isLoading={false}
                  onCreateAccount={() => setShowCreateAccount(true)}
                />
              </TabsContent>
            </Tabs>

            <CreateAccountModal
              isOpen={showCreateAccount}
              onClose={() => setShowCreateAccount(false)}
              onAccountCreated={() => {
                refetchData();
              }}
            />

            <DepositModal
              isOpen={showDepositModal}
              onClose={() => setShowDepositModal(false)}
              onDepositCreated={() => {
                refetchData();
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
