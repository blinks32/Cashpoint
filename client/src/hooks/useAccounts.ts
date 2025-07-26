import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export interface Account {
  id: string;
  user_id: string;
  account_type: 'checking' | 'savings' | 'investment';
  account_number: string;
  balance: number;
  created_at: string;
  updated_at: string;
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
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
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

      const accountNumber = `${accountType.toUpperCase().slice(0, 3)}${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      const { data, error } = await supabase
        .from('accounts')
        .insert({
          user_id: user.id,
          account_type: accountType,
          account_number: accountNumber,
          balance: 0,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      
      setAccounts(prev => [data, ...prev]);
      toast.success(`${accountType} account created successfully!`);
      return data;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const updateBalance = async (accountId: string, newBalance: number) => {
    try {
      const { error } = await supabase
        .from('accounts')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('id', accountId);

      if (error) throw error;
      
      setAccounts(prev => 
        prev.map(account => 
          account.id === accountId 
            ? { ...account, balance: newBalance }
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