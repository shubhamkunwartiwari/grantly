import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, CheckSquare, Square, Trash2, CheckCircle2, ExternalLink, Calendar, FileText, Clock } from 'lucide-react';
import { Application, ApplicationStatus } from '../../types';
import { SCHOLARSHIPS } from '../../data/scholarships';
import { useGrantlyStore } from '../../lib/store';
import { Button } from '../ui/Button';
import { DeadlineChip } from '../ui/DeadlineChip';
import { getDeadlineInfo } from '../../lib/dates';

interface TrackerDrawerProps {
  application: Application | null;
  onClose: () => void;
}

export const TrackerDrawer: React.FC<TrackerDrawerProps> = ({ application, onClose }) => {
  const updateApplicationNotes = useGrantlyStore((state) => state.updateApplicationNotes);
  const toggleChecklistItem = useGrantlyStore((state) => state.toggleChecklistItem);
  const updateApplicationStatus = useGrantlyStore((state) => state.updateApplicationStatus);
  const removeApplication = useGrantlyStore((state) => state.removeApplication);

  // Local state for smooth notes textarea editing with autosave debounce
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (application) {
      setNotes(application.notes);
    }
  }, [application?.id]);

  if (!application) return null;

  const scholarship = SCHOLARSHIPS.find((s) => s.id === application.scholarshipId);
  const deadlineInfo = scholarship ? getDeadlineInfo(scholarship.deadline) : null;

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    updateApplicationNotes(application.id, val);
  };

  const statusOptions: { value: ApplicationStatus; label: string }[] = [
    { value: 'saved', label: 'Saved' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'awarded', label: 'Awarded / Won' },
    { value: 'declined', label: 'Declined' },
  ];

  const handleRemove = () => {
    removeApplication(application.id);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Application details drawer"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-primary/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative z-10 w-full max-w-lg bg-surface-card border-l border-border-hairline shadow-2xl h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-border-hairline flex items-start justify-between gap-4 bg-surface-raised/40 shrink-0">
          <div className="min-w-0">
            <div className="text-xs font-mono text-ink-muted mb-1">
              Application Workspace
            </div>
            <h3 className="font-serif text-xl text-ink-primary font-normal leading-snug line-clamp-2">
              {scholarship?.title || 'Scholarship Application'}
            </h3>
            {scholarship?.provider && (
              <div className="text-xs text-ink-muted mt-0.5">
                {scholarship.provider.name}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-ink-muted hover:text-ink-primary hover:bg-surface-raised transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Quick Stage Status Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-2">
              Application Stage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateApplicationStatus(application.id, opt.value)}
                  className={`px-3 py-2 text-xs font-medium rounded-[8px] border transition-colors text-left flex items-center justify-between ${
                    application.status === opt.value
                      ? 'bg-brand-primary text-brand-contrast border-brand-primary'
                      : 'bg-surface-card text-ink-muted border-border-hairline hover:bg-surface-raised'
                  }`}
                >
                  <span>{opt.label}</span>
                  {application.status === opt.value && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Key Dates & Deadline */}
          <div className="p-4 bg-surface-raised/60 rounded-[12px] border border-border-subtle flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-ink-muted flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                <span>Deadline</span>
              </div>
              <div className="text-sm font-semibold text-ink-primary">
                {deadlineInfo?.dateStr || 'Rolling'}
              </div>
            </div>
            {scholarship && <DeadlineChip deadline={scholarship.deadline} />}
          </div>

          {/* Action Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                Preparation Checklist ({application.checklist.filter((i) => i.done).length}/{application.checklist.length})
              </label>
            </div>
            <div className="space-y-2 border border-border-hairline rounded-[12px] p-3 divide-y divide-border-subtle bg-surface-card">
              {application.checklist.length === 0 ? (
                <div className="text-xs text-ink-muted p-2 text-center">No checklist items.</div>
              ) : (
                application.checklist.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleChecklistItem(application.id, item.id)}
                    className="w-full text-left py-2.5 first:pt-1 last:pb-1 flex items-start gap-3 text-xs group"
                  >
                    {item.done ? (
                      <CheckSquare className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-ink-muted group-hover:text-ink-primary shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`leading-relaxed ${
                        item.done ? 'line-through text-ink-muted' : 'text-ink-primary'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Private Notes (Autosaved) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="tracker-notes" className="text-xs font-mono uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-primary" />
                <span>Personal Notes (Autosaved)</span>
              </label>
              <span className="text-[10px] text-ink-muted">Saved locally</span>
            </div>
            <textarea
              id="tracker-notes"
              rows={4}
              value={notes}
              onChange={handleNotesChange}
              placeholder="Record essay drafts, committee contacts, or submission confirmation codes here..."
              className="w-full p-3 text-xs text-ink-primary bg-surface-card border border-border-hairline rounded-[10px] focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y"
            />
          </div>

          {/* Link back to detail page */}
          {scholarship && (
            <div className="pt-2">
              <Link
                to={`/scholarships/${scholarship.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary hover:underline"
              >
                <span>View full criteria & eligibility breakdown</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Footer Actions: Mark submitted / Remove */}
        <div className="p-4 border-t border-border-hairline bg-surface-raised/40 flex items-center justify-between gap-3 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRemove}
            className="text-semantic-danger hover:bg-semantic-danger-bg hover:text-semantic-danger"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Remove from tracker
          </Button>

          {application.status !== 'submitted' && application.status !== 'awarded' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                updateApplicationStatus(application.id, 'submitted');
              }}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Mark Submitted
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
