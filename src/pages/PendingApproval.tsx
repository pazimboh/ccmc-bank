
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Clock } from "lucide-react";

const PendingApproval = () => {
  const { signOut, profile } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-primary py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-foreground">CCMC Bank</h1>
          <Button variant="secondary" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-full w-fit">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Account Pending Approval</CardTitle>
            <CardDescription>
              Your account application is being reviewed by our team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg text-left">
              <h3 className="font-semibold mb-2">Application Details:</h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Name:</strong> {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Account Type:</strong> {profile?.account_type}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> <span className="capitalize">{profile?.status}</span>
              </p>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                We are currently reviewing your application. This process typically takes 1-3 business days.
              </p>
              <p>
                You will receive an email notification once your account has been approved.
              </p>
            </div>
            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-3">
                Need help? Contact us at support@ccmcbank.com or (237) 653-225-597
              </p>
              <Button variant="outline" onClick={signOut} className="w-full">
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PendingApproval;
