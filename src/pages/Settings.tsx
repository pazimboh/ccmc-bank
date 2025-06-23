
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import TwoFactorSetup from "@/components/auth/TwoFactorSetup";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Settings - CCMC Bank";
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
        console.error('Error fetching settings:', error);
        return;
      }

      if (data) {
        setEmailNotifications(data.email_notifications);
        setSmsNotifications(data.sms_notifications);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateNotificationSetting = async (field: string, value: boolean) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user?.id,
          [field]: value
        });

      if (error) throw error;

      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive transaction alerts and account updates via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={(checked) => {
                        setEmailNotifications(checked);
                        updateNotificationSetting('email_notifications', checked);
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important alerts via SMS
                      </p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={smsNotifications}
                      onCheckedChange={(checked) => {
                        setSmsNotifications(checked);
                        updateNotificationSetting('sms_notifications', checked);
                      }}
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>

              <TwoFactorSetup />

              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Your account details and verification status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Email Address</Label>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <div>
                      <Label>Account Created</Label>
                      <p className="text-sm text-muted-foreground">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
