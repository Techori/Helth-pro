
import React from 'react';

const LoanCta = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-2/3">
                <h2 className="text-2xl md:text-3xl font-bold font-display text-gray-900 mb-4">
                  Need Assistance with Your Application?
                </h2>
                <p className="text-gray-600 mb-6">
                  Our customer support team is available to help you through the application process and answer any questions you may have.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="tel:+918989898989" 
                    className="btn-primary inline-flex items-center justify-center"
                  >
                    Call Us Now
                  </a>
                  <a 
                    href="mailto:rimgwl@rishishwarindustry.in" 
                    className="btn-outline inline-flex items-center justify-center"
                  >
                    Email Support
                  </a>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-brand-100 to-medicare-100 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                    <div className="text-5xl font-bold text-gradient">?</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanCta;
