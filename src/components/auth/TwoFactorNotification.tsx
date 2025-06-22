
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

const TwoFactorNotification = () => {
  const [userSettings, setUserSettings] = useState<Tables<"user_settings"> | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { profile } = useAuth();

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
        setIsVisible(data.show_2fa_notification && !data.two_factor_enabled);
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  };

  const dismissNotification = async () => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({ show_2fa_notification: false })
        .eq('user_id', profile?.id);

      if (error) throw error;
      setIsVisible(false);
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  if (!isVisible || !userSettings) {
    return null;
  }

  return (
    <Alert className="mb-4 border-yellow-200 bg-yellow-50">
      <Shield className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-yellow-800">
          Secure your account with two-factor authentication for enhanced protection.
        </span>
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/settings'}
            className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
          >
            Set up 2FA
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={dismissNotification}
            className="text-yellow-600 hover:bg-yellow-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default TwoFactorNotification;
