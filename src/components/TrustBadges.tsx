import React from 'react';
import { Shield, Lock, Award, CheckCircle } from 'lucide-react';

interface TrustBadgesProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

const TrustBadges: React.FC<TrustBadgesProps> = ({ variant = 'dark', size = 'md' }) => {
  const textColor = variant === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const iconColor = variant === 'dark' ? 'text-green-400' : 'text-green-600';
  const borderColor = variant === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const bgColor = variant === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';
  
  const sizeClasses = {