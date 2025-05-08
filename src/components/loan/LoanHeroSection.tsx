
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoanHeroSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-brand-50 to-brand-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white px-3 py-1 rounded-full text-brand-700 font-medium text-sm mb-4 shadow-sm">
            Easy EMI Options | 90 Days Interest-Free | Minimal Documentation
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display text-gray-900 mb-4">
            Healthcare <span className="text-brand-600">EMI Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Get medical treatment today, pay later with flexible EMI options through our service platform
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link to="/apply-loan">
              <Button size="lg" className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-base flex items-center gap-2 group">
                Apply For EMI
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/hospital-registration">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base flex items-center gap-2 group border-brand-600 text-brand-600 hover:bg-brand-50">
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanHeroSection;
