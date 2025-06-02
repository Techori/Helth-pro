import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Minimize2, Maximize2, MessageCircle, ArrowLeft } from "lucide-react";
import { Message, getHealthResponse } from "@/lib/chatbot";

const mainOptions = [
  {
    title: "Our Services",
    description: "Healthcare Financing, Pharmacy, Ambulance, Retail Stores, Pathology, Pharma",
    keywords: ["services", "offerings", "what we offer"],
    subOptions: [
      "Healthcare Financing",
      "Pharmacy Services",
      "Ambulance Services",
      "Retail Stores",
      "Pathology Services",
      "Pharma Services"
    ]
  },
  {
    title: "Loan Process",
    description: "7 simple steps to get your medical loan",
    keywords: ["loan", "loan process", "how to get loan"],
    subOptions: [
      "Personal Details",
      "Credit Check",
      "KYC Verification",
      "Account Analysis",
      "Loan Offers",
      "Sign & Complete",
      "Wallet Activation"
    ]
  },
  {
    title: "Contact Us",
    description: "Address, Email, Phone number",
    keywords: ["contact", "address", "phone", "email"],
    subOptions: [
      "Office Address",
      "Email Contact",
      "Phone Number",
      "Emergency Contact"
    ]
  },
  {
    title: "KYC Process",
    description: "Complete your KYC verification",
    keywords: ["kyc", "verification"],
    subOptions: [
      "Start KYC",
      "Required Documents",
      "KYC Steps",
      "KYC Status Check"
    ]
  }
];

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [showOptions, setShowOptions] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCategoryClick = (option: typeof mainOptions[0]) => {
    setSelectedCategory(option.title);
    setShowOptions(true);
  };

  const handleSubOptionClick = (subOption: string) => {
    setShowOptions(false);
    const userMessage: Message = {
      text: subOption,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        text: getHealthResponse(subOption),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
    setShowOptions(true);
  };

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
      const botResponse: Message = {
        text: getHealthResponse(messageText),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
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
    <Card className="fixed bottom-4 right-4 w-96 h-[600px] flex flex-col bg-white shadow-xl rounded-lg transition-all duration-300">
      <div className="p-4 bg-orange-400 text-white rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Rimedicare</h3>
            <p className="text-xs text-white/80">Online</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => setIsMinimized(true)}
        >
          <Minimize2 size={20} />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4 bg-orange-50">
        <div className="space-y-4">
          {messages.length === 0 && showOptions ? (
            <div className="space-y-4">
              {selectedCategory ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600 hover:bg-orange-100"
                      onClick={handleBackClick}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                    <h3 className="font-semibold text-orange-600">{selectedCategory}</h3>
                  </div>
                  <div className="grid gap-2">
                    {mainOptions.find(opt => opt.title === selectedCategory)?.subOptions.map((subOption, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start p-3 bg-white hover:bg-orange-50 border-orange-200 text-orange-600"
                        onClick={() => handleSubOptionClick(subOption)}
                      >
                        {subOption}
                      </Button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center text-gray-500 py-4">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 text-orange-300" />
                    <p className="text-lg font-semibold mb-4">How can I help you today?</p>
                  </div>
                  <div className="grid gap-3">
                    {mainOptions.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start p-4 h-auto bg-white hover:bg-orange-50 border-orange-200"
                        onClick={() => handleCategoryClick(option)}
                      >
                        <div className="text-left">
                          <div className="font-semibold text-orange-600">{option.title}</div>
                          <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-orange-400 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
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
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm">
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
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={() => handleSendMessage()}
            size="icon"
            className="shrink-0 bg-orange-400 hover:bg-orange-500"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </Card>
  );
} 