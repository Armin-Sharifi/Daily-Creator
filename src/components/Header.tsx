import React from 'react';
import { History, Monitor, Sun, Moon, Keyboard, BookOpen } from 'lucide-react';
import { ThemeMode } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onOpenHistory: () => void;
  historyCount: number;
  onOpenShortcuts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  onOpenHistory,
  historyCount,
  onOpenShortcuts,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-200 border-[#E5E3DC] bg-[#F9F7F2]/90 text-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Logo & Editorial Masthead */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 border border-[#1A1A1A] bg-[#1A1A1A] text-[#F9F7F2] flex items-center justify-center font-serif text-lg italic shadow-editorial-sm">
            T
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl serif-title italic font-light tracking-tight text-[#1A1A1A]">
                Task Journal
              </h1>
              <span className="hidden sm:inline-block text-[9px] uppercase tracking-[0.2em] font-bold opacity-50 px-2 py-0.5 border border-[#D1CFCA] bg-white">
                PWA // 1.0
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 hidden xs:block">
              Daily Format & Standup System
            </p>
          </div>
        </div>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Keyboard Shortcuts Trigger */}
          <button
            id="shortcuts-btn"
            onClick={onOpenShortcuts}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 border border-[#D1CFCA] bg-white text-[#1A1A1A] hover:border-[#1A1A1A] transition text-[11px] uppercase tracking-wider font-bold cursor-pointer"
            title="Keyboard shortcuts"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Keys</span>
          </button>

          {/* History Button */}
          <button
            id="history-btn"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 border border-[#D1CFCA] bg-white text-[#1A1A1A] hover:border-[#1A1A1A] transition text-[11px] uppercase tracking-wider font-bold cursor-pointer"
            title="View saved daily notes"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Journal</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[9px] font-mono font-bold bg-[#1A1A1A] text-[#F9F7F2]">
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Selector Pill */}
          <div className="flex items-center bg-[#F4F2ED] p-0.5 border border-[#D1CFCA] text-xs">
            <button
              onClick={() => onThemeChange('light')}
              className={`px-2 py-1 transition-all cursor-pointer text-[10px] uppercase tracking-widest font-bold ${
                theme === 'light'
                  ? 'bg-[#1A1A1A] text-[#F9F7F2]'
                  : 'text-[#1A1A1A] opacity-60 hover:opacity-100'
              }`}
              title="Editorial Paper"
            >
              Paper
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              className={`p-1 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#1A1A1A] text-[#F9F7F2]'
                  : 'text-[#1A1A1A] opacity-60 hover:opacity-100'
              }`}
              title="Dark Ink"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('retro-winforms')}
              className={`flex items-center gap-1 px-1.5 py-1 transition-all text-[10px] uppercase tracking-wider font-bold cursor-pointer ${
                theme === 'retro-winforms'
                  ? 'bg-[#1A1A1A] text-[#F9F7F2]'
                  : 'text-[#1A1A1A] opacity-60 hover:opacity-100'
              }`}
              title="Classic WinForms Style"
            >
              <Monitor className="w-3 h-3" />
              <span className="hidden md:inline">.NET</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
