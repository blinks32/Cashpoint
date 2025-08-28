// API configuration for different environments
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://cashpoint-lemon.vercel.app'
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

  const response = await fetch(url, defaultOptions);
  return response;
};