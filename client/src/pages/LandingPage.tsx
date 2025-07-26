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
  Globe
} from 'lucide-react';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const bankingServices = [
    {
      name: "Checking Account",
      description: "No monthly fees, unlimited transactions, and instant transfers",
      features: ["No minimum balance", "Free ATM withdrawals", "Mobile check deposit", "24/7 customer support"],
      icon: <CreditCard className="h-8 w-8" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "High-Yield Savings",
      description: "Earn up to 4.5% APY on your savings with no hidden fees",
      features: ["4.5% APY", "No monthly fees", "FDIC insured", "Easy online access"],
      icon: <PiggyBank className="h-8 w-8" />,
      color: "from-green-500 to-green-600"
    },
    {
      name: "Digital Wallet",
      description: "Send, receive, and manage your money instantly with our mobile app",
      features: ["Instant transfers", "Bill pay", "Budget tracking", "Contactless payments"],
      icon: <Smartphone className="h-8 w-8" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "Investment Options",
      description: "Optional investment services including stocks and crypto (coming soon)",
      features: ["Stock trading", "Crypto wallet", "Portfolio management", "Expert guidance"],
      icon: <TrendingUp className="h-8 w-8" />,
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  const features = [
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Bank-Level Security",
      description: "256-bit encryption, fraud protection, and FDIC insurance up to $250,000"
    },
    {
      icon: <Zap className="h-12 w-12" />,
      title: "Instant Transfers",
      description: "Send money to friends, family, or businesses instantly with zero fees"
    },
    {
      icon: <Globe className="h-12 w-12" />,
      title: "Global Access",
      description: "Access your account anywhere in the world with our mobile app and web platform"
    },
    {
      icon: <Award className="h-12 w-12" />,
      title: "Award-Winning Support",
      description: "24/7 customer support with real humans, not bots"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            Digital Banking Reimagined
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience the future of digital banking with CashPoint. Save, spend, and grow your money with our innovative fintech platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105"
            >
              Open Account
            </Link>
            <Link 
              to="#accounts" 
              className="border border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Banking Services Section */}
      <section id="accounts" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Account Types</h2>
            <p className="text-xl text-gray-400">Everything you need to manage your finances in one place</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {bankingServices.map((service, index) => (
              <div key={index} className="bg-gray-700 p-8 rounded-xl hover:bg-gray-600 transition-all duration-300 transform hover:scale-105">
                <div className={`bg-gradient-to-r ${service.color} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                  <div className="text-white">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.name}</h3>
                <p className="text-gray-300 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Account Management Section */}
      <section id="services" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-gray-400">Deposit, save, and withdraw with ease</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl text-center">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowDownLeft className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Easy Deposits</h3>
              <p className="text-gray-400 mb-6">
                Deposit checks instantly with mobile check deposit, direct deposit, or wire transfers. Funds available immediately.
              </p>
              <ul className="text-left space-y-2 text-gray-300">
                <li>• Mobile check deposit</li>
                <li>• Direct deposit setup</li>
                <li>• Wire transfers</li>
                <li>• Cash deposits at ATMs</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl text-center">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <PiggyBank className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Savings</h3>
              <p className="text-gray-400 mb-6">
                Automated savings tools, high-yield accounts, and goal tracking to help you save more effectively.
              </p>
              <ul className="text-left space-y-2 text-gray-300">
                <li>• 4.5% APY savings account</li>
                <li>• Automatic round-ups</li>
                <li>• Savings goals</li>
                <li>• No minimum balance</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl text-center">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowUpRight className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Quick Withdrawals</h3>
              <p className="text-gray-400 mb-6">
                Access your money when you need it with fee-free ATMs, instant transfers, and same-day withdrawals.
              </p>
              <ul className="text-left space-y-2 text-gray-300">
                <li>• 55,000+ fee-free ATMs</li>
                <li>• Instant transfers</li>
                <li>• Same-day ACH</li>
                <li>• Mobile wallet integration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Bounty Bank USA?</h2>
            <p className="text-xl text-gray-400">Modern banking built for your lifestyle</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-yellow-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-gray-900">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="about" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">About CashPoint</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              CashPoint is a modern digital banking platform designed to simplify your financial life. 
              We combine traditional banking security with cutting-edge technology to provide you with 
              the best banking experience possible.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-400 mb-6">
                To democratize banking by providing accessible, secure, and innovative financial services 
                that empower individuals and businesses to achieve their financial goals.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  FDIC Insured up to $250,000
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  Founded in 2020
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  Headquartered in New York
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Why Choose Us</h3>
              <p className="text-gray-400 mb-6">
                We're not just another bank. We're your financial partner, committed to providing 
                transparent, fair, and innovative banking solutions.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  No hidden fees or charges
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  24/7 customer support
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  Advanced security measures
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Trusted by Millions</h3>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">2M+</div>
              <p className="text-gray-400">Active Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">$5B+</div>
              <p className="text-gray-400">Deposits Protected</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">99.9%</div>
              <p className="text-gray-400">Uptime Guarantee</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
              <p className="text-gray-400">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-xl text-gray-400">Get in touch with our team</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Phone Support</h3>
              <p className="text-gray-400">1-800-CASHPOINT</p>
              <p className="text-gray-400">Available 24/7</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
              <p className="text-gray-400">support@cashpoint.com</p>
              <p className="text-gray-400">Response within 2 hours</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Visit Us</h3>
              <p className="text-gray-400">123 Financial District</p>
              <p className="text-gray-400">New York, NY 10004</p>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-700 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Send us a Message</h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <textarea
                  rows={4}
                  placeholder="Your Message"
                  className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Start Banking?</h2>
          <p className="text-xl text-gray-800 mb-8">Open your CashPoint account in minutes and experience the future of banking</p>
          <Link 
            to="/signup" 
            className="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
          >
            Open Your Account Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <DollarSign className="h-6 w-6 text-yellow-400" />
              <span className="text-lg font-semibold">CashPoint</span>
            </div>
            <p className="text-gray-400 mb-4">FDIC Insured. Member FDIC. Equal Housing Lender.</p>
            <p className="text-sm text-gray-500">
              © 2025 CashPoint. All rights reserved. Deposits are FDIC insured up to $250,000.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;