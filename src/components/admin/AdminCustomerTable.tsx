
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Snowflake } from "lucide-react";

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
    status: string;
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
          accounts(id, status)
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

  const handleAccountFreeze = async (customerId: string, freeze: boolean) => {
    try {
      const newStatus = freeze ? 'frozen' : 'active';
      
      const { error } = await supabase
        .from('accounts')
        .update({ status: newStatus })
        .eq('user_id', customerId);

      if (error) throw error;

      // Refresh customer data to show updated account status
      await fetchCustomers();

      toast({
        title: freeze ? "Accounts Frozen" : "Accounts Unfrozen",
        description: freeze ? 
          "Customer accounts have been frozen - they can only receive funds" :
          "Customer accounts have been unfrozen",
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

  const hasActiveAccounts = (accounts: { status: string }[]) => {
    return accounts.some(acc => acc.status === 'active');
  };

  const hasFrozenAccounts = (accounts: { status: string }[]) => {
    return accounts.some(acc => acc.status === 'frozen');
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
              <TableHead>Account Status</TableHead>
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
                <TableCell>{getRoleBadge(customer.user_roles)}</TableCell>
                <TableCell>{getStatusBadge(customer.status)}</TableCell>
                <TableCell>
                  {customer.accounts.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {hasFrozenAccounts(customer.accounts) && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 w-fit">
                          <Snowflake className="w-3 h-3 mr-1" />
                          Frozen
                        </Badge>
                      )}
                      {hasActiveAccounts(customer.accounts) && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 w-fit">
                          Active
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">No accounts</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
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
                    
                    {customer.accounts.length > 0 && customer.status === 'approved' && (
                      <div className="flex gap-2">
                        {hasActiveAccounts(customer.accounts) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAccountFreeze(customer.id, true)}
                            className="text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            <Snowflake className="w-3 h-3 mr-1" />
                            Freeze
                          </Button>
                        )}
                        {hasFrozenAccounts(customer.accounts) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAccountFreeze(customer.id, false)}
                            className="text-green-600 border-green-300 hover:bg-green-50"
                          >
                            Unfreeze
                          </Button>
                        )}
                      </div>
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
