import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, Eye, EyeOff, Shield, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import EmailVerification from '../components/EmailVerification';
import SecurityBadges from '../components/SecurityBadges';
import toast from 'react-hot-toast';

const Login = () => {
  const { user, signIn, signInWithGoogle } = useAuth();
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
      if (user.role === 'admin' || user.role === 'super_admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                  } catch (error) {
                    // Handled in AuthContext
                  }
                }}
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-700 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Google
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
