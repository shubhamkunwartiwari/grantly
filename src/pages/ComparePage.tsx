import React, { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Scale, X, Plus, Check, Clock, Compass, AlertCircle } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGrantlyStore } from '../lib/store';
import { SCHOLARSHIPS } from '../data/scholarships';
import { Scholarship } from '../types';
import { calculateScholarshipMatch } from '../lib/matching';
import { DeadlineChip } from '../components/ui/DeadlineChip';
import { MatchRing } from '../components/ui/MatchRing';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export const ComparePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const profile = useGrantlyStore((state) => state.profile);
  const compareIds = useGrantlyStore((state) => state.compareIds);
  const toggleCompare = useGrantlyStore((state) => state.toggleCompare);
  const clearCompare = useGrantlyStore((state) => state.clearCompare);

  usePageMeta({
    title: 'Compare Scholarships | Grantly',
    description:
      'Compare up to 3 scholarships side by side across funding amount, deadlines, academic levels, essay requirements, and eligibility match.',
  });

  // Sync comparison IDs to URL query params
  useEffect(() => {
    const urlIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];
    if (urlIds.length > 0 && compareIds.length === 0) {
      urlIds.slice(0, 3).forEach((id) => {
        if (!compareIds.includes(id)) {
          toggleCompare(id);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (compareIds.length > 0) {
      setSearchParams({ ids: compareIds.join(',') }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [compareIds]);

  const selectedScholarships = compareIds
    .map((id) => SCHOLARSHIPS.find((s) => s.id === id || s.slug === id))
    .filter((s): s is Scholarship => s !== undefined);

  if (selectedScholarships.length === 0) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16">
        <EmptyState
          title="No scholarships selected for comparison"
          description="Select up to three scholarships to evaluate funding amount, deadlines, degree requirements, and match scores side by side."
          icon="search"
          actionLabel="Find scholarships to compare"
          onAction={() => navigate('/discover')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-12 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border-hairline">
        <div>
          <div className="text-xs font-mono text-ink-muted mb-1">
            Side-by-Side Analysis
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-ink-primary font-normal tracking-tight">
            Compare Scholarships
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Evaluating {selectedScholarships.length} of 3 maximum programs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedScholarships.length < 3 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/discover')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add another
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={clearCompare}>
            Clear comparison
          </Button>
        </div>
      </div>

      {/* Comparison Matrix Table (Horizontal scroll with sticky header / first column on mobile) */}
      <div className="overflow-x-auto rounded-[16px] border border-border-hairline bg-surface-card shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-raised/40">
              <th className="p-4 sm:p-5 w-44 font-mono uppercase tracking-wider text-ink-muted font-normal sticky left-0 bg-surface-raised/90 backdrop-blur-xs z-10">
                Program
              </th>
              {selectedScholarships.map((s) => (
                <th key={s.id} className="p-4 sm:p-5 min-w-[240px] max-w-[320px] align-top">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[11px] text-ink-muted truncate mb-1">
                        {s.provider.name}
                      </div>
                      <Link
                        to={`/scholarships/${s.slug}`}
                        className="font-serif text-base text-ink-primary hover:text-brand-primary line-clamp-2 font-normal leading-snug"
                      >
                        {s.title}
                      </Link>
                    </div>
                    <button
                      onClick={() => toggleCompare(s.id)}
                      aria-label={`Remove ${s.title} from comparison`}
                      className="text-ink-muted hover:text-semantic-danger p-1 rounded hover:bg-semantic-danger-bg transition-all duration-200 hover:rotate-90 active:scale-90 shrink-0 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {/* Row 1: Match Score */}
            <tr className="hover:bg-surface-raised/40 transition-colors">
              <td className="p-4 sm:p-5 font-mono text-ink-muted font-medium sticky left-0 bg-surface-card z-10">
                Match Rating
              </td>
              {selectedScholarships.map((s) => {
                const match = calculateScholarshipMatch(s, profile);
                return (
                  <td key={s.id} className="p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <MatchRing score={match.score} size={42} />
                      <div>
                        <div className="font-semibold text-ink-primary">{match.verdict}</div>
                        <div className="text-[11px] text-ink-muted">{match.score}% alignment</div>
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Row 2: Funding Amount */}
            <tr>
              <td className="p-4 sm:p-5 font-mono text-ink-muted font-medium sticky left-0 bg-surface-card z-10">
                Award Amount
              </td>
              {selectedScholarships.map((s) => (
                <td key={s.id} className="p-4 sm:p-5">
                  <div className="font-mono text-base font-semibold text-ink-primary tabular-nums">
                    {s.amount.currency} {s.amount.max.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-ink-muted capitalize">
                    {s.amount.kind.replace('-', ' ')}
                  </div>
                </td>
              ))}
            </tr>

            {/* Row 3: Deadline */}
            <tr>
              <td className="p-4 sm:p-5 font-mono text-ink-muted font-medium sticky left-0 bg-surface-card z-10">
                Submission Target
              </td>
              {selectedScholarships.map((s) => (
                <td key={s.id} className="p-4 sm:p-5">
                  <DeadlineChip deadline={s.deadline} showExactDate />
                </td>
              ))}
            </tr>

            {/* Row 4: Study Level */}
            <tr>
              <td className="p-4 sm:p-5 font-mono text-ink-muted font-medium sticky left-0 bg-surface-card z-10">
                Study Levels
              </td>
              {selectedScholarships.map((s) => (
                <td key={s.id} className="p-4 sm:p-5 text-ink-primary">
                  {s.levels.map((l) => l.replace('_', ' ')).join(', ')}
                </td>
              ))}
            </tr>

            {/* Row 5: Fields */}
            <tr>
              <td className="p-4 sm:p-5 font-mono text-ink-muted font-medium sticky left-0 bg-surface-card z-10">
                Disciplines
              </td>
              {selectedScholarships.map((s) => (
                <td key={s.id} className="p-4 sm:p-5 text-ink-primary">
                  {s.fields.join(', ')}
                </td>
              ))}
            </tr>

            {/* Row 6: Minimum GPA */}
            <tr>
              <td className="p-4 sm:p-5 font-mono text-ink-muted font-medium sticky left-0 bg-surface-card z-10">
                GPA Baseline
              </td>
              {selectedScholarships.map((s) => (
                <td key={s.id} className="p-4 sm:p-5 text-ink-primary font-mono">
                  {s.minGpa ? `${s.minGpa} / 4.0 scale` : 'No minimum GPA'}
                </td>
              ))}
            </tr>

            {/* Row 7: Essay Requirement */}
            <tr>
              <td className="p-4 sm:p-5 font-mono text-ink-muted font-medium sticky left-0 bg-surface-card z-10">
                Essay Required
              </td>
              {selectedScholarships.map((s) => (
                <td key={s.id} className="p-4 sm:p-5 text-ink-primary">
                  {s.essayRequired ? 'Yes (Personal statement)' : 'No essay required'}
                </td>
              ))}
            </tr>

            {/* Row 8: Financial Need */}
            <tr>
              <td className="p-4 sm:p-5 font-mono text-ink-muted font-medium sticky left-0 bg-surface-card z-10">
                Need Consideration
              </td>
              {selectedScholarships.map((s) => (
                <td key={s.id} className="p-4 sm:p-5 text-ink-primary capitalize">
                  {s.financialNeed === 'none' ? 'Need-blind / Merit-only' : s.financialNeed}
                </td>
              ))}
            </tr>

            {/* Row 9: Renewable */}
            <tr>
              <td className="p-4 sm:p-5 font-mono text-ink-muted font-medium sticky left-0 bg-surface-card z-10">
                Renewability
              </td>
              {selectedScholarships.map((s) => (
                <td key={s.id} className="p-4 sm:p-5 text-ink-primary">
                  {s.renewable ? 'Multi-year renewable' : 'Single disbursement'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
