import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../config/api';
import toast from 'react-hot-toast';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  role: 'user' | 'admin' | 'super_admin';
  createdAt: string;
}

interface Account {
  id: number;
  userId: number;
  accountType: 'checking' | 'savings' | 'investment';
  accountNumber: string;
  balance: string;
  status: 'active' | 'inactive' | 'frozen';
  createdAt: string;
}

interface Transaction {
  id: number;
  accountId: number;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
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
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);

  const makeAdminRequest = async (endpoint: string, options: RequestInit = {}) => {
    if (!user) throw new Error('User not authenticated');
    
    const url = new URL(endpoint, window.location.origin);
    url.searchParams.append('userId', user.id.toString());
    
    const response = await apiRequest(url.toString(), {
      ...options,
      headers: {
        ...options.headers,
        'X-User-Id': user.id.toString(),
      },
    });
    
    return response;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await makeAdminRequest('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch users');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await makeAdminRequest('/api/admin/accounts');
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
      const data = await response.json();
      setAccounts(data);
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch accounts');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await makeAdminRequest('/api/admin/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch transactions');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await makeAdminRequest('/api/admin/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch stats');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateKYCStatus = async (userId: number, status: 'approved' | 'rejected') => {
    try {
      const response = await makeAdminRequest(`/api/admin/users/${userId}/kyc`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update KYC status');
      }
      
      const updatedUser = await response.json();
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      toast.success(`KYC status updated to ${status}`);
      return updatedUser;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update KYC status');
      throw error;
    }
  };

  const updateUserRole = async (userId: number, role: 'user' | 'admin') => {
    try {
      const response = await makeAdminRequest(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user role');
      }
      
      const updatedUser = await response.json();
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      toast.success(`User role updated to ${role}`);
      return updatedUser;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user role');
      throw error;
    }
  };

  const updateAccountStatus = async (accountId: number, status: 'active' | 'inactive' | 'frozen') => {
    try {
      const response = await makeAdminRequest(`/api/admin/accounts/${accountId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update account status');
      }
      
      const updatedAccount = await response.json();
      setAccounts(accounts.map(a => a.id === accountId ? updatedAccount : a));
      toast.success(`Account status updated to ${status}`);
      return updatedAccount;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update account status');
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
  };
};