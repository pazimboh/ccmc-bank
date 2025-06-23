import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminNav from "@/components/admin/AdminNav";
import AdminCustomerTable from "@/components/admin/AdminCustomerTable";
import AdminLoanRequests from "@/components/admin/AdminLoanRequests";
import AdminTransactionLog from "@/components/admin/AdminTransactionLog";
import AdminReports from "@/components/admin/AdminReports";
import AdminAuditLog from "@/components/admin/AdminAuditLog";
import AdminSecurity from "@/components/admin/AdminSecurity";
import AdminSettings from "@/components/admin/AdminSettings";
import AddCustomerModal from "@/components/admin/AddCustomerModal";
import AdminDepositValidation from "@/components/admin/AdminDepositValidation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalCustomers: 0,
    pendingApplications: 0,
    activeLoans: 0,
    systemStatus: 'Operational'
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      // Fetch customer count
      const { count: customerCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch pending loan applications
      const { count: pendingCount } = await supabase
        .from('loans')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch active loans
      const { count: activeLoansCount } = await supabase
        .from('loans')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Fetch recent applications
      const { data: recentLoans } = await supabase
        .from('loans')
        .select(`
          *,
          customer:profiles!customer_id(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      setDashboardStats({
        totalCustomers: customerCount || 0,
        pendingApplications: pendingCount || 0,
        activeLoans: activeLoansCount || 0,
        systemStatus: 'Operational'
      });

      setRecentApplications(recentLoans || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    document.title = "Admin Dashboard - CCMC Bank";
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "customers":
        return <AdminCustomerTable />;
      case "deposits":
        return <AdminDepositValidation />;
      case "loans":
        return <AdminLoanRequests />;
      case "transactions":
        return <AdminTransactionLog />;
      case "security":
        return <AdminSecurity />;
      case "audit":
        return <AdminAuditLog />;
      case "reports":
        return <AdminReports />;
      case "settings":
        return <AdminSettings />;
      default:
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  Registered users
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.pendingApplications}</div>
                <p className="text-xs text-muted-foreground">
                  Require review
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.activeLoans}</div>
                <p className="text-xs text-muted-foreground">
                  Currently approved
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold flex items-center">
                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                    {dashboardStats.systemStatus}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  All systems normal
                </p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminNav activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
