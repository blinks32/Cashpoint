import React, { useState, useEffect } from 'react';
import {
  Users,
  CreditCard,
  Activity,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  TrendingUp,
  UserCheck,
  UserX,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
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

const AdminDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const {
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
  } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'super_admin') {
      toast.error('Access denied. Admin privileges required.');
      // Redirect to dashboard or login
      window.location.href = '/dashboard';
    }
  }, [user]);

  // Fetch admin data on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Wait for auth to finish loading and ensure user is admin
      if (authLoading || !user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        return;
      }

      try {
        await Promise.all([
          fetchUsers(),
          fetchAccounts(),
          fetchTransactions(),
          fetchStats(),
        ]);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      }
    };

    fetchData();
  }, [user, authLoading]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const freezeAccount = async (accountId: number) => {
    try {
      await updateAccountStatus(accountId, 'frozen');
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <h3 className="text-2xl font-bold text-white">{stats?.totalUsers || users.length}</h3>
              <p className="text-sm text-green-400">+12% from last month</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Accounts</p>
              <h3 className="text-2xl font-bold text-white">{stats?.totalAccounts || accounts.length}</h3>
              <p className="text-sm text-green-400">+8% from last month</p>
            </div>
            <CreditCard className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Balance</p>
              <h3 className="text-2xl font-bold text-white">
                ${(stats?.totalBalance || accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0)).toLocaleString()}
              </h3>
              <p className="text-sm text-green-400">+15% from last month</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pending KYC</p>
              <h3 className="text-2xl font-bold text-white">
                {stats?.pendingKYC || users.filter(u => u.kycStatus === 'pending').length}
              </h3>
              <p className="text-sm text-orange-400">Requires attention</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {(stats?.recentTransactions || transactions.slice(0, 5)).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'deposit' ? 'bg-green-500/20 text-green-400' :
                  transaction.type === 'withdrawal' ? 'bg-red-500/20 text-red-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  <Activity size={16} />
                </div>
                <div>
                  <p className="text-white font-medium">{transaction.description}</p>
                  <p className="text-gray-400 text-sm">{transaction.referenceNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount}
                </p>
                <p className={`text-sm ${
                  transaction.status === 'completed' ? 'text-green-400' : 
                  transaction.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {transaction.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
            <Filter size={20} />
          </button>
          <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">KYC Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.filter(user => 
                user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((user) => (
                <tr key={user.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {user.phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.kycStatus === 'approved' ? 'bg-green-500/20 text-green-400' :
                      user.kycStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {user.kycStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                      user.role === 'super_admin' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {user.kycStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => updateKYCStatus(user.id, 'approved')}
                            className="text-green-400 hover:text-green-300"
                            title="Approve KYC"
                          >
                            <UserCheck size={16} />
                          </button>
                          <button
                            onClick={() => updateKYCStatus(user.id, 'rejected')}
                            className="text-red-400 hover:text-red-300"
                            title="Reject KYC"
                          >
                            <UserX size={16} />
                          </button>
                        </>
                      )}
                      {user.role === 'user' && (
                        <button
                          onClick={() => updateUserRole(user.id, 'admin')}
                          className="text-purple-400 hover:text-purple-300"
                          title="Make Admin"
                        >
                          <Shield size={16} />
                        </button>
                      )}
                      <button className="text-blue-400 hover:text-blue-300" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300" title="Edit">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAccounts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Account Management</h2>
        <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
          Export Accounts
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-white font-medium">****{account.accountNumber.slice(-4)}</p>
                    <p className="text-gray-400 text-sm">User ID: {account.userId}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize text-gray-300">{account.accountType}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                    ${parseFloat(account.balance).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      account.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      account.status === 'frozen' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {account.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {new Date(account.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-300" title="View Details">
                        <Eye size={16} />
                      </button>
                      {account.status === 'active' && (
                        <button
                          onClick={() => freezeAccount(account.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Freeze Account"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'accounts':
        return renderAccounts();
      default:
        return renderOverview();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-gray-900" />
            </div>
            <span className="text-white font-bold">Admin Panel</span>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'overview' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <TrendingUp size={20} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'users' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Users size={20} />
              <span>Users</span>
            </button>

            <button
              onClick={() => setActiveTab('accounts')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'accounts' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <CreditCard size={20} />
              <span>Accounts</span>
            </button>

            <button
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-300 hover:bg-gray-700 transition-colors"
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-400 hover:bg-gray-700 transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;