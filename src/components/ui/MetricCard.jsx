import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const metricCardVariants = cva(
  'relative flex flex-col justify-between items-center text-center p-4 sm:p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl group select-none',
  {
    variants: {
      theme: {
        dark: 'bg-[#0e101c]/80 border-white/10 text-white hover:border-indigo-500/40 hover:bg-[#121528]/90 shadow-lg',
        light: 'bg-white border-slate-200/90 text-slate-900 hover:border-blue-400/40 hover:shadow-md shadow-xs',
        emerald: 'bg-emerald-950/20 border-emerald-500/20 text-white hover:border-emerald-500/40',
        cyan: 'bg-cyan-950/20 border-cyan-500/20 text-white hover:border-cyan-500/40',
      },
      size: {
        default: 'min-h-[110px] sm:min-h-[120px]',
        compact: 'min-h-[90px] sm:min-h-[100px] p-3 sm:p-4',
        large: 'min-h-[130px] sm:min-h-[140px] p-5 sm:p-6',
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

      {/* Primary Value / Counter */}
      <div className="w-full flex items-center justify-center">
        <div className={cn(
          "text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-none inline-flex items-baseline justify-center gap-1",
          accentColor
        )}>
          {value || children}
        </div>
      </div>

      {/* Primary Descriptor Label */}
      {label && (
        <span className={cn(
          "text-xs sm:text-[13px] font-bold tracking-tight mt-2 block leading-snug",
          theme === 'light' ? 'text-slate-800' : 'text-gray-200'
        )}>
          {label}
        </span>
      )}

      {/* Secondary Supporting Subtitle */}
      {subtitle && (
        <span className={cn(
          "text-[10.5px] sm:text-xs font-normal leading-tight mt-0.5 block",
          theme === 'light' ? 'text-slate-500' : 'text-gray-400'
        )}>
          {subtitle}
        </span>
      )}
    </div>
  );
}
