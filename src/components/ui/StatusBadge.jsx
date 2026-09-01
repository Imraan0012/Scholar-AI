import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { CheckCircle2, Clock, AlertTriangle, XCircle, HelpCircle, ShieldCheck } from 'lucide-react';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-tight border transition-colors whitespace-nowrap',
  {
    variants: {
      status: {
        OPEN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        CLOSING_SOON: 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse',
        UPCOMING: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        NOT_YET_OPEN: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        CLOSED: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        AVAILABILITY_UNVERIFIED: 'bg-slate-500/15 text-slate-300 border-slate-400/30',
        YEAR_ROUND: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        ELIGIBLE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        STRONG_MATCH: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        POSSIBLE: 'bg-amber-50 text-amber-700 border-amber-200',
        POSSIBLE_MATCH: 'bg-amber-50 text-amber-700 border-amber-200',
        NOT_ELIGIBLE: 'bg-rose-50 text-rose-700 border-rose-200',
        INELIGIBLE: 'bg-rose-50 text-rose-700 border-rose-200',
        CENTRAL: 'bg-blue-50 text-[#2563EB] border-blue-200',
        STATE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        CORPORATE: 'bg-purple-50 text-purple-700 border-purple-200',
        PRIVATE: 'bg-purple-50 text-purple-700 border-purple-200',
        VERIFIED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      },
      theme: {
        dark: '',
        light: '',
      }
    },
    defaultVariants: {
      status: 'OPEN',
      theme: 'dark'
    }
  }
);

export default function StatusBadge({ status, label, showIcon = true, className }) {
  const normStatus = (status || 'AVAILABILITY_UNVERIFIED').toUpperCase();

  const getIcon = () => {
    switch (normStatus) {
      case 'OPEN':
      case 'ELIGIBLE':
      case 'STRONG_MATCH':
        return <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'CLOSING_SOON':
        return <Clock className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />;
      case 'UPCOMING':
      case 'NOT_YET_OPEN':
        return <Clock className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'CLOSED':
      case 'NOT_ELIGIBLE':
      case 'INELIGIBLE':
        return <XCircle className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'AVAILABILITY_UNVERIFIED':
        return <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />;
      case 'VERIFIED':
        return <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const getDisplayLabel = () => {
    if (label) return label;
    switch (normStatus) {
      case 'OPEN': return 'Open';
      case 'CLOSING_SOON': return 'Closing Soon';
      case 'UPCOMING': return 'Upcoming Cycle';
      case 'NOT_YET_OPEN': return 'Upcoming Cycle';
      case 'CLOSED': return 'Closed';
      case 'AVAILABILITY_UNVERIFIED': return 'Availability Unverified';
      case 'YEAR_ROUND': return 'Year-Round / Rolling';
      case 'ELIGIBLE':
      case 'STRONG_MATCH': return 'Eligible Match';
      case 'POSSIBLE':
      case 'POSSIBLE_MATCH': return 'Potential Match';
      case 'NOT_ELIGIBLE':
      case 'INELIGIBLE': return 'Not Eligible';
      case 'CENTRAL': return 'Central Government';
      case 'STATE': return 'State Scheme';
      case 'CORPORATE': return 'Corporate CSR';
      case 'PRIVATE': return 'Private Trust';
      case 'VERIFIED': return 'Verified Official';
      default: return normStatus;
    }
  };

  return (
    <span className={cn(statusBadgeVariants({ status: normStatus }), className)}>
      {showIcon && getIcon()}
      <span>{getDisplayLabel()}</span>
    </span>
  );
}
