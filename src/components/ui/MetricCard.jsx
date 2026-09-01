import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const metricCardVariants = cva(
  'relative flex flex-col justify-center items-center text-center p-2.5 sm:p-3 rounded-xl border border-white/10 bg-[#0d0f1a]/85 shadow-md transition-all duration-300 backdrop-blur-xl group select-none h-full w-full',
  {
    variants: {
      theme: {
        dark: 'border-white/10 text-white hover:border-indigo-500/40 hover:bg-[#121528]/90',
        light: 'bg-white border-slate-200/90 text-slate-900 hover:border-blue-400/40 hover:shadow-md shadow-xs',
      },
      size: {
        default: 'min-h-[88px] sm:min-h-[96px]',
        compact: 'min-h-[72px] sm:min-h-[80px] p-2 sm:p-2.5',
        large: 'min-h-[110px] sm:min-h-[120px] p-3 sm:p-4',
      }
    },
    defaultVariants: {
      theme: 'dark',
      size: 'default'
    }
  }
);

export default function MetricCard({
  value,
  label,
  subtitle,
  icon: Icon,
  theme = 'dark',
  size = 'default',
  accentColor = 'text-white',
  className,
  children
}) {
  return (
    <div className={cn(metricCardVariants({ theme, size }), className)}>
      {Icon && (
        <div className="mb-1.5 p-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
          <Icon className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Primary Value */}
      <div className="w-full flex items-center justify-center px-1">
        <div className={cn(
          "text-base sm:text-lg md:text-xl font-bold tracking-tight leading-none whitespace-nowrap inline-flex items-baseline justify-center gap-0.5",
          accentColor
        )}>
          {value || children}
        </div>
      </div>

      {/* Primary Label */}
      {label && (
        <span className={cn(
          "text-[10.5px] sm:text-[11.5px] font-semibold tracking-tight mt-1 block leading-tight whitespace-nowrap",
          theme === 'light' ? 'text-slate-800' : 'text-gray-200'
        )}>
          {label}
        </span>
      )}

      {/* Secondary Description */}
      {subtitle && (
        <span className={cn(
          "text-[9px] sm:text-[10px] font-normal leading-tight mt-0.5 block whitespace-nowrap",
          theme === 'light' ? 'text-slate-500' : 'text-gray-400'
        )}>
          {subtitle}
        </span>
      )}
    </div>
  );
}
