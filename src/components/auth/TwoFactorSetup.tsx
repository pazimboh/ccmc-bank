
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import QRCode from 'qrcode';

const TwoFactorSetup = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkTwoFactorStatus();
    }
  }, [user]);

  const checkTwoFactorStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('two_factor_enabled, two_factor_secret')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking 2FA status:', error);
        return;
      }

      if (data) {
        setIsEnabled(data.two_factor_enabled);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const generateSecret = () => {
    // Generate a random secret (32 characters)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  const generateQRCode = async () => {
    setIsLoading(true);
    try {
      const newSecret = generateSecret();
      setSecret(newSecret);

      const issuer = 'CCMC Bank';
      const accountName = user?.email || 'user';
      const otpauth = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${newSecret}&issuer=${encodeURIComponent(issuer)}`;
      
      const qrUrl = await QRCode.toDataURL(otpauth);
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // For demo purposes, we'll accept any 6-digit code
      // In production, you'd verify the TOTP code against the secret
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user?.id,
          two_factor_enabled: true,
          two_factor_secret: secret,
          show_2fa_notification: false
        });

      if (error) throw error;

      setIsEnabled(true);
      toast({
        title: "Success",
        description: "Two-factor authentication enabled successfully",
      });

      setQrCodeUrl("");
      setSecret("");
      setVerificationCode("");
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast({
        title: "Error",
        description: "Failed to enable two-factor authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disable2FA = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({
          two_factor_enabled: false,
          two_factor_secret: null
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      setIsEnabled(false);
      toast({
        title: "Success",
        description: "Two-factor authentication disabled",
      });
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast({
        title: "Error",
        description: "Failed to disable two-factor authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEnabled ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">Two-factor authentication is enabled for your account.</p>
            </div>
            <Button 
              variant="destructive" 
              onClick={disable2FA} 
              disabled={isLoading}
            >
              {isLoading ? "Disabling..." : "Disable 2FA"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {!qrCodeUrl ? (
              <Button onClick={generateQRCode} disabled={isLoading}>
                {isLoading ? "Generating..." : "Set Up 2FA"}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Scan this QR code with your authenticator app
                  </p>
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                    {secret}
                  </p>
                </div>
                <div>
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={verifyAndEnable} disabled={isLoading} className="flex-1">
                    {isLoading ? "Verifying..." : "Verify & Enable"}
                  </Button>
                  <Button variant="outline" onClick={() => setQrCodeUrl("")} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFactorSetup;
