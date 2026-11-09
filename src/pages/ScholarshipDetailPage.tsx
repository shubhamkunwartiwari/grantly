import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Bookmark, Scale, Share2, Printer, Plus, Check, ArrowLeft, ExternalLink, Calendar, MapPin, Building2, AlertCircle } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGrantlyStore } from '../lib/store';
import { fetchScholarshipById, fetchSimilarScholarships } from '../lib/api';
import { Scholarship } from '../types';
import { QualifyVerdictPanel } from '../components/scholarship/QualifyVerdictPanel';
import { HowToApplyRoadmap } from '../components/scholarship/HowToApplyRoadmap';
import { ScholarshipCard } from '../components/scholarship/ScholarshipCard';
import { DeadlineChip } from '../components/ui/DeadlineChip';
import { GenerativeThumbnail } from '../components/ui/GenerativeThumbnail';
import { MatchRing } from '../components/ui/MatchRing';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { StickyMobileCta } from '../components/layout/StickyMobileCta';
import { calculateScholarshipMatch } from '../lib/matching';
import { getDeadlineInfo, downloadIcsCalendar } from '../lib/dates';
import { track } from '../lib/analytics';

export const ScholarshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const profile = useGrantlyStore((state) => state.profile);
  const applications = useGrantlyStore((state) => state.applications);
  const addApplication = useGrantlyStore((state) => state.addApplication);
  const savedScholarshipIds = useGrantlyStore((state) => state.savedScholarshipIds);
  const toggleSaveScholarship = useGrantlyStore((state) => state.toggleSaveScholarship);
  const compareIds = useGrantlyStore((state) => state.compareIds);
  const toggleCompare = useGrantlyStore((state) => state.toggleCompare);
  const addToast = useGrantlyStore((state) => state.addToast);

  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [similar, setSimilar] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setNotFound(false);

    fetchScholarshipById(id)
      .then((data) => {
        if (!data) {
          setNotFound(true);
        } else {
          setScholarship(data);
          track('scholarship_viewed', { id: data.id, title: data.title });
          fetchSimilarScholarships(data, 2).then(setSimilar);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  const scholarshipTitle = scholarship ? scholarship.title : 'Scholarship';
  usePageMeta({
    title: scholarship ? `${scholarship.title} | Grantly` : 'Scholarship Details | Grantly',
    description: scholarship
      ? `${scholarship.summary.slice(0, 150)}...`
      : 'Review scholarship requirements, eligibility breakdown, and application checklist.',
  });

  const isInTracker = scholarship
    ? Object.values(applications).some((a) => a.scholarshipId === scholarship.id)
    : false;
  const isSaved = scholarship ? savedScholarshipIds.includes(scholarship.id) : false;
  const isCompared = scholarship ? compareIds.includes(scholarship.id) : false;

  const match = scholarship ? calculateScholarshipMatch(scholarship, profile) : null;
  const deadlineInfo = scholarship ? getDeadlineInfo(scholarship.deadline) : null;

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        title: 'Link Copied',
        message: 'Scholarship link copied to your clipboard.',
        variant: 'success',
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 space-y-8 w-full">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="h-64 w-full rounded-[16px]" />
      </div>
    );
  }

  if (notFound || !scholarship) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <EmptyState
          title="Scholarship Not Found"
          description={`We could not locate a scholarship opportunity matching "${id}". The program may have completed its cycle or been updated.`}
          icon="search"
          actionLabel="Browse all open scholarships"
          onAction={() => navigate('/discover')}
        />
      </div>
    );
  }

  const formattedAmount = `${scholarship.amount.currency} ${scholarship.amount.max.toLocaleString()}`;
  const amountKindLabel =
    scholarship.amount.kind === 'full-tuition'
      ? 'Full Tuition Coverage'
      : scholarship.amount.kind === 'annual'
      ? 'Annual Renewable Grant'
      : 'One-time Discretionary Award';

  return (
    <div className="w-full pb-20">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="border-b border-border-hairline bg-surface-card/60">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link
            to="/discover"
            className="group inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand-primary transition-colors font-medium hover:-translate-x-0.5 transition-transform duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to Discovery</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              aria-label="Share scholarship"
              title="Copy share link"
              className="p-2 rounded-[8px] border border-border-hairline bg-surface-card text-ink-muted hover:text-ink-primary hover:border-brand-primary/40 hover:bg-surface-raised transition-all duration-200 hover:-translate-y-0.5 active:scale-90 cursor-pointer shadow-2xs"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              aria-label="Print summary"
              title="Print dossier"
              className="p-2 rounded-[8px] border border-border-hairline bg-surface-card text-ink-muted hover:text-ink-primary hover:border-brand-primary/40 hover:bg-surface-raised transition-all duration-200 hover:-translate-y-0.5 active:scale-90 cursor-pointer shadow-2xs no-print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleCompare(scholarship.id)}
              aria-label={isCompared ? 'Remove from comparison' : 'Compare with others'}
              title={isCompared ? 'In Compare' : 'Compare'}
              className={`p-2 rounded-[8px] border transition-all duration-200 hover:-translate-y-0.5 active:scale-90 cursor-pointer shadow-2xs ${
                isCompared
                  ? 'bg-accent-light text-accent-deep border-accent-saffron/40'
                  : 'bg-surface-card text-ink-muted hover:text-ink-primary border-border-hairline hover:border-accent-saffron/40 hover:bg-surface-raised'
              }`}
            >
              <Scale className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSaveScholarship(scholarship.id)}
              aria-label={isSaved ? 'Remove bookmark' : 'Bookmark scholarship'}
              title={isSaved ? 'Bookmarked' : 'Save'}
              className={`p-2 rounded-[8px] border transition-all duration-200 hover:-translate-y-0.5 active:scale-90 cursor-pointer shadow-2xs ${
                isSaved
                  ? 'bg-brand-light text-brand-primary border-brand-primary/30'
                  : 'bg-surface-card text-ink-muted hover:text-ink-primary border-border-hairline hover:border-brand-primary/40 hover:bg-surface-raised'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 space-y-10">
        {/* Header Hero Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <ScrollReveal direction="left" duration={0.45} className="lg:col-span-8">
            <div className="space-y-4">
              {/* Provider and Geographic Scope */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                <span className="font-semibold text-ink-primary flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand-primary" />
                  {scholarship.provider.name}
                </span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{scholarship.provider.type}</span>
                {scholarship.provider.country && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-ink-faint" />
                      {scholarship.provider.country}
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink-primary font-normal leading-[1.15] tracking-tight">
                {scholarship.title}
              </h1>

              {/* Summary */}
              <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-body">
                {scholarship.description}
              </p>

              {/* Tag metadata */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-muted pt-2">
                <span className="font-mono text-ink-faint">Tags:</span>
                {scholarship.tags.map((tag, idx) => (
                  <span key={idx} className="after:content-['·'] last:after:content-none after:ml-3">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Right Action Card */}
          <ScrollReveal direction="right" duration={0.45} className="lg:col-span-4">
            <div className="bg-surface-card border border-border-hairline rounded-[16px] p-6 shadow-sm space-y-5">
              {/* Amount */}
              <div className="pb-4 border-b border-border-subtle">
                <div className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  Funding Value
                </div>
                <div className="font-mono text-3xl font-bold text-ink-primary tabular-nums">
                  {formattedAmount}
                </div>
                <div className="text-xs text-ink-muted mt-0.5">{amountKindLabel}</div>
              </div>

              {/* Deadline Block */}
              <div className="space-y-2 pb-4 border-b border-border-subtle">
                <div className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                  Submission Target
                </div>
                <div className="flex items-center justify-between">
                  <DeadlineChip deadline={scholarship.deadline} showExactDate />
                </div>
                {deadlineInfo?.date && (
                  <button
                    type="button"
                    onClick={() => downloadIcsCalendar(scholarship)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary hover:underline mt-1 pt-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Export to Calendar (.ics)</span>
                  </button>
                )}
              </div>

              {/* Primary Action Button (Add to Tracker) */}
              <div className="space-y-3 pt-1">
                <Button
                  variant={isInTracker ? 'secondary' : 'primary'}
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    if (isInTracker) {
                      navigate('/tracker');
                    } else {
                      addApplication(scholarship.id);
                    }
                  }}
                  leftIcon={
                    isInTracker ? (
                      <Check className="w-4 h-4 text-semantic-success" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )
                  }
                >
                  {isInTracker ? 'Open in Tracker' : 'Add to My Tracker'}
                </Button>

                {/* Safe Official URL Placeholder with graceful note */}
                <div className="text-center">
                  <a
                    href="#official-note"
                    onClick={(e) => {
                      e.preventDefault();
                      addToast({
                        title: 'Sample Data Portal',
                        message: 'This program is a fictional hackathon fixture. Track your checklist in Grantly!',
                        variant: 'info',
                      });
                    }}
                    className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink-primary underline underline-offset-2"
                  >
                    <span>Provider application portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* 2. UNDERSTAND PILLAR: Do I Qualify? Panel */}
        {match && (
          <ScrollReveal direction="left" duration={0.45}>
            <QualifyVerdictPanel scholarship={scholarship} profile={profile} />
          </ScrollReveal>
        )}

        {/* 3. APPLY PILLAR: How to Apply Chronological Sequence */}
        <ScrollReveal direction="right" duration={0.45}>
          <HowToApplyRoadmap scholarship={scholarship} />
        </ScrollReveal>

        {/* 4. SIMILAR SCHOLARSHIPS */}
        {similar.length > 0 && (
          <ScrollReveal direction="up" duration={0.4}>
            <section className="pt-8 border-t border-border-hairline space-y-4">
              <h2 className="font-serif text-2xl text-ink-primary font-normal">
                Similar Opportunities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {similar.map((sim, idx) => (
                  <ScrollReveal key={sim.id} direction="alternate" index={idx} delay={idx * 0.1}>
                    <ScholarshipCard scholarship={sim} />
                  </ScrollReveal>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}
      </div>

      {/* Sticky Mobile CTA on detail page */}
      <StickyMobileCta scholarshipId={scholarship.id} scholarshipTitle={scholarship.title} />
    </div>
  );
};
