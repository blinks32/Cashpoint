import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../config/api';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  role: 'user' | 'admin' | 'super_admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  setUserDirectly: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const response = await apiRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Don't set user yet - they need to verify email first
      if (data.requiresVerification) {
        toast.success('Account created! Check your email for verification code.');
        return data; // Return data with requiresVerification flag
      }

      // Fallback for old flow (shouldn't happen)
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Account created successfully!');
      return data;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiRequest('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed');
      }

      // Check if verification is required
      if (data.requiresVerification) {
        toast.success('Verification code sent to your email');
        return data; // Return data with requiresVerification flag
      }

      console.log('User signed in successfully:', data.user);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Signed in successfully!');
      return data;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      const response = await apiRequest('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({
          email,
          code
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Email verified successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const resendCode = async (email: string) => {
    try {
      const response = await apiRequest('/api/auth/resend-code', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend code');
      }

      toast.success('Verification code sent!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Signed out successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const updateProfile = async (data: any) => {
    try {
      if (!user) throw new Error('No user logged in');

      const response = await fetch(`/api/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Update failed');
      }

      setUser(responseData);
      localStorage.setItem('user', JSON.stringify(responseData));
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const setUserDirectly = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    verifyEmail,
    resendCode,
    signOut,
    updateProfile,
    setUserDirectly
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};