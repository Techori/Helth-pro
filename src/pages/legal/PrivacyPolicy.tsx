
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import LanguageSwitcher from '@/components/legal/LanguageSwitcher';

const PrivacyPolicy = () => {
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
            {language === 'english' ? 'Privacy Policy' : 'गोपनीयता नीति'}
          </h1>
          
          <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
          
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-gray-100">
            {language === 'english' ? (
              <div className="space-y-6 text-gray-700">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Introduction</h2>
                  <p>
                    RI Medicare ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by RI Medicare.
                  </p>
                  <p className="font-bold bg-yellow-50 px-3 py-2 rounded-md">
                    IMPORTANT: RI Medicare is NOT a bank, NBFC, or finance company. We are solely a platform that provides EMI facilities, hospital bill discounting services, and EMI collection services. All approvals are subject to our hospital partners.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Information We Collect</h2>
                  <p>
                    We collect information that you provide directly to us, such as when you create an account, request an EMI facility, or communicate with us. This information may include:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Personal identification information (name, email address, phone number, postal address)</li>
                    <li>Financial information necessary for EMI processing</li>
                    <li>Medical information related to healthcare services</li>
                    <li>Information about your interactions with our platform</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
                  <p>
                    We may use the information we collect for various purposes, including to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Process EMI applications and facilitate payments</li>
                    <li>Provide, maintain, and improve our services</li>
                    <li>Communicate with you about our services</li>
                    <li>Monitor and analyze usage patterns</li>
                    <li>Connect you with our partner hospitals</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Information Sharing</h2>
                  <p>
                    We may share your information with:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Our hospital partners to facilitate EMI arrangements</li>
                    <li>Service providers who perform services on our behalf</li>
                    <li>As required by law or to protect our rights</li>
                  </ul>
                  <p>
                    We do not sell your personal information to third parties.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Data Security</h2>
                  <p>
                    We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Your Rights</h2>
                  <p>
                    You have the right to access, correct, or delete your personal information. You may also have the right to restrict or object to certain processing of your information.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Changes to this Privacy Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us at:
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
                    RI Medicare ("हम", "हमारा", या "हमें") आपकी गोपनीयता की रक्षा के लिए प्रतिबद्ध है। यह गोपनीयता नीति बताती है कि RI Medicare द्वारा आपकी व्यक्तिगत जानकारी कैसे एकत्र, उपयोग और प्रकट की जाती है।
                  </p>
                  <p className="font-bold bg-yellow-50 px-3 py-2 rounded-md">
                    महत्वपूर्ण: RI Medicare कोई बैंक, NBFC, या वित्त कंपनी नहीं है। हम केवल एक प्लेटफॉर्म हैं जो EMI सुविधाएं, अस्पताल बिल छूट सेवाएं, और EMI संग्रह सेवाएं प्रदान करता है। सभी अनुमोदन हमारे अस्पताल भागीदारों के अधीन हैं।
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">हम कौन सी जानकारी एकत्र करते हैं</h2>
                  <p>
                    हम वह जानकारी एकत्र करते हैं जो आप सीधे हमें प्रदान करते हैं, जैसे कि जब आप खाता बनाते हैं, EMI सुविधा का अनुरोध करते हैं, या हमारे साथ संवाद करते हैं। इस जानकारी में शामिल हो सकते हैं:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>व्यक्तिगत पहचान जानकारी (नाम, ईमेल पता, फोन नंबर, डाक पता)</li>
                    <li>EMI प्रसंस्करण के लिए आवश्यक वित्तीय जानकारी</li>
                    <li>स्वास्थ्य सेवाओं से संबंधित चिकित्सा जानकारी</li>
                    <li>हमारे प्लेटफॉर्म के साथ आपकी बातचीत के बारे में जानकारी</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">हम आपकी जानकारी का उपयोग कैसे करते हैं</h2>
                  <p>
                    हम एकत्रित जानकारी का उपयोग विभिन्न उद्देश्यों के लिए कर सकते हैं, जिसमें शामिल हैं:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>EMI आवेदनों को प्रोसेस करना और भुगतान की सुविधा प्रदान करना</li>
                    <li>हमारी सेवाओं को प्रदान करना, बनाए रखना और सुधारना</li>
                    <li>हमारी सेवाओं के बारे में आपसे संवाद करना</li>
                    <li>उपयोग पैटर्न की निगरानी और विश्लेषण करना</li>
                    <li>आपको हमारे अस्पताल भागीदारों से जोड़ना</li>
                    <li>कानूनी दायित्वों का पालन करना</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">जानकारी साझाकरण</h2>
                  <p>
                    हम आपकी जानकारी निम्न के साथ साझा कर सकते हैं:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>EMI व्यवस्था की सुविधा के लिए हमारे अस्पताल भागीदारों के साथ</li>
                    <li>सेवा प्रदाताओं के साथ जो हमारी ओर से सेवाएं प्रदान करते हैं</li>
                    <li>कानून द्वारा आवश्यक होने पर या हमारे अधिकारों की रक्षा के लिए</li>
                  </ul>
                  <p>
                    हम आपकी व्यक्तिगत जानकारी को तृतीय पक्षों को नहीं बेचते हैं।
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">डेटा सुरक्षा</h2>
                  <p>
                    हम आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए उचित सुरक्षा उपाय लागू करते हैं। हालांकि, इंटरनेट या इलेक्ट्रॉनिक स्टोरेज के माध्यम से संचरण का कोई भी तरीका 100% सुरक्षित नहीं है।
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">आपके अधिकार</h2>
                  <p>
                    आपको अपनी व्यक्तिगत जानकारी तक पहुँच, सुधार, या हटाने का अधिकार है। आपके पास अपनी जानकारी के कुछ प्रसंस्करण को प्रतिबंधित करने या उसका विरोध करने का अधिकार भी हो सकता है।
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">इस गोपनीयता नीति में परिवर्तन</h2>
                  <p>
                    हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। हम आपको इस पेज पर नई गोपनीयता नीति पोस्ट करके किसी भी परिवर्तन के बारे में सूचित करेंगे।
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">हमसे संपर्क करें</h2>
                  <p>
                    यदि आपके पास इस गोपनीयता नीति के बारे में कोई प्रश्न है, तो कृपया हमसे संपर्क करें:
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

export default PrivacyPolicy;
