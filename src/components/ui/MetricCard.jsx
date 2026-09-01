import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const metricCardVariants = cva(
  'relative flex flex-col justify-center items-center text-center p-4 sm:p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl group select-none h-full',
  {
    variants: {
      theme: {
        dark: 'bg-[#0d0f1a]/85 border-white/10 text-white hover:border-indigo-500/40 hover:bg-[#121528]/90 shadow-xl',
        light: 'bg-white border-slate-200/90 text-slate-900 hover:border-blue-400/40 hover:shadow-md shadow-xs',
        emerald: 'bg-emerald-950/20 border-emerald-500/20 text-white hover:border-emerald-500/40',
        cyan: 'bg-cyan-950/20 border-cyan-500/20 text-white hover:border-cyan-500/40',
      },
      size: {
        default: 'min-h-[135px] sm:min-h-[145px]',
        compact: 'min-h-[100px] sm:min-h-[110px] p-3 sm:p-4',
        large: 'min-h-[150px] sm:min-h-[160px] p-5 sm:p-6',
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
        <div className="mb-2 p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300">
          <Icon className="w-4 h-4" />
        </div>
      )}

      {/* 1. Primary Value / Metric (Single Line, Balanced Scale) */}
      <div className="w-full flex items-center justify-center">
        <div className={cn(
          "text-2xl sm:text-[28px] md:text-[32px] font-bold tracking-tight leading-none whitespace-nowrap inline-flex items-baseline justify-center gap-1",
          accentColor
        )}>
          {value || children}
        </div>
      </div>

      {/* 2. Label */}
      {label && (
        <span className={cn(
          "text-sm font-semibold tracking-tight mt-2 block leading-snug whitespace-nowrap",
          theme === 'light' ? 'text-slate-800' : 'text-gray-200'
        )}>
          {label}
        </span>
      )}

      {/* 3. Description */}
      {subtitle && (
        <span className={cn(
          "text-xs sm:text-[13px] font-normal leading-normal mt-1 block",
          theme === 'light' ? 'text-slate-500' : 'text-gray-400'
        )}>
          {subtitle}
        </span>
      )}
    </div>
  );
}
