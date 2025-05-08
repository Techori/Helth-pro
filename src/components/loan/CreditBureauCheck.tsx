
import React from 'react';
import { CircleCheck, CircleAlert, Loader2 } from 'lucide-react';

interface CreditBureauCheckProps {
  creditScore: number | null;
  isProcessing: boolean;
}

const CreditBureauCheck: React.FC<CreditBureauCheckProps> = ({ creditScore, isProcessing }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Credit Bureau Check</h3>
      
      <div className="p-6 border border-gray-100 rounded-lg bg-gray-50">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-12 w-12 text-brand-600 animate-spin mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Checking Your Credit Score</h4>
            <p className="text-gray-600 text-center">
              We're retrieving your credit information from the bureau.
              This usually takes just a moment.
            </p>
          </div>
        ) : creditScore ? (
          <div className="flex flex-col items-center justify-center">
            <div className="relative mb-6">
              <div className="w-40 h-40 rounded-full flex items-center justify-center bg-white border-8 border-green-100">
                <span className="text-4xl font-bold text-green-600">{creditScore}</span>
              </div>
              <div className="absolute -bottom-2 right-0 bg-green-500 text-white rounded-full px-3 py-1 text-sm font-medium">
                Good
              </div>
            </div>
            
            <h4 className="text-lg font-medium text-gray-900 mb-2">Credit Bureau Report</h4>
            
            <div className="w-full max-w-md">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-600">Credit Score</span>
                  <div className="flex items-center">
                    <CircleCheck className="h-5 w-5 text-green-500 mr-1" />
                    <span className="font-medium">{creditScore} / 900</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-600">Payment History</span>
                  <div className="flex items-center">
                    <CircleCheck className="h-5 w-5 text-green-500 mr-1" />
                    <span className="font-medium">Good</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-600">Outstanding Loans</span>
                  <div className="flex items-center">
                    <CircleCheck className="h-5 w-5 text-green-500 mr-1" />
                    <span className="font-medium">1</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-600">Repayment Capacity</span>
                  <div className="flex items-center">
                    <CircleCheck className="h-5 w-5 text-green-500 mr-1" />
                    <span className="font-medium">Excellent</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center p-4 bg-green-50 rounded-lg w-full max-w-md">
              <CircleCheck className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-green-800">
                Your credit score meets our eligibility criteria
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <CircleAlert className="h-12 w-12 text-amber-500 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Credit Data</h4>
            <p className="text-gray-600 text-center">
              We couldn't retrieve your credit information.
              Please proceed to the next step to continue your application.
            </p>
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-500">
        <p>
          Your credit report is securely fetched from authorized credit bureaus in compliance with regulatory guidelines.
          This check does not affect your credit score.
        </p>
      </div>
    </div>
  );
};

export default CreditBureauCheck;
