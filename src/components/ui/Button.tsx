import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...rest
    },
    ref
  ) => {
    // Base styles: 44px min touch target on mobile/standard buttons, smooth transitions, font-body
    let sizeStyles = 'min-h-[44px] px-5 py-2.5 text-sm gap-2';
    if (size === 'sm') {
      sizeStyles = 'min-h-[38px] px-3.5 py-1.5 text-xs gap-1.5';
    } else if (size === 'lg') {
      sizeStyles = 'min-h-[48px] px-6 py-3 text-base gap-2.5';
    }

    let variantStyles =
      'bg-brand-primary text-brand-contrast hover:bg-brand-hover shadow-sm hover:shadow-md hover-shimmer-trigger';
    if (variant === 'secondary') {
      variantStyles =
        'bg-surface-card text-ink-primary border border-border-hairline hover:border-brand-primary/40 hover:bg-surface-raised hover:shadow-2xs';
    } else if (variant === 'outline') {
      variantStyles =
        'bg-transparent text-ink-primary border border-border-hairline hover:border-brand-primary hover:text-brand-primary hover:bg-brand-light/30 hover:shadow-2xs';
    } else if (variant === 'ghost') {
      variantStyles = 'bg-transparent text-ink-primary hover:bg-surface-raised hover:text-brand-primary';
    } else if (variant === 'danger') {
      variantStyles =
        'bg-semantic-danger text-white hover:bg-semantic-danger/90 hover:shadow-md';
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`group inline-flex items-center justify-center font-medium rounded-[10px] select-none transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${sizeStyles} ${variantStyles} ${className}`}
        {...rest}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />}
        {!isLoading && leftIcon && (
          <span className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:scale-105">
            {leftIcon}
          </span>
        )}
        <span className="whitespace-nowrap truncate">{children}</span>
        {!isLoading && rightIcon && (
          <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-105">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
