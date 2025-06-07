import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Minimize2, MessageCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Message } from "@/lib/chatbot"; // Correctly import only Message
// Assuming getHealthResponse is no longer needed with the clickable options flow

type Language = 'en' | 'hi';

const mainOptions = [
  {
    title: "Our Services",
    title_hi: "हमारी सेवाएं",
    description: "Healthcare Financing, Pharmacy, Ambulance, Retail Stores, Pathology",
    description_hi: "हेल्थकेयर फाइनेंसिंग, फार्मेसी, एम्बुलेंस, रिटेल स्टोर्स, पैथोलॉजी",
    keywords: ["services", "offerings", "what we offer"],
    subOptions: [
      { en: "Healthcare Financing", hi: "हेल्थकेयर फाइनेंसिंग" },
      { en: "RI Medicare Pharma", hi: "आरआई मेडिकेयर फार्मा" },
      { en: "Quick Ambulance Service", hi: "त्वरित एम्बुलेंस सेवा" },
      { en: "Pharmacy Retail Stores", hi: "फार्मेसी रिटेल स्टोर्स" },
      { en: "RI Medicare Pathology", hi: "आरआई मेडिकेयर पैथोलॉजी" }
    ]
  },
  {
    title: "Loan Process",
    title_hi: "ऋण प्रक्रिया",
    description: "Steps to get your medical loan",
    description_hi: "अपना मेडिकल लोन पाने के चरण",
    keywords: ["loan", "loan process", "how to get loan"],
    subOptions: [
      { en: "Personal Details", hi: "व्यक्तिगत विवरण" },
      { en: "Credit Check", hi: "क्रेडिट चेक" },
      { en: "KYC Verification", hi: "केवाईसी सत्यापन" },
      { en: "Account Analysis", hi: "खाता विश्लेषण" },
      { en: "Loan Offers", hi: "ऋण प्रस्ताव" },
      { en: "Sign & Complete", hi: "साइन और पूरा करें" },
      { en: "Wallet Activation", hi: "वॉलेट सक्रियण" }
    ]
  },
  {
    title: "My Information",
    title_hi: "मेरी जानकारी",
    description: "Find out more about us.",
    description_hi: "हमारे बारे में और जानें।",
    keywords: ["information", "about", "contact"],
    subOptions: [
      { en: "About Us", hi: "हमारे बारे में" },
      { en: "Contact Us", hi: "हमसे संपर्क करें" },
      { en: "Healthcare Cards", hi: "स्वास्थ्य कार्ड" },
    ]
  },
  {
    title: 'Sitemap',
    title_hi: 'साइटमैप',
    description: 'View all available sections.',
    description_hi: 'सभी उपलब्ध अनुभाग देखें।',
    keywords: ['sitemap', 'sections', 'categories'],
    subOptions: [
      { en: 'Main Pages', hi: 'मुख्य पृष्ठ' },
      { en: 'Partner Areas', hi: 'भागीदार क्षेत्र' },
      { en: 'Patient Area', hi: 'रोगी क्षेत्र' },
      { en: 'Support', hi: 'समर्थन' },
      { en: 'Admin Areas', hi: 'एडमिन क्षेत्र' },
      { en: 'Legal', hi: 'कानूनी' },
    ],
  },
];

const generateSitemapText = (language: Language) => {
  let sitemapText = language === 'hi' ? 'साइटमैप:\n' : 'Sitemap:\n';
  mainOptions.forEach(option => {
    // Exclude the Sitemap section itself from the listing if it has sub-options
    if (option.title !== 'Sitemap' || (option.title === 'Sitemap' && !option.subOptions)) {
       sitemapText += `- ${language === 'hi' ? option.title_hi : option.title}\n`;
    }

    // List sub-options for all categories, including Sitemap if it has them
    if (option.subOptions) {
        if (option.title === 'Sitemap') {
             sitemapText += language === 'hi' ? '  उप-अनुभाग:\n' : '  Sub-sections:\n';
        }
        option.subOptions.forEach(subOption => {
          sitemapText += `  - ${language === 'hi' ? subOption.hi : subOption.en}\n`;
        });
      }
  });
  return sitemapText;
};

