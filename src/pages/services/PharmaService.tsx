
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Pill } from 'lucide-react';

const PharmaService = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const features = [
    "Affordable Pricing – High-quality medicines at competitive prices",
    "Trusted Formulations – Manufactured with top-grade ingredients",
    "Wide Range of Medicines – Covering general health, chronic diseases, and critical care",
    "Retail & Online Availability – Available through RI Medicare Pharmacy, Retail Stores, and Online Platforms",
    "Commitment to Innovation – Continuous research to bring the best healthcare solutions"
  ];

  const products = [
    {
      category: "General Health",
      items: ["Multivitamins", "Immune Boosters", "Pain Relief", "Fever Medication"]
    },
    {
      category: "Chronic Diseases",
      items: ["Diabetes Management", "Blood Pressure Control", "Cardiac Care", "Respiratory Health"]
    },
    {
      category: "Critical Care",
      items: ["Antibiotics", "Emergency Medications", "Surgical Aids", "Intensive Care Formulations"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section with 2D Images */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-brand-50 to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-brand-300 animate-float"></div>
              <div className="absolute bottom-10 right-20 w-16 h-16 rounded-full bg-purple-300 animate-float" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-medicare-200 animate-float" style={{animationDelay: '2s'}}></div>
            </div>
            
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2 z-10">
                  <div className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="inline-block bg-brand-100 text-brand-600 px-4 py-2 rounded-full font-medium text-sm mb-4">
                      Coming Soon
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gray-900 mb-6 leading-tight">
                      RI Medicare <span className="text-brand-600">Pharma</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      A revolutionary initiative under RI Medicare, dedicated to providing affordable, high-quality medicines for everyone. With a mission to make healthcare accessible to all.
                    </p>
                    <div className="flex flex-wrap gap-3 mb-8">
                      {["Quality", "Affordable", "Accessible", "Innovative"].map((tag, index) => (
                        <span key={index} className="bg-white px-4 py-2 rounded-full text-sm font-medium text-brand-600 shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
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
                
                <div className="lg:w-1/2 h-80 md:h-96 z-10">
                  <div className={`w-full h-full transition-all duration-700 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
                      <img 
                        src="/lovable-uploads/pharma-medicines.jpg" 
                        alt="RI Medicare Pharma Medicines"
                        className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Key Highlights Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                Key Highlights of RI Medicare Pharma
              </h2>
              <p className="text-xl text-gray-600">
                Our commitment to quality healthcare medicines
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-xl bg-white shadow-sm border border-gray-100 flex items-start gap-4 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                      <Check className="h-6 w-6 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-800">{feature}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Product Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                Our Product Range
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Comprehensive healthcare solutions for diverse medical needs
              </p>
              
              <div className="inline-block bg-brand-100 text-brand-600 px-4 py-2 rounded-full text-sm font-medium mb-2">
                Coming Soon
              </div>
              <p className="text-brand-700">
                RI Medicare Pharma products will soon be available across India!
              </p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.map((category, index) => (
                  <div 
                    key={index}
                    className={`glassmorphism p-8 rounded-2xl transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full bg-brand-100 flex items-center justify-center mb-6">
                        <Pill className="h-8 w-8 text-brand-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.category}</h3>
                      <ul className="space-y-3">
                        {category.items.map((item, idx) => (
                          <li key={idx} className="flex items-center justify-center gap-2">
                            <Check className="h-4 w-4 text-brand-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission and Vision */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-1/2">
                  <div className={`transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h2 className="text-3xl font-bold font-display text-gray-900 mb-6">
                      Our Mission
                    </h2>
                    <div className="prose prose-lg">
                      <p>
                        RI Medicare Pharma is committed to revolutionizing healthcare accessibility through high-quality, affordable medicines. We believe that everyone deserves access to effective treatment without financial barriers.
                      </p>
                      <p>
                        By combining cutting-edge pharmaceutical science with compassionate healthcare principles, we aim to improve health outcomes for millions across India.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className={`transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
                    <h2 className="text-3xl font-bold font-display text-gray-900 mb-6">
                      Our Vision
                    </h2>
                    <div className="prose prose-lg">
                      <p>
                        To be India's most trusted pharmaceutical brand, known for quality, innovation, and social responsibility. We envision a future where no one has to compromise on healthcare due to cost constraints.
                      </p>
                      <p>
                        Through continuous research and development, we strive to address emerging health challenges and contribute to a healthier, more equitable society.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-brand-500 to-purple-600 text-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
                Join Us in Transforming Healthcare
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Be among the first to access RI Medicare Pharma products when we launch. Register your interest now!
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
                We'll notify you as soon as RI Medicare Pharma products become available in your area.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PharmaService;
