import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  DollarSign, 
  PiggyBank, 
  Shield, 
  Award, 
  Smartphone,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Lock,
  Zap,
  Globe,
  CheckCircle,
  Star,
  Users,
  Building2,
  Fingerprint,
  Clock,
  HeadphonesIcon
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SecurityBadges from '../components/SecurityBadges';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const bankingServices = [
    {
      name: "Checking Account",
      description: "No monthly fees, unlimited transactions, and instant transfers",
      features: ["No minimum balance", "Free ATM withdrawals", "Mobile check deposit", "24/7 customer support"],
      icon: <CreditCard className="h-8 w-8" />,
      color: "from-blue-500 to-blue-600",
      rate: "No fees"
    },
    {
      name: "High-Yield Savings",
      description: "Earn competitive interest on your savings with no hidden fees",
      features: ["4.5% APY", "No monthly fees", "FDIC insured", "Easy online access"],
      icon: <PiggyBank className="h-8 w-8" />,
      color: "from-green-500 to-green-600",
      rate: "4.5% APY"
    },
    {
      name: "Digital Wallet",
      description: "Send, receive, and manage your money instantly with our mobile app",
      features: ["Instant transfers", "Bill pay", "Budget tracking", "Contactless payments"],
      icon: <Smartphone className="h-8 w-8" />,
      color: "from-purple-500 to-purple-600",
      rate: "Free"
    },
    {
      name: "Investment Options",
      description: "Optional investment services including stocks and ETFs",
      features: ["Stock trading", "ETF access", "Portfolio management", "Expert guidance"],
      icon: <TrendingUp className="h-8 w-8" />,
      color: "from-yellow-500 to-yellow-600",
      rate: "Coming Soon"
    }
  ];

  const features = [
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Bank-Level Security",
      description: "256-bit encryption, fraud protection, and FDIC insurance up to $250,000"
    },
    {
      icon: <Zap className="h-10 w-10" />,
      title: "Instant Transfers",
      description: "Send money to friends, family, or businesses instantly with zero fees"
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: "Global Access",
      description: "Access your account anywhere in the world with our mobile app"
    },
    {
      icon: <HeadphonesIcon className="h-10 w-10" />,
      title: "24/7 Support",
      description: "Real human support available around the clock, every day of the year"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Small Business Owner",
      content: "CashPoint has transformed how I manage my business finances. The instant transfers and low fees have saved me thousands.",
      rating: 5,
      avatar: "SM"
    },
    {
      name: "James K.",
      role: "Software Engineer",
      content: "Finally, a bank that understands modern banking. The app is intuitive, and the 4.5% APY on savings is unbeatable.",
      rating: 5,
      avatar: "JK"
    },
    {
      name: "Maria L.",
      role: "Freelance Designer",
      content: "The security features give me peace of mind. Two-factor authentication and instant fraud alerts are exactly what I needed.",
      rating: 5,
      avatar: "ML"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">FDIC Insured • Bank-Grade Security</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-white">Modern Banking</span>
                <br />
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">Built for You</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                Experience secure, fee-free banking with industry-leading interest rates. Open your account in minutes and start earning 4.5% APY today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link 
                  to="/signup" 
                  className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/25"
                >
                  Open Free Account
                </Link>
                <Link 
                  to="#accounts" 
                  className="border border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">No monthly fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">4.5% APY savings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">55,000+ free ATMs</span>
                </div>
              </div>
            </div>
            
            {/* Hero Image/Card */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Floating Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-gray-900" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Balance</p>
                        <p className="text-2xl font-bold text-white">$24,582.00</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-sm font-medium">+12.5%</p>
                      <p className="text-gray-500 text-xs">this month</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <p className="text-gray-400 text-xs mb-1">Checking</p>
                      <p className="text-white font-semibold">$8,432.50</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <p className="text-gray-400 text-xs mb-1">Savings (4.5% APY)</p>
                      <p className="text-white font-semibold">$16,149.50</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-lg font-medium hover:bg-yellow-300 transition-colors">
                      Send Money
                    </button>
                    <button className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors">
                      Add Funds
                    </button>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  +$127.50 earned this month
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
