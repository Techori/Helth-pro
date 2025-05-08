
import React from 'react';
import { Loader2, BarChart, TrendingUp, PieChart, CircleCheck, AlertCircle } from 'lucide-react';

interface AccountAggregatorAnalysisProps {
  score: number | null;
  isProcessing: boolean;
}

const AccountAggregatorAnalysis: React.FC<AccountAggregatorAnalysisProps> = ({ score, isProcessing }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Financial Analysis</h3>
      
      <div className="p-6 border border-gray-100 rounded-lg bg-gray-50">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-12 w-12 text-brand-600 animate-spin mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Analyzing Your Financial Data</h4>
            <p className="text-gray-600 text-center">
              We're securely analyzing your bank statements through account aggregator framework.
              This helps us offer you the most suitable loan options.
            </p>
          </div>
        ) : score ? (
          <div className="flex flex-col items-center justify-center">
            <div className="relative mb-6">
              <div className="w-36 h-36 rounded-full flex items-center justify-center bg-blue-100">
                <BarChart className="h-16 w-16 text-blue-600" />
              </div>
            </div>
            
            <h4 className="text-lg font-medium text-gray-900 mb-6">Account Aggregator Analysis</h4>
            
            <div className="w-full max-w-md grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg shadow-sm flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-gray-600 text-sm">Financial Score</span>
                <span className="font-bold text-xl">{score}/100</span>
              </div>
              
              <div className="p-4 bg-white rounded-lg shadow-sm flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <PieChart className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-gray-600 text-sm">Repayment Capacity</span>
                <span className="font-bold text-xl">Good</span>
              </div>
            </div>
            
            <div className="w-full max-w-md space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-gray-600">Average Monthly Balance</span>
                <div className="flex items-center">
                  <CircleCheck className="h-5 w-5 text-green-500 mr-1" />
                  <span className="font-medium">₹32,500</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-gray-600">Regular Salary Credits</span>
                <div className="flex items-center">
                  <CircleCheck className="h-5 w-5 text-green-500 mr-1" />
                  <span className="font-medium">Verified</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-gray-600">Existing EMI Obligations</span>
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-1" />
                  <span className="font-medium">₹12,000/month</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-gray-600">Spending Pattern</span>
                <div className="flex items-center">
                  <CircleCheck className="h-5 w-5 text-green-500 mr-1" />
                  <span className="font-medium">Healthy</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center p-4 bg-blue-50 rounded-lg w-full max-w-md">
              <CircleCheck className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-blue-800">
                Your financial profile looks good for loan eligibility
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Financial Analysis Not Available</h4>
            <p className="text-gray-600 text-center">
              We couldn't analyze your financial data through the account aggregator.
              You can still proceed with your application.
            </p>
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-500">
        <p>
          Account Aggregator analysis is conducted through regulated financial data sharing framework.
          We only access the data you consent to share, and it's used solely for loan eligibility assessment.
        </p>
      </div>
    </div>
  );
};

export default AccountAggregatorAnalysis;
