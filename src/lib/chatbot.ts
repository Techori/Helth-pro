export interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface HealthResponse {
  keywords: string[];
  response: {
    en: string;
    hi: string;
  };
}

export type Language = 'en' | 'hi';

// Track if language has been selected
let isLanguageSelected = false;
let selectedLanguage: Language = 'en';

export const healthResponses: HealthResponse[] = [
  // Language Selection
  {
    keywords: ['language', 'भाषा', 'lang', 'select language', 'भाषा चुनें'],
    response: {
      en: "Please select your preferred language:\n1. English\n2. हिंदी (Hindi)\n\nType '1' for English or '2' for Hindi",
      hi: "कृपया अपनी पसंदीदा भाषा चुनें:\n1. English\n2. हिंदी (Hindi)\n\nअंग्रेजी के लिए '1' या हिंदी के लिए '2' टाइप करें"
    }
  },
  // Greetings
  {
    keywords: ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'नमस्ते', 'नमस्कार', 'हैलो'],
    response: {
      en: "Hello! I'm Rimedicare. How can I help you today? You can ask me about appointments, emergency services, pharmacy, insurance, doctor consultations, or lab tests.",
      hi: "नमस्ते! मैं Rimedicare हूं। मैं आपकी कैसे मदद कर सकती हूं? आप मुझसे अपॉइंटमेंट, इमरजेंसी सर्विसेज, फार्मेसी, इंश्योरेंस, डॉक्टर कंसल्टेशन, या लैब टेस्ट के बारे में पूछ सकते हैं।"
    }
  },
  {
    keywords: ['how are you', 'how r u', 'how do you do', 'कैसे हो', 'कैसा चल रहा है', 'कैसे हैं आप'],
    response: {
      en: "I'm doing well, thank you for asking! I'm Rimedicare, here to help you with your health-related queries. What would you like to know about?",
      hi: "मैं ठीक हूं, पूछने के लिए धन्यवाद! मैं Rimedicare हूं, आपकी स्वास्थ्य संबंधित जानकारी में मदद करने के लिए यहां हूं। आप क्या जानना चाहेंगे?"
    }
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'thank you', 'thanks', 'अलविदा', 'धन्यवाद', 'शुक्रिया', 'फिर मिलेंगे'],
    response: {
      en: "Thank you for chatting! If you have any more health-related questions, feel free to ask. Take care!",
      hi: "बातचीत के लिए धन्यवाद! अगर आपके कोई और स्वास्थ्य संबंधित प्रश्न हैं, तो बेझिझक पूछें। अपना ख्याल रखें!"
    }
  },
  // Health Services
  {
    keywords: ['appointment', 'book', 'schedule', 'अपॉइंटमेंट', 'बुक', 'शेड्यूल', 'डॉक्टर से मिलना'],
    response: {
      en: "To book an appointment, please visit our appointment booking page or contact our support team at support@healthpro.com",
      hi: "अपॉइंटमेंट बुक करने के लिए, कृपया हमारे अपॉइंटमेंट बुकिंग पेज पर जाएं या हमारी सपोर्ट टीम से संपर्क करें support@healthpro.com पर"
    }
  },
  {
    keywords: ['ambulance', 'emergency', 'urgent', 'एम्बुलेंस', 'इमरजेंसी', 'जरूरी', 'तत्काल'],
    response: {
      en: "For emergency services, please call our 24/7 ambulance service at 1800-HEALTH. Our ambulances are equipped with modern medical facilities.",
      hi: "इमरजेंसी सर्विसेज के लिए, कृपया हमारी 24/7 एम्बुलेंस सर्विस को 1800-HEALTH पर कॉल करें। हमारी एम्बुलेंस आधुनिक चिकित्सा सुविधाओं से लैस हैं।"
    }
  },
  {
    keywords: ['pharmacy', 'medicine', 'drug', 'prescription', 'फार्मेसी', 'दवाई', 'दवा', 'प्रिस्क्रिप्शन'],
    response: {
      en: "You can order medicines from our online pharmacy. We offer both prescription and over-the-counter medications with home delivery.",
      hi: "आप हमारी ऑनलाइन फार्मेसी से दवाएं ऑर्डर कर सकते हैं। हम प्रिस्क्रिप्शन और ओवर-द-काउंटर दवाएं होम डिलीवरी के साथ प्रदान करते हैं।"
    }
  },
  {
    keywords: ['insurance', 'claim', 'coverage', 'इंश्योरेंस', 'क्लेम', 'कवरेज', 'बीमा'],
    response: {
      en: "We offer various health insurance plans. You can check your coverage or file a claim through your dashboard or contact our insurance department.",
      hi: "हम विभिन्न स्वास्थ्य बीमा योजनाएं प्रदान करते हैं। आप अपने डैशबोर्ड के माध्यम से अपना कवरेज चेक कर सकते हैं या क्लेम दाखिल कर सकते हैं या हमारे बीमा विभाग से संपर्क कर सकते हैं।"
    }
  },
  {
    keywords: ['doctor', 'specialist', 'consultation', 'डॉक्टर', 'स्पेशलिस्ट', 'कंसल्टेशन', 'चिकित्सक'],
    response: {
      en: "We have a wide network of qualified doctors and specialists. You can book an online consultation or visit our partner hospitals.",
      hi: "हमारे पास योग्य डॉक्टरों और विशेषज्ञों का व्यापक नेटवर्क है। आप ऑनलाइन कंसल्टेशन बुक कर सकते हैं या हमारे पार्टनर अस्पतालों में जा सकते हैं।"
    }
  },
  {
    keywords: ['test', 'lab', 'pathology', 'report', 'टेस्ट', 'लैब', 'पैथोलॉजी', 'रिपोर्ट'],
    response: {
      en: "Our pathology labs offer a wide range of diagnostic tests. You can book tests online and receive digital reports within 24 hours.",
      hi: "हमारी पैथोलॉजी लैब्स नैदानिक परीक्षणों की एक विस्तृत श्रृंखला प्रदान करती हैं। आप ऑनलाइन टेस्ट बुक कर सकते हैं और 24 घंटों के भीतर डिजिटल रिपोर्ट प्राप्त कर सकते हैं।"
    }
  },
  {
    keywords: ['kyc', 'verification', 'kyc kaise karein', 'kyc process', 'kyc steps', 'kyc kaise karna hai', 'kyc kaise kare', 'kyc kaise hota hai', 'केवाईसी', 'सत्यापन', 'केवाईसी कैसे करें'],
    response: {
      en: "For KYC verification, you will need the following documents:\n\n1. Aadhaar Card or PAN Card (any one)\n2. Recent passport-size photograph\n\nOnce you have these documents ready, you can proceed with the KYC process through our app or website. The verification typically takes 24-48 hours after submission.",
      hi: "केवाईसी सत्यापन के लिए आपको निम्नलिखित दस्तावेजों की आवश्यकता होगी:\n\n1. आधार कार्ड या पैन कार्ड (कोई भी एक)\n2. हाल का पासपोर्ट साइज फोटो\n\nजब आपके पास ये दस्तावेज तैयार हों, तो आप हमारे ऐप या वेबसाइट के माध्यम से केवाईसी प्रक्रिया शुरू कर सकते हैं। सत्यापन आमतौर पर जमा करने के 24-48 घंटों के भीतर पूरा हो जाता है।"
    }
  }
];

