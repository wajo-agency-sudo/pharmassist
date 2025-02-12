
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    // Get the API key from Supabase
    const { data: secretData, error: secretError } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'PERPLEXITY_API_KEY')
      .single();

    if (secretError || !secretData) {
      throw new Error('Failed to retrieve API key');
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretData.value}`,
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
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return new Response(JSON.stringify({ response: data.choices[0].message.content }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
