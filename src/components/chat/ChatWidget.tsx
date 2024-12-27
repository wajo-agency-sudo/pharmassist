import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

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
    }, 1000);

    toast({
      title: "Message sent",
      description: "We'll respond to your message shortly.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-80 flex flex-col border">
          <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center rounded-t-lg">
            <h3 className="font-semibold">Chat with us</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:text-primary-foreground/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 h-96 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}