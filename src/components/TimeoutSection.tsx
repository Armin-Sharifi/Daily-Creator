import React, { useState } from 'react';
import {
  Timer,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Zap,
  Coffee,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { TimeOutItem } from '../types';
import { calculateDuration } from '../utils/dailyLogic';

interface TimeoutSectionProps {
  timeouts: TimeOutItem[];
  timeoutEmoji: string;
  onTimeoutsChange: (timeouts: TimeOutItem[]) => void;
  onEmojiChange: (emoji: string) => void;
}

const POPULAR_EMOJIS = ['⚡', '⏸️', '☕', '🛑', '⏳', '🔌', '⚠️', '🛠️'];

const PRESETS = [
  { title: 'PowerOutage', start: '13:00', end: '15:00', emoji: '⚡' },
  { title: 'LunchBreak', start: '12:00', end: '13:00', emoji: '☕' },
  { title: 'DoctorAppointment', start: '15:30', end: '16:30', emoji: '⏸️' },
  { title: 'NetworkIssue', start: '10:00', end: '10:45', emoji: '🔌' },
];

export const TimeoutSection: React.FC<TimeoutSectionProps> = ({
  timeouts,
  timeoutEmoji,
  onTimeoutsChange,
  onEmojiChange,
}) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('13:00');
  const [endTime, setEndTime] = useState('15:00');
  const [customDuration, setCustomDuration] = useState('');
  const [isCustomEmojiOpen, setIsCustomEmojiOpen] = useState(false);

  // Live auto-calculated duration
  const autoDuration = calculateDuration(startTime, endTime);
  const activeDuration = customDuration.trim() || autoDuration;

  const handleAddTimeout = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    const newItem: TimeOutItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: cleanTitle,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      duration: activeDuration,
    };

    onTimeoutsChange([...timeouts, newItem]);
    // Reset title and custom duration for next entry
    setTitle('');
    setCustomDuration('');
  };

  const handleRemoveTimeout = (id: string) => {
    onTimeoutsChange(timeouts.filter((t) => t.id !== id));
  };

  const handleClearAll = () => {
    onTimeoutsChange([]);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setTitle(preset.title);
    setStartTime(preset.start);
    setEndTime(preset.end);
    setCustomDuration('');
    if (preset.emoji) {
      onEmojiChange(preset.emoji);
    }
  };

  return (
    <div
      id="timeout-section"
      className="bg-[#F4F2ED] border border-[#E5E3DC] p-5 sm:p-6 shadow-editorial-sm space-y-5 text-[#1A1A1A]"
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5E3DC]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-6 h-6 border border-[#1A1A1A] bg-[#1A1A1A] text-[#F9F7F2]">
            <Timer className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold opacity-60">
                TimeOuts Section
              </h2>
              <span className="text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.2 bg-[#1A1A1A] text-[#F9F7F2]">
                v1.1
              </span>
            </div>
          </div>
        </div>

        {/* Preferred Emoji Selector */}
        <div className="flex items-center gap-1.5 bg-white border border-[#D1CFCA] px-2 py-1">
          <span className="text-[10px] uppercase tracking-wider font-bold opacity-50 mr-1">
            Emoji:
          </span>
          <div className="flex items-center gap-1">
            {POPULAR_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onEmojiChange(emoji)}
                className={`w-6 h-6 flex items-center justify-center text-xs transition cursor-pointer ${
                  timeoutEmoji === emoji
                    ? 'bg-[#1A1A1A] text-[#F9F7F2] scale-105'
                    : 'hover:bg-[#E5E3DC]'
                }`}
                title={`Use ${emoji} for TimeOuts header`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsCustomEmojiOpen(!isCustomEmojiOpen)}
            className="text-[10px] uppercase tracking-wider font-bold underline ml-1 cursor-pointer opacity-70 hover:opacity-100"
            title="Type custom emoji"
          >
            {isCustomEmojiOpen ? 'Done' : 'Custom'}
          </button>
        </div>
      </div>

      {/* Custom Emoji Input drawer */}
      {isCustomEmojiOpen && (
        <div className="p-3 bg-white border border-[#E5E3DC] flex items-center gap-3 animate-in fade-in">
          <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">
            Custom Header Emoji:
          </span>
          <input
            type="text"
            value={timeoutEmoji}
            onChange={(e) => onEmojiChange(e.target.value)}
            maxLength={4}
            className="w-16 text-center bg-[#F9F7F2] border border-[#D1CFCA] py-1 text-base input-focus"
            placeholder="⚡"
          />
          <span className="text-[10px] opacity-50 italic">
            Appears as: {timeoutEmoji || '⚡'}TimeOuts:
          </span>
        </div>
      )}

      {/* Quick Presets */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase tracking-wider font-bold opacity-50 block">
          Quick Presets:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-[#F9F7F2] border border-[#D1CFCA] hover:border-[#1A1A1A] transition active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <span>{p.emoji}</span>
              <span>+{p.title}</span>
              <span className="opacity-60 text-[9px]">({p.start}-{p.end})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Timeout Form */}
      <form onSubmit={handleAddTimeout} className="bg-white border border-[#E5E3DC] p-4 space-y-3.5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Title Input */}
          <div className="sm:col-span-6 space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold opacity-60 block">
              Title / Reason <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. PowerOutage, LunchBreak"
              className="w-full bg-[#F9F7F2] border border-[#E5E3DC] px-3 py-2 text-sm text-[#1A1A1A] input-focus font-sans"
            />
          </div>

          {/* Start Time */}
          <div className="sm:col-span-3 space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold opacity-60 block">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-[#F9F7F2] border border-[#E5E3DC] px-2.5 py-2 text-xs font-mono text-[#1A1A1A] input-focus"
            />
          </div>

          {/* End Time */}
          <div className="sm:col-span-3 space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold opacity-60 block">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-[#F9F7F2] border border-[#E5E3DC] px-2.5 py-2 text-xs font-mono text-[#1A1A1A] input-focus"
            />
          </div>
        </div>

        {/* Duration preview and action row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F4F2ED]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-bold opacity-50">
              Duration:
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#F4F2ED] border border-[#D1CFCA]">
              {activeDuration || '0 mins'}
            </span>
            <input
              type="text"
              value={customDuration}
              onChange={(e) => setCustomDuration(e.target.value)}
              placeholder="Override duration..."
              className="text-[11px] bg-[#F9F7F2] border border-[#E5E3DC] px-2 py-0.5 w-36 input-focus"
              title="Leave empty to use auto-computed duration"
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className={`px-4 py-2 uppercase text-[11px] tracking-widest font-bold flex items-center gap-1.5 transition ${
              title.trim()
                ? 'bg-[#1A1A1A] text-[#F9F7F2] hover:bg-[#333] cursor-pointer active:scale-95'
                : 'opacity-40 bg-[#E5E3DC] text-[#1A1A1A] cursor-not-allowed'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Timeout</span>
          </button>
        </div>
      </form>

      {/* List of active Timeouts */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider font-bold opacity-60">
            Active TimeOuts ({timeouts.length})
          </span>
          {timeouts.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[10px] uppercase tracking-wider font-bold text-[#b91c1c] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {timeouts.length === 0 ? (
          <div className="bg-white border border-dashed border-[#D1CFCA] p-4 text-center">
            <p className="text-xs opacity-50 italic">
              No timeouts added yet. Add an outage or break above to include in the daily format.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {timeouts.map((item, index) => {
              const dur =
                item.duration || calculateDuration(item.startTime, item.endTime);
              return (
                <div
                  key={item.id || index}
                  className="bg-white border border-[#E5E3DC] p-3 flex items-center justify-between gap-3 shadow-xs hover:border-[#1A1A1A] transition"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm shrink-0">{timeoutEmoji}</span>
                    <div className="truncate">
                      <span className="font-semibold text-xs text-[#1A1A1A]">
                        {item.title}
                      </span>
                      <span className="text-xs font-mono text-[#555] ml-2">
                        {item.startTime && item.endTime
                          ? `${item.startTime} - ${item.endTime}`
                          : item.startTime || ''}
                      </span>
                    </div>
                    {dur && (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#F9F7F2] border border-[#D1CFCA] text-[#1A1A1A] shrink-0">
                        {dur}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveTimeout(item.id)}
                    className="p-1.5 text-[#1A1A1A] opacity-40 hover:opacity-100 hover:text-[#b91c1c] transition cursor-pointer shrink-0"
                    title="Remove timeout"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Output Format Preview snippet */}
      {timeouts.length > 0 && (
        <div className="pt-2 border-t border-[#E5E3DC]">
          <p className="text-[9px] uppercase tracking-widest opacity-50 font-bold mb-1">
            Preview of TimeOuts in Daily Output:
          </p>
          <div className="bg-[#FAF9F5] border border-[#E5E3DC] p-2.5 font-mono text-xs text-[#2A2A2A] space-y-0.5">
            <p className="font-bold">{timeoutEmoji}TimeOuts:</p>
            {timeouts.map((t, idx) => {
              const dur = t.duration || calculateDuration(t.startTime, t.endTime);
              const durPart = dur ? ` (${dur})` : '';
              const timePart =
                t.startTime && t.endTime
                  ? ` : ${t.startTime} - ${t.endTime}`
                  : t.startTime
                  ? ` : ${t.startTime}`
                  : '';
              return (
                <p key={idx} className="opacity-90">
                  &nbsp;-{t.title}{timePart}{durPart}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
