
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, ShieldAlert, ShieldCheck, Key, Eye, AlertTriangle } from "lucide-react";

const AdminSecurity = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground">Manage system security and access controls</p>
        </div>
        <Button>
          <Shield className="h-4 w-4 mr-2" />
          Security Scan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92/100</div>
            <p className="text-xs text-muted-foreground">Excellent security posture</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Current user sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          Last security scan completed 2 hours ago. Next automated scan scheduled for tonight at 2:00 AM.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Access Control Settings</CardTitle>
          <CardDescription>Configure authentication and authorization settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
            </div>
            <Switch id="two-factor" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="session-timeout">Auto Session Timeout</Label>
              <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
            </div>
            <Switch id="session-timeout" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ip-whitelist">IP Address Whitelisting</Label>
              <p className="text-sm text-muted-foreground">Restrict admin access to specific IP ranges</p>
            </div>
            <Switch id="ip-whitelist" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="audit-logging">Enhanced Audit Logging</Label>
              <p className="text-sm text-muted-foreground">Log all administrative actions</p>
            </div>
            <Switch id="audit-logging" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password Policy</CardTitle>
          <CardDescription>Configure password requirements for all users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Minimum Password Length</Label>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">8</span>
                <span className="text-sm text-muted-foreground">characters</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password Expiry</Label>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">90</span>
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Require uppercase letters</span>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Require lowercase letters</span>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Require numbers</span>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Require special characters</span>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>Monitor suspicious activities and security alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <ShieldAlert className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Multiple failed login attempts</p>
                  <p className="text-xs text-muted-foreground">IP: 192.168.1.50 • 2 hours ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Investigate</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Key className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Admin password changed</p>
                  <p className="text-xs text-muted-foreground">User: admin@ccmc.com • 1 day ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Security scan completed</p>
                  <p className="text-xs text-muted-foreground">No threats detected • 2 hours ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSecurity;
