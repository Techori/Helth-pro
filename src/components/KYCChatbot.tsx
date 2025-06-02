import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Minimize2, MessageCircle, RefreshCw } from "lucide-react";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

type Language = 'en' | 'hi';

const HEALTH_RESPONSES = {
  en: {
    languageSelection: "👋 Hello! Welcome to Rimedicare!\n\nPlease select your preferred language:\n1. English\n2. हिंदी (Hindi)\n\nType '1' for English or '2' for Hindi",
    welcome: "Welcome to Rimedicare! 👋\n\nI can help you with the following:\nLoan Process\nPersonal Details\nKYC Verification\nAbout Us\nContact Us\n\nWhat would you like to know about?",
    healthInfo: "Here's what you need to know about health:\n\n- Regular check-ups are important\n- Maintain a balanced diet\n- Exercise regularly\n- Get adequate sleep\n- Stay hydrated\n\nWould you like specific information about any of these?",
    medicineInfo: "I can provide information about:\n- Prescription medicines\n- Over-the-counter drugs\n- Medicine side effects\n- Dosage information\n- Medicine interactions\n\nWhat specific medicine information do you need?",
    doctorConsultation: "For doctor consultations:\n- Book appointments online\n- Video consultations available\n- Specialist doctors available\n- Emergency consultations\n- Follow-up appointments\n\nWould you like to know more about any of these?",
    labTests: "Our lab services include:\n- Blood tests\n- Urine tests\n- X-rays\n- MRI scans\n- Specialized tests\n\nWhich test information do you need?",
    emergency: "For emergencies:\n- 24/7 ambulance service\n- Emergency helpline\n- First aid information\n- Emergency room locations\n- Critical care services\n\nWhat emergency information do you need?",
    insurance: "Insurance information:\n- Health insurance plans\n- Claim process\n- Coverage details\n- Premium information\n- Network hospitals\n\nWhat would you like to know about insurance?",
    hospital: "Our hospital services:\n- Multi-specialty care\n- 24/7 emergency care\n- Modern facilities\n- Expert doctors\n- Patient support\n\nWhat hospital information do you need?",
    help: "I'm here to help! You can:\n- Type 'restart' to begin again\n- Type 'help' for assistance\n- Type 'language' to change language\n- Ask about any health-related topic",
    aboutUs: {
      en: "Our Company\nRI Medicare is a product of Rishishwar Industry Private Limited and operates under its leadership. We're dedicated to making medical treatments more accessible and affordable for everyone.\n\nMr. Harsh Raj Sharma\nManaging Director\nRishishwar Industry Private Limited\n\nMr. Dinesh Kumar Sharma\nAuthorized Director\nRishishwar Industry Private Limited",
      hi: "हमारी कंपनी\nआरआई मेडिकेयर, ऋषिश्वर इंडस्ट्री प्राइवेट लिमिटेड का एक उत्पाद है और इसके नेतृत्व में काम करता है। हम चिकित्सा उपचारों को सभी के लिए अधिक सुलभ और किफायती बनाने के लिए समर्पित हैं।\n\nश्री हर्ष राज शर्मा\nप्रबंध निदेशक\nऋषिश्वर इंडस्ट्री प्राइवेट लिमिटेड\n\nश्री दिनेश कुमार शर्मा\nअधिकृत निदेशक\nऋषिश्वर इंडस्ट्री प्राइवेट लिमिटेड"
    },
    loanProcess: {
      en: "Our Simple Loan Process:\n1. Personal Details\n2. Credit Check\n3. KYC Verification\n4. Account Analysis\n5. Loan Offers\n6. Sign & Complete\n7. Wallet Activation",
      hi: "हमारी सरल ऋण प्रक्रिया:\n1. व्यक्तिगत विवरण\n2. क्रेडिट जाँच\n3. केवाईसी सत्यापन\n4. खाता विश्लेषण\n5. ऋण प्रस्ताव\n6. साइन और पूरा करें\n7. वॉलेट सक्रियण"
    },
    loanPersonalDetails: {
      en: "Personal Details:\nFull Name\nEnter your full name\nEmail Address\nEnter your email\nPhone Number\nEnter your phone number\nDate of Birth\ndd-mm-yyyy\nAddress",
      hi: "व्यक्तिगत विवरण:\nपूरा नाम\nअपना पूरा नाम दर्ज करें\nईमेल पता\nअपना ईमेल दर्ज करें\nफ़ोन नंबर\nअपना फ़ोन नंबर दर्ज करें\nजन्म तिथि\nदिनांक-माह-वर्ष\nपता"
    },
    loanCreditCheck: {
      en: "Credit Bureau Check:\nCredit Score\nPayment History\nOutstanding Loans\nRepayment Capacity",
      hi: "क्रेडिट ब्यूरो जाँच:\nक्रेडिट स्कोर\nभुगतान इतिहास\nबकाया ऋण\nचुकौती क्षमता"
    },
    loanKYCVerification: {
      en: "KYC Verification:\nIdentity Verification\nAddress Verification\nDocument Authenticity\nFraud Check",
      hi: "केवाईसी सत्यापन:\nपहचान सत्यापन\nपता सत्यापन\nदस्तावेज़ प्रामाणिकता\nधोखाधड़ी की जाँच"
    },
    loanEmploymentLoanDetails: {
      en: "Employment & Loan Details:\n\nEmployment Details:\nEmployment Type\nSelf-Employed\nCompany Name\nEnter company name\nMonthly Income (₹)\nEnter your monthly income\n\nLoan Details:\nHospital Name\nSelect a partner hospital\nLoan Amount Required (₹)\nEnter loan amount\nPreferred Repayment Tenure",
      hi: "रोजगार और ऋण विवरण:\n\nरोजगार विवरण:\nरोजगार का प्रकार\nस्व-नियोजित\nकंपनी का नाम\nकंपनी का नाम दर्ज करें\nमासिक आय (₹)\nअपनी मासिक आय दर्ज करें\n\nऋण विवरण:\nअस्पताल का नाम\nएक भागीदार अस्पताल चुनें\nआवश्यक ऋण राशि (₹)\nऋण राशि दर्ज करें\nपसंदीदा चुकौती अवधि"
    },
    contactUs: {
      en: "Contact Us:\nBM Tower, Infront of Jeen Mata Mandir, Daulatganj, Pathankar Chourah, Lashkar Gird, Gwalior, Madhya Pradesh, Bharat - 474001\nrimgwl@rishishwarindustry.in\n+91 89898 98989",
      hi: "हमसे संपर्क करें:\nबीएम टावर, जीन माता मंदिर के सामने, दौलतगंज, पठानकर चौराहा, लश्कर गिर्द, ग्वालियर, मध्य प्रदेश, भारत - 474001\nrimgwl@rishishwarindustry.in\n+91 89898 98989"
    }
  },
  hi: {
    languageSelection: "👋 नमस्ते! Rimedicare में आपका स्वागत है!\n\nकृपया अपनी पसंदीदा भाषा चुनें:\n1. English\n2. हिंदी (Hindi)\n\nअंग्रेजी के लिए '1' या हिंदी के लिए '2' टाइप करें",
    welcome: "Rimedicare में आपका स्वागत है! \n\nमैं निम्नलिखित में आपकी मदद कर सकता हूं:\nऋण प्रक्रिया\nव्यक्तिगत विवरण\nकेवाईसी सत्यापन\nहमारे बारे में\nहमसे संपर्क करें\n\nआप क्या जानना चाहेंगे?",
    healthInfo: "स्वास्थ्य के बारे में जानकारी:\n\n- नियमित जांच महत्वपूर्ण है\n- संतुलित आहार लें\n- Exercise regularly\n- Get adequate sleep\n- Stay hydrated\n\nक्या आप इनमें से किसी विशेष जानकारी के बारे में जानना चाहेंगे?",
    medicineInfo: "मैं निम्नलिखित दवाओं के बारे में जानकारी प्रदान कर सकता हूं:\n- प्रिस्क्रिप्शन दवाएं\n- ओवर-द-काउंटर दवाएं\n- दवा के दुष्प्रभाव\n- खुराक की जानकारी\n- दवा इंटरैक्शन\n\nआपको किस विशेष दवा की जानकारी चाहिए?",
    doctorConsultation: "डॉक्टर परामर्श के लिए:\n- ऑनलाइन अपॉइंटमेंट बुक करें\n- वीडियो परामर्श उपलब्ध\n- विशेषज्ञ डॉक्टर उपलब्ध\n- आपातकालीन परामर्श\n- फॉलो-अप अपॉइंटमेंट\n\nक्या आप इनमें से किसी के बारे में अधिक जानना चाहेंगे?",
    labTests: "हमारी लैब सेवाएं:\n- ब्लड टेस्ट\n- यूरिन टेस्ट\n- एक्स-रे\n- एमआरआई स्कैन\n- विशेष परीक्षण\n\nआपको किस टेस्ट की जानकारी चाहिए?",
    emergency: "आपातकालीन सेवाओं के लिए:\n- 24/7 एम्बुलेंस सेवा\n- आपातकालीन हेल्पलाइन\n- प्राथमिक चिकित्सा जानकारी\n- आपातकालीन कक्ष स्थान\n- गंभीर देखभाल सेवाएं\n\nआपको किस आपातकालीन जानकारी की आवश्यकता है?",
    insurance: "बीमा जानकारी:\n- स्वास्थ्य बीमा योजनाएं\n- क्लेम प्रक्रिया\n- कवरेज विवरण\n- प्रीमियम जानकारी\n- नेटवर्क अस्पताल\n\nआप बीमा के बारे में क्या जानना चाहेंगे?",
    hospital: "हमारी अस्पताल सेवाएं:\n- बहु-विशेषज्ञ देखभाल\n- 24/7 आपातकालीन देखभाल\n- आधुनिक सुविधाएं\n- विशेषज्ञ डॉक्टर\n- रोगी सहायता\n\nआपको किस अस्पताल जानकारी की आवश्यकता है?",
    help: "मैं मदद के लिए यहां हूं! आप:\n- फिर से शुरू करने के लिए 'restart' टाइप कर सकते हैं\n- सहायता के लिए 'help' टाइप कर सकते हैं\n- भाषा बदलने के लिए 'language' टाइप कर सकते हैं\n- किसी भी स्वास्थ्य संबंधित विषय के बारे में पूछ सकते हैं",
    aboutUs: {
      en: "Our Company\nRI Medicare is a product of Rishishwar Industry Private Limited and operates under its leadership. We're dedicated to making medical treatments more accessible and affordable for everyone.\n\nMr. Harsh Raj Sharma\nManaging Director\nRishishwar Industry Private Limited\n\nMr. Dinesh Kumar Sharma\nAuthorized Director\nRishishwar Industry Private Limited",
      hi: "हमारी कंपनी\nआरआई मेडिकेयर, ऋषिश्वर इंडस्ट्री प्राइवेट लिमिटेड का एक उत्पाद है और इसके नेतृत्व में काम करता है। हम चिकित्सा उपचारों को सभी के लिए अधिक सुलभ और किफायती बनाने के लिए समर्पित हैं।\n\nश्री हर्ष राज शर्मा\nप्रबंध निदेशक\nऋषिश्वर इंडस्ट्री प्राइवेट लिमिटेड\n\nश्री दिनेश कुमार शर्मा\nअधिकृत निदेशक\nऋषिश्वर इंडस्ट्री प्राइवेट लिमिटेड"
    },
    loanProcess: {
      en: "Our Simple Loan Process:\n1. Personal Details\n2. Credit Check\n3. KYC Verification\n4. Account Analysis\n5. Loan Offers\n6. Sign & Complete\n7. Wallet Activation",
      hi: "हमारी सरल ऋण प्रक्रिया:\n1. व्यक्तिगत विवरण\n2. क्रेडिट जाँच\n3. केवाईसी सत्यापन\n4. खाता विश्लेषण\n5. ऋण प्रस्ताव\n6. साइन और पूरा करें\n7. वॉलेट सक्रियण"
    },
    loanPersonalDetails: {
      en: "Personal Details:\nFull Name\nEnter your full name\nEmail Address\nEnter your email\nPhone Number\nEnter your phone number\nDate of Birth\ndd-mm-yyyy\nAddress",
      hi: "व्यक्तिगत विवरण:\nपूरा नाम\nअपना पूरा नाम दर्ज करें\nईमेल पता\nअपना ईमेल दर्ज करें\nफ़ोन नंबर\nअपना फ़ोन नंबर दर्ज करें\nजन्म तिथि\nदिनांक-माह-वर्ष\nपता"
    },
    loanCreditCheck: {
      en: "Credit Bureau Check:\nCredit Score\nPayment History\nOutstanding Loans\nRepayment Capacity",
      hi: "क्रेडिट ब्यूरो जाँच:\nक्रेडिट स्कोर\nभुगतान इतिहास\nबकाया ऋण\nचुकौती क्षमता"
    },
    loanKYCVerification: {
      en: "KYC Verification:\nIdentity Verification\nAddress Verification\nDocument Authenticity\nFraud Check",
      hi: "केवाईसी सत्यापन:\nपहचान सत्यापन\nपता सत्यापन\nदस्तावेज़ प्रामाणिकता\nधोखाधड़ी की जाँच"
    },
    loanEmploymentLoanDetails: {
      en: "Employment & Loan Details:\n\nEmployment Details:\nEmployment Type\nSelf-Employed\nCompany Name\nEnter company name\nMonthly Income (₹)\nEnter your monthly income\n\nLoan Details:\nHospital Name\nSelect a partner hospital\nLoan Amount Required (₹)\nEnter loan amount\nPreferred Repayment Tenure",
      hi: "रोजगार और ऋण विवरण:\n\nरोजगार विवरण:\nरोजगार का प्रकार\nस्व-नियोजित\nकंपनी का नाम\nकंपनी का नाम दर्ज करें\nमासिक आय (₹)\nअपनी मासिक आय दर्ज करें\n\nऋण विवरण:\nअस्पताल का नाम\nएक भागीदार अस्पताल चुनें\nआवश्यक ऋण राशि (₹)\nऋण राशि दर्ज करें\nपसंदीदा चुकौती अवधि"
    },
    contactUs: {
      en: "Contact Us:\nBM Tower, Infront of Jeen Mata Mandir, Daulatganj, Pathankar Chourah, Lashkar Gird, Gwalior, Madhya Pradesh, Bharat - 474001\nrimgwl@rishishwarindustry.in\n+91 89898 98989",
      hi: "हमसे संपर्क करें:\nबीएम टावर, जीन माता मंदिर के सामने, दौलतगंज, पठानकर चौराहा, लश्कर गिर्द, ग्वालियर, मध्य प्रदेश, भारत - 474001\nrimgwl@rishishwarindustry.in\n+91 89898 98989"
    }
  }
};

