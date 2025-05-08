
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, ChevronRight, CreditCard, Clock, Shield, Gift, TrendingUp, Percent } from 'lucide-react';

const OurCards = () => {
  const [loaded, setLoaded] = useState(false);
  const [selectedCard, setSelectedCard] = useState('paylater');

  useEffect(() => {
    setLoaded(true);
  }, []);

  const cards = [
    {
      id: 'paylater',
      name: 'Health PayLater Card',
      title: 'Get medical treatment now and pay later with 0% interest for the first 3 months!',
      annualFee: '₹4,720',
      hospitals: '500+',
      documentation: 'No documentation required',
      approval: 'Instant approval & digital card issuance',
      features: [
        'Zero interest for the first 3 months',
        'Credit limit up to ₹5,00,000',
        'ROI: 12-18% after the interest-free period',
        'Quick & secure digital KYC process',
        '24/7 customer support',
        'No hidden charges',
        'Flexible repayment options',
      ],
      color: 'from-brand-500 to-brand-600',
      accent: 'brand',
    },
    {
      id: 'emi',
      name: 'Health EMI Card',
      title: 'Convert your medical expenses into affordable monthly installments!',
      annualFee: '₹4,720',
      hospitals: '500+',
      documentation: 'Flexible EMI options (3-60 months)',
      approval: 'Higher credit limits',
      features: [
        'Credit limit up to ₹10,00,000',
        'ROI: 12-18% per annum',
        'Flexible tenure options',
        'Minimal documentation',
        'Complimentary health insurance',
        'Partner hospital support',
        'Zero foreclosure charges',
      ],
      color: 'from-medicare-500 to-medicare-600',
      accent: 'medicare',
    },
    {
      id: '5050',
      name: 'Health 50-50 Card',
      title: 'Pay half now, half later without any extra charges!',
      annualFee: '₹2,360',
      hospitals: '500+',
      documentation: 'Pay only 50% upfront',
      approval: 'Balance 50% within 30-90 days',
      features: [
        'Split payment function',
        'Credit limit up to ₹3,00,000',
        'ROI: 12-18% if extending beyond term',
        'Simple documentation',
        'Healthcare rewards program',
        'Dedicated relationship manager',
        'Family coverage option',
      ],
      color: 'from-purple-500 to-indigo-600',
      accent: 'purple',
    },
    {
      id: 'discount',
      name: 'RI Medicare Discount Card',
      title: 'Enjoy instant discounts and benefits on all your medical expenses!',
      annualFee: '₹1,770',
      hospitals: '500+',
      documentation: 'Zero physical documentation',
      approval: 'Instant approval',
      features: [
        'Partner hospital flat instant discounts 10% to 15%',
        'Complimentary health insurance up to ₹50,000',
        'Daily cash benefits up to ₹3,000/day',
        'Instant topup facility',
        'No physical documentation required',
        'Access to healthcare network',
        'Instant digital card issuance',
      ],
      color: 'from-green-500 to-emerald-600',
      accent: 'green',
    },
  ];

  const workflow = [
    {
      step: '01',
      title: 'Choose Your Card',
      description: 'Select a card that suits your needs (PayLater, EMI, or 50-50 Card).',
    },
    {
      step: '02',
      title: 'Submit Application',
      description: 'Click "Apply Now" and complete a simple application form.',
    },
    {
      step: '03',
      title: 'Complete KYC',
      description: 'Complete digital KYC verification with no paperwork required.',
    },
    {
      step: '04',
      title: 'Get Instant Approval',
      description: 'Receive instant approval and start using your card at 500+ hospitals.',
    },
    {
      step: '05',
      title: 'Easy Repayment',
      description: 'Repay in easy EMIs or zero-cost installments based on your plan.',
    }
  ];

  const selectedCardData = cards.find(card => card.id === selectedCard);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block bg-brand-50 px-3 py-1 rounded-full text-brand-700 font-medium text-sm mb-4">
                Flexible Healthcare Financing for Everyone
              </div>
              <h1 className="text-3xl md:text-5xl font-bold font-display text-gray-900 mb-4">
                Our Healthcare Cards
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Get medical treatment first, pay later with flexible payment options
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand-600" />
                  <span className="text-gray-700">Buy Now, Pay Later Options</span>
                </div>
                <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand-600" />
                  <span className="text-gray-700">90 Days Interest-Free</span>
                </div>
                <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand-600" />
                  <span className="text-gray-700">Instant Approvals</span>
                </div>
                <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand-600" />
                  <span className="text-gray-700">Easy EMI Repayments</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                Our Healthcare Cards
              </h2>
              <p className="text-xl text-gray-600">
                Select the right card for your needs
              </p>
            </div>

            {/* Card Selector */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedCard === card.id
                        ? 'scale-105 shadow-lg'
                        : 'shadow-sm opacity-90 hover:opacity-100'
                    }`}
                    onClick={() => setSelectedCard(card.id)}
                  >
                    <div className={`rounded-xl overflow-hidden relative ${
                      selectedCard === card.id ? 'ring-2 ring-offset-2 ring-' + card.accent + '-500' : 'ring-1 ring-gray-200'
                    }`}>
                      <div className={`h-3 bg-gradient-to-r ${card.color}`}></div>
                      <div className="p-6 bg-white">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{card.name}</h3>
                        <p className="text-sm text-gray-600 mb-4 h-12">{card.title}</p>
                        <hr className="my-4" />
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Annual Fee:</span>
                            <span className="font-medium text-gray-900">{card.annualFee}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Hospitals:</span>
                            <span className="font-medium text-gray-900">{card.hospitals}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Card Details */}
              {selectedCardData && (
                <div className={`animate-fade-in bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${selectedCardData.id === selectedCard ? '' : 'hidden'}`}>
                  <div className={`h-2 bg-gradient-to-r ${selectedCardData.color}`}></div>
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/3">
                        <div className="aspect-[4/3] bg-gray-50 rounded-lg relative mb-6">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="p-6 w-full">
                              <div className="w-full aspect-[5/3] bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl flex flex-col p-4 relative overflow-hidden shadow-lg">
                                <div className="absolute top-0 right-0 left-0 h-12 bg-gradient-to-r from-gray-800/10 to-white/10"></div>
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full"></div>
                                <div className="flex justify-between mb-6">
                                  <div className="text-white text-sm font-medium">RI Medicare</div>
                                  <div className={`h-6 w-10 rounded bg-gradient-to-r ${selectedCardData.color} flex items-center justify-center`}>
                                    <CreditCard className="h-3 w-3 text-white" />
                                  </div>
                                </div>
                                <div className="mt-auto">
                                  <div className="text-white/80 text-xs mb-1">Card Holder</div>
                                  <div className="text-white font-medium">{selectedCardData.name}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Annual Fee:</span>
                            <span className="font-medium">{selectedCardData.annualFee}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hospitals:</span>
                            <span className="font-medium">{selectedCardData.hospitals}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Documentation:</span>
                            <span className="font-medium">{selectedCardData.documentation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Approval:</span>
                            <span className="font-medium">{selectedCardData.approval}</span>
                          </div>
                        </div>
                        <Link to="/apply-loan">
                          <Button className="w-full bg-brand-600 hover:bg-brand-700">
                            Apply Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                      
                      <div className="md:w-2/3">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Key Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedCardData.features.map((feature, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <Check className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-8">
                          <h4 className="text-xl font-semibold text-gray-900 mb-3">Benefits</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                              {
                                icon: <Clock className="h-6 w-6 text-brand-600" />,
                                title: 'Quick Access',
                                desc: 'Get instant medical financing',
                              },
                              {
                                icon: <Shield className="h-6 w-6 text-brand-600" />,
                                title: 'Safe & Secure',
                                desc: 'Protected transactions',
                              },
                              {
                                icon: <Gift className="h-6 w-6 text-brand-600" />,
                                title: 'Exclusive Rewards',
                                desc: 'Special healthcare benefits',
                              },
                              {
                                icon: <TrendingUp className="h-6 w-6 text-brand-600" />,
                                title: 'Flexible Limits',
                                desc: 'Customized credit limits',
                              },
                              {
                                icon: <Percent className="h-6 w-6 text-brand-600" />,
                                title: 'Hospital Discounts',
                                desc: 'Save on medical expenses',
                              },
                              {
                                icon: <CreditCard className="h-6 w-6 text-brand-600" />,
                                title: 'Digital Card',
                                desc: 'Paperless experience',
                              },
                            ].map((benefit, index) => (
                              <div key={index} className="p-4 rounded-lg bg-gray-50">
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0">{benefit.icon}</div>
                                  <div>
                                    <h5 className="font-medium text-gray-900">{benefit.title}</h5>
                                    <p className="text-sm text-gray-600">{benefit.desc}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                A simple process to get your healthcare card
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {workflow.map((item, index) => (
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
              
              <div className="mt-12 text-center">
                <Link to="/apply-loan">
                  <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Compare Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                Compare Our Cards
              </h2>
              <p className="text-xl text-gray-600">
                Find the right healthcare card for your specific needs
              </p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] bg-white rounded-lg shadow-sm border border-gray-100">
                  <thead>
                    <tr>
                      <th className="p-4 text-left text-gray-900 font-medium">Features</th>
                      {cards.map(card => (
                        <th key={card.id} className="p-4 text-left text-gray-900 font-medium">
                          {card.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-100">
                      <td className="p-4 text-gray-700">Annual Fee</td>
                      {cards.map(card => (
                        <td key={card.id} className="p-4 font-medium">{card.annualFee}</td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-100 bg-gray-50">
                      <td className="p-4 text-gray-700">Credit Limit</td>
                      <td className="p-4 font-medium">Up to ₹5,00,000</td>
                      <td className="p-4 font-medium">Up to ₹10,00,000</td>
                      <td className="p-4 font-medium">Up to ₹3,00,000</td>
                      <td className="p-4 font-medium">N/A</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="p-4 text-gray-700">Interest Rate</td>
                      <td className="p-4 font-medium">0% for 3 months, then 12-18%</td>
                      <td className="p-4 font-medium">12-18% p.a.</td>
                      <td className="p-4 font-medium">0% if paid within term, then 12-18%</td>
                      <td className="p-4 font-medium">N/A</td>
                    </tr>
                    <tr className="border-t border-gray-100 bg-gray-50">
                      <td className="p-4 text-gray-700">Payment Structure</td>
                      <td className="p-4 font-medium">BNPL with flexible EMIs</td>
                      <td className="p-4 font-medium">Fixed EMIs</td>
                      <td className="p-4 font-medium">50% now, 50% later</td>
                      <td className="p-4 font-medium">Upfront with instant discount</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="p-4 text-gray-700">Hospital Network</td>
                      <td className="p-4 font-medium">500+ hospitals</td>
                      <td className="p-4 font-medium">500+ hospitals</td>
                      <td className="p-4 font-medium">500+ hospitals</td>
                      <td className="p-4 font-medium">500+ hospitals</td>
                    </tr>
                    <tr className="border-t border-gray-100 bg-gray-50">
                      <td className="p-4 text-gray-700">Documentation</td>
                      <td className="p-4 font-medium">Minimal</td>
                      <td className="p-4 font-medium">Minimal</td>
                      <td className="p-4 font-medium">Minimal</td>
                      <td className="p-4 font-medium">Zero physical documentation</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="p-4 text-gray-700">Special Benefits</td>
                      <td className="p-4 font-medium">Interest-free period</td>
                      <td className="p-4 font-medium">Complimentary health insurance</td>
                      <td className="p-4 font-medium">Dedicated relationship manager</td>
                      <td className="p-4 font-medium">10-15% instant discounts</td>
                    </tr>
                    <tr className="border-t border-gray-100 bg-gray-50">
                      <td className="p-4 text-gray-700">Best For</td>
                      <td className="p-4 font-medium">Short-term treatments</td>
                      <td className="p-4 font-medium">Long-term & expensive treatments</td>
                      <td className="p-4 font-medium">Moderate treatments with split payments</td>
                      <td className="p-4 font-medium">Regular hospital visits with instant savings</td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="p-4 text-gray-700"></td>
                      {cards.map(card => (
                        <td key={card.id} className="p-4">
                          <Link to="/apply-loan">
                            <Button className="w-full bg-brand-600 hover:bg-brand-700">
                              Get Started
                            </Button>
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Get answers to common questions about our healthcare cards
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {[
                  {
                    question: "Who is eligible for RI Medicare healthcare cards?",
                    answer: "Any Indian resident aged 21-65 years with a valid ID proof, address proof, and having a regular income source (salaried or self-employed) can apply for our healthcare cards.",
                  },
                  {
                    question: "How long does the approval process take?",
                    answer: "Our digital KYC and verification process enables instant approvals in most cases. Once approved, you can immediately use your digital card at any of our partner hospitals.",
                  },
                  {
                    question: "Is there any processing fee?",
                    answer: "There is no processing fee for applying for our healthcare cards. The only charge is the annual fee which is clearly mentioned for each card type.",
                  },
                  {
                    question: "Can I use the card for my family members' treatment?",
                    answer: "Yes, you can use your RI Medicare card for medical treatments of your immediate family members (spouse, children, and parents).",
                  },
                  {
                    question: "What happens if I miss an EMI payment?",
                    answer: "Late payment fees and additional interest will be applicable if you miss an EMI payment. We recommend setting up auto-debit to avoid missing payments.",
                  },
                  {
                    question: "How can I check my available credit limit?",
                    answer: "You can check your available credit limit through the RI Medicare mobile app or by logging into your account on our website.",
                  },
                ].map((faq, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white mb-6">
                Get Your Healthcare Card Today!
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                No more financial worries for your medical treatments. Apply for an RI Medicare card and experience stress-free healthcare financing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/apply-loan">
                  <Button size="lg" variant="default" className="w-full sm:w-auto bg-white hover:bg-gray-100 text-brand-600">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/about-us">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-white hover:bg-white/10 border-white">
                    Learn More
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

export default OurCards;
