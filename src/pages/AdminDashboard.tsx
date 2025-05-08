import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdminDashboardHeader from "@/components/admin/AdminDashboardHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview";
import LoanApproval from "@/components/admin/LoanApproval";
import HospitalManagement from "@/components/admin/HospitalManagement";
import AdminHealthCardManagement from "@/components/admin/AdminHealthCardManagement";
import AdminPlatformFeeManagement from "@/components/admin/AdminPlatformFeeManagement";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import AdminSystemSettings from "@/components/admin/AdminSystemSettings";
import SalesTargetManagement from "@/components/admin/SalesTargetManagement";
import CommissionStructure from "@/components/admin/CommissionStructure";
import HospitalUserManagement from "@/components/admin/HospitalUserManagement";
import AdminReports from "@/components/admin/AdminReports";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import SidebarWrapper from "@/components/SidebarWrapper";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Filter, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState("hospital");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const query = new URLSearchParams(location.search);
  const activeTab = query.get("tab") || "overview";

  const handleTabChange = (value: string) => {
    navigate(`/admin-dashboard?tab=${value}`);
  };

  const [adminData, setAdminData] = useState({
    adminName: "Admin User",
    adminId: "A12345",
    role: "System Administrator",
  });

  useEffect(() => {
    if (!localStorage.getItem("adminDashboardWelcomeShown")) {
      toast({
        title: "Welcome to Admin Dashboard",
        description: "Manage hospital registrations, loan approvals, and system settings.",
        duration: 5000,
      });
      localStorage.setItem("adminDashboardWelcomeShown", "true");
    }
  }, [toast]);

  const handleQuickAction = (actionType: string) => {
    setQuickActionType(actionType);
    setIsQuickActionOpen(true);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dashboard Refreshed",
        description: "All data has been refreshed successfully.",
      });
    }, 1000);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: `Exporting ${activeTab} data to Excel...`,
    });
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `The ${activeTab} data has been exported successfully.`,
      });
    }, 1500);
  };

  const handleQuickActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let actionMessage = "";
    
    switch(quickActionType) {
      case "hospital":
        actionMessage = "Hospital registration request has been processed";
        break;
      case "loan":
        actionMessage = "Loan has been approved successfully";
        break;
      case "user":
        actionMessage = "User account has been created successfully";
        break;
      case "healthcard":
        actionMessage = "Health card has been created successfully";
        break;
    }
    
    toast({
      title: "Action Completed",
      description: actionMessage,
    });
    
    setIsQuickActionOpen(false);
  };

  return (
    <SidebarWrapper>
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 overflow-auto">
        <AdminDashboardHeader 
          adminName={adminData.adminName}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage all platform activities and settings
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button onClick={() => handleQuickAction("hospital")}>
                <Plus className="h-4 w-4 mr-2" />
                Quick Action
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => handleTabChange("loans")}>
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-full bg-blue-100 p-3">
                  <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="text-xl font-bold">3</div>
                <div className="text-sm font-medium">Pending Loans</div>
              </div>
            </Card>
            
            <Card className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => handleTabChange("hospitals")}>
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-full bg-green-100 p-3">
                  <svg className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-xl font-bold">3</div>
                <div className="text-sm font-medium">Hospital Registrations</div>
              </div>
            </Card>
            
            <Card className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => handleTabChange("users")}>
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-full bg-purple-100 p-3">
                  <svg className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="text-xl font-bold">1,248</div>
                <div className="text-sm font-medium">Active Users</div>
              </div>
            </Card>
            
            <Card className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => handleTabChange("health-cards")}>
              <div className="flex flex-col items-center space-y-2">
                <div className="rounded-full bg-amber-100 p-3">
                  <svg className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="text-xl font-bold">856</div>
                <div className="text-sm font-medium">Health Cards Issued</div>
              </div>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="bg-white border overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="loans">Loan Approvals</TabsTrigger>
              <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
              <TabsTrigger value="health-cards">Health Cards</TabsTrigger>
              <TabsTrigger value="platform">Platform Fees</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="hospital-users">Hospital Staff</TabsTrigger>
              <TabsTrigger value="sales-targets">Sales Targets</TabsTrigger>
              <TabsTrigger value="commissions">Commission Structure</TabsTrigger>
              <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <AdminDashboardOverview />
            </TabsContent>
            
            <TabsContent value="loans" className="mt-6">
              <LoanApproval />
            </TabsContent>
            
            <TabsContent value="hospitals" className="mt-6">
              <HospitalManagement />
            </TabsContent>
            
            <TabsContent value="health-cards" className="mt-6">
              <AdminHealthCardManagement />
            </TabsContent>
            
            <TabsContent value="platform" className="mt-6">
              <AdminPlatformFeeManagement />
            </TabsContent>
            
            <TabsContent value="users" className="mt-6">
              <AdminUserManagement />
            </TabsContent>
            
            <TabsContent value="hospital-users" className="mt-6">
              <HospitalUserManagement />
            </TabsContent>
            
            <TabsContent value="sales-targets" className="mt-6">
              <SalesTargetManagement />
            </TabsContent>
            
            <TabsContent value="commissions" className="mt-6">
              <CommissionStructure />
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6">
              <AdminReports />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <AdminSystemSettings />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <Dialog open={isQuickActionOpen} onOpenChange={setIsQuickActionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Quick Action</DialogTitle>
            <DialogDescription>
              {quickActionType === "hospital" ? "Process a hospital registration quickly" : 
               quickActionType === "loan" ? "Approve a loan application quickly" :
               quickActionType === "user" ? "Create a new user account quickly" :
               "Create a new health card quickly"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleQuickActionSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="actionType" className="text-right">Action Type</Label>
                <Select 
                  value={quickActionType} 
                  onValueChange={setQuickActionType}
                >
                  <SelectTrigger id="actionType" className="col-span-3">
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital Registration</SelectItem>
                    <SelectItem value="loan">Loan Approval</SelectItem>
                    <SelectItem value="user">User Creation</SelectItem>
                    <SelectItem value="healthcard">Health Card Creation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {quickActionType === "hospital" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="hospitalName" className="text-right">Hospital Name</Label>
                    <Input id="hospitalName" placeholder="Enter hospital name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="hospitalLocation" className="text-right">Location</Label>
                    <Input id="hospitalLocation" placeholder="Enter location" className="col-span-3" />
                  </div>
                </>
              )}
              
              {quickActionType === "loan" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="loanId" className="text-right">Loan ID</Label>
                    <Input id="loanId" placeholder="Enter loan ID" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="loanAmount" className="text-right">Amount</Label>
                    <Input id="loanAmount" type="number" placeholder="Enter amount" className="col-span-3" />
                  </div>
                </>
              )}
              
              {quickActionType === "user" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="userName" className="text-right">Full Name</Label>
                    <Input id="userName" placeholder="Enter user's name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="userEmail" className="text-right">Email</Label>
                    <Input id="userEmail" type="email" placeholder="Enter email" className="col-span-3" />
                  </div>
                </>
              )}
              
              {quickActionType === "healthcard" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cardType" className="text-right">Card Type</Label>
                    <Select defaultValue="basic">
                      <SelectTrigger id="cardType" className="col-span-3">
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="gold">Gold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patientId" className="text-right">Patient ID</Label>
                    <Input id="patientId" placeholder="Enter patient ID" className="col-span-3" />
                  </div>
                </>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Input id="notes" placeholder="Add any additional notes" className="col-span-3" />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit">Process Action</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </SidebarWrapper>
  );
};

export default AdminDashboard;