import { Link } from 'react-router-dom';
import { Mail, MapPin, Shield, Info } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';
import { Logo } from '../ui/Logo';

interface FooterProps {
  onOpenCookieSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCookieSettings }) => {
  return (
    <footer className="w-full bg-surface-card border-t border-border-hairline mt-auto text-ink-muted text-sm pb-20 md:pb-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="inline-block" aria-label="Grantly Home">
              <Logo size="md" variant="full" />
            </Link>
            <p className="text-xs text-ink-muted leading-relaxed">
              {SITE_CONFIG.tagline}
            </p>
            <div className="pt-2 text-xs text-ink-muted space-y-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" aria-hidden="true" />
                <span>{SITE_CONFIG.contact.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-primary shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="hover:text-ink-primary underline underline-offset-2"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Pillars Col */}
          <div>
            <h4 className="font-serif text-base text-ink-primary mb-3">Four Pillars</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/discover" className="hover:text-ink-primary transition-colors">
                  <span className="font-mono text-ink-faint mr-1">01</span> Discover
                </Link>
              </li>
              <li>
                <Link to="/discover" className="hover:text-ink-primary transition-colors">
                  <span className="font-mono text-ink-faint mr-1">02</span> Understand
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="hover:text-ink-primary transition-colors">
                  <span className="font-mono text-ink-faint mr-1">03</span> Apply
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="hover:text-ink-primary transition-colors">
                  <span className="font-mono text-ink-faint mr-1">04</span> Track
                </Link>
              </li>
            </ul>
          </div>

          {/* Product & Tools */}
          <div>
            <h4 className="font-serif text-base text-ink-primary mb-3">Platform Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-ink-primary transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="hover:text-ink-primary transition-colors">
                  Deadlines & iCal Export
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-ink-primary transition-colors">
                  Side-by-Side Comparison
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-ink-primary transition-colors">
                  Eligibility Profile & Data
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="font-serif text-base text-ink-primary mb-3">Transparency</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-ink-primary transition-colors">
                  About & Matching Algorithm
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-ink-primary transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-ink-primary transition-colors">
                  Privacy Policy (Local Data)
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-ink-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenCookieSettings}
                  className="hover:text-ink-primary transition-colors text-left"
                >
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Notice of sample dataset & copyright */}
        <div className="pt-6 border-t border-border-hairline flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-ink-muted">
          <div className="flex items-start gap-2 max-w-2xl">
            <Info className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-normal">
              <strong className="text-ink-primary font-medium">Sample Data Notice: </strong>
              {SITE_CONFIG.links.sampleNotice}
            </p>
          </div>
          <div className="whitespace-nowrap text-ink-faint">
            © {new Date().getFullYear()} Grantly Platform.
          </div>
        </div>
      </div>
    </footer>
  );
};
