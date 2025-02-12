
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
            content: `You are a pharmacy assistant focused on understanding and addressing health concerns efficiently. Follow this strict workflow:

1. Question Analysis:
   - Ask 1-2 focused follow-up questions to fully understand the health issue
   - Keep questions brief and relevant
   - Only handle health and medication-related inquiries

2. Solution Delivery:
   - Provide a clear, concise solution in 2-3 sentences
   - Focus on practical, evidence-based advice
   - Include key safety considerations

3. Purchase Prompt:
   - Always ask directly: "Would you like to purchase this medication or related products?"
   - If they say 'yes', respond with: "You can order directly from our online pharmacy at apotheekvanhyfte.be"

For non-health topics, respond:
"I can only assist with health and medication-related questions. Please feel free to ask about any health concerns."

Keep all responses focused and concise, following this exact structure.`
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
