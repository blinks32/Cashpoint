import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Lock, Shield, Smartphone, Bell } from 'lucide-react';

const Security = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Lock className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Security Center</h1>
          <p className="text-gray-400 text-lg">Your financial security is our top priority.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <Shield className="h-10 w-10 text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">FDIC Insured</h3>
            <p className="text-gray-400">
              Your deposits are FDIC insured up to $250,000 through our partner banks, giving you peace of mind that your money is protected.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <Lock className="h-10 w-10 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Bank-Grade Encryption</h3>
            <p className="text-gray-400">
              We use 256-bit AES encryption to protect your data both at rest and in transit. Your connection is always secure.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <Smartphone className="h-10 w-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Two-Factor Auth</h3>
            <p className="text-gray-400">
              Enhance your account security with two-factor authentication (2FA). We require a second form of verification for sensitive actions.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <Bell className="h-10 w-10 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Real-Time Alerts</h3>
            <p className="text-gray-400">
              Receive instant notifications for all account activities, including deposits, withdrawals, and login attempts.
            </p>
          </div>
        </div>

        <div className="bg-yellow-400/10 border border-yellow-400/20 p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-4">How You Can Protect Yourself</h2>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-yellow-400 rounded-full mt-2 shrink-0"></div>
              <p className="text-gray-300">Never share your password or 2FA codes with anyone, including CashPoint employees.</p>
            </li>
            <li className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-yellow-400 rounded-full mt-2 shrink-0"></div>
              <p className="text-gray-300">Use a strong, unique password for your CashPoint account.</p>
            </li>
            <li className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-yellow-400 rounded-full mt-2 shrink-0"></div>
              <p className="text-gray-300">Enable biometric login on your mobile device if available.</p>
            </li>
            <li className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-yellow-400 rounded-full mt-2 shrink-0"></div>
              <p className="text-gray-300">Monitor your account activity regularly and report any suspicious activity immediately.</p>
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Security;
