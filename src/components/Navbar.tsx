import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">CashPoint</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-yellow-400 transition-colors">Dashboard</Link>
                <button 
                  onClick={signOut}
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-yellow-400 transition-colors">Login</Link>
                <Link 
                  to="/signup" 
                  className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 text-gray-300 hover:text-yellow-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 text-gray-300 hover:text-yellow-400 text-left w-full"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 text-gray-300 hover:text-yellow-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="block px-3 py-2 bg-yellow-400 text-gray-900 rounded-lg font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;