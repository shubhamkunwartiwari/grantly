import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, GripVertical, CheckCircle2, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { Application, ApplicationStatus, Scholarship } from '../../types';
import { SCHOLARSHIPS } from '../../data/scholarships';
import { DeadlineChip } from '../ui/DeadlineChip';
import { getDeadlineInfo } from '../../lib/dates';

interface TrackerCardProps {
  application: Application;
  onOpenDetails: (application: Application) => void;
  onMoveToStatus: (id: string, status: ApplicationStatus) => void;
}

export const TrackerCard: React.FC<TrackerCardProps> = ({
  application,
  onOpenDetails,
  onMoveToStatus,
}) => {
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const scholarship = SCHOLARSHIPS.find((s) => s.id === application.scholarshipId);
  const deadlineInfo = scholarship ? getDeadlineInfo(scholarship.deadline) : null;

  // Deadline past while preparing flag
  const isPastWhilePreparing =
    deadlineInfo?.isPast && (application.status === 'saved' || application.status === 'preparing');

  // Checklist completion stats
  const totalChecklist = application.checklist.length;
  const completedChecklist = application.checklist.filter((item) => item.done).length;
  const progressPercent = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const statusOptions: { value: ApplicationStatus; label: string }[] = [
    { value: 'saved', label: 'Saved' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'awarded', label: 'Decision / Awarded' },
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-surface-card border rounded-[12px] p-4 transition-all duration-200 select-none relative ${
        isDragging
          ? 'opacity-40 border-brand-primary shadow-xl rotate-1 z-50'
          : 'border-border-hairline hover:border-brand-primary/50 hover:shadow-md hover:-translate-y-1'
      }`}
    >
      {/* Top Header: Drag Handle + Move Menu */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <button
          {...attributes}
          {...listeners}
          aria-label="Drag card handle"
          className="text-ink-faint hover:text-ink-primary p-1 -ml-1 rounded cursor-grab active:cursor-grabbing touch-none focus-visible:ring-1 focus-visible:ring-brand-primary"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {application.notes.trim().length > 0 && (
            <span
              title="Contains personal notes"
              className="text-ink-muted text-xs p-1"
              aria-label="Notes attached"
            >
              <FileText className="w-3.5 h-3.5" />
            </span>
          )}

          {/* Move to dropdown (Accessible button alternative to drag-and-drop) */}
          <div className="relative">
            <button
              onClick={() => setShowMoveMenu(!showMoveMenu)}
              aria-expanded={showMoveMenu}
              aria-label="Move card to stage menu"
              className="text-ink-muted hover:text-ink-primary p-1 rounded hover:bg-surface-raised focus-visible:ring-1 focus-visible:ring-brand-primary"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMoveMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMoveMenu(false)}
                />
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1 z-50 w-44 bg-surface-card border border-border-hairline rounded-[10px] shadow-lg py-1.5 text-xs text-ink-primary animate-in fade-in zoom-in-95"
                >
                  <div className="px-3 py-1 font-mono text-[10px] uppercase text-ink-muted border-b border-border-subtle">
                    Move to Column
                  </div>
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      role="menuitem"
                      disabled={opt.value === application.status}
                      onClick={() => {
                        onMoveToStatus(application.id, opt.value);
                        setShowMoveMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 transition-colors flex items-center justify-between ${
                        opt.value === application.status
                          ? 'opacity-40 cursor-default'
                          : 'hover:bg-brand-light hover:text-brand-primary'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {opt.value === application.status && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Title & Click to Open Drawer */}
      <h4
        onClick={() => onOpenDetails(application)}
        className="font-serif text-base text-ink-primary font-normal leading-snug line-clamp-2 cursor-pointer hover:text-brand-primary transition-colors mb-2"
      >
        {scholarship?.title || 'Scholarship Application'}
      </h4>

      {scholarship?.provider && (
        <div className="text-xs text-ink-muted truncate mb-3">
          {scholarship.provider.name}
        </div>
      )}

      {/* Gentle Past Deadline Warning if in preparing stage */}
      {isPastWhilePreparing && (
        <div className="mb-3 px-2 py-1 rounded bg-semantic-danger-bg text-semantic-danger text-[11px] flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 shrink-0" aria-hidden="true" />
          <span>Deadline has passed</span>
        </div>
      )}

      {/* Checklist Progress Bar */}
      {totalChecklist > 0 && (
        <div className="space-y-1 mb-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
            <span>Tasks</span>
            <span className="tabular-nums">
              {completedChecklist}/{totalChecklist} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface-raised rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Card Footer: Deadline Chip & Open trigger */}
      <div className="flex items-center justify-between pt-2 border-t border-border-subtle mt-2">
        {scholarship && <DeadlineChip deadline={scholarship.deadline} />}
        <button
          onClick={() => onOpenDetails(application)}
          className="text-xs text-brand-primary hover:underline flex items-center gap-1 font-medium p-1"
          aria-label={`Open details for ${scholarship?.title || 'application'}`}
        >
          <span>Open</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
