// API configuration for different environments
export const API_BASE_URL = import.meta.env.PROD 
  ? '' // Use relative URLs in production for Vercel
  : '';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    console.error('API Request failed:', { url, error });
    throw error;
  }
};