
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User as UserIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  text: string;
  sender: "user" | "bot";
}

interface HealthChatbotProps {
  user: User;
}

const HealthChatbot = ({ user }: HealthChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Add a welcome message when the component mounts
  useEffect(() => {
    setMessages([
      {
        text: `Hi ${user.user_metadata?.first_name || 'there'}! I'm your AI Health Assistant from MediCare Allergy & Wellness Center. I can help you with:\n\n• Questions about our services and specialties\n• Information about allergy testing and treatments\n• Guidance on preparing for your appointments\n• Understanding your symptoms\n• General health and wellness advice\n\nHow can I assist you today?`,
        sender: "bot",
      },
    ]);
  }, [user]);

  const getHealthResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Appointment related
    if (input.includes('appointment') || input.includes('booking') || input.includes('schedule')) {
      return "I can help you understand our appointment process! At MediCare Allergy & Wellness Center, we offer appointments for allergy testing, consultations, and treatments. You can book through the dashboard. Please remember to complete your New Patient Intake Form 24 hours before your visit. Would you like to know more about any specific service?";
    }
    
    // Allergy related
    if (input.includes('allergy') || input.includes('allergic') || input.includes('reaction')) {
      return "Allergies are our specialty! We test for environmental allergens, food allergies, and medication sensitivities. Common symptoms include sneezing, runny nose, itchy eyes, skin rashes, and breathing difficulties. IMPORTANT: If you're planning allergy testing, stop antihistamines (Claritin, Zyrtec, Allegra, Benadryl) 7 days before your appointment. Is there a specific allergy concern you'd like to discuss?";
    }
    
    // Symptoms
    if (input.includes('symptom') || input.includes('sneezing') || input.includes('runny nose') || input.includes('itchy') || input.includes('rash') || input.includes('breathing')) {
      return "Those symptoms could be allergy-related! Common allergy symptoms include sneezing, runny/stuffy nose, itchy/watery eyes, skin rashes, and breathing difficulties. If symptoms persist or worsen, please schedule an appointment. For severe reactions or difficulty breathing, seek immediate medical attention. What specific symptoms are you experiencing?";
    }
    
    // Medications
    if (input.includes('medication') || input.includes('claritin') || input.includes('zyrtec') || input.includes('benadryl') || input.includes('flonase')) {
      return "I can provide information about allergy medications! Common options include antihistamines (Claritin, Zyrtec, Allegra) for daily use, Benadryl for acute reactions, and nasal sprays (Flonase, Nasacort) for congestion. Remember: Stop antihistamines 7 days before allergy testing, but you can continue nasal sprays and asthma inhalers. Always consult with our doctors for personalized medication advice.";
    }
    
    // Forms
    if (input.includes('form') || input.includes('intake') || input.includes('paperwork')) {
      return "Our New Patient Intake Form is available in the Medical Forms section of your dashboard. Please complete it 24 hours before your appointment or arrive 15 minutes early if completing at the office. The form includes important medical history, current medications, and symptoms information that helps our doctors provide the best care.";
    }
    
    // Testing
    if (input.includes('test') || input.includes('testing')) {
      return "We offer comprehensive allergy testing to identify specific triggers. Before testing, you must stop antihistamines (Claritin, Zyrtec, Allegra, Benadryl) 7 days prior - this is crucial for accurate results. You can continue nasal sprays and asthma medications. Our testing helps identify environmental, food, and medication allergies so we can create an effective treatment plan.";
    }
    
    // Emergency
    if (input.includes('emergency') || input.includes('epipen') || input.includes('severe') || input.includes('anaphylaxis')) {
      return "For severe allergic reactions or anaphylaxis, call 911 immediately! If you have an EpiPen, use it as prescribed and still seek emergency care. Signs of severe reactions include difficulty breathing, swelling of face/throat, rapid pulse, dizziness, or severe full-body rash. Always carry emergency medications if prescribed and inform our office of any severe reactions.";
    }
    
    // General health
    if (input.includes('health') || input.includes('wellness') || input.includes('general')) {
      return "At MediCare Allergy & Wellness Center, we focus on comprehensive allergy and wellness care. Beyond allergy testing and treatment, we provide education on environmental triggers, dietary guidance for food allergies, and long-term management strategies. Maintaining good overall health supports your immune system and can help manage allergy symptoms.";
    }
    
    // Default response
    return "I'm here to help with questions about allergies, symptoms, medications, appointments, and our services at MediCare Allergy & Wellness Center. You can ask me about:\n\n• Allergy symptoms and testing\n• Appointment preparation\n• Medication guidance\n• Our forms and services\n• General wellness tips\n\nWhat specific information would you like to know?";
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    // Simulate a delay and provide contextual response
    setTimeout(() => {
      const botResponse: Message = {
        text: getHealthResponse(currentInput),
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-2xl rounded-2xl bg-card/80 backdrop-blur-sm border-border/20">
      <CardHeader className="flex flex-row items-center space-x-4 p-4 border-b border-border/20">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold text-foreground">AI Health Assistant</CardTitle>
          <p className="text-sm text-muted-foreground">Ask me anything about MedSchedule</p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : ""}`}>
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] ${msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted/50 rounded-bl-none"}`}>                    
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
                {msg.sender === "user" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-muted/50 rounded-bl-none">
                <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-green-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-border/20">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-background/50 rounded-full focus-visible:ring-1 focus-visible:ring-primary/50"
              autoFocus
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90 disabled:bg-primary/50"
              disabled={isLoading || !input.trim()}>
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthChatbot;
