import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const metricCardVariants = cva(
  'relative flex flex-col justify-center items-center text-center p-5 sm:p-6 rounded-2xl border transition-all duration-300 backdrop-blur-xl group select-none h-full',
  {
    variants: {
      theme: {
        dark: 'bg-[#0d0f1a]/85 border-white/10 text-white hover:border-indigo-500/40 hover:bg-[#121528]/90 shadow-xl',
        light: 'bg-white border-slate-200/90 text-slate-900 hover:border-blue-400/40 hover:shadow-md shadow-xs',
        emerald: 'bg-emerald-950/20 border-emerald-500/20 text-white hover:border-emerald-500/40',
        cyan: 'bg-cyan-950/20 border-cyan-500/20 text-white hover:border-cyan-500/40',
      },
      size: {
        default: 'min-h-[170px] sm:min-h-[185px]',
        compact: 'min-h-[130px] sm:min-h-[140px] p-4 sm:p-5',
        large: 'min-h-[190px] sm:min-h-[205px] p-6 sm:p-7',
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

      {/* LEVEL 1 — VALUE (Shared strict typography & fixed baseline height) */}
      <div className="w-full h-[44px] flex items-center justify-center">
        <span
          className={cn(
            "text-[32px] sm:text-[36px] md:text-[38px] font-bold tracking-tight leading-none whitespace-nowrap inline-flex items-baseline justify-center gap-1",
            accentColor
          )}
          style={{ letterSpacing: '-0.02em' }}
        >
          {value || children}
        </span>
      </div>

      {/* LEVEL 2 — LABEL (15-16px semibold/bold near-white) */}
      {label && (
        <span
          className={cn(
            "text-[15px] sm:text-[16px] font-semibold tracking-tight mt-2.5 block leading-snug whitespace-nowrap",
            theme === 'light' ? 'text-slate-800' : 'text-gray-100'
          )}
        >
          {label}
        </span>
      )}

      {/* LEVEL 3 — DESCRIPTION (13.5-14px regular muted) */}
      {subtitle && (
        <span
          className={cn(
            "text-[13px] sm:text-[14px] font-normal leading-normal mt-1.5 block",
            theme === 'light' ? 'text-slate-500' : 'text-gray-400'
          )}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}
