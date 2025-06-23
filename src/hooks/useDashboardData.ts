
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

interface DashboardKPIs {
  totalBalance: number;
  monthlySpending: number;
  savingsGoalProgress?: number;
  savingsGoalAmount?: number;
  savingsCurrentAmount?: number;
}

export const useDashboardData = () => {
  const { profile, user } = useAuth();
  const [accountsData, setAccountsData] = useState<Tables<"accounts">[]>([]);
  const [transactionsData, setTransactionsData] = useState<Tables<"transactions">[]>([]);
  const [kpis, setKpis] = useState<DashboardKPIs>({ totalBalance: 0, monthlySpending: 0 });
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user || !profile?.id) {
      return;
    }

    setError(null);

    try {
      // Fetch accounts
      const { data: fetchedAccounts, error: accountsError } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", profile.id);

      if (accountsError) throw accountsError;
      setAccountsData(fetchedAccounts || []);
      const totalBalanceFromFetched = (fetchedAccounts || []).reduce((sum, acc) => sum + Number(acc.balance), 0);

      // Fetch transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from("transactions")
        .select("*")
        .eq("customer_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (transactionsError) throw transactionsError;
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

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during data fetch.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, profile?.id]);

  return {
    accountsData,
    transactionsData,
    kpis,
    isLoading: false, // No more loading states
    error,
    refetchData: fetchData
  };
};
