
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import GuestRoute from "@/components/GuestRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ApplyLoan from "./pages/ApplyLoan";
import AdminDashboard from "./pages/AdminDashboard";
import Transfer from "./pages/Transfer";
import Loans from "./pages/Loans";
import Statements from "./pages/Statements";
import Settings from "./pages/Settings";
import Profiles from "./pages/Profiles";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GuestRoute><Index /></GuestRoute>} />
            <Route path="/auth" element={<GuestRoute><Auth /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/apply-loan" element={<ProtectedRoute><ApplyLoan /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
            <Route path="/loans" element={<ProtectedRoute><Loans /></ProtectedRoute>} />
            <Route path="/statements" element={<ProtectedRoute><Statements /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profiles /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
