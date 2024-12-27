import { useQuery } from "@tanstack/react-query";
import { getApiUrl, getHeaders } from "@/utils/sendbird";

interface MAUResponse {
  mau: number;
  date: string;
}

const fetchMAU = async () => {
  const applicationId = localStorage.getItem('SENDBIRD_APP_ID');
  const apiToken = localStorage.getItem('SENDBIRD_API_TOKEN');
  const region = localStorage.getItem('SENDBIRD_REGION');

  if (!applicationId || !apiToken) {
    throw new Error('Sendbird credentials not found');
  }

  const apiUrl = getApiUrl(applicationId, region as any);
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const response = await fetch(
    `${apiUrl}/statistics/monthly_active_users?start=${firstDayOfMonth.toISOString()}&end=${lastDayOfMonth.toISOString()}`,
    {
      headers: getHeaders(apiToken),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch MAU data');
  }

  const data = await response.json();
  return data as MAUResponse;
};

export const useSendbirdMAU = () => {
  return useQuery({
    queryKey: ['sendbird-mau'],
    queryFn: fetchMAU,
    refetchInterval: 1000 * 60 * 60, // Refresh every hour
    enabled: !!localStorage.getItem('SENDBIRD_APP_ID') && !!localStorage.getItem('SENDBIRD_API_TOKEN'),
  });
};