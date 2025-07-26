import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAccounts } from './useAccounts';
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
  const { accounts, updateBalance } = useAccounts();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && accounts.length > 0) {
      fetchTransactions();
    }
  }, [user, accounts]);

  const fetchTransactions = async () => {
    try {
      if (accounts.length === 0) return;

      const accountIds = accounts.map(account => account.id);
      
      const response = await fetch(`/api/transactions?accountIds=${accountIds.join(',')}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch transactions');
      }

      setTransactions(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (
    accountId: number,
    type: 'deposit' | 'withdrawal' | 'transfer' | 'payment',
    amount: number,
    description: string
  ) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId,
          type,
          amount,
          description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Transaction failed');
      }
      
      setTransactions(prev => [data, ...prev]);
      toast.success(`${type} completed successfully!`);
      
      // Refresh accounts to get updated balance
      await fetchTransactions();
      
      return data;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const transferFunds = async (
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    description: string
  ) => {
    try {
      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAccountId,
          toAccountId,
          amount,
          description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Transfer failed');
      }

      // Refresh transactions to show the new transfer transactions
      await fetchTransactions();
      
      toast.success('Transfer completed successfully!');
      return data;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  return {
    transactions,
    loading,
    fetchTransactions,
    createTransaction,
    transferFunds
  };
};