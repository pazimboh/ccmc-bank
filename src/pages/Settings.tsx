
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import TwoFactorSetup from "@/components/auth/TwoFactorSetup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("settings");

  useEffect(() => {
    document.title = "Settings - CCMC Bank";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            
            <Tabs defaultValue="security" className="space-y-6">
              <TabsList>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="security" className="space-y-6">
                <TwoFactorSetup />
              </TabsContent>
              
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Additional preferences will be available here. This section is under development.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
