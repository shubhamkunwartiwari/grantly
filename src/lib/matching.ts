import { Profile, Scholarship, MatchResult, MatchReason, CriterionVerdict } from '../types';

/**
 * Normalizes user GPA to a 4.0 scale for comparative evaluation.
 */
export function normalizeGpa(gpa?: number, scale?: number): number | undefined {
  if (gpa === undefined || isNaN(gpa)) return undefined;
  const currentScale = scale && scale > 0 ? scale : 4.0;
  if (currentScale === 4.0) return Math.min(4.0, Math.max(0, gpa));
  if (currentScale === 10.0) return (gpa / 10.0) * 4.0;
  if (currentScale === 100) return (gpa / 100) * 4.0;
  return (gpa / currentScale) * 4.0;
}

/**
 * Evaluates match score (0-100) and plain-language reasons between a user profile and scholarship.
 */
export function calculateScholarshipMatch(
  scholarship: Scholarship,
  profile: Partial<Profile> | null | undefined
): MatchResult {
  const reasons: MatchReason[] = [];

  // Default neutral evaluation when profile is completely empty
  if (!profile || (!profile.country && !profile.level && !profile.field && profile.gpa === undefined)) {
    return {
      score: 50,
      verdict: 'Potential match',
      reasons: [
        {
          type: 'check',
          label: 'Incomplete Profile',
          detail: 'Add your study level, field, citizenship, and GPA to unlock precision matching.',
        },
        {
          type: 'check',
          label: 'Eligibility Overview',
          detail: `Accepts ${scholarship.levels.map((l) => l.replace('_', ' ')).join(', ')} students in ${scholarship.fields.slice(0, 2).join(', ')}.`,
        },
      ],
      isDisqualified: false,
    };
  }

  let totalScore = 0;
  let maxPossibleScore = 100;
  let isDisqualified = false;
  let disqualifierReason: string | undefined = undefined;

  // 1. Country & Residency Eligibility (Weight: 25)
  if (scholarship.eligibleCountries === 'any') {
    totalScore += 25;
    reasons.push({
      type: 'meets',
      label: 'Open to All Nationalities',
      detail: 'Applicants from any country or residency are welcome to apply.',
    });
  } else if (!profile.country) {
    totalScore += 12;
    reasons.push({
      type: 'check',
      label: 'Nationality Check',
      detail: `Restricted to: ${scholarship.eligibleCountries.join(', ')}. Add citizenship in profile to confirm.`,
    });
  } else {
    const userCountryLower = profile.country.trim().toLowerCase();
    const isCountryEligible = scholarship.eligibleCountries.some(
      (c) => c.toLowerCase() === userCountryLower || c.toLowerCase().includes(userCountryLower)
    );

    if (isCountryEligible) {
      totalScore += 25;
      reasons.push({
        type: 'meets',
        label: 'Citizenship Eligible',
        detail: `Your listed citizenship (${profile.country}) is eligible for this award.`,
      });
    } else {
      isDisqualified = true;
      disqualifierReason = `Open only to citizens of ${scholarship.eligibleCountries.join(', ')}.`;
      reasons.push({
        type: 'unmet',
        label: 'Geographic Restriction',
        detail: `Award is limited to citizens of ${scholarship.eligibleCountries.join(', ')}. Your profile specifies ${profile.country}.`,
      });
    }
  }

  // 2. Study Level Match (Weight: 25)
  if (!profile.level) {
    totalScore += 12;
    reasons.push({
      type: 'check',
      label: 'Academic Level Needed',
      detail: `Open to: ${scholarship.levels.map((l) => l.replace('_', ' ')).join(', ')}. Set your level in profile.`,
    });
  } else {
    const isLevelMatch = scholarship.levels.includes(profile.level);
    if (isLevelMatch) {
      totalScore += 25;
      reasons.push({
        type: 'meets',
        label: 'Academic Level Matches',
        detail: `Matches your current degree stage (${profile.level.replace('_', ' ')}).`,
      });
    } else {
      isDisqualified = true;
      const formattedLevels = scholarship.levels.map((l) => l.replace('_', ' ')).join(' or ');
      disqualifierReason = disqualifierReason || `Award requires enrollment in ${formattedLevels}.`;
      reasons.push({
        type: 'unmet',
        label: 'Level Incompatibility',
        detail: `This award specifically funds ${formattedLevels}. You are registered as ${profile.level.replace('_', ' ')}.`,
      });
    }
  }

  // 3. Field of Study / Major Match (Weight: 20)
  if (!profile.field) {
    totalScore += 10;
    reasons.push({
      type: 'check',
      label: 'Major / Field Unset',
      detail: `Accepts: ${scholarship.fields.slice(0, 3).join(', ')}. Add your major to confirm alignment.`,
    });
  } else {
    const userFieldLower = profile.field.toLowerCase();
    const isAllFields = scholarship.fields.some((f) => f.toLowerCase().includes('all') || f.toLowerCase().includes('any'));
    const isFieldMatch =
      isAllFields ||
      scholarship.fields.some(
        (f) =>
          f.toLowerCase().includes(userFieldLower) ||
          userFieldLower.includes(f.toLowerCase()) ||
          userFieldLower.split(/[\s,/]+/).some((word) => word.length > 3 && f.toLowerCase().includes(word))
      );

    if (isFieldMatch) {
      totalScore += 20;
      reasons.push({
        type: 'meets',
        label: 'Field of Study Aligns',
        detail: isAllFields
          ? 'Award welcomes candidates across all disciplines and faculties.'
          : `Your field (${profile.field}) directly aligns with this award's priorities.`,
      });
    } else {
      totalScore += 5;
      reasons.push({
        type: 'check',
        label: 'Discipline Priority',
        detail: `Primary focus is ${scholarship.fields.slice(0, 2).join(', ')}. Related interdisciplinary work may still qualify.`,
      });
    }
  }

  // 4. GPA Qualification (Weight: 15)
  const normUserGpa = normalizeGpa(profile.gpa, profile.gpaScale);
  if (!scholarship.minGpa) {
    totalScore += 15;
    reasons.push({
      type: 'meets',
      label: 'No Minimum GPA Required',
      detail: 'This program does not enforce a rigid academic cutoff score.',
    });
  } else if (normUserGpa === undefined) {
    totalScore += 8;
    reasons.push({
      type: 'check',
      label: 'GPA Requirement',
      detail: `Requires minimum ${scholarship.minGpa} on a 4.0 scale. Add GPA in profile to verify.`,
    });
  } else {
    if (normUserGpa >= scholarship.minGpa) {
      totalScore += 15;
      reasons.push({
        type: 'meets',
        label: 'Exceeds Academic Baseline',
        detail: `Your GPA (${normUserGpa.toFixed(2)}/4.0) satisfies the ${scholarship.minGpa} threshold.`,
      });
    } else {
      const gpaDiff = scholarship.minGpa - normUserGpa;
      if (gpaDiff <= 0.2) {
        totalScore += 5;
        reasons.push({
          type: 'likely',
          label: 'Near GPA Cutoff',
          detail: `Your ${normUserGpa.toFixed(2)} is close to the ${scholarship.minGpa} requirement. Strong essays or portfolio may compensate.`,
        });
      } else {
        isDisqualified = true;
        disqualifierReason = disqualifierReason || `Strict minimum GPA of ${scholarship.minGpa} required.`;
        reasons.push({
          type: 'unmet',
          label: 'Below Minimum GPA',
          detail: `Listed minimum is ${scholarship.minGpa}/4.0; your profile reflects ${normUserGpa.toFixed(2)}/4.0.`,
        });
      }
    }
  }

  // 5. Financial Need Alignment (Weight: 10)
  if (scholarship.financialNeed === 'none') {
    totalScore += 10;
    reasons.push({
      type: 'meets',
      label: 'Merit-Based (Need Blind)',
      detail: 'Selection is determined solely by merit, portfolio, and leadership achievements.',
    });
  } else if (!profile.financialNeed) {
    totalScore += 5;
    reasons.push({
      type: 'check',
      label: 'Financial Need Assessment',
      detail: `This award has ${scholarship.financialNeed === 'required' ? 'mandatory' : 'preferred'} need consideration.`,
    });
  } else {
    if (profile.financialNeed === scholarship.financialNeed || profile.financialNeed === 'required') {
      totalScore += 10;
      reasons.push({
        type: 'meets',
        label: 'Financial Profile Matches',
        detail: 'Demonstrated need matches this foundation’s endowment criteria.',
      });
    } else {
      totalScore += 5;
      reasons.push({
        type: 'check',
        label: 'Need Preference',
        detail: 'Candidates with demonstrated need receive committee preference.',
      });
    }
  }

  // 6. Interest Tags Bonus (Weight: 5)
  if (profile.interests && profile.interests.length > 0) {
    const matchingInterests = profile.interests.filter((interest) =>
      scholarship.tags.some((tag) => tag.toLowerCase().includes(interest.toLowerCase()))
    );
    if (matchingInterests.length > 0) {
      totalScore = Math.min(100, totalScore + 5);
      reasons.push({
        type: 'meets',
        label: 'Shared Focus Areas',
        detail: `Aligned interests in ${matchingInterests.slice(0, 2).join(', ')}.`,
      });
    }
  }

  // Cap score if disqualified
  let finalScore = Math.round(Math.max(10, Math.min(100, totalScore)));
  if (isDisqualified) {
    finalScore = Math.min(finalScore, 28);
  }

  // Determine categorical verdict
  let verdict: MatchResult['verdict'] = 'Good match';
  if (isDisqualified) {
    verdict = 'Ineligible';
  } else if (finalScore >= 80) {
    verdict = 'Strong match';
  } else if (finalScore >= 60) {
    verdict = 'Good match';
  } else if (finalScore >= 40) {
    verdict = 'Potential match';
  } else {
    verdict = 'Hard to qualify';
  }

  return {
    score: finalScore,
    verdict,
    reasons,
    isDisqualified,
    disqualifierReason,
  };
}
