
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import QRCode from 'qrcode';
import { TOTP } from 'otpauth';
import { Shield, Copy, Check } from "lucide-react";

const TwoFactorSetup = () => {
  const [userSettings, setUserSettings] = useState<Tables<"user_settings"> | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { profile, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (profile?.id) {
      fetchUserSettings();
    }
  }, [profile?.id]);

  const fetchUserSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', profile?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setUserSettings(data);
      } else {
        // Create settings if they don't exist
        const { data: newSettings, error: createError } = await supabase
          .from('user_settings')
          .insert({ user_id: profile?.id })
          .select()
          .single();
        
        if (createError) throw createError;
        setUserSettings(newSettings);
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  };

  const generateSecret = () => {
    const totp = new TOTP({
      issuer: 'CCMC Bank',
      label: user?.email || 'User',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    });
    
    return totp.secret.base32;
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  };

  const startSetup = async () => {
    try {
      const newSecret = generateSecret();
      const newBackupCodes = generateBackupCodes();
      
      const totp = new TOTP({
        issuer: 'CCMC Bank',
        label: user?.email || 'User',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: newSecret,
      });

      const qrCode = await QRCode.toDataURL(totp.toString());
      
      setSecret(newSecret);
      setQrCodeUrl(qrCode);
      setBackupCodes(newBackupCodes);
      setIsSettingUp(true);
    } catch (error) {
      console.error('Error starting 2FA setup:', error);
      toast({
        title: "Error",
        description: "Failed to start 2FA setup",
        variant: "destructive",
      });
    }
  };

  const verifyAndEnable = async () => {
    if (!verificationCode || !secret) return;

    try {
      const totp = new TOTP({
        issuer: 'CCMC Bank',
        label: user?.email || 'User',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secret,
      });

      const isValid = totp.validate({ token: verificationCode, window: 1 });
      
      if (!isValid) {
        toast({
          title: "Invalid Code",
          description: "Please check your code and try again",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('user_settings')
        .update({
          two_factor_enabled: true,
          two_factor_secret: secret,
          two_factor_backup_codes: backupCodes,
          show_2fa_notification: false,
        })
        .eq('user_id', profile?.id);

      if (error) throw error;

      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully enabled",
      });

      await fetchUserSettings();
      setIsSettingUp(false);
      setVerificationCode("");
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast({
        title: "Error",
        description: "Failed to enable 2FA",
        variant: "destructive",
      });
    }
  };

  const disable2FA = async () => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({
          two_factor_enabled: false,
          two_factor_secret: null,
          two_factor_backup_codes: null,
        })
        .eq('user_id', profile?.id);

      if (error) throw error;

      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled",
      });

      await fetchUserSettings();
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast({
        title: "Error",
        description: "Failed to disable 2FA",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
      toast({
        title: "Copied",
        description: "Code copied to clipboard",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  if (!userSettings) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Status</p>
            <p className="text-sm text-muted-foreground">
              {userSettings.two_factor_enabled ? "Enabled" : "Disabled"}
            </p>
          </div>
          <Badge variant={userSettings.two_factor_enabled ? "default" : "secondary"}>
            {userSettings.two_factor_enabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>

        {!userSettings.two_factor_enabled && !isSettingUp && (
          <Button onClick={startSetup}>
            Enable Two-Factor Authentication
          </Button>
        )}

        {isSettingUp && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="font-medium mb-2">Scan this QR code with your authenticator app:</p>
              {qrCodeUrl && (
                <img src={qrCodeUrl} alt="2FA QR Code" className="mx-auto border rounded" />
              )}
            </div>

            <div>
              <Label htmlFor="verification">Enter verification code</Label>
              <Input
                id="verification"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>

            <div className="space-y-2">
              <p className="font-medium">Backup Codes (Save these securely):</p>
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between bg-gray-50 p-2 rounded font-mono text-sm"
                  >
                    <span>{code}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(code)}
                    >
                      {copiedCode === code ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={verifyAndEnable} disabled={!verificationCode}>
                Verify and Enable
              </Button>
              <Button variant="outline" onClick={() => setIsSettingUp(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {userSettings.two_factor_enabled && (
          <div className="space-y-4">
            <p className="text-sm text-green-600">
              Two-factor authentication is enabled and protecting your account.
            </p>
            <Button variant="destructive" onClick={disable2FA}>
              Disable Two-Factor Authentication
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFactorSetup;
