
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HospitalDashboardHeader from "@/components/hospital/HospitalDashboardHeader";
import HospitalSidebar from "@/components/hospital/HospitalSidebar";
import DashboardOverview from "@/components/hospital/DashboardOverview";
import WalletManagement from "@/components/hospital/WalletManagement";
import TransactionHistory from "@/components/hospital/TransactionHistory";
import PaymentProcessor from "@/components/hospital/PaymentProcessor";
import UserManagement from "@/components/hospital/UserManagement";
import PatientManagement from "@/components/hospital/PatientManagement";
import LoanApplications from "@/components/hospital/LoanApplications";
import SupportAndDisputes from "@/components/hospital/SupportAndDisputes";
import HospitalReports from "@/components/hospital/HospitalReports";
import HealthCardManagement from "@/components/hospital/HealthCardManagement";
import HospitalSettings from "@/components/hospital/HospitalSettings";
import ComplianceVerification from "@/components/hospital/ComplianceVerification";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import SidebarWrapper from "@/components/SidebarWrapper";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Extract tab from URL query parameters
  const query = new URLSearchParams(location.search);
  const activeTab = query.get("tab") || "overview";

  // In a real app, this would be fetched from an API after authentication
  const [hospitalData, setHospitalData] = useState({
    hospitalName: "City General Hospital",
    hospitalId: "CGH12345",
    email: "admin@citygeneralhospital.com",
  });

  // Check authentication status (simplified for demo)
  const isAuthenticated = localStorage.getItem("hospitalAuthToken");
  
  useEffect(() => {
    // Display welcome toast when dashboard loads for the first time
    if (!localStorage.getItem("dashboardWelcomeShown")) {
      toast({
        title: "Welcome to Hospital Dashboard",
        description: "Manage your hospital operations, patients, and financial activities.",
        duration: 5000,
      });
      localStorage.setItem("dashboardWelcomeShown", "true");
    }
  }, [toast]);
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    navigate("/login");
    return null;
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    navigate(value === "overview" ? "/hospital-dashboard" : `/hospital-dashboard?tab=${value}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dashboard Refreshed",
        description: "Latest data has been loaded successfully.",
        duration: 3000,
      });
    }, 1500);
  };

  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: `${activeTab} data is being exported to Excel.`,
      duration: 3000,
    });
  };

  return (
    <SidebarWrapper>
      <HospitalSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 overflow-auto">
        <HospitalDashboardHeader 
          hospitalName={hospitalData.hospitalName}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="p-6">
          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold">Hospital Dashboard</h1>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh Data"}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="bg-white border overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="patients">Patient Management</TabsTrigger>
              <TabsTrigger value="health-cards">Health Cards</TabsTrigger>
              <TabsTrigger value="payments">Process Payment</TabsTrigger>
              <TabsTrigger value="loans">Loan Applications</TabsTrigger>
              <TabsTrigger value="wallet">Wallet Management</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="support">Support & Disputes</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="settings">Hospital Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <DashboardOverview />
            </TabsContent>
            
            <TabsContent value="patients" className="mt-6">
              <PatientManagement />
            </TabsContent>
            
            <TabsContent value="health-cards" className="mt-6">
              <HealthCardManagement />
            </TabsContent>
            
            <TabsContent value="payments" className="mt-6">
              <PaymentProcessor />
            </TabsContent>
            
            <TabsContent value="loans" className="mt-6">
              <LoanApplications />
            </TabsContent>
            
            <TabsContent value="wallet" className="mt-6">
              <WalletManagement />
            </TabsContent>
            
            <TabsContent value="transactions" className="mt-6">
              <TransactionHistory />
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6">
              <HospitalReports />
            </TabsContent>
            
            <TabsContent value="compliance" className="mt-6">
              <ComplianceVerification />
            </TabsContent>
            
            <TabsContent value="support" className="mt-6">
              <SupportAndDisputes />
            </TabsContent>
            
            <TabsContent value="users" className="mt-6">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <HospitalSettings />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Toaster />
    </SidebarWrapper>
  );
};

export default HospitalDashboard;
