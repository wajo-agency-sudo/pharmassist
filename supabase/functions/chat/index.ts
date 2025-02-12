
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { message } = await req.json();
    console.log('Received message:', message);
    
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
            content: `You are a knowledgeable pharmacy assistant focused STRICTLY on health-related inquiries. Follow these rules:

1. ONLY respond to health, medical, pharmacy, and wellness-related questions
2. For ANY other topics (technology, finance, general knowledge, etc.), politely decline and redirect to health topics
3. Provide evidence-based, accurate medical information
4. Use clear, simple language that patients can understand
5. Always encourage consulting healthcare professionals for specific medical advice
6. Do not provide legal or financial advice, even if health-related
7. If unsure about a health topic, acknowledge limitations and suggest consulting a healthcare provider
8. For emergencies, always advise seeking immediate medical attention

Example response for non-health topics:
"I apologize, but I can only assist with health-related questions. I'd be happy to help you with any questions about medications, health conditions, or general wellness topics instead."

Be concise and precise in your responses.`
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
