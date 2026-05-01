import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: any;
  updatedAt: any;
  kycStatus: 'pending' | 'approved' | 'rejected' | 'none';
  role: 'user' | 'admin' | 'super_admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
        } else {
          // This might happen if user was created but doc failed
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const newUser: Omit<User, 'id'> = {
        email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        kycStatus: 'none',
        role: 'user'
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      
      setUser({ id: firebaseUser.uid, ...newUser } as User);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      toast.success('Signed out successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const updateProfile = async (data: any) => {
    try {
      if (!auth.currentUser) throw new Error('No user logged in');

      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });

      const updatedDoc = await getDoc(userRef);
      if (updatedDoc.exists()) {
        setUser({ id: auth.currentUser.uid, ...updatedDoc.data() } as User);
      }
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const setUserDirectly = (userData: User) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
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