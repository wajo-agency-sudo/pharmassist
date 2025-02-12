
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting chat function...');
    const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
    
    if (!apiKey) {
      console.error('No API key found in environment variables');
      throw new Error('API key not found');
    }

    const { message, userId } = await req.json();
    console.log('Received message:', message);
    
    // Check if the query is health-related
    const isHealthQuery = isHealthRelated(message);

    // Create Supabase client
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
        is_health_related: isHealthQuery
      });

    if (!isHealthQuery) {
      return new Response(
        JSON.stringify({
          response: "I apologize, but I can only assist with health and pharmacy-related questions. Please feel free to ask about medications, treatments, health conditions, or other medical topics."
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Making request to Perplexity API...');
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
            content: 'You are a helpful pharmacy assistant. ONLY answer health and pharmacy related questions. For any other questions, politely explain that you can only assist with health and pharmacy related matters. Always be precise and concise. Ensure all medical advice aligns with current medical best practices and include appropriate disclaimers when necessary.'
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
      console.error('Perplexity API error:', errorText);
      throw new Error('Failed to get AI response: ' + errorText);
    }

    const data = await response.json();
    console.log('Successfully received response from Perplexity API');
    return new Response(JSON.stringify({ response: data.choices[0].message.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to process request' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
