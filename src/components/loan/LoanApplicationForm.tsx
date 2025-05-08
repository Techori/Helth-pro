import { useState } from 'react';
import { ArrowRight, Shield, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import PersonalDetailsForm from './PersonalDetailsForm';
import EmploymentLoanDetailsForm from './EmploymentLoanDetailsForm';
import DocumentUploadForm from './DocumentUploadForm';
import CreditBureauCheck from './CreditBureauCheck';
import KycVerification from './KycVerification';
import AccountAggregatorAnalysis from './AccountAggregatorAnalysis';
import LoanOffers from './LoanOffers';
import SignDocuments from './SignDocuments';

// Define Offer interface to match LoanOffers component
interface Offer {
  id: number;
  provider?: string;
  amount: string;
  interestRate: string;
  tenure: string;
  emi: string;
  processingFee?: number;
  description?: string;
}

const LoanApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null); // Changed from string to number
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    employmentType: 'salaried',
    companyName: '',
    monthlyIncome: '',
    hospitalName: '',
    loanAmount: '',
    repaymentTenure: '12',
    documents: {
      aadhaar: null,
      pan: null,
      bankStatement: null,
    },
    creditScore: null,
    kycStatus: null,
    accountAggregatorScore: null,
    availableOffers: [] as Offer[], // Added explicit type annotation
    signedDocuments: false,
    walletActivated: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [name]: files[0]
        }
      }));

      toast({
        title: "Document uploaded",
        description: `Successfully uploaded ${files[0].name}`,
      });
    }
  };

  const generateReferenceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(10000 + Math.random() * 90000);
    return `RI${year}${month}${day}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRefNumber = generateReferenceNumber();
    setReferenceNumber(generatedRefNumber);
    setIsSubmitted(true);
    
    toast({
      title: "Application Submitted",
      description: `We've received your loan application. Reference Number: ${generatedRefNumber}`,
    });
    
    // Here you would normally send the data to a server
    console.log("Form submitted:", formData);
    console.log("Reference Number:", generatedRefNumber);
  };

  const nextStep = () => {
    // Simulating API calls for credit check, KYC, etc.
    if (currentStep === 1) {
      // After personal details, proceed to credit check
      setIsProcessing(true);
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          creditScore: 750
        }));
        setCurrentStep(prev => Math.min(prev + 1, 8));
        setIsProcessing(false);
        window.scrollTo(0, 0);
      }, 2000);
    } else if (currentStep === 2) {
      // After credit check, proceed to KYC
      setIsProcessing(true);
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          kycStatus: 'verified'
        }));
        setCurrentStep(prev => Math.min(prev + 1, 8));
        setIsProcessing(false);
        window.scrollTo(0, 0);
      }, 2000);
    } else if (currentStep === 3) {
      // After KYC, proceed to employment details
      setCurrentStep(prev => Math.min(prev + 1, 8));
      window.scrollTo(0, 0);
    } else if (currentStep === 4) {
      // After employment details, proceed to account aggregator
      setIsProcessing(true);
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          accountAggregatorScore: 85
        }));
        setCurrentStep(prev => Math.min(prev + 1, 8));
        setIsProcessing(false);
        window.scrollTo(0, 0);
      }, 2000);
    } else if (currentStep === 5) {
      // After account aggregator, proceed to document upload
      setCurrentStep(prev => Math.min(prev + 1, 8));
      window.scrollTo(0, 0);
    } else if (currentStep === 6) {
      // After document upload, show offers
      setIsProcessing(true);
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          availableOffers: [
            {
              id: 1, // Changed from string to number
              provider: 'QuickFinance',
              amount: '50000', // Changed from number to string
              interestRate: '10.5', // Changed from number to string
              tenure: '12', // Changed from number to string
              emi: '4400', // Changed from number to string
              processingFee: 1000,
              description: 'Quick approval medical loan with low interest rate'
            },
            {
              id: 2, // Changed from string to number
              provider: 'MediLoan Plus',
              amount: '50000', // Changed from number to string
              interestRate: '9.8', // Changed from number to string
              tenure: '18', // Changed from number to string
              emi: '3100', // Changed from number to string
              processingFee: 1500,
              description: 'Longer tenure option with competitive interest rates'
            },
            {
              id: 3, // Changed from string to number
              provider: 'HealthCare Finance',
              amount: '50000', // Changed from number to string
              interestRate: '11.2', // Changed from number to string
              tenure: '12', // Changed from number to string
              emi: '4450', // Changed from number to string
              processingFee: 800,
              description: 'Low processing fee option for healthcare expenses'
            }
          ]
        }));
        setCurrentStep(prev => Math.min(prev + 1, 8));
        setIsProcessing(false);
        window.scrollTo(0, 0);
      }, 2000);
    } else if (currentStep === 7 && selectedOfferId) {
      // After selecting an offer, proceed to sign documents
      setCurrentStep(prev => Math.min(prev + 1, 8));
      window.scrollTo(0, 0);
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 8));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  // Update the offer selection handler to accept an Offer object rather than just the ID
  const handleOfferSelection = (offer: Offer) => {
    setSelectedOfferId(offer.id);
    toast({
      title: "Offer Selected",
      description: `You've selected an offer. Please review and proceed to sign documents.`,
    });
  };

  const handleSignDocuments = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        signedDocuments: true,
        walletActivated: true
      }));
      setIsProcessing(false);
      handleSubmit(new Event('submit') as any);
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
        );
      case 2:
        return (
          <CreditBureauCheck
            creditScore={formData.creditScore}
            isProcessing={isProcessing}
          />
        );
      case 3:
        return (
          <KycVerification 
            kycStatus={formData.kycStatus}
            isProcessing={isProcessing}
          />
        );
      case 4:
        return (
          <EmploymentLoanDetailsForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
        );
      case 5:
        return (
          <AccountAggregatorAnalysis
            score={formData.accountAggregatorScore}
            isProcessing={isProcessing}
          />
        );
      case 6:
        return (
          <DocumentUploadForm 
            formData={formData} 
            handleFileChange={handleFileChange} 
          />
        );
      case 7:
        return (
          <LoanOffers
            offers={formData.availableOffers}
            selectedOfferId={selectedOfferId}
            onSelectOffer={handleOfferSelection}
          />
        );
      case 8:
        return (
          <SignDocuments
            isProcessing={isProcessing}
            onSign={handleSignDocuments}
          />
        );
      default:
        return null;
    }
  };

  const handleStartNewApplication = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      dob: '',
      address: '',
      employmentType: 'salaried',
      companyName: '',
      monthlyIncome: '',
      hospitalName: '',
      loanAmount: '',
      repaymentTenure: '12',
      documents: {
        aadhaar: null,
        pan: null,
        bankStatement: null,
      },
      creditScore: null,
      kycStatus: null,
      accountAggregatorScore: null,
      availableOffers: [] as Offer[], // Added explicit type annotation
      signedDocuments: false,
      walletActivated: false
    });
    setCurrentStep(1);
    setIsSubmitted(false);
    setReferenceNumber('');
    setSelectedOfferId(null);
  };

  const renderStepButton = () => {
    if (currentStep === 7) {
      return (
        <Button 
          type="button" 
          onClick={nextStep}
          disabled={!selectedOfferId}
          className="bg-brand-600 hover:bg-brand-700"
        >
          Proceed to Sign Documents
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      );
    } else if (currentStep === 8) {
      return (
        <Button 
          type="button" 
          onClick={handleSignDocuments}
          className="bg-brand-600 hover:bg-brand-700"
        >
          Sign and Complete Application
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      );
    } else {
      return (
        <Button 
          type="button" 
          onClick={nextStep}
          className="bg-brand-600 hover:bg-brand-700"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Next'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {!isSubmitted ? (
            <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 animate-fade-in`}>
              <div className="mb-6">
                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            i + 1 === currentStep 
                              ? 'bg-brand-600 text-white' 
                              : i + 1 < currentStep 
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {i + 1}
                        </div>
                        {i < 7 && (
                          <div 
                            className={`h-0.5 w-10 ${
                              i + 1 < currentStep ? 'bg-green-400' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm text-gray-600">
                    {currentStep === 1 && 'Personal Details'}
                    {currentStep === 2 && 'Credit Bureau Check'}
                    {currentStep === 3 && 'KYC Verification'}
                    {currentStep === 4 && 'Employment & Loan Details'}
                    {currentStep === 5 && 'Financial Analysis'}
                    {currentStep === 6 && 'Document Upload'}
                    {currentStep === 7 && 'Available Offers'}
                    {currentStep === 8 && 'Sign Documents'}
                  </p>
                </div>
              </div>
              
              <form onSubmit={(e) => e.preventDefault()}>
                {renderStepContent()}
                
                <div className="mt-8 flex justify-between">
                  {currentStep > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={prevStep}
                      disabled={isProcessing}
                    >
                      Previous
                    </Button>
                  )}
                  
                  <div className="ml-auto">
                    {renderStepButton()}
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 animate-fade-in text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
              <p className="text-gray-600 mb-6">Thank you for your application. Our team will review it shortly.</p>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your Application Reference Number:</h3>
                <p className="text-2xl font-bold text-brand-600 font-mono">{referenceNumber}</p>
                <p className="text-sm text-gray-500 mt-2">Please save this reference number for future communication.</p>
              </div>

              {formData.walletActivated && (
                <div className="bg-blue-50 p-6 rounded-lg mb-8">
                  <div className="flex items-center justify-center mb-3">
                    <CreditCard className="h-8 w-8 text-blue-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Your Healthcare Wallet is Active!</h3>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Your healthcare wallet has been activated. You can now use it for medical expenses at partner hospitals.
                  </p>
                  <div className="flex justify-center mt-4">
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/patient-dashboard'}
                      className="bg-blue-600 text-white hover:bg-blue-700 border-0"
                    >
                      Access Your Wallet
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleStartNewApplication}
                  className="w-full sm:w-auto"
                >
                  Start New Application
                </Button>
                <Button 
                  type="button"
                  className="bg-brand-600 hover:bg-brand-700 w-full sm:w-auto"
                  onClick={() => window.location.href = '/'}
                >
                  Return to Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LoanApplicationForm;
