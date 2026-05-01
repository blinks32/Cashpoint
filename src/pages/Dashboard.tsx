import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  Users,
  Settings,
  LogOut,
  Plus,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  Activity,
  Wallet,
  Send,
  Download,
  History,
  Menu,
  X,
  Shield,
  User,
  Copy,
  CheckCircle,
  Bell,
  FileText,
  Edit3,
  Save
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import toast from 'react-hot-toast';
import { collection, query, where, getDocs, getDoc, doc as firestoreDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, updateProfile } = useAuth();
  const { accounts, loading: accountsLoading, createAccount } = useAccounts();
  const { transactions, loading: transactionsLoading, createTransaction, transferFunds } = useTransactions();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBalance, setShowBalance] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transferToAccount, setTransferToAccount] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedField, setCopiedField] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '', lastName: '', phone: '', address: '', city: '', state: '', zipCode: ''
  });
  const [transferAccountNumber, setTransferAccountNumber] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [lookingUpBeneficiary, setLookingUpBeneficiary] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: (user as any).address || '',
        city: (user as any).city || '',
        state: (user as any).state || '',
        zipCode: (user as any).zipCode || ''
      });
    }
  }, [user]);

  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
  const checkingAccount = accounts.find(acc => acc.accountType === 'checking');
  const savingsAccount = accounts.find(acc => acc.accountType === 'savings');
  const investmentAccount = accounts.find(acc => acc.accountType === 'investment');

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileForm);
      setEditingProfile(false);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const lookupBeneficiary = async () => {
    if (!transferAccountNumber || transferAccountNumber.length < 6) {
      toast.error('Enter a valid account number');
      return;
    }
    setLookingUpBeneficiary(true);
    try {
      const q = query(collection(db, 'accounts'), where('accountNumber', '==', transferAccountNumber));
      const snap = await getDocs(q);
      if (snap.empty) {
        toast.error('Account not found');
        setBeneficiaryName('');
        return;
      }
      const accData = snap.docs[0].data();
      const beneficiaryDoc = await getDoc(firestoreDoc(db, 'users', accData.userId));
      if (beneficiaryDoc.exists()) {
        const bd = beneficiaryDoc.data();
        setBeneficiaryName(`${bd.firstName} ${bd.lastName}`);
        setTransferToAccount(snap.docs[0].id);
        toast.success('Beneficiary found');
      } else {
        setBeneficiaryName('Account Holder');
        setTransferToAccount(snap.docs[0].id);
      }
    } catch (error) {
      toast.error('Failed to look up account');
    } finally {
      setLookingUpBeneficiary(false);
    }
  };

  const handleDeposit = async () => {
    if (!selectedAccount || !amount || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createTransaction(
        selectedAccount,
        'deposit',
        parseFloat(amount),
        description
      );
      setShowDepositModal(false);
      setAmount('');
      setDescription('');
      setSelectedAccount('');
    } catch (error) {
      console.error('Deposit error:', error);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedAccount || !amount || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createTransaction(
        selectedAccount,
        'withdrawal',
        parseFloat(amount),
        description
      );
      setShowWithdrawModal(false);
      setAmount('');
      setDescription('');
      setSelectedAccount('');
    } catch (error) {
      console.error('Withdrawal error:', error);
    }
  };

  const handleTransfer = async () => {
    if (!selectedAccount || !transferToAccount || !amount || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    if (selectedAccount === transferToAccount) {
      toast.error('Cannot transfer to the same account');
      return;
    }

    try {
      await transferFunds(
        selectedAccount,
        transferToAccount,
        parseFloat(amount),
        description
      );
      setShowTransferModal(false);
      setAmount('');
      setDescription('');
      setSelectedAccount('');
      setTransferToAccount('');
    } catch (error) {
      console.error('Transfer error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const balanceData = [
    { name: 'Jan', checking: checkingAccount?.balance || 0, savings: savingsAccount?.balance || 0 },
    { name: 'Feb', checking: checkingAccount?.balance || 0, savings: savingsAccount?.balance || 0 },
    { name: 'Mar', checking: checkingAccount?.balance || 0, savings: savingsAccount?.balance || 0 },
    { name: 'Apr', checking: checkingAccount?.balance || 0, savings: savingsAccount?.balance || 0 },
    { name: 'May', checking: checkingAccount?.balance || 0, savings: savingsAccount?.balance || 0 },
    { name: 'Jun', checking: checkingAccount?.balance || 0, savings: savingsAccount?.balance || 0 },
  ];

  const spendingData = [
    { category: 'Food', amount: 450 },
    { category: 'Transport', amount: 320 },
    { category: 'Shopping', amount: 280 },
    { category: 'Bills', amount: 650 },
    { category: 'Entertainment', amount: 180 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-4 lg:space-y-6">
            {/* Welcome Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  Welcome back, {user?.firstName}
                </h2>
                <p className="text-gray-400 mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {user?.kycStatus !== 'approved' && (
                  <button onClick={() => navigate('/kyc')}
                    className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 px-4 py-2 rounded-lg text-sm hover:bg-yellow-400/20 transition-colors">
                    Complete KYC
                  </button>
                )}
                {accounts.length === 0 && (
                  <button onClick={() => setActiveTab('accounts')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-500 transition-colors flex items-center space-x-1">
                    <Plus size={16} /><span>Open Account</span>
                  </button>
                )}
              </div>
            </div>

            {/* Account Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-xl text-gray-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">Total Balance</p>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-3xl font-bold">
                        {showBalance ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
                      </h3>
                      <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="text-gray-700 hover:text-gray-900"
                      >
                        {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 opacity-80" />
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Checking</p>
                    <h3 className="text-2xl font-bold text-white">
                      ${(checkingAccount?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </h3>
                    <p className="text-sm text-blue-400">Available now</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Savings</p>
                    <h3 className="text-2xl font-bold text-white">
                      ${(savingsAccount?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </h3>
                    <p className="text-sm text-green-400">4.5% APY</p>
                  </div>
                  <PiggyBank className="h-8 w-8 text-green-400" />
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Investments</p>
                    <h3 className="text-2xl font-bold text-white">
                      ${(investmentAccount?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </h3>
                    <p className="text-sm text-purple-400">Optional</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 p-4 lg:p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg lg:text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-3 p-3 lg:p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <ArrowDownLeft className="h-5 w-5 lg:h-6 lg:w-6 text-green-400" />
                  <span className="text-white text-sm lg:text-base">Deposit</span>
                </button>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-3 p-3 lg:p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <ArrowUpRight className="h-5 w-5 lg:h-6 lg:w-6 text-blue-400" />
                  <span className="text-white text-sm lg:text-base">Withdraw</span>
                </button>
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-3 p-3 lg:p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Send className="h-5 w-5 lg:h-6 lg:w-6 text-purple-400" />
                  <span className="text-white text-sm lg:text-base">Transfer</span>
                </button>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div className="bg-gray-800 p-4 lg:p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg lg:text-xl font-bold text-white mb-4">Account Balances</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={balanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#F9FAFB'
                      }}
                    />
                    <Line type="monotone" dataKey="checking" stroke="#3B82F6" strokeWidth={2} name="Checking" />
                    <Line type="monotone" dataKey="savings" stroke="#10B981" strokeWidth={2} name="Savings" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-800 p-4 lg:p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg lg:text-xl font-bold text-white mb-4">Monthly Spending</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={spendingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#F9FAFB'
                      }}
                    />
                    <Bar dataKey="amount" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-gray-800 p-4 lg:p-6 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg lg:text-xl font-bold text-white">Recent Transactions</h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-yellow-400 hover:text-yellow-300 text-sm lg:text-base"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3 lg:space-y-4">
                {transactionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
                  </div>
                ) : transactions.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No transactions yet</p>
                ) : (
                  transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 lg:p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${transaction.type === 'deposit' ? 'bg-green-500/20 text-green-400' :
                          transaction.type === 'withdrawal' ? 'bg-red-500/20 text-red-400' :
                            transaction.type === 'transfer' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-purple-500/20 text-purple-400'
                          }`}>
                          {transaction.type === 'deposit' ? <ArrowDownLeft size={14} /> :
                            transaction.type === 'withdrawal' ? <ArrowUpRight size={14} /> :
                              transaction.type === 'transfer' ? <Send size={14} /> :
                                <CreditCard size={14} />}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm lg:text-base">{transaction.description}</p>
                          <p className="text-gray-400 text-xs lg:text-sm">{transaction.createdAt?.toDate ? transaction.createdAt.toDate().toLocaleDateString() : new Date(transaction.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold text-sm lg:text-base ${transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                          }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}${(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className={`text-xs lg:text-sm ${transaction.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                          }`}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 'accounts':
        return (
          <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <h2 className="text-xl lg:text-2xl font-bold text-white">My Accounts</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => createAccount('savings')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-500 transition-colors flex items-center justify-center space-x-2 text-sm lg:text-base"
                >
                  <Plus size={16} />
                  <span>Savings Account</span>
                </button>
                <button
                  onClick={() => createAccount('investment')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-500 transition-colors flex items-center justify-center space-x-2 text-sm lg:text-base"
                >
                  <Plus size={16} />
                  <span>Investment Account</span>
                </button>
              </div>
            </div>

            {accountsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {accounts.map((account) => (
                  <div key={account.id} className="bg-gray-800 p-4 lg:p-6 rounded-xl border border-gray-700">
                    <div className={`bg-gradient-to-r ${account.accountType === 'checking' ? 'from-blue-500 to-blue-600' :
                      account.accountType === 'savings' ? 'from-green-500 to-green-600' :
                        'from-purple-500 to-purple-600'
                      } w-full h-28 lg:h-32 rounded-lg mb-4 p-3 lg:p-4 text-white`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs lg:text-sm opacity-80 capitalize">{account.accountType} Account</p>
                          <p className="text-sm lg:text-lg font-mono">****{account.accountNumber?.slice(-4) || '0000'}</p>
                        </div>
                        <Wallet className="h-5 w-5 lg:h-6 lg:w-6" />
                      </div>
                      <div className="mt-3 lg:mt-4">
                        <p className="text-lg lg:text-2xl font-bold">${(account.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        {account.accountType === 'savings' && <p className="text-xs lg:text-sm opacity-80">4.5% APY</p>}
                        {account.accountType === 'investment' && <p className="text-xs lg:text-sm opacity-80">Optional</p>}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAccount(account.id.toString());
                          setShowDepositModal(true);
                        }}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition-colors text-sm lg:text-base"
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAccount(account.id.toString());
                          setShowWithdrawModal(true);
                        }}
                        className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm lg:text-base"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <h2 className="text-xl lg:text-2xl font-bold text-white">Transaction History</h2>
            </div>

            <div className="bg-gray-800 p-4 lg:p-6 rounded-xl border border-gray-700">
              <div className="space-y-3 lg:space-y-4">
                {transactionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
                  </div>
                ) : transactions.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No transactions yet</p>
                ) : (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${transaction.type === 'deposit' ? 'bg-green-500/20 text-green-400' :
                          transaction.type === 'withdrawal' ? 'bg-red-500/20 text-red-400' :
                            transaction.type === 'transfer' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-purple-500/20 text-purple-400'
                          }`}>
                          {transaction.type === 'deposit' ? <ArrowDownLeft size={16} /> :
                            transaction.type === 'withdrawal' ? <ArrowUpRight size={16} /> :
                              transaction.type === 'transfer' ? <Send size={16} /> :
                                <CreditCard size={16} />}
                        </div>
                        <div>
                          <p className="text-white font-medium">{transaction.description}</p>
                          <p className="text-gray-400 text-sm">
                            {transaction.createdAt?.toDate ? transaction.createdAt.toDate().toLocaleDateString() : new Date(transaction.createdAt).toLocaleDateString()} • {transaction.referenceNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                          }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}${(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className={`text-sm ${transaction.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                          }`}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Profile & Settings</h2>

            {/* Profile Card */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 text-2xl font-bold">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{user?.firstName} {user?.lastName}</h3>
                      <p className="text-gray-400">{user?.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                        user?.kycStatus === 'approved' ? 'bg-green-500/20 text-green-400' :
                        user?.kycStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        KYC: {user?.kycStatus || 'Not submitted'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingProfile(!editingProfile)}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    {editingProfile ? <X size={16} /> : <Edit3 size={16} />}
                    <span>{editingProfile ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">First Name</label>
                    {editingProfile ? (
                      <input value={profileForm.firstName} onChange={e => setProfileForm({...profileForm, firstName: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                    ) : (
                      <p className="text-white font-medium">{user?.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                    {editingProfile ? (
                      <input value={profileForm.lastName} onChange={e => setProfileForm({...profileForm, lastName: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                    ) : (
                      <p className="text-white font-medium">{user?.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone</label>
                    {editingProfile ? (
                      <input value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" placeholder="+1 (555) 000-0000" />
                    ) : (
                      <p className="text-white font-medium">{user?.phone || 'Not set'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <p className="text-white font-medium">{user?.email}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Address</label>
                    {editingProfile ? (
                      <input value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" placeholder="Street address" />
                    ) : (
                      <p className="text-white font-medium">{(user as any)?.address || 'Not set'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">City</label>
                    {editingProfile ? (
                      <input value={profileForm.city} onChange={e => setProfileForm({...profileForm, city: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                    ) : (
                      <p className="text-white font-medium">{(user as any)?.city || 'Not set'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">State / ZIP</label>
                    {editingProfile ? (
                      <div className="flex space-x-2">
                        <input value={profileForm.state} onChange={e => setProfileForm({...profileForm, state: e.target.value})}
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" placeholder="State" />
                        <input value={profileForm.zipCode} onChange={e => setProfileForm({...profileForm, zipCode: e.target.value})}
                          className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" placeholder="ZIP" />
                      </div>
                    ) : (
                      <p className="text-white font-medium">{(user as any)?.state || ''} {(user as any)?.zipCode || 'Not set'}</p>
                    )}
                  </div>
                </div>
                {editingProfile && (
                  <button onClick={handleSaveProfile}
                    className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center space-x-2">
                    <Save size={16} /><span>Save Changes</span>
                  </button>
                )}
              </div>
            </div>

            {/* Account Numbers */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <CreditCard size={20} className="text-yellow-400" /><span>Your Account Numbers</span>
              </h3>
              {accounts.length === 0 ? (
                <p className="text-gray-400">No accounts yet. Create one from the Accounts tab.</p>
              ) : (
                <div className="space-y-3">
                  {accounts.map(acc => (
                    <div key={acc.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-400 capitalize">{acc.accountType} Account</p>
                        <p className="text-white font-mono text-lg">{acc.accountNumber}</p>
                        <p className="text-sm text-gray-400">Routing: 021000021</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <p className="text-white font-semibold">${(acc.balance || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                        <button onClick={() => copyToClipboard(acc.accountNumber, acc.id)}
                          className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors">
                          {copiedField === acc.id ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-300" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => navigate('/kyc')}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-left hover:border-yellow-400/50 transition-colors">
                <FileText size={24} className="text-yellow-400 mb-2" />
                <h4 className="text-white font-semibold">KYC Verification</h4>
                <p className="text-gray-400 text-sm">Submit identity documents for verification</p>
              </button>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <Shield size={24} className="text-green-400 mb-2" />
                <h4 className="text-white font-semibold">Security</h4>
                <p className="text-gray-400 text-sm">256-bit encryption • FDIC insured</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (accountsLoading && transactionsLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-gray-900" />
            </div>
            <span className="text-white font-bold">CashPoint</span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-red-400 hover:text-red-300"
          >
            <LogOut size={20} />
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <div className="flex space-x-1 mt-4 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'dashboard' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <LayoutDashboard size={16} />
            <span className="text-sm">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'accounts' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <CreditCard size={16} />
            <span className="text-sm">Accounts</span>
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'transactions' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <History size={16} />
            <span className="text-sm">Transactions</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'settings' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Settings size={16} />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-gray-900" />
              </div>
              <span className="text-white font-bold">CashPoint</span>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'dashboard' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('accounts')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'accounts' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <CreditCard size={20} />
                <span>Accounts</span>
              </button>

              <button
                onClick={() => setActiveTab('transactions')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'transactions' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <History size={20} />
                <span>Transactions</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'settings' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
                  }`}
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
        <div className="flex-1 p-4 lg:p-8">
          {renderContent()}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-4 lg:p-6 rounded-xl max-w-md w-full">
            <h3 className="text-lg lg:text-xl font-bold text-white mb-4">Make a Deposit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Account</label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="">Select an account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id.toString()}>
                      {account.accountType?.charAt(0).toUpperCase() + account.accountType?.slice(1)} - ****{account.accountNumber?.slice(-4) || '0000'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="Enter description"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors text-sm lg:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-500 transition-colors text-sm lg:text-base"
              >
                Deposit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-4 lg:p-6 rounded-xl max-w-md w-full">
            <h3 className="text-lg lg:text-xl font-bold text-white mb-4">Make a Withdrawal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Account</label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="">Select an account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id.toString()}>
                      {account.accountType?.charAt(0).toUpperCase() + account.accountType?.slice(1)} - ****{account.accountNumber?.slice(-4) || '0000'} (${(account.balance || 0).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="Enter description"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition-colors"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Transfer Funds</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">From Account</label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="">Select source account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id.toString()}>
                      {account.accountType?.charAt(0).toUpperCase() + account.accountType?.slice(1)} - {account.accountNumber} (${(account.balance || 0).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Beneficiary Account Number</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={transferAccountNumber}
                    onChange={(e) => { setTransferAccountNumber(e.target.value); setBeneficiaryName(''); setTransferToAccount(''); }}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Enter account number"
                  />
                  <button
                    onClick={lookupBeneficiary}
                    disabled={lookingUpBeneficiary}
                    className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-300 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {lookingUpBeneficiary ? '...' : 'Verify'}
                  </button>
                </div>
                {beneficiaryName && (
                  <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm flex items-center space-x-1">
                      <CheckCircle size={14} />
                      <span>Beneficiary: <strong>{beneficiaryName}</strong></span>
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Narration</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="What is this transfer for?"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => { setShowTransferModal(false); setBeneficiaryName(''); setTransferAccountNumber(''); }}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={!beneficiaryName || !transferToAccount}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;