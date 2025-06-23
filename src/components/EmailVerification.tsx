
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

const EmailVerification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;

      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification email",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  // Don't show if user is already verified
  if (user?.email_confirmed_at) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-lg text-amber-800">Email Verification Required</CardTitle>
        </div>
        <CardDescription className="text-amber-700">
          Please verify your email address to ensure account security and receive important notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleResendVerification} 
            disabled={isResending}
            variant="outline"
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            {isResending ? "Sending..." : "Resend Verification Email"}
          </Button>
          <div className="text-sm text-amber-600">
            Sent to: {user?.email}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
