import React from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SITE_CONFIG } from '../config/site';

export const TermsPage: React.FC = () => {
  usePageMeta({
    title: 'Terms of Service | Grantly',
    description:
      'Plain-language terms of service outlining demonstration guidelines, fictional sample listings, and limitation of liability.',
  });

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-8 text-ink-primary">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-border-hairline">
        <div className="text-xs font-mono text-ink-muted">Terms of Usage</div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-ink-muted">
          Last revised: November 2026 · Demonstration and evaluation guidelines
        </p>
      </div>

      <div className="space-y-6 text-sm text-ink-muted leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-xl text-ink-primary font-medium">
            1. Nature of the Service (Sample Demonstration)
          </h2>
          <p>
            Grantly is a frontend web application developed for competitive hackathon evaluation. <strong>All scholarship programs, foundation names, donor endowments, award amounts, and criteria matrices listed on this website are fictional sample fixtures.</strong>
          </p>
          <p>
            They do not constitute binding financial commitments, contractual agreements, or actual financial disbursements by real-world organizations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-ink-primary font-medium">
            2. Match Scores & Educational Guidance
          </h2>
          <p>
            Match scores (0–100%) and eligibility verdicts (Meets, Likely, Needs Check, Does Not Meet) are computed deterministically against fictional criteria models to illustrate UX possibilities. They should not be relied upon as accredited educational counseling.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-ink-primary font-medium">
            3. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, Grantly and its contributors disclaim all warranties, express or implied, regarding site accuracy, uptime, or data loss arising from browser cache clearing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-ink-primary font-medium">
            4. Inquiries
          </h2>
          <p>
            Questions regarding these demonstration terms can be directed to:
          </p>
          <div className="p-4 bg-surface-card rounded-[10px] border border-border-hairline text-xs text-ink-primary space-y-1">
            <div><strong>Email: </strong><a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-brand-primary hover:underline">{SITE_CONFIG.contact.email}</a></div>
            <div><strong>Location: </strong>{SITE_CONFIG.contact.location}</div>
          </div>
        </section>
      </div>
    </div>
  );
};
