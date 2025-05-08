
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SidebarWrapper from "@/components/SidebarWrapper";
import AgentDashboardHeader from "@/components/agent/AgentDashboardHeader";
import AgentSidebar from "@/components/agent/AgentSidebar";
import AgentOverview from "@/components/agent/AgentOverview";
import AgentReferrals from "@/components/agent/AgentReferrals";
import AgentCommissions from "@/components/agent/AgentCommissions";
import AgentSettings from "@/components/agent/AgentSettings";
import { FileDown, Plus, Printer, RefreshCw } from "lucide-react";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // In a real app, this would be fetched from an API after authentication
  const [agentData, setAgentData] = useState({
    name: "Rahul Sharma",
    id: "AGT-001",
    phone: "+91 98765 43210",
    location: "Mumbai",
    totalReferrals: 45,
    conversionRate: 78,
    totalEarnings: 234500,
    pendingPayouts: 35000,
  });

  // Check authentication status (simplified for demo)
  const isAuthenticated = localStorage.getItem("agentAuthToken");

  useEffect(() => {
    // Display welcome toast when dashboard loads for the first time
    if (!localStorage.getItem("agentDashboardWelcomeShown")) {
      toast({
        title: "Welcome to Agent Dashboard",
        description: "Track your referrals, commissions, and performance.",
        duration: 5000,
      });
      localStorage.setItem("agentDashboardWelcomeShown", "true");
    }
  }, [toast]);

  if (!isAuthenticated) {
    // For demo purposes, we'll set the token instead of redirecting
    localStorage.setItem("agentAuthToken", "demo-token");
    // navigate("/login");
    // return null;
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
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

  return (
    <SidebarWrapper>
      <AgentSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 overflow-auto">
        <AgentDashboardHeader 
          agentName={agentData.name}
          agentId={agentData.id}
          totalReferrals={agentData.totalReferrals}
          conversionRate={agentData.conversionRate}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Agent Dashboard</h1>
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
              
              {activeTab === "referrals" && (
                <Button 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Add New Referral",
                      description: "Creating a new referral entry form",
                      duration: 3000,
                    });
                  }} 
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Referral
                </Button>
              )}
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="bg-white border overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="commissions">Commissions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <AgentOverview agentData={agentData} />
            </TabsContent>
            
            <TabsContent value="referrals" className="mt-6">
              <AgentReferrals />
            </TabsContent>
            
            <TabsContent value="commissions" className="mt-6">
              <AgentCommissions />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <AgentSettings />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Toaster />
    </SidebarWrapper>
  );
};

export default AgentDashboard;
