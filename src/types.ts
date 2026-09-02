export interface DailyConfig {
  year: number;
  month: string;
  day: number;
  tasksRaw: string;
  startTime: string;
  endTime: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  dateString: string;
  month: string;
  day: number;
  year: number;
  tasksCount: number;
  content: string;
}

export type ThemeMode = 'dark' | 'light' | 'retro-winforms';
