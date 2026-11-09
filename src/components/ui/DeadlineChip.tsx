import React from 'react';
import { Clock, AlertCircle, CheckCircle2, RotateCw } from 'lucide-react';
import { Scholarship } from '../../types';
import { getDeadlineInfo, UrgencyState } from '../../lib/dates';

interface DeadlineChipProps {
  deadline: Scholarship['deadline'];
  className?: string;
  showExactDate?: boolean;
}

export const DeadlineChip: React.FC<DeadlineChipProps> = ({
  deadline,
  className = '',
  showExactDate = false,
}) => {
  const info = getDeadlineInfo(deadline);

  // Accessible color pairs with icons (never color alone)
  let styleClasses = 'bg-surface-raised text-ink-muted border-border-hairline';
  let Icon = Clock;

  switch (info.urgency) {
    case 'closed':
      styleClasses = 'bg-semantic-danger-bg text-semantic-danger border-semantic-danger/20 line-through decoration-semantic-danger/40';
      Icon = AlertCircle;
      break;
    case 'closing_soon':
      styleClasses = 'bg-accent-light text-accent-deep border-accent-saffron/30 font-medium';
      Icon = AlertCircle;
      break;
    case 'closing_month':
      styleClasses = 'bg-surface-raised text-ink-primary border-border-hairline';
      Icon = Clock;
      break;
    case 'later':
      styleClasses = 'bg-surface-raised/60 text-ink-muted border-border-hairline/60';
      Icon = Clock;
      break;
    case 'rolling':
      styleClasses = 'bg-semantic-info-bg text-semantic-info border-semantic-info/20';
      Icon = RotateCw;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border font-mono text-xs tracking-tight tabular-nums select-none ${styleClasses} ${className}`}
      title={info.dateStr}
      aria-label={`Deadline status: ${info.relative}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{info.relative}</span>
      {showExactDate && info.date && (
        <span className="opacity-70 border-l border-current/20 pl-1.5 ml-0.5">
          {info.dateStr}
        </span>
      )}
    </span>
  );
};