// This structure needs to be expanded or mapped correctly
// For now, using existing keys and adding placeholders
const HEALTH_RESPONSES: { [key: string]: any } = {
  en: {
    languageSelection: "Hello! Welcome to Anany!\n\nPlease select your preferred language:\n1. English\n2. \u0939\u093F\u0902\u0926\u0940 (Hindi)",
    welcome: "Welcome to Anany! 👋\nI can help you with the following categories:",
    ourServicesIntro: "Here are our healthcare services:",
    loanProcessIntro: "Here are the steps for the loan process:",
    myInformationIntro: "Information about us:",
    // Our Services responses (mapping sub-options)
    "Healthcare Financing": "Our Financing Solutions\nComprehensive financial support for all your healthcare needs\n\nBuy Now, Pay Later (BNPL)\n90 days interest-free payment for medical treatments.\n\nEasy EMI Options\nSplit medical bills into affordable monthly installments.\n\nQuick Loan Approvals\nInstant eligibility check and hassle-free processing.\n\nHospital Partnerships\nSecure payments and financial support for healthcare providers.",
    "RI Medicare Pharma": "Key Highlights of RI Medicare Pharma\nAffordable Pricing – High-quality medicines at competitive prices\n\nTrusted Formulations – Manufactured with top-grade ingredients\n\nWide Range of Medicines – Covering general health, chronic diseases, and critical care\n\nRetail & Online Availability – Available through RI Medicare Pharmacy, Retail Stores, and Online Platforms\n\nCommitment to Innovation – Continuous research to bring the best healthcare solutions",
    "Quick Ambulance Service": "Service Features\nQuick Response Time\nOur ambulances reach you within minutes, ensuring critical care when time matters most.\n\nAdvanced Life Support\nFully equipped ambulances with modern life-saving equipment and technologies.\n\nEasy Accessibility\nSimple phone call or app-based booking for immediate emergency response.\n\nTrained Paramedics\nSkilled medical professionals to provide immediate care during transit.",
    "Pharmacy Retail Stores": "Our Pharmacy Retail Stores Offer\nWide range of healthcare products\n\nIn-store pharmacist consultation\n\nHealth checkup facilities\n\nLoyalty program benefits\n\nGenuine medicines and products\n\nCompetitive pricing",
    "RI Medicare Pathology": "Pathology Services\n\nComprehensive Testing\nComplete spectrum of pathology tests from routine diagnostics to specialized molecular testing.\n\nQuality Assurance\nNABL accredited laboratories with stringent quality control protocols for accurate results.\n\nAdvanced Diagnostics\nState-of-the-art equipment and techniques for precise and reliable test results.\n\nDigital Reports\nElectronic delivery of reports with detailed analysis and interpretation.\n\nQuick Turnaround\nFast processing of samples and prompt reporting through digital channels.\n\nHome Collection\nConvenient sample collection services at your doorstep by trained phlebotomists.",
    "Personal Details": "Please provide the following personal details:\n\nEnter your full name\n\nEnter your email\n\nEnter your phone number\n\nDate of Birth\n\nAddress",
    "Credit Check": "Credit Score\n750 / 900\n\nPayment History\nGood\n\nOutstanding Loans\n1\n\nRepayment Capacity\nExcellent\n\nYour credit score meets our eligibility criteria",
    "KYC Verification": "KYC Verification Process\n\nIdentity Verification\nVerification of your identity documents and personal information.\n\nAddress Verification\nConfirmation of your current and permanent address details.\n\nDocument Authenticity\nValidation of submitted documents for genuineness.\n\nFraud Check\nComprehensive screening to prevent fraudulent activities.",
    "Account Analysis": "Employment Details\nEmployment Type\n\nEnter company name\n\nEnter your monthly income\nLoan Details\nHospital Name\n\nSelect a partner hospital\nLoan Amount Required (₹)\nEnter loan amount\nPreferred Repayment Tenure",
    "Loan Offers": "Account Aggregator Analysis\nFinancial Score\n85/100\n\nRepayment Capacity\nGood\n\nAverage Monthly Balance\n₹32,500\n\nRegular Salary Credits\nVerified\n\nExisting EMI Obligations\n₹12,000/month\n\nSpending Pattern\nHealthy\n\nYour financial profile looks good for loan eligibility",
    "Sign & Complete": "Document Upload\nPlease upload the following documents to complete your application.\n\nAadhaar Card\nUpload front and back of your Aadhaar card\n\nUpload Aadhaar\nPAN Card\nUpload a clear copy of your PAN card\n\nUpload PAN\nBank Statement\nUpload last 3 months bank statement\n\nUpload Statement",
    "Wallet Activation": "Information about Wallet Activation.", // Placeholder
    "Sitemap": generateSitemapText('en'), // Updated Sitemap response
    // Add placeholder responses for new Sitemap sub-options if they are clickable
    "Main Pages": "Main Pages\n• Home\n• About Us\n• Our Cards\n• Apply For EMI",
    "Partner Areas": "Partner Areas\n• Hospital Registration\n• Hospital Dashboard",
    "Patient Area": "Patient Area\n• Apply For EMI\n• Patient Dashboard",
    "Support": "Information about Support.",
    "Admin Areas": "Admin Areas\n• Admin Dashboard\n• Sales Dashboard\n• CRM Dashboard\n• Agent Dashboard",
    "Legal": "Legal\n• Privacy Policy\n• Terms and Conditions",

    // My Information responses (mapping sub-options)
    "About Us": "Contact Us\nWhether you're a patient seeking medical treatment or a hospital looking for financial solutions, RI Medicare is here to help.\n\nAddress\nRishishwar Industry Private Limited\nBM Tower, Infront of Jeen Mata Mandir, Daulatganj,\nPathankar Chourah, Lashkar Gird, Gwalior,\nMadhya Pradesh, Bharat - 474001\n\nEmail\nrimgwl@rishishwarindustry.in\nPhone\n+91 8989 898 989",
    "Contact Us": "Contact Us\nBM Tower, Infront of Jeen Mata Mandir, Daulatganj, Pathankar Chourah, Lashkar Gird, Gwalior, Madhya Pradesh, Bharat - 474001\n\nrimgwl@rishishwarindustry.in\n\n+91 89898 98989",
    "Healthcare Cards": "How It Works\nA simple process to get your healthcare card\n\n01\nChoose Your Card\nSelect a card that suits your needs (PayLater, EMI, or 50-50 Card).\n\n02\nSubmit Application\nClick \"Apply Now\" and complete a simple application form.\n\n03\nComplete KYC\nComplete digital KYC verification with no paperwork required.\n\n04\nGet Instant Approval\nReceive instant approval and start using your card at 500+ hospitals.\n\n05\nEasy Repayment\nRepay in easy EMIs or zero-cost installments based on your plan.",

    // Existing specific responses (can be triggered by free text or mapped from sub-options)
    doctorConsultation: "Information about Doctor Consultations.",
    labTests: "Information about Lab Tests.",
    emergency: "Information about Emergency Services.",
    medicineInfo: "Information about Pharmacy/Medicine.",
    loanProcess: "General information about the Loan Process.",
    loanPersonalDetails: "Details about Personal Details step.",
    loanCreditCheck: "Details about Credit Check step.",
    loanKYCVerification: "Details about KYC Verification step.",
    loanEmploymentLoanDetails: "Details about Employment & Loan Details.",
    aboutUs: "General information about us.",
    contactUs: "General contact information.",
    insurance: "Information about Insurance.",
    hospital: "Information about Hospitals.",
    help: "How can I assist you today? Choose from the categories above.",
    restart: "Chat restarted. Please select your language.",
    language: "Please select your preferred language.",
    languageSelectionMessage: "Please select your preferred language:", // Used in rendering
    goodbye: "Goodbye! Have a great day.",
    thankYou: "You're welcome!",
    default: "Sorry, I didn't understand that. Can you please rephrase?",
    "Our Services": "Our Services\n• Healthcare Financing\n• RI Medicare Pharma\n• Quick Ambulance Service\n• Pharmacy Retail Stores\n• RI Medicare Pathology"
  },
  hi: {
    languageSelection: "👋 \u0928\u092E\u0938\u094D\u0924\u0947! Anany \u092E\u0947\u0902 \u0906\u092A\u0915\u093E \u0938\u094D\u0935\u093E\u0917\u0924 \u0939\u0948!\n\n\u0915\u0943\u092A\u092F\u093E \u0905\u092C\u0928\u0940 \u092A\u0938\u0902\u0926\u0940\u0926\u093E \u092D\u093E\u0937\u093E \u091A\u0941\u0928\u0947\u0902:\n1. English\n2. \u0939\u093F\u0902\u0926\u0940 (Hindi)",
    welcome: "अनन्य में आपका स्वागत है! 👋\nमैं निम्नलिखित श्रेणियों में आपकी सहायता कर सकता हूँ:",
    ourServicesIntro: "यहां हमारी स्वास्थ्य सेवाएं हैं:",
    loanProcessIntro: "ऋण प्रक्रिया के चरण यहां दिए गए हैं:",
    myInformationIntro: "हमारे बारे में जानकारी:",
     // Our Services responses (mapping sub-options)
     "Healthcare Financing": "हमारी फाइनेंसिंग समाधान\nआपकी सभी स्वास्थ्य संबंधी जरूरतों के लिए व्यापक वित्तीय सहायता\n\nअभी खरीदें, बाद में भुगतान करें (BNPL)\nचिकित्सा उपचार के लिए 90 दिन की ब्याज-मुक्त भुगतान।\n\nआसान ईएमआई विकल्प\nमेडिकल बिलों को किफायती मासिक किस्तों में विभाजित करें।\n\nत्वरित ऋण अनुमोदन\nतत्काल पात्रता जांच और परेशानी मुक्त प्रसंस्करण।\n\nअस्पताल भागीदारी\nस्वास्थ्य सेवा प्रदाताओं के लिए सुरक्षित भुगतान और वित्तीय सहायता।",
     "RI Medicare Pharma": "आरआई मेडिकेयर फार्मा की मुख्य विशेषताएं\nकिफायती मूल्य निर्धारण - प्रतिस्पर्धी कीमतों पर उच्च गुणवत्ता वाली दवाएं\n\nभरोसेमंद फ़ार्मुलें - उच्च गुणवत्ता वाले तत्वों से निर्मित\n\nदवाओं की विस्तृत श्रृंखला - सामान्य स्वास्थ्य, पुरानी बीमारियों और महत्वपूर्ण देखभाल को कवर करती है\n\nरिटेल और ऑनलाइन उपलब्धता - आरआई मेडिकेयर फार्मेसी, रिटेल स्टोर्स और ऑनलाइन प्लेटफॉर्म के माध्यम से उपलब्ध\n\nनवाचार के प्रति प्रतिबद्धता - सर्वोत्तम स्वास्थ्य सेवा समाधान लाने के लिए निरंतर अनुसंधान",
     "Quick Ambulance Service": "सेवा विशेषताएं\nत्वरित प्रतिक्रिया समय\nहमारी एम्बुलेंस कुछ ही मिनटों में आप तक पहुंचती हैं, जब समय सबसे महत्वपूर्ण होता है तब महत्वपूर्ण देखभाल सुनिश्चित करती हैं।\n\nउन्नत जीवन समर्थन\nआधुनिक जीवन रक्षक उपकरणों और प्रौद्योगिकियों से लैस पूरी तरह सुसज्जित एम्बुलेंस।\n\nआसान पहुंच\nतत्काल आपातकालीन प्रतिक्रिया के लिए सरल फोन कॉल या ऐप-आधारित बुकिंग।\n\nप्रशिक्षित पैरामेडिक्स\nपारगमन के दौरान तत्काल देखभाल प्रदान करने के लिए कुशल चिकित्सा पेशेवर।",
     "Pharmacy Retail Stores": "हमारे फार्मेसी रिटेल स्टोर्स की पेशकश\nस्वास्थ्य देखभाल उत्पादों की विस्तृत श्रृंखला\n\nस्टोर में फार्मासिस्ट परामर्श\n\nस्वास्थ्य जांच सुविधाएं\n\nलॉयल्टी प्रोग्राम लाभ\n\nप्रामाणिक दवाएं और उत्पाद\n\nप्रतिस्पर्धी मूल्य निर्धारण",
     "RI Medicare Pathology": "पैथोलॉजी सेवाएं\n\nव्यापक परीक्षण\nरूटीन डायग्नोस्टिक्स से लेकर विशेष आणविक परीक्षण तक पैथोलॉजी परीक्षणों का पूरा स्पेक्ट्रम।\n\nगुणवत्ता आश्वासन\nसटीक परिणामों के लिए सख्त गुणवत्ता नियंत्रण प्रोटोकॉल के साथ एनएबीएल मान्यता प्राप्त प्रयोगशालाएं।\n\nउन्नत नैदानिक\nसटीक और विश्वसनीय परीक्षण परिणामों के लिए अत्याधुनिक उपकरण और तकनीकें।\n\nडिजिटल रिपोर्ट\nविस्तृत विश्लेषण और व्याख्या के साथ रिपोर्ट की इलेक्ट्रॉनिक डिलीवरी।\n\nत्वरित प्रतिक्रिया\nडिजिटल चैनलों के माध्यम से नमूनों का तेजी से प्रसंस्करण और तुरंत रिपोर्टिंग।\n\nघर पर नमूना संग्रह\nप्रशिक्षित फ्लेबोटोमिस्ट द्वारा आपके दरवाजे पर सुविधाजनक नमूना संग्रह सेवाएं।",
    "Personal Details": "कृपया निम्नलिखित व्यक्तिगत विवरण प्रदान करें:\n\nअपना पूरा नाम दर्ज करें\n\nअपना ईमेल दर्ज करें\n\nअपना फोन नंबर दर्ज करें\n\nजन्म तिथि\n\nपता",
    "Credit Check": "क्रेडिट स्कोर\n750 / 900\n\nभुगतान इतिहास\nअच्छा\n\nबकाया ऋण\n1\n\nचुकौती क्षमता\nउत्कृष्ट\n\nआपका क्रेडिट स्कोर हमारी पात्रता मानदंडों को पूरा करता है",
    "KYC Verification": "केवाईसी सत्यापन प्रक्रिया\n\nपहचान सत्यापन\nआपके पहचान दस्तावेजों और व्यक्तिगत जानकारी का सत्यापन।\n\nपता सत्यापन\nआपके वर्तमान और स्थायी पते का विवरण पुष्टिकरण।\n\nदस्तावेज़ प्रामाणिकता\nप्रस्तुत दस्तावेज़ों की प्रामाणिकता का सत्यापन।\n\nधोखाधड़ी जांच\nधोखाधड़ी की गतिविधियों को रोकने के लिए व्यापक जांच।",
    "Account Analysis": "रोजगार विवरण\nरोजगार का प्रकार\n\nकंपनी का नाम दर्ज करें\n\nअपनी मासिक आय दर्ज करें\nऋण विवरण\nअस्पताल का नाम\n\nएक भागीदार अस्पताल का चयन करें\nआवश्यक ऋण राशि (₹)\nऋण राशि दर्ज करें\nपसंदीदा चुकौती अवधि",
    "Loan Offers": "खाता एग्रीगेटर विश्लेषण\nवित्तीय स्कोर\n85/100\n\nचुकौती क्षमता\nअच्छा\n\nऔसत मासिक शेष\n₹32,500\n\nनियमित वेतन क्रेडिट\nसत्यापित\n\nमौजूदा ईएमआई दायित्व\n₹12,000/माह\n\nखर्च करने का तरीका\nस्वस्थ\n\nऋण पात्रता के लिए आपका वित्तीय प्रोफ़ाइल अच्छा दिखता है",
    "Sign & Complete": "दस्तावेज़ अपलोड करें\nकृपया अपना आवेदन पूरा करने के लिए निम्नलिखित दस्तावेज़ अपलोड करें।\n\nआधार कार्ड\nअपने आधार कार्ड के आगे और पीछे की फोटो अपलोड करें\n\nआधार अपलोड करें\nपैन कार्ड\nअपने पैन कार्ड की एक स्पष्ट प्रति अपलोड करें\n\nपैन अपलोड करें\nबैंक स्टेटमेंट\nपिछले 3 महीनों का बैंक स्टेटमेंट अपलोड करें\n\nस्टेटमेंट अपलोड करें",
    "Wallet Activation": "वॉलेट सक्रियण के बारे में जानकारी।", // Placeholder
    "Sitemap": generateSitemapText('hi'), // Updated Sitemap response
    // Add placeholder responses for new Sitemap sub-options in Hindi
    "मुख्य पृष्ठ": "मुख्य पृष्ठ\n• होम\n• हमारे बारे में\n• हमारे कार्ड\n• ईएमआई के लिए आवेदन करें",
    "भागीदार क्षेत्र": "भागीदार क्षेत्र\n• अस्पताल पंजीकरण\n• अस्पताल डैशबोर्ड",
    "रोगी क्षेत्र": "रोगी क्षेत्र\n• ईएमआई के लिए आवेदन करें\n• रोगी डैशबोर्ड",
    "समर्थन": "समर्थन के बारे में जानकारी।",
    "एडमिन क्षेत्र": "एडमिन क्षेत्र\n• एडमिन डैशबोर्ड\n• सेल्स डैशबोर्ड\n• सीआरएम डैशबोर्ड\n• एजेंट डैशबोर्ड",
    "कानूनी": "कानूनी\n• गोपनीयता नीति\n• नियम और शर्तें",

    // My Information responses (mapping sub-options)
    "About Us": "हमसे संपर्क करें\nचाहे आप चिकित्सा उपचार चाहने वाले रोगी हों या वित्तीय समाधान की तलाश में कोई अस्पताल, RI Medicare मदद के लिए यहाँ है।\n\nपता\nऋषिश्वर इंडस्ट्री प्राइवेट लिमिटेड\nबीएम टॉवर, जीन माता मंदिर के सामने, दौलतगंज,\nपाठांकर चौराहा, लश्कर गिर्द, ग्वालियर,\nमध्य प्रदेश, भारत - 474001\n\nईमेल\nrimgwl@rishishwarindustry.in\nफ़ोन\n+91 8989 898 989",
    "Contact Us": "हमसे संपर्क करें\nबीएम टॉवर, जीन माता मंदिर के सामने, दौलतगंज, पाठांकर चौराहा, लश्कर गिर्द, ग्वालियर, मध्य प्रदेश, भारत - 474001\n\nrimgwl@rishishwarindustry.in\n\n+91 89898 98989",
    "Healthcare Cards": "यह कैसे काम करता है\nअपना स्वास्थ्य कार्ड प्राप्त करने की एक सरल प्रक्रिया\n\n01\nअपना कार्ड चुनें\nएक ऐसा कार्ड चुनें जो आपकी आवश्यकताओं के अनुरूप हो (PayLater, EMI, या 50-50 कार्ड)।\n\n02\nआवेदन जमा करें\n\"अभी आवेदन करें\" पर क्लिक करें और एक साधारण आवेदन पत्र भरें।\n\n03\nकेवाईसी पूरा करें\nबिना किसी कागजी कार्रवाई के डिजिटल केवाईसी सत्यापन पूरा करें।\n\n04\nतत्काल अनुमोदन प्राप्त करें\nतत्काल अनुमोदन प्राप्त करें और 500+ अस्पतालों में अपने कार्ड का उपयोग शुरू करें।\n\n05\nआसान चुकौती\nअपनी योजना के आधार पर आसान ईएमआई या शून्य-लागत किस्तों में चुकौती करें।",

    // Existing specific responses (can be triggered by free text or mapped from sub-options)
    doctorConsultation: "डॉक्टर परामर्श के बारे में जानकारी।",
    labTests: "लैब टेस्ट के बारे में जानकारी।",
    emergency: "आपातकालीन सेवाओं के बारे में जानकारी।",
    medicineInfo: "फार्मेसी/दवा के बारे में जानकारी।",
    loanProcess: "ऋण प्रक्रिया के बारे में सामान्य जानकारी।",
    loanPersonalDetails: "व्यक्तिगत विवरण चरण के बारे में विवरण।",
    loanCreditCheck: "क्रेडिट चेक चरण के बारे में जानकारी।",
    loanKYCVerification: "केवाईसी सत्यापन चरण के बारे में जानकारी।",
    loanEmploymentLoanDetails: "रोजगार और ऋण विवरण के बारे में विवरण।",
    aboutUs: "हमारे बारे में सामान्य जानकारी।",
    contactUs: "सामान्य संपर्क जानकारी।",
    insurance: "बीमा के बारे में जानकारी।",
    hospital: "अस्पतालों के बारे में जानकारी।",
    help: "मैं आज आपकी कैसे सहायता कर सकता हूं? ऊपर दी गई श्रेणियों में से चुनें।",
    restart: "चैट पुनः आरंभ हो गया है। कृपया अपनी भाषा चुनें।",
    language: "कृपया अपनी पसंदीदा भाषा चुनें।",
    languageSelectionMessage: "कृपया अपनी पसंदीदा भाषा चुनें:", // Used in rendering
    goodbye: "अलविदा! आपका दिन शुभ हो।",
    thankYou: "आपका स्वागत है!",
    default: "क्षमा करें, मैं वह नहीं समझ पाया। क्या आप कृपया इसे दोबारा कह सकते हैं?",
    "हमारी सेवाएँ": "हमारी सेवाएँ\n• हेल्थकेयर फाइनेंसिंग\n• आरआई मेडिकेयर फार्मा\n• त्वरित एम्बुलेंस सेवा\n• फार्मेसी रिटेल स्टोर्स\n• आरआई मेडिकेयर पैथोलॉजी"
  }
};

