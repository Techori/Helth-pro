
import React from 'react';
import { FileText, FileCheck, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SignDocumentsProps {
  isProcessing: boolean;
  onSign: () => void;
}

const SignDocuments: React.FC<SignDocumentsProps> = ({ isProcessing, onSign }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Sign Loan Documents</h3>
      
      <div className="bg-amber-50 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-amber-600 mt-1 mr-2 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            Please review all documents carefully before signing. By signing, you agree to the terms and conditions
            of the loan agreement and authorize us to disburse the funds as per the agreement.
          </p>
        </div>
      </div>
      
      {isProcessing ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-12 w-12 text-brand-600 animate-spin mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Processing Your Application</h4>
          <p className="text-gray-600 text-center">
            We're finalizing your loan and setting up your healthcare wallet.
            This will just take a moment.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium">Loan Agreement</p>
                  <p className="text-sm text-gray-500">Complete terms and conditions of your loan</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
            
            <div className="p-4 border rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium">NACH Mandate Form</p>
                  <p className="text-sm text-gray-500">Auto-debit authorization for EMI payments</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
            
            <div className="p-4 border rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium">Healthcare Wallet Terms</p>
                  <p className="text-sm text-gray-500">Terms of use for your healthcare wallet</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </div>
          
          <div className="pt-4">
            <div className="flex items-start mb-6">
              <input
                id="terms"
                type="checkbox"
                className="mt-1"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I have read and agree to the terms and conditions, loan agreement, and privacy policy.
                I authorize the collection and use of my information as described.
              </label>
            </div>
            
            <Button 
              onClick={onSign}
              className="w-full bg-brand-600 hover:bg-brand-700"
            >
              <FileCheck className="h-5 w-5 mr-2" />
              Sign Documents & Complete Application
            </Button>
          </div>
        </>
      )}
      
      <div className="text-sm text-gray-500">
        <p>
          All documents are legally binding once signed. Your loan will be disbursed to the hospital
          upon successful verification and activation of your healthcare wallet.
        </p>
      </div>
    </div>
  );
};

export default SignDocuments;
