
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Check, Users, Heart, Briefcase, CreditCard, Building, Mail, Phone, MapPin, Pill, Ambulance, Store, TestTube } from 'lucide-react';

const AboutUs = () => {
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("financing");

  useEffect(() => {
    setLoaded(true);
  }, []);

  const leaders = [
    {
      name: 'Mr. Harsh Raj Sharma',
      position: 'Managing Director',
      company: 'Rishishwar Industry Private Limited',
      image: '/lovable-uploads/acb4e400-7134-428e-b9be-f26f88b44651.png', // Updated to use the uploaded image
    },
    {
      name: 'Mr. Dinesh Kumar Sharma',
      position: 'Authorized Director',
      company: 'Rishishwar Industry Private Limited',
      image: '/placeholder.svg', // Using placeholder, replace with actual image
    },
  ];

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

  const process = [
    {
      step: '01',
      title: 'Application',
      description: 'Patients apply for medical financing through RI Medicare.',
    },
    {
      step: '02',
      title: 'Approval',
      description: 'Instant approval & flexible EMI plans are offered.',
    },
    {
      step: '03',
      title: 'Hospital Payment',
      description: 'Hospitals receive timely payments, ensuring uninterrupted treatment.',
    },
    {
      step: '04',
      title: 'Repayment',
      description: 'Patients repay in easy installments, reducing their financial burden.',
    },
  ];

  const advantages = [
    {
      title: 'Healthcare First, Payment Later',
      description: 'Get treatment without upfront financial stress.',
    },
    {
      title: 'Trusted by Hospitals & Patients',
      description: 'A growing network of partner hospitals across India.',
    },
    {
      title: 'Secure & Transparent',
      description: 'No hidden charges, 100% secure transactions.',
    },
    {
      title: 'Supporting Healthcare Growth',
      description: 'Helping hospitals improve cash flow and serve more patients.',
    },
  ];

  const comingSoonServices = [
    {
      id: "pharmacy",
      title: "RI Medicare Pharmacy",
      icon: <Pill className="h-16 w-16 text-brand-600 mb-6" />,
      description: "Online pharmacy with doorstep delivery of medicines, supplements and healthcare products across India.",
      features: [
        "24/7 medicine delivery",
        "Original and authentic medicines",
        "Prescription upload facility",
        "Scheduled medication reminders"
      ],
      image: "/lovable-uploads/pharmacy.jpg"
    },
    {
      id: "ambulance",
      title: "RI Medicare Quick Ambulance Service",
      icon: <Ambulance className="h-16 w-16 text-brand-600 mb-6" />,
      description: "Emergency ambulance services with advanced life support systems and trained medical professionals.",
      features: [
        "Quick response time",
        "Advanced life support",
        "GPS tracking for family members",
        "Trained paramedical staff"
      ],
      image: "/lovable-uploads/ambulance.jpg"
    },
    {
      id: "stores",
      title: "RI Medicare Pharmacy Retail Stores",
      icon: <Store className="h-16 w-16 text-brand-600 mb-6" />,
      description: "Physical retail stores offering medicines, healthcare products and consultation services.",
      features: [
        "Wide range of healthcare products",
        "In-store pharmacist consultation",
        "Health checkup facilities",
        "Loyalty program benefits"
      ],
      image: "/lovable-uploads/pharmacy-store.jpg"
    },
    {
      id: "pathology",
      title: "RI Medicare Pathology",
      icon: <TestTube className="h-16 w-16 text-brand-600 mb-6" />,
      description: "High-quality diagnostic services with home sample collection and online reports.",
      features: [
        "Home sample collection",
        "Quick report delivery",
        "Online report access",
        "Comprehensive health packages"
      ],
      image: "/lovable-uploads/pathology.jpg"
    },
    {
      id: "pharma",
      title: "RI Medicare Pharma",
      icon: <Pill className="h-16 w-16 text-brand-600 mb-6" />,
      description: "A revolutionary initiative dedicated to providing affordable, high-quality medicines for everyone.",
      features: [
        "Quality medications at affordable prices",
        "Wide range of medicines for various conditions",
        "Cutting-edge pharmaceutical research",
        "Trusted formulations for better health outcomes"
      ],
      image: "/lovable-uploads/pharma-medicines.jpg"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="md:w-1/2">
                  <div className="inline-block bg-brand-50 px-3 py-1 rounded-full text-brand-700 font-medium text-sm mb-4">
                    About Us
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold font-display text-gray-900 mb-4">
                    RI Medicare
                  </h1>
                  <p className="text-xl text-gray-600 mb-6">
                    At RI Medicare, we believe that financial constraints should never stop anyone from receiving quality healthcare.
                  </p>
                  <Link to="/apply-loan">
                    <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="md:w-1/2">
                  <div className="relative aspect-square md:aspect-[4/3]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-200 rounded-full mix-blend-multiply animate-float opacity-60"></div>
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-medicare-200 rounded-full mix-blend-multiply animate-float opacity-60" style={{ animationDelay: '2s' }}></div>
                        
                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl glassmorphism">
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-medicare-50 opacity-90"></div>
                          <div className="absolute inset-0 flex items-center justify-center p-6">
                            <div className="text-center">
                              <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
                                <Heart className="h-10 w-10 text-brand-600" />
                              </div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
                              <p className="text-gray-700">
                                To bridge the gap between healthcare and financial accessibility by providing instant medical loans with flexible repayment options.
                              </p>
                            </div>
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

        {/* Who We Are Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2">
                  <div className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="aspect-[4/3] bg-gradient-to-br from-brand-500 to-medicare-500 relative">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="text-center">
                          <div className="glass-card mb-4 p-4 inline-block rounded-full">
                            <Users className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">Who We Are</h3>
                          <p className="text-white/90">
                            A leading healthcare financing solution, empowering patients and hospitals with Buy Now, Pay Later (BNPL) services.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className={`transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
                    <h2 className="text-3xl font-bold font-display text-gray-900 mb-6">
                      Our Company
                    </h2>
                    <p className="text-gray-700 mb-6">
                      RI Medicare is a product of Rishishwar Industry Private Limited and operates under its leadership. We're dedicated to making medical treatments more accessible and affordable for everyone.
                    </p>
                    <div className="space-y-6">
                      {leaders.map((leader, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                            <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{leader.name}</h4>
                            <p className="text-gray-600 text-sm">{leader.position}</p>
                            <p className="text-gray-500 text-sm">{leader.company}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* We Are Offering Section with Tabs */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                What We Are Offering
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our complete healthcare ecosystem for patients and hospitals
              </p>
              
              <Tabs defaultValue="financing" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-8 w-full">
                  <TabsTrigger value="financing" className="text-sm md:text-base">Healthcare Financing</TabsTrigger>
                  <TabsTrigger value="pharmacy" className="text-sm md:text-base">Pharmacy</TabsTrigger>
                  <TabsTrigger value="ambulance" className="text-sm md:text-base">Ambulance</TabsTrigger>
                  <TabsTrigger value="stores" className="text-sm md:text-base">Retail Stores</TabsTrigger>
                  <TabsTrigger value="pathology" className="text-sm md:text-base">Pathology</TabsTrigger>
                  <TabsTrigger value="pharma" className="text-sm md:text-base">Pharma</TabsTrigger>
                </TabsList>
                
                <TabsContent value="financing">
                  <div className="bg-white rounded-2xl shadow-sm p-8 max-w-4xl mx-auto">
                    <div className="flex flex-col items-center mb-6">
                      <CreditCard className="h-16 w-16 text-brand-600 mb-6" />
                      <h3 className="text-2xl font-bold mb-2">Healthcare Financing</h3>
                      <p className="text-gray-600 text-center mb-8">Our comprehensive healthcare financing solutions to make medical care accessible and affordable.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {services.map((service, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                            {service.icon}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">{service.title}</h4>
                            <p className="text-gray-600">{service.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 text-center">
                      <Link to="/our-cards">
                        <Button className="bg-brand-600 hover:bg-brand-700">
                          Learn More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </TabsContent>
                
                {comingSoonServices.map(service => (
                  <TabsContent key={service.id} value={service.id}>
                    <div className="bg-white rounded-2xl shadow-sm p-8 max-w-4xl mx-auto">
                      <div className="flex flex-col items-center mb-6">
                        {service.icon}
                        <div className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full font-medium mb-3">
                          Coming Soon
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                        <p className="text-gray-600 text-center mb-8">{service.description}</p>
                      </div>
                      
                      {/* Replace 3D models with 2D images */}
                      <div className="mb-8 overflow-hidden rounded-xl">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-64 object-cover transition-transform hover:scale-105 duration-300"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start space-x-3">
                            <Check className="h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 text-center">
                        <Button variant="outline" className="border-brand-600 text-brand-600 hover:bg-brand-50">
                          Get Notified When Available
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </section>

        {/* What We Offer Section (Original) */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                What We Offer
              </h2>
              <p className="text-xl text-gray-600">
                Our comprehensive healthcare financing solutions
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

        {/* How It Works Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Our streamlined process for healthcare financing
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {process.map((item, index) => (
                  <div 
                    key={index}
                    className={`process-step p-6 rounded-xl bg-white shadow-sm border border-gray-100 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
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
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                Why Choose RI Medicare
              </h2>
              <p className="text-xl text-gray-600">
                The advantages of our healthcare financing solutions
              </p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {advantages.map((advantage, index) => (
                  <div 
                    key={index}
                    className={`glassmorphism p-6 rounded-xl transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                        <Check className="h-6 w-6 text-brand-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{advantage.title}</h3>
                      <p className="text-gray-600">{advantage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/2">
                  <div className={`transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h2 className="text-3xl font-bold font-display text-gray-900 mb-6">
                      Contact Us
                    </h2>
                    <p className="text-gray-700 mb-8">
                      Whether you're a patient seeking medical treatment or a hospital looking for financial solutions, RI Medicare is here to help.
                    </p>
                    
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-brand-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                          <p className="text-gray-600">
                            Rishishwar Industry Private Limited<br />
                            BM Tower, Infront of Jeen Mata Mandir, Daulatganj,<br />
                            Pathankar Chourah, Lashkar Gird, Gwalior,<br />
                            Madhya Pradesh, Bharat - 474001
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-brand-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                          <a href="mailto:rimgwl@rishishwarindustry.in" className="text-brand-600 hover:underline">
                            rimgwl@rishishwarindustry.in
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-brand-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                          <a href="tel:+918989898989" className="text-brand-600 hover:underline">
                            +91 8989 898 989
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-1/2">
                  <div className={`glassmorphism p-8 rounded-2xl transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                            placeholder="Enter your name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input
                          type="text"
                          id="subject"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                          placeholder="Enter subject"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                          placeholder="Enter your message"
                        ></textarea>
                      </div>
                      <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700">
                        Send Message
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-6">
                Join Us in Transforming Healthcare Financing!
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Experience stress-free medical financing with RI Medicare. Apply now to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/apply-loan">
                  <Button size="lg" className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/our-cards">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Explore Our Cards
                    <ArrowRight className="ml-2 h-4 w-4" />
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

export default AboutUs;
