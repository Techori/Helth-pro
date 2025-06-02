

import { apiRequest } from './api';

export interface EmiPayment {
  paymentDate: string;
  amount: number;
  principalAmount: number;
  interestAmount: number;
  transactionId: string;
  paymentMethod: string;
  status: string;
}

export interface EmiScheduleItem {
  emiNumber: number;
  dueDate: string;
  emiAmount: number;
  principalAmount: number;
  interestAmount: number;
  balanceAfterPayment: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  transactionId?: string;
}

export interface LoanData {
  _id: string;
  applicationNumber: string;
  status: string;
  currentStep?: number;
  loanDetails: {
    requestedAmount: number;
    approvedAmount?: number;
    preferredTerm: number;
    interestRate?: number;
    repaymentMethod?: string;
    hospitalName?: string;
    purposeOfLoan?: string;
  };
  medicalInfo: {
    treatmentRequired: string;
    medicalProvider?: string;
    estimatedCost?: number;
    treatmentStarted?: boolean;
    insuranceCoverage?: number;
    insuranceProvider?: string;
    policyNumber?: string;
    healthPlanCovered?: boolean;
    appliedFinancialAssistance?: boolean;
    preExistingConditions?: string;
    outstandingMedicalDebt?: string;
  };
  personalInfo?: {
    fullName?: string;
    dateOfBirth?: string;
    gender?: string;
    phoneNumber?: string;
    secondaryPhone?: string;
    email?: string;
    homeAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    nationalId?: string;
    maritalStatus?: string;
    dependents?: string;
    citizenshipStatus?: string;
    languagePreference?: string;
  };
  employmentInfo?: {
    employerName?: string;
    employerAddress?: string;
    occupation?: string;
    employmentStatus?: string;
    startDate?: string;
    monthlyGrossIncome?: number;
    additionalIncome?: string;
    unemploymentBenefits?: boolean;
    totalHouseholdIncome?: number;
    householdMembersInfo?: string;
    incomeFluctuation?: string;
  };
  documents?: {
    panCard?: string;
    aadhaarCard?: string;
    incomeProof?: string;
    bankStatement?: string;
    medicalDocuments?: string;
  };
  creditScore?: number;
  maxEligibleAmount?: number;
  applicationDate: string;
  submissionDate?: string;
  approvalDate?: string;
  rejectionReason?: string;
  monthlyPayment?: number;
  remainingBalance?: number;
  uhid: string;
  transactionId?: string;
  agreementSigned?: boolean;
  nachMandateSigned?: boolean;
  termsAccepted?: boolean;
  nextEmiDate?: string;
  emiPayments?: EmiPayment[];
  completionDate?: string;
}

export const fetchPatientLoans = async (uhid: string): Promise<LoanData[]> => {
  try {
    console.log('Fetching loans for UHID:', uhid);
    const response = await apiRequest(`/loans/by-uhid/${uhid}`);
    return response || [];
  } catch (error) {
    console.error('Failed to fetch patient loans:', error);
    throw error;
  }
};

export const fetchCurrentDraftLoan = async (): Promise<LoanData | null> => {
  try {
    console.log('Fetching current draft loan');
    const response = await apiRequest('/loans/draft/current');
    return response.loan || null;
  } catch (error) {
    console.error('Failed to fetch draft loan:', error);
    return null;
  }
};

export const saveLoanDraft = async (step: number, data: any): Promise<LoanData> => {
  try {
    console.log('Saving loan draft at step:', step, data);
    const response = await apiRequest('/loans/draft', {
      method: 'POST',
      body: JSON.stringify({ step, data })
    });
    return response;
  } catch (error) {
    console.error('Failed to save loan draft:', error);
    throw error;
  }
};

export const submitLoanApplication = async (formData: any): Promise<{ applicationNumber: string; loan: LoanData }> => {
  try {
    console.log('Submitting loan application:', formData);
    const response = await apiRequest('/loans/submit', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    return response;
  } catch (error) {
    console.error('Failed to submit loan application:', error);
    throw error;
  }
};

export const fetchAllLoans = async (): Promise<LoanData[]> => {
  try {
    console.log('Fetching all loans for admin');
    const response = await apiRequest('/loans');
    return response || [];
  } catch (error) {
    console.error('Failed to fetch all loans:', error);
    throw error;
  }
};

export const updateLoanStatus = async (
  loanId: string, 
  status: string, 
  data?: {
    rejectionReason?: string;
    approvedAmount?: number;
    interestRate?: number;
    term?: number;
  }
) => {
  try {
    console.log('Updating loan status:', { loanId, status, data });
    const response = await apiRequest(`/loans/${loanId}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        ...data
      })
    });
    return response;
  } catch (error) {
    console.error('Failed to update loan status:', error);
    throw error;
  }
};

export const getCreditScore = async (panNumber: string) => {
  try {
    console.log('Getting credit score for PAN:', panNumber);
    const response = await apiRequest(`/loans/credit-score/${panNumber}`);
    return response;
  } catch (error) {
    console.error('Failed to get credit score:', error);
    throw error;
  }
};

export const payEmi = async (loanId: string, amount: number, paymentMethod: string = 'online') => {
  try {
    console.log('Processing EMI payment:', { loanId, amount, paymentMethod });
    const response = await apiRequest(`/loans/${loanId}/pay-emi`, {
      method: 'POST',
      body: JSON.stringify({ amount, paymentMethod })
    });
    return response;
  } catch (error) {
    console.error('Failed to process EMI payment:', error);
    throw error;
  }
};

export const getEmiSchedule = async (loanId: string) => {
  try {
    console.log('Fetching EMI schedule for loan:', loanId);
    const response = await apiRequest(`/loans/${loanId}/emi-schedule`);
    return response;
  } catch (error) {
    console.error('Failed to fetch EMI schedule:', error);
    throw error;
  }
};

