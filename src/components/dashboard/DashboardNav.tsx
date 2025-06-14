
import { Link } from "react-router-dom";
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  Landmark,
  PiggyBank,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    href: "/dashboard",
  },
  {
    id: "accounts",
    label: "Accounts",
    icon: CreditCard,
    href: "/accounts",
  },
  {
    id: "transfers",
    label: "Transfers",
    icon: DollarSign,
    href: "/transfers",
  },
  {
    id: "payments",
    label: "Payments",
    icon: Landmark,
    href: "/payments",
  },
  {
    id: "loans",
    label: "Loans",
    icon: PiggyBank,
    href: "/loans",
  },
  {
    id: "statements",
    label: "Statements",
    icon: BarChart3,
    href: "/statements",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

const DashboardNav = ({ activeTab, setActiveTab }: DashboardNavProps) => {
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
            onClick={(e) => {
              const isDashboardTabItem = ["overview", "accounts", "transfers"].includes(item.id);
              // If the item is one that corresponds to a Tab on the Dashboard page
              if (isDashboardTabItem) {
                // Prevent full page navigation for "accounts" and "transfers"
                // as they are handled by Tabs within Dashboard.tsx.
                // For "overview", href is /dashboard, so no real navigation if already there,
                // but preventDefault is harmless.
                if (item.id === "accounts" || item.id === "transfers") {
                  e.preventDefault();
                }
                // Also, if current path is already the item's href (e.g. already on /dashboard for overview)
                // it's good to prevent default to avoid unnecessary react-router actions.
                if (window.location.pathname === item.href) {
                  e.preventDefault();
                }
              }
              // Always set the active tab. This will control the Tabs in Dashboard.tsx
              setActiveTab(item.id);
              // For other items not part of Dashboard tabs (e.g., "loans", "settings"),
              // the Link will navigate to item.href as usual if e.preventDefault() was not called.
            }}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="absolute bottom-4 w-56">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-sm mb-2">Need Help?</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Contact our customer support team for assistance with your banking needs.
          </p>
          <Link to="/contact">
            <button className="text-xs text-primary hover:underline">
              Contact Support
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
