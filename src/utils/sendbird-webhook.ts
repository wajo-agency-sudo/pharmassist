export const verifyWebhookSignature = async (payload: string, signature: string, apiToken: string): Promise<boolean> => {
  const encoder = new TextEncoder();
  const key = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(apiToken),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBuffer = await window.crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payload)
  );

  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const calculatedSignature = signatureArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  
  return calculatedSignature === signature;
};

export const handleWebhookEvent = async (
  url: string,
  event: {
    category: string;
    payload: any;
  }
) => {
  const apiToken = localStorage.getItem('SENDBIRD_API_TOKEN');
  if (!apiToken || !url) return false;

  try {
    const eventString = JSON.stringify(event);
    const signature = await generateWebhookSignature(eventString, apiToken);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sendbird-Signature': signature,
      },
      body: eventString,
    });

    return response.ok;
  } catch (error) {
    console.error('Error delivering webhook:', error);
    return false;
  }
};

async function generateWebhookSignature(payload: string, apiToken: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(apiToken),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBuffer = await window.crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payload)
  );

  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  return signatureArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export interface WebhookEvent {
  category: string;
  payload: {
    channel_url: string;
    channel_type: string;
    message?: {
      message_id: number;
      message: string;
      created_at: number;
    };
    sender?: {
      user_id: string;
      nickname: string;
    };
    total_unread_message_count?: number;
    channel_unread_message_count?: number;
  };
}