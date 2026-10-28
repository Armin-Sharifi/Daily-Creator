import type { DailyInput } from './types.ts';

// Month names match CultureInfo.InvariantCulture abbreviated month names (legacy WinForms app).
export const ABBREVIATED_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

export const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/** Parses "HH:mm" (24h) or "h:mm am/pm" into minutes since midnight. */
function parseTime(value: string): number | null {
  const match24 = value.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const h = parseInt(match24[1], 10);
    const m = parseInt(match24[2], 10);
    if (h >= 0 && h < 24 && m >= 0 && m < 60) return h * 60 + m;
  }
  const match12 = value.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/);
  if (match12) {
    let h = parseInt(match12[1], 10);
    const m = parseInt(match12[2], 10);
    if (match12[3] === 'pm' && h < 12) h += 12;
    if (match12[3] === 'am' && h === 12) h = 0;
    return h * 60 + m;
  }
  return null;
}

/** Human duration such as "2 hours", "45 mins", "1 hour 30 mins". Empty string if either time is unparsable. */
export function calculateDuration(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return '';
  const start = parseTime(startTime.trim().toLowerCase());
  const end = parseTime(endTime.trim().toLowerCase());
  if (start === null || end === null) return '';

  let diff = end - start;
  if (diff < 0) diff += 24 * 60; // crossed midnight
  if (diff === 0) return '0 mins';

  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  if (hours > 0 && mins === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  if (hours === 0) return `${mins} ${mins === 1 ? 'min' : 'mins'}`;
  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${mins} mins`;
}

export function countTasks(tasksRaw: string): number {
  return tasksRaw.split(/\r?\n/).filter((line) => line.trim().length > 0).length;
}

/** Strips a single leading "- ", "-" or "• " bullet from a trimmed line. */
function stripBullet(trimmed: string): string {
  if (trimmed.startsWith('- ')) return trimmed.slice(2).trim();
  if (trimmed.startsWith('-')) return trimmed.slice(1).trim();
  if (trimmed.startsWith('• ')) return trimmed.slice(2).trim();
  return trimmed;
}

export function formatDateString(year: number, month: string, day: number): string {
  return `${year} - ${month} - ${day}${getDaySuffix(day)}`;
}

export function formatTimeoutLine(t: {
  title: string;
  startTime: string;
  endTime: string;
  duration?: string;
}): string {
  const duration = t.duration || calculateDuration(t.startTime, t.endTime);
  const durationPart = duration ? ` (${duration})` : '';
  const timePart =
    t.startTime && t.endTime
      ? ` : ${t.startTime.trim()} - ${t.endTime.trim()}`
      : t.startTime
        ? ` : ${t.startTime.trim()}`
        : '';
  return ` -${t.title.trim()}${timePart}${durationPart}`;
}

export function generateDailyText({
  year,
  month,
  day,
  tasksRaw,
  startTime = '-',
  endTime = '-',
  timeouts = [],
  timeoutEmoji = '⚡',
}: DailyInput): string {
  const tasks: string[] = [];
  for (const line of tasksRaw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const content = stripBullet(trimmed);
    if (content) tasks.push('- ' + content);
  }

  let daily =
    `🗓 ${formatDateString(year, month, day)}\n\n` +
    `⏰ Start time: ${startTime || '-'}\n` +
    `⏰ End time: ${endTime || '-'}\n` +
    `🗒 Today's tasks:\n\n` +
    (tasks.length > 0 ? tasks.join('\n') + '\n' : '');

  const timeoutLines = timeouts
    .filter((t) => t.title && t.title.trim().length > 0)
    .map(formatTimeoutLine);

  if (timeoutLines.length > 0) {
    const emoji = timeoutEmoji?.trim() || '⚡';
    daily = daily.trimEnd() + `\n\n${emoji}TimeOuts:\n${timeoutLines.join('\n')}\n`;
  }

  return daily.trimEnd();
}
