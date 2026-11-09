import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Sun, Moon, Laptop, User } from 'lucide-react';
import { useGrantlyStore } from '../../lib/store';
import { ThemeMode } from '../../types';
import { Logo } from '../ui/Logo';

interface HeaderProps {
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette }) => {
  const location = useLocation();
  const theme = useGrantlyStore((state) => state.theme);
  const setTheme = useGrantlyStore((state) => state.setTheme);
  const profile = useGrantlyStore((state) => state.profile);

  const navLinks = [
    { label: 'Discover', path: '/discover' },
    { label: 'Tracker', path: '/tracker' },
    { label: 'Calendar', path: '/calendar' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Compare', path: '/compare' },
  ];

  const cycleTheme = () => {
    const sequence: ThemeMode[] = ['light', 'dark', 'system'];
    const nextIndex = (sequence.indexOf(theme) + 1) % sequence.length;
    setTheme(sequence[nextIndex]);
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4" aria-hidden="true" />;
    if (theme === 'dark') return <Moon className="w-4 h-4" aria-hidden="true" />;
    return <Laptop className="w-4 h-4" aria-hidden="true" />;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-card/90 backdrop-blur-md border-b border-border-hairline transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark with Light/Dark Graduation Cap Logo */}
        <Link
          to="/"
          className="focus-visible:ring-2 focus-visible:ring-brand-primary rounded-md p-1 -ml-1 whitespace-nowrap shrink-0 group"
          aria-label="Grantly Home"
        >
          <Logo size="md" variant="full" />
        </Link>

        {/* Zone 2: Navigation Links with Sliding Active Indicator */}
        <nav
          className="hidden md:flex items-center gap-2 lg:gap-4 text-sm font-medium text-ink-muted"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`whitespace-nowrap transition-all duration-200 py-1.5 px-3 rounded-[8px] relative group ${
                  isActive
                    ? 'text-brand-primary font-semibold'
                    : 'hover:text-ink-primary hover:bg-surface-raised/70'
                }`}
              >
                <span className="relative z-10 transition-transform duration-200 inline-block group-hover:-translate-y-0.5">
                  {link.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="header-active-nav-indicator"
                    className="absolute -bottom-[15px] left-3 right-3 h-[2.5px] bg-brand-primary rounded-full shadow-xs"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Search, Theme, Profile) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick command search trigger */}
          <button
            onClick={onOpenCommandPalette}
            aria-label="Quick search (Cmd+K)"
            className="flex items-center gap-2 h-9 px-2.5 sm:px-3 text-xs text-ink-muted bg-surface-raised hover:bg-surface-raised/90 hover:border-brand-primary/40 border border-border-hairline rounded-[8px] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 group focus-visible:ring-2 focus-visible:ring-brand-primary cursor-pointer shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-ink-muted group-hover:text-brand-primary group-hover:scale-110 transition-all duration-200" aria-hidden="true" />
            <span className="hidden sm:inline group-hover:text-ink-primary transition-colors">Search...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-ink-muted/80 bg-surface-card rounded border border-border-hairline group-hover:border-brand-primary/30 transition-colors">
              ⌘K
            </kbd>
          </button>

          {/* Theme Mode Toggle (light / dark / system) with spring spin */}
          <button
            onClick={cycleTheme}
            aria-label={`Toggle theme (currently ${theme})`}
            title={`Theme: ${theme}`}
            className="w-9 h-9 flex items-center justify-center rounded-[8px] text-ink-muted hover:text-ink-primary hover:bg-surface-raised hover:border-brand-primary/40 border border-border-hairline transition-all duration-200 hover:-translate-y-0.5 hover:rotate-6 active:scale-90 group focus-visible:ring-2 focus-visible:ring-brand-primary cursor-pointer shadow-2xs"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -60, scale: 0.75, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            >
              {getThemeIcon()}
            </motion.div>
          </button>

          {/* Profile CTA */}
          <Link
            to="/profile"
            aria-label="View or edit your eligibility profile"
            className="flex items-center gap-2 h-9 px-3 text-xs font-medium text-brand-primary bg-brand-light hover:bg-brand-light/90 hover:border-brand-primary/40 border border-brand-primary/20 rounded-[8px] transition-all duration-200 hover:-translate-y-0.5 active:scale-95 group focus-visible:ring-2 focus-visible:ring-brand-primary shadow-2xs"
          >
            <User className="w-3.5 h-3.5 group-hover:scale-115 group-hover:-rotate-6 transition-transform duration-200" aria-hidden="true" />
            <span className="hidden sm:inline">
              {profile.name ? profile.name.split(' ')[0] : 'Profile'}
            </span>
            <span className="tabular-nums font-mono text-[11px] opacity-75 group-hover:opacity-100 transition-opacity">
              {profile.completeness}%
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
