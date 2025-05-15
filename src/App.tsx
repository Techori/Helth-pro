import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode, Suspense } from "react";
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
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Routes>
              {/* Public Routes */}

              <Route path="/" element={<Index />} />

              <Route path="/login" element={<Login />} />

              <Route path="/signup" element={<Signup />} />

              <Route path="/about-us" element={<AboutUs />} />

              <Route path="/our-cards" element={<OurCards />} />

              <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
              />

              <Route path="/privacy-policy" element={<PrivacyPolicy />} />

              <Route
                path="/hospital-registration"
                element={<HospitalRegistration />}
              />

              <Route path="/apply-loan" element={<ApplyLoan />} />

              <Route path="/sitemap" element={<Sitemap />} />

              {/* Service Routes */}

              <Route
                path="/services/ambulance"
                element={<AmbulanceService />}
              />

              <Route
                path="/services/financing"
                element={<FinancingService />}
              />

              <Route
                path="/services/pathology"
                element={<PathologyService />}
              />

              <Route path="/services/pharma" element={<PharmaService />} />

              <Route path="/services/pharmacy" element={<PharmacyService />} />

              <Route path="/services/stores" element={<StoresService />} />

              {/* Protected Dashboard Routes */}

              <Route
                path="/patient-dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={["patient"]}>
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/hospital-dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={["hospital"]}>
                    <HospitalDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin-dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sales-dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={["sales"]}>
                    <SalesTeamDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/crm-dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={["crm"]}>
                    <CrmDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/agent-dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={["agent"]}>
                    <AgentDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/support-dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={["support"]}>
                    <SupportDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Not Found Route */}

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
