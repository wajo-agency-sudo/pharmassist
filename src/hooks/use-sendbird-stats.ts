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

      fetch(`https://api-${applicationId}.sendbird.com/v3/statistics/daily`, {
        method: 'GET',
        headers: {
          'Api-Token': apiToken,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.statistics && data.statistics[0]) {
            setMessageCount(data.statistics[0].message_count || 0);
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