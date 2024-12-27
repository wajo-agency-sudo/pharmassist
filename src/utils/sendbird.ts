export type SendbirdRegion = 'US' | 'EU' | 'APAC';

export const getApiUrl = (applicationId: string, region?: SendbirdRegion) => {
  if (!applicationId) return '';
  
  // Base URL format: https://api-{application_id}.sendbird.com/v3
  const baseUrl = `https://api-${applicationId}.sendbird.com/v3`;
  
  switch (region) {
    case 'EU':
      return `https://api-EU-${applicationId}.sendbird.com/v3`;  // Frankfurt server
    case 'APAC':
      return `https://api-APAC-${applicationId}.sendbird.com/v3`;
    default:
      return baseUrl;
  }
};

export const getHeaders = (apiToken: string) => {
  return {
    'Content-Type': 'application/json; charset=utf8',
    'Api-Token': apiToken
  };
};

export const getMultipartHeaders = (apiToken: string, boundary: string) => {
  return {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Api-Token': apiToken
  };
};

// Helper function to encode URL parameters
export const encodeParam = (param: string) => {
  return encodeURIComponent(param);
};

// Helper function to validate API token
export const validateApiToken = async (applicationId: string, apiToken: string, region?: SendbirdRegion) => {
  try {
    const apiUrl = getApiUrl(applicationId, region);
    const response = await fetch(`${apiUrl}/users`, {
      method: 'GET',
      headers: getHeaders(apiToken)
    });
    return response.ok;
  } catch (error) {
    console.error('Error validating API token:', error);
    return false;
  }
};