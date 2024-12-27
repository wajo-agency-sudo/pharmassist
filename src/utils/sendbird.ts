export type SendbirdRegion = 'US' | 'EU' | 'APAC';

export const getApiUrl = (applicationId: string, region?: SendbirdRegion) => {
  if (!applicationId) return '';
  
  switch (region) {
    case 'EU':
      return `https://api-EU-${applicationId}.sendbird.com`;  // Frankfurt server
    case 'APAC':
      return `https://api-APAC-${applicationId}.sendbird.com`;
    default:
      return `https://api-${applicationId}.sendbird.com`;
  }
};