import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FileText } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FileText className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-gray-400 text-lg">Last Updated: May 1, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing or using the CashPoint application and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Account Registration</h2>
            <p className="text-gray-300 leading-relaxed">
              To use our services, you must create an account and complete the mandatory identity verification (KYC) process. You agree to provide accurate and complete information and to keep your account credentials secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Prohibited Activities</h2>
            <p className="text-gray-300 leading-relaxed">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
              <li>Use the services for any illegal purpose or in violation of any local, state, national, or international law</li>
              <li>Attempt to gain unauthorized access to any part of the service or other user accounts</li>
              <li>Engage in fraudulent activities, including money laundering or financing of terrorism</li>
              <li>Interfere with or disrupt the integrity or performance of the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Fees and Charges</h2>
            <p className="text-gray-300 leading-relaxed">
              CashPoint may charge fees for certain transactions or services. All fees are disclosed at the time of the transaction. You are responsible for all fees associated with your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time, with or without notice, for any reason, including violation of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              To the fullest extent permitted by law, CashPoint shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
