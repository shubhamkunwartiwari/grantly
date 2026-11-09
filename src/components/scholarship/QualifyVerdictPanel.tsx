import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, HelpCircle, AlertTriangle, XCircle, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';
import { Scholarship, Profile } from '../../types';
import { calculateScholarshipMatch } from '../../lib/matching';
import { MatchRing } from '../ui/MatchRing';

interface QualifyVerdictPanelProps {
  scholarship: Scholarship;
  profile: Profile;
}

export const QualifyVerdictPanel: React.FC<QualifyVerdictPanelProps> = ({
  scholarship,
  profile,
}) => {
  const match = calculateScholarshipMatch(scholarship, profile);

  const getVerdictStyle = () => {
    if (match.isDisqualified) {
      return {
        badgeBg: 'bg-semantic-danger-bg text-semantic-danger border-semantic-danger/30',
        icon: XCircle,
        headerNote: 'One or more mandatory institutional requirements are currently unmet.',
      };
    }
    if (match.score >= 80) {
      return {
        badgeBg: 'bg-semantic-success-bg text-semantic-success border-semantic-success/30',
        icon: CheckCircle2,
        headerNote: 'Your academic degree stage, field of study, and citizenship directly align.',
      };
    }
    if (match.score >= 60) {
      return {
        badgeBg: 'bg-brand-light text-brand-primary border-brand-primary/30',
        icon: UserCheck,
        headerNote: 'Good competitive baseline. Review specific essay and document expectations.',
      };
    }
    return {
      badgeBg: 'bg-semantic-warning-bg text-semantic-warning border-semantic-warning/35',
      icon: AlertTriangle,
      headerNote: 'Some criteria require verification or additional profile details to confirm.',
    };
  };

  const verdictStyle = getVerdictStyle();
  const VerdictIcon = verdictStyle.icon;

  const renderCriterionIcon = (type: 'meets' | 'likely' | 'check' | 'unmet') => {
    switch (type) {
      case 'meets':
        return <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" aria-hidden="true" />;
      case 'likely':
        return <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />;
      case 'check':
        return <HelpCircle className="w-4 h-4 text-semantic-warning shrink-0 mt-0.5" aria-hidden="true" />;
      case 'unmet':
        return <XCircle className="w-4 h-4 text-semantic-danger shrink-0 mt-0.5" aria-hidden="true" />;
    }
  };

  const getCriterionBadgeText = (type: 'meets' | 'likely' | 'check' | 'unmet') => {
    switch (type) {
      case 'meets':
        return 'Meets';
      case 'likely':
        return 'Likely';
      case 'check':
        return 'Needs Check';
      case 'unmet':
        return 'Does Not Meet';
    }
  };

  return (
    <section
      aria-labelledby="understand-qualify-heading"
      className="bg-surface-card border border-border-hairline rounded-[16px] p-6 md:p-8"
    >
      {/* Editorial Section Numbering */}
      <div className="flex items-center gap-2 text-xs font-mono text-ink-muted mb-2">
        <span className="font-semibold text-brand-primary">02</span>
        <span>/ UNDERSTAND</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <h2 id="understand-qualify-heading" className="font-serif text-2xl md:text-3xl text-ink-primary font-normal">
            Do I Qualify?
          </h2>
          <p className="text-sm text-ink-muted mt-1 max-w-lg">
            {verdictStyle.headerNote}
          </p>
        </div>

        {/* Verdict Badge & Ring */}
        <div className="flex items-center gap-4 shrink-0 bg-surface-raised px-4 py-2.5 rounded-[12px] border border-border-subtle">
          <MatchRing score={match.score} size={50} />
          <div>
            <div className="text-[11px] uppercase tracking-wider text-ink-muted font-mono font-medium">
              Overall Verdict
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-sm text-ink-primary">
              <VerdictIcon className="w-4 h-4 text-brand-primary" aria-hidden="true" />
              <span>{match.verdict}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kind Disqualifier Banner if hard disqualifier exists */}
      {match.isDisqualified && (
        <div className="my-6 p-4 rounded-[12px] bg-semantic-danger-bg border border-semantic-danger/30 text-ink-primary text-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-semantic-danger shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <h4 className="font-semibold text-semantic-danger">
              Eligibility Notice
            </h4>
            <p className="text-xs text-ink-primary/90 leading-relaxed">
              {match.disqualifierReason || 'This scholarship enforces strict eligibility criteria.'} Don't be discouraged: your talents may be an exact match for other open awards.
            </p>
            <div className="pt-2">
              <Link
                to="/discover"
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-primary hover:underline"
              >
                <span>Browse scholarships open to your background</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Itemized Criteria List */}
      <div className="mt-6 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
          Deconstructed Criteria
        </h3>
        <div className="divide-y divide-border-subtle">
          {match.reasons.map((reason, idx) => (
            <div key={idx} className="py-3.5 px-3 -mx-3 rounded-[8px] hover:bg-surface-raised/80 hover:translate-x-0.5 transition-all duration-200 flex items-start justify-between gap-4 group">
              <div className="flex items-start gap-3 min-w-0">
                <span className="group-hover:scale-110 transition-transform duration-200">
                  {renderCriterionIcon(reason.type)}
                </span>
                <div>
                  <div className="text-sm font-medium text-ink-primary flex items-center gap-2 group-hover:text-brand-primary transition-colors">
                    <span>{reason.label}</span>
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                    {reason.detail}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-[11px] font-mono px-2 py-0.5 rounded-[4px] border border-border-hairline bg-surface-raised text-ink-muted group-hover:border-brand-primary/30 transition-colors">
                {getCriterionBadgeText(reason.type)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Incomplete Nudge if completeness < 60 */}
      {profile.completeness < 60 && (
        <div className="mt-6 p-4 bg-brand-light/60 border border-brand-primary/20 rounded-[12px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-ink-primary">Your profile is {profile.completeness}% complete. </span>
            <span className="text-ink-muted">Add your GPA, field, or citizenship to unlock verified eligibility status.</span>
          </div>
          <Link
            to="/profile"
            className="font-medium text-brand-primary hover:underline shrink-0 flex items-center gap-1"
          >
            Update profile <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
};
