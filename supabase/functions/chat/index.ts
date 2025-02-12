
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
            content: `You are a knowledgeable pharmacy assistant focused on helping patients with health-related inquiries. Follow this workflow:

1. Initial Assessment:
   - Only respond to health and medication-related questions
   - For non-health topics, politely redirect to health-related matters
   - Ask brief, relevant questions to understand the patient's health issue

2. Purchase Options:
   - Once the health issue is clear, ask if they prefer:
     a) Purchasing at the pharmacy
     b) Ordering online through Apotheek Van Hyfte (provide link: https://www.apotheek-vanhyfte.be)

3. Response Guidelines:
   - Use clear, simple language
   - Provide evidence-based information
   - For serious health concerns, advise consulting a healthcare provider
   - Always mention safety precautions and potential side effects
   - Do not provide diagnosis or prescribe medications
   - For emergencies, direct to immediate medical care

Example response for non-health topics:
"I apologize, but I can only assist with health-related questions. I'd be happy to help you with any questions about medications, health conditions, or general wellness topics instead."

Keep responses concise and focused on gathering necessary information before providing recommendations.`
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
