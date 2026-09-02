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
export function generateDailyText({
  year = new Date().getFullYear(),
  month,
  day,
  tasksRaw,
  startTime = '-',
  endTime = '-',
}: {
  year?: number;
  month: string;
  day: number;
  tasksRaw: string;
  startTime?: string;
  endTime?: string;
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

  const daily =
    `🗓 ${year} - ${month} - ${day}${suffix}\n\n` +
    `⏰ Start time: ${startTime || '-'}\n` +
    `⏰ End time: ${endTime || '-'}\n` +
    `🗒 Today's tasks:\n\n` +
    tasksSection;

  return daily.trimEnd();
}
