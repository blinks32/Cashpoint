import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { useAccounts } from './useAccounts';
import { apiRequest } from '../lib/queryClient';
import toast from 'react-hot-toast';

export interface Transaction {
  id: number;
  accountId: number;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  referenceNumber: string;
}

export const useTransactions = () => {
  const { user } = useAuth();
  const { accounts } = useAccounts();
  const queryClient = useQueryClient();

  const accountIds = accounts.map((account: any) => account.id).join(',');

  const { data: transactions = [], isLoading: loading } = useQuery({
    queryKey: ['/api/transactions', accountIds],
    enabled: !!user && accounts.length > 0,
  });

  const createTransactionMutation = useMutation({
    mutationFn: async ({
      accountId,
      type,
      amount,
      description
    }: {
      accountId: string;
      type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
      amount: number;
      description: string;
    }) => {
      return apiRequest('/api/transactions', {
        method: 'POST',
        body: JSON.stringify({
          accountId,
          type,
          amount,
          description,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: [`/api/accounts/${user?.id}`] });
      toast.success('Transaction completed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Transaction failed');
    },
  });

  const transferFundsMutation = useMutation({
    mutationFn: async ({
      fromAccountId,
      toAccountId,
      amount,
      description
    }: {
      fromAccountId: string;
      toAccountId: string;
      amount: number;
      description: string;
    }) => {
      return apiRequest('/api/transfers', {
        method: 'POST',
        body: JSON.stringify({
          fromAccountId,
          toAccountId,
          amount,
          description,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: [`/api/accounts/${user?.id}`] });
      toast.success('Transfer completed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Transfer failed');
    },
  });

  const createTransaction = (
    accountId: string,
    type: 'deposit' | 'withdrawal' | 'transfer' | 'payment',
    amount: number,
    description: string
  ) => {
    return createTransactionMutation.mutateAsync({
      accountId,
      type,
      amount,
      description,
    });
  };

  const transferFunds = (
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description: string
  ) => {
    return transferFundsMutation.mutateAsync({
      fromAccountId,
      toAccountId,
      amount,
      description,
    });
  };

  return {
    transactions,
    loading,
    createTransaction,
    transferFunds
  };
};