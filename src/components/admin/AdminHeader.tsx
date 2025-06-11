
import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, Search, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const AdminHeader = () => {
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    toast({
      title: "Coming soon",
      description: "Logout functionality will be implemented once connected to Supabase backend.",
    });
  };

  const handleNotificationClick = () => {
    toast({
      title: "System notifications",
      description: "You have 3 unread system notifications.",
    });
  };

  return (
    <header className="bg-primary text-primary-foreground border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="py-4">
                  <div className="flex items-center mb-6">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    <h2 className="text-lg font-semibold">CCMC Bank Admin</h2>
                  </div>
                  <nav className="space-y-2">
                    <Link to="/admin" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <Link to="/admin/customers" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
                      Customers
                    </Link>
                    <Link to="/admin/loans" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
                      Loan Applications
                    </Link>
                    <Link to="/admin/transactions" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
                      Transactions
                    </Link>
                    <Link to="/admin/reports" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
                      Reports
                    </Link>
                    <Link to="/admin/settings" className="block px-4 py-2 rounded-lg hover:bg-gray-100">
                      Settings
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/admin" className="flex items-center">
              <Shield className="h-6 w-6 mr-2 text-primary-foreground" />
              <span className="text-xl font-bold text-primary-foreground">CCMC Admin</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-md border bg-primary-foreground text-foreground border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={handleNotificationClick} className="text-primary-foreground">
                <Bell className="h-5 w-5" />
              </Button>
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center text-white">3</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/admin/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/admin/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center md:hidden">
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={handleNotificationClick} className="text-primary-foreground">
                <Bell className="h-5 w-5" />
              </Button>
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center text-white">3</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link to="/admin/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/admin/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
