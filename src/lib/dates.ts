import { addDays, format, isAfter, isBefore, startOfDay } from 'date-fns';
import { Scholarship } from '../types';

export type UrgencyState = 'closed' | 'closing_soon' | 'closing_month' | 'later' | 'rolling';

export interface DeadlineInfo {
  date: Date | null;
  dateStr: string;
  relative: string;
  urgency: UrgencyState;
  isPast: boolean;
  daysRemaining: number | null;
}

/**
 * Computes the runtime date from offsetDays relative to midnight of current day.
 */
export function getDeadlineDate(
  deadline: Scholarship['deadline'],
  baseDate: Date = new Date()
): Date | null {
  if (deadline.kind === 'rolling' || deadline.offsetDays === undefined) {
    return null;
  }
  const today = startOfDay(baseDate);
  return addDays(today, deadline.offsetDays);
}

/**
 * Formats a deadline into human-readable date, relative label, and urgency state.
 */
export function getDeadlineInfo(
  deadline: Scholarship['deadline'],
  baseDate: Date = new Date()
): DeadlineInfo {
  if (deadline.kind === 'rolling' || deadline.offsetDays === undefined) {
    return {
      date: null,
      dateStr: 'Rolling Admissions',
      relative: 'Rolling deadline',
      urgency: 'rolling',
      isPast: false,
      daysRemaining: null,
    };
  }

  const date = getDeadlineDate(deadline, baseDate);
  if (!date || isNaN(date.getTime())) {
    return {
      date: null,
      dateStr: 'TBD',
      relative: 'TBD',
      urgency: 'later',
      isPast: false,
      daysRemaining: null,
    };
  }

  const today = startOfDay(baseDate);
  const daysDiff = deadline.offsetDays;
  const dateStr = format(date, 'MMM d, yyyy');

  if (daysDiff < 0) {
    const daysAgo = Math.abs(daysDiff);
    return {
      date,
      dateStr,
      relative: daysAgo === 1 ? 'Closed yesterday' : `Closed ${daysAgo}d ago`,
      urgency: 'closed',
      isPast: true,
      daysRemaining: daysDiff,
    };
  }

  if (daysDiff === 0) {
    return {
      date,
      dateStr,
      relative: 'Closes today at 11:59 PM',
      urgency: 'closing_soon',
      isPast: false,
      daysRemaining: 0,
    };
  }

  if (daysDiff === 1) {
    return {
      date,
      dateStr,
      relative: 'Closes tomorrow',
      urgency: 'closing_soon',
      isPast: false,
      daysRemaining: 1,
    };
  }

  if (daysDiff <= 7) {
    return {
      date,
      dateStr,
      relative: `${daysDiff} days left`,
      urgency: 'closing_soon',
      isPast: false,
      daysRemaining: daysDiff,
    };
  }

  if (daysDiff <= 30) {
    return {
      date,
      dateStr,
      relative: `${daysDiff} days left`,
      urgency: 'closing_month',
      isPast: false,
      daysRemaining: daysDiff,
    };
  }

  return {
    date,
    dateStr,
    relative: `${daysDiff} days left`,
    urgency: 'later',
    isPast: false,
    daysRemaining: daysDiff,
  };
}

/**
 * Escapes characters for iCalendar RFC 5545 spec
 */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Client-side RFC 5545 .ics generator for calendar exports
 */
export function downloadIcsCalendar(scholarship: Scholarship): void {
  const deadlineDate = getDeadlineDate(scholarship.deadline);
  if (!deadlineDate) return;

  const year = deadlineDate.getFullYear();
  const month = String(deadlineDate.getMonth() + 1).padStart(2, '0');
  const day = String(deadlineDate.getDate()).padStart(2, '0');
  const dtStart = `${year}${month}${day}T235900`;
  const dtEnd = `${year}${month}${day}T235959`;
  const now = new Date();
  const dtStamp = format(now, "yyyyMMdd'T'HHmmss'Z'");

  const summary = escapeIcsText(`Deadline: ${scholarship.title}`);
  const description = escapeIcsText(
    `Scholarship: ${scholarship.title}\\nProvider: ${scholarship.provider.name}\\nAmount: ${scholarship.amount.currency} ${scholarship.amount.max.toLocaleString()}\\nManaged in Grantly.`
  );

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Grantly//Scholarship Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:grantly-${scholarship.id}-${Date.now()}@grantly.app`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P3D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Scholarship application deadline in 3 days',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${scholarship.slug}-deadline.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
