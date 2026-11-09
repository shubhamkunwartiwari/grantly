import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Compass, ArrowRight, HelpCircle } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { Button } from '../components/ui/Button';

export const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { confirmed?: boolean; name?: string; email?: string } | null;

  usePageMeta({
    title: 'Thank You | Grantly',
    description: 'Confirmation of your message submission to the Grantly platform desk.',
  });

  // Ensure noindex meta tag is placed on thank-you page
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

  const isConfirmed = state?.confirmed;

  return (
    <div className="max-w-[700px] mx-auto px-4 py-16 md:py-24 text-center">
      <div className="bg-surface-card border border-border-hairline rounded-[20px] p-8 sm:p-12 shadow-sm space-y-6">
        {isConfirmed ? (
          <>
            <div className="w-16 h-16 rounded-full bg-semantic-success-bg text-semantic-success flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-brand-primary font-semibold">
                Submission Received
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-ink-primary font-normal tracking-tight">
                Thank you{state?.name ? `, ${state.name}` : ''}.
              </h1>
              <p className="text-sm sm:text-base text-ink-muted leading-relaxed max-w-md mx-auto">
                Your message has been safely logged. Our student assistance team typically reviews inquiries within 24 business hours.
              </p>
            </div>

            <div className="p-4 bg-surface-raised rounded-[12px] border border-border-subtle text-xs text-ink-muted max-w-sm mx-auto text-left space-y-1.5">
              <div className="font-semibold text-ink-primary">What happens next:</div>
              <ul className="list-disc list-inside space-y-1">
                <li>Confirmation copy dispatched to your inbox.</li>
                <li>Inquiry assigned to our verification desk.</li>
              </ul>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="primary"
                onClick={() => navigate('/discover')}
                leftIcon={<Compass className="w-4 h-4" />}
              >
                Return to scholarship discovery
              </Button>
            </div>
          </>
        ) : (
          /* Direct visit state */
          <>
            <div className="w-16 h-16 rounded-full bg-surface-raised text-ink-muted flex items-center justify-center mx-auto">
              <HelpCircle className="w-8 h-8" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h1 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal">
                Nothing to confirm yet
              </h1>
              <p className="text-sm text-ink-muted max-w-md mx-auto">
                You reached this confirmation page without submitting an active inquiry form.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button variant="secondary" onClick={() => navigate('/contact')}>
                Open contact form
              </Button>
              <Button variant="primary" onClick={() => navigate('/discover')}>
                Explore scholarships
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
