import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Scale, Check, Clock, Globe, Award, Sparkles } from 'lucide-react';
import { Scholarship } from '../../types';
import { useGrantlyStore } from '../../lib/store';
import { calculateScholarshipMatch } from '../../lib/matching';
import { MatchRing } from '../ui/MatchRing';
import { GenerativeThumbnail } from '../ui/GenerativeThumbnail';
import { DeadlineChip } from '../ui/DeadlineChip';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  viewMode?: 'grid' | 'list';
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  viewMode = 'grid',
}) => {
  const profile = useGrantlyStore((state) => state.profile);
  const savedScholarshipIds = useGrantlyStore((state) => state.savedScholarshipIds);
  const toggleSaveScholarship = useGrantlyStore((state) => state.toggleSaveScholarship);
  const compareIds = useGrantlyStore((state) => state.compareIds);
  const toggleCompare = useGrantlyStore((state) => state.toggleCompare);

  const isSaved = savedScholarshipIds.includes(scholarship.id);
  const isCompared = compareIds.includes(scholarship.id);

  const match = calculateScholarshipMatch(scholarship, profile);

  // Format currency display
  const formattedAmount = `${scholarship.amount.currency} ${scholarship.amount.max.toLocaleString()}`;
  const amountKindLabel =
    scholarship.amount.kind === 'full-tuition'
      ? 'Full Tuition'
      : scholarship.amount.kind === 'annual'
      ? 'per year'
      : 'one-time';

  if (viewMode === 'list') {
    return (
      <article className="group bg-surface-card border border-border-hairline rounded-[14px] p-5 hover:border-brand-primary/50 hover:shadow-md hover:-translate-y-1 transition-all duration-250 ease-out flex flex-col md:flex-row md:items-center justify-between gap-5 relative">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          {/* Deterministic SVG Thumbnail with gentle hover scale */}
          <div className="overflow-hidden rounded-[10px] shrink-0">
            <GenerativeThumbnail id={scholarship.id} className="w-16 h-16 transition-transform duration-300 ease-out group-hover:scale-108" />
          </div>

          <div className="min-w-0 flex-1">
            {/* Provider and Location */}
            <div className="flex items-center gap-2 text-xs text-ink-muted mb-1 truncate">
              <span className="font-medium text-ink-primary truncate">{scholarship.provider.name}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{scholarship.provider.type}</span>
              {scholarship.provider.country && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{scholarship.provider.country}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h3 className="font-serif text-lg md:text-xl text-ink-primary font-normal group-hover:text-brand-primary transition-colors duration-200 line-clamp-1 mb-1.5">
              <Link to={`/scholarships/${scholarship.slug}`} className="focus-visible:outline-none focus-visible:underline">
                {scholarship.title}
              </Link>
            </h3>

            {/* Unboxed Eligibility Facts (Zero-Pill Rule) */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-muted">
              <span>{scholarship.levels.map((l) => l.replace('_', ' ')).join(', ')}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate max-w-xs">{scholarship.fields.slice(0, 2).join(', ')}</span>
              <span aria-hidden="true">·</span>
              <span>{scholarship.minGpa ? `${scholarship.minGpa} GPA min` : 'No GPA cutoff'}</span>
            </div>
          </div>
        </div>

        {/* Right side: Amount, Deadline, Match, Actions */}
        <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border-subtle">
          {/* Amount */}
          <div className="text-left md:text-right">
            <div className="font-mono text-base md:text-lg font-semibold text-ink-primary tabular-nums group-hover:text-brand-primary transition-colors">
              {formattedAmount}
            </div>
            <div className="text-[11px] text-ink-muted">{amountKindLabel}</div>
          </div>

          {/* Deadline */}
          <DeadlineChip deadline={scholarship.deadline} />

          {/* Match Ring with micro-pop on hover */}
          <div className="transition-transform duration-300 ease-out group-hover:scale-108">
            <MatchRing score={match.score} size={48} />
          </div>

          {/* Action buttons with tactile micro-interactions */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-border-subtle">
            <button
              onClick={() => toggleSaveScholarship(scholarship.id)}
              aria-label={isSaved ? `Remove bookmark for ${scholarship.title}` : `Bookmark ${scholarship.title}`}
              title={isSaved ? 'Bookmarked' : 'Save'}
              className={`w-9 h-9 flex items-center justify-center rounded-[8px] border transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                isSaved
                  ? 'bg-brand-light text-brand-primary border-brand-primary/30 shadow-2xs'
                  : 'bg-surface-card text-ink-muted hover:text-ink-primary hover:border-brand-primary/40 border-border-hairline'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} aria-hidden="true" />
            </button>
            <button
              onClick={() => toggleCompare(scholarship.id)}
              aria-label={isCompared ? `Remove ${scholarship.title} from comparison` : `Compare ${scholarship.title}`}
              title={isCompared ? 'Compared' : 'Compare'}
              className={`w-9 h-9 flex items-center justify-center rounded-[8px] border transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                isCompared
                  ? 'bg-accent-light text-accent-deep border-accent-saffron/40 shadow-2xs'
                  : 'bg-surface-card text-ink-muted hover:text-ink-primary hover:border-accent-saffron/40 border-border-hairline'
              }`}
            >
              <Scale className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  // Grid Card View (Default)
  return (
    <article className="group bg-surface-card border border-border-hairline rounded-[14px] p-5 hover:border-brand-primary/50 hover:shadow-md hover:-translate-y-1.5 transition-all duration-250 ease-out flex flex-col justify-between relative">
      <div>
        {/* Top Header: Generative thumbnail + Match Ring + Actions */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="overflow-hidden rounded-[10px] shrink-0">
            <GenerativeThumbnail id={scholarship.id} className="w-14 h-14 transition-transform duration-300 ease-out group-hover:scale-110" />
          </div>
          <div className="flex items-center gap-2">
            <div className="transition-transform duration-300 ease-out group-hover:scale-110">
              <MatchRing score={match.score} size={46} />
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => toggleSaveScholarship(scholarship.id)}
                aria-label={isSaved ? `Remove bookmark for ${scholarship.title}` : `Bookmark ${scholarship.title}`}
                title={isSaved ? 'Bookmarked' : 'Save'}
                className={`w-8 h-8 flex items-center justify-center rounded-[7px] border transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                  isSaved
                    ? 'bg-brand-light text-brand-primary border-brand-primary/30 shadow-2xs'
                    : 'bg-surface-card text-ink-muted hover:text-ink-primary hover:border-brand-primary/40 border-border-hairline'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} aria-hidden="true" />
              </button>
              <button
                onClick={() => toggleCompare(scholarship.id)}
                aria-label={isCompared ? `Remove ${scholarship.title} from compare` : `Compare ${scholarship.title}`}
                title={isCompared ? 'Compared' : 'Compare'}
                className={`w-8 h-8 flex items-center justify-center rounded-[7px] border transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                  isCompared
                    ? 'bg-accent-light text-accent-deep border-accent-saffron/40 shadow-2xs'
                    : 'bg-surface-card text-ink-muted hover:text-ink-primary hover:border-accent-saffron/40 border-border-hairline'
                }`}
              >
                <Scale className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Provider Metadata */}
        <div className="flex items-center gap-2 text-xs text-ink-muted mb-1.5 truncate">
          <span className="font-medium text-ink-primary truncate">{scholarship.provider.name}</span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{scholarship.provider.type}</span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg text-ink-primary font-normal group-hover:text-brand-primary transition-colors line-clamp-2 mb-2 leading-snug">
          <Link to={`/scholarships/${scholarship.slug}`} className="focus-visible:outline-none focus-visible:underline">
            {scholarship.title}
          </Link>
        </h3>

        {/* Short Summary */}
        <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed mb-4">
          {scholarship.summary}
        </p>

        {/* Unboxed Metadata (Zero-Pill Discipline) */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-muted pb-4 border-b border-border-subtle">
          <span>{scholarship.levels.map((l) => l.replace('_', ' ')).join(', ')}</span>
          <span aria-hidden="true">·</span>
          <span>{scholarship.minGpa ? `Min GPA: ${scholarship.minGpa}` : 'No GPA required'}</span>
          <span aria-hidden="true">·</span>
          <span>{scholarship.financialNeed === 'none' ? 'Merit-only' : 'Need considered'}</span>
        </div>
      </div>

      {/* Card Footer: Amount and Deadline */}
      <div className="flex items-center justify-between gap-3 pt-4 mt-2">
        <div>
          <div className="font-mono text-base font-semibold text-ink-primary tabular-nums">
            {formattedAmount}
          </div>
          <div className="text-[11px] text-ink-muted">{amountKindLabel}</div>
        </div>

        <DeadlineChip deadline={scholarship.deadline} />
      </div>
    </article>
  );
};
