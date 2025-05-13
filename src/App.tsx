import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import ApplyLoan from "./pages/ApplyLoan";
import OurCards from "./pages/OurCards";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import HospitalRegistration from "./pages/HospitalRegistration";
import HospitalDashboard from "./pages/HospitalDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SalesTeamDashboard from "./pages/SalesTeamDashboard";
import CrmDashboard from "./pages/CrmDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import SupportDashboard from "./pages/SupportDashboard";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsAndConditions from "./pages/legal/TermsAndConditions";
import Sitemap from "./pages/Sitemap";
import Signup from "./pages/Signup";
// Service Pages
import FinancingService from "./pages/services/FinancingService";
import PharmaService from "./pages/services/PharmaService";
import AmbulanceService from "./pages/services/AmbulanceService";
import StoresService from "./pages/services/StoresService";
import PathologyService from "./pages/services/PathologyService";
import PharmacyService from "./pages/services/PharmacyService";

const queryClient = new QueryClient();

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/apply-loan" element={<ApplyLoan />} />
            <Route path="/our-cards" element={<OurCards />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Dashboard Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospital-dashboard"
              element={
                <ProtectedRoute requiredRole="hospital">
                  <HospitalDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute requiredRole="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales-dashboard"
              element={
                <ProtectedRoute requiredRole="sales">
                  <SalesTeamDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm-dashboard"
              element={
                <ProtectedRoute requiredRole="crm">
                  <CrmDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent-dashboard"
              element={
                <ProtectedRoute requiredRole="agent">
                  <AgentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support-dashboard"
              element={
                <ProtectedRoute requiredRole="support">
                  <SupportDashboard />
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/hospital-registration" element={<HospitalRegistration />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            
            {/* Service Pages */}
            <Route path="/services/financing" element={<FinancingService />} />
            <Route path="/services/pharma" element={<PharmaService />} />
            <Route path="/services/ambulance" element={<AmbulanceService />} />
            <Route path="/services/stores" element={<StoresService />} />
            <Route path="/services/pathology" element={<PathologyService />} />
            <Route path="/services/pharmacy" element={<PharmacyService />} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
