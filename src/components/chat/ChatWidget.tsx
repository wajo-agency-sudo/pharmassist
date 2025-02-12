
import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    window.dispatchEvent(new Event('storage'));
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: Message = {
        id: Date.now().toString(),
        content: "Hello! I'm here to help with your health and pharmacy-related questions. Please note that I can only provide information about medical and health topics.",
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [isOpen]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          message: userMessage,
          userId: user?.id
        },
      });

      if (error) throw error;
      return data.response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to get AI response');
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to get AI response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        variant="outline"
        className="rounded-full p-3 h-12 w-12"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>
      
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-lg border">
          <div className="p-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground ml-auto max-w-[80%]"
                        : "bg-muted max-w-[80%]"
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex gap-2 mt-4">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a health-related question..."
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading}
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
