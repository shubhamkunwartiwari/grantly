import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Compass, User, DollarSign, Clock, CheckCircle2, ArrowRight, Award, Plus, Sparkles } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGrantlyStore } from '../lib/store';
import { SCHOLARSHIPS } from '../data/scholarships';
import { calculateScholarshipMatch } from '../lib/matching';
import { getDeadlineDate, getDeadlineInfo } from '../lib/dates';
import { Button } from '../components/ui/Button';
import { MatchRing } from '../components/ui/MatchRing';
import { DeadlineChip } from '../components/ui/DeadlineChip';
import { EmptyState } from '../components/ui/EmptyState';
import { ScrollReveal } from '../components/ui/ScrollReveal';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const profile = useGrantlyStore((state) => state.profile);
  const applications = useGrantlyStore((state) => state.applications);

  usePageMeta({
    title: 'Student Dashboard | Grantly',
    description:
      'Personal overview of upcoming scholarship deadlines, tracker stages, potential funding, and top matched awards.',
  });

  const appList = Object.values(applications);

  // Next 3 deadlines from tracker or open scholarships
  const trackedScholarships = appList
    .map((app) => ({
      app,
      scholarship: SCHOLARSHIPS.find((s) => s.id === app.scholarshipId)!,
    }))
    .filter((item) => item.scholarship !== undefined);

  // Calculate potential funding total in tracker
  const totalPotentialFunding = trackedScholarships.reduce(
    (sum, item) => sum + (item.scholarship.amount.max || 0),
    0
  );

  // Compute next 3 deadlines in active pipeline
  const upcomingDeadlines = [...trackedScholarships]
    .filter((item) => {
      const info = getDeadlineInfo(item.scholarship.deadline);
      return !info.isPast;
    })
    .sort((a, b) => {
      const dateA = getDeadlineDate(a.scholarship.deadline)?.getTime() ?? 9999999999999;
      const dateB = getDeadlineDate(b.scholarship.deadline)?.getTime() ?? 9999999999999;
      return dateA - dateB;
    })
    .slice(0, 3);

  // Top 3 new recommended matches
  const topMatches = [...SCHOLARSHIPS]
    .filter((s) => !appList.some((a) => a.scholarshipId === s.id))
    .map((s) => ({
      scholarship: s,
      match: calculateScholarshipMatch(s, profile),
    }))
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, 3);

  // Recommended next action
  let recommendedAction = {
    title: 'Complete your eligibility profile',
    description: 'Add your study level, GPA, and citizenship to calculate accurate matching.',
    buttonText: 'Update profile',
    action: () => navigate('/profile'),
  };

  if (profile.completeness >= 60 && appList.length === 0) {
    recommendedAction = {
      title: 'Add your first scholarship to track',
      description: 'Browse top recommendations and save deadlines to your Kanban board.',
      buttonText: 'Discover scholarships',
      action: () => navigate('/discover'),
    };
  } else if (appList.length > 0) {
    const preparingApp = appList.find((a) => a.status === 'preparing');
    if (preparingApp) {
      const sch = SCHOLARSHIPS.find((s) => s.id === preparingApp.scholarshipId);
      recommendedAction = {
        title: `Work on ${sch?.title || 'preparing application'}`,
        description: 'Complete pending checklist items and upload required documents.',
        buttonText: 'Open tracker',
        action: () => navigate('/tracker'),
      };
    }
  }

  const greetingName = profile.name ? profile.name.split(' ')[0] : 'Scholar';

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-12 w-full space-y-8">
      {/* 1. Header Greeting & Profile Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-hairline">
        <div>
          <div className="text-xs font-mono text-ink-muted mb-1">
            Personal Dashboard
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-ink-primary font-normal tracking-tight">
            Welcome back, {greetingName}.
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Here is your financial aid progress and upcoming submission milestones.
          </p>
        </div>

        {/* Profile Completeness Pill */}
        <Link
          to="/profile"
          className="flex items-center gap-3 p-3 bg-surface-card border border-border-hairline rounded-[12px] hover:border-brand-primary/50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 self-start md:self-auto group"
        >
          <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center font-serif text-sm font-bold text-brand-primary group-hover:scale-105 transition-transform duration-200">
            {profile.completeness}%
          </div>
          <div>
            <div className="text-xs font-semibold text-ink-primary group-hover:text-brand-primary transition-colors">Profile Completeness</div>
            <div className="text-[11px] text-brand-primary hover:underline">
              {profile.completeness < 100 ? 'Add missing details →' : 'Verified profile ✓'}
            </div>
          </div>
        </Link>
      </div>

      {/* 2. Top Summary Metric Cards (Editorial, clean, no filler) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Tracker Active Count */}
        <ScrollReveal direction="left" duration={0.4} className="h-full">
          <div className="h-full p-5 bg-surface-card border border-border-hairline hover:border-brand-primary/50 hover:shadow-md hover:-translate-y-1 transition-all duration-200 rounded-[14px] space-y-1 group">
            <div className="text-xs font-mono uppercase tracking-wider text-ink-muted flex items-center justify-between">
              <span>In Pipeline</span>
              <Award className="w-4 h-4 text-brand-primary group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200" />
            </div>
            <div className="font-mono text-3xl font-bold text-ink-primary tabular-nums group-hover:text-brand-primary transition-colors">
              {appList.length}
            </div>
            <p className="text-[11px] text-ink-muted">
              {appList.filter((a) => a.status === 'preparing').length} currently preparing
            </p>
          </div>
        </ScrollReveal>

        {/* Metric 2: Potential Funding Tracked */}
        <ScrollReveal direction="up" delay={0.08} duration={0.4} className="h-full">
          <div className="h-full p-5 bg-surface-card border border-border-hairline hover:border-accent-saffron/50 hover:shadow-md hover:-translate-y-1 transition-all duration-200 rounded-[14px] space-y-1 group">
            <div className="text-xs font-mono uppercase tracking-wider text-ink-muted flex items-center justify-between">
              <span>Tracked Funding</span>
              <DollarSign className="w-4 h-4 text-accent-deep group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200" />
            </div>
            <div className="font-mono text-3xl font-bold text-ink-primary tabular-nums group-hover:text-accent-deep transition-colors">
              ${totalPotentialFunding.toLocaleString()}
            </div>
            <p className="text-[11px] text-ink-muted">Cumulative ceiling in tracker</p>
          </div>
        </ScrollReveal>

        {/* Metric 3: Next Target Deadline */}
        <ScrollReveal direction="right" delay={0.16} duration={0.4} className="h-full">
          <div className="h-full p-5 bg-surface-card border border-border-hairline hover:border-brand-primary/50 hover:shadow-md hover:-translate-y-1 transition-all duration-200 rounded-[14px] space-y-1 group">
            <div className="text-xs font-mono uppercase tracking-wider text-ink-muted flex items-center justify-between">
              <span>Next Target</span>
              <Clock className="w-4 h-4 text-brand-primary group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200" />
            </div>
            <div className="font-mono text-2xl font-bold text-ink-primary truncate group-hover:text-brand-primary transition-colors">
              {upcomingDeadlines[0]
                ? getDeadlineInfo(upcomingDeadlines[0].scholarship.deadline).relative
                : 'None active'}
            </div>
            <p className="text-[11px] text-ink-muted truncate">
              {upcomingDeadlines[0]?.scholarship.title || 'All deadlines clear'}
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* 3. Recommended Next Action Focal Card */}
      <ScrollReveal direction="up" duration={0.45}>
        <div className="p-6 bg-surface-card border-2 border-brand-primary/20 rounded-[16px] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase text-brand-primary font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Next Step</span>
            </div>
            <h3 className="font-serif text-xl text-ink-primary font-medium">
              {recommendedAction.title}
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted max-w-xl">
              {recommendedAction.description}
            </p>
          </div>
          <Button variant="primary" onClick={recommendedAction.action} className="shrink-0">
            {recommendedAction.buttonText}
          </Button>
        </div>
      </ScrollReveal>

      {/* 4. Two Columns: Next 3 Deadlines + Top Recommended Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Next Three Deadlines (Slides from left) */}
        <ScrollReveal direction="left" duration={0.45}>
          <div className="bg-surface-card border border-border-hairline rounded-[16px] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-primary" />
                <h3 className="font-serif text-lg text-ink-primary font-medium">
                  Next Upcoming Deadlines
                </h3>
              </div>
              <Link to="/calendar" className="text-xs font-medium text-brand-primary hover:underline">
                View Calendar →
              </Link>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <div className="py-8 text-center text-xs text-ink-muted">
                No active upcoming deadlines in your tracker.
              </div>
            ) : (
              <div className="divide-y divide-border-subtle">
                {upcomingDeadlines.map(({ app, scholarship }) => (
                  <div key={app.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/scholarships/${scholarship.slug}`}
                        className="font-medium text-sm text-ink-primary hover:text-brand-primary line-clamp-1"
                      >
                        {scholarship.title}
                      </Link>
                      <div className="text-xs text-ink-muted mt-0.5">
                        {scholarship.provider.name} · Stage: <span className="capitalize">{app.status}</span>
                      </div>
                    </div>
                    <DeadlineChip deadline={scholarship.deadline} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Top New Matched Scholarships (Slides from right) */}
        <ScrollReveal direction="right" duration={0.45}>
          <div className="bg-surface-card border border-border-hairline rounded-[16px] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-brand-primary" />
                <h3 className="font-serif text-lg text-ink-primary font-medium">
                  Top Matched Opportunities
                </h3>
              </div>
              <Link to="/discover" className="text-xs font-medium text-brand-primary hover:underline">
                Discover All →
              </Link>
            </div>

            <div className="divide-y divide-border-subtle">
              {topMatches.map(({ scholarship, match }) => (
                <div key={scholarship.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/scholarships/${scholarship.slug}`}
                      className="font-medium text-sm text-ink-primary hover:text-brand-primary line-clamp-1"
                    >
                      {scholarship.title}
                    </Link>
                    <div className="text-xs text-ink-muted mt-0.5">
                      {scholarship.amount.currency} {scholarship.amount.max.toLocaleString()} · {scholarship.fields[0]}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <MatchRing score={match.score} size={42} />
                    <Link
                      to={`/scholarships/${scholarship.slug}`}
                      className="text-xs text-brand-primary hover:underline font-medium p-1"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};
