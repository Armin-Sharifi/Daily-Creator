// localStorage keys are unchanged from the previous version so existing user data carries over.
export const STORAGE_KEYS = {
  draft: 'daily_creator_draft',
  timeouts: 'daily_creator_timeouts',
  emoji: 'daily_creator_timeout_emoji',
  theme: 'daily_creator_theme',
  history: 'daily_creator_history',
} as const;

export function readString(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

export function readJson<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage unavailable or full; the app keeps working without persistence.
  }
}
