import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Scale, CheckCircle2, ArrowRight } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SITE_CONFIG } from '../config/site';

export const AboutPage: React.FC = () => {
  usePageMeta({
    title: 'About Grantly & Matching Transparency',
    description:
      'Learn how Grantly unifies educational financial assistance across providers with plain-language eligibility and deterministic matching.',
  });

  return (
    <div className="max-w-[880px] mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-border-hairline pb-8">
        <div className="text-xs font-mono text-ink-muted">Platform Manifesto</div>
        <h1 className="font-serif text-3xl sm:text-5xl text-ink-primary font-normal tracking-tight">
          Transforming educational assistance into a calm, unified journey.
        </h1>
        <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-body">
          Every year, millions of dollars in educational scholarships go unclaimed simply because students never discover them, cannot parse 40-page PDFs of legal criteria, or miss obscure deadlines scattered across fifty portals.
        </p>
      </div>

      {/* The Problem Statement */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-ink-primary font-normal">
          The Problem We Solve
        </h2>
        <div className="p-6 bg-surface-card border border-border-hairline rounded-[14px] text-ink-muted text-sm leading-relaxed space-y-3">
          <p>
            "Accessing educational financial assistance can be a complicated journey for students. Finding relevant opportunities, understanding available options, navigating application processes, and keeping track of important information can often create unnecessary challenges."
          </p>
          <p className="text-xs text-ink-faint italic">
            — Hackathon Challenge Brief
          </p>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl text-ink-primary font-normal">
          The Four Architectural Pillars
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SITE_CONFIG.pillars.map((pillar) => (
            <div key={pillar.id} className="p-5 bg-surface-card border border-border-hairline rounded-[12px] space-y-2">
              <div className="font-mono text-sm font-semibold text-brand-primary">
                {pillar.number} · {pillar.title}
              </div>
              <h3 className="font-serif text-base text-ink-primary font-medium">
                {pillar.tagline}
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                {pillar.summary}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How Matching Works */}
      <section className="space-y-4 pt-4 border-t border-border-hairline">
        <h2 className="font-serif text-2xl text-ink-primary font-normal">
          Deterministic Scoring, Zero Guesswork
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed">
          Unlike black-box algorithms that sell user attention, Grantly calculates your match percentage using transparent, weighted criteria:
        </p>
        <ul className="space-y-2 text-xs text-ink-primary bg-surface-card p-5 rounded-[12px] border border-border-hairline list-disc list-inside">
          <li><strong>Citizenship & Residency (25% weight):</strong> Verified against geographical endowment charters.</li>
          <li><strong>Academic Degree Level (25% weight):</strong> Direct compatibility with undergraduate, postgraduate, or doctoral tracks.</li>
          <li><strong>Disciplinary Alignment (20% weight):</strong> Major and faculty relevance.</li>
          <li><strong>GPA Baseline (15% weight):</strong> Grade thresholds evaluated on a normalized scale.</li>
          <li><strong>Demonstrated Need & Focus (15% weight):</strong> Financial need priority and shared research themes.</li>
        </ul>
      </section>

      {/* Sample Data Notice */}
      <section className="p-5 bg-surface-raised border border-border-subtle rounded-[14px] text-xs space-y-2">
        <div className="font-semibold text-ink-primary">Sample Data Notice</div>
        <p className="text-ink-muted leading-relaxed">
          {SITE_CONFIG.links.sampleNotice} All organization names, award amounts, and criteria are realistic simulations developed for this demonstration.
        </p>
      </section>
    </div>
  );
};
