
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  Activity, 
  Shield, 
  FileText, 
  BarChart3, 
  Settings,
  Banknote
} from "lucide-react";

interface AdminNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AdminNav = ({ activeSection, setActiveSection }: AdminNavProps) => {
  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "customers", label: "Customers", icon: Users },
    { id: "deposits", label: "Deposits", icon: Banknote },
    { id: "loans", label: "Loans", icon: CreditCard },
    { id: "transactions", label: "Transactions", icon: DollarSign },
    { id: "security", label: "Security", icon: Shield },
    { id: "audit", label: "Audit Log", icon: Activity },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection(item.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </div>
      <Separator className="my-4" />
    </div>
  );
};

export default AdminNav;
