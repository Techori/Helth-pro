import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, ArrowRight, Check, CreditCard, FileText, User, Building, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { saveLoanDraft, submitLoanApplication, getCreditScore, LoanData } from '@/services/loanService';

interface LoanApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  uhid: string;
  kycData?: any;
  existingLoan?: LoanData | null;
}

const LoanApplicationDialog = ({ open, onOpenChange, onSuccess, uhid, existingLoan }: LoanApplicationDialogProps) => {
  const { toast } = useToast();
  const { authState } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState('');
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [maxEligibleAmount, setMaxEligibleAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);

  const [formData, setFormData] = useState({
    // Personal Information
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      gender: '',
      phoneNumber: '',
      secondaryPhone: '',
      email: '',
      homeAddress: '',
      city: '',
      state: '',
      zipCode: '',
      nationalId: '',
      maritalStatus: '',
      dependents: '',
      citizenshipStatus: '',
      languagePreference: 'english'
    },
    
    // Employment Information
    employmentInfo: {
      employerName: '',
      employerAddress: '',
      occupation: '',
      employmentStatus: 'full-time',
      startDate: '',
      monthlyGrossIncome: 0,
      additionalIncome: '',
      unemploymentBenefits: false,
      totalHouseholdIncome: 0,
      householdMembersInfo: '',
      incomeFluctuation: ''
    },

    // Medical Information
    medicalInfo: {
      treatmentRequired: '',
      medicalProvider: '',
      treatmentStarted: false,
      estimatedCost: 0,
      insuranceCoverage: 0,
      insuranceProvider: '',
      policyNumber: '',
      healthPlanCovered: false,
      appliedFinancialAssistance: false,
      preExistingConditions: '',
      outstandingMedicalDebt: ''
    },

    // Loan Details
    loanDetails: {
      requestedAmount: 0,
      preferredTerm: 12,
      repaymentMethod: 'monthly',
      hospitalName: '',
      purposeOfLoan: ''
    },

    // Documents
    documents: {
      panCard: '',
      aadhaarCard: '',
      incomeProof: '',
      bankStatement: '',
      medicalDocuments: ''
    },

    // Payment and Agreement
    transactionId: '',
    agreementSigned: false,
    nachMandateSigned: false,
    termsAccepted: false
  });

  const steps = [
    'KYC Check',
    'Personal Details', 
    'Credit Score Check',
    'Employment Details',
    'Medical & Loan Details',
    'Review & Payment',
    'Sign Agreement'
  ];

  // Load existing loan data or KYC data when dialog opens
  useEffect(() => {
    if (open) {
      if (existingLoan) {
        // Resume existing loan
        loadExistingLoanData();
      } else if (authState.user?.kycData) {
        // New loan with KYC data
        loadKycData();
      }
    }
  }, [open, existingLoan, authState.user]);

  const loadExistingLoanData = () => {
    if (!existingLoan) return;

    console.log('Loading existing loan data:', existingLoan);
    
    setFormData({
      personalInfo: {
        fullName: existingLoan.personalInfo?.fullName || '',
        dateOfBirth: existingLoan.personalInfo?.dateOfBirth || '',
        gender: existingLoan.personalInfo?.gender || '',
        phoneNumber: existingLoan.personalInfo?.phoneNumber || '',
        secondaryPhone: existingLoan.personalInfo?.secondaryPhone || '',
        email: existingLoan.personalInfo?.email || '',
        homeAddress: existingLoan.personalInfo?.homeAddress || '',
        city: existingLoan.personalInfo?.city || '',
        state: existingLoan.personalInfo?.state || '',
        zipCode: existingLoan.personalInfo?.zipCode || '',
        nationalId: existingLoan.personalInfo?.nationalId || '',
        maritalStatus: existingLoan.personalInfo?.maritalStatus || '',
        dependents: existingLoan.personalInfo?.dependents || '',
        citizenshipStatus: existingLoan.personalInfo?.citizenshipStatus || '',
        languagePreference: existingLoan.personalInfo?.languagePreference || 'english'
      },
      employmentInfo: {
        employerName: existingLoan.employmentInfo?.employerName || '',
        employerAddress: existingLoan.employmentInfo?.employerAddress || '',
        occupation: existingLoan.employmentInfo?.occupation || '',
        employmentStatus: existingLoan.employmentInfo?.employmentStatus || 'full-time',
        startDate: existingLoan.employmentInfo?.startDate || '',
        monthlyGrossIncome: existingLoan.employmentInfo?.monthlyGrossIncome || 0,
        additionalIncome: existingLoan.employmentInfo?.additionalIncome || '',
        unemploymentBenefits: existingLoan.employmentInfo?.unemploymentBenefits || false,
        totalHouseholdIncome: existingLoan.employmentInfo?.totalHouseholdIncome || 0,
        householdMembersInfo: existingLoan.employmentInfo?.householdMembersInfo || '',
        incomeFluctuation: existingLoan.employmentInfo?.incomeFluctuation || ''
      },
      medicalInfo: {
        treatmentRequired: existingLoan.medicalInfo?.treatmentRequired || '',
        medicalProvider: existingLoan.medicalInfo?.medicalProvider || '',
        treatmentStarted: existingLoan.medicalInfo?.treatmentStarted || false,
        estimatedCost: existingLoan.medicalInfo?.estimatedCost || 0,
        insuranceCoverage: existingLoan.medicalInfo?.insuranceCoverage || 0,
        insuranceProvider: existingLoan.medicalInfo?.insuranceProvider || '',
        policyNumber: existingLoan.medicalInfo?.policyNumber || '',
        healthPlanCovered: existingLoan.medicalInfo?.healthPlanCovered || false,
        appliedFinancialAssistance: existingLoan.medicalInfo?.appliedFinancialAssistance || false,
        preExistingConditions: existingLoan.medicalInfo?.preExistingConditions || '',
        outstandingMedicalDebt: existingLoan.medicalInfo?.outstandingMedicalDebt || ''
      },
      loanDetails: {
        requestedAmount: existingLoan.loanDetails?.requestedAmount || 0,
        preferredTerm: existingLoan.loanDetails?.preferredTerm || 12,
        repaymentMethod: existingLoan.loanDetails?.repaymentMethod || 'monthly',
        hospitalName: existingLoan.loanDetails?.hospitalName || '',
        purposeOfLoan: existingLoan.loanDetails?.purposeOfLoan || ''
      },
      documents: {
        panCard: existingLoan.documents?.panCard || '',
        aadhaarCard: existingLoan.documents?.aadhaarCard || '',
        incomeProof: existingLoan.documents?.incomeProof || '',
        bankStatement: existingLoan.documents?.bankStatement || '',
        medicalDocuments: existingLoan.documents?.medicalDocuments || ''
      },
      transactionId: existingLoan.transactionId || '',
      agreementSigned: existingLoan.agreementSigned || false,
      nachMandateSigned: existingLoan.nachMandateSigned || false,
      termsAccepted: existingLoan.termsAccepted || false
    });

    if (existingLoan.creditScore) {
      setCreditScore(existingLoan.creditScore);
      setMaxEligibleAmount(existingLoan.maxEligibleAmount || 0);
      setInterestRate(existingLoan.loanDetails?.interestRate || 0);
    }

    setCurrentStep(existingLoan.currentStep || 1);
    setApplicationNumber(existingLoan.applicationNumber);
  };

  const loadKycData = () => {
    const { kycData } = authState.user || {};
    if (!kycData) return;

    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        fullName: `${authState.user?.firstName || ''} ${authState.user?.lastName || ''}`.trim(),
        dateOfBirth: kycData.dateOfBirth || '',
        gender: kycData.gender || '',
        phoneNumber: authState.user?.phone || '',
        email: authState.user?.email || '',
        homeAddress: kycData.address || '',
        city: kycData.city || '',
        state: kycData.state || '',
        zipCode: kycData.zipCode || '',
        maritalStatus: kycData.maritalStatus || '',
        dependents: kycData.dependents || '',
        nationalId: kycData.panNumber || ''
      }
    }));
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const saveDraft = async (step: number) => {
    try {
      console.log('Saving draft at step:', step);
      await saveLoanDraft(step, formData);
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast({
        title: "Draft Save Failed",
        description: "Your progress may not be saved",
        variant: "destructive"
      });
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      // KYC already done, proceed to personal details
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Save personal details and get credit score
      await saveDraft(2);
      
      if (formData.personalInfo.nationalId && !creditScore) {
        try {
          const response = await getCreditScore(formData.personalInfo.nationalId);
          setCreditScore(response.creditScore);
          setMaxEligibleAmount(response.maxEligibleAmount);
          setInterestRate(response.interestRate);
        } catch (error) {
          console.error('Failed to get credit score:', error);
        }
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Credit score checked, proceed to employment
      await saveDraft(3);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Employment details saved, proceed to medical/loan details
      await saveDraft(4);
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Medical/loan details saved, proceed to review
      await saveDraft(5);
      setCurrentStep(6);
    } else if (currentStep === 6) {
      // Payment simulation
      const mockTransactionId = `TXN${Date.now()}`;
      setFormData(prev => ({
        ...prev,
        transactionId: mockTransactionId
      }));
      
      toast({
        title: "Payment Successful",
        description: `Transaction ID: ${mockTransactionId}`,
      });
      
      setCurrentStep(7);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await submitLoanApplication(formData);
      setApplicationNumber(response.applicationNumber);
      
      toast({
        title: "Application Submitted Successfully",
        description: `Application Number: ${response.applicationNumber}`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Save draft before closing if not submitted
    if (currentStep > 1 && !formData.transactionId) {
      saveDraft(currentStep);
    }
    onOpenChange(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                KYC Verification Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-600">Your KYC is already completed with UHID: {authState.user?.uhid}</p>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>Name: {authState.user?.firstName} {authState.user?.lastName}</p>
                <p>Email: {authState.user?.email}</p>
                <p>Phone: {authState.user?.phone}</p>
                <p>KYC Status: {authState.user?.kycStatus}</p>
              </div>
              {existingLoan && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">Resuming Application: {existingLoan.applicationNumber}</p>
                  <p className="text-sm text-blue-600">Continue from Step {existingLoan.currentStep || 1}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={formData.personalInfo.fullName}
                    onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>PAN Number</Label>
                  <Input
                    value={formData.personalInfo.nationalId}
                    onChange={(e) => handleInputChange('personalInfo', 'nationalId', e.target.value)}
                    placeholder="ABCDE1234F"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={formData.personalInfo.phoneNumber}
                    onChange={(e) => handleInputChange('personalInfo', 'phoneNumber', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Address</Label>
                <Textarea
                  value={formData.personalInfo.homeAddress}
                  onChange={(e) => handleInputChange('personalInfo', 'homeAddress', e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Credit Score Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              {creditScore ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{creditScore}</div>
                    <p className="text-sm text-gray-600">Your Credit Score</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-xl font-semibold text-blue-600">₹{maxEligibleAmount.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">Max Eligible Amount</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-xl font-semibold text-green-600">{interestRate}%</div>
                      <p className="text-sm text-gray-600">Interest Rate</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p>Checking your credit score...</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Employment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Employer Name</Label>
                  <Input
                    value={formData.employmentInfo.employerName}
                    onChange={(e) => handleInputChange('employmentInfo', 'employerName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Occupation</Label>
                  <Input
                    value={formData.employmentInfo.occupation}
                    onChange={(e) => handleInputChange('employmentInfo', 'occupation', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Monthly Income</Label>
                  <Input
                    type="number"
                    value={formData.employmentInfo.monthlyGrossIncome}
                    onChange={(e) => handleInputChange('employmentInfo', 'monthlyGrossIncome', Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label>Employment Status</Label>
                  <Select
                    value={formData.employmentInfo.employmentStatus}
                    onValueChange={(value) => handleInputChange('employmentInfo', 'employmentStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Medical & Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Hospital Name</Label>
                <Select
                  value={formData.loanDetails.hospitalName}
                  onValueChange={(value) => handleInputChange('loanDetails', 'hospitalName', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="City General Hospital">City General Hospital</SelectItem>
                    <SelectItem value="Wellness Multispecialty Hospital">Wellness Multispecialty Hospital</SelectItem>
                    <SelectItem value="LifeCare Medical Center">LifeCare Medical Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Treatment Required</Label>
                <Input
                  value={formData.medicalInfo.treatmentRequired}
                  onChange={(e) => handleInputChange('medicalInfo', 'treatmentRequired', e.target.value)}
                  placeholder="e.g., Heart Surgery, Dental Treatment"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Loan Amount (₹)</Label>
                  <Input
                    type="number"
                    value={formData.loanDetails.requestedAmount}
                    onChange={(e) => handleInputChange('loanDetails', 'requestedAmount', Number(e.target.value))}
                    max={maxEligibleAmount}
                    required
                  />
                  <p className="text-xs text-gray-500">Max: ₹{maxEligibleAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Loan Term (Months)</Label>
                  <Select
                    value={formData.loanDetails.preferredTerm.toString()}
                    onValueChange={(value) => handleInputChange('loanDetails', 'preferredTerm', Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 Months</SelectItem>
                      <SelectItem value="18">18 Months</SelectItem>
                      <SelectItem value="24">24 Months</SelectItem>
                      <SelectItem value="36">36 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Estimated Treatment Cost (₹)</Label>
                <Input
                  type="number"
                  value={formData.medicalInfo.estimatedCost}
                  onChange={(e) => handleInputChange('medicalInfo', 'estimatedCost', Number(e.target.value))}
                  required
                />
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        const monthlyEMI = formData.loanDetails.requestedAmount && formData.loanDetails.preferredTerm 
          ? Math.round((formData.loanDetails.requestedAmount * (1 + interestRate/100 * formData.loanDetails.preferredTerm/12)) / formData.loanDetails.preferredTerm)
          : 0;

        return (
          <Card>
            <CardHeader>
              <CardTitle>Review & Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Loan Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>Loan Amount:</span>
                  <span>₹{formData.loanDetails.requestedAmount.toLocaleString()}</span>
                  <span>Interest Rate:</span>
                  <span>{interestRate}% per annum</span>
                  <span>Loan Term:</span>
                  <span>{formData.loanDetails.preferredTerm} months</span>
                  <span>Monthly EMI:</span>
                  <span>₹{monthlyEMI.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Processing Fee Payment</h4>
                <p className="text-sm text-gray-600 mb-2">Pay ₹1,000 as processing fee to proceed</p>
                <Button 
                  onClick={() => {
                    // Simulate payment
                    handleNext();
                  }}
                  className="w-full"
                >
                  Pay ₹1,000 Processing Fee
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Sign Agreement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.agreementSigned}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreementSigned: e.target.checked }))}
                  />
                  <span className="text-sm">I agree to the Loan Agreement terms</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.nachMandateSigned}
                    onChange={(e) => setFormData(prev => ({ ...prev, nachMandateSigned: e.target.checked }))}
                  />
                  <span className="text-sm">I agree to NACH mandate for EMI deduction</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                  />
                  <span className="text-sm">I accept Healthcare Wallet terms & conditions</span>
                </label>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={!formData.agreementSigned || !formData.nachMandateSigned || !formData.termsAccepted || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingLoan ? `Resume Loan Application - ${existingLoan.applicationNumber}` : 'Medical Loan Application'}
          </DialogTitle>
        </DialogHeader>

        {/* Step Progress */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                index + 1 === currentStep 
                  ? 'bg-blue-600 text-white' 
                  : index + 1 < currentStep 
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200'
              }`}>
                {index + 1 < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className="text-xs mt-1 text-center">{step}</span>
            </div>
          ))}
        </div>

        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrev}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          )}
          
          {currentStep < 7 && (
            <Button onClick={handleNext} className="ml-auto">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoanApplicationDialog;
