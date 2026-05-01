import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, Eye, EyeOff, Shield, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import EmailVerification from '../components/EmailVerification';
import SecurityBadges from '../components/SecurityBadges';
import toast from 'react-hot-toast';
import { apiRequest } from '../config/api';

const Login = () => {
  const { user, setUserDirectly } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const response = await apiRequest('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed');
      }

      if (data.requiresVerification) {
        setPendingEmail(formData.email);
        setShowVerification(true);
        toast.success('Verification code sent to your email');
      } else if (data.user) {
        setUserDirectly(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Signed in successfully!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (code: string) => {
    const response = await apiRequest('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({
        email: pendingEmail,
        code
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Verification failed');
    }

    setUserDirectly(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    toast.success('Signed in successfully!');
    navigate('/dashboard');
  };

  const handleResend = async () => {
    const response = await apiRequest('/api/auth/resend-code', {
      method: 'POST',
      body: JSON.stringify({ email: pendingEmail })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to resend code');
    }

    toast.success('New verification code sent');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (showVerification) {
    return (
      <EmailVerification
        email={pendingEmail}
        onVerify={handleVerify}
        onResend={handleResend}
        onBack={() => {
          setShowVerification(false);
          setPendingEmail('');
        }}
        loading={loading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
              <DollarSign className="h-10 w-10 text-yellow-400" />
              <span className="text-3xl font-bold text-white">CashPoint</span>
            </Link>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Secure access to your banking dashboard</p>
          </div>

          {/* Security Indicator */}
          <div className="flex items-center justify-center space-x-4 py-3 px-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <Lock className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-400">256-bit SSL Encrypted Connection</span>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent pr-12 transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-yellow-400 bg-gray-800 border-gray-700 rounded focus:ring-yellow-400 focus:ring-offset-gray-900"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                  Remember this device
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  'Sign In Securely'
                )}
              </button>
            </div>

            <div className="text-center">
              <span className="text-gray-400">Don't have an account? </span>
              <Link to="/signup" className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors">
                Open an account
              </Link>
            </div>
          </form>

          {/* Trust Badges */}
          <div className="pt-6">
            <SecurityBadges variant="dark" compact />
          </div>
        </div>
      </div>

      {/* Right Side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-gray-800 to-gray-900 items-center justify-center p-12">
        <div className="max-w-lg text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400/20 rounded-full mb-6">
              <Shield className="h-10 w-10 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Bank-Grade Security</h3>
            <p className="text-gray-400">
              Your security is our top priority. We use the same encryption technology trusted by major financial institutions worldwide.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-left bg-gray-800/50 p-4 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm">Two-factor authentication on every login</span>
            </div>
            <div className="flex items-center space-x-3 text-left bg-gray-800/50 p-4 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm">Real-time fraud monitoring and alerts</span>
            </div>
            <div className="flex items-center space-x-3 text-left bg-gray-800/50 p-4 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm">FDIC insured deposits up to $250,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
