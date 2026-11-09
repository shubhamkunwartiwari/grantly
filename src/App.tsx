import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, AlertTriangle } from 'lucide-react';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CookieBanner } from './components/layout/CookieBanner';
import { ToastContainer } from './components/ui/Toast';
import { CommandPalette } from './components/ui/CommandPalette';
import { Skeleton } from './components/ui/Skeleton';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { BackToTop } from './components/ui/BackToTop';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useGrantlyStore } from './lib/store';
import { initAnalytics } from './lib/analytics';

// Lazy-loaded route views
const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage').then((m) => ({ default: m.DiscoverPage })));
const ScholarshipDetailPage = lazy(() =>
  import('./pages/ScholarshipDetailPage').then((m) => ({ default: m.ScholarshipDetailPage }))
);
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const TrackerPage = lazy(() => import('./pages/TrackerPage').then((m) => ({ default: m.TrackerPage })));
const CalendarPage = lazy(() => import('./pages/CalendarPage').then((m) => ({ default: m.CalendarPage })));
const ComparePage = lazy(() => import('./pages/ComparePage').then((m) => ({ default: m.ComparePage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage').then((m) => ({ default: m.ThankYouPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then((m) => ({ default: m.TermsPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const RouteLoadingFallback: React.FC = () => (
  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 space-y-6 w-full">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-4 w-96 max-w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
      <Skeleton className="h-48 rounded-[14px]" />
      <Skeleton className="h-48 rounded-[14px]" />
      <Skeleton className="h-48 rounded-[14px]" />
    </div>
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col w-full"
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/scholarships/:id" element={<ScholarshipDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCookieSettingsOpen, setIsCookieSettingsOpen] = useState(false);

  const isOnline = useOnlineStatus();
  const isStorageBlocked = useGrantlyStore((state) => state.isStorageBlocked);
  const theme = useGrantlyStore((state) => state.theme);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize analytics if consent was already given
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <div className="flex flex-col min-h-dvh relative selection:bg-accent-saffron/20 selection:text-ink-primary">
      {/* Scroll Progress Hairline Indicator */}
      <ScrollProgress />

      {/* Paper Grain Overlay */}
      <div className="paper-grain fixed inset-0 pointer-events-none z-50 opacity-40" aria-hidden="true" />

      {/* Accessibility Skip-to-Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-brand-primary focus:text-brand-contrast focus:rounded-[8px] focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Offline Notice Banner */}
      {!isOnline && (
        <div
          role="status"
          aria-live="polite"
          className="bg-semantic-warning-bg border-b border-semantic-warning/30 text-semantic-warning text-xs px-4 py-2 text-center flex items-center justify-center gap-2"
        >
          <WifiOff className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>You are currently browsing offline. Saved scholarships remain available.</span>
        </div>
      )}

      {/* Storage Blocked Notice Banner */}
      {isStorageBlocked && (
        <div
          role="status"
          aria-live="polite"
          className="bg-semantic-info-bg border-b border-semantic-info/30 text-semantic-info text-xs px-4 py-2 text-center flex items-center justify-center gap-2"
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Browser local storage is restricted. Operating in memory-only mode.</span>
        </div>
      )}

      {/* Global Header */}
      <Header onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 flex flex-col focus:outline-none" tabIndex={-1}>
        <Suspense fallback={<RouteLoadingFallback />}>
          <AnimatedRoutes />
        </Suspense>
      </main>

      {/* Global Footer */}
      <Footer onOpenCookieSettings={() => setIsCookieSettingsOpen(true)} />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Cookie Consent Banner */}
      <CookieBanner
        forceOpen={isCookieSettingsOpen}
        onCloseSettings={() => setIsCookieSettingsOpen(false)}
      />

      {/* Command Search Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Back to Top floating trigger */}
      <BackToTop />
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
