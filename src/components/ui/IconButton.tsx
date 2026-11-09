import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      children,
      variant = 'ghost',
      size = 'md',
      className = '',
      'aria-label': ariaLabel,
      disabled,
      ...rest
    },
    ref
  ) => {
    let sizeStyles = 'w-[44px] h-[44px] text-sm';
    if (size === 'sm') {
      sizeStyles = 'w-[36px] h-[36px] text-xs';
    } else if (size === 'lg') {
      sizeStyles = 'w-[48px] h-[48px] text-base';
    }

    let variantStyles =
      'bg-transparent text-ink-primary hover:bg-surface-raised hover:text-brand-primary active:bg-surface-raised/80';
    if (variant === 'secondary') {
      variantStyles =
        'bg-surface-card text-ink-primary border border-border-hairline hover:border-brand-primary/40 hover:bg-surface-raised hover:shadow-2xs';
    } else if (variant === 'primary') {
      variantStyles =
        'bg-brand-primary text-brand-contrast hover:bg-brand-hover shadow-sm hover:shadow-md';
    } else if (variant === 'danger') {
      variantStyles = 'text-semantic-danger hover:bg-semantic-danger-bg hover:shadow-2xs';
    }

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        disabled={disabled}
        className={`inline-flex items-center justify-center rounded-[10px] transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-92 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer ${sizeStyles} ${variantStyles} ${className}`}
        {...rest}
      >
        <span className="transition-transform duration-200 group-hover:scale-110 flex items-center justify-center">
          {children}
        </span>
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
