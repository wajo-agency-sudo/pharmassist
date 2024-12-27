import { ChatWidget } from "@/components/chat";
import { DashboardCard } from "@/components/DashboardCard";
import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

const Index = () => {
  const [messageCount, setMessageCount] = useState(0);

  // Update message count whenever messages change
  useEffect(() => {
    const updateMessageCount = () => {
      // Get all messages from localStorage or your state management system
      const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
      setMessageCount(messages.length);
    };

    // Initial count
    updateMessageCount();

    // Set up event listener for message updates
    window.addEventListener('storage', updateMessageCount);

    // Clean up
    return () => {
      window.removeEventListener('storage', updateMessageCount);
    };
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Welcome</h1>
      <p className="text-muted-foreground mt-2">
        Manage and respond to patient inquiries
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard
          title="Active Conversations"
          value={messageCount}
          icon={<MessageCircle className="h-4 w-4 text-muted-foreground" />}
          description="Total messages in the system"
        />
      </div>

      <ChatWidget />
    </div>
  );
};

export default Index;