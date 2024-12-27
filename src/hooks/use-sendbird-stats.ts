import { useState, useEffect } from 'react';
import { getApiUrl } from '@/utils/sendbird';

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
      const region = localStorage.getItem('SENDBIRD_REGION');

      if (!applicationId || !apiToken) {
        return;
      }

      try {
        const apiUrl = getApiUrl(applicationId, region as any);
        const response = await fetch(`${apiUrl}/v3/statistics/daily`, {
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