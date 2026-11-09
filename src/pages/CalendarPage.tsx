import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Download, ArrowRight } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SCHOLARSHIPS } from '../data/scholarships';
import { Scholarship } from '../types';
import { getDeadlineDate, getDeadlineInfo, downloadIcsCalendar } from '../lib/dates';
import { DeadlineChip } from '../components/ui/DeadlineChip';
import { Button } from '../components/ui/Button';

export const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('agenda');

  usePageMeta({
    title: 'Deadlines Calendar | Grantly',
    description:
      'Timeline view and monthly calendar of upcoming scholarship application deadlines with iCal export support.',
  });

  // Collect all fixed scholarships with resolved dates
  const datedScholarships = SCHOLARSHIPS.map((s) => ({
    scholarship: s,
    date: getDeadlineDate(s.deadline),
    info: getDeadlineInfo(s.deadline),
  })).filter((item) => item.date !== null) as {
    scholarship: Scholarship;
    date: Date;
    info: ReturnType<typeof getDeadlineInfo>;
  }[];

  // Sort by date ascending
  datedScholarships.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Split into upcoming and past
  const upcomingScholarships = datedScholarships.filter((item) => !item.info.isPast);
  const pastScholarships = datedScholarships.filter((item) => item.info.isPast);

  // Month grid calculations
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const daysInView = eachDayOfInterval({ start: startDate, end: endDate });

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-12 w-full space-y-8">
      {/* 1. Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border-hairline">
        <div>
          <div className="text-xs font-mono text-ink-muted mb-1">
            Deadlines Timeline
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-ink-primary font-normal tracking-tight">
            Scholarship Calendar
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Monitor submission dates and export individual iCal (.ics) events to your schedule.
          </p>
        </div>

        {/* View Switcher: Agenda vs Month */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-raised p-1 rounded-[8px] border border-border-subtle">
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 text-xs font-medium rounded-[6px] transition-colors flex items-center gap-1.5 ${
                viewMode === 'agenda'
                  ? 'bg-surface-card text-brand-primary shadow-xs font-semibold'
                  : 'text-ink-muted hover:text-ink-primary'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Agenda</span>
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 text-xs font-medium rounded-[6px] transition-colors flex items-center gap-1.5 ${
                viewMode === 'month'
                  ? 'bg-surface-card text-brand-primary shadow-xs font-semibold'
                  : 'text-ink-muted hover:text-ink-primary'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Month</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. AGENDA VIEW (Default on mobile and clean readable list) */}
      {viewMode === 'agenda' && (
        <div className="space-y-8">
          {/* Upcoming Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-ink-primary font-medium">
                Active & Upcoming ({upcomingScholarships.length})
              </h2>
              <span className="text-xs font-mono text-ink-muted">Sorted by soonest deadline</span>
            </div>

            <div className="bg-surface-card border border-border-hairline rounded-[16px] divide-y divide-border-subtle overflow-hidden">
              {upcomingScholarships.map(({ scholarship, date, info }) => (
                <div
                  key={scholarship.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-raised/40 transition-colors"
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* Date Block */}
                    <div className="w-14 h-14 rounded-[10px] bg-surface-raised border border-border-hairline flex flex-col items-center justify-center shrink-0 font-mono">
                      <span className="text-[10px] text-ink-muted uppercase">
                        {format(date, 'MMM')}
                      </span>
                      <span className="text-lg font-bold text-ink-primary">
                        {format(date, 'd')}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-ink-muted mb-0.5 truncate">
                        {scholarship.provider.name} · {scholarship.fields[0]}
                      </div>
                      <Link
                        to={`/scholarships/${scholarship.slug}`}
                        className="font-serif text-base sm:text-lg text-ink-primary hover:text-brand-primary line-clamp-1 font-normal transition-colors"
                      >
                        {scholarship.title}
                      </Link>
                      <div className="text-xs text-ink-muted mt-1 font-mono">
                        {scholarship.amount.currency} {scholarship.amount.max.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-subtle">
                    <DeadlineChip deadline={scholarship.deadline} />
                    <button
                      onClick={() => downloadIcsCalendar(scholarship)}
                      aria-label={`Export ${scholarship.title} deadline to calendar`}
                      title="Download .ics file"
                      className="px-2.5 py-1.5 text-xs text-ink-muted hover:text-brand-primary bg-surface-card hover:bg-surface-raised border border-border-hairline rounded-[8px] flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">.ics</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past / Closed Deadlines Section */}
          {pastScholarships.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-border-hairline">
              <h2 className="font-serif text-lg text-ink-muted font-normal">
                Closed Deadlines ({pastScholarships.length})
              </h2>
              <div className="bg-surface-card/60 border border-border-hairline rounded-[14px] divide-y divide-border-subtle opacity-75">
                {pastScholarships.map(({ scholarship, date, info }) => (
                  <div
                    key={scholarship.id}
                    className="p-4 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-mono text-ink-faint mr-3">
                        {format(date, 'MMM d, yyyy')}
                      </span>
                      <Link
                        to={`/scholarships/${scholarship.slug}`}
                        className="text-ink-muted hover:underline line-clamp-1"
                      >
                        {scholarship.title}
                      </Link>
                    </div>
                    <span className="font-mono text-[11px] text-semantic-danger shrink-0">
                      Closed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. MONTH CALENDAR VIEW */}
      {viewMode === 'month' && (
        <div className="bg-surface-card border border-border-hairline rounded-[16px] p-6 space-y-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-ink-primary font-medium">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevMonth}
                aria-label="Previous month"
                className="w-9 h-9 flex items-center justify-center rounded-[8px] border border-border-hairline hover:bg-surface-raised transition-colors text-ink-muted"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 text-xs font-mono font-medium rounded-[8px] border border-border-hairline hover:bg-surface-raised transition-colors text-ink-primary"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                aria-label="Next month"
                className="w-9 h-9 flex items-center justify-center rounded-[8px] border border-border-hairline hover:bg-surface-raised transition-colors text-ink-muted"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Month Weekday Header */}
          <div className="grid grid-cols-7 text-center font-mono text-xs text-ink-muted border-b border-border-subtle pb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-px bg-border-hairline rounded-[10px] overflow-hidden border border-border-hairline">
            {daysInView.map((day) => {
              const dayStr = day.toISOString();
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());

              // Scholarships falling on this day
              const dayScholarships = datedScholarships.filter(({ date }) =>
                isSameDay(date, day)
              );

              return (
                <div
                  key={dayStr}
                  className={`min-h-[100px] p-2 flex flex-col justify-between transition-colors ${
                    isCurrentMonth ? 'bg-surface-card' : 'bg-surface-raised/40 text-ink-faint'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-semibold ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-brand-primary text-brand-contrast flex items-center justify-center'
                          : isCurrentMonth
                          ? 'text-ink-primary'
                          : 'text-ink-faint'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                    {dayScholarships.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-saffron" />
                    )}
                  </div>

                  <div className="space-y-1 mt-1">
                    {dayScholarships.map(({ scholarship }) => (
                      <Link
                        key={scholarship.id}
                        to={`/scholarships/${scholarship.slug}`}
                        className="block text-[10px] p-1 rounded bg-surface-raised hover:bg-brand-light hover:text-brand-primary truncate border border-border-subtle transition-colors"
                        title={scholarship.title}
                      >
                        {scholarship.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
