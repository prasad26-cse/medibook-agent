import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const HealthChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your health assistant. I can help with basic health questions, appointment guidance, and general wellness tips. How can I help you today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Free tier: Simple response system instead of expensive AI API calls
  const getSimpleResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Basic health responses (free tier - rule-based)
    if (input.includes('appointment') || input.includes('book') || input.includes('schedule')) {
      return "To book an appointment, please use the 'Book Appointment' feature on your dashboard. You can select your preferred doctor, date, and time. Is there a specific type of appointment you're looking for?";
    }
    
    if (input.includes('symptom') || input.includes('pain') || input.includes('sick')) {
      return "I understand you're experiencing symptoms. While I can provide general wellness information, it's important to consult with a healthcare professional for proper diagnosis and treatment. Would you like me to help you schedule an appointment?";
    }
    
    if (input.includes('medicine') || input.includes('medication') || input.includes('prescription')) {
      return "For medication questions, please consult with your doctor or pharmacist. They can provide accurate information about dosages, interactions, and side effects. I can help you schedule an appointment if needed.";
    }
    
    if (input.includes('insurance') || input.includes('coverage') || input.includes('cost')) {
      return "For insurance and billing questions, you can update your insurance information in your profile or contact our billing department. Each provider may have different coverage policies.";
    }
    
    if (input.includes('emergency') || input.includes('urgent') || input.includes('serious')) {
      return "⚠️ For medical emergencies, please call 911 immediately or go to your nearest emergency room. For urgent but non-emergency situations, consider calling your doctor's after-hours line or visiting an urgent care center.";
    }
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! I'm here to help with your healthcare questions and guide you through using MedSchedule. What would you like to know about?";
    }
    
    if (input.includes('thank') || input.includes('thanks')) {
      return "You're welcome! I'm always here to help with your healthcare questions. Is there anything else I can assist you with?";
    }
    
    // Default response
    return "I'm here to help with basic health questions and guide you through MedSchedule features. For specific medical advice, please consult with a healthcare professional. You can book an appointment through your dashboard. What else would you like to know?";
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Free tier: Simple rule-based responses with small delay for UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = getSimpleResponse(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-primary">
          <MessageCircle className="w-5 h-5" />
          Health Assistant
        </CardTitle>
        <CardDescription>
          Ask me about appointments, general health questions, or how to use MedSchedule
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about appointments, health questions, or how to use MedSchedule..."
              disabled={loading}
            />
            <Button 
              onClick={sendMessage} 
              disabled={loading || !input.trim()}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Free tier: Basic health guidance. For medical advice, consult a healthcare professional.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthChatbot;