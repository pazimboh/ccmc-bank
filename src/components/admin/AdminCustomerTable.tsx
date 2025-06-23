import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, Unlock } from "lucide-react";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  address: string | null;
  account_type: string | null;
  status: string | null;
  created_at: string | null;
  user_roles: {
    role: string;
  }[];
  accounts: {
    id: string;
    account_name: string;
    account_number: string;
    account_status: string;
    balance: number;
  }[];
}

const AdminCustomerTable = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles(role),
          accounts(id, account_name, account_number, account_status, balance)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        toast({
          title: "Error",
          description: "Failed to fetch customers",
          variant: "destructive",
        });
        return;
      }

      const customersData = (data || []).map(customer => ({
        ...customer,
        user_roles: customer.user_roles || [],
        accounts: customer.accounts || []
      }));

      setCustomers(customersData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleStatusUpdate = async (customerId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', customerId);

      if (error) {
        throw error;
      }

      setCustomers(customers.map(customer => 
        customer.id === customerId ? { ...customer, status: newStatus } : customer
      ));

      toast({
        title: "Status Updated",
        description: `Customer status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update customer status",
        variant: "destructive",
      });
    }
  };

  const handleAccountFreeze = async (accountId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'frozen' ? 'active' : 'frozen';
    
    try {
      const { error } = await supabase
        .from('accounts')
        .update({ account_status: newStatus })
        .eq('id', accountId);

      if (error) throw error;

      // Update local state
      setCustomers(customers.map(customer => ({
        ...customer,
        accounts: customer.accounts.map(account => 
          account.id === accountId 
            ? { ...account, account_status: newStatus }
            : account
        )
      })));

      toast({
        title: "Account Updated",
        description: `Account ${newStatus === 'frozen' ? 'frozen' : 'unfrozen'} successfully`,
      });
    } catch (error) {
      console.error('Error updating account status:', error);
      toast({
        title: "Error",
        description: "Failed to update account status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRoleBadge = (roles: { role: string }[]) => {
    const role = roles[0]?.role || 'customer';
    return role === 'admin' ? 
      <Badge variant="outline" className="bg-purple-100 text-purple-800">Admin</Badge> :
      <Badge variant="outline">Customer</Badge>;
  };

  const getAccountStatusBadge = (status: string) => {
    switch (status) {
      case "frozen":
        return <Badge className="bg-blue-100 text-blue-800">Frozen</Badge>;
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "closed":
        return <Badge className="bg-red-100 text-red-800">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading customers...</div>;
  }

  return (
    <div className="space-y-4">
      {customers.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          No customers found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Accounts</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {customer.first_name} {customer.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {customer.id}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{customer.account_type || 'N/A'}</TableCell>
                <TableCell>{customer.phone || 'N/A'}</TableCell>
                <TableCell>
                  {customer.user_roles[0]?.role === 'admin' ? 
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">Admin</Badge> :
                    <Badge variant="outline">Customer</Badge>
                  }
                </TableCell>
                <TableCell>
                  {customer.status === "approved" ? (
                    <Badge className="bg-green-100 text-green-800">Approved</Badge>
                  ) : customer.status === "pending" ? (
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  ) : customer.status === "rejected" ? (
                    <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                  ) : (
                    <Badge variant="outline">Unknown</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {customer.accounts.length > 0 ? customer.accounts.map(account => (
                      <div key={account.id} className="flex items-center gap-2 text-sm">
                        <span className="font-mono">{account.account_number}</span>
                        {account.account_status === 'frozen' ? (
                          <Badge className="bg-blue-100 text-blue-800">Frozen</Badge>
                        ) : account.account_status === 'active' ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Closed</Badge>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAccountFreeze(account.id, account.account_status)}
                          className="h-6 px-2"
                        >
                          {account.account_status === 'frozen' ? (
                            <Unlock className="h-3 w-3" />
                          ) : (
                            <Lock className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    )) : (
                      <span className="text-muted-foreground">No accounts</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {customer.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(customer.id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(customer.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {customer.status === 'rejected' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(customer.id, 'approved')}
                      >
                        Approve
                      </Button>
                    )}
                    {customer.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(customer.id, 'pending')}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminCustomerTable;
