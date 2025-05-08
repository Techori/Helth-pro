
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from 'lucide-react';
import ThreeJsCard from '@/components/three/ThreeJsCard';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-brand-100 mix-blend-multiply opacity-70 blur-3xl"></div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-medicare-100 mix-blend-multiply opacity-70 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className={`w-full lg:w-1/2 space-y-8 text-center lg:text-left transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <img 
                  src="/fca8c184-cea2-4af8-9ecb-338bf4292c6d.png" 
                  alt="RI Medicare Logo" 
                  className="h-24 md:h-28 w-auto"
                />
              </div>
              
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-gray-900 leading-tight">
                <span className="text-brand-600">Healthcare</span> Made <span className="text-medicare-500">Accessible</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
                Get medical treatment today, pay later! With flexible EMI plans and instant approvals, we make healthcare accessible for everyone.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center lg:justify-start">
                <Link to="/apply-loan">
                  <Button size="lg" className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-base flex items-center gap-2 group">
                    Apply Now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/hospital-registration">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base flex items-center gap-2 group border-medicare-500 text-medicare-500 hover:bg-medicare-500 hover:text-white">
                    Get Started
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-8">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-bold text-gray-900">500+</span>
                  <span className="text-sm text-gray-500">Partner Hospitals</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-bold text-gray-900">20K+</span>
                  <span className="text-sm text-gray-500">Happy Patients</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-3xl font-bold text-gray-900">90</span>
                  <span className="text-sm text-gray-500">Days Interest-Free</span>
                </div>
              </div>
            </div>
            <div className={`w-full lg:w-1/2 relative transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative aspect-square md:aspect-[4/3] max-w-lg mx-auto">
                {/* 3D Card */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <ThreeJsCard className="w-full h-full min-h-[300px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
