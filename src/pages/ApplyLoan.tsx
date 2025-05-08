
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoanApplicationForm from '@/components/loan/LoanApplicationForm';
import LoanHeroSection from '@/components/loan/LoanHeroSection';
import LoanStepProgress from '@/components/loan/LoanStepProgress';
import LoanFeatures from '@/components/loan/LoanFeatures';
import LoanProcess from '@/components/loan/LoanProcess';
import LoanCta from '@/components/loan/LoanCta';
import LoanOffers from '@/components/loan/LoanOffers';
import SignDocuments from '@/components/loan/SignDocuments';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

// Define the offer interface to ensure consistent typing
interface LoanOffer {
  id: number;
  amount: string;
  interestRate: string;
  tenure: string;
  emi: string;
}

const ApplyLoan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loaded, setLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [processingApplication, setProcessingApplication] = useState(false);
  
  // Application details state with proper typing
  const [applicationData, setApplicationData] = useState({
    personalDetails: null,
    creditScore: null,
    kycStatus: null,
    accountScore: null,
    selectedOffer: null as LoanOffer | null,
    documentsSigned: false
  });

  // Define steps for the loan application process
  const steps = [
    'Personal Details',
    'Credit Check',
    'KYC Verification',
    'Account Analysis',
    'Loan Offers',
    'Sign & Complete',
    'Wallet Activation'
  ];

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Handle next step navigation
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle previous step navigation
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle personal details submission
  const handlePersonalDetailsSubmit = (data) => {
    setApplicationData({
      ...applicationData,
      personalDetails: data
    });
    
    toast({
      title: "Personal details saved",
      description: "Proceeding to credit check...",
    });
    
    handleNextStep();
  };

  // Handle credit check completion
  const handleCreditCheckComplete = (data) => {
    setApplicationData({
      ...applicationData,
      creditScore: data
    });
    
    toast({
      title: "Credit check completed",
      description: `Credit score: ${data.score}`,
    });
    
    handleNextStep();
  };

  // Handle KYC verification completion
  const handleKycComplete = (data) => {
    setApplicationData({
      ...applicationData,
      kycStatus: data
    });
    
    toast({
      title: "KYC verification completed",
      description: `Status: ${data.status}`,
    });
    
    handleNextStep();
  };

  // Handle account aggregator analysis completion
  const handleAccountAnalysisComplete = (data) => {
    setApplicationData({
      ...applicationData,
      accountScore: data
    });
    
    toast({
      title: "Account analysis completed",
      description: `Eligibility score: ${data.score}`,
    });
    
    handleNextStep();
  };

  // Handle offer selection with proper typing to match updated LoanOffers component
  const handleOfferSelection = (offer: LoanOffer) => {
    setApplicationData({
      ...applicationData,
      selectedOffer: offer
    });
    
    toast({
      title: "Loan offer selected",
      description: `₹${offer.amount} at ${offer.interestRate}% interest rate`,
    });
    
    handleNextStep();
  };

  // Handle document signing
  const handleSignDocuments = () => {
    setProcessingApplication(true);
    
    // Simulate processing time
    setTimeout(() => {
      setApplicationData({
        ...applicationData,
        documentsSigned: true
      });
      
      setProcessingApplication(false);
      handleNextStep();
      
      toast({
        title: "Documents signed successfully",
        description: "Your healthcare wallet is being activated...",
      });
      
      // Simulate wallet activation
      setTimeout(() => {
        toast({
          title: "Healthcare Wallet Activated!",
          description: "Your loan has been approved and wallet is ready for use.",
          variant: "default"
        });
      }, 2000);
    }, 3000);
  };

  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <LoanApplicationForm />;
      case 1:
        return (
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Credit Bureau Check</h3>
            <p className="mb-4">We're checking your credit score with the credit bureaus...</p>
            <div className="flex justify-center my-8">
              <Button 
                onClick={() => handleCreditCheckComplete({ score: 745, status: 'good' })}
                className="w-full max-w-md"
              >
                Simulate Credit Check Completion
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">KYC Verification</h3>
            <p className="mb-4">We're verifying your identity through KYC process...</p>
            <div className="flex justify-center my-8">
              <Button 
                onClick={() => handleKycComplete({ status: 'verified', method: 'aadhaar' })}
                className="w-full max-w-md"
              >
                Simulate KYC Verification
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Account Aggregator Analysis</h3>
            <p className="mb-4">We're analyzing your financial accounts to determine loan eligibility...</p>
            <div className="flex justify-center my-8">
              <Button 
                onClick={() => handleAccountAnalysisComplete({ score: 82, eligible: true })}
                className="w-full max-w-md"
              >
                Simulate Account Analysis
              </Button>
            </div>
          </div>
        );
      case 4:
        // Define offers with consistent string types
        const loanOffers: LoanOffer[] = [
          { id: 1, amount: "50000", interestRate: "12", tenure: "12", emi: "4650" },
          { id: 2, amount: "100000", interestRate: "11.5", tenure: "24", emi: "4680" },
          { id: 3, amount: "200000", interestRate: "10.9", tenure: "36", emi: "6520" }
        ];
        
        return (
          <LoanOffers 
            onSelectOffer={handleOfferSelection}
            offers={loanOffers}
          />
        );
      case 5:
        return (
          <SignDocuments 
            isProcessing={processingApplication}
            onSign={handleSignDocuments}
          />
        );
      case 6:
        return (
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Application Complete!</h3>
            <p className="mb-6">Your healthcare wallet has been activated successfully.</p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="font-medium text-blue-800">Wallet Details:</p>
              <p className="text-blue-700">Wallet ID: HW-{Math.floor(Math.random() * 1000000)}</p>
              <p className="text-blue-700">Available Credit: ₹{applicationData.selectedOffer?.amount || "100000"}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/patient-dashboard')}
                className="w-full sm:w-auto"
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.print()}
                className="w-full sm:w-auto"
              >
                Print Details
              </Button>
            </div>
          </div>
        );
      default:
        return <LoanApplicationForm />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <LoanHeroSection />
        <LoanStepProgress 
          steps={steps}
          currentStep={currentStep}
        />
        
        <section className="py-8">
          <div className="container mx-auto px-4">
            {renderStepContent()}
            
            {currentStep > 0 && currentStep < 6 && (
              <div className="flex justify-between mt-8 max-w-2xl mx-auto">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={processingApplication}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                
                {currentStep < 4 && (
                  <Button
                    variant="outline"
                    onClick={handleNextStep}
                    disabled={processingApplication}
                  >
                    Skip <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
        
        {currentStep < 4 && <LoanFeatures loaded={loaded} />}
        {currentStep < 4 && <LoanProcess loaded={loaded} />}
        {currentStep < 4 && <LoanCta />}
      </main>

      <Footer />
      <Toaster />
    </div>
  );
};

export default ApplyLoan;
