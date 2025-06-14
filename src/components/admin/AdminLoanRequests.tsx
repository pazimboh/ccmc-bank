
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface LoanRequest {
  id: string;
  customer_id: string;
  loan_type: string;
  amount: number;
  term_months: number;
  purpose: string | null;
  credit_score: number | null;
  status: string;
  created_at: string;
  customer: {
    first_name: string;
    last_name: string;
    id: string;
  } | null;
}

const AdminLoanRequests = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLoans = async () => {
    try {
      const { data, error } = await supabase
        .from('loans')
        .select(`
          *,
          customer:profiles!customer_id(first_name, last_name, id)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching loans:', error);
        toast({
          title: "Error",
          description: "Failed to fetch loan requests",
          variant: "destructive",
        });
        return;
      }

      // Ensure data has the correct structure
      const loansData = (data || []).map(loan => ({
        ...loan,
        customer: loan.customer || null
      }));

      setLoans(loansData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApprove = async (loanId: string) => {
    try {
      const { error } = await supabase
        .from('loans')
        .update({
          status: 'approved',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', loanId);

      if (error) {
        throw error;
      }

      setLoans(loans.map(loan => 
        loan.id === loanId ? { ...loan, status: 'approved' } : loan
      ));
      
      toast({
        title: "Loan Approved",
        description: `Loan ${loanId} has been approved.`,
      });
    } catch (error) {
      console.error('Error approving loan:', error);
      toast({
        title: "Error",
        description: "Failed to approve loan",
        variant: "destructive",
      });
    }
  };
  
  const handleDeny = async (loanId: string) => {
    try {
      const { error } = await supabase
        .from('loans')
        .update({
          status: 'rejected',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', loanId);

      if (error) {
        throw error;
      }

      setLoans(loans.map(loan => 
        loan.id === loanId ? { ...loan, status: 'rejected' } : loan
      ));
      
      toast({
        title: "Loan Rejected",
        description: `Loan ${loanId} has been rejected.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error rejecting loan:', error);
      toast({
        title: "Error",
        description: "Failed to reject loan",
        variant: "destructive",
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading loan requests...</div>;
  }
  
  return (
    <div className="space-y-4">
      {loans.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No loan requests found.</p>
          </CardContent>
        </Card>
      ) : (
        loans.map((loan) => (
          <Card key={loan.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{loan.loan_type} - {loan.amount.toLocaleString()} FCFA</CardTitle>
                  <CardDescription>Application ID: {loan.id}</CardDescription>
                </div>
                {getStatusBadge(loan.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Applicant Details</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span> {loan.customer?.first_name} {loan.customer?.last_name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Customer ID:</span> {loan.customer?.id}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Credit Score:</span> {loan.credit_score || 'N/A'}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Applied:</span> {new Date(loan.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-2">Loan Details</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Amount:</span> {loan.amount.toLocaleString()} FCFA
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Term:</span> {loan.term_months} months
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Purpose:</span> {loan.purpose || 'N/A'}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Monthly Payment:</span>{' '}
                      {((loan.amount / loan.term_months) * 1.05).toLocaleString()} FCFA
                    </p>
                  </div>
                  
                  {loan.status === "pending" && (
                    <div className="mt-4 flex justify-end gap-3">
                      <Button variant="outline" onClick={() => handleDeny(loan.id)}>
                        Reject
                      </Button>
                      <Button onClick={() => handleApprove(loan.id)}>
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default AdminLoanRequests;
