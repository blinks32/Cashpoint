import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDCh3xZfdbWtocmxfjLfrQ_SHUwjjOlQDY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "appy-45444.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "appy-45444",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "appy-45444.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "711315471580",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:711315471580:web:f7586fa4c9e44d5176c819",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DDQH0VJ7GR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
