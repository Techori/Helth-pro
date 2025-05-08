
import React from 'react';
import { Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface KycVerificationProps {
  kycStatus: string | null;
  isProcessing: boolean;
}

const KycVerification: React.FC<KycVerificationProps> = ({ kycStatus, isProcessing }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">KYC Verification</h3>
      
      <div className="p-6 border border-gray-100 rounded-lg bg-gray-50">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-12 w-12 text-brand-600 animate-spin mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Verifying Your Identity</h4>
            <p className="text-gray-600 text-center">
              We're validating your identity through secure KYC providers.
              This usually takes just a moment.
            </p>
          </div>
        ) : kycStatus === 'verified' ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Shield className="h-10 w-10 text-green-600" />
            </div>
            
            <h4 className="text-lg font-medium text-gray-900 mb-4">KYC Successfully Verified</h4>
            
            <div className="w-full max-w-md space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-gray-600">Identity Verification</span>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                  <span className="font-medium">Verified</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-gray-600">Address Verification</span>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                  <span className="font-medium">Verified</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-gray-600">Document Authenticity</span>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                  <span className="font-medium">Verified</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-gray-600">Fraud Check</span>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                  <span className="font-medium">No Issues Found</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center p-4 bg-green-50 rounded-lg w-full max-w-md">
              <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-green-800">
                Your KYC verification is complete and successful
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">KYC Verification Failed</h4>
            <p className="text-gray-600 text-center mb-4">
              We couldn't verify your identity. Please ensure all your details are correct.
            </p>
            <button className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700">
              Try Again
            </button>
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-500">
        <p>
          KYC verification is conducted through secure and authorized government databases in compliance with regulatory requirements.
          All your personal information is encrypted and protected.
        </p>
      </div>
    </div>
  );
};

export default KycVerification;
