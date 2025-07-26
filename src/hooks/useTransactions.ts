import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useAccounts } from './useAccounts';
import toast from 'react-hot-toast';

export interface Transaction {
  id: string;
  account_id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  reference_number: string;
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
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .in('account_id', accountIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (
    accountId: string,
    type: 'deposit' | 'withdrawal' | 'transfer' | 'payment',
    amount: number,
    description: string
  ) => {
    try {
      const account = accounts.find(acc => acc.id === accountId);
      if (!account) throw new Error('Account not found');

      // Check balance for withdrawals
      if ((type === 'withdrawal' || type === 'payment') && account.balance < amount) {
        throw new Error('Insufficient funds');
      }

      const referenceNumber = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          account_id: accountId,
          type,
          amount,
          description,
          status: 'completed',
          reference_number: referenceNumber
        })
        .select()
        .single();

      if (error) throw error;

      // Update account balance
      let newBalance = account.balance;
      if (type === 'deposit') {
        newBalance += amount;
      } else if (type === 'withdrawal' || type === 'payment') {
        newBalance -= amount;
      }

      await updateBalance(accountId, newBalance);
      
      setTransactions(prev => [data, ...prev]);
      toast.success(`${type} completed successfully!`);
      
      return data;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const transferFunds = async (
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description: string
  ) => {
    try {
      const fromAccount = accounts.find(acc => acc.id === fromAccountId);
      const toAccount = accounts.find(acc => acc.id === toAccountId);

      if (!fromAccount || !toAccount) throw new Error('Account not found');
      if (fromAccount.balance < amount) throw new Error('Insufficient funds');

      const referenceNumber = `TRF${Date.now()}${Math.floor(Math.random() * 10000)}`;

      // Create withdrawal transaction
      await createTransaction(fromAccountId, 'withdrawal', amount, `Transfer to ${toAccount.account_number}: ${description}`);
      
      // Create deposit transaction
      await createTransaction(toAccountId, 'deposit', amount, `Transfer from ${fromAccount.account_number}: ${description}`);

      toast.success('Transfer completed successfully!');
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