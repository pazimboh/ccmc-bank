
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, UserCog, Fingerprint, Lock, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample data - would be fetched from Supabase in a real implementation
const customers = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    status: "active",
    accountType: "Checking & Savings",
    joinDate: "2023-01-15",
    balance: "$24,530.65",
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria.g@example.com",
    status: "active",
    accountType: "Savings",
    joinDate: "2023-03-22",
    balance: "$5,720.42",
  },
  {
    id: "3",
    name: "John Smith",
    email: "john.smith@example.com",
    status: "frozen",
    accountType: "Checking",
    joinDate: "2022-11-05",
    balance: "$1,245.33",
  },
  {
    id: "4",
    name: "Sarah Lee",
    email: "sarah.lee@example.com",
    status: "pending",
    accountType: "Business",
    joinDate: "2023-05-10",
    balance: "$0.00",
  },
  {
    id: "5",
    name: "Robert Chen",
    email: "robert.c@example.com",
    status: "active",
    accountType: "Checking & Savings",
    joinDate: "2022-08-30",
    balance: "$12,845.77",
  },
  {
    id: "6",
    name: "Emily Taylor",
    email: "emily.t@example.com",
    status: "pending",
    accountType: "Checking",
    joinDate: "2023-05-18",
    balance: "$0.00",
  },
];

const AdminCustomerTable = () => {
  const { toast } = useToast();
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case "frozen":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Frozen</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleVerifyIdentity = (customerId: string) => {
    toast({
      title: "Identity verification",
      description: `Started verification process for customer ID: ${customerId}`,
    });
  };
  
  const handleFreezeAccount = (customerId: string) => {
    toast({
      title: "Account frozen",
      description: `Account for customer ID: ${customerId} has been frozen.`,
    });
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Account Type</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                </div>
              </TableCell>
              <TableCell>{customer.accountType}</TableCell>
              <TableCell>{new Date(customer.joinDate).toLocaleDateString()}</TableCell>
              <TableCell>{getStatusBadge(customer.status)}</TableCell>
              <TableCell className="text-right font-medium">{customer.balance}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleVerifyIdentity(customer.id)}>
                      <Fingerprint className="mr-2 h-4 w-4" />
                      Verify Identity
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFreezeAccount(customer.id)}>
                      <Lock className="mr-2 h-4 w-4" />
                      Freeze Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserCog className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-end p-4">
        <div className="text-sm text-muted-foreground">
          Showing <strong>6</strong> of <strong>1248</strong> customers
        </div>
        <div className="ml-4 flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerTable;
