import { getHeaders } from './sendbird';

export const verifyWebhookSignature = (payload: string, signature: string, apiToken: string): boolean => {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', apiToken);
  hmac.update(payload);
  const calculatedSignature = hmac.digest('hex');
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
  if (!apiToken || !url) return;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sendbird-Signature': crypto
          .createHmac('sha256', apiToken)
          .update(JSON.stringify(event))
          .digest('hex'),
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`Webhook delivery failed: ${response.statusText}`);
    }

    return response.ok;
  } catch (error) {
    console.error('Error delivering webhook:', error);
    return false;
  }
};

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