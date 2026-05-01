import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-lg">Last Updated: May 1, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed">
              We collect information that you provide directly to us when you create an account, complete your KYC (Know Your Customer) verification, or use our financial services. This includes:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
              <li>Name, email address, and phone number</li>
              <li>Social Security Number (SSN) and government-issued ID information</li>
              <li>Financial information including account balances and transaction history</li>
              <li>Device and usage information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed">
              We use the collected information for various purposes, including:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
              <li>Providing and maintaining our financial services</li>
              <li>Verifying your identity and preventing fraud</li>
              <li>Processing transactions and sending related information</li>
              <li>Communicating with you about products, services, and security updates</li>
              <li>Complying with legal and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
            <p className="text-gray-300 leading-relaxed">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
              <li>Financial institutions and service providers involved in your transactions</li>
              <li>Regulators and law enforcement agencies when required by law</li>
              <li>Third-party service providers who perform services on our behalf (e.g., identity verification)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We take the security of your personal and financial information seriously. We use industry-standard encryption, firewalls, and secure socket layer (SSL) technology to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at support@cashpoint.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
