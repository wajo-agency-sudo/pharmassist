
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
   - If they say 'yes', respond with:
     "You can order directly from our online pharmacy:
     <div class='mt-4'>
       <a href='https://apotheekvanhyfte.be' target='_blank' class='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>
         Visit Our Pharmacy
         <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M7 17l9.2-9.2M17 17V7H7'/></svg>
       </a>
     </div>"

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
