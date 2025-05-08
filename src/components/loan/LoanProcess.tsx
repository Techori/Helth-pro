
import React from 'react';

interface LoanProcessProps {
  loaded: boolean;
}

const LoanProcess = ({ loaded }: LoanProcessProps) => {
  const steps = [
    {
      step: "01",
      title: "Fill Out the Application Form",
      description: "Complete the simple application form with your personal and financial details.",
    },
    {
      step: "02",
      title: "Upload Your Documents",
      description: "Submit your ID proof, income proof, and other required documents for verification.",
    },
    {
      step: "03",
      title: "Instant Loan Approval",
      description: "Get your loan approved within minutes after successful verification.",
    },
    {
      step: "04",
      title: "Treatment at Partner Hospitals",
      description: "Receive medical treatment at any of our 500+ partner hospitals across India.",
    },
    {
      step: "05",
      title: "Repay in Easy Monthly EMIs",
      description: "Pay back the loan amount in flexible EMIs as per your chosen tenure.",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
            How to Apply for a Loan
          </h2>
          <p className="text-xl text-gray-600">
            Our simple 5-step process makes getting medical financing easy
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {steps.map((item, index) => (
              <div 
                key={index}
                className={`process-step transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
                    {item.step}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanProcess;
