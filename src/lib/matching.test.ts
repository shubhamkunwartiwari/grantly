/**
 * Self-contained unit tests for pure matching algorithm & date math.
 * Runs in standard TypeScript without external framework dependencies.
 */
import { calculateScholarshipMatch, normalizeGpa } from './matching';
import { getDeadlineInfo } from './dates';
import { Scholarship, Profile } from '../types';
import { SCHOLARSHIPS } from '../data/scholarships';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function runMatchingUnitTests(): { passed: number; total: number; success: boolean } {
  let passed = 0;
  let total = 0;

  const test = (name: string, fn: () => void) => {
    total++;
    try {
      fn();
      passed++;
    } catch (e: any) {
      console.error(`Test failed: ${name}`, e);
    }
  };

  test('normalizeGpa converts 10.0 scale to 4.0 scale accurately', () => {
    const val = normalizeGpa(8.5, 10.0);
    assert(val !== undefined && Math.abs(val - 3.4) < 0.01, 'Expected ~3.4 for 8.5/10.0');
  });

  test('normalizeGpa converts 100 percentage scale to 4.0 scale', () => {
    const val = normalizeGpa(85, 100);
    assert(val !== undefined && Math.abs(val - 3.4) < 0.01, 'Expected ~3.4 for 85%');
  });

  test('calculateScholarshipMatch handles empty profile gracefully', () => {
    const sample: Scholarship = SCHOLARSHIPS[0];
    const result = calculateScholarshipMatch(sample, null);
    assert(result.score === 50, 'Expected neutral 50 score for null profile');
    assert(result.verdict === 'Potential match', 'Expected Potential match verdict');
    assert(!result.isDisqualified, 'Should not be disqualified with null profile');
  });

  test('calculateScholarshipMatch identifies strong matches', () => {
    const sample: Scholarship = SCHOLARSHIPS[0];
    const profile: Profile = {
      name: 'Elena Rostova',
      country: 'Canada',
      level: 'undergraduate',
      field: 'Environmental Science',
      gpa: 3.8,
      gpaScale: 4.0,
      financialNeed: 'considered',
      interests: ['Climate Tech', 'Renewable Energy'],
      completeness: 100,
    };
    const result = calculateScholarshipMatch(sample, profile);
    assert(result.score >= 80, `Expected score >= 80, got ${result.score}`);
    assert(result.verdict === 'Strong match', 'Expected Strong match');
    assert(!result.isDisqualified, 'Should not be disqualified');
  });

  test('calculateScholarshipMatch flags hard country restriction as disqualified', () => {
    const helioScholarship = SCHOLARSHIPS[1]; // US/Canada only
    const profile: Profile = {
      name: 'Rajesh Sharma',
      country: 'India',
      level: 'undergraduate',
      field: 'Aerospace Engineering',
      gpa: 3.9,
      financialNeed: 'none',
      interests: [],
      completeness: 80,
    };
    const result = calculateScholarshipMatch(helioScholarship, profile);
    assert(result.isDisqualified, 'Expected hard disqualification for ineligible country');
    assert(result.verdict === 'Ineligible', 'Expected Ineligible verdict');
    assert(result.score <= 28, 'Disqualified score should be capped');
  });

  test('getDeadlineInfo handles rolling deadlines correctly', () => {
    const info = getDeadlineInfo({ kind: 'rolling' });
    assert(info.urgency === 'rolling', 'Expected rolling urgency');
    assert(!info.isPast, 'Rolling should not be past');
  });

  test('getDeadlineInfo handles closing tomorrow', () => {
    const info = getDeadlineInfo({ kind: 'fixed', offsetDays: 1 });
    assert(info.urgency === 'closing_soon', 'Expected closing_soon urgency');
    assert(info.relative === 'Closes tomorrow', 'Expected relative text "Closes tomorrow"');
  });

  test('getDeadlineInfo identifies closed deadlines', () => {
    const info = getDeadlineInfo({ kind: 'fixed', offsetDays: -4 });
    assert(info.urgency === 'closed', 'Expected closed urgency');
    assert(info.isPast, 'Expected isPast to be true');
  });

  return { passed, total, success: passed === total };
}
