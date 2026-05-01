import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Account {
  id: string;
  userId: string;
  accountType: 'checking' | 'savings' | 'investment';
  accountNumber: string;
  balance: number;
  createdAt: any;
  updatedAt: any;
  status: 'active' | 'inactive' | 'frozen';
}

export const useAccounts = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAccounts([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'accounts'),
      where('userId', '==', user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const accountsData: Account[] = [];
      snapshot.forEach((doc) => {
        accountsData.push({ id: doc.id, ...doc.data() } as Account);
      });
      setAccounts(accountsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to fetch accounts');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createAccount = async (accountType: 'checking' | 'savings' | 'investment') => {
    try {
      if (!user) throw new Error('No user logged in');

      // Generate a realistic 10-digit account number based on type
      const prefix = accountType === 'checking' ? '10' : accountType === 'savings' ? '20' : '30';
      const accountNumber = prefix + Math.floor(Math.random() * 90000000 + 10000000).toString();

      const newAccount: Omit<Account, 'id'> = {
        userId: user.id,
        accountType,
        accountNumber,
        balance: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active'
      };

      const docRef = await addDoc(collection(db, 'accounts'), newAccount);
      toast.success(`${accountType.charAt(0).toUpperCase() + accountType.slice(1)} account created!`);
      return { id: docRef.id, ...newAccount };
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const updateBalance = async (accountId: string, newBalance: number) => {
    try {
      const accountRef = doc(db, 'accounts', accountId);
      await updateDoc(accountRef, {
        balance: newBalance,
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      toast.error('Failed to update balance');
      throw error;
    }
  };

  return {
    accounts,
    loading,
    createAccount,
    updateBalance
  };
};