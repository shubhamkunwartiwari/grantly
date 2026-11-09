import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Kanban, Compass, Plus, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGrantlyStore } from '../lib/store';
import { Application, ApplicationStatus } from '../types';
import { TrackerCard } from '../components/tracker/TrackerCard';
import { TrackerDrawer } from '../components/tracker/TrackerDrawer';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

interface ColumnDef {
  id: ApplicationStatus;
  title: string;
  description: string;
}

const COLUMNS: ColumnDef[] = [
  { id: 'saved', title: 'Saved', description: 'Bookmarked for evaluation' },
  { id: 'preparing', title: 'Preparing', description: 'Drafting essays & assembling transcripts' },
  { id: 'submitted', title: 'Submitted', description: 'Packet sent to selection committee' },
  { id: 'awarded', title: 'Decision', description: 'Awarded funding or final response' },
];

export const TrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const applications = useGrantlyStore((state) => state.applications);
  const updateApplicationStatus = useGrantlyStore((state) => state.updateApplicationStatus);

  const [activeApplication, setActiveApplication] = useState<Application | null>(null);
  const [mobileActiveTab, setMobileActiveTab] = useState<ApplicationStatus>('saved');
  const [announcement, setAnnouncement] = useState('');

  usePageMeta({
    title: 'Application Tracker | Grantly',
    description:
      'Manage scholarship deadlines, documents, and submission stages with a distraction-free Kanban board.',
  });

  const appList = Object.values(applications);

  // Group applications by status column
  const groupedApps: Record<ApplicationStatus, Application[]> = {
    saved: appList.filter((a) => a.status === 'saved'),
    preparing: appList.filter((a) => a.status === 'preparing'),
    submitted: appList.filter((a) => a.status === 'submitted'),
    awarded: appList.filter((a) => a.status === 'awarded' || a.status === 'declined'),
    declined: [],
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const targetCol = String(over.id) as ApplicationStatus;

    // Check if dragged onto a column container
    if (COLUMNS.some((col) => col.id === targetCol)) {
      updateApplicationStatus(activeId, targetCol);
      setAnnouncement(`Moved card to ${targetCol} column.`);
      return;
    }

    // Check if dragged over another card in a different column
    const overApp = applications[String(over.id)];
    if (overApp) {
      updateApplicationStatus(activeId, overApp.status);
      setAnnouncement(`Moved card to ${overApp.status} column.`);
    }
  };

  const handleMoveToStatus = (id: string, status: ApplicationStatus) => {
    updateApplicationStatus(id, status);
    setAnnouncement(`Card moved to ${status}.`);
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 md:py-12 w-full">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-ink-muted mb-1.5">
            <span className="font-semibold text-brand-primary">04</span>
            <span>/ TRACK</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-ink-primary font-normal tracking-tight">
            Application Board
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Track milestones, checklists, and deadline status across all scholarship providers.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/discover')}
          leftIcon={<Compass className="w-3.5 h-3.5" />}
        >
          Discover opportunities
        </Button>
      </div>

      {/* Screen Reader ARIA Live Status Announcement for drag/move */}
      <div className="sr-only" aria-live="assertive">
        {announcement}
      </div>

      {/* Empty State when no applications added yet */}
      {appList.length === 0 ? (
        <EmptyState
          title="Your application tracker is empty"
          description="You haven't added any scholarships to track yet. Explore our directory of 50+ programs and click 'Add to tracker' to monitor deadlines and tasks."
          icon="inbox"
          actionLabel="Find scholarships to track"
          onAction={() => navigate('/discover')}
        />
      ) : (
        <>
          {/* Mobile Segmented Control (Tabs) with sliding pill animation */}
          <div className="md:hidden flex items-center bg-surface-card border border-border-hairline rounded-[10px] p-1 mb-6 overflow-x-auto relative">
            {COLUMNS.map((col) => {
              const count = groupedApps[col.id].length;
              const isActive = mobileActiveTab === col.id;
              return (
                <button
                  key={col.id}
                  onClick={() => setMobileActiveTab(col.id)}
                  className={`relative flex-1 min-w-[75px] py-2 px-2 text-xs font-medium rounded-[8px] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95 z-10 ${
                    isActive
                      ? 'text-brand-contrast font-semibold'
                      : 'text-ink-muted hover:text-ink-primary hover:bg-surface-raised/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tracker-column-pill"
                      className="absolute inset-0 bg-brand-primary rounded-[8px] shadow-xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{col.title}</span>
                  <span className="relative z-10 text-[10px] opacity-80 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          {/* DND Context for Desktop Kanban & Mobile List */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            {/* Desktop 4-Column Board */}
            <div className="hidden md:grid md:grid-cols-4 gap-4 items-start">
              {COLUMNS.map((col) => {
                const columnApps = groupedApps[col.id];
                return (
                  <div
                    key={col.id}
                    id={col.id}
                    className="bg-surface-card/60 border border-border-hairline rounded-[14px] p-3 flex flex-col min-h-[500px]"
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-border-subtle">
                      <div>
                        <h3 className="font-serif text-base font-medium text-ink-primary">
                          {col.title}
                        </h3>
                        <p className="text-[11px] text-ink-muted">{col.description}</p>
                      </div>
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-raised text-ink-muted">
                        {columnApps.length}
                      </span>
                    </div>

                    {/* Cards Container */}
                    <SortableContext
                      items={columnApps.map((a) => a.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3 flex-1">
                        {columnApps.length === 0 ? (
                          <div className="h-32 border border-dashed border-border-subtle rounded-[10px] flex items-center justify-center text-ink-faint text-xs p-4 text-center">
                            Drop scholarships here
                          </div>
                        ) : (
                          columnApps.map((app) => (
                            <TrackerCard
                              key={app.id}
                              application={app}
                              onOpenDetails={(a) => setActiveApplication(a)}
                              onMoveToStatus={handleMoveToStatus}
                            />
                          ))
                        )}
                      </div>
                    </SortableContext>
                  </div>
                );
              })}
            </div>

            {/* Mobile Active Column View */}
            <div className="md:hidden">
              <div className="bg-surface-card border border-border-hairline rounded-[14px] p-4">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-border-subtle">
                  <h3 className="font-serif text-lg text-ink-primary">
                    {COLUMNS.find((c) => c.id === mobileActiveTab)?.title} Applications
                  </h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-raised">
                    {groupedApps[mobileActiveTab].length}
                  </span>
                </div>

                <div className="space-y-3">
                  {groupedApps[mobileActiveTab].length === 0 ? (
                    <div className="py-12 text-center text-xs text-ink-muted">
                      No applications in this stage yet.
                    </div>
                  ) : (
                    groupedApps[mobileActiveTab].map((app) => (
                      <TrackerCard
                        key={app.id}
                        application={app}
                        onOpenDetails={(a) => setActiveApplication(a)}
                        onMoveToStatus={handleMoveToStatus}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </DndContext>
        </>
      )}

      {/* Side Details Drawer */}
      <TrackerDrawer
        application={activeApplication}
        onClose={() => setActiveApplication(null)}
      />
    </div>
  );
};
