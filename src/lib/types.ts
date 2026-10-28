export interface TimeOutItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration?: string;
}

export interface DailyInput {
  year: number;
  month: string;
  day: number;
  tasksRaw: string;
  startTime?: string;
  endTime?: string;
  timeouts?: TimeOutItem[];
  timeoutEmoji?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  dateString: string;
  month: string;
  day: number;
  year: number;
  tasksCount: number;
  timeoutsCount?: number;
  content: string;
  timeouts?: TimeOutItem[];
  timeoutEmoji?: string;
}

export type ThemeMode = 'light' | 'dark';
