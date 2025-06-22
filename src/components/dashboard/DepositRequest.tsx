
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";

interface DepositRequestProps {
  onDepositSubmitted?: () => void;
}

const DepositRequest = ({ onDepositSubmitted }: DepositRequestProps) => {
  const [accounts, setAccounts] = useState<Tables<"accounts">[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (profile?.id) {
      fetchAccounts();
    }
  }, [profile?.id]);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', profile?.id)
        .eq('status', 'active');

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount || !amount || !profile?.id) return;

    setIsSubmitting(true);
    try {
      const { data: refData } = await supabase.rpc('generate_deposit_reference');
      
      const { error } = await supabase
        .from('deposits')
        .insert({
          user_id: profile.id,
          account_id: selectedAccount,
          amount: parseFloat(amount),
          description: description.trim() || null,
          reference_number: refData || `DEP${Date.now()}`,
        });

      if (error) throw error;

      toast({
        title: "Deposit Request Submitted",
        description: "Your deposit request has been submitted for admin approval.",
      });

      // Reset form
      setSelectedAccount("");
      setAmount("");
      setDescription("");
      
      if (onDepositSubmitted) {
        onDepositSubmitted();
      }
    } catch (error) {
      console.error('Error submitting deposit:', error);
      toast({
        title: "Error",
        description: "Failed to submit deposit request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Deposit</CardTitle>
        <CardDescription>Submit a deposit request for admin validation</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="account">Select Account</Label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.account_name} - {account.account_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount (FCFA)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter deposit description..."
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !selectedAccount || !amount}
          >
            {isSubmitting ? "Submitting..." : "Submit Deposit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DepositRequest;
