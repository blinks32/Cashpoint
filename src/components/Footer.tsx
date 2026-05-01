import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Shield, Lock, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="h-8 w-8 text-yellow-400" />
              <span className="text-xl font-bold text-white">CashPoint</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted digital banking partner. Secure, fast, and reliable financial services for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Checking Account</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Savings Account</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Investment Options</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Business Banking</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Mobile Banking</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/security" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Security</Link></li>
              <li><Link to="/disclosures" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Disclosures</Link></li>
              <li><Link to="/accessibility" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">Accessibility</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-400 text-sm">1-800-CASHPOINT</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-400 text-sm">support@cashpoint.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-yellow-400 mt-0.5" />
                <span className="text-gray-400 text-sm">123 Financial District<br />New York, NY 10004</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-gray-400 text-sm">FDIC Insured</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-green-400" />
              <span className="text-gray-400 text-sm">256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <img src="https://www.fdic.gov/sites/default/files/2024-03/fdic-logo.svg" alt="FDIC" className="h-6 opacity-60" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Equal Housing Lender</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs text-center md:text-left">
              © {currentYear} CashPoint Financial Services, Inc. All rights reserved. Member FDIC. Equal Housing Lender.
            </p>
            <p className="text-gray-500 text-xs text-center md:text-right">
              Deposits are FDIC insured up to $250,000 per depositor. Investment products are not FDIC insured.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
