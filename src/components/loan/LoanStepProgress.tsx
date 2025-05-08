
import React from 'react';

interface LoanStepProgressProps {
  steps?: string[];
  currentStep?: number;
}

const LoanStepProgress: React.FC<LoanStepProgressProps> = ({ 
  steps = ['Application', 'Verification', 'Approval', 'Disbursement'],
  currentStep = 0 
}) => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Our Simple Loan Process
          </h2>
          
          <div className="flex overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex min-w-full">
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                      ${index < currentStep 
                        ? 'bg-green-100 text-green-600' 
                        : index === currentStep 
                          ? 'bg-brand-600 text-white' 
                          : 'bg-brand-100 text-brand-600'
                      }`}
                    >
                      {index < currentStep ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <p className={`mt-2 text-sm ${index === currentStep ? 'font-medium text-brand-600' : 'text-gray-600'} text-center w-24`}>
                      {step}
                    </p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="flex-grow mx-2 self-center flex items-center">
                      <div className={`h-0.5 w-full ${index < currentStep ? 'bg-brand-600' : 'bg-brand-100'}`}></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanStepProgress;
