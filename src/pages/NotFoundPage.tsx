import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Home, Compass, Kanban, Calendar, ArrowRight } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  usePageMeta({
    title: 'Page Not Found (404) | Grantly',
    description: 'The requested page could not be located on the Grantly platform.',
  });

  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex, nofollow');

    return () => {
      robotsMeta?.setAttribute('content', 'index, follow');
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/discover?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/discover');
    }
  };

  const POPULAR_LINKS = [
    { label: 'Discover Scholarships', path: '/discover', icon: Compass },
    { label: 'Application Board', path: '/tracker', icon: Kanban },
    { label: 'Deadlines Calendar', path: '/calendar', icon: Calendar },
    { label: 'Student Dashboard', path: '/dashboard', icon: Home },
  ];

  return (
    <div className="max-w-[700px] mx-auto px-4 py-16 md:py-24 text-center">
      <div className="bg-surface-card border border-border-hairline rounded-[20px] p-8 sm:p-12 shadow-sm space-y-6">
        <div className="font-mono text-4xl sm:text-5xl font-bold text-brand-primary">
          404
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal tracking-tight">
            This page has moved or does not exist.
          </h1>
          <p className="text-sm text-ink-muted max-w-md mx-auto">
            The scholarship dossier or page link you followed may have expired or been moved.
          </p>
        </div>

        {/* Search Box on 404 */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search scholarship title, field, or provider..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface-raised border border-border-subtle rounded-[8px] text-ink-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <Button type="submit" size="sm" variant="primary">
            Search
          </Button>
        </form>

        {/* Popular Quick Links */}
        <div className="pt-4 border-t border-border-subtle text-left max-w-md mx-auto space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            Popular Destinations
          </div>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="p-2.5 rounded-[8px] bg-surface-raised hover:bg-surface-raised/80 border border-border-subtle text-xs font-medium text-ink-primary flex items-center gap-2 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-brand-primary" />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Home Action */}
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/')} leftIcon={<Home className="w-3.5 h-3.5" />}>
            Return to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};
