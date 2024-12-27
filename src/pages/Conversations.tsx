import { ConversationList } from "@/components/ConversationList";
import { ConversationVolume } from "@/components/conversations/ConversationVolume";
import { TopQuestions } from "@/components/conversations/TopQuestions";
import { KeywordTrends } from "@/components/conversations/KeywordTrends";
import { QuestionHandling } from "@/components/conversations/QuestionHandling";
import { AIEfficiency } from "@/components/conversations/AIEfficiency";
import { TrendsInsights } from "@/components/conversations/TrendsInsights";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { useSendbirdStats } from "@/hooks/use-sendbird-stats";

const Conversations = () => {
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const { messageCount } = useSendbirdStats();

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-muted-foreground">
              Manage and respond to patient inquiries
            </p>
            {messageCount > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {messageCount} messages handled
              </Badge>
            )}
          </div>
        </div>
        <Select value={selectedChannel} onValueChange={setSelectedChannel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="chatbot">Chatbot</SelectItem>
            <SelectItem value="social">Social Media</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">AI Impact</h2>
            <AIEfficiency />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Recent Conversations</h2>
            <ConversationList channel={selectedChannel} />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Conversation Volume</h2>
            <ConversationVolume channel={selectedChannel} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Question Handling</h2>
            <QuestionHandling channel={selectedChannel} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Top Questions</h2>
          <TopQuestions />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Keyword Trends</h2>
          <KeywordTrends />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Trends & Insights</h2>
          <TrendsInsights />
        </div>
      </div>
    </div>
  );
};

export default Conversations;