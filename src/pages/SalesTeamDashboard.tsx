import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import SidebarWrapper from "@/components/SidebarWrapper";
import SalesTeamDashboardHeader from "@/components/sales/SalesTeamDashboardHeader";
import SalesTeamSidebar from "@/components/sales/SalesTeamSidebar";
import SalesOverview from "@/components/sales/SalesOverview";
import LeadManagement from "@/components/sales/LeadManagement";
import CardSalesManagement from "@/components/sales/CardSalesManagement";
import LoanSalesManagement from "@/components/sales/LoanSalesManagement";
import SalesTeamSettings from "@/components/sales/SalesTeamSettings";
import CommissionManagement from "@/components/sales/CommissionManagement";
import SalesReports from "@/components/sales/SalesReports";
import AgentManagement from "@/components/sales/AgentManagement";
import { FileDown, Plus, Printer, RefreshCw, UserPlus } from "lucide-react";

const SalesTeamDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { authState } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Extract tab from URL query parameters
  const query = new URLSearchParams(location.search);
  const activeTab = query.get("tab") || "overview";

  // Check authentication
  useEffect(() => {
    if (authState.initialized && !authState.user) {
      navigate("/login", { replace: true });
    } else if (authState.user && authState.user.role !== "sales") {
      navigate(`/${authState.user.role}-dashboard`, { replace: true });
    }
  }, [authState.initialized, authState.user, navigate]);

  // Sales user data from auth state or default values
  const [salesUserData, setSalesUserData] = useState({
    name: authState.user?.firstName 
      ? `${authState.user.firstName} ${authState.user.lastName}` 
      : "Rahul Mehta",
    id: authState.user?.id || "SALES-123",
    role: "Senior Sales Executive",
    region: "North India",
    email: authState.user?.email || "rahul.mehta@rimed.com",
    targetAchieved: 78,
    pendingLeads: 24,
  });
  
  useEffect(() => {
    // Display welcome toast when dashboard loads for the first time
    if (!localStorage.getItem("salesDashboardWelcomeShown") && authState.user) {
      toast({
        title: "Welcome to Sales Dashboard",
        description: "Manage your sales activities, leads, and track your performance.",
        duration: 5000,
      });
      localStorage.setItem("salesDashboardWelcomeShown", "true");
    }
  }, [toast, authState.user]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    navigate(value === "overview" ? "/sales-dashboard" : `/sales-dashboard?tab=${value}`);
  };

  // Simulate data refresh
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
      
      toast({
        title: "Dashboard Updated",
        description: "Latest data has been loaded successfully.",
        duration: 3000,
      });
    }, 1500);
  };

  // Handle export to Excel/PDF
  const handleExport = (format: "excel" | "pdf") => {
    toast({
      title: `Exporting to ${format.toUpperCase()}`,
      description: `Your ${activeTab} data is being exported to ${format.toUpperCase()}.`,
      duration: 3000,
    });
  };

  // Handle print dashboard
  const handlePrint = () => {
    toast({
      title: "Preparing Print View",
      description: "Your dashboard is being prepared for printing.",
      duration: 3000,
    });
    window.print();
  };

  if (authState.loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <SidebarWrapper>
      <SalesTeamSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 overflow-auto">
        <SalesTeamDashboardHeader 
          userName={salesUserData.name}
          userRole={salesUserData.role}
          targetAchieved={salesUserData.targetAchieved}
          pendingLeads={salesUserData.pendingLeads}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Sales Dashboard</h1>
              <p className="text-muted-foreground">
                Last updated: {lastUpdated.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Managed by: <span className="font-semibold">Mr. King Raj Rishishwar</span>, Managing Director - Rishishwar Industry Private Limited
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExport("excel")} 
              >
                <FileDown className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExport("pdf")} 
              >
                <FileDown className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePrint} 
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              
              {activeTab === "leads" && (
                <Button 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Add New Lead",
                      description: "Creating a new lead entry form",
                      duration: 3000,
                    });
                  }} 
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Lead
                </Button>
              )}
              
              {activeTab === "cards" && (
                <Button 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "New Card Sale",
                      description: "Creating a new health card sale form",
                      duration: 3000,
                    });
                  }} 
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Card Sale
                </Button>
              )}
              
              {activeTab === "loans" && (
                <Button 
                  size="sm"
                  onClick={() => navigate("/apply-loan")} 
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Loan Application
                </Button>
              )}
              
              {activeTab === "agents" && (
                <Button 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Add New Agent/DSA",
                      description: "Creating a new agent registration form",
                      duration: 3000,
                    });
                  }} 
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Agent/DSA
                </Button>
              )}
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="bg-white border overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="leads">Lead Management</TabsTrigger>
              <TabsTrigger value="cards">Health Cards</TabsTrigger>
              <TabsTrigger value="loans">Loans</TabsTrigger>
              <TabsTrigger value="commission">Commission</TabsTrigger>
              <TabsTrigger value="agents">Agents/DSA</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <SalesOverview />
            </TabsContent>
            
            <TabsContent value="leads" className="mt-6">
              <LeadManagement />
            </TabsContent>
            
            <TabsContent value="cards" className="mt-6">
              <CardSalesManagement />
            </TabsContent>
            
            <TabsContent value="loans" className="mt-6">
              <LoanSalesManagement />
            </TabsContent>
            
            <TabsContent value="commission" className="mt-6">
              <CommissionManagement />
            </TabsContent>
            
            <TabsContent value="agents" className="mt-6">
              <AgentManagement />
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6">
              <SalesReports />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <SalesTeamSettings />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Toaster />
    </SidebarWrapper>
  );
};

export default SalesTeamDashboard;
