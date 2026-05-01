import React from 'react';
import { Shield, Lock, CheckCircle, Award, Building2, Fingerprint } from 'lucide-react';

interface SecurityBadgesProps {
  variant?: 'light' | 'dark';
  compact?: boolean;
}

const SecurityBadges: React.FC<SecurityBadgesProps> = ({ variant = 'dark', compact = false }) => {
  const textColor = variant === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const iconColor = variant === 'dark' ? 'text-green-400' : 'text-green-600';
  const borderColor = variant === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const bgColor = variant === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';

  const badges = [
    { icon: Shield, label: 'FDIC Insured', sublabel: 'Up to $250,000' },
    { icon: Lock, label: '256-bit SSL', sublabel: 'Bank-grade encryption' },
    { icon: CheckCircle, label: 'SOC 2 Type II', sublabel: 'Certified' },
    { icon: Fingerprint, label: 'Biometric', sublabel: 'Authentication' },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center space-x-2">
            <badge.icon className={`h-4 w-4 ${iconColor}`} />
            <span className={`text-xs ${textColor}`}>{badge.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`${bgColor} rounded-xl p-6 border ${borderColor}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${variant === 'dark' ? 'bg-green-500/20' : 'bg-green-100'} mb-2`}>
              <badge.icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <p className={`text-sm font-medium ${variant === 'dark' ? 'text-white' : 'text-gray-900'}`}>{badge.label}</p>
            <p className={`text-xs ${textColor}`}>{badge.sublabel}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityBadges;
