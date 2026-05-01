import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAccounts } from './useAccounts';
import toast from 'react-hot-toast';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  doc, 
  runTransaction,
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Transaction {
  id: string;
  accountId: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: any;
  updatedAt: any;
  referenceNumber: string;
}

export const useTransactions = () => {
  const { user } = useAuth();
  const { accounts } = useAccounts();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || accounts.length === 0) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const accountIds = accounts.map(account => account.id);
    
    // Firestore 'in' operator is limited to 10 items. 
    // For this demo, we'll just fetch all transactions for these accounts.
    const q = query(
      collection(db, 'transactions'),
      where('accountId', 'in', accountIds),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txData: Transaction[] = [];
      snapshot.forEach((doc) => {
        txData.push({ id: doc.id, ...doc.data() } as Transaction);
      });
      setTransactions(txData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, accounts]);

  const createTransaction = async (
    accountId: string,
    type: 'deposit' | 'withdrawal' | 'transfer' | 'payment',
    amount: number,
    description: string
  ) => {
    try {
      await runTransaction(db, async (transaction) => {
        const accountRef = doc(db, 'accounts', accountId);
        const accountDoc = await transaction.get(accountRef);

        if (!accountDoc.exists()) {
          throw new Error('Account does not exist');
        }

        const currentBalance = accountDoc.data().balance;
        let newBalance = currentBalance;

        if (type === 'deposit') {
          newBalance += amount;
        } else {
          if (currentBalance < amount) {
            throw new Error('Insufficient funds');
          }
          newBalance -= amount;
        }

        const referenceNumber = 'TXN' + Math.random().toString(36).substring(2, 15).toUpperCase();

        const txRef = doc(collection(db, 'transactions'));
        transaction.set(txRef, {
          accountId,
          type,
          amount,
          description,
          status: 'completed',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          referenceNumber
        });

        transaction.update(accountRef, {
          balance: newBalance,
          updatedAt: serverTimestamp()
        });
      });

      toast.success(`${type} completed successfully!`);
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
      await runTransaction(db, async (transaction) => {
        const fromRef = doc(db, 'accounts', fromAccountId);
        const toRef = doc(db, 'accounts', toAccountId);
        
        const fromDoc = await transaction.get(fromRef);
        const toDoc = await transaction.get(toRef);

        if (!fromDoc.exists() || !toDoc.exists()) {
          throw new Error('One or both accounts do not exist');
        }

        const fromBalance = fromDoc.data().balance;
        const toBalance = toDoc.data().balance;

        if (fromBalance < amount) {
          throw new Error('Insufficient funds in source account');
        }

        const referenceNumber = 'TRF' + Math.random().toString(36).substring(2, 15).toUpperCase();

        // Create withdrawal transaction for sender
        const fromTxRef = doc(collection(db, 'transactions'));
        transaction.set(fromTxRef, {
          accountId: fromAccountId,
          type: 'transfer',
          amount: amount,
          description: `Transfer to account ****${toDoc.data().accountNumber.slice(-4)}: ${description}`,
          status: 'completed',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          referenceNumber
        });

        // Create deposit transaction for receiver
        const toTxRef = doc(collection(db, 'transactions'));
        transaction.set(toTxRef, {
          accountId: toAccountId,
          type: 'transfer',
          amount: amount,
          description: `Transfer from account ****${fromDoc.data().accountNumber.slice(-4)}: ${description}`,
          status: 'completed',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          referenceNumber
        });

        transaction.update(fromRef, {
          balance: fromBalance - amount,
          updatedAt: serverTimestamp()
        });

        transaction.update(toRef, {
          balance: toBalance + amount,
          updatedAt: serverTimestamp()
        });
      });

      toast.success('Transfer completed successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  return {
    transactions,
    loading,
    createTransaction,
    transferFunds
  };
};