import { useState, useEffect } from 'react';
import { X, DollarSign, CreditCard, Building2, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe - Vite exposes env vars on import.meta.env
// @ts-ignore - Vite env typing
const stripePromise = loadStripe(import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface Bank {
  id: string;
  name: string;
  code: string;
}

const POPULAR_BANKS: Bank[] = [
  { id: '1', name: 'Chase Bank', code: 'CHASE' },
  { id: '2', name: 'Bank of America', code: 'BOA' },
  { id: '3', name: 'Wells Fargo', code: 'WELLS' },
  { id: '4', name: 'Citibank', code: 'CITI' },
  { id: '5', name: 'US Bank', code: 'USB' },
  { id: '6', name: 'PNC Bank', code: 'PNC' },
  { id: '7', name: 'Capital One', code: 'CAPITAL' },
  { id: '8', name: 'TD Bank', code: 'TD' },
  { id: '9', name: 'Truist Bank', code: 'TRUIST' },
  { id: '10', name: 'Fifth Third Bank', code: 'FIFTH' },
];

interface AdminTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: {
    id: number;
    accountNumber: string;
    accountType: string;
    balance: string;
    userId: number;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onSuccess: () => void;
}

const CardPaymentForm = ({ 
  amount, 
  onSuccess, 
  onError 
}: { 
  amount: number; 
  onSuccess: (paymentMethodId: string) => void; 
  onError: (error: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError('Card element not found');
      setProcessing(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        onError(error.message || 'Card validation failed');
      } else if (paymentMethod) {
        onSuccess(paymentMethod.id);
      }
    } catch (err) {
      onError('Failed to process card information');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-700 p-4 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#fff',
                '::placeholder': {
                  color: '#9ca3af',
                },
              },
              invalid: {
                color: '#ef4444',
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : `Deposit $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export const AdminTransactionModal = ({
  isOpen,
  onClose,
  account,
  user,
  onSuccess,
}: AdminTransactionModalProps) => {
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [paymentMethod, setPaymentMethod] = useState<'account' | 'bank' | 'card'>('account');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState(`${user.firstName} ${user.lastName}`);
  const [routingNumber, setRoutingNumber] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setAmount('');
      setDescription('');
      setSelectedBank('');
      setBankAccountNumber('');
      setRoutingNumber('');
      setAccountHolderName(`${user.firstName} ${user.lastName}`);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (transactionType === 'withdrawal' && amountNum > parseFloat(account.balance)) {
      toast.error('Insufficient funds');
      return;
    }

    if (paymentMethod === 'bank' && (!selectedBank || !bankAccountNumber || !routingNumber)) {
      toast.error('Please fill in all bank details');
      return;
    }

    setProcessing(true);

    try {
      const paymentDetails: any = {
        method: paymentMethod,
      };

      if (paymentMethod === 'bank') {
        paymentDetails.bank = {
          name: POPULAR_BANKS.find(b => b.id === selectedBank)?.name,
          accountNumber: bankAccountNumber,
          accountHolderName,
          routingNumber,
        };
      }

      const response = await fetch('/api/admin/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: account.id,
          type: transactionType,
          amount: amountNum,
          description: description || `Admin ${transactionType} via ${paymentMethod}`,
          paymentMethod,
          paymentDetails: JSON.stringify(paymentDetails),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Transaction failed');
      }

      toast.success(`${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} successful`);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Transaction failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleCardPaymentSuccess = async (paymentMethodId: string) => {
    const amountNum = parseFloat(amount);
    setProcessing(true);

    try {
      const paymentDetails = {
        method: 'card',
        stripePaymentMethodId: paymentMethodId,
      };

      const response = await fetch('/api/admin/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: account.id,
          type: 'deposit',
          amount: amountNum,
          description: description || 'Admin deposit via card',
          paymentMethod: 'card',
          paymentDetails: JSON.stringify(paymentDetails),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Transaction failed');
      }

      toast.success('Card deposit successful');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Transaction failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Manage Transaction</h2>
            <p className="text-gray-400 text-sm mt-1">
              {user.firstName} {user.lastName} - {account.accountNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Account Info */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Current Balance</p>
                <p className="text-2xl font-bold text-white">
                  ${parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Account Type</p>
                <p className="text-white capitalize">{account.accountType}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTransactionType('deposit')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    transactionType === 'deposit'
                      ? 'border-green-400 bg-green-400/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <DollarSign className={`mx-auto mb-2 ${transactionType === 'deposit' ? 'text-green-400' : 'text-gray-400'}`} />
                  <p className={`font-semibold ${transactionType === 'deposit' ? 'text-green-400' : 'text-gray-300'}`}>
                    Deposit
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('withdrawal')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    transactionType === 'withdrawal'
                      ? 'border-red-400 bg-red-400/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <DollarSign className={`mx-auto mb-2 ${transactionType === 'withdrawal' ? 'text-red-400' : 'text-gray-400'}`} />
                  <p className={`font-semibold ${transactionType === 'withdrawal' ? 'text-red-400' : 'text-gray-300'}`}>
                    Withdrawal
                  </p>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('account')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'account'
                      ? 'border-yellow-400 bg-yellow-400/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Wallet className={`mx-auto mb-2 ${paymentMethod === 'account' ? 'text-yellow-400' : 'text-gray-400'}`} size={20} />
                  <p className={`text-sm font-semibold ${paymentMethod === 'account' ? 'text-yellow-400' : 'text-gray-300'}`}>
                    Account
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'bank'
                      ? 'border-blue-400 bg-blue-400/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Building2 className={`mx-auto mb-2 ${paymentMethod === 'bank' ? 'text-blue-400' : 'text-gray-400'}`} size={20} />
                  <p className={`text-sm font-semibold ${paymentMethod === 'bank' ? 'text-blue-400' : 'text-gray-300'}`}>
                    Bank
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  disabled={transactionType === 'withdrawal'}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-purple-400 bg-purple-400/10'
                      : 'border-gray-600 hover:border-gray-500'
                  } ${transactionType === 'withdrawal' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <CreditCard className={`mx-auto mb-2 ${paymentMethod === 'card' ? 'text-purple-400' : 'text-gray-400'}`} size={20} />
                  <p className={`text-sm font-semibold ${paymentMethod === 'card' ? 'text-purple-400' : 'text-gray-300'}`}>
                    Card
                  </p>
                </button>
              </div>
              {transactionType === 'withdrawal' && paymentMethod === 'card' && (
                <p className="text-yellow-400 text-xs mt-2">Card withdrawals are not supported</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                placeholder="Transaction description"
              />
            </div>

            {/* Bank Details */}
            {paymentMethod === 'bank' && (
              <div className="space-y-4 p-4 bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-white">Bank Account Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    required
                  >
                    <option value="">Choose a bank...</option>
                    {POPULAR_BANKS.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    placeholder="Enter account number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    placeholder="9-digit routing number"
                    pattern="[0-9]{9}"
                    required
                  />
                </div>
              </div>
            )}

            {/* Card Payment Form */}
            {paymentMethod === 'card' && transactionType === 'deposit' && amount && parseFloat(amount) > 0 && (
              <div className="p-4 bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-white mb-4">Card Information</h3>
                <Elements stripe={stripePromise}>
                  <CardPaymentForm
                    amount={parseFloat(amount)}
                    onSuccess={handleCardPaymentSuccess}
                    onError={(error) => toast.error(error)}
                  />
                </Elements>
              </div>
            )}

            {/* Submit Button (for non-card payments) */}
            {(paymentMethod !== 'card' || transactionType === 'withdrawal') && (
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    transactionType === 'deposit'
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-red-600 hover:bg-red-500 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {processing ? 'Processing...' : `${transactionType === 'deposit' ? 'Deposit' : 'Withdraw'} Funds`}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
