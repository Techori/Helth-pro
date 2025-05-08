
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FlippableFeatureCards from '@/components/FlippableFeatureCards';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Calendar, 
  Heart, 
  ArrowUpRight, 
  Send,
  Check,
  MapPin,
  Building,
  ChevronRight,
  Shield,
  HospitalIcon
} from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [loaded, setLoaded] = useState(false);
  const [email, setEmail] = useState('');
  
  // EMI Calculator state
  const [paymentAmount, setPaymentAmount] = useState(100000);
  const [paymentTenure, setPaymentTenure] = useState(12);
  
  // Calculate EMI
  const calculateEmi = () => {
    // Simple EMI calculation: P * r * (1+r)^n / ((1+r)^n - 1)
    const principal = paymentAmount;
    const ratePerMonth = 0.01; // 12% per annum converted to monthly rate
    const tenure = paymentTenure;
    
    const emi = principal * ratePerMonth * Math.pow(1 + ratePerMonth, tenure) / (Math.pow(1 + ratePerMonth, tenure) - 1);
    return Math.round(emi);
  };
  
  const emi = calculateEmi();

  const testimonials = [
    {
      name: "Amit Kumar",
      location: "Gwalior",
      text: "Thanks to RI Medicare, I got my surgery without financial stress. The approval was instant and the EMIs are very affordable.",
      rating: 5
    },
    {
      name: "Neha Singh", 
      location: "Delhi",
      text: "Seamless process, instant approval, highly recommended! The zero-interest period helped me manage my medical expenses better.",
      rating: 5
    }
  ];

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    // Send the form data to the provided email
    const formData = {
      type: "subscription",
      email: email
    };
    
    // Log the form data (in a real app this would send to a server)
    console.log("Sending form data to rimgwl@rishishwarindustry.in:", formData);
    
    toast({
      title: "Subscription successful!",
      description: "Thank you for subscribing to our newsletter.",
    });
    
    setEmail('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <div className="inline-block bg-brand-50 px-4 py-1.5 rounded-full text-brand-600 font-medium text-sm mb-4">
                Our Services
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-6">
                Comprehensive Healthcare Solutions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                RI Medicare provides a range of services to make healthcare accessible and affordable for everyone
              </p>
            </div>

            <FlippableFeatureCards />
          </div>
        </section>

        {/* NEW CTA Section with Animations */}
        <section className="py-16 bg-gradient-to-r from-brand-50 to-medicare-50 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div 
                className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 transition-all duration-700 ${
                  loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-3/5">
                    <div className="inline-block bg-brand-50 px-3 py-1 rounded-full text-brand-600 font-medium text-sm mb-4 animate-pulse">
                      Healthcare Made Simple
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
                      🏥 Get Medical Treatment Today, Pay Later!
                    </h2>
                    <p className="text-xl text-gray-600 mb-6">
                      RI Medicare offers flexible healthcare EMIs with interest-free periods and easy payment options, ensuring that quality healthcare is accessible to everyone!
                    </p>
                    <div className="space-y-3 mb-6">
                      {[
                        '90 Days Interest-Free Payments',
                        'Convert Medical Bills into EMIs',
                        'Quick Digital Approval Process',
                        'Accepted at 500+ Hospitals'
                      ].map((item, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center gap-2 transition-all duration-500 ${
                            loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                          }`}
                          style={{ transitionDelay: `${index * 100 + 300}ms` }}
                        >
                          <CheckCircle2 className="h-5 w-5 text-brand-500 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link 
                        to="/apply-loan" 
                        className={`btn-primary bg-brand-600 hover:bg-brand-700 group relative overflow-hidden transition-all duration-500 ${
                          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                        style={{ transitionDelay: '700ms' }}
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </Link>
                      <Link 
                        to="/our-cards" 
                        className={`btn-outline border-brand-600 text-brand-600 hover:bg-brand-600 group relative transition-all duration-500 ${
                          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                        style={{ transitionDelay: '800ms' }}
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          Get Started
                          <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </span>
                      </Link>
                    </div>
                  </div>
                  <div 
                    className={`md:w-2/5 transition-all duration-1000 ${
                      loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                    }`}
                    style={{ transitionDelay: '500ms' }}
                  >
                    <div className="relative">
                      <div className="w-full h-64 md:h-80 bg-gradient-to-br from-brand-100 to-medicare-100 rounded-xl flex items-center justify-center overflow-hidden">
                        <div className="relative z-10 w-48 h-48 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center transform -rotate-12 hover:rotate-0 transition-transform duration-500">
                          <CreditCard className="h-12 w-12 text-brand-600 mb-4" />
                          <div className="text-lg font-semibold text-gray-800 mb-1">RI Medicare</div>
                          <div className="text-sm text-gray-500">Healthcare Card</div>
                          <div className="absolute bottom-4 right-4 w-10 h-10 bg-medicare-500 rounded-full flex items-center justify-center">
                            <Heart className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="absolute top-0 left-0 w-20 h-20 bg-brand-200 rounded-full -translate-x-10 -translate-y-10 blur-xl"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-medicare-200 rounded-full translate-x-10 translate-y-10 blur-xl"></div>
                      </div>
                      
                      <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-md transform rotate-6 hover:rotate-0 transition-transform duration-300">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-brand-500" />
                          <span className="text-sm font-medium">90 Days Interest-Free</span>
                        </div>
                      </div>
                      
                      <div className="absolute -top-4 -left-4 bg-white p-3 rounded-lg shadow-md transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-medicare-500" />
                          <span className="text-xs font-medium">Easy EMIs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-block bg-brand-50 px-4 py-1.5 rounded-full text-brand-600 font-medium text-sm mb-4">
                Simple Process
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
                How RI Medicare Works
              </h2>
              <p className="text-xl text-gray-600">
                A simple, 4-step process to get your healthcare EMI
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  {
                    step: '01',
                    title: 'Apply for EMI',
                    description: 'Fill out our simple application form for medical EMI at RI Medicare.',
                    delay: 100,
                  },
                  {
                    step: '02',
                    title: 'Instant Approval',
                    description: 'Get instant approval with flexible EMI options that suit your budget.',
                    delay: 200,
                  },
                  {
                    step: '03',
                    title: 'Get Treatment',
                    description: 'Visit any of our partner hospitals and receive the treatment you need.',
                    delay: 300,
                  },
                  {
                    step: '04',
                    title: 'Easy Repayment',
                    description: 'Repay in easy monthly installments over your chosen tenure period.',
                    delay: 400,
                  },
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className={`process-step p-6 rounded-xl bg-white shadow-sm border border-gray-100 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${item.delay}ms` }}
                  >
                    <div className="flex items-start gap-5">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <Link to="/apply-loan">
                  <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                    Start Your Application
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-block bg-brand-50 px-4 py-1.5 rounded-full text-brand-600 font-medium text-sm mb-4">
                Why Choose Us
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
                Why Choose RI Medicare
              </h2>
              <p className="text-xl text-gray-600">
                We're committed to making healthcare accessible for everyone
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Clock className="w-8 h-8 text-brand-600" />,
                  title: 'Fast & Easy Approval',
                  description: 'No lengthy paperwork, get approved quickly and start your treatment.',
                },
                {
                  icon: <Building className="w-8 h-8 text-brand-600" />,
                  title: 'Wide Hospital Network',
                  description: 'Access treatment at over 500+ partner hospitals across the country.',
                },
                {
                  icon: <Shield className="w-8 h-8 text-brand-600" />,
                  title: '100% Secure Transactions',
                  description: 'Your financial and personal information is always protected.',
                },
                {
                  icon: <CreditCard className="w-8 h-8 text-brand-600" />,
                  title: 'Zero Cost EMI Options',
                  description: 'Flexible payment plans with interest-free options for patients.',
                },
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100 + 100}ms` }}
                >
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EMI Calculator Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div 
                  className={`transition-all duration-500 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                >
                  <div className="text-sm font-medium text-brand-600 mb-2">Know Your Repayment Plan</div>
                  <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
                    EMI Calculator
                  </h2>
                  <p className="text-xl text-gray-600 mb-6">
                    Enter your treatment amount & get estimated EMI instantly!
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-gray-700 font-medium">Treatment Amount (₹)</label>
                        <span className="text-brand-600 font-semibold">₹{paymentAmount.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="10000"
                        max="1000000"
                        step="10000"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                      />
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>₹10,000</span>
                        <span>₹10,00,000</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-gray-700 font-medium">Payment Tenure (Months)</label>
                        <span className="text-brand-600 font-semibold">{paymentTenure} Months</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="60"
                        step="3"
                        value={paymentTenure}
                        onChange={(e) => setPaymentTenure(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                      />
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>3 Months</span>
                        <span>60 Months</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`glassmorphism rounded-2xl p-8 transition-all duration-500 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                >
                  <div className="text-center">
                    <div className="text-gray-600 mb-2">Your Estimated Monthly EMI</div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-brand-500 to-medicare-500 bg-clip-text text-transparent mb-4">₹{emi.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 mb-6">Based on 12% interest rate p.a.</div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Total Interest</div>
                        <div className="text-xl font-semibold text-gray-900">
                          ₹{(emi * paymentTenure - paymentAmount).toLocaleString()}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Total Amount</div>
                        <div className="text-xl font-semibold text-gray-900">
                          ₹{(emi * paymentTenure).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <Link to="/apply-loan">
                      <Button size="lg" className="w-full bg-brand-600 hover:bg-brand-700">
                        Apply for EMI Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-block bg-brand-50 px-4 py-1.5 rounded-full text-brand-600 font-medium text-sm mb-4">
                Our Leadership
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-4">
                Meet Our Leadership
              </h2>
              <p className="text-xl text-gray-600">
                Experts committed to making healthcare accessible and affordable
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                    <div className="text-3xl font-bold text-brand-700">KR</div>
                  </div>
                  
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Mr. King Raj Rishishwar</h3>
                    <p className="text-brand-600 font-medium mb-4">Managing Director</p>
                    <p className="text-gray-600 mb-6">
                      Leading Rishishwar Industry Private Limited with a vision to transform healthcare accessibility 
                      and make quality medical care available to all.
                    </p>
                    <div className="flex justify-center md:justify-start gap-3">
                      <Button variant="outline" size="sm" className="rounded-full border-brand-200 text-brand-700 hover:bg-brand-50">
                        LinkedIn
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full border-brand-200 text-brand-700 hover:bg-brand-50">
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block bg-brand-50 px-4 py-1.5 rounded-full text-brand-600 font-medium text-sm mb-4">
                Stay Connected
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-gray-900 mb-4">
                Stay Updated with RI Medicare
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Subscribe to our newsletter for healthcare EMI updates, hospital partnerships, and exclusive offers.
              </p>
              
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                  <Button 
                    type="submit" 
                    className="bg-brand-600 hover:bg-brand-700 px-6"
                  >
                    Subscribe
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  By subscribing, you agree to our Privacy Policy and Terms of Service.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-medicare-600 opacity-90"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white mb-6">
                Start Your Medical Treatment Without Worries
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Don't let financial constraints stop you from getting the healthcare you deserve. Apply today and experience stress-free medical payment solutions with RI Medicare.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/apply-loan">
                  <Button size="lg" variant="default" className="w-full sm:w-auto bg-white hover:bg-gray-100 text-brand-600">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/our-cards">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-white hover:bg-white/10 border-white">
                    Explore Cards
                    <ChevronRight className="ml-2 h-4 w-4" />
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

export default Index;
