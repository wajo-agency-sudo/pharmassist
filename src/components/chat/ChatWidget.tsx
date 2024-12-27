import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    // Dispatch storage event for other components to detect the change
    window.dispatchEvent(new Event('storage'));
  }, [messages]);

  useEffect(() => {
    // Add initial greeting message when chat is opened
    if (isOpen && messages.length === 0) {
      const greeting: Message = {
        id: Date.now().toString(),
        content: "Hi, how are you doing and how can I help?",
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [isOpen]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Basic response logic
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! How can I assist you today?";
    }
    if (lowerMessage.includes("how are you")) {
      return "I'm doing well, thank you for asking! How may I help you?";
    }
    if (lowerMessage.includes("bye") || lowerMessage.includes("goodbye")) {
      return "Goodbye! Have a great day!";
    }
    if (lowerMessage.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    // Default response
    return "I understand. How else can I assist you today?";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Generate and send automated response
    setTimeout(() => {
      const responseContent = generateResponse(inputValue);
      const autoResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, autoResponse]);

      toast({
        description: "Message sent successfully!",
      });
    }, 1000);
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <MessageCircle />}
      </Button>
      {isOpen && (
        <div className="chat-widget">
          <ScrollArea>
            {messages.map((message) => (
              <div key={message.id} className={message.sender}>
                <span>{message.content}</span>
              </div>
            ))}
          </ScrollArea>
          <div className="input-area">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
            />
            <Button onClick={handleSendMessage}>
              <Send />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
