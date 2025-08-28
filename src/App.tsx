import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import TawkToChat from './components/TawkToChat';
import LandingPage from './pages/LandingPage';
import KYCPage from './pages/KYCPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid #374151'
              }
            }}
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/kyc" element={
              <ProtectedRoute>
                <KYCPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
          {/* Tawk.to Live Chat */}
          {import.meta.env.VITE_TAWK_TO_PROPERTY_ID && (
            <TawkToChat
              propertyId={import.meta.env.VITE_TAWK_TO_PROPERTY_ID}
              widgetId="1j3lqca3p"
            />
          )}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;