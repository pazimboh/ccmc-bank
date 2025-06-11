
import { Link } from "react-router-dom";
import {
  Users,
  PiggyBank,
  BarChart3,
  Clock,
  Settings,
  ShieldAlert,
  FileText,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  {
    id: "overview",
    label: "Dashboard",
    icon: BarChart3,
    href: "/admin",
  },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
    href: "/admin/customers",
  },
  {
    id: "loans",
    label: "Loan Applications",
    icon: PiggyBank,
    href: "/admin/loans",
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: Calculator,
    href: "/admin/transactions",
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
    href: "/admin/reports",
  },
  {
    id: "audit",
    label: "Audit Log",
    icon: Clock,
    href: "/admin/audit",
  },
  {
    id: "security",
    label: "Security",
    icon: ShieldAlert,
    href: "/admin/security",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

const AdminNav = ({ activeTab, setActiveTab }: AdminNavProps) => {
  return (
    <nav className="hidden md:block w-64 bg-white border-r border-gray-200 p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              activeTab === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="absolute bottom-4 w-56">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-blue-800">
          <h3 className="font-medium text-sm mb-2">Admin Help Center</h3>
          <p className="text-xs mb-3">
            Need assistance with administrative tasks? Check the admin documentation.
          </p>
          <Link to="/admin/help">
            <button className="text-xs text-blue-600 font-medium hover:underline">
              View Documentation
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
