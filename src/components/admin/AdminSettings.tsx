
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Save, Settings, Bell, Mail, Database } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure system preferences and operational settings</p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic system configuration and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bank-name">Bank Name</Label>
                <Input id="bank-name" defaultValue="CCMC Bank" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Administrator Email</Label>
                <Input id="admin-email" type="email" defaultValue="admin@ccmcbank.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="support-phone">Support Phone Number</Label>
              <Input id="support-phone" defaultValue="(237) 653-225-597" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bank-address">Bank Address</Label>
              <Textarea id="bank-address" defaultValue="123 Financial District, Douala, Cameroon" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="loan-notifications">Loan Application Notifications</Label>
                <p className="text-sm text-muted-foreground">Notify when new loan applications are submitted</p>
              </div>
              <Switch id="loan-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="customer-notifications">Customer Registration Notifications</Label>
                <p className="text-sm text-muted-foreground">Notify when new customers register</p>
              </div>
              <Switch id="customer-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="security-alerts">Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Immediate alerts for security events</p>
              </div>
              <Switch id="security-alerts" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="daily-reports">Daily Reports</Label>
                <p className="text-sm text-muted-foreground">Automated daily summary reports</p>
              </div>
              <Switch id="daily-reports" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
            <CardDescription>Configure email server settings for system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtp-server">SMTP Server</Label>
                <Input id="smtp-server" placeholder="smtp.example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input id="smtp-port" placeholder="587" />
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtp-username">Username</Label>
                <Input id="smtp-username" placeholder="your-email@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-password">Password</Label>
                <Input id="smtp-password" type="password" placeholder="••••••••" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="smtp-ssl">Use SSL/TLS</Label>
                <p className="text-sm text-muted-foreground">Enable secure email transmission</p>
              </div>
              <Switch id="smtp-ssl" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Business Rules
            </CardTitle>
            <CardDescription>Configure lending and operational parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="min-credit-score">Minimum Credit Score</Label>
                <Input id="min-credit-score" type="number" defaultValue="600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-loan-amount">Maximum Loan Amount (FCFA)</Label>
                <Input id="max-loan-amount" type="number" defaultValue="200000000" />
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="interest-rate">Default Interest Rate (%)</Label>
                <Input id="interest-rate" type="number" step="0.1" defaultValue="5.0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auto-approval-limit">Auto-Approval Limit (FCFA)</Label>
                <Input id="auto-approval-limit" type="number" defaultValue="1000000" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="approval-workflow">Approval Workflow</Label>
              <Select defaultValue="manual">
                <SelectTrigger>
                  <SelectValue placeholder="Select approval workflow" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Review Only</SelectItem>
                  <SelectItem value="auto-small">Auto-approve small loans</SelectItem>
                  <SelectItem value="hybrid">Hybrid (Auto + Manual)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Maintenance</CardTitle>
            <CardDescription>System maintenance and backup configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-backup">Automatic Backups</Label>
                <p className="text-sm text-muted-foreground">Schedule daily database backups</p>
              </div>
              <Switch id="auto-backup" defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backup-time">Backup Time</Label>
              <Select defaultValue="02:00">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select backup time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="01:00">1:00 AM</SelectItem>
                  <SelectItem value="02:00">2:00 AM</SelectItem>
                  <SelectItem value="03:00">3:00 AM</SelectItem>
                  <SelectItem value="04:00">4:00 AM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="flex gap-2">
              <Button variant="outline">Run Manual Backup</Button>
              <Button variant="outline">Test Email Configuration</Button>
              <Button variant="outline">Clear System Cache</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
