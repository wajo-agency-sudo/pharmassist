export interface Conversation {
  id: string;
  patient: string;
  channel: "whatsapp" | "chatbot" | "social";
  priority: "high" | "medium" | "low";
  reason: string;
  timeInQueue: string;
  status: "pending" | "in-progress" | "resolved";
  lastMessage: string;
  history?: string[];
}