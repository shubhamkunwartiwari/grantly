import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, HardDrive, RefreshCw } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SITE_CONFIG } from '../config/site';

export const PrivacyPage: React.FC = () => {
  usePageMeta({
    title: 'Privacy Policy & Local Storage | Grantly',
    description:
      'Plain-language privacy policy explaining local-first storage, analytics consent, and data ownership on Grantly.',
  });

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-8 text-ink-primary">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-border-hairline">
        <div className="text-xs font-mono text-ink-muted">Data Governance</div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-ink-muted">
          Last revised: November 2026 · Plain-language student data standards
        </p>
      </div>

      {/* Demo disclaimer callout */}
      <div className="p-4 rounded-[12px] bg-surface-raised border border-border-subtle text-xs text-ink-muted leading-relaxed">
        <strong>Hackathon Demonstration Notice: </strong>
        This web application is an evaluation project. The text below outlines real local data handling mechanisms used in this software and serves as a demonstrative template rather than formal legal counsel.
      </div>

      <div className="space-y-6 text-sm text-ink-muted leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-xl text-ink-primary font-medium">
            1. Zero-Cloud Student Profile Storage
          </h2>
          <p>
            Grantly operates on a local-first architecture. Any details you enter into the eligibility profile (such as your citizenship, degree stage, field of study, or GPA) and any applications added to your Kanban tracker are saved exclusively within your browser's <code className="text-xs bg-surface-raised px-1.5 py-0.5 rounded font-mono text-ink-primary">localStorage</code>.
          </p>
          <p>
            We do not operate a remote student account database, do not require user logins, and do not transmit your academic records to third-party advertising brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-ink-primary font-medium">
            2. Privacy-Preserving Analytics
          </h2>
          <p>
            We use Vercel Web Analytics solely to measure query performance, index search volume, and dead links. This telemetry is strictly anonymized (no IP logging, no cross-site tracking cookies) and is <strong>only injected after your explicit cookie consent</strong>. You can revoke or accept this anytime via the Cookie Settings trigger in our footer.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-ink-primary font-medium">
            3. How to Export or Delete Your Data
          </h2>
          <p>
            Because your data resides in your browser, you retain total custody:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-ink-primary">
            <li><strong>Export:</strong> Download a full machine-readable JSON backup anytime from the <Link to="/profile" className="text-brand-primary underline">Profile Settings</Link> page.</li>
            <li><strong>Import:</strong> Restore or transfer records across devices using JSON files.</li>
            <li><strong>Delete:</strong> Clear your browser cookies/storage or click "Reset all records" in Profile Settings for immediate eradication.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-ink-primary font-medium">
            4. Contact Our Privacy Officer
          </h2>
          <p>
            For questions regarding our local data architecture, write to our team directly:
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
