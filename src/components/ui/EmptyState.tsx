import React from 'react';
import { SearchX, Inbox, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'search' | 'inbox' | 'sparkles';
  actionLabel?: string;
  onAction?: () => void;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'inbox',
  actionLabel,
  onAction,
  secondaryAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-border-hairline rounded-[14px] bg-surface-card/50 max-w-xl mx-auto my-6 ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-brand-light/50 border border-brand-primary/15 flex items-center justify-center text-brand-primary mb-4 shrink-0">
        {icon === 'search' && <SearchX className="w-6 h-6" aria-hidden="true" />}
        {icon === 'inbox' && <Inbox className="w-6 h-6" aria-hidden="true" />}
        {icon === 'sparkles' && <Sparkles className="w-6 h-6" aria-hidden="true" />}
      </div>

      <h3 className="font-serif text-xl md:text-2xl text-ink-primary mb-2 font-medium tracking-tight">
        {title}
      </h3>
      <p className="text-ink-muted text-sm md:text-base leading-relaxed mb-6 max-w-md">
        {description}
      </p>

      {(actionLabel || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionLabel && onAction && (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryAction}
        </div>
      )}
    </div>
  );
};
