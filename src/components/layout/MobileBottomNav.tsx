import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Compass, Kanban, Calendar, User } from 'lucide-react';
import { useGrantlyStore } from '../../lib/store';

export const MobileBottomNav: React.FC = () => {
  const profile = useGrantlyStore((state) => state.profile);

  const items = [
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Tracker', path: '/tracker', icon: Kanban },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Profile', path: '/profile', icon: User, badge: `${profile.completeness}%` },
  ];

  return (
    <nav
      aria-label="Mobile navigation bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-card/95 backdrop-blur-md border-t border-border-hairline safe-bottom shadow-lg"
    >
      <div className="grid grid-cols-4 h-14 relative">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-h-[44px] text-[11px] font-medium transition-all duration-200 relative group active:scale-92 ${
                  isActive
                    ? 'text-brand-primary'
                    : 'text-ink-muted hover:text-ink-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-active-pill"
                      className="absolute top-0 inset-x-2 h-[2.5px] bg-brand-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                  <div className="relative transition-transform duration-200 group-hover:-translate-y-0.5">
                    <Icon className="w-5 h-5 mb-0.5 transition-transform duration-200 group-active:scale-90" aria-hidden="true" />
                    {item.badge && (
                      <span className="absolute -top-1 -right-2 text-[8px] font-mono font-bold bg-accent-light text-accent-deep border border-accent-saffron/40 px-1 rounded-full shadow-2xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="leading-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
