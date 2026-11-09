import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, LayoutGrid, List, RotateCcw, X, AlertCircle, ArrowRight, UserPlus, Filter } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useDebounce } from '../hooks/useDebounce';
import { useGrantlyStore } from '../lib/store';
import { fetchScholarships, ScholarshipQueryResult } from '../lib/api';
import { Scholarship, StudyLevel, ProviderType, SortOption, FilterState } from '../types';
import { ScholarshipCard } from '../components/scholarship/ScholarshipCard';
import { ScholarshipCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Sheet } from '../components/ui/Sheet';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { track } from '../lib/analytics';

export const DiscoverPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const profile = useGrantlyStore((state) => state.profile);
  const viewMode = useGrantlyStore((state) => state.viewMode);
  const setViewMode = useGrantlyStore((state) => state.setViewMode);

  // Read initial values from URL search params
  const initialQuery = searchParams.get('q') || '';
  const initialLevel = searchParams.getAll('level') as StudyLevel[];
  const initialField = searchParams.getAll('field');
  const initialProvider = searchParams.getAll('provider') as ProviderType[];
  const initialCountry = searchParams.get('country') || '';
  const initialDeadlineWindow = (searchParams.get('deadline') || 'all') as FilterState['deadlineWindow'];
  const initialSort = (searchParams.get('sort') || 'match') as SortOption;
  const initialEssay = searchParams.get('essay') === 'true' ? true : searchParams.get('essay') === 'false' ? false : null;
  const initialNeed = searchParams.get('need') || '';

  const [query, setQuery] = useState(initialQuery);
  const [levels, setLevels] = useState<StudyLevel[]>(initialLevel);
  const [fields, setFields] = useState<string[]>(initialField);
  const [providerTypes, setProviderTypes] = useState<ProviderType[]>(initialProvider);
  const [country, setCountry] = useState(initialCountry);
  const [deadlineWindow, setDeadlineWindow] = useState<FilterState['deadlineWindow']>(initialDeadlineWindow);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [essayRequired, setEssayRequired] = useState<boolean | null>(initialEssay);
  const [need, setNeed] = useState<string>(initialNeed);

  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScholarshipQueryResult>({ scholarships: [], total: 0 });

  const debouncedQuery = useDebounce(query, 300);

  usePageMeta({
    title: 'Discover Scholarships | Grantly',
    description:
      'Search 50+ fictional scholarships across governments, universities, and foundations. Filter by study level, country, GPA, and deadlines.',
  });

  // Sync state changes to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    levels.forEach((l) => params.append('level', l));
    fields.forEach((f) => params.append('field', f));
    providerTypes.forEach((p) => params.append('provider', p));
    if (country) params.set('country', country);
    if (deadlineWindow !== 'all') params.set('deadline', deadlineWindow);
    if (sort !== 'match') params.set('sort', sort);
    if (essayRequired !== null) params.set('essay', String(essayRequired));
    if (need) params.set('need', need);

    // Keep error test param if present in URL
    if (searchParams.get('simulateError') === '1') {
      params.set('simulateError', '1');
    }

    setSearchParams(params, { replace: true });
  }, [debouncedQuery, levels, fields, providerTypes, country, deadlineWindow, sort, essayRequired, need]);

  // Load scholarships from API
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchScholarships(
        {
          query: debouncedQuery,
          levels,
          fields,
          providerTypes,
          country,
          deadlineWindow,
          sort,
          essayRequired,
          need: need as any,
        },
        profile
      );
      setResult(data);
      track('scholarship_search', { query: debouncedQuery, count: data.total });
    } catch (err: any) {
      setError(err?.message || 'Could not fetch scholarship directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [debouncedQuery, levels, fields, providerTypes, country, deadlineWindow, sort, essayRequired, need, profile]);

  // Available filter options
  const LEVEL_OPTIONS: { value: StudyLevel; label: string }[] = [
    { value: 'high_school', label: 'High School' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'postgraduate', label: 'Postgraduate' },
    { value: 'phd', label: 'Doctoral / PhD' },
  ];

  const FIELD_OPTIONS = [
    'Computer Science',
    'Engineering & Technology',
    'Medicine & Health',
    'Environmental Science',
    'Mathematics',
    'Architecture',
    'Fine Arts',
    'Public Policy',
    'Law',
    'Economics',
  ];

  const PROVIDER_OPTIONS: { value: ProviderType; label: string }[] = [
    { value: 'government', label: 'Government' },
    { value: 'university', label: 'University' },
    { value: 'foundation', label: 'Foundation' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'ngo', label: 'NGO / Non-profit' },
  ];

  const handleLevelToggle = (val: StudyLevel) => {
    setLevels((prev) => (prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]));
  };

  const handleFieldToggle = (val: string) => {
    setFields((prev) => (prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]));
  };

  const handleProviderToggle = (val: ProviderType) => {
    setProviderTypes((prev) => (prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]));
  };

  const clearAllFilters = () => {
    setQuery('');
    setLevels([]);
    setFields([]);
    setProviderTypes([]);
    setCountry('');
    setDeadlineWindow('all');
    setEssayRequired(null);
    setNeed('');
    setSort('match');
  };

  // Count active filter tags
  const activeFiltersCount =
    (debouncedQuery ? 1 : 0) +
    levels.length +
    fields.length +
    providerTypes.length +
    (country ? 1 : 0) +
    (deadlineWindow !== 'all' ? 1 : 0) +
    (essayRequired !== null ? 1 : 0) +
    (need ? 1 : 0);

  // Render filter sidebar controls
  const renderFilterControls = () => (
    <div className="space-y-6 text-xs text-ink-primary">
      {/* 1. Academic Level */}
      <div>
        <h4 className="font-mono uppercase tracking-wider text-[11px] text-ink-muted mb-2.5">
          Study Level
        </h4>
        <div className="space-y-1.5">
          {LEVEL_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 cursor-pointer py-1 px-1.5 rounded hover:bg-surface-raised transition-colors"
            >
              <input
                type="checkbox"
                checked={levels.includes(opt.value)}
                onChange={() => handleLevelToggle(opt.value)}
                className="w-4 h-4 rounded text-brand-primary border-border-hairline focus:ring-brand-primary accent-brand-primary"
              />
              <span className="text-sm font-normal">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Disciplines & Majors */}
      <div>
        <h4 className="font-mono uppercase tracking-wider text-[11px] text-ink-muted mb-2.5">
          Field of Study
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto overscroll-contain pr-1 scrollbar-thin">
          {FIELD_OPTIONS.map((fieldItem) => (
            <label
              key={fieldItem}
              className="flex items-center gap-2.5 cursor-pointer py-1 px-1.5 rounded hover:bg-surface-raised transition-colors"
            >
              <input
                type="checkbox"
                checked={fields.includes(fieldItem)}
                onChange={() => handleFieldToggle(fieldItem)}
                className="w-4 h-4 rounded text-brand-primary border-border-hairline focus:ring-brand-primary accent-brand-primary"
              />
              <span className="text-sm font-normal truncate">{fieldItem}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Deadline Urgency Window */}
      <div>
        <h4 className="font-mono uppercase tracking-wider text-[11px] text-ink-muted mb-2.5">
          Deadline Window
        </h4>
        <div className="space-y-1">
          {[
            { id: 'all', label: 'All Opportunities' },
            { id: 'open', label: 'Currently Open' },
            { id: '7days', label: 'Closing in 7 Days' },
            { id: '30days', label: 'Closing in 30 Days' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setDeadlineWindow(item.id as any)}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                deadlineWindow === item.id
                  ? 'bg-brand-light text-brand-primary font-medium'
                  : 'text-ink-muted hover:bg-surface-raised hover:text-ink-primary'
              }`}
            >
              <span>{item.label}</span>
              {deadlineWindow === item.id && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Provider Organization */}
      <div>
        <h4 className="font-mono uppercase tracking-wider text-[11px] text-ink-muted mb-2.5">
          Provider Type
        </h4>
        <div className="space-y-1.5">
          {PROVIDER_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 cursor-pointer py-1 px-1.5 rounded hover:bg-surface-raised transition-colors"
            >
              <input
                type="checkbox"
                checked={providerTypes.includes(opt.value)}
                onChange={() => handleProviderToggle(opt.value)}
                className="w-4 h-4 rounded text-brand-primary border-border-hairline focus:ring-brand-primary accent-brand-primary"
              />
              <span className="text-sm font-normal">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. Additional Filters */}
      <div>
        <h4 className="font-mono uppercase tracking-wider text-[11px] text-ink-muted mb-2.5">
          Requirements
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer py-1 px-1.5 rounded hover:bg-surface-raised">
            <input
              type="checkbox"
              checked={essayRequired === false}
              onChange={() => setEssayRequired(essayRequired === false ? null : false)}
              className="w-4 h-4 rounded text-brand-primary border-border-hairline focus:ring-brand-primary accent-brand-primary"
            />
            <span className="text-sm font-normal">No Essay Required</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer py-1 px-1.5 rounded hover:bg-surface-raised">
            <input
              type="checkbox"
              checked={need === 'none'}
              onChange={() => setNeed(need === 'none' ? '' : 'none')}
              className="w-4 h-4 rounded text-brand-primary border-border-hairline focus:ring-brand-primary accent-brand-primary"
            />
            <span className="text-sm font-normal">Need-Blind / Merit-Only</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-12 w-full">
      {/* 1. Header with Editorial Numbering */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-ink-muted mb-1.5">
          <span className="font-semibold text-brand-primary">01</span>
          <span>/ DISCOVER</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink-primary font-normal tracking-tight">
          Find Financial Assistance
        </h1>
        <p className="text-sm text-ink-muted mt-1 max-w-2xl">
          Search verified programs by study level, citizenship eligibility, and funding amounts.
        </p>
      </div>

      {/* Profile Incomplete Banner */}
      {profile.completeness < 50 && (
        <div className="mb-6 p-4 rounded-[12px] bg-brand-light/50 border border-brand-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-4 h-4 text-brand-primary shrink-0" aria-hidden="true" />
            <span className="text-ink-primary leading-normal">
              <strong>Personalized Match Score:</strong> Complete your degree stage and country in your profile to see tailored match percentages.
            </span>
          </div>
          <Link
            to="/profile"
            className="font-semibold text-brand-primary hover:underline whitespace-nowrap self-start sm:self-auto"
          >
            Complete profile →
          </Link>
        </div>
      )}

      {/* 2. Search & Toolbar Strip */}
      <div className="bg-surface-card border border-border-hairline rounded-[14px] p-3 sm:p-4 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, discipline, provider, or keyword..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-surface-raised border border-border-subtle rounded-[8px] text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label="Search scholarships"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Drawer Button (Mobile only) */}
        <button
          onClick={() => setIsMobileSheetOpen(true)}
          className="lg:hidden flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium bg-surface-raised border border-border-hairline rounded-[8px] text-ink-primary hover:bg-surface-raised/80"
          aria-label="Open filter drawer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-brand-primary" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-brand-primary text-brand-contrast text-[10px] font-mono flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="discover-sort" className="text-xs text-ink-muted whitespace-nowrap hidden sm:inline">
            Sort by:
          </label>
          <select
            id="discover-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="px-3 py-2 text-xs bg-surface-raised border border-border-subtle rounded-[8px] text-ink-primary font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer"
          >
            <option value="match">Best Match</option>
            <option value="deadline">Deadline Soonest</option>
            <option value="amount_high">Highest Amount</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>

        {/* View Mode Toggle (Grid vs List) with sliding pill micro-animation */}
        <div className="hidden sm:flex items-center bg-surface-raised p-1 rounded-[8px] border border-border-subtle shrink-0 relative">
          <button
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
            className={`relative p-1.5 rounded-[6px] transition-colors z-10 cursor-pointer ${
              viewMode === 'grid' ? 'text-brand-primary' : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            {viewMode === 'grid' && (
              <motion.div
                layoutId="discover-viewmode-pill"
                className="absolute inset-0 bg-surface-card rounded-[6px] shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              />
            )}
            <LayoutGrid className="w-4 h-4 relative z-10" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
            className={`relative p-1.5 rounded-[6px] transition-colors z-10 cursor-pointer ${
              viewMode === 'list' ? 'text-brand-primary' : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            {viewMode === 'list' && (
              <motion.div
                layoutId="discover-viewmode-pill"
                className="absolute inset-0 bg-surface-card rounded-[6px] shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              />
            )}
            <List className="w-4 h-4 relative z-10" />
          </button>
        </div>
      </div>

      {/* 3. Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-ink-muted font-mono">Filters:</span>
          {debouncedQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-raised border border-border-hairline text-xs text-ink-primary">
              Query: "{debouncedQuery}"
              <button onClick={() => setQuery('')} aria-label="Remove query filter">
                <X className="w-3 h-3 hover:text-brand-primary" />
              </button>
            </span>
          )}
          {levels.map((l) => (
            <span key={l} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-raised border border-border-hairline text-xs text-ink-primary">
              {l.replace('_', ' ')}
              <button onClick={() => handleLevelToggle(l)} aria-label={`Remove ${l} filter`}>
                <X className="w-3 h-3 hover:text-brand-primary" />
              </button>
            </span>
          ))}
          {fields.map((f) => (
            <span key={f} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-raised border border-border-hairline text-xs text-ink-primary">
              {f}
              <button onClick={() => handleFieldToggle(f)} aria-label={`Remove ${f} filter`}>
                <X className="w-3 h-3 hover:text-brand-primary" />
              </button>
            </span>
          ))}
          {providerTypes.map((p) => (
            <span key={p} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-raised border border-border-hairline text-xs text-ink-primary">
              {p}
              <button onClick={() => handleProviderToggle(p)} aria-label={`Remove ${p} filter`}>
                <X className="w-3 h-3 hover:text-brand-primary" />
              </button>
            </span>
          ))}
          {deadlineWindow !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-raised border border-border-hairline text-xs text-ink-primary">
              Window: {deadlineWindow}
              <button onClick={() => setDeadlineWindow('all')} aria-label="Clear deadline window filter">
                <X className="w-3 h-3 hover:text-brand-primary" />
              </button>
            </span>
          )}
          {essayRequired === false && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-raised border border-border-hairline text-xs text-ink-primary">
              No Essay
              <button onClick={() => setEssayRequired(null)} aria-label="Remove no-essay filter">
                <X className="w-3 h-3 hover:text-brand-primary" />
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-brand-primary hover:underline font-medium ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* 4. Live Result Count Announcement for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isLoading
          ? 'Searching scholarships...'
          : `${result.total} scholarships found matching your filters.`}
      </div>

      {/* 5. Main Content: Desktop Filter Sidebar + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar (1 col) - Scrollable independently without page scroll */}
        <aside className="hidden lg:flex flex-col bg-surface-card border border-border-hairline rounded-[14px] sticky top-20 max-h-[calc(100dvh-5.5rem)] shadow-2xs overflow-hidden">
          {/* Fixed Sidebar Header */}
          <div className="flex items-center justify-between p-4 pb-3 border-b border-border-subtle shrink-0 bg-surface-card/95 backdrop-blur-xs z-10">
            <h3 className="font-serif text-lg text-ink-primary font-medium">Filter Results</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-ink-muted hover:text-brand-primary transition-colors cursor-pointer"
              >
                Reset ({activeFiltersCount})
              </button>
            )}
          </div>
          {/* Scrollable Filters Body */}
          <div className="overflow-y-auto p-4 pb-10 overscroll-contain scrollbar-thin flex-1">
            {renderFilterControls()}
          </div>
        </aside>

        {/* Results Area (3 cols) */}
        <main className="lg:col-span-3 min-w-0" aria-label="Scholarship results">
          {/* Top Result Count Line */}
          <div className="flex items-center justify-between pb-3 mb-4 text-xs font-mono text-ink-muted border-b border-border-subtle">
            <span>
              Showing <strong className="text-ink-primary font-semibold">{result.total}</strong> scholarships
            </span>
            <span>Local Index 2026</span>
          </div>

          {/* Loading Skeleton State */}
          {isLoading ? (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {[...Array(6)].map((_, i) => (
                <ScholarshipCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            /* Error State with Retry Button */
            <div className="p-8 text-center bg-surface-card border border-semantic-danger/30 rounded-[14px] space-y-4 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-semantic-danger-bg text-semantic-danger flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-ink-primary font-medium">Unable to load scholarships</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{error}</p>
              <Button variant="primary" size="sm" onClick={loadData} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                Retry query
              </Button>
            </div>
          ) : result.scholarships.length === 0 ? (
            /* Zero Results Empty State with one-tap relax actions */
            <EmptyState
              title="No scholarships match this combination"
              description="We could not find opportunities matching all active filters. Try relaxing your degree level, deadline window, or clearing search keywords."
              icon="search"
              actionLabel="Clear all filters"
              onAction={clearAllFilters}
            />
          ) : (
            /* Results Cards List / Grid with Alternating Left/Right Scroll Reveal */
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {result.scholarships.map((scholarship, idx) => (
                <ScrollReveal
                  key={scholarship.id}
                  direction="alternate"
                  index={idx}
                  distance={28}
                  duration={0.35}
                  delay={Math.min((idx % 4) * 0.05, 0.2)}
                >
                  <ScholarshipCard
                    scholarship={scholarship}
                    viewMode={viewMode}
                  />
                </ScrollReveal>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Bottom Sheet */}
      <Sheet
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
        title="Filter Scholarships"
        footer={
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={clearAllFilters}
              className="text-xs text-ink-muted hover:text-ink-primary px-3 py-2"
            >
              Reset All
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsMobileSheetOpen(false)}
            >
              Apply ({result.total} results)
            </Button>
          </div>
        }
      >
        {renderFilterControls()}
      </Sheet>
    </div>
  );
};
