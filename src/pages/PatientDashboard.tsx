
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientSidebar from "@/components/patient/PatientSidebar";
import PatientDashboardHeader from "@/components/patient/PatientDashboardHeader";
import PatientDashboardOverview from "@/components/patient/PatientDashboardOverview";
import HealthCardManagement from "@/components/patient/HealthCardManagement";
import LoanManagement from "@/components/patient/LoanManagement";
import HospitalVisits from "@/components/patient/HospitalVisits";
import ProfileSettings from "@/components/patient/ProfileSettings";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import SidebarWrapper from "@/components/SidebarWrapper";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authState, signOut } = useAuth();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Extract tab from URL query parameters
  const query = new URLSearchParams(location.search);
  const activeTab = query.get("tab") || "overview";

  // Check authentication
  useEffect(() => {
    if (authState.initialized && !authState.user) {
      navigate("/login", { replace: true });
    } else if (authState.user && authState.user.role !== "patient") {
      navigate(`/${authState.user.role}-dashboard`, { replace: true });
    }
  }, [authState.initialized, authState.user, navigate]);

  // Patient data from auth state or default values
  const patientData = {
    patientName: authState.user?.firstName 
      ? `${authState.user.firstName} ${authState.user.lastName}` 
      : "John Doe",
    patientId: authState.user?.id || "P12345",
    email: authState.user?.email || "john.doe@example.com",
    healthCardId: "HC-78901-23456",
  };

  useEffect(() => {
    // Display welcome toast when dashboard loads for the first time
    if (!localStorage.getItem("patientDashboardWelcomeShown") && authState.user) {
      toast({
        title: "Welcome to Patient Dashboard",
        description: "Manage your health card, loans, and hospital visits.",
        duration: 5000,
      });
      localStorage.setItem("patientDashboardWelcomeShown", "true");
    }
  }, [toast, authState.user]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    navigate(value === "overview" ? "/patient-dashboard" : `/patient-dashboard?tab=${value}`);
  };

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  if (authState.loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <SidebarWrapper>
      <div className="flex h-screen bg-gray-50">
        <PatientSidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        <div className="flex-1 overflow-auto">
          <PatientDashboardHeader 
            patientName={patientData.patientName}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onLogout={handleLogout}
          />
          
          <main className="p-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <TabsList className="bg-white border overflow-x-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="health-card">Health Card</TabsTrigger>
                <TabsTrigger value="loans">Loans & EMIs</TabsTrigger>
                <TabsTrigger value="hospital-visits">Hospital Visits</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <PatientDashboardOverview />
              </TabsContent>
              
              <TabsContent value="health-card" className="mt-6">
                <HealthCardManagement />
              </TabsContent>
              
              <TabsContent value="loans" className="mt-6">
                <LoanManagement />
              </TabsContent>
              
              <TabsContent value="hospital-visits" className="mt-6">
                <HospitalVisits />
              </TabsContent>
              
              <TabsContent value="profile" className="mt-6">
                <ProfileSettings patientData={patientData} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
        <Toaster />
      </div>
    </SidebarWrapper>
  );
};

export default PatientDashboard;
