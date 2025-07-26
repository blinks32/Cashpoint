import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../lib/queryClient';
import toast from 'react-hot-toast';

export interface Account {
  id: number;
  userId: number;
  accountType: 'checking' | 'savings' | 'investment';
  accountNumber: string;
  balance: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'frozen';
}

export const useAccounts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: accounts = [], isLoading: loading } = useQuery({
    queryKey: [`/api/accounts/${user?.id}`],
    enabled: !!user,
  });

  const createAccountMutation = useMutation({
    mutationFn: async (accountType: 'checking' | 'savings' | 'investment') => {
      if (!user) throw new Error('No user logged in');

      const accountNumber = `${accountType.toUpperCase().slice(0, 3)}${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      return apiRequest('/api/accounts', {
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          accountType,
          accountNumber,
        }),
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/accounts/${user?.id}`] });
      toast.success(`${data.accountType} account created successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create account');
    },
  });

  const createAccount = (accountType: 'checking' | 'savings' | 'investment') => {
    return createAccountMutation.mutateAsync(accountType);
  };

  return {
    accounts,
    loading,
    createAccount
  };
};