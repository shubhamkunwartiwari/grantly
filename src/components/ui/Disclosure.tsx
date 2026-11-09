import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DisclosureItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const DisclosureItem: React.FC<DisclosureItemProps> = ({
  id,
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const buttonId = `disclosure-btn-${id}`;
  const panelId = `disclosure-panel-${id}`;

  return (
    <div className="border-b border-border-hairline last:border-b-0 py-4">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-left py-2 font-serif text-lg md:text-xl text-ink-primary hover:text-brand-primary transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary rounded-[6px]"
        >
          <span className="pr-4">{title}</span>
          <ChevronDown
            className={`w-5 h-5 text-ink-muted shrink-0 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>
      </h3>
      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="pt-2 pb-3 text-ink-muted text-sm md:text-base leading-relaxed animate-in fade-in"
        >
          {children}
        </div>
      )}
    </div>
  );
};
