
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const TwoFactorNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [userSettings, setUserSettings] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserSettings();
    }
  }, [user]);

  const fetchUserSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user settings:', error);
        return;
      }

      if (!data) {
        // Create default settings if they don't exist
        const { data: newSettings, error: createError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user?.id,
            two_factor_enabled: false,
            show_2fa_notification: true
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user settings:', createError);
          return;
        }
        setUserSettings(newSettings);
        setIsVisible(newSettings.show_2fa_notification && !newSettings.two_factor_enabled);
      } else {
        setUserSettings(data);
        setIsVisible(data.show_2fa_notification && !data.two_factor_enabled);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDismiss = async () => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({ show_2fa_notification: false })
        .eq('user_id', user?.id);

      if (error) throw error;
      setIsVisible(false);
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  if (!isVisible || !userSettings) return null;

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <Shield className="h-4 w-4 text-orange-600" />
      <div className="flex justify-between items-start w-full">
        <AlertDescription className="text-orange-800">
          <strong>Secure your account!</strong> Enable two-factor authentication for enhanced security. 
          Go to Settings to set up 2FA.
        </AlertDescription>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="text-orange-600 hover:text-orange-800 p-1 h-auto"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
};

export default TwoFactorNotification;
