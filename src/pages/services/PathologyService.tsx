import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Microscope, TestTube, FileText, Clock, Beaker, Thermometer, Pill } from 'lucide-react';

// PathologyService component
const PathologyService = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const features = [
    {
      icon: <Microscope className="h-8 w-8 text-brand-600" />,
      title: 'Comprehensive Testing',
      description: 'Complete spectrum of pathology tests from routine diagnostics to specialized molecular testing.',
    },
    {
      icon: <Check className="h-8 w-8 text-brand-600" />,
      title: 'Quality Assurance',
      description: 'NABL accredited laboratories with stringent quality control protocols for accurate results.',
    },
    {
      icon: <TestTube className="h-8 w-8 text-brand-600" />,
      title: 'Advanced Diagnostics',
      description: 'State-of-the-art equipment and techniques for precise and reliable test results.',
    },
    {
      icon: <FileText className="h-8 w-8 text-brand-600" />,
      title: 'Digital Reports',
      description: 'Electronic delivery of reports with detailed analysis and interpretation.',
    },
    {
      icon: <Clock className="h-8 w-8 text-brand-600" />,
      title: 'Quick Turnaround',
      description: 'Fast processing of samples and prompt reporting through digital channels.',
    },
    {
      icon: <Check className="h-8 w-8 text-brand-600" />,
      title: 'Home Collection',
      description: 'Convenient sample collection services at your doorstep by trained phlebotomists.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section with Icons Instead of Image */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-brand-50 to-blue-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="md:w-1/2">
                  <div className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="inline-block bg-brand-100 text-brand-600 px-4 py-2 rounded-full font-medium text-sm mb-4">
                      Coming Soon
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gray-900 mb-6 leading-tight">
                      RI Medicare <span className="text-brand-600">Pathology</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      Advanced diagnostic testing with precision and care for accurate health insights.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                        Get Notified at Launch
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button size="lg" variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 h-80 md:h-96">
                  <div className={`w-full h-full transition-all duration-700 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <div className="w-full h-full rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-50 to-brand-50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center mb-6 bg-white p-6 rounded-full shadow-lg">
                          <Microscope className="w-20 h-20 text-brand-600" />
                        </div>
                        <div className="flex justify-center gap-8 mt-6">
                          <div className="p-4 bg-white rounded-full shadow-md">
                            <Beaker className="w-10 h-10 text-brand-500" />
                          </div>
                          <div className="p-4 bg-white rounded-full shadow-md">
                            <TestTube className="w-10 h-10 text-brand-500" />
                          </div>
                          <div className="p-4 bg-white rounded-full shadow-md">
                            <Thermometer className="w-10 h-10 text-brand-500" />
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
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                Pathology Services
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive diagnostic solutions with accuracy and reliability
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex gap-5">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* New Section: Test Packages */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                Popular Test Packages
              </h2>
              <p className="text-xl text-gray-600">
                Curated diagnostic packages for comprehensive health assessment
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Basic Health Checkup",
                    price: "₹999",
                    icon: <Thermometer className="h-12 w-12 text-brand-600" />,
                    tests: ["Complete Blood Count", "Lipid Profile", "Liver Function Test", "Kidney Function Test", "Blood Glucose"]
                  },
                  {
                    name: "Comprehensive Health Package",
                    price: "₹2499",
                    icon: <Beaker className="h-12 w-12 text-brand-600" />,
                    tests: ["Complete Blood Count", "Lipid Profile", "Liver Function Test", "Kidney Function Test", "Thyroid Profile", "Vitamin Levels", "Cardiac Risk Markers"]
                  },
                  {
                    name: "Women's Health Package",
                    price: "₹1999",
                    icon: <Pill className="h-12 w-12 text-brand-600" />,
                    tests: ["Complete Blood Count", "Lipid Profile", "Thyroid Profile", "Vitamin D & B12", "Calcium", "Pap Smear"]
                  }
                ].map((pkg, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-xl bg-white shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 100 + 300}ms` }}
                  >
                    <div className="flex flex-col items-center mb-4">
                      <div className="bg-brand-100 p-4 rounded-full mb-4">
                        {pkg.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{pkg.name}</h3>
                      <div className="text-2xl font-bold text-brand-600 mb-4 text-center">{pkg.price}</div>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {pkg.tests.map((test, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-brand-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{test}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-brand-600 hover:bg-brand-700">
                      Book Now
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-brand-500 to-blue-600 text-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
                Be the First to Know When We Launch
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Register now to get notified when our pathology services become available in your area.
              </p>
              <form className="max-w-lg mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="email" 
                    placeholder="Enter your email address"
                    className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white"
                  />
                  <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100">
                    Get Notified
                  </Button>
                </div>
              </form>
              <p className="text-sm text-white/80">
                Your health insights matter. We're working hard to bring these advanced diagnostic services to you soon.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PathologyService;
