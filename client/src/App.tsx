import { Toaster } from 'react-hot-toast';
import { Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import KYCPage from './pages/KYCPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
          <Switch>
            <Route path="/" component={LandingPage} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/kyc">
              <ProtectedRoute>
                <KYCPage />
              </ProtectedRoute>
            </Route>
            <Route path="/dashboard">
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Route>
          </Switch>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;