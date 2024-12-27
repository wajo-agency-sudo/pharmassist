import { useState, useEffect } from 'react';

interface SendbirdStats {
  messageCount: number;
  activeUsers: number;
  responseTime: number;
}

export const useSendbirdStats = () => {
  const [stats, setStats] = useState<SendbirdStats>({
    messageCount: 0,
    activeUsers: 0,
    responseTime: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const applicationId = localStorage.getItem('SENDBIRD_APP_ID');
      const apiToken = localStorage.getItem('SENDBIRD_API_TOKEN');

      if (!applicationId || !apiToken) {
        return;
      }

      try {
        const response = await fetch(`https://api-${applicationId}.sendbird.com/v3/statistics/daily`, {
          method: 'GET',
          headers: {
            'Api-Token': apiToken,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.statistics && data.statistics[0]) {
          setStats({
            messageCount: data.statistics[0].message_count || 0,
            activeUsers: data.statistics[0].active_users || 0,
            responseTime: data.statistics[0].response_time || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching Sendbird stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return stats;
};