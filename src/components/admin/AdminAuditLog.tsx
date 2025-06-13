
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'error';
}

const AdminAuditLog = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Mock audit log data
    const mockLogs: AuditLogEntry[] = [
      {
        id: "1",
        timestamp: "2025-01-13 14:30:25",
        user: "admin@ccmc.com",
        action: "LOAN_APPROVED",
        resource: "loans/LOAN-001",
        details: "Approved loan application for Michael Brown",
        ipAddress: "192.168.1.100",
        status: "success"
      },
      {
        id: "2",
        timestamp: "2025-01-13 14:15:12",
        user: "admin@ccmc.com",
        action: "CUSTOMER_CREATED",
        resource: "customers/CUST-456",
        details: "Created new customer account",
        ipAddress: "192.168.1.100",
        status: "success"
      },
      {
        id: "3",
        timestamp: "2025-01-13 13:45:08",
        user: "admin@ccmc.com",
        action: "LOGIN_ATTEMPT",
        resource: "auth/login",
        details: "Failed login attempt - incorrect password",
        ipAddress: "192.168.1.50",
        status: "error"
      },
      {
        id: "4",
        timestamp: "2025-01-13 13:30:45",
        user: "admin@ccmc.com",
        action: "PROFILE_UPDATED",
        resource: "profiles/PROF-789",
        details: "Updated customer profile information",
        ipAddress: "192.168.1.100",
        status: "success"
      },
      {
        id: "5",
        timestamp: "2025-01-13 12:20:30",
        user: "system",
        action: "BACKUP_COMPLETED",
        resource: "system/backup",
        details: "Daily database backup completed successfully",
        ipAddress: "127.0.0.1",
        status: "success"
      },
    ];
    setAuditLogs(mockLogs);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredLogs = auditLogs.filter(log =>
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground">Track all system activities and user actions</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>System Activity Log</CardTitle>
              <CardDescription>Complete audit trail of all system activities</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search audit logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm">{log.action}</code>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{log.resource}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{log.details}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuditLog;
