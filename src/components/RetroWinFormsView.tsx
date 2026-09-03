import React, { useState } from 'react';
import { ABBREVIATED_MONTHS, DAYS_ARRAY, getDaySuffix, calculateDuration } from '../utils/dailyLogic';
import { TimeOutItem } from '../types';

interface RetroWinFormsViewProps {
  month: string;
  day: number;
  tasksRaw: string;
  dailyText: string;
  timeouts: TimeOutItem[];
  timeoutEmoji: string;
  onMonthChange: (m: string) => void;
  onDayChange: (d: number) => void;
  onTasksChange: (t: string) => void;
  onTimeoutsChange: (t: TimeOutItem[]) => void;
  onEmojiChange: (e: string) => void;
  onCreateDaily: () => void;
  onCopyDaily: () => void;
  isCopied: boolean;
}

export const RetroWinFormsView: React.FC<RetroWinFormsViewProps> = ({
  month,
  day,
  tasksRaw,
  dailyText,
  timeouts,
  timeoutEmoji,
  onMonthChange,
  onDayChange,
  onTasksChange,
  onTimeoutsChange,
  onEmojiChange,
  onCreateDaily,
  onCopyDaily,
  isCopied,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newStart, setNewStart] = useState('13:00');
  const [newEnd, setNewEnd] = useState('15:00');

  const handleAddTimeout = () => {
    if (!newTitle.trim()) return;
    const dur = calculateDuration(newStart, newEnd);
    onTimeoutsChange([
      ...timeouts,
      {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: newTitle.trim(),
        startTime: newStart.trim(),
        endTime: newEnd.trim(),
        duration: dur,
      },
    ]);
    setNewTitle('');
  };

  const handleRemoveTimeout = (id: string) => {
    onTimeoutsChange(timeouts.filter((t) => t.id !== id));
  };

  return (
    <div className="w-full max-w-[420px] mx-auto font-['Tahoma',sans-serif] text-[12px] bg-[#f0f0f0] text-black border-2 border-[#0055ea] rounded-t-lg shadow-2xl overflow-hidden select-none">
      {/* Windows 7 Aero Style Titlebar */}
      <div className="bg-gradient-to-b from-[#d9e8fb] via-[#bad7f8] to-[#99c4f5] px-2.5 py-1.5 flex items-center justify-between border-b border-[#7098c4]">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-gradient-to-tr from-blue-700 to-cyan-400 rounded-xs flex items-center justify-center text-[10px] text-white font-bold">
            🗓
          </div>
          <span className="font-semibold text-[#1e395b] text-[12px]">Daily Creator V1.1</span>
        </div>

        {/* Win Window Buttons */}
        <div className="flex items-center gap-1">
          <div className="w-5 h-4 bg-[#e1e9f2] border border-[#a4b9d1] rounded-xs flex items-center justify-center text-[10px] text-[#4c607a]">
            _
          </div>
          <div className="w-5 h-4 bg-[#e1e9f2] border border-[#a4b9d1] rounded-xs flex items-center justify-center text-[9px] text-[#4c607a]">
            □
          </div>
          <div className="w-6 h-4 bg-gradient-to-b from-[#e89080] to-[#c74534] border border-[#962d22] rounded-xs flex items-center justify-center text-[10px] text-white font-bold">
            ✕
          </div>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="p-3.5 space-y-3 bg-[#f0f0f0]">
        {/* Date GroupBox */}
        <fieldset className="border border-[#d0d0d0] rounded-xs p-2.5 pt-1 bg-[#f4f4f4]">
          <legend className="px-1 text-[11px] text-[#333] font-normal">Date</legend>
          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="flex items-center gap-1.5 flex-1">
              <label htmlFor="retro-month" className="text-[11px] shrink-0 text-[#222]">Month :</label>
              <select
                id="retro-month"
                value={month}
                onChange={(e) => onMonthChange(e.target.value)}
                className="w-full bg-white border border-[#7f9db9] rounded-none px-1 py-0.5 text-[12px] text-black focus:outline-none"
              >
                {ABBREVIATED_MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 flex-1">
              <label htmlFor="retro-day" className="text-[11px] shrink-0 text-[#222]">Day :</label>
              <select
                id="retro-day"
                value={day}
                onChange={(e) => onDayChange(Number(e.target.value))}
                className="w-full bg-white border border-[#7f9db9] rounded-none px-1 py-0.5 text-[12px] text-black focus:outline-none"
              >
                {DAYS_ARRAY.map((d) => (
                  <option key={d} value={d}>
                    {d} ({getDaySuffix(d)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Tasks Per Line */}
        <div className="space-y-1">
          <label htmlFor="retro-tasks" className="block text-[11px] text-[#222]">Tasks Per Line :</label>
          <textarea
            id="retro-tasks"
            value={tasksRaw}
            onChange={(e) => onTasksChange(e.target.value)}
            rows={4}
            className="w-full bg-white border border-[#7f9db9] p-1.5 text-[12px] font-sans text-black focus:outline-none resize-none leading-tight"
          />
        </div>

        {/* TimeOuts GroupBox (v1.1) */}
        <fieldset className="border border-[#d0d0d0] rounded-xs p-2.5 pt-1 bg-[#f4f4f4] space-y-2">
          <legend className="px-1 text-[11px] text-[#333] font-normal">
            TimeOuts (v1.1)
          </legend>

          <div className="flex items-center gap-1 text-[11px]">
            <label htmlFor="retro-emoji" className="shrink-0 text-[#222]">Emoji:</label>
            <input
              id="retro-emoji"
              type="text"
              value={timeoutEmoji}
              onChange={(e) => onEmojiChange(e.target.value)}
              className="w-10 bg-white border border-[#7f9db9] px-1 py-0.5 text-center text-[12px]"
            />
            <div className="flex gap-1 ml-1">
              {['⚡', '⏸️', '☕', '🔌'].map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => onEmojiChange(em)}
                  className="px-1 border border-[#ccc] bg-white text-[10px]"
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-1.5 items-center">
            <input
              type="text"
              placeholder="Title (e.g. PowerOutage)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 bg-white border border-[#7f9db9] px-1.5 py-0.5 text-[11px]"
            />
            <input
              type="text"
              placeholder="13:00"
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
              className="w-14 bg-white border border-[#7f9db9] px-1 py-0.5 text-center text-[11px]"
            />
            <span className="text-[10px]">-</span>
            <input
              type="text"
              placeholder="15:00"
              value={newEnd}
              onChange={(e) => setNewEnd(e.target.value)}
              className="w-14 bg-white border border-[#7f9db9] px-1 py-0.5 text-center text-[11px]"
            />
            <button
              type="button"
              onClick={handleAddTimeout}
              className="px-2 py-0.5 bg-gradient-to-b from-[#f2f2f2] to-[#ebebeb] border border-[#707070] text-[11px] cursor-pointer"
            >
              + Add
            </button>
          </div>

          {timeouts.length > 0 && (
            <div className="space-y-1 max-h-24 overflow-y-auto pt-1">
              {timeouts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white border border-[#e0e0e0] px-1.5 py-0.5 text-[11px]"
                >
                  <span className="truncate">
                    {timeoutEmoji} -{item.title} : {item.startTime} - {item.endTime} (
                    {item.duration || calculateDuration(item.startTime, item.endTime)})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTimeout(item.id)}
                    className="text-red-600 font-bold ml-1 text-[10px]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </fieldset>

        {/* Create Daily Button */}
        <button
          type="button"
          onClick={onCreateDaily}
          className="w-full py-1.5 px-3 bg-gradient-to-b from-[#f2f2f2] to-[#ebebeb] hover:from-[#e6f0fa] hover:to-[#cce4f7] active:from-[#cce4f7] active:to-[#b8d6f2] border border-[#707070] rounded-xs text-[12px] font-normal text-black cursor-pointer shadow-xs active:translate-y-px"
        >
          Create Daily
        </button>

        {/* Daily Output */}
        <div className="space-y-1">
          <label htmlFor="retro-daily" className="block text-[11px] text-[#222]">Daily :</label>
          <textarea
            id="retro-daily"
            readOnly
            value={dailyText}
            rows={5}
            className="w-full bg-white border border-[#7f9db9] p-1.5 text-[12px] font-sans text-black focus:outline-none resize-none leading-tight"
          />
        </div>

        {/* Copy Daily Button */}
        <button
          type="button"
          onClick={onCopyDaily}
          className="w-full py-1.5 px-3 bg-gradient-to-b from-[#f2f2f2] to-[#ebebeb] hover:from-[#e6f0fa] hover:to-[#cce4f7] active:from-[#cce4f7] active:to-[#b8d6f2] border border-[#707070] rounded-xs text-[12px] font-normal text-black cursor-pointer shadow-xs active:translate-y-px"
        >
          {isCopied ? '✓ Copied to Clipboard!' : 'Copy Daily'}
        </button>
      </div>
    </div>
  );
};

