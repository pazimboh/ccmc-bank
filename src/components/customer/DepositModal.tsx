
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositCreated: () => void;
}

const DepositModal = ({ isOpen, onClose, onDepositCreated }: DepositModalProps) => {
  const [accounts, setAccounts] = useState<Tables<"accounts">[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [depositMethod, setDepositMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      fetchUserAccounts();
    }
  }, [isOpen, user]);

  const fetchUserAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user?.id)
        .eq('account_status', 'active');

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const generateDepositReference = () => {
    return 'DEP' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleSubmitDeposit = async () => {
    if (!user || !selectedAccountId || !amount || !depositMethod) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('deposits')
        .insert({
          user_id: user.id,
          account_id: selectedAccountId,
          amount: numAmount,
          currency: 'FCFA',
          description: description || null,
          deposit_method: depositMethod,
          reference_number: generateDepositReference(),
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deposit request submitted successfully. Awaiting admin approval.",
      });

      setSelectedAccountId("");
      setAmount("");
      setDescription("");
      setDepositMethod("");
      onDepositCreated();
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make a Deposit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="account">Select Account</Label>
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
            />
          </div>
          <div>
            <Label htmlFor="method">Deposit Method</Label>
            <Select value={depositMethod} onValueChange={setDepositMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select deposit method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash Deposit</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional notes..."
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitDeposit} 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Deposit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
