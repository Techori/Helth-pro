
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CreditCard, HospitalIcon, Heart, Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import FlippableCard from './ui/flippable-card';

const FlippableFeatureCards = () => {
  const features = [
    {
      icon: <CreditCard className="h-10 w-10 text-brand-600" />,
      title: "Medical EMIs",
      description: "Convert your medical bills into easy EMIs with our flexible payment options.",
      link: "/services/financing",
      backContent: (
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">EMI Features</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white/80 flex-shrink-0" />
                <span>90 days interest-free period</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white/80 flex-shrink-0" />
                <span>Flexible repayment options</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white/80 flex-shrink-0" />
                <span>Quick digital approval</span>
              </li>
            </ul>
          </div>
          <Link to="/services/financing" className="text-white hover:underline flex items-center mt-4">
            Learn more <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      )
    },
    {
      icon: <HospitalIcon className="h-10 w-10 text-brand-600" />,
      title: "Hospital Partners",
      description: "Access quality healthcare at our 500+ partner hospitals across the country.",
      link: "/hospital-registration",
      backContent: (
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Partner Benefits</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white/80 flex-shrink-0" />
                <span>Immediate payment settlement</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white/80 flex-shrink-0" />
                <span>Increased patient footfall</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white/80 flex-shrink-0" />
                <span>Simple integration process</span>
              </li>
            </ul>
          </div>
          <Link to="/hospital-registration" className="text-white hover:underline flex items-center mt-4">
            Partner with us <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      )
    },
    {
      icon: <Heart className="h-10 w-10 text-medicare-500" />,
      title: "RI Medicare Card",
      description: "Get exclusive benefits with our healthcare card for all your medical needs.",
      link: "/our-cards",
      backContent: (
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Card Benefits</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white/80 flex-shrink-0" />
                <span>Pre-approved medical credit</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white/80 flex-shrink-0" />
                <span>Special discounts at partners</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white/80 flex-shrink-0" />
                <span>Family coverage options</span>
              </li>
            </ul>
          </div>
          <Link to="/our-cards" className="text-white hover:underline flex items-center mt-4">
            Explore cards <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <FlippableCard
          key={index}
          className="h-[350px]"
          frontContent={
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-8 h-full flex flex-col">
              <div className="p-3 bg-gray-50 inline-block rounded-xl mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{feature.description}</p>
              <div className="text-brand-600 font-medium flex items-center hover:text-brand-700">
                Click to flip <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          }
          backContent={
            <div className="bg-gradient-to-br from-brand-600 to-medicare-600 rounded-2xl text-white shadow-lg h-full">
              {feature.backContent}
            </div>
          }
        />
      ))}
    </div>
  );
};

export default FlippableFeatureCards;
