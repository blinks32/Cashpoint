import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  role: 'user' | 'admin' | 'super_admin';
  createdAt: any;
}

interface Account {
  id: string;
  userId: string;
  accountType: 'checking' | 'savings' | 'investment';
  accountNumber: string;
  balance: number;
  status: 'active' | 'inactive' | 'frozen';
  createdAt: any;
}

interface Transaction {
  id: string;
  accountId: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: any;
  referenceNumber: string;
}

interface AdminStats {
  totalUsers: number;
  totalAccounts: number;
  totalBalance: number;
  pendingKYC: number;
  totalTransactions: number;
  recentTransactions: Transaction[];
}

export const useAdmin = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'users'));
      const usersData: User[] = [];
      snapshot.forEach(doc => {
        usersData.push({ id: doc.id, ...doc.data() } as User);
      });
      setUsers(usersData);
      return usersData;
    } catch (error: any) {
      toast.error('Failed to fetch users');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'accounts'));
      const accountsData: Account[] = [];
      snapshot.forEach(doc => {
        accountsData.push({ id: doc.id, ...doc.data() } as Account);
      });
      setAccounts(accountsData);
      return accountsData;
    } catch (error: any) {
      toast.error('Failed to fetch accounts');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      const txData: Transaction[] = [];
      snapshot.forEach(doc => {
        txData.push({ id: doc.id, ...doc.data() } as Transaction);
      });
      setTransactions(txData);
      return txData;
    } catch (error: any) {
      toast.error('Failed to fetch transactions');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [usersSnap, accountsSnap, txSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'accounts')),
        getDocs(query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(5)))
      ]);

      const usersData: any[] = [];
      usersSnap.forEach(doc => usersData.push(doc.data()));

      const accountsData: any[] = [];
      accountsSnap.forEach(doc => accountsData.push(doc.data()));

      const recentTx: Transaction[] = [];
      txSnap.forEach(doc => recentTx.push({ id: doc.id, ...doc.data() } as Transaction));

      const statsData: AdminStats = {
        totalUsers: usersSnap.size,
        totalAccounts: accountsSnap.size,
        totalBalance: accountsData.reduce((sum, acc) => sum + (acc.balance || 0), 0),
        pendingKYC: usersData.filter(u => u.kycStatus === 'pending').length,
        totalTransactions: txSnap.size, // This is just a sample
        recentTransactions: recentTx
      };

      setStats(statsData);
      return statsData;
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const updateKYCStatus = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        kycStatus: status,
        updatedAt: serverTimestamp()
      });
      setUsers(users.map(u => u.id === userId ? { ...u, kycStatus: status } : u));
      toast.success(`KYC status updated to ${status}`);
    } catch (error: any) {
      toast.error('Failed to update KYC status');
      throw error;
    }
  };

  const updateUserRole = async (userId: string, role: 'user' | 'admin') => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role,
        updatedAt: serverTimestamp()
      });
      setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
      toast.success(`User role updated to ${role}`);
    } catch (error: any) {
      toast.error('Failed to update user role');
      throw error;
    }
  };

  const updateAccountStatus = async (accountId: string, status: 'active' | 'inactive' | 'frozen') => {
    try {
      await updateDoc(doc(db, 'accounts', accountId), {
        status,
        updatedAt: serverTimestamp()
      });
      setAccounts(accounts.map(a => a.id === accountId ? { ...a, status } : a));
      toast.success(`Account status updated to ${status}`);
    } catch (error: any) {
      toast.error('Failed to update account status');
      throw error;
    }
  };

  const updateUser = async (userId: string, data: Partial<User>) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: serverTimestamp()
      });
      setUsers(users.map(u => u.id === userId ? { ...u, ...data } : u));
      toast.success('User updated successfully');
    } catch (error: any) {
      toast.error('Failed to update user');
      throw error;
    }
  };

  const updateAccountBalance = async (accountId: string, balance: number) => {
    try {
      await updateDoc(doc(db, 'accounts', accountId), {
        balance,
        updatedAt: serverTimestamp()
      });
      setAccounts(accounts.map(a => a.id === accountId ? { ...a, balance } : a));
      toast.success('Account balance updated');
    } catch (error: any) {
      toast.error('Failed to update balance');
      throw error;
    }
  };

  return {
    users,
    accounts,
    transactions,
    stats,
    loading,
    fetchUsers,
    fetchAccounts,
    fetchTransactions,
    fetchStats,
    updateKYCStatus,
    updateUserRole,
    updateAccountStatus,
    updateUser,
    updateAccountBalance,
  };
};