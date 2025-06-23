
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountCreated: () => void;
}

const CreateAccountModal = ({ isOpen, onClose, onAccountCreated }: CreateAccountModalProps) => {
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateAccount = async () => {
    if (!user || !accountName || !accountType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      // Generate account number
      const { data: accountNumberData, error: accountNumberError } = await supabase
        .rpc('generate_account_number');

      if (accountNumberError) throw accountNumberError;

      const { error } = await supabase
        .from('accounts')
        .insert({
          user_id: user.id,
          account_name: accountName,
          account_number: accountNumberData,
          account_type: accountType,
          balance: 0,
          currency: 'FCFA',
          status: 'pending', // Set as pending until admin approval
          account_status: 'pending' // Account status also pending
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account created successfully and is pending approval",
      });

      setAccountName("");
      setAccountType("");
      onAccountCreated();
      onClose();
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g., My Savings Account"
            />
          </div>
          <div>
            <Label htmlFor="accountType">Account Type</Label>
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg text-sm text-amber-800">
            <strong>Note:</strong> Your account will be created with pending status and requires admin approval before it can be used for transactions.
          </div>
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateAccount} 
              disabled={isCreating}
              className="flex-1"
            >
              {isCreating ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccountModal;
