import { useState } from "react";
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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="flex">
        <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsContent value="overview" className="space-y-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Administrator</p>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,248</div>
                      <p className="text-xs text-muted-foreground">
                        +15 new this month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">27</div>
                      <p className="text-xs text-muted-foreground">
                        8 require immediate review
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">423</div>
                      <p className="text-xs text-muted-foreground">
                        $3.2M total value
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">System Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold flex items-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        All systems normal
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="col-span-1">
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle>Recent Applications</CardTitle>
                      <Button variant="outline" size="sm">View All</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                            <div>
                              <p className="font-medium">John Doe</p>
                              <p className="text-sm text-muted-foreground">Personal Loan - $15,000</p>
                            </div>
                            <Badge>New</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="col-span-1">
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle>System Alerts</CardTitle>
                      <Button variant="outline" size="sm">Manage Alerts</Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                          <p className="text-sm font-medium text-yellow-800">5 accounts require verification</p>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                          <p className="text-sm font-medium text-blue-800">System maintenance scheduled for tonight at 2:00 AM</p>
                        </div>
                        <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                          <p className="text-sm font-medium text-green-800">New security update available</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="customers" className="space-y-6">
                <h1 className="text-3xl font-bold">Customer Management</h1>
                <p className="text-muted-foreground">View and manage all customer accounts</p>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                  <div className="flex items-center relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search customers..." className="pl-10" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Filter</Button>
                    <Button onClick={() => setShowAddCustomer(true)}>Add Customer</Button>
                  </div>
                </div>
                
                <Separator />
                
                <AdminCustomerTable />
                <AddCustomerModal open={showAddCustomer} onOpenChange={setShowAddCustomer} />
              </TabsContent>
              
              <TabsContent value="loans" className="space-y-6">
                <h1 className="text-3xl font-bold">Loan Request Management</h1>
                <p className="text-muted-foreground">Review and manage loan applications</p>
                
                <div className="flex justify-between">
                  <Tabs defaultValue="pending">
                    <TabsList>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="approved">Approved</TabsTrigger>
                      <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <Button>Export Data</Button>
                </div>
                
                <AdminLoanRequests />
              </TabsContent>
              
              <TabsContent value="transactions" className="space-y-6">
                <h1 className="text-3xl font-bold">Transaction Monitoring</h1>
                <p className="text-muted-foreground">Monitor and audit all financial transactions</p>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                  <div className="flex items-center relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search transactions..." className="pl-10" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Filter</Button>
                    <Button>Export Log</Button>
                  </div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Audit Log</CardTitle>
                    <CardDescription>
                      Recent financial transactions across all accounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdminTransactionLog />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <AdminReports />
              </TabsContent>

              <TabsContent value="audit" className="space-y-6">
                <AdminAuditLog />
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <AdminSecurity />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <AdminSettings />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
