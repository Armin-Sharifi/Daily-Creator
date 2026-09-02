import React from 'react';
import { Calendar as CalendarIcon, Clock, ChevronDown, Sparkles } from 'lucide-react';
import { ABBREVIATED_MONTHS, DAYS_ARRAY, getDaySuffix } from '../utils/dailyLogic';

interface DateSelectorProps {
  month: string;
  day: number;
  year: number;
  onMonthChange: (month: string) => void;
  onDayChange: (day: number) => void;
  onYearChange?: (year: number) => void;
  onSetToday: () => void;
  onSetTomorrow: () => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  month,
  day,
  year,
  onMonthChange,
  onDayChange,
  onYearChange,
  onSetToday,
  onSetTomorrow,
}) => {
  const suffix = getDaySuffix(day);

  // Hidden native date input handler for seamless calendar picker
  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const [y, m, d] = e.target.value.split('-').map(Number);
    if (y && m && d) {
      if (onYearChange) onYearChange(y);
      onMonthChange(ABBREVIATED_MONTHS[m - 1]);
      onDayChange(d);
    }
  };

  // Convert current state to YYYY-MM-DD for native picker
  const monthIndex = ABBREVIATED_MONTHS.indexOf(month as any);
  const formattedMonthNum = monthIndex >= 0 ? String(monthIndex + 1).padStart(2, '0') : '01';
  const formattedDayNum = String(day).padStart(2, '0');
  const nativeDateValue = `${year}-${formattedMonthNum}-${formattedDayNum}`;

  return (
    <div className="bg-[#F4F2ED] border border-[#E5E3DC] p-5 sm:p-6 shadow-editorial-sm space-y-5 text-[#1A1A1A]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5E3DC]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-6 h-6 border border-[#1A1A1A] bg-[#1A1A1A] text-[#F9F7F2]">
            <CalendarIcon className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold opacity-60">
              Select Target Date
            </h2>
          </div>
        </div>

        {/* Quick Date Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSetToday}
            className="px-3 py-1 bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-[#F9F7F2] border border-[#D1CFCA] hover:border-[#1A1A1A] transition text-[10px] uppercase tracking-widest font-bold active:scale-95 cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            onClick={onSetTomorrow}
            className="px-3 py-1 bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-[#F9F7F2] border border-[#D1CFCA] hover:border-[#1A1A1A] transition text-[10px] uppercase tracking-widest font-bold active:scale-95 cursor-pointer"
          >
            Tomorrow
          </button>
          
          {/* Calendar Picker Trigger */}
          <label className="relative flex items-center justify-center p-1.5 bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-[#F9F7F2] border border-[#D1CFCA] hover:border-[#1A1A1A] transition cursor-pointer" title="Pick on calendar">
            <CalendarIcon className="w-3.5 h-3.5" />
            <input
              type="date"
              value={nativeDateValue}
              onChange={handleNativeDateChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
        </div>
      </div>

      {/* Selects Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
        {/* Month Dropdown */}
        <div className="space-y-1">
          <label htmlFor="month-select" className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 flex items-center justify-between">
            <span>Month</span>
            <span className="font-mono text-[9px]">{month}</span>
          </label>
          <div className="relative">
            <select
              id="month-select"
              value={month}
              onChange={(e) => onMonthChange(e.target.value)}
              className="w-full bg-white border border-[#E5E3DC] hover:border-[#1A1A1A] px-3.5 py-2.5 serif-title italic text-xl text-[#1A1A1A] input-focus appearance-none cursor-pointer transition shadow-xs"
            >
              {ABBREVIATED_MONTHS.map((m) => (
                <option key={m} value={m} className="font-sans text-sm not-italic text-[#1A1A1A]">
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A] opacity-40" />
          </div>
        </div>

        {/* Day Dropdown */}
        <div className="space-y-1">
          <label htmlFor="day-select" className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 flex items-center justify-between">
            <span>Day</span>
            <span className="font-mono text-[9px]">Suffix: <strong>{suffix}</strong></span>
          </label>
          <div className="relative">
            <select
              id="day-select"
              value={day}
              onChange={(e) => onDayChange(Number(e.target.value))}
              className="w-full bg-white border border-[#E5E3DC] hover:border-[#1A1A1A] px-3.5 py-2.5 serif-title italic text-xl text-[#1A1A1A] input-focus appearance-none cursor-pointer transition shadow-xs"
            >
              {DAYS_ARRAY.map((d) => (
                <option key={d} value={d} className="font-sans text-sm not-italic text-[#1A1A1A]">
                  {d} {getDaySuffix(d)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A] opacity-40" />
          </div>
        </div>
      </div>
    </div>
  );
};
