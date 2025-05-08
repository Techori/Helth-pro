import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import SidebarWrapper from "@/components/SidebarWrapper";
import CrmDashboardHeader from "@/components/crm/CrmDashboardHeader";
import CrmSidebar from "@/components/crm/CrmSidebar";
import CrmOverview from "@/components/crm/CrmOverview";
import LeadManagement from "@/components/crm/LeadManagement";
import CustomerManagement from "@/components/crm/CustomerManagement";
import Opportunities from "@/components/crm/Opportunities";
import PresalesActivities from "@/components/crm/PresalesActivities";
import Reporting from "@/components/crm/Reporting";
import CrmSettings from "@/components/crm/CrmSettings";
import CampaignManagement from "@/components/crm/CampaignManagement";
import TasksAndCalendar from "@/components/crm/TasksAndCalendar";
import { FileDown, Plus, Printer, RefreshCw } from "lucide-react";

const CrmDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Extract tab from URL query parameters
  const query = new URLSearchParams(location.search);
  const activeTab = query.get("tab") || "overview";

  // In a real app, this would be fetched from an API
  const [crmUserData, setCrmUserData] = useState({
    name: "Priya Sharma",
    id: "CRM-456",
    role: "Relationship Manager",
    team: "Healthcare Solutions",
    email: "priya.sharma@rimed.com",
    activeCustomers: 156,
    openOpportunities: 18,
  });

  useEffect(() => {
    // Display welcome toast when dashboard loads for the first time
    if (!localStorage.getItem("crmDashboardWelcomeShown")) {
      toast({
        title: "Welcome to CRM Dashboard",
        description: "Manage your customer relationships, leads, and presales activities.",
        duration: 5000,
      });
      localStorage.setItem("crmDashboardWelcomeShown", "true");
    }
  }, [toast]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    navigate(value === "overview" ? "/crm-dashboard" : `/crm-dashboard?tab=${value}`);
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
      <CrmSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 overflow-auto">
        <CrmDashboardHeader 
          userName={crmUserData.name}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">CRM Dashboard</h1>
              <p className="text-muted-foreground">
                Last updated: {lastUpdated.toLocaleString()}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline" className="bg-blue-50">
                  {crmUserData.activeCustomers} Active Customers
                </Badge>
                <Badge variant="outline" className="bg-green-50">
                  {crmUserData.openOpportunities} Open Opportunities
                </Badge>
              </div>
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
              
              {activeTab === "customers" && (
                <Button 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Add New Customer",
                      description: "Creating a new customer record",
                      duration: 3000,
                    });
                  }} 
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Customer
                </Button>
              )}
              
              {activeTab === "opportunities" && (
                <Button 
                  size="sm"
                  onClick={() =>           {
                    toast({
                      title: "Add New Opportunity",
                      description: "Creating a new business opportunity",
                      duration: 3000,
                    });
                  }} 
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Opportunity
                </Button>
              )}
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="bg-white border overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="leads">Lead Management</TabsTrigger>
              <TabsTrigger value="customers">Customer Management</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="presales">Presales Activities</TabsTrigger>
              <TabsTrigger value="campaigns">Campaign Management</TabsTrigger>
              <TabsTrigger value="tasks">Tasks & Calendar</TabsTrigger>
              <TabsTrigger value="reporting">Reporting</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <CrmOverview />
            </TabsContent>
            
            <TabsContent value="leads" className="mt-6">
              <LeadManagement />
            </TabsContent>
            
            <TabsContent value="customers" className="mt-6">
              <CustomerManagement />
            </TabsContent>
            
            <TabsContent value="opportunities" className="mt-6">
              <Opportunities />
            </TabsContent>
            
            <TabsContent value="presales" className="mt-6">
              <PresalesActivities />
            </TabsContent>
            
            <TabsContent value="campaigns" className="mt-6">
              <CampaignManagement />
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-6">
              <TasksAndCalendar />
            </TabsContent>
            
            <TabsContent value="reporting" className="mt-6">
              <Reporting />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <CrmSettings />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Toaster />
    </SidebarWrapper>
  );
};

export default CrmDashboard;