
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, CreditCard, Briefcase, Building } from 'lucide-react';

const FinancingService = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const services = [
    {
      icon: <CreditCard className="h-8 w-8 text-brand-600" />,
      title: 'Buy Now, Pay Later (BNPL)',
      description: '90 days interest-free payment for medical treatments.',
    },
    {
      icon: <Briefcase className="h-8 w-8 text-brand-600" />,
      title: 'Easy EMI Options',
      description: 'Split medical bills into affordable monthly installments.',
    },
    {
      icon: <Check className="h-8 w-8 text-brand-600" />,
      title: 'Quick Loan Approvals',
      description: 'Instant eligibility check and hassle-free processing.',
    },
    {
      icon: <Building className="h-8 w-8 text-brand-600" />,
      title: 'Hospital Partnerships',
      description: 'Secure payments and financial support for healthcare providers.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-brand-50 to-blue-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="md:w-1/2">
                  <div className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gray-900 mb-6 leading-tight">
                      Healthcare <span className="text-brand-600">Financing</span> Solutions
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      Making quality healthcare accessible and affordable with innovative financial solutions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/apply-loan">
                        <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to="/our-cards">
                        <Button size="lg" variant="outline">
                          Explore Our Cards
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2">
                  <div className={`relative aspect-square md:aspect-[4/3] transition-all duration-700 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-200 rounded-full mix-blend-multiply animate-float opacity-60"></div>
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-medicare-200 rounded-full mix-blend-multiply animate-float opacity-60" style={{ animationDelay: '2s' }}></div>
                        
                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl glassmorphism">
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-medicare-50 opacity-90"></div>
                          <div className="absolute inset-0 flex items-center justify-center p-6">
                            <img 
                              src="/placeholder.svg" 
                              alt="Healthcare Financing" 
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Services Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                Our Financing Solutions
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive financial support for all your healthcare needs
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-xl bg-white shadow-sm border border-gray-100 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex gap-5">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <Link to="/our-cards">
                  <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                    Explore Our Cards
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-6">
                Ready to Make Healthcare Affordable?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Apply for a healthcare finance solution today and experience stress-free medical care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/apply-loan">
                  <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/about-us">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FinancingService;
