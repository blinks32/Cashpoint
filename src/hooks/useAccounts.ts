import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    try {
      if (!user) return;
      
      const response = await fetch(`/api/accounts/${user.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch accounts');
      }

      setAccounts(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (accountType: 'checking' | 'savings' | 'investment') => {
    try {
      if (!user) throw new Error('No user logged in');

      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          accountType,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }
      
      setAccounts(prev => [data, ...prev]);
      toast.success(`${accountType} account created successfully!`);
      return data;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const updateBalance = async (accountId: number, newBalance: number) => {
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          balance: newBalance.toFixed(2)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update balance');
      }
      
      setAccounts(prev => 
        prev.map(account => 
          account.id === accountId 
            ? { ...account, balance: newBalance.toFixed(2) }
            : account
        )
      );
    } catch (error: any) {
      toast.error('Failed to update balance');
      throw error;
    }
  };

  return {
    accounts,
    loading,
    fetchAccounts,
    createAccount,
    updateBalance
  };
};