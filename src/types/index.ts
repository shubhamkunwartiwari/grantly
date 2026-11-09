export type StudyLevel = 'high_school' | 'undergraduate' | 'postgraduate' | 'phd';

export type ProviderType = 'government' | 'university' | 'foundation' | 'corporate' | 'ngo';

export type AwardKind = 'one-time' | 'annual' | 'full-tuition';

export type FinancialNeedType = 'required' | 'considered' | 'none';

export type ApplicationStatus = 'saved' | 'preparing' | 'submitted' | 'awarded' | 'declined';

export interface EligibilityCriterion {
  id: string;
  label: string;
  type: 'level' | 'field' | 'country' | 'gpa' | 'need' | 'custom';
  ruleDescription: string;
  machineCheckable: boolean;
  checkKey?: string;
}

export interface ApplicationStep {
  step: number;
  title: string;
  description: string;
  estimatedHours?: number;
}

export interface Scholarship {
  id: string;
  slug: string;
  title: string;
  provider: {
    name: string;
    type: ProviderType;
    country?: string;
  };
  summary: string;
  description: string;
  amount: {
    min: number;
    max: number;
    currency: string;
    kind: AwardKind;
  };
  awards: number;
  deadline: {
    kind: 'fixed' | 'rolling';
    offsetDays?: number; // e.g., -5 (past), 1 (tomorrow), 6 (closing soon), 25 (this month), 75 (later)
  };
  levels: StudyLevel[];
  fields: string[];
  eligibleCountries: string[] | 'any';
  residency?: string;
  minGpa?: number;
  gpaScale?: number;
  financialNeed: FinancialNeedType;
  renewable: boolean;
  essayRequired: boolean;
  documentsRequired: string[];
  applicationSteps: ApplicationStep[];
  eligibilityCriteria: EligibilityCriterion[];
  tags: string[];
  applyUrl: string;
  sourceUpdated: string;
  estimatedHours: number;
}

export interface Profile {
  name?: string;
  country: string;
  residencyCountry?: string;
  level: StudyLevel | '';
  field: string;
  gpa?: number;
  gpaScale?: number;
  financialNeed: FinancialNeedType | '';
  graduationYear?: number;
  interests: string[];
  completeness: number; // 0 to 100
}

export interface ApplicationChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface Application {
  id: string;
  scholarshipId: string;
  status: ApplicationStatus;
  checklist: ApplicationChecklistItem[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

export type CriterionVerdict = 'meets' | 'likely' | 'check' | 'unmet';

export interface MatchReason {
  type: CriterionVerdict;
  label: string;
  detail: string;
}

export interface MatchResult {
  score: number; // 0 - 100
  verdict: 'Strong match' | 'Good match' | 'Potential match' | 'Hard to qualify' | 'Ineligible';
  reasons: MatchReason[];
  isDisqualified: boolean;
  disqualifierReason?: string;
}

export type SortOption = 'match' | 'deadline' | 'amount_high' | 'recent';

export interface FilterState {
  query: string;
  levels: StudyLevel[];
  fields: string[];
  providerTypes: ProviderType[];
  country: string;
  need: FinancialNeedType | '';
  essayRequired: boolean | null;
  renewable: boolean | null;
  deadlineWindow: 'all' | '7days' | '30days' | 'open';
  minAmount: number;
  maxAmount: number;
  sort: SortOption;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type CookieConsent = 'all' | 'essential' | null;
