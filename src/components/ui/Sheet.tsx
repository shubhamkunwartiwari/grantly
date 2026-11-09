import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      // Focus first interactive element in sheet
      const focusable = sheetRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      }
    } else {
      document.body.style.overflow = '';
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-primary/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Content Panel */}
      <div
        ref={sheetRef}
        className="relative z-10 w-full md:max-w-xl max-h-[88dvh] bg-surface-card border-t md:border border-border-hairline rounded-t-[20px] md:rounded-[18px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle shrink-0">
          <h2 className="font-serif text-xl text-ink-primary font-medium">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-ink-muted hover:text-ink-primary hover:bg-surface-raised transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto overscroll-contain flex-1">
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-border-subtle bg-surface-raised/40 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
