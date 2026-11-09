import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  icon,
  className = '',
}) => {
  let variantStyles = 'bg-surface-raised text-ink-muted border-border-hairline';

  if (variant === 'success') {
    variantStyles = 'bg-semantic-success-bg text-semantic-success border-semantic-success/20';
  } else if (variant === 'warning') {
    variantStyles = 'bg-semantic-warning-bg text-semantic-warning border-semantic-warning/25';
  } else if (variant === 'danger') {
    variantStyles = 'bg-semantic-danger-bg text-semantic-danger border-semantic-danger/20';
  } else if (variant === 'info') {
    variantStyles = 'bg-semantic-info-bg text-semantic-info border-semantic-info/20';
  } else if (variant === 'brand') {
    variantStyles = 'bg-brand-light text-brand-primary border-brand-primary/20';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] border text-xs font-medium tracking-tight whitespace-nowrap select-none ${variantStyles} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
