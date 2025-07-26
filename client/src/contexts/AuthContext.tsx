import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../lib/queryClient';
import toast from 'react-hot-toast';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  kycData: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
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
    // Check for existing session in localStorage
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
          phone: userData.phone,
        }),
      });

      const newUser = response.user;
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiRequest('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const loggedInUser = response.user;
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Signed out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  const updateProfile = async (data: any) => {
    try {
      if (!user) throw new Error('No user logged in');

      const response = await apiRequest(`/api/user/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      const updatedUser = response;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};