export const getHealthResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  // If language hasn't been selected yet, show language selection prompt
  if (!isLanguageSelected) {
    if (lowerMessage === '1' || lowerMessage === '2') {
      selectedLanguage = lowerMessage === '1' ? 'en' : 'hi';
      isLanguageSelected = true;
      return selectedLanguage === 'en' 
        ? "Language set to English. How can I help you today?"
        : "भाषा हिंदी में सेट कर दी गई है। मैं आपकी कैसे मदद कर सकती हूं?";
    }
    return healthResponses[0].response.en; // Show language selection prompt
  }
  
  // Handle language change request
  if (lowerMessage === 'language' || lowerMessage === 'भाषा') {
    isLanguageSelected = false;
    return healthResponses[0].response[selectedLanguage];
  }
  
  // Check for exact matches first
  for (const response of healthResponses) {
    if (response.keywords.some(keyword => lowerMessage === keyword)) {
      return response.response[selectedLanguage];
    }
  }
  
  // Then check for partial matches
  for (const response of healthResponses) {
    if (response.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return response.response[selectedLanguage];
    }
  }
  
  // Default response based on selected language
  const defaultResponses = {
    en: "I'm Rimedicare. I can help you with appointments, emergency services, pharmacy, insurance, doctor consultations, and lab tests. How can I assist you today?",
    hi: "मैं Rimedicare हूं। मैं आपकी अपॉइंटमेंट, इमरजेंसी सर्विसेज, फार्मेसी, इंश्योरेंस, डॉक्टर कंसल्टेशन, और लैब टेस्ट में मदद कर सकती हूं। मैं आपकी कैसे सहायता कर सकती हूं?"
  };
  
  return defaultResponses[selectedLanguage];
}; 