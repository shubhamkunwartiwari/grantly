import { SCHOLARSHIPS } from '../data/scholarships';
import { FilterState, Scholarship, Profile } from '../types';
import { calculateScholarshipMatch } from './matching';

export interface ScholarshipQueryResult {
  scholarships: Scholarship[];
  total: number;
}

/**
 * Checks if query params or dev mode requested an artificial error
 */
function shouldSimulateError(forceError?: boolean): boolean {
  if (forceError) return true;
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return params.get('simulateError') === '1';
  }
  return false;
}

/**
 * Simulates a realistic network fetch with configurable filters and latency
 */
export async function fetchScholarships(
  filters?: Partial<FilterState>,
  profile?: Profile | null,
  options?: { latency?: number; forceError?: boolean }
): Promise<ScholarshipQueryResult> {
  const latency = options?.latency ?? 450;

  await new Promise((resolve) => setTimeout(resolve, latency));

  if (shouldSimulateError(options?.forceError)) {
    throw new Error('Simulated network failure. Could not connect to scholarship index service.');
  }

  let items = [...SCHOLARSHIPS];

  if (!filters) {
    return { scholarships: items, total: items.length };
  }

  // 1. Text search
  if (filters.query && filters.query.trim().length > 0) {
    const q = filters.query.trim().toLowerCase();
    items = items.filter((s) => {
      return (
        s.title.toLowerCase().includes(q) ||
        s.provider.name.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.fields.some((f) => f.toLowerCase().includes(q)) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }

  // 2. Study Level
  if (filters.levels && filters.levels.length > 0) {
    items = items.filter((s) => s.levels.some((l) => filters.levels!.includes(l)));
  }

  // 3. Fields of Study
  if (filters.fields && filters.fields.length > 0) {
    items = items.filter((s) =>
      s.fields.some((f) => filters.fields!.some((ff) => f.toLowerCase().includes(ff.toLowerCase())))
    );
  }

  // 4. Provider Type
  if (filters.providerTypes && filters.providerTypes.length > 0) {
    items = items.filter((s) => filters.providerTypes!.includes(s.provider.type));
  }

  // 5. Country Eligibility
  if (filters.country && filters.country.trim().length > 0) {
    const c = filters.country.trim().toLowerCase();
    items = items.filter((s) => {
      if (s.eligibleCountries === 'any') return true;
      return s.eligibleCountries.some((item) => item.toLowerCase().includes(c));
    });
  }

  // 6. Financial Need
  if (filters.need && filters.need.length > 0) {
    items = items.filter((s) => s.financialNeed === filters.need);
  }

  // 7. Essay Required
  if (filters.essayRequired !== null && filters.essayRequired !== undefined) {
    items = items.filter((s) => s.essayRequired === filters.essayRequired);
  }

  // 8. Renewable
  if (filters.renewable !== null && filters.renewable !== undefined) {
    items = items.filter((s) => s.renewable === filters.renewable);
  }

  // 9. Deadline Window
  if (filters.deadlineWindow && filters.deadlineWindow !== 'all') {
    items = items.filter((s) => {
      if (s.deadline.kind === 'rolling') return filters.deadlineWindow === 'open';
      const offset = s.deadline.offsetDays ?? 999;
      if (filters.deadlineWindow === '7days') return offset >= 0 && offset <= 7;
      if (filters.deadlineWindow === '30days') return offset >= 0 && offset <= 30;
      if (filters.deadlineWindow === 'open') return offset >= 0;
      return true;
    });
  }

  // 10. Amount Filter
  if (filters.minAmount !== undefined && filters.minAmount > 0) {
    items = items.filter((s) => s.amount.max >= filters.minAmount!);
  }
  if (filters.maxAmount !== undefined && filters.maxAmount < 100000) {
    items = items.filter((s) => s.amount.min <= filters.maxAmount!);
  }

  // 11. Sorting
  const sort = filters.sort || 'match';
  items.sort((a, b) => {
    if (sort === 'match') {
      const matchA = calculateScholarshipMatch(a, profile).score;
      const matchB = calculateScholarshipMatch(b, profile).score;
      return matchB - matchA;
    }
    if (sort === 'deadline') {
      const getDays = (s: Scholarship) => (s.deadline.kind === 'rolling' ? 999 : s.deadline.offsetDays ?? 999);
      return getDays(a) - getDays(b);
    }
    if (sort === 'amount_high') {
      return b.amount.max - a.amount.max;
    }
    if (sort === 'recent') {
      return new Date(b.sourceUpdated).getTime() - new Date(a.sourceUpdated).getTime();
    }
    return 0;
  });

  return {
    scholarships: items,
    total: items.length,
  };
}

/**
 * Retrieves a single scholarship by ID or slug
 */
export async function fetchScholarshipById(
  idOrSlug: string,
  options?: { latency?: number }
): Promise<Scholarship | null> {
  await new Promise((resolve) => setTimeout(resolve, options?.latency ?? 300));
  const found = SCHOLARSHIPS.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
  return found ?? null;
}

/**
 * Finds similar scholarships sharing disciplines, levels, or tags
 */
export async function fetchSimilarScholarships(
  scholarship: Scholarship,
  limit = 3
): Promise<Scholarship[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const others = SCHOLARSHIPS.filter((s) => s.id !== scholarship.id);

  return others
    .map((candidate) => {
      let similarity = 0;
      if (candidate.provider.type === scholarship.provider.type) similarity += 2;
      const sharedFields = candidate.fields.filter((f) => scholarship.fields.includes(f));
      similarity += sharedFields.length * 3;
      const sharedLevels = candidate.levels.filter((l) => scholarship.levels.includes(l));
      similarity += sharedLevels.length * 2;
      const sharedTags = candidate.tags.filter((t) => scholarship.tags.includes(t));
      similarity += sharedTags.length * 2;
      return { candidate, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map((item) => item.candidate);
}
