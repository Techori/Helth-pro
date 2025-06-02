export interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface HealthResponse {
  keywords: string[];
  response: string;
}

export const healthResponses: HealthResponse[] = [
  // Greetings
  {
    keywords: ['hi', 'hello', 'hey', 'namaste', 'namaskar'],
    response: "Hello! I'm your health assistant. How can I help you today? You can ask me about appointments, emergency services, pharmacy, insurance, doctor consultations, or lab tests."
  },
  {
    keywords: ['how are you', 'how r u', 'how do you do'],
    response: "I'm doing well, thank you for asking! I'm here to help you with your health-related queries. What would you like to know about?"
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'thank you', 'thanks'],
    response: "Thank you for chatting! If you have any more health-related questions, feel free to ask. Take care!"
  },
  // Health Services
  {
    keywords: ['appointment', 'book', 'schedule'],
    response: "To book an appointment, please visit our appointment booking page or contact our support team at support@healthpro.com"
  },
  {
    keywords: ['ambulance', 'emergency', 'urgent'],
    response: "For emergency services, please call our 24/7 ambulance service at 1800-HEALTH. Our ambulances are equipped with modern medical facilities."
  },
  {
    keywords: ['pharmacy', 'medicine', 'drug', 'prescription'],
    response: "You can order medicines from our online pharmacy. We offer both prescription and over-the-counter medications with home delivery."
  },
  {
    keywords: ['insurance', 'claim', 'coverage'],
    response: "We offer various health insurance plans. You can check your coverage or file a claim through your dashboard or contact our insurance department."
  },
  {
    keywords: ['doctor', 'specialist', 'consultation'],
    response: "We have a wide network of qualified doctors and specialists. You can book an online consultation or visit our partner hospitals."
  },
  {
    keywords: ['test', 'lab', 'pathology', 'report'],
    response: "Our pathology labs offer a wide range of diagnostic tests. You can book tests online and receive digital reports within 24 hours."
  },
  // General Health Queries
  {
    keywords: ['what can you do', 'help', 'services', 'features'],
    response: "I can help you with:\n1. Booking appointments\n2. Emergency services\n3. Pharmacy and medicines\n4. Health insurance\n5. Doctor consultations\n6. Lab tests and reports\n\nWhat would you like to know more about?"
  },
  {
    keywords: ['contact', 'phone', 'number', 'email', 'address', 'location'],
    response: "Here's our contact information:\n\n📍 Address:\nRishishwar Industry Private Limited\nBM Tower, Infront of Jeen Mata Mandir, Daulatganj,\nPathankar Chourah, Lashkar Gird, Gwalior,\nMadhya Pradesh, Bharat - 474001\n\n📧 Email: rimgwl@rishishwarindustry.in\n📞 Phone: +91 8989 898 989\n\nFeel free to reach out to us for any assistance!"
  },
  {
    keywords: ['location', 'address', 'where', 'center'],
    response: "We have multiple centers across the city. You can find the nearest center by visiting our website or calling our support team at 1800-HEALTH."
  },
  // KYC Process
  {
    keywords: ['kyc', 'verification', 'kyc kaise karein', 'kyc process', 'kyc steps', 'kyc kaise karna hai', 'kyc kaise kare', 'kyc kaise hota hai'],
    response: "Here's the step-by-step guide for KYC verification:\n\n1. Go to your profile section\n2. Click on the 'Start KYC' button\n3. Upload your Aadhaar or PAN card (PDF or Image)\n4. Upload a recent passport-size photo\n5. Submit your documents and wait for admin approval\n6. You'll receive a confirmation via SMS/Email once verified\n\nNeed any clarification on these steps?"
  },
  {
    keywords: ['services', 'offerings', 'what we offer', 'what do you offer', 'what services', 'healthcare services', 'our services', 'what are your services'],
    response: "Rimedicare offers a complete healthcare ecosystem with the following services:\n\n1. 🏥 Healthcare Financing\n   - Easy medical loans\n   - Flexible payment options\n   - Quick approval process\n\n2. 💊 Pharmacy\n   - Wide range of medicines\n   - Prescription fulfillment\n   - Home delivery available\n\n3. 🚑 Ambulance\n   - 24/7 emergency services\n   - Well-equipped vehicles\n   - Trained medical staff\n\n4. 🏪 Retail Stores\n   - Medical equipment\n   - Healthcare products\n   - Personal care items\n\n5. 🔬 Pathology\n   - Comprehensive lab tests\n   - Quick results\n   - Digital reports\n\n6. 💊 Pharma\n   - Pharmaceutical solutions\n   - Medical supplies\n   - Healthcare products\n\nWhich service would you like to know more about?"
  },
  {
    keywords: ['loan process', 'loan steps', 'how to get loan', 'loan application', 'loan procedure', 'loan application process', 'how to apply loan', 'loan steps', 'loan process steps'],
    response: "Here's our simplified 7-step loan process:\n\n1. 📝 Personal Details\n   - Fill basic information\n   - Provide identification details\n   - Enter contact information\n\n2. ✅ Credit Check\n   - Quick credit assessment\n   - No impact on credit score\n   - Instant verification\n\n3. 🔐 KYC Verification\n   - Upload required documents\n   - Identity verification\n   - Address proof submission\n\n4. 📊 Account Analysis\n   - Financial assessment\n   - Income verification\n   - Expense evaluation\n\n5. 💰 Loan Offers\n   - View available options\n   - Compare interest rates\n   - Select suitable plan\n\n6. ✍️ Sign & Complete\n   - Review terms\n   - Digital documentation\n   - E-sign process\n\n7. 💳 Wallet Activation\n   - Instant wallet creation\n   - Fund transfer setup\n   - Ready to use\n\nNeed help with any specific step? Feel free to ask!"
  }
];

export const getHealthResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check for exact matches first
  for (const response of healthResponses) {
    if (response.keywords.some(keyword => lowerMessage === keyword)) {
      return response.response;
    }
  }
  
  // Then check for partial matches
  for (const response of healthResponses) {
    if (response.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return response.response;
    }
  }
  
  return "I'm your health assistant. I can help you with appointments, emergency services, pharmacy, insurance, doctor consultations, and lab tests. How can I assist you today?";
}; 