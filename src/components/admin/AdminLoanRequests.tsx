
import { useState } from "react";
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

// Sample loan requests data
const loanRequests = [
  {
    id: "LOAN-001",
    customer: {
      name: "Michael Brown",
      email: "michael.brown@example.com",
    },
    type: "Personal Loan",
    amount: 15000,
    term: 36, // months
    purpose: "Home renovation",
    creditScore: 720,
    status: "pending",
    dateApplied: "2023-05-10T14:30:00Z",
  },
  {
    id: "LOAN-002",
    customer: {
      name: "Jennifer Wilson",
      email: "j.wilson@example.com",
    },
    type: "Auto Loan",
    amount: 22500,
    term: 48, // months
    purpose: "New vehicle purchase",
    creditScore: 680,
    status: "pending",
    dateApplied: "2023-05-11T09:15:00Z",
  },
  {
    id: "LOAN-003",
    customer: {
      name: "David Martinez",
      email: "david.m@example.com",
    },
    type: "Home Loan",
    amount: 320000,
    term: 360, // months
    purpose: "Home purchase",
    creditScore: 760,
    status: "pending",
    dateApplied: "2023-05-09T10:20:00Z",
  },
];

const AdminLoanRequests = () => {
  const { toast } = useToast();
  const [loans, setLoans] = useState(loanRequests);
  
  const handleApprove = (loanId: string) => {
    setLoans(loans.map(loan => 
      loan.id === loanId ? { ...loan, status: "approved" } : loan
    ));
    
    toast({
      title: "Loan Approved",
      description: `Loan ${loanId} has been approved.`,
    });
  };
  
  const handleDeny = (loanId: string) => {
    setLoans(loans.map(loan => 
      loan.id === loanId ? { ...loan, status: "denied" } : loan
    ));
    
    toast({
      title: "Loan Denied",
      description: `Loan ${loanId} has been denied.`,
      variant: "destructive",
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "denied":
        return <Badge className="bg-red-100 text-red-800">Denied</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      {loans.map((loan) => (
        <Card key={loan.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{loan.type} - ${loan.amount.toLocaleString()}</CardTitle>
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
                  <p className="text-sm"><span className="font-medium">Name:</span> {loan.customer.name}</p>
                  <p className="text-sm"><span className="font-medium">Email:</span> {loan.customer.email}</p>
                  <p className="text-sm"><span className="font-medium">Credit Score:</span> {loan.creditScore}</p>
                  <p className="text-sm"><span className="font-medium">Applied:</span> {new Date(loan.dateApplied).toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Loan Details</h4>
                <div className="space-y-1">
                  <p className="text-sm"><span className="font-medium">Amount:</span> ${loan.amount.toLocaleString()}</p>
                  <p className="text-sm"><span className="font-medium">Term:</span> {loan.term} months</p>
                  <p className="text-sm"><span className="font-medium">Purpose:</span> {loan.purpose}</p>
                  <p className="text-sm"><span className="font-medium">Monthly Payment:</span> ${((loan.amount / loan.term) * 1.05).toFixed(2)}</p>
                </div>
                
                {loan.status === "pending" && (
                  <div className="mt-4 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => handleDeny(loan.id)}>
                      Deny
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
      ))}
    </div>
  );
};

export default AdminLoanRequests;
