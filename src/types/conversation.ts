
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

export type ConversationStage = 
  | 'initial_assessment'
  | 'symptom_details'
  | 'medical_history'
  | 'delivery_preference'
  | 'recommendation'
  | 'follow_up';

export interface HealthAssessment {
  id: string;
  userId: string;
  conversationId: string;
  currentStage: ConversationStage;
  symptoms?: string;
  severity?: number;
  duration?: string;
  allergies?: string;
  currentMedications?: string;
  deliveryPreference?: string;
  createdAt: Date;
  updatedAt: Date;
}
