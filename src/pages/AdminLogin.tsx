import React, { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { doc, updateDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'super_admin')) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signIn(email, password);
      
      // Auto-promote to admin if using default credentials or specific email
      if (email === 'admin@cashpoint.com') {
        const userRef = doc(db, 'users', (userCredential as any).id || (userCredential as any).uid || '');
        await updateDoc(userRef, { role: 'admin' });
      }

      navigate('/admin');
    } catch (error) {
      console.error('Admin login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Admin Access</h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access the admin dashboard
          </p>
          {user && user.role !== 'admin' && user.role !== 'super_admin' && (
            <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
              <p className="text-sm text-yellow-400">
                You are currently logged in as a regular user. 
                Please <button onClick={() => useAuth().signOut()} className="underline font-bold">Log Out</button> first to access the Admin Panel.
              </p>
            </div>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="admin@cashpoint.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Sign in to Admin Panel'
              )}
            </button>
          </div>

          <div className="text-center">
            <a
              href="/login"
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Back to regular login
            </a>
          </div>
        </form>

        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-white mb-2">Default Admin Credentials:</h3>
          <p className="text-xs text-gray-400">Email: admin@cashpoint.com</p>
          <p className="text-xs text-gray-400">Password: admin123</p>
          <p className="text-xs text-red-400 mt-2">
            ⚠️ Change these credentials after first login
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;