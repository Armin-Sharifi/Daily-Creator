/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ABBREVIATED_MONTHS, DAYS_ARRAY, generateDailyText, getDaySuffix } from './utils/dailyLogic';
import { HistoryItem, ThemeMode } from './types';
import { Header } from './components/Header';
import { DateSelector } from './components/DateSelector';
import { TaskEditor } from './components/TaskEditor';
import { DailyPreview } from './components/DailyPreview';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ShortcutsModal } from './components/ShortcutsModal';
import { RetroWinFormsView } from './components/RetroWinFormsView';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // Initialize with today's date (Exact match to C# Main_Load: DateTime today = DateTime.Now;)
  const [today] = useState(() => new Date());
  const [year, setYear] = useState<number>(() => today.getFullYear());
  const [month, setMonth] = useState<string>(() => ABBREVIATED_MONTHS[today.getMonth()]);
  const [day, setDay] = useState<number>(() => today.getDate());

  // Input states
  const [tasksRaw, setTasksRaw] = useState<string>(() => {
    try {
      return localStorage.getItem('daily_creator_draft') || '';
    } catch {
      return '';
    }
  });

  const [startTime, setStartTime] = useState<string>('-');
  const [endTime, setEndTime] = useState<string>('-');

  // Generated output state
  const [dailyText, setDailyText] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('daily_creator_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem('daily_creator_theme') as ThemeMode) || 'dark';
    } catch {
      return 'dark';
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Persist draft and theme
  useEffect(() => {
    try {
      localStorage.setItem('daily_creator_draft', tasksRaw);
    } catch {}
  }, [tasksRaw]);

  useEffect(() => {
    try {
      localStorage.setItem('daily_creator_theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('daily_creator_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  // Set to today
  const handleSetToday = useCallback(() => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(ABBREVIATED_MONTHS[now.getMonth()]);
    setDay(now.getDate());
  }, []);

  // Set to tomorrow
  const handleSetTomorrow = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setYear(tomorrow.getFullYear());
    setMonth(ABBREVIATED_MONTHS[tomorrow.getMonth()]);
    setDay(tomorrow.getDate());
  }, []);

  // Core generation logic (Exact port of btnCreateText_Click)
  const handleCreateDaily = useCallback(() => {
    if (!month || !day) {
      setValidationError('Please select a month and day.');
      return;
    }
    setValidationError(null);

    const generated = generateDailyText({
      year,
      month,
      day,
      tasksRaw,
      startTime,
      endTime,
    });

    setDailyText(generated);

    // Save to history automatically if there's content
    const tasksCount = tasksRaw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0).length;

    const newHistoryItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      dateString: `${year} - ${month} - ${day}${getDaySuffix(day)}`,
      month,
      day,
      year,
      tasksCount,
      content: generated,
    };

    setHistory((prev) => [newHistoryItem, ...prev.slice(0, 49)]); // Keep last 50
  }, [year, month, day, tasksRaw, startTime, endTime]);

  // Copy to clipboard (Exact port of btnCopy_Click: Clipboard.SetText(txtDaily.Text);)
  const handleCopyDaily = useCallback(() => {
    if (!dailyText) return;
    navigator.clipboard.writeText(dailyText);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [dailyText]);

  // Load from history
  const handleLoadHistoryItem = (item: HistoryItem) => {
    setMonth(item.month);
    setDay(item.day);
    setYear(item.year);
    setDailyText(item.content);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all saved daily notes?')) {
      setHistory([]);
    }
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter or Cmd+Enter: Create Daily
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleCreateDaily();
      }
      // Ctrl+Shift+C or Cmd+Shift+C: Copy Daily
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        handleCopyDaily();
      }
      // Escape: Close modals
      if (e.key === 'Escape') {
        setIsHistoryOpen(false);
        setIsShortcutsOpen(false);
        setValidationError(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCreateDaily, handleCopyDaily]);

  // Calculate task lines count
  const tasksCount = tasksRaw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0).length;

  // Real-time clock for Editorial Aesthetic footer
  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === 'light'
          ? 'bg-[#F9F7F2] text-[#1A1A1A]'
          : theme === 'retro-winforms'
          ? 'bg-[#3a6ea5] text-slate-900'
          : 'bg-[#181818] text-[#EDEDED]'
      }`}
    >
      {/* Header */}
      <Header
        theme={theme}
        onThemeChange={setTheme}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {theme === 'retro-winforms' ? (
          <div className="py-4">
            <div className="mb-4 text-center">
              <span className="inline-block bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm border border-slate-300">
                Retro WinForms Mode — Replicating your original .NET Form layout
              </span>
            </div>
            <RetroWinFormsView
              month={month}
              day={day}
              tasksRaw={tasksRaw}
              dailyText={dailyText}
              onMonthChange={setMonth}
              onDayChange={setDay}
              onTasksChange={setTasksRaw}
              onCreateDaily={handleCreateDaily}
              onCopyDaily={handleCopyDaily}
              isCopied={isCopied}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Validation Message Alert */}
            {validationError && (
              <div className="bg-[#fffbeb] border border-[#fef08a] p-3.5 flex items-center justify-between text-xs text-[#854d0e] animate-in fade-in shadow-xs">
                <span className="font-medium">⚠️ {validationError}</span>
                <button
                  onClick={() => setValidationError(null)}
                  className="font-bold hover:underline px-2 py-0.5"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Two-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Date & Task Editor (6 cols on lg) */}
              <div className="lg:col-span-6 xl:col-span-6 space-y-4">
                <DateSelector
                  month={month}
                  day={day}
                  year={year}
                  onMonthChange={setMonth}
                  onDayChange={setDay}
                  onYearChange={setYear}
                  onSetToday={handleSetToday}
                  onSetTomorrow={handleSetTomorrow}
                />

                <TaskEditor
                  tasksRaw={tasksRaw}
                  onChange={setTasksRaw}
                  startTime={startTime}
                  endTime={endTime}
                  onStartTimeChange={setStartTime}
                  onEndTimeChange={setEndTime}
                  onCreateDaily={handleCreateDaily}
                />
              </div>

              {/* Right Column: Output & Actions (6 cols on lg) */}
              <div className="lg:col-span-6 xl:col-span-6 space-y-4 lg:sticky lg:top-24">
                <DailyPreview
                  dailyText={dailyText}
                  onCreateDaily={handleCreateDaily}
                  onCopyDaily={handleCopyDaily}
                  isCopied={isCopied}
                  tasksCount={tasksCount}
                />

                {/* Editorial Status Bar & Live Clock */}
                <div className="mt-8 flex justify-between items-end pt-4 border-t border-[#E5E3DC] opacity-70">
                  <div className="space-y-0.5">
                    <p className="text-[9px] uppercase tracking-[0.25em] font-bold opacity-50">
                      Export Status
                    </p>
                    <p className="text-[12px] italic serif-title">
                      {dailyText ? 'Ready for distribution' : 'Awaiting task input'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[22px] serif-title font-light leading-none">
                      {currentTime}
                    </p>
                    <p className="text-[9px] uppercase tracking-[0.25em] opacity-50 font-bold">
                      Local Time
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-[10px] uppercase tracking-widest opacity-40">
                  <span>Legacy Sync Active</span>
                  <span>.NET FW 4.8 Core</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadItem={handleLoadHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
