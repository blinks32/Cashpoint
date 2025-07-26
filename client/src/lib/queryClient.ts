import { QueryClient } from '@tanstack/react-query';

// Default fetcher function for react-query
async function defaultQueryFn({ queryKey }: { queryKey: any[] }) {
  const url = queryKey[0];
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  
  return response.json();
}

// API request function for mutations
export async function apiRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  
  return response.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});