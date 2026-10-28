import { ABBREVIATED_MONTHS, countTasks, formatDateString, generateDailyText } from './daily.ts';
import { copyText } from './clipboard.ts';
import { readJson, readString, STORAGE_KEYS, write } from './storage.ts';
import type { HistoryItem, ThemeMode, TimeOutItem } from './types.ts';

const MAX_HISTORY = 50;
const DEFAULT_EMOJI = '⚡';

const DEFAULT_TIMEOUTS: TimeOutItem[] = [
  { id: 'init-1', title: 'PowerOutage', startTime: '13:00', endTime: '15:00', duration: '2 hours' },
];

export function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function loadTheme(): ThemeMode {
  const stored = readString(STORAGE_KEYS.theme, 'dark');
  return stored === 'light' || stored === 'retro-winforms' ? stored : 'dark';
}

/** Single source of truth for the form, generated output, history and theme. */
class AppState {
  year = $state(0);
  month = $state('');
  day = $state(1);
  tasksRaw = $state(readString(STORAGE_KEYS.draft, ''));
  startTime = $state('-');
  endTime = $state('-');
  timeouts = $state<TimeOutItem[]>(readJson(STORAGE_KEYS.timeouts, DEFAULT_TIMEOUTS));
  timeoutEmoji = $state(readString(STORAGE_KEYS.emoji, DEFAULT_EMOJI));
  history = $state<HistoryItem[]>(readJson(STORAGE_KEYS.history, []));
  theme = $state<ThemeMode>(loadTheme());

  dailyText = $state('');
  validationError = $state<string | null>(null);
  copyStatus = $state<'idle' | 'copied' | 'failed'>('idle');

  taskCount = $derived(countTasks(this.tasksRaw));

  #copyTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.setDate(new Date());
  }

  setDate(date: Date) {
    this.year = date.getFullYear();
    this.month = ABBREVIATED_MONTHS[date.getMonth()];
    this.day = date.getDate();
  }

  setToday() {
    this.setDate(new Date());
  }

  setTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.setDate(tomorrow);
  }

  persist() {
    write(STORAGE_KEYS.draft, this.tasksRaw);
    write(STORAGE_KEYS.timeouts, JSON.stringify(this.timeouts));
    write(STORAGE_KEYS.emoji, this.timeoutEmoji);
    write(STORAGE_KEYS.theme, this.theme);
    write(STORAGE_KEYS.history, JSON.stringify(this.history));
  }

  createDaily() {
    if (!this.month || !this.day) {
      this.validationError = 'Please select a month and day.';
      return;
    }
    this.validationError = null;

    const timeouts = $state.snapshot(this.timeouts);
    const content = generateDailyText({
      year: this.year,
      month: this.month,
      day: this.day,
      tasksRaw: this.tasksRaw,
      startTime: this.startTime,
      endTime: this.endTime,
      timeouts,
      timeoutEmoji: this.timeoutEmoji,
    });
    this.dailyText = content;

    this.history = [
      {
        id: newId(),
        timestamp: Date.now(),
        dateString: formatDateString(this.year, this.month, this.day),
        month: this.month,
        day: this.day,
        year: this.year,
        tasksCount: this.taskCount,
        timeoutsCount: timeouts.length,
        content,
        timeouts,
        timeoutEmoji: this.timeoutEmoji,
      },
      ...this.history.slice(0, MAX_HISTORY - 1),
    ];
  }

  async copyDaily() {
    if (!this.dailyText) return;
    const ok = await copyText(this.dailyText);
    this.copyStatus = ok ? 'copied' : 'failed';
    clearTimeout(this.#copyTimer);
    this.#copyTimer = setTimeout(() => (this.copyStatus = 'idle'), 2000);
  }

  loadHistoryItem(item: HistoryItem) {
    this.month = item.month;
    this.day = item.day;
    this.year = item.year;
    this.dailyText = item.content;
    if (Array.isArray(item.timeouts)) this.timeouts = item.timeouts;
    if (item.timeoutEmoji) this.timeoutEmoji = item.timeoutEmoji;
  }

  deleteHistoryItem(id: string) {
    this.history = this.history.filter((h) => h.id !== id);
  }

  clearHistory() {
    this.history = [];
  }
}

export const app = new AppState();
