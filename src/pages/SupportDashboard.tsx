
import { useState, useEffect } from 'react';
import SidebarWrapper from '@/components/SidebarWrapper';
import SupportSidebar from '@/components/support/SupportSidebar';
import SupportDashboardHeader from '@/components/support/SupportDashboardHeader';
import SupportOverview from '@/components/support/SupportOverview';
import PatientSupport from '@/components/support/PatientSupport';
import HospitalSupport from '@/components/support/HospitalSupport';
import OnboardingSupport from '@/components/support/OnboardingSupport';
import KycSupport from '@/components/support/KycSupport';
import TechnicalSupport from '@/components/support/TechnicalSupport';
import RecoveryDashboard from '@/components/recovery/RecoveryDashboard';
import SupportReports from '@/components/support/SupportReports';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

const SupportDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // Extract tab from URL query parameters
  const query = new URLSearchParams(location.search);
  const activeTabFromQuery = query.get('tab');
  const [activeTab, setActiveTab] = useState(activeTabFromQuery || 'overview');
  
  useEffect(() => {
    // Update URL when active tab changes, but use replace instead of navigate to avoid adding to history
    if (activeTab === 'overview') {
      navigate('/support-dashboard', { replace: true });
    } else {
      navigate(`/support-dashboard?tab=${activeTab}`, { replace: true });
    }
  }, [activeTab, navigate]);
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Show welcome toast on first load
      if (!localStorage.getItem("supportDashboardWelcomeShown")) {
        toast({
          title: "Welcome to Support Dashboard",
          description: "Manage customer support tickets and view analytics.",
          duration: 5000,
        });
        localStorage.setItem("supportDashboardWelcomeShown", "true");
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [toast]);
  
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dashboard Refreshed",
        description: "Latest data has been loaded.",
      });
    }, 1000);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <SupportOverview />;
      case 'patient-support':
        return <PatientSupport />;
      case 'hospital-support':
        return <HospitalSupport />;
      case 'onboarding-support':
        return <OnboardingSupport />;
      case 'kyc-support':
        return <KycSupport />;
      case 'technical-support':
        return <TechnicalSupport />;
      case 'reports':
        return <SupportReports />;
      case 'recovery':
        return <RecoveryDashboard />;
      default:
        return <SupportOverview />;
    }
  };

  return (
    <SidebarWrapper>
      <div className="flex h-screen flex-col lg:flex-row bg-gray-100">
        <SupportSidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <SupportDashboardHeader
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            <div className="flex justify-between mb-6 flex-wrap gap-2">
              <h1 className="text-2xl font-bold">Support Dashboard</h1>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
            {renderActiveTab()}
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarWrapper>
  );
};

export default SupportDashboard;