export function KYCChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMinimized && messages.length === 0) {
      const initialMessage: Message = {
        text: HEALTH_RESPONSES['en'].languageSelection,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  }, [isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText: string = input) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      const lowerMessage = messageText.toLowerCase();
      
      if (!selectedLanguage) {
        if (messageText === '1' || messageText === '2') {
          const newLanguage = messageText === '1' ? 'en' : 'hi';
          setSelectedLanguage(newLanguage);
          botResponse = HEALTH_RESPONSES[newLanguage].welcome;
        } else {
          botResponse = HEALTH_RESPONSES['en'].languageSelection;
        }
      } else {
        if (lowerMessage.includes('loan process') || lowerMessage.includes('ऋण प्रक्रिया')) {
          botResponse = HEALTH_RESPONSES[selectedLanguage].loanProcess[selectedLanguage];
        } else if (lowerMessage.includes('personal details') || lowerMessage.includes('personal detail') || lowerMessage.includes('व्यक्तिगत विवरण') || lowerMessage.includes('चरण 1')) {
          botResponse = HEALTH_RESPONSES[selectedLanguage].loanPersonalDetails[selectedLanguage];
        } else if (lowerMessage.includes('credit check') || lowerMessage.includes('step 2') || lowerMessage.includes('क्रेडिट जाँच') || lowerMessage.includes('चरण 2')) {
          botResponse = HEALTH_RESPONSES[selectedLanguage].loanCreditCheck[selectedLanguage];
        } else if (lowerMessage.includes('kyc verification') || lowerMessage.includes('step 3') || lowerMessage.includes('केवाईसी सत्यापन') || lowerMessage.includes('चरण 3') || lowerMessage.includes('kyc')) {
          botResponse = HEALTH_RESPONSES[selectedLanguage].loanKYCVerification[selectedLanguage];
        } else if (lowerMessage.includes('employment loan details') || lowerMessage.includes('employment details') || lowerMessage.includes('loan details') || lowerMessage.includes('step 4') || lowerMessage.includes('रोजगार और ऋण विवरण') || lowerMessage.includes('रोजगार विवरण') || lowerMessage.includes('ऋण विवरण') || lowerMessage.includes('चरण 4')) {
          botResponse = HEALTH_RESPONSES[selectedLanguage].loanEmploymentLoanDetails[selectedLanguage];
        } else if (lowerMessage.includes('about us') || lowerMessage.includes('our company') || lowerMessage.includes('who are you') || lowerMessage.includes('company info') || lowerMessage.includes('हमारे बारे में') || lowerMessage.includes('हमारी कंपनी')) {
          botResponse = HEALTH_RESPONSES[selectedLanguage].aboutUs[selectedLanguage];
        } else if (lowerMessage.includes('contact us') || lowerMessage.includes('contact') || lowerMessage.includes('address') || lowerMessage.includes('email') || lowerMessage.includes('phone') || lowerMessage.includes('get in touch') || lowerMessage.includes('हमसे संपर्क करें') || lowerMessage.includes('संपर्क') || lowerMessage.includes('पता') || lowerMessage.includes('ईमेल') || lowerMessage.includes('फ़ोन')) {
          botResponse = HEALTH_RESPONSES[selectedLanguage].contactUs[selectedLanguage];
        } else if (lowerMessage.includes('health') || lowerMessage.includes('swasthya') || lowerMessage.includes('स्वास्थ्य')) {
          botResponse = HEALTH_RESPONSES[selectedLanguage].healthInfo;
        } else if (lowerMessage.includes('medicine') || lowerMessage.includes('dawa') || lowerMessage.includes('दवा')) {
          botResponse = HEALTH_RESPONSES[selectedLanguage].medicineInfo;
        } else if (lowerMessage.includes('doctor') || lowerMessage.includes('daktar') || lowerMessage.includes('डॉक्टर')) {
          botResponse = HEALTH_RESPONSES[selectedLanguage].doctorConsultation;
        } else if (lowerMessage.includes('test') || lowerMessage.includes('lab') || lowerMessage.includes('टेस्ट')) {
          botResponse = HEALTH_RESPONSES[selectedLanguage].labTests;
        } else if (lowerMessage.includes('emergency') || lowerMessage.includes('aapat') || lowerMessage.includes('आपात')) {
          botResponse = HEALTH_RESPONSES[selectedLanguage].emergency;
        } else if (lowerMessage.includes('insurance') || lowerMessage.includes('bima') || lowerMessage.includes('बीमा')) {
          botResponse = HEALTH_RESPONSES[selectedLanguage].insurance;
        } else if (lowerMessage.includes('hospital') || lowerMessage.includes('asptal') || lowerMessage.includes('अस्पताल')) {
          botResponse = HEALTH_RESPONSES[selectedLanguage].hospital;
        } else if (lowerMessage === 'help' || lowerMessage === 'मदद') {
          botResponse = HEALTH_RESPONSES[selectedLanguage].help;
        } else if (lowerMessage === 'restart' || lowerMessage === 'language' || lowerMessage === 'भाषा') {
          setSelectedLanguage(null);
          botResponse = HEALTH_RESPONSES['en'].languageSelection;
        } else {
          botResponse = HEALTH_RESPONSES[selectedLanguage].welcome;
        }
      }

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
    // Add initial language selection message
    const initialMessage: Message = {
      text: HEALTH_RESPONSES['en'].languageSelection,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
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
    <Card className="fixed bottom-4 right-4 w-96 h-[600px] flex flex-col bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 shadow-2xl rounded-lg transition-all duration-300 border border-orange-200">
      <div className="p-4 bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded-t-lg flex justify-between items-center shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-xl animate-spin">
                  <span className="text-white text-lg font-bold">Ri</span>
                </div>
                <h3 className="font-semibold text-lg">Medic care<span className="text-red-500 text-xl ml-0.5">+</span></h3>
              </div>
            </div>
            <p className="text-xs text-white/80 ml-12">
              {selectedLanguage ? (selectedLanguage === 'en' ? 'English' : 'हिंदी') : 'Select Language'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={handleRefresh}
            title="Refresh Chat"
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

      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-orange-50/80 via-orange-100/80 to-orange-200/80">
        <div className="space-y-4">
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
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-orange-200 bg-gradient-to-r from-orange-50/90 via-orange-100/90 to-orange-200/90 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedLanguage ? 
              (selectedLanguage === 'en' ? "Type your message..." : "अपना संदेश टाइप करें...") : 
              "Select language (1 for English, 2 for Hindi)"}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-white/90 backdrop-blur-sm border-orange-200 focus:border-orange-300 shadow-sm"
          />
          <Button 
            onClick={() => handleSendMessage()}
            size="icon"
            className="shrink-0 bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-lg"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </Card>
  );
} 