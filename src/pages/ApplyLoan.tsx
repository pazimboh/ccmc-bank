
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { ArrowLeft, Calculator, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const ApplyLoan = () => {
  const { toast } = useToast();
  const [loanType, setLoanType] = useState("");
  const [loanAmount, setLoanAmount] = useState(5000);
  const [loanTerm, setLoanTerm] = useState(36); // months
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculated fields
  const interestRate = 5.99; // Example fixed rate
  const monthlyPayment = (loanAmount * (interestRate/1200) * Math.pow((1 + interestRate/1200), loanTerm)) / (Math.pow((1 + interestRate/1200), loanTerm) - 1);
  const totalPayment = monthlyPayment * loanTerm;
  const totalInterest = totalPayment - loanAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Loan application submitted",
        description: "Your application has been received and is pending review.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link to="/dashboard" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Apply for a Loan</h1>
        <p className="text-muted-foreground mb-8">Complete the form below to apply for a loan</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Loan Application</CardTitle>
                <CardDescription>
                  Please provide accurate information to expedite your loan approval process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">1. Loan Details</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="loanType">Loan Type</Label>
                      <Select value={loanType} onValueChange={setLoanType} required>
                        <SelectTrigger id="loanType">
                          <SelectValue placeholder="Select a loan type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal Loan</SelectItem>
                          <SelectItem value="auto">Auto Loan</SelectItem>
                          <SelectItem value="home">Home Loan</SelectItem>
                          <SelectItem value="business">Business Loan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="loanAmount">Loan Amount: ${loanAmount.toLocaleString()}</Label>
                      </div>
                      <Slider 
                        defaultValue={[5000]} 
                        max={50000} 
                        step={100} 
                        onValueChange={([value]) => setLoanAmount(value)} 
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>$1,000</span>
                        <span>$50,000</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="loanTerm">Loan Term: {loanTerm} months</Label>
                      </div>
                      <Slider 
                        defaultValue={[36]} 
                        min={12}
                        max={84} 
                        step={12} 
                        onValueChange={([value]) => setLoanTerm(value)} 
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>12 months</span>
                        <span>84 months</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">2. Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" required />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" required />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="income">Annual Income</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                          <Input id="income" type="number" className="pl-8" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employment">Employment Status</Label>
                        <Select required>
                          <SelectTrigger id="employment">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fulltime">Full-time</SelectItem>
                            <SelectItem value="parttime">Part-time</SelectItem>
                            <SelectItem value="selfemployed">Self-employed</SelectItem>
                            <SelectItem value="unemployed">Unemployed</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" required />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the terms and conditions
                        </label>
                        <p className="text-sm text-muted-foreground">
                          By applying, you authorize CCMC Bank to obtain credit reports.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  Loan Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="mb-4">
                    <span className="text-sm text-muted-foreground">Estimated Monthly Payment</span>
                    <p className="text-3xl font-bold">${isNaN(monthlyPayment) ? "0.00" : monthlyPayment.toFixed(2)}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Loan Amount:</span>
                      <span className="font-medium">${loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Interest Rate:</span>
                      <span className="font-medium">{interestRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Loan Term:</span>
                      <span className="font-medium">{loanTerm} months</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-sm">Total Interest:</span>
                      <span className="font-medium">${isNaN(totalInterest) ? "0.00" : totalInterest.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Payment:</span>
                      <span className="font-medium">${isNaN(totalPayment) ? "0.00" : totalPayment.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Need Help?</h4>
                      <p className="text-sm text-muted-foreground">
                        Our loan specialists are available to help you choose the right loan option for your needs.
                      </p>
                      <Button variant="link" className="p-0 h-auto mt-2 text-sm">
                        Contact a Specialist
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplyLoan;
