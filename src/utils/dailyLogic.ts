// Exact ported business logic from C# WinForms App:
// CultureInfo.InvariantCulture.DateTimeFormat.GetAbbreviatedMonthName
export const ABBREVIATED_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export const DAYS_ARRAY = Array.from({ length: 31 }, (_, i) => i + 1);

/**
 * Port of legacy C# GetDaySuffix:
 * private string GetDaySuffix(int day)
 * {
 *     if (day >= 11 && day <= 13) return "th";
 *     int lastDigit = day % 10;
 *     if (lastDigit == 1) return "st";
 *     if (lastDigit == 2) return "nd";
 *     if (lastDigit == 3) return "rd";
 *     return "th";
 * }
 */
export function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return 'th';
  }

  const lastDigit = day % 10;

  if (lastDigit === 1) return 'st';
  if (lastDigit === 2) return 'nd';
  if (lastDigit === 3) return 'rd';

  return 'th';
}

/**
 * Port of legacy C# btnCreateText_Click:
 * string suffix = GetDaySuffix(day);
 * StringBuilder tasksBuilder = new StringBuilder();
 * foreach (string line in txtTitles.Lines)
 * {
 *     if (!string.IsNullOrWhiteSpace(line))
 *     {
 *         tasksBuilder.AppendLine("- " + line.Trim());
 *     }
 * }
 * string daily =
 *     "🗓 " + DateTime.Now.Year + " - " + month + " - " + day + suffix +
 *     Environment.NewLine +
 *     Environment.NewLine +
 *     "⏰ Start time: -" +
 *     Environment.NewLine +
 *     "⏰ End time: -" +
 *     Environment.NewLine +
 *     "🗒 Today's tasks:" +
 *     Environment.NewLine +
 *     Environment.NewLine +
 *     tasksBuilder.ToString();
 */
import { TimeOutItem } from '../types';

/**
 * Helper to compute duration string like "2 hours", "1 hour", "45 mins", "1 hour 30 mins"
 */
export function calculateDuration(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return '';
  const s = startTime.trim().toLowerCase();
  const e = endTime.trim().toLowerCase();

  const parseTime = (timeStr: string): number | null => {
    const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
      const h = parseInt(match24[1], 10);
      const m = parseInt(match24[2], 10);
      if (h >= 0 && h < 24 && m >= 0 && m < 60) {
        return h * 60 + m;
      }
    }
    const match12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/);
    if (match12) {
      let h = parseInt(match12[1], 10);
      const m = parseInt(match12[2], 10);
      const period = match12[3];
      if (period === 'pm' && h < 12) h += 12;
      if (period === 'am' && h === 12) h = 0;
      return h * 60 + m;
    }
    return null;
  };

  const startMins = parseTime(s);
  const endMins = parseTime(e);

  if (startMins === null || endMins === null) return '';

  let diff = endMins - startMins;
  if (diff < 0) {
    // Crossed midnight
    diff += 24 * 60;
  }

  if (diff === 0) return '0 mins';

  const hours = Math.floor(diff / 60);
  const mins = diff % 60;

  if (hours > 0 && mins === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  if (hours === 0 && mins > 0) {
    return `${mins} ${mins === 1 ? 'min' : 'mins'}`;
  }
  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${mins} mins`;
}

export function generateDailyText({
  year = new Date().getFullYear(),
  month,
  day,
  tasksRaw,
  startTime = '-',
  endTime = '-',
  timeouts = [],
  timeoutEmoji = '⚡',
}: {
  year?: number;
  month: string;
  day: number;
  tasksRaw: string;
  startTime?: string;
  endTime?: string;
  timeouts?: TimeOutItem[];
  timeoutEmoji?: string;
}): string {
  const suffix = getDaySuffix(day);

  // Split lines
  const lines = tasksRaw.split(/\r?\n/);
  const validTasks: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 0) {
      // If user typed "- something" or "something", format cleanly
      const cleanContent = trimmed.startsWith('- ')
        ? trimmed.slice(2).trim()
        : trimmed.startsWith('-')
        ? trimmed.slice(1).trim()
        : trimmed.startsWith('• ')
        ? trimmed.slice(2).trim()
        : trimmed;

      if (cleanContent.length > 0) {
        validTasks.push('- ' + cleanContent);
      }
    }
  }

  // Windows Environment.NewLine formatting: \r\n or \n
  const tasksSection = validTasks.length > 0 ? validTasks.join('\n') + '\n' : '';

  let daily =
    `🗓 ${year} - ${month} - ${day}${suffix}\n\n` +
    `⏰ Start time: ${startTime || '-'}\n` +
    `⏰ End time: ${endTime || '-'}\n` +
    `🗒 Today's tasks:\n\n` +
    tasksSection;

  // Format TimeOuts section if any timeouts exist
  if (timeouts && timeouts.length > 0) {
    const timeoutLines = timeouts
      .filter((t) => t.title && t.title.trim().length > 0)
      .map((t) => {
        const cleanTitle = t.title.trim();
        const duration = t.duration || calculateDuration(t.startTime, t.endTime);
        const durationPart = duration ? ` (${duration})` : '';
        const timePart =
          t.startTime && t.endTime
            ? ` : ${t.startTime.trim()} - ${t.endTime.trim()}`
            : t.startTime
            ? ` : ${t.startTime.trim()}`
            : '';
        return ` -${cleanTitle}${timePart}${durationPart}`;
      });

    if (timeoutLines.length > 0) {
      const emoji = timeoutEmoji?.trim() || '⚡';
      daily = daily.trimEnd() + `\n\n${emoji}TimeOuts:\n${timeoutLines.join('\n')}\n`;
    }
  }

  return daily.trimEnd();
}
