import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useGrantlyStore } from '../../lib/store';
import { Button } from '../ui/Button';

interface CookieBannerProps {
  forceOpen?: boolean;
  onCloseSettings?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  forceOpen = false,
  onCloseSettings,
}) => {
  const cookieConsent = useGrantlyStore((state) => state.cookieConsent);
  const setCookieConsent = useGrantlyStore((state) => state.setCookieConsent);
  const [showManageModal, setShowManageModal] = useState(false);

  // If user already decided and forceOpen is false, don't show
  const isVisible = forceOpen || cookieConsent === null;

  if (!isVisible && !showManageModal) return null;

  const handleAcceptAll = () => {
    setCookieConsent('all');
    setShowManageModal(false);
    onCloseSettings?.();
  };

  const handleRejectNonEssential = () => {
    setCookieConsent('essential');
    setShowManageModal(false);
    onCloseSettings?.();
  };

  return (
    <>
      {/* Compact bottom notification banner */}
      <div
        role="region"
        aria-label="Privacy and cookies preferences"
        className="fixed bottom-16 md:bottom-4 left-4 right-4 md:left-auto md:right-4 z-40 md:max-w-xl bg-surface-card border border-border-hairline shadow-xl rounded-[14px] p-4 text-xs transition-all animate-in slide-in-from-bottom-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-primary shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-ink-primary text-sm mb-1">
              Privacy & Local Storage Choice
            </h3>
            <p className="text-ink-muted leading-relaxed mb-3">
              Grantly saves your eligibility profile and application checklist solely in your browser's local storage. We use privacy-preserving analytics only with your explicit consent.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="primary" onClick={handleAcceptAll}>
                Accept all
              </Button>
              <Button size="sm" variant="secondary" onClick={handleRejectNonEssential}>
                Reject non-essential
              </Button>
              <button
                type="button"
                onClick={() => setShowManageModal(true)}
                className="text-ink-muted hover:text-ink-primary underline underline-offset-2 px-2 py-1"
              >
                Manage
              </button>
            </div>
          </div>
          {forceOpen && onCloseSettings && (
            <button
              onClick={onCloseSettings}
              aria-label="Close cookie settings"
              className="p-1 text-ink-muted hover:text-ink-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Detailed Manage Preferences Modal */}
      {showManageModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Manage cookie and privacy preferences"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-ink-primary/40 backdrop-blur-xs"
            onClick={() => setShowManageModal(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-lg bg-surface-card border border-border-hairline rounded-[16px] shadow-2xl p-6 text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-4">
              <h3 className="font-serif text-xl text-ink-primary">Privacy Preferences</h3>
              <button
                onClick={() => setShowManageModal(false)}
                aria-label="Close preferences"
                className="p-1 text-ink-muted hover:text-ink-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-3 bg-surface-raised rounded-[10px] border border-border-subtle flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-ink-primary text-sm flex items-center gap-2">
                    <span>Strictly Essential Storage</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-light text-brand-primary">Always Active</span>
                  </div>
                  <p className="text-xs text-ink-muted mt-1 leading-normal">
                    Preserves your profile questionnaire answers, active tracker Kanban cards, and saved theme preference in browser localStorage.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-surface-card rounded-[10px] border border-border-hairline flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-ink-primary text-sm">
                    Performance & Discovery Analytics
                  </div>
                  <p className="text-xs text-ink-muted mt-1 leading-normal">
                    Anonymized telemetry via Vercel Web Analytics to measure search query patterns and prevent missing deadline errors.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
              <Button variant="secondary" onClick={handleRejectNonEssential}>
                Save Essential Only
              </Button>
              <Button variant="primary" onClick={handleAcceptAll}>
                Agree to All
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
