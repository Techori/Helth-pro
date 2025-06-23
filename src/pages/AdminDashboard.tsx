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
import AdminEMITransactions from "@/components/admin/AdminEMITransactions";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState("hospital");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State for quick action form fields
  const [quickActionForm, setQuickActionForm] = useState({
    hospitalName: "",
    hospitalLocation: "",
    loanId: "",
    loanAmount: "",
    userName: "",
    userEmail: "",
    cardType: "basic",
    patientId: "",
    notes: "",
  });

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
    // Reset form fields when opening the dialog
    setQuickActionForm({
      hospitalName: "",
      hospitalLocation: "",
      loanId: "",
      loanAmount: "",
      userName: "",
      userEmail: "",
      cardType: "basic",
      patientId: "",
      notes: "",
    });
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

  const handleQuickActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let endpoint = "";
    let payload = {};
    let actionMessage = "";
    let errorMessage = "Something went wrong. Please try again.";

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      switch (quickActionType) {
        case "hospital":
          if (!quickActionForm.hospitalName || !quickActionForm.hospitalLocation) {
            toast({
              variant: "destructive",
              title: "Missing Information",
              description: "Hospital name and location are required.",
            });
            return;
          }
          endpoint = "/api/admin/quick-action/hospital";
          payload = {
            name: quickActionForm.hospitalName,
            location: quickActionForm.hospitalLocation,
            notes: quickActionForm.notes,
          };
          actionMessage = "Hospital registration request has been processed.";
          errorMessage = "Failed to process hospital registration.";
          break;

        case "loan":
          if (!quickActionForm.loanId || !quickActionForm.loanAmount) {
            toast({
              variant: "destructive",
              title: "Missing Information",
              description: "Loan ID and amount are required.",
            });
            return;
          }
          endpoint = "/api/admin/quick-action/loan";
          payload = {
            loanId: quickActionForm.loanId,
            amount: parseFloat(quickActionForm.loanAmount),
            notes: quickActionForm.notes,
          };
          actionMessage = "Loan has been approved successfully.";
          errorMessage = "Failed to approve loan.";
          break;

        case "user":
          if (!quickActionForm.userName || !quickActionForm.userEmail) {
            toast({
              variant: "destructive",
              title: "Missing Information",
              description: "User name and email are required.",
            });
            return;
          }
          endpoint = "/api/admin/quick-action-user-creation";
          payload = {
            name: quickActionForm.userName,
            email: quickActionForm.userEmail,
            notes: quickActionForm.notes,
          };
          actionMessage = "User account has been created successfully.";
          errorMessage = "Failed to create user account.";
          break;

        case "healthcard":
          if (!quickActionForm.patientId) {
            toast({
              variant: "destructive",
              title: "Missing Information",
              description: "Patient ID is required.",
            });
            return;
          }
          endpoint = "/api/admin/quick-action/health-card";
          payload = {
            cardType: quickActionForm.cardType,
            patientId: quickActionForm.patientId,
            notes: quickActionForm.notes,
          };
          actionMessage = "Health card has been created successfully.";
          errorMessage = "Failed to create health card.";
          break;

        default:
          throw new Error("Invalid action type.");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || errorMessage);
      }

      toast({
        title: "Action Completed",
        description: actionMessage,
      });

      setIsQuickActionOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || errorMessage,
      });
    }
  };

  // Handle form field changes
  const handleQuickActionFormChange = (field: string, value: string) => {
    setQuickActionForm((prev) => ({
      ...prev,
      [field]: value,
    }));
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
              <TabsTrigger value="emi-transactions">EMI Transactions</TabsTrigger>
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

            <TabsContent value="emi-transactions" className="mt-6">
              <AdminEMITransactions />
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
                  onValueChange={(value) => setQuickActionType(value)}
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
                    <Input
                      id="hospitalName"
                      placeholder="Enter hospital name"
                      className="col-span-3"
                      value={quickActionForm.hospitalName}
                      onChange={(e) => handleQuickActionFormChange("hospitalName", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="hospitalLocation" className="text-right">Location</Label>
                    <Input
                      id="hospitalLocation"
                      placeholder="Enter location"
                      className="col-span-3"
                      value={quickActionForm.hospitalLocation}
                      onChange={(e) => handleQuickActionFormChange("hospitalLocation", e.target.value)}
                    />
                  </div>
                </>
              )}

              {quickActionType === "loan" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="loanId" className="text-right">
                      Application Number</Label>
                    <Input
                      id="loanId"
                      placeholder="Enter 
Application Number"
                      className="col-span-3"
                      value={quickActionForm.loanId}
                      onChange={(e) => handleQuickActionFormChange("loanId", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="loanAmount" className="text-right">Amount</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="Enter amount"
                      className="col-span-3"
                      value={quickActionForm.loanAmount}
                      onChange={(e) => handleQuickActionFormChange("loanAmount", e.target.value)}
                    />
                  </div>
                </>
              )}

              {quickActionType === "user" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="userName" className="text-right">Full Name</Label>
                    <Input
                      id="userName"
                      placeholder="Enter user's name"
                      className="col-span-3"
                      value={quickActionForm.userName}
                      onChange={(e) => handleQuickActionFormChange("userName", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="userEmail" className="text-right">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="Enter email"
                      className="col-span-3"
                      value={quickActionForm.userEmail}
                      onChange={(e) => handleQuickActionFormChange("userEmail", e.target.value)}
                    />
                  </div>
                </>
              )}

              {quickActionType === "healthcard" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cardType" className="text-right">Card Type</Label>
                    <Select
                      value={quickActionForm.cardType}
                      onValueChange={(value) => handleQuickActionFormChange("cardType", value)}
                    >
                      <SelectTrigger id="cardType" className="col-span-3">
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="platinum">Platinum</SelectItem>
                        <SelectItem value="gold">Gold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patientId" className="text-right">Patient ID</Label>
                    <Input
                      id="patientId"
                      placeholder="Enter patient ID"
                      className="col-span-3"
                      value={quickActionForm.patientId}
                      onChange={(e) => handleQuickActionFormChange("patientId", e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Add any additional notes"
                  className="col-span-3"
                  value={quickActionForm.notes}
                  onChange={(e) => handleQuickActionFormChange("notes", e.target.value)}
                />
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