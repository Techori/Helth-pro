
import React from 'react';
import { CreditCard, Clock, Calendar } from 'lucide-react';

interface LoanFeaturesProps {
  loaded: boolean;
}

const LoanFeatures = ({ loaded }: LoanFeaturesProps) => {
  const features = [
    {
      icon: <CreditCard className="h-8 w-8 text-brand-600" />,
      title: "Fastest Loan Approval",
      description: "Get instant approval with minimal documentation and paperwork.",
    },
    {
      icon: <Clock className="h-8 w-8 text-brand-600" />,
      title: "Zero Interest for 90 Days",
      description: "Pay only for the treatment with no extra costs for the first 3 months.",
    },
    {
      icon: <Calendar className="h-8 w-8 text-brand-600" />,
      title: "Flexible EMI Repayment",
      description: "Choose a repayment plan that suits your financial situation.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
            Why Choose RI Medicare
          </h2>
          <p className="text-xl text-gray-600">
            Our medical loans are designed with your healthcare needs in mind
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`glassmorphism p-6 rounded-xl transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanFeatures;