export function KYCChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lastSelectedCategory, setLastSelectedCategory] = useState<string | null>(null); // New state to remember the last category
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Show language selection on initial load or restart
    if (!selectedLanguage && messages.length === 0) {
      const initialMessage: Message = {
        text: HEALTH_RESPONSES['en'].languageSelection, // Default to English for initial prompt
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  }, [selectedLanguage, messages.length]);

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang);
    setMessages([]); // Clear messages on language select
    setSelectedCategory(null); // Reset category
    // Display main options after language selection - this will be handled in the render logic
  };

  const handleCategoryClick = (categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
    setLastSelectedCategory(categoryTitle); // Remember this category
    setMessages([]); // Clear messages when selecting a category
  };

  const handleSubOptionClick = (subOption: { en: string; hi: string }) => {
    const userMessage: Message = {
      text: selectedLanguage === 'en' ? subOption.en : subOption.hi,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    // Keep selectedCategory to show sub-options until response is generated - this was the issue!

    // Find the appropriate response for the sub-option
    let botResponse = selectedLanguage ? HEALTH_RESPONSES[selectedLanguage].default : HEALTH_RESPONSES['en'].default; // Default response

    if (selectedLanguage) {
      // Attempt to find response using the English sub-option text as the key
      const responseKey = subOption.en;

      console.log('Clicked sub-option (en):', subOption.en);
      console.log('Selected language:', selectedLanguage);
      console.log('Looking for response using key:', responseKey);

      if (HEALTH_RESPONSES[selectedLanguage] && HEALTH_RESPONSES[selectedLanguage][responseKey]) {
           // Use the specific sub-option response if available
           botResponse = HEALTH_RESPONSES[selectedLanguage][responseKey];
           console.log('Found specific response:', botResponse);
       } else {
           console.log('Specific response not found, falling back to keyword matching.');
           // Fallback to existing keyword matching if needed
           const lowerSubOptionEn = subOption.en.toLowerCase();
           const lowerSubOptionHi = subOption.hi.toLowerCase();

           if (lowerSubOptionEn.includes('doctor') || lowerSubOptionEn.includes('consultation') || lowerSubOptionHi.includes('डॉक्टर') || lowerSubOptionHi.includes('परामर्श')) {
            botResponse = HEALTH_RESPONSES[selectedLanguage].doctorConsultation;
          } else if (lowerSubOptionEn.includes('lab') || lowerSubOptionEn.includes('test') || lowerSubOptionHi.includes('टेस्ट')) {
            botResponse = HEALTH_RESPONSES[selectedLanguage].labTests;
          } else if (lowerSubOptionEn.includes('emergency') || lowerSubOptionHi.includes('आपात')) {
            botResponse = HEALTH_RESPONSES[selectedLanguage].emergency;
          } else if (lowerSubOptionEn.includes('pharmacy') || lowerSubOptionEn.includes('medicine') || lowerSubOptionHi.includes('फार्मेसी') || lowerSubOptionHi.includes('दवा')) {
            botResponse = HEALTH_RESPONSES[selectedLanguage].medicineInfo;
          }
          // Financial Services
          else if (lowerSubOptionEn.includes('loan') || lowerSubOptionHi.includes('ऋण')) {
            botResponse = HEALTH_RESPONSES[selectedLanguage].loanProcess;
          } else if (lowerSubOptionEn.includes('personal') || lowerSubOptionEn.includes('details') || lowerSubOptionHi.includes('व्यक्तिगत')) {
            botResponse = HEALTH_RESPONSES[selectedLanguage].loanPersonalDetails;
          } else if (lowerSubOptionEn.includes('kyc') || lowerSubOptionEn.includes('verification') || lowerSubOptionHi.includes('सत्यापन')) {
            botResponse = HEALTH_RESPONSES[selectedLanguage].loanCreditCheck;
          } else if (lowerSubOptionEn.includes('insurance') || lowerSubOptionHi.includes('बीमा')) {
            botResponse = HEALTH_RESPONSES[selectedLanguage].insurance;
          }
          // Information
          else if (lowerSubOptionEn.includes('about') || lowerSubOptionHi.includes('बारे में')) {
            botResponse = HEALTH_RESPONSES[selectedLanguage].aboutUs;
          } else if (lowerSubOptionEn.includes('contact') || lowerSubOptionHi.includes('संपर्क')) {
            botResponse = HEALTH_RESPONSES[selectedLanguage].contactUs;
          } else if (lowerSubOptionEn === 'help' || lowerSubOptionHi === 'मदद') {
             setSelectedCategory(null);
             botResponse = HEALTH_RESPONSES[selectedLanguage].welcome;
           } else if (lowerSubOptionEn === 'restart' || lowerSubOptionEn === 'language' || lowerSubOptionHi === 'भाषा') {
             setSelectedLanguage(null);
             setMessages([]);
             setSelectedCategory(null);
             botResponse = HEALTH_RESPONSES['en'].languageSelection;
           } else {
            botResponse = HEALTH_RESPONSES[selectedLanguage].default;
          }
       }
    }

    setTimeout(() => {
      console.log('Adding bot message to state:', botResponse);
      const botMessage: Message = {
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      setSelectedCategory(null); // Reset category after message is added to show message history
      // lastSelectedCategory is already set in handleCategoryClick
    }, 1000);
  };

  const handleBackClick = () => {
    if (selectedCategory) {
      // If currently viewing sub-options, go back to main categories
      setSelectedCategory(null);
      setMessages([]); // Clear messages when going back
      setLastSelectedCategory(null); // Clear last category
    } else if (messages.length > 0 && lastSelectedCategory) {
      // If viewing messages after a sub-option click, go back to sub-options
      setSelectedCategory(lastSelectedCategory); // Go back to the sub-option list
      setMessages([]); // Clear messages
    } else if (selectedLanguage) {
      // If viewing main categories after language selection, go back to language selection
      setSelectedLanguage(null);
      setMessages([]);
      setSelectedCategory(null);
      setLastSelectedCategory(null);
    }
    // If no language is selected, there's nowhere to go back to
  };

  const handleSendMessage = async (messageText: string = input) => {
    if (!messageText.trim() || !selectedLanguage) return; // Only allow sending if language is selected

    const userMessage: Message = {
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setSelectedCategory(null); // Exit category view on manual message send

    // This part still handles free-text input based on keywords
    setTimeout(() => {
      let botResponse = selectedLanguage ? HEALTH_RESPONSES[selectedLanguage].default : HEALTH_RESPONSES['en'].default; // Default response
      const lowerMessage = messageText.toLowerCase();

       // This section handles free-text input based on keywords
       if (lowerMessage.includes('doctor') || lowerMessage.includes('consultation') || lowerMessage.includes('डॉक्टर') || lowerMessage.includes('परामर्श')) {
        botResponse = HEALTH_RESPONSES[selectedLanguage].doctorConsultation;
      } else if (lowerMessage.includes('lab') || lowerMessage.includes('test') || lowerMessage.includes('टेस्ट')) {
        botResponse = HEALTH_RESPONSES[selectedLanguage].labTests;
      } else if (lowerMessage.includes('emergency') || lowerMessage.includes('आपात')) {
        botResponse = HEALTH_RESPONSES[selectedLanguage].emergency;
      } else if (lowerMessage.includes('pharmacy') || lowerMessage.includes('medicine') || lowerSubOptionHi.includes('फार्मेसी') || lowerSubOptionHi.includes('दवा')) {
        botResponse = HEALTH_RESPONSES[selectedLanguage].medicineInfo;
      }
      // Financial Services
      else if (lowerSubOptionEn.includes('loan') || lowerSubOptionHi.includes('ऋण')) {
        botResponse = HEALTH_RESPONSES[selectedLanguage].loanProcess;
      } else if (lowerSubOptionEn.includes('personal') || lowerSubOptionEn.includes('details') || lowerSubOptionHi.includes('व्यक्तिगत')) {
        botResponse = HEALTH_RESPONSES[selectedLanguage].loanPersonalDetails;
      } else if (lowerSubOptionEn.includes('kyc') || lowerSubOptionEn.includes('verification') || lowerSubOptionHi.includes('सत्यापन')) {
        botResponse = HEALTH_RESPONSES[selectedLanguage].loanCreditCheck;
      } else if (lowerSubOptionEn.includes('insurance') || lowerSubOptionHi.includes('बीमा')) {
        botResponse = HEALTH_RESPONSES[selectedLanguage].insurance;
      }
      // Information
      else if (lowerSubOptionEn.includes('about') || lowerSubOptionHi.includes('बारे में')) {
        botResponse = HEALTH_RESPONSES[selectedLanguage].aboutUs;
      } else if (lowerSubOptionEn.includes('contact') || lowerSubOptionHi.includes('संपर्क')) {
        botResponse = HEALTH_RESPONSES[selectedLanguage].contactUs;
      } else if (lowerSubOptionEn === 'help' || lowerSubOptionHi === 'मदद') {
        // If user types 'help', show main categories again
        setSelectedCategory(null); // This will trigger rendering of main categories
        botResponse = HEALTH_RESPONSES[selectedLanguage].welcome; // Provide the welcome message text
      } else if (lowerSubOptionEn === 'restart' || lowerSubOptionHi === 'भाषा') {
        setSelectedLanguage(null); // Go back to language selection
        setMessages([]); // Clear messages
        setSelectedCategory(null); // Reset category
        botResponse = HEALTH_RESPONSES['en'].languageSelection; // Show language selection message
      }
      // If none of the above, use the default response already set

      const botMessage: Message = {
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleRefresh = () => {
    setMessages([]);
    setSelectedLanguage(null);
    setInput('');
    setSelectedCategory(null); // Reset category on refresh
    setLastSelectedCategory(null); // Reset last category on refresh
    // The useEffect will show the initial language selection message
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-orange-400 text-white shadow-lg hover:bg-orange-500"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[600px] flex flex-col bg-gradient-to-br from-orange-50/80 via-orange-100/80 to-orange-200/80 shadow-2xl rounded-lg transition-all duration-300 border border-orange-200">
      <div className="p-4 bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded-t-lg flex justify-between items-center shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-xl">
                  <span className="text-white text-lg font-bold">An</span>
                </div>
                <h3 className="font-semibold text-lg">Anany<span className="text-red-500 text-xl ml-0.5">+</span></h3>
              </div>
            </div>
            <p className="text-xs text-white/80 ml-12">
              {selectedLanguage ? (selectedLanguage === 'en' ? 'English' : 'हिंदी') : 'Select Language'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {(selectedLanguage || messages.length > 0) && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={handleBackClick}
              title={selectedLanguage === 'en' ? "Back" : "वापस जाएँ"}
            >
              <ArrowLeft size={20} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={handleRefresh}
            title={selectedLanguage === 'en' ? "Refresh Chat" : "चैट रीफ्रेश करें"}
          >
            <RefreshCw size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 size={20} />
          </Button>
        </div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 bg-gradient-to-b from-orange-50/80 via-orange-100/80 to-orange-200/80">
        <div className="space-y-4">
          {!selectedLanguage ? (
            // Language Selection View
            <div className="text-center text-gray-700 py-4">
              <p className="text-lg font-semibold mb-4">{HEALTH_RESPONSES['en'].languageSelection.split('\\n')[0]}</p>
               {/* Display full language selection message for clarity */}
              <div className="whitespace-pre-wrap text-sm text-gray-600 mb-4">{HEALTH_RESPONSES['en'].languageSelection.split('\\n').slice(1).join('\\n')}</div>
              <div className="flex justify-center gap-4">
                <Button onClick={() => handleLanguageSelect('en')} className="bg-orange-400 hover:bg-orange-500 text-white">English</Button>
                <Button onClick={() => handleLanguageSelect('hi')} className="bg-orange-400 hover:bg-orange-500 text-white">हिंदी (Hindi)</Button>
              </div>
            </div>
          ) : selectedCategory ? (
            // Sub-options View
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-orange-600 hover:bg-orange-100"
                  onClick={handleBackClick}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {selectedLanguage === 'en' ? 'Back' : 'वापस जाएँ'}
                </Button>
                <h3 className="font-semibold text-orange-600">
                  {selectedLanguage === 'en'
                    ? mainOptions.find(opt => opt.title === selectedCategory)?.title
                    : mainOptions.find(opt => opt.title === selectedCategory)?.title_hi}
                </h3>
              </div>
              <div className="grid gap-2">
                {mainOptions.find(opt => opt.title === selectedCategory)?.subOptions.map((subOption, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start p-3 bg-white hover:bg-orange-50 border-orange-200 text-orange-600"
                    onClick={() => handleSubOptionClick(subOption)}
                  >
                    {selectedLanguage === 'en' ? subOption.en : subOption.hi}
                  </Button>
                ))}
              </div>
            </div>
          ) : messages.length === 0 ? (
             // Main Categories View after Language Selection and no messages yet
             <div className="space-y-4">
               <div className="text-center text-gray-500 py-4">
                 <MessageCircle className="h-12 w-12 mx-auto mb-2 text-orange-300" />
                 {/* Display welcome message before categories, respecting newlines */}
                 {HEALTH_RESPONSES[selectedLanguage]?.welcome.split('\\n').map((line: string, index: number) => (
                    <p key={index} className={index === 0 ? "text-lg font-semibold mb-2" : "text-sm text-gray-600"}>
                      {line}
                    </p>
                  ))}
               </div>
              <div className="grid gap-3">
                {mainOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start p-4 h-auto bg-white hover:bg-orange-50 border-orange-200"
                    onClick={() => handleCategoryClick(option.title)}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-orange-600">
                        {selectedLanguage === 'en' ? option.title : option.title_hi}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {selectedLanguage === 'en' ? option.description : option.description_hi}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            // Message History View (if there are messages and not in category/language view)
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-tr-none shadow-lg'
                        : 'bg-white/90 backdrop-blur-sm text-gray-800 rounded-tl-none shadow-lg border border-orange-100'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.text}</div>
                    <div className={`text-xs mt-1 ${message.isUser ? 'text-white/70' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl rounded-tl-none shadow-lg border border-orange-100">
                    <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedLanguage ? (selectedLanguage === 'en' ? "Type your message..." : "अपना संदेश टाइप करें...") : "Select language first"}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
            disabled={true} // Disable the input field completely as requested
          />
          <Button
            onClick={() => handleSendMessage()}
            size="icon"
            className="shrink-0 bg-orange-400 hover:bg-orange-500"
            disabled={true} // Disable the input field completely as requested
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
} 