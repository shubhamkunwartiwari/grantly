import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Compass, Kanban, Calendar, User, Scale, ArrowRight, X } from 'lucide-react';
import { SCHOLARSHIPS } from '../../data/scholarships';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const QUICK_LINKS = [
    { label: 'Discover Scholarships', path: '/discover', icon: Compass, category: 'Navigation' },
    { label: 'Application Tracker', path: '/tracker', icon: Kanban, category: 'Navigation' },
    { label: 'Deadlines Calendar', path: '/calendar', icon: Calendar, category: 'Navigation' },
    { label: 'Personal Dashboard', path: '/dashboard', icon: User, category: 'Navigation' },
    { label: 'Compare Scholarships', path: '/compare', icon: Scale, category: 'Navigation' },
    { label: 'My Eligibility Profile', path: '/profile', icon: User, category: 'Navigation' },
  ];

  // Filter scholarships based on query
  const matchingScholarships = query.trim()
    ? SCHOLARSHIPS.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.provider.name.toLowerCase().includes(query.toLowerCase()) ||
          s.fields.some((f) => f.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  const allItems = [
    ...(query.trim()
      ? matchingScholarships.map((s) => ({
          id: s.id,
          label: s.title,
          sublabel: s.provider.name,
          path: `/scholarships/${s.slug}`,
          category: 'Scholarship',
        }))
      : QUICK_LINKS.map((q) => ({
          id: q.path,
          label: q.label,
          sublabel: 'Page',
          path: q.path,
          category: q.category,
        }))),
  ];

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (allItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (allItems.length || 1)) % (allItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        navigate(allItems[selectedIndex].path);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command search palette"
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-28 px-4"
        >
          {/* Backdrop with fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-ink-primary/45 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Panel with spring scale and slide */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -12 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="relative z-10 w-full max-w-xl bg-surface-card border border-border-hairline rounded-[16px] shadow-2xl overflow-hidden flex flex-col"
            onKeyDown={handleKeyDown}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-border-hairline gap-3">
              <Search className="w-5 h-5 text-ink-muted shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search scholarships, disciplines, or jump to page..."
                className="w-full bg-transparent text-ink-primary placeholder:text-ink-muted text-base focus:outline-none"
              />
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-ink-muted bg-surface-raised border border-border-hairline rounded">
                ESC
              </kbd>
              <button
                onClick={onClose}
                aria-label="Close command palette"
                className="sm:hidden p-1 text-ink-muted hover:text-ink-primary cursor-pointer active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {allItems.length === 0 ? (
                <div className="p-8 text-center text-ink-muted text-sm">
                  No matching scholarships or actions found for "{query}".
                </div>
              ) : (
                allItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-[10px] cursor-pointer transition-all duration-150 select-none ${
                        isSelected
                          ? 'bg-brand-light text-brand-primary translate-x-1 shadow-2xs'
                          : 'text-ink-primary hover:bg-surface-raised hover:translate-x-0.5'
                      }`}
                    >
                      <div className="min-w-0 pr-3">
                        <div className="font-medium text-sm truncate">{item.label}</div>
                        <div className="text-xs text-ink-muted truncate">{item.sublabel}</div>
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 shrink-0 transition-all duration-150 ${
                          isSelected ? 'opacity-100 translate-x-0.5' : 'opacity-20'
                        }`}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer shortcuts helper */}
            <div className="px-4 py-2.5 border-t border-border-subtle bg-surface-raised/40 text-[11px] text-ink-muted flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="font-mono bg-surface-card px-1.5 py-0.5 rounded border border-border-hairline">↑↓</kbd> navigate
                </span>
                <span>
                  <kbd className="font-mono bg-surface-card px-1.5 py-0.5 rounded border border-border-hairline">↵</kbd> select
                </span>
              </div>
              <span className="opacity-75">Grantly Command Bar</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
