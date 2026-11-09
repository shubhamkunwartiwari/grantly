import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Filter, Calendar, Kanban, FileCheck } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { Button } from '../components/ui/Button';
import { DisclosureItem } from '../components/ui/Disclosure';
import { ScholarshipCard } from '../components/scholarship/ScholarshipCard';
import { SCHOLARSHIPS } from '../data/scholarships';
import { StickyMobileCta } from '../components/layout/StickyMobileCta';
import { SITE_CONFIG } from '../config/site';
import { ScrollReveal } from '../components/ui/ScrollReveal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  usePageMeta({
    title: 'Grantly – Unified Scholarship Discovery & Management',
    description:
      'Every scholarship you qualify for, in one calm place. Discover opportunities, understand eligibility plainly, prepare applications, and track deadlines.',
  });

  // Curate 3 featured scholarships representing different categories
  const previewScholarships = [SCHOLARSHIPS[0], SCHOLARSHIPS[2], SCHOLARSHIPS[4]];

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 border-b border-border-hairline">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Headline & CTAs (Comes out from left) */}
            <div className="lg:col-span-7">
              <ScrollReveal direction="left" duration={0.5} className="space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-ink-muted bg-surface-card px-3 py-1 rounded-[6px] border border-border-hairline">
                  <span className="w-2 h-2 rounded-full bg-accent-saffron" aria-hidden="true" />
                  <span>Unified Education Assistance Platform</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] text-ink-primary font-normal leading-[1.12] tracking-tight text-balance">
                  Every scholarship you qualify for, in one calm place.
                </h1>

                <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl text-pretty font-body">
                  Accessing financial aid shouldn't feel like navigating a maze. Grantly unifies opportunities across governments, universities, and foundations with plain-language eligibility, guided preparation, and deadline tracking.
                </p>

                {/* Primary Actions (Above the fold on mobile & desktop) */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={() => navigate('/discover')}
                    leftIcon={<Compass className="w-4 h-4" />}
                  >
                    Find my scholarships
                  </Button>
                  <a
                    href="#how-it-works"
                    className="text-sm font-medium text-ink-muted hover:text-ink-primary underline underline-offset-4 py-2 px-1 transition-colors"
                  >
                    See how it works
                  </a>
                </div>

                {/* Trust Indicators */}
                <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-ink-muted border-t border-border-subtle">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
                    <span>50+ Fictional Verified Programs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                    <span>100% Private (Stored Locally)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                    <span>Zero Ads or Sponsored Clutter</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Composed Hero Visual (Comes out from right) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <ScrollReveal direction="right" duration={0.5} delay={0.15} className="w-full max-w-md">
                <div className="w-full bg-surface-card border border-border-hairline rounded-[18px] shadow-lg p-6 relative overflow-hidden">
                  {/* Visual Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-accent-saffron/80" />
                      <span className="font-serif text-sm font-medium text-ink-primary">
                        Upcoming Deadlines Timeline
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-ink-muted bg-surface-raised px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  </div>

                  {/* Timeline Items with tactile hover micro-interactions */}
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-[10px] bg-surface-raised/70 border border-border-subtle hover:border-brand-primary/40 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 flex items-start justify-between gap-3 group cursor-pointer">
                      <div className="space-y-1 min-w-0">
                        <div className="text-[11px] font-mono text-ink-muted">Closes tomorrow</div>
                        <div className="font-serif text-sm text-ink-primary font-medium truncate group-hover:text-brand-primary transition-colors">
                          Pacific Ocean Health Marine Grant
                        </div>
                        <div className="text-[11px] text-ink-muted">AUD 60,000 · Full Tuition</div>
                      </div>
                      <span className="shrink-0 font-mono text-xs px-2 py-1 rounded bg-accent-light text-accent-deep border border-accent-saffron/30 font-semibold group-hover:scale-105 transition-transform">
                        1d left
                      </span>
                    </div>

                    <div className="p-3.5 rounded-[10px] bg-surface-card border border-border-hairline hover:border-brand-primary/40 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 flex items-start justify-between gap-3 shadow-xs group cursor-pointer">
                      <div className="space-y-1 min-w-0">
                        <div className="text-[11px] font-mono text-ink-muted">In 4 days</div>
                        <div className="font-serif text-sm text-ink-primary font-medium truncate group-hover:text-brand-primary transition-colors">
                          Helio Aerospace Merit Award
                        </div>
                        <div className="text-[11px] text-ink-muted">USD 15,000 · Merit Based</div>
                      </div>
                      <span className="shrink-0 font-mono text-xs px-2 py-1 rounded bg-surface-raised text-ink-primary border border-border-hairline group-hover:scale-105 transition-transform">
                        4d left
                      </span>
                    </div>

                    <div className="p-3.5 rounded-[10px] bg-surface-raised/40 border border-border-subtle hover:border-brand-primary/40 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 flex items-start justify-between gap-3 group cursor-pointer">
                      <div className="space-y-1 min-w-0">
                        <div className="text-[11px] font-mono text-ink-muted">In 14 days</div>
                        <div className="font-serif text-sm text-ink-primary font-medium truncate group-hover:text-brand-primary transition-colors">
                          Lumina Clean Energy Fellowship
                        </div>
                        <div className="text-[11px] text-ink-muted">USD 48,000 · Annual Grant</div>
                      </div>
                      <span className="shrink-0 font-mono text-xs px-2 py-1 rounded bg-surface-raised text-ink-muted group-hover:scale-105 transition-transform">
                        14d left
                      </span>
                    </div>
                  </div>

                  {/* Sub-card stamp */}
                  <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-ink-muted">
                    <span>Match rating computed</span>
                    <span className="font-serif text-brand-primary font-semibold">94% Aligned</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR PILLARS EDITORIAL SEQUENCE (Alternating Left/Right Emergence) */}
      <section className="py-16 md:py-24 border-b border-border-hairline bg-surface-card/40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <ScrollReveal direction="up" className="max-w-2xl mb-12">
            <div className="text-xs font-mono uppercase tracking-wider text-brand-primary font-semibold mb-2">
              The Architecture
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-ink-primary font-normal tracking-tight">
              Designed around the four stages of student financial support.
            </h2>
            <p className="text-sm sm:text-base text-ink-muted mt-2 leading-relaxed">
              We replaced disjointed provider websites, conflicting eligibility rules, and forgotten spreadsheets with a calm, unified digital journey.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SITE_CONFIG.pillars.map((pillar, idx) => (
              <ScrollReveal
                key={pillar.id}
                direction="alternate"
                index={idx}
                delay={idx * 0.08}
                duration={0.42}
                className="h-full"
              >
                <div className="group h-full bg-surface-card border border-border-hairline rounded-[14px] p-6 flex flex-col justify-between hover:border-brand-primary/50 hover:shadow-md hover:-translate-y-1.5 transition-all duration-250 ease-out">
                  <div>
                    <div className="font-mono text-2xl font-normal text-brand-primary mb-3 transition-transform duration-200 group-hover:scale-110 group-hover:translate-x-1 inline-block">
                      {pillar.number}
                    </div>
                    <h3 className="font-serif text-xl text-ink-primary font-medium mb-1 group-hover:text-brand-primary transition-colors">
                      {pillar.title}
                    </h3>
                    <div className="text-xs font-semibold text-accent-deep mb-3">
                      {pillar.tagline}
                    </div>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      {pillar.summary}
                    </p>
                  </div>
                  <div className="pt-6 mt-4 border-t border-border-subtle">
                    <Link
                      to={pillar.id === 'track' ? '/tracker' : '/discover'}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary hover:underline group-hover:translate-x-1 transition-transform duration-200"
                    >
                      <span>Explore {pillar.title}</span>
                      <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LIVE PREVIEW OF REAL DATA */}
      <section className="py-16 md:py-24 border-b border-border-hairline">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <ScrollReveal direction="left" duration={0.4}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-brand-primary font-semibold mb-1">
                  Live Catalog Preview
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal">
                  Curated Opportunities
                </h2>
                <p className="text-xs sm:text-sm text-ink-muted mt-1">
                  A sample of active awards currently indexed with verified criteria.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/discover')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                View all 50 scholarships
              </Button>
            </div>
          </ScrollReveal>

          {/* List display with alternating directional entry */}
          <div className="space-y-4">
            {previewScholarships.map((scholarship, idx) => (
              <ScrollReveal
                key={scholarship.id}
                direction="alternate"
                index={idx}
                delay={idx * 0.08}
                duration={0.45}
              >
                <ScholarshipCard scholarship={scholarship} viewMode="list" />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW MATCHING WORKS (3 plain steps with left, up, right entrance) */}
      <section id="how-it-works" className="py-16 md:py-24 border-b border-border-hairline bg-surface-card/30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <ScrollReveal direction="up" duration={0.4}>
            <div className="max-w-xl mx-auto text-center mb-12">
              <div className="text-xs font-mono uppercase tracking-wider text-brand-primary font-semibold mb-2">
                Transparency First
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal">
                How matching works in 3 plain steps.
              </h2>
              <p className="text-sm text-ink-muted mt-2">
                No black-box algorithms. We calculate eligibility using deterministic rules that you can inspect and verify.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal direction="left" delay={0.05} duration={0.45} className="h-full">
              <div className="h-full p-6 bg-surface-card border border-border-hairline rounded-[14px] text-center space-y-3 hover:border-brand-primary/40 hover:-translate-y-1 transition-all duration-200">
                <div className="w-12 h-12 rounded-full bg-brand-light text-brand-primary mx-auto flex items-center justify-center font-mono font-bold">
                  1
                </div>
                <h3 className="font-serif text-lg text-ink-primary font-medium">
                  Set Your Academic Baseline
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Provide your study level, field of study, citizenship, and optional GPA in your local profile. No registration or email required.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.15} duration={0.45} className="h-full">
              <div className="h-full p-6 bg-surface-card border border-border-hairline rounded-[14px] text-center space-y-3 hover:border-brand-primary/40 hover:-translate-y-1 transition-all duration-200">
                <div className="w-12 h-12 rounded-full bg-brand-light text-brand-primary mx-auto flex items-center justify-center font-mono font-bold">
                  2
                </div>
                <h3 className="font-serif text-lg text-ink-primary font-medium">
                  Deconstruct Every Rule
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Grantly compares your profile against institutional criteria and grades each rule as Meets, Likely, Needs Check, or Unmet.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.25} duration={0.45} className="h-full">
              <div className="h-full p-6 bg-surface-card border border-border-hairline rounded-[14px] text-center space-y-3 hover:border-brand-primary/40 hover:-translate-y-1 transition-all duration-200">
                <div className="w-12 h-12 rounded-full bg-brand-light text-brand-primary mx-auto flex items-center justify-center font-mono font-bold">
                  3
                </div>
                <h3 className="font-serif text-lg text-ink-primary font-medium">
                  Track and Prepare with Ease
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Move qualifying scholarships directly into your visual Kanban board with auto-generated document checklists and iCal exports.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. FAQ DISCLOSURES */}
      <section className="py-16 md:py-24 border-b border-border-hairline">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <ScrollReveal direction="up" duration={0.4}>
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary font-normal">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-ink-muted mt-2">
                Clear answers regarding privacy, data models, and platform access.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1} duration={0.45}>
            <div className="bg-surface-card border border-border-hairline rounded-[16px] p-6 divide-y divide-border-subtle shadow-2xs">
              <DisclosureItem id="faq-1" title="Is Grantly free to use?" defaultOpen>
                Yes, Grantly is completely free and open for students. There are no paywalls, sponsored placements, or predatory lead-generation forms.
              </DisclosureItem>
              <DisclosureItem id="faq-2" title="Where is my student profile data stored?">
                Your profile answers, saved bookmarks, and tracker Kanban cards are kept strictly in your local browser storage (localStorage). Nothing is uploaded to a remote user database.
              </DisclosureItem>
              <DisclosureItem id="faq-3" title="Are these scholarships real offers?">
                All 50 scholarship listings and provider foundations on Grantly are realistic fictional fixtures crafted for this hackathon evaluation. They reflect real academic scenarios, funding amounts, and criteria models.
              </DisclosureItem>
              <DisclosureItem id="faq-4" title="Can I export my deadlines to my own calendar?">
                Yes. Every scholarship detail page and the calendar view include client-side RFC 5545 .ics exports that import seamlessly into Google Calendar, Apple Calendar, and Outlook.
              </DisclosureItem>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. CLOSING CTA */}
      <section className="py-16 md:py-20 text-center bg-surface-raised/40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal direction="up" duration={0.45}>
            <div className="space-y-6">
              <h2 className="font-serif text-2xl sm:text-4xl text-ink-primary font-normal tracking-tight">
                Start your stress-free scholarship search today.
              </h2>
              <p className="text-sm sm:text-base text-ink-muted max-w-lg mx-auto">
                Find opportunities matched to your degree, read clear eligibility breakdowns, and track deadlines with confidence.
              </p>
              <div>
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => navigate('/discover')}
                  leftIcon={<Compass className="w-4 h-4" />}
                >
                  Explore scholarships
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Sticky Mobile CTA for Landing Page */}
      <StickyMobileCta />
    </div>
  );
};
