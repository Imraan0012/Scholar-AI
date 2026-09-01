import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer gap-2',
  {
    variants: {
      variant: {
        primary: 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-md hover:shadow-lg focus:ring-blue-500',
        gradient: 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-400 hover:from-cyan-600 hover:to-emerald-500 text-white shadow-xl shadow-cyan-500/20 focus:ring-cyan-400',
        secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-400',
        outline: 'border border-slate-200 hover:bg-slate-50 text-slate-700 focus:ring-slate-300',
        darkOutline: 'border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white focus:ring-white/30',
        ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900',
        danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm focus:ring-rose-400',
        success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-400',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-lg',
        default: 'h-10 px-4 py-2 text-xs sm:text-sm',
        lg: 'h-12 px-6 text-sm sm:text-base rounded-2xl',
        icon: 'h-9 w-9 p-0',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default'
    }
  }
);

export default function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  icon: Icon,
  iconRight: IconRight,
  isLoading = false,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      {children && <span>{children}</span>}
      {!isLoading && IconRight && <IconRight className="w-4 h-4 flex-shrink-0" />}
    </button>
  );
}

export { buttonVariants };
