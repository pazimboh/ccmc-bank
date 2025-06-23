
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
    isLoading,
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
  }, [searchParams]); // Removed setActiveTab from deps as it's a stable setter

  useEffect(() => {
    const controller = new AbortController(); // Create AbortController

    const fetchData = async () => {
      if (!user || !profile?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch accounts
        const { data: fetchedAccounts, error: accountsError } = await supabase
          .from("accounts")
          .select("*", { signal: controller.signal }) // Pass signal
          .eq("user_id", profile.id);

        if (accountsError) {
          if (accountsError.name === 'AbortError') {
            console.log('Accounts fetch aborted');
            return; // Do not proceed further if aborted
          }
          throw accountsError;
        }
        setAccountsData(fetchedAccounts || []);
        const totalBalanceFromFetched = (fetchedAccounts || []).reduce((sum, acc) => sum + Number(acc.balance), 0);

        // Fetch transactions
        const { data: transactions, error: transactionsError } = await supabase
          .from("transactions")
          .select("*", { signal: controller.signal }) // Pass signal
          .eq("customer_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (transactionsError) {
          if (transactionsError.name === 'AbortError') {
            console.log('Transactions fetch aborted');
            return; // Do not proceed further if aborted
          }
          throw transactionsError;
        }
        setTransactionsData(transactions || []);

        // Calculate Monthly Spending
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const monthlySpending = (transactions || [])
          .filter(t => new Date(t.created_at) > oneMonthAgo && Number(t.amount) < 0)
          .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

        setKpis({
          totalBalance: totalBalanceFromFetched,
          monthlySpending: monthlySpending,
        });

      } catch (err: any) { // Ensure 'err' is typed to allow checking 'name' property
        if (err.name === 'AbortError') {
          console.log('Fetch aborted in catch block for dashboard data.');
        } else {
          console.error("Error fetching dashboard data (friendly message):", err instanceof Error ? err.message : String(err));
          console.error("Raw error object fetching dashboard data:", err);
          setError(err instanceof Error ? err.message : "An unknown error occurred during data fetch.");
        }
      } finally {
        // Only set isLoading to false if the fetch wasn't aborted,
        // or handle aborted state appropriately if needed (e.g. not showing an error for aborts)
        // For now, we'll set it to false regardless, as an aborted fetch means loading is done.
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort(); // Cleanup: abort ongoing requests
    };
  }, [user?.id, profile?.id]);

  // No longer need to map to TransactionDisplayItem here,
  // RecentTransactions component will handle it with raw transaction data.
  // const displayTransactions: TransactionDisplayItem[] = transactionsData.map(t => ({ ... }));
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !isLoading) {
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
                  isLoading={isLoading}
                  error={error}
                  onCreateAccount={() => setShowCreateAccount(true)}
                  onDeposit={() => setShowDepositModal(true)}
                />
              </TabsContent>

              <TabsContent value="accounts" className="space-y-6">
                <DashboardAccounts
                  accountsData={accountsData}
                  transactionsData={transactionsData}
                  isLoading={isLoading}
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
