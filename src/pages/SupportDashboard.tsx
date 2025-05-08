
import { useState } from 'react';
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

const SupportDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
      case 'recovery':
        return <RecoveryDashboard />;
      default:
        return <SupportOverview />;
    }
  };

  return (
    <SidebarWrapper>
      <div className="flex h-screen bg-gray-100">
        <SupportSidebar isOpen={isOpen} setIsOpen={setIsOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <SupportDashboardHeader isOpen={isOpen} setIsOpen={setIsOpen} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            {renderActiveTab()}
          </main>
        </div>
      </div>
    </SidebarWrapper>
  );
};

export default SupportDashboard;
