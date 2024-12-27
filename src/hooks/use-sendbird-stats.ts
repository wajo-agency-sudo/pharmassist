import { useState, useEffect } from 'react';

export const useSendbirdStats = () => {
  const [messageCount, setMessageCount] = useState<number>(0);

  useEffect(() => {
    const fetchMessageCount = () => {
      const applicationId = localStorage.getItem('SENDBIRD_APP_ID');
      const apiToken = localStorage.getItem('SENDBIRD_API_TOKEN');

      if (!applicationId || !apiToken) {
        return;
      }

      fetch(`https://api-${applicationId}.sendbird.com/v3/messages`, {
        headers: {
          'Api-Token': apiToken,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.total_count) {
            setMessageCount(data.total_count);
          }
        })
        .catch((error) => {
          console.error('Error fetching Sendbird message count:', error);
        });
    };

    fetchMessageCount();
    // Refresh count every 5 minutes
    const interval = setInterval(fetchMessageCount, 300000);

    return () => clearInterval(interval);
  }, []);

  return { messageCount };
};