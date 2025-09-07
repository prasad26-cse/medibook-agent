
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
        text: `Hi ${user.user_metadata?.first_name || 'there'}! I'm your AI Health Assistant. How can I help you today? You can ask me about booking appointments, managing your profile, or general questions about MedSchedule.`,
        sender: "bot",
      },
    ]);
  }, [user]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate a delay and provide a canned response
    setTimeout(() => {
      const botResponse: Message = {
        text: "This is a placeholder response. The real AI chatbot is coming soon!",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
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
