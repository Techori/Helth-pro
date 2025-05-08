
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import LanguageSwitcher from '@/components/legal/LanguageSwitcher';

const TermsAndConditions = () => {
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');

  const handleLanguageChange = (lang: 'english' | 'hindi') => {
    setLanguage(lang);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-8 text-center">
            {language === 'english' ? 'Terms and Conditions' : 'नियम और शर्तें'}
          </h1>
          
          <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
          
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-gray-100">
            {language === 'english' ? (
              <div className="space-y-6 text-gray-700">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Introduction</h2>
                  <p>
                    Welcome to RI Medicare. These Terms and Conditions govern your use of our platform and services.
                  </p>
                  <p className="font-bold bg-yellow-50 px-3 py-2 rounded-md">
                    IMPORTANT: RI Medicare is NOT a bank, NBFC, or finance company. We are solely a platform that provides EMI facilities, hospital bill discounting services, and EMI collection services. All approvals are subject to our hospital partners.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Acceptance of Terms</h2>
                  <p>
                    By accessing or using our services, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Service Description</h2>
                  <p>
                    RI Medicare is a platform that:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Connects patients with healthcare providers</li>
                    <li>Facilitates EMI arrangements for medical treatments</li>
                    <li>Provides hospital bill discounting services</li>
                    <li>Offers EMI collection services</li>
                  </ul>
                  <p>
                    We do not provide any banking, financial, or lending services directly. All EMI approvals are subject to our hospital partners' discretion.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">User Accounts</h2>
                  <p>
                    When you create an account with us, you must provide information that is accurate, complete, and current. You are responsible for safeguarding your account password and for any activities or actions under your account.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">EMI Facility Terms</h2>
                  <p>
                    Our EMI facility is subject to the following terms:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>EMI facilities are provided through our hospital partners</li>
                    <li>Approval for EMI facilities is subject to our hospital partners' criteria</li>
                    <li>We act only as a facilitator and not as a direct lender</li>
                    <li>All EMI payments must be made according to the agreed schedule</li>
                    <li>Late payments may attract penalties as specified in your EMI agreement</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Limitations of Liability</h2>
                  <p>
                    RI Medicare shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your use or inability to use our services</li>
                    <li>Any transactions between you and our hospital partners</li>
                    <li>Unauthorized access to or alteration of your data</li>
                    <li>Statements or conduct of any third party on our service</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Changes to Terms</h2>
                  <p>
                    We reserve the right to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
                  <p>
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <p>Email: rimgwl@rishishwarindustry.in</p>
                  <p>Phone: +91 89898 98989</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-gray-700">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">परिचय</h2>
                  <p>
                    RI Medicare में आपका स्वागत है। ये नियम और शर्तें हमारे प्लेटफॉर्म और सेवाओं के आपके उपयोग को नियंत्रित करती हैं।
                  </p>
                  <p className="font-bold bg-yellow-50 px-3 py-2 rounded-md">
                    महत्वपूर्ण: RI Medicare कोई बैंक, NBFC, या वित्त कंपनी नहीं है। हम केवल एक प्लेटफॉर्म हैं जो EMI सुविधाएं, अस्पताल बिल छूट सेवाएं, और EMI संग्रह सेवाएं प्रदान करता है। सभी अनुमोदन हमारे अस्पताल भागीदारों के अधीन हैं।
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">नियमों की स्वीकृति</h2>
                  <p>
                    हमारी सेवाओं का उपयोग करके या उन तक पहुंच करके, आप इन नियमों और शर्तों से बंधे होने के लिए सहमत होते हैं। अगर आप इन नियमों के किसी भी हिस्से से असहमत हैं, तो आप सेवा का उपयोग नहीं कर सकते हैं।
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">सेवा विवरण</h2>
                  <p>
                    RI Medicare एक प्लेटफॉर्म है जो:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>रोगियों को स्वास्थ्य सेवा प्रदाताओं से जोड़ता है</li>
                    <li>चिकित्सा उपचार के लिए EMI व्यवस्था की सुविधा प्रदान करता है</li>
                    <li>अस्पताल बिल छूट सेवाएं प्रदान करता है</li>
                    <li>EMI संग्रह सेवाएं प्रदान करता है</li>
                  </ul>
                  <p>
                    हम सीधे कोई भी बैंकिंग, वित्तीय, या ऋण सेवाएं प्रदान नहीं करते हैं। सभी EMI अनुमोदन हमारे अस्पताल भागीदारों के विवेक पर निर्भर हैं।
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">उपयोगकर्ता खाते</h2>
                  <p>
                    जब आप हमारे साथ एक खाता बनाते हैं, तो आपको सटीक, पूर्ण और वर्तमान जानकारी प्रदान करनी होगी। आप अपने खाते के पासवर्ड की सुरक्षा और अपने खाते के तहत किसी भी गतिविधियों या कार्यों के लिए जिम्मेदार हैं।
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">EMI सुविधा के नियम</h2>
                  <p>
                    हमारी EMI सुविधा निम्नलिखित शर्तों के अधीन है:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>EMI सुविधाएं हमारे अस्पताल भागीदारों के माध्यम से प्रदान की जाती हैं</li>
                    <li>EMI सुविधाओं के लिए अनुमोदन हमारे अस्पताल भागीदारों के मापदंडों के अधीन है</li>
                    <li>हम केवल एक सुविधादाता के रूप में कार्य करते हैं और सीधे ऋणदाता के रूप में नहीं</li>
                    <li>सभी EMI भुगतान सहमत अनुसूची के अनुसार किए जाने चाहिए</li>
                    <li>देर से भुगतान पर आपके EMI समझौते में निर्दिष्ट दंड लग सकता है</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">देयता की सीमाएं</h2>
                  <p>
                    RI Medicare किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक, विशेष, परिणामी, या उदाहरणात्मक क्षति के लिए उत्तरदायी नहीं होगा जो निम्न से उत्पन्न होती है:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>आपके द्वारा हमारी सेवाओं का उपयोग या उपयोग करने में असमर्थता</li>
                    <li>आपके और हमारे अस्पताल भागीदारों के बीच कोई भी लेनदेन</li>
                    <li>आपके डेटा तक अनधिकृत पहुंच या उसमें परिवर्तन</li>
                    <li>हमारी सेवा पर किसी भी तीसरे पक्ष के बयान या आचरण</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">नियमों में परिवर्तन</h2>
                  <p>
                    हम किसी भी समय इन नियमों को संशोधित करने या बदलने का अधिकार सुरक्षित रखते हैं। परिवर्तनों के लिए समय-समय पर इन नियमों की समीक्षा करना आपकी जिम्मेदारी है।
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">हमसे संपर्क करें</h2>
                  <p>
                    अगर आपके पास इन नियमों के बारे में कोई प्रश्न हैं, तो कृपया हमसे संपर्क करें:
                  </p>
                  <p>ईमेल: rimgwl@rishishwarindustry.in</p>
                  <p>फोन: +91 89898 98989</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
