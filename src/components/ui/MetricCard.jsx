import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const metricCardVariants = cva(
  'relative flex flex-col justify-between items-center text-center p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#0d0f1a]/85 shadow-xl transition-all duration-300 backdrop-blur-xl group select-none h-full w-full',
  {
    variants: {
      theme: {
        dark: 'border-white/10 text-white hover:border-indigo-500/40 hover:bg-[#121528]/90',
        light: 'bg-white border-slate-200/90 text-slate-900 hover:border-blue-400/40 hover:shadow-md shadow-xs',
      },
      size: {
        default: 'min-h-[165px] sm:min-h-[175px]',
        compact: 'min-h-[120px] sm:min-h-[130px] p-3 sm:p-4',
        large: 'min-h-[180px] sm:min-h-[190px] p-5 sm:p-6',
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
        <div className="mb-2 p-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300">
          <Icon className="w-3.5 h-3.5" />
        </div>
      )}

      {/* LEVEL 1 — VALUE (Standardized 32-34px typography & safe baseline alignment) */}
      <div className="w-full flex items-center justify-center my-auto px-2">
        <div className={cn(
          "text-[30px] sm:text-[32px] md:text-[34px] font-bold tracking-tight leading-none whitespace-nowrap inline-flex items-baseline justify-center gap-1",
          accentColor
        )}>
          {value || children}
        </div>
      </div>

      {/* LEVEL 2 — LABEL (14.5-15px font-semibold text-gray-200) */}
      {label && (
        <span className={cn(
          "text-[14px] sm:text-[15px] font-semibold tracking-tight mt-1.5 block leading-snug whitespace-nowrap",
          theme === 'light' ? 'text-slate-800' : 'text-gray-200'
        )}>
          {label}
        </span>
      )}

      {/* LEVEL 3 — DESCRIPTION (13-13.5px regular muted text-gray-400) */}
      {subtitle && (
        <span className={cn(
          "text-[12.5px] sm:text-[13px] font-normal leading-normal mt-1 block",
          theme === 'light' ? 'text-slate-500' : 'text-gray-400'
        )}>
          {subtitle}
        </span>
      )}
    </div>
  );
}
