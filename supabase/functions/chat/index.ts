
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const healthTopicKeywords = [
  'health', 'medical', 'medicine', 'drug', 'pharmacy', 'prescription',
  'symptom', 'treatment', 'disease', 'condition', 'doctor', 'hospital',
  'medication', 'pharma', 'dosage', 'side effect', 'vaccine', 'vitamin',
  'supplement', 'allergy', 'infection', 'antibiotic', 'chronic', 'acute',
];

function isHealthRelated(message: string): boolean {
  const lowercaseMessage = message.toLowerCase();
  return healthTopicKeywords.some(keyword => 
    lowercaseMessage.includes(keyword.toLowerCase())
  );
}

function getNextStage(currentStage: string, message: string): string {
  switch (currentStage) {
    case 'initial_assessment':
      return 'symptom_details';
    case 'symptom_details':
      return 'medical_history';
    case 'medical_history':
      return 'delivery_preference';
    case 'delivery_preference':
      return 'recommendation';
    case 'recommendation':
      return 'follow_up';
    default:
      return 'initial_assessment';
  }
}

function generatePromptByStage(stage: string, assessment: any): string {
  switch (stage) {
    case 'initial_assessment':
      return "Hello! I'm here to help. Can you describe your symptoms or health concern?";
    case 'symptom_details':
      return "How severe are your symptoms on a scale of 1-10, and how long have you been experiencing them?";
    case 'medical_history':
      return "Do you have any allergies or are you currently taking any medications?";
    case 'delivery_preference':
      return "Would you prefer to pick up your medication at a local pharmacy or have it delivered?";
    case 'recommendation':
      return "Based on your symptoms and history, I'll provide some recommendations. Would you like information about specific products?";
    case 'follow_up':
      return "Is there anything else you'd like to know about the recommended treatment?";
    default:
      return "How can I assist you with your health-related question?";
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!apiKey) {
      throw new Error('API key not found');
    }

    const { message, userId, conversationId } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Log the interaction
    await supabaseClient
      .from('chat_interactions')
      .insert({
        user_id: userId,
        query: message,
        is_health_related: isHealthRelated(message)
      });

    // Get or create health assessment
    let { data: assessment } = await supabaseClient
      .from('health_assessments')
      .select('*')
      .eq('conversation_id', conversationId)
      .single();

    if (!assessment) {
      const { data: newAssessment, error } = await supabaseClient
        .from('health_assessments')
        .insert({
          user_id: userId,
          conversation_id: conversationId,
          current_stage: 'initial_assessment'
        })
        .select()
        .single();

      if (error) throw error;
      assessment = newAssessment;
    }

    // Update assessment based on stage and message
    const nextStage = getNextStage(assessment.current_stage, message);
    const updates: any = {
      current_stage: nextStage
    };

    switch (assessment.current_stage) {
      case 'symptom_details':
        updates.symptoms = message;
        break;
      case 'medical_history':
        updates.allergies = message;
        break;
      case 'delivery_preference':
        updates.delivery_preference = message;
        break;
    }

    await supabaseClient
      .from('health_assessments')
      .update(updates)
      .eq('id', assessment.id);

    const systemPrompt = `You are a helpful pharmacy assistant. Current conversation stage: ${assessment.current_stage}. 
    Previous context: Symptoms: ${assessment.symptoms}, Allergies: ${assessment.allergies}, 
    Delivery preference: ${assessment.delivery_preference}. 
    Provide concise, relevant responses based on the current stage and maintain a professional, medical tone.`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Failed to get AI response: ' + errorText);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    const nextPrompt = generatePromptByStage(nextStage, assessment);
    
    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        nextPrompt,
        currentStage: nextStage
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process request' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
