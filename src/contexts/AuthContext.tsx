import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
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
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: string;
  ssn?: string;
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
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  setUserDirectly: (user: User) => void;
  refreshUser: () => Promise<void>;
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

  const fetchUserDoc = async (uid: string): Promise<User | null> => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { id: uid, ...userDoc.data() } as User;
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await fetchUserDoc(firebaseUser.uid);
        if (userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    if (auth.currentUser) {
      const userData = await fetchUserDoc(auth.currentUser.uid);
      if (userData) {
        setUser(userData);
      }
    }
  };

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Check if this is the designated admin email
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      
      if (email.toLowerCase() === 'admin@cashpoint.com') {
        if (userDoc.exists() && userDoc.data().role !== 'admin' && userDoc.data().role !== 'super_admin') {
          await updateDoc(userRef, { role: 'admin', updatedAt: serverTimestamp() });
        } else if (!userDoc.exists()) {
          await setDoc(userRef, {
            email,
            firstName: 'System',
            lastName: 'Admin',
            role: 'admin',
            kycStatus: 'approved',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      }

      // CRITICAL: Re-fetch user doc AFTER any role updates to avoid stale data
      const freshUserData = await fetchUserDoc(uid);
      if (freshUserData) {
        setUser(freshUserData);
      }
      
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userRef);

      if (!userDocSnap.exists()) {
        const newUser: Omit<User, 'id'> = {
          email: firebaseUser.email || '',
          firstName: firebaseUser.displayName?.split(' ')[0] || 'Google',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || 'User',
          phone: firebaseUser.phoneNumber || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          kycStatus: 'none',
          role: 'user'
        };

        await setDoc(userRef, newUser);
        setUser({ id: firebaseUser.uid, ...newUser } as User);
      } else {
        setUser({ id: firebaseUser.uid, ...userDocSnap.data() } as User);
      }
      
      toast.success('Signed in with Google successfully!');
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error(error.message);
      }
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
    signInWithGoogle,
    signOut,
    updateProfile,
    setUserDirectly,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};