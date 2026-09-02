import React, { useState } from 'react';
import { ListTodo, Trash2, ClipboardPaste, Sparkles, Clock, ChevronDown, ChevronUp, Plus, ArrowDownAZ } from 'lucide-react';

interface TaskEditorProps {
  tasksRaw: string;
  onChange: (val: string) => void;
  startTime: string;
  endTime: string;
  onStartTimeChange: (val: string) => void;
  onEndTimeChange: (val: string) => void;
  onCreateDaily: () => void;
}

export const TaskEditor: React.FC<TaskEditorProps> = ({
  tasksRaw,
  onChange,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  onCreateDaily,
}) => {
  const [showTimeOptions, setShowTimeOptions] = useState(false);

  // Compute non-empty tasks count
  const taskLines = tasksRaw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const taskCount = taskLines.length;

  const handleInsertSample = () => {
    const sample = [
      'Refactor API client to handle offline caching',
      'Review Pull Request #42 for PWA manifest configuration',
      'Optimize database queries for team daily standup summary',
      'Sync with design team on dark mode tokens',
    ].join('\n');
    onChange(sample);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(tasksRaw ? `${tasksRaw}\n${text}` : text);
      }
    } catch {
      // Clipboard access denied or unsupported
    }
  };

  const handleSortAlphabetically = () => {
    if (!tasksRaw.trim()) return;
    const sorted = tasksRaw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .join('\n');
    onChange(sorted);
  };

  const handleCleanFormatting = () => {
    if (!tasksRaw.trim()) return;
    const cleaned = tasksRaw
      .split(/\r?\n/)
      .map((l) => l.trim().replace(/^[-*•\d.)]\s*/, ''))
      .filter(Boolean)
      .join('\n');
    onChange(cleaned);
  };

  // Keyboard shortcut inside textarea: Ctrl+Enter or Cmd+Enter to trigger Create Daily
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onCreateDaily();
    }
  };

  return (
    <div className="bg-[#F4F2ED] border border-[#E5E3DC] p-5 sm:p-6 shadow-editorial-sm space-y-4 text-[#1A1A1A]">
      {/* Header & Quick Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E3DC]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-6 h-6 border border-[#1A1A1A] bg-[#1A1A1A] text-[#F9F7F2]">
            <ListTodo className="w-3.5 h-3.5" />
          </div>
          <div>
            <label htmlFor="tasks-input" className="text-[11px] uppercase tracking-[0.25em] font-bold opacity-60 cursor-pointer">
              Task Titles (One per line)
            </label>
          </div>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 border border-[#D1CFCA] bg-white">
            {taskCount} {taskCount === 1 ? 'ITEM' : 'ITEMS'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handleInsertSample}
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-[#F9F7F2] border border-[#D1CFCA] hover:border-[#1A1A1A] transition text-[10px] uppercase tracking-wider font-bold cursor-pointer"
            title="Load sample daily standup items"
          >
            <Sparkles className="w-3 h-3" />
            <span>Sample</span>
          </button>

          <button
            type="button"
            onClick={handlePaste}
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-[#F9F7F2] border border-[#D1CFCA] hover:border-[#1A1A1A] transition text-[10px] uppercase tracking-wider font-bold cursor-pointer"
            title="Paste from clipboard"
          >
            <ClipboardPaste className="w-3 h-3" />
            <span>Paste</span>
          </button>

          {taskCount > 1 && (
            <button
              type="button"
              onClick={handleSortAlphabetically}
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-[#F9F7F2] border border-[#D1CFCA] hover:border-[#1A1A1A] transition text-[10px] uppercase tracking-wider font-bold cursor-pointer"
              title="Sort tasks A-Z"
            >
              <ArrowDownAZ className="w-3 h-3" />
              <span>Sort</span>
            </button>
          )}

          {tasksRaw.length > 0 && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#b91c1c] text-[#b91c1c] hover:text-white border border-[#fca5a5] hover:border-[#b91c1c] transition text-[10px] uppercase tracking-wider font-bold cursor-pointer"
              title="Clear all tasks"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Multiline Input Textarea */}
      <div className="relative">
        <textarea
          id="tasks-input"
          value={tasksRaw}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter tasks (one per line)...&#10;e.g.&#10;Morning stand-up meeting&#10;Draft project proposal&#10;Review team feedback&#10;Update documentation"
          rows={7}
          className="w-full bg-white border border-[#E5E3DC] p-4 text-sm leading-relaxed resize-y shadow-xs input-focus text-[#1A1A1A] placeholder:text-[#999999] min-h-[160px] font-sans"
        />
        <div className="absolute bottom-3 right-3 pointer-events-none text-[9px] uppercase tracking-widest font-bold opacity-40 font-mono">
          Ctrl+Enter to format
        </div>
      </div>

      {/* Optional Time Customizer Accordion */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowTimeOptions(!showTimeOptions)}
          className="flex items-center justify-between w-full text-xs text-[#1A1A1A] opacity-70 hover:opacity-100 transition py-1 cursor-pointer"
        >
          <span className="flex items-center gap-2 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px] uppercase tracking-wider font-bold">Time Range (Optional)</span>
            <span className="text-[9px] font-mono px-2 py-0.5 bg-white border border-[#D1CFCA]">
              {startTime === '-' && endTime === '-' ? 'Default: -' : `${startTime} → ${endTime}`}
            </span>
          </span>
          {showTimeOptions ? (
            <ChevronUp className="w-3.5 h-3.5 opacity-60" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          )}
        </button>

        {showTimeOptions && (
          <div className="mt-2.5 p-4 bg-white border border-[#E5E3DC] grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-in fade-in duration-150">
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold opacity-60 block mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                placeholder="-"
                className="w-full bg-[#F9F7F2] border border-[#E5E3DC] px-3 py-2 text-xs text-[#1A1A1A] input-focus font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold opacity-60 block mb-1">
                End Time
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => onEndTimeChange(e.target.value)}
                placeholder="-"
                className="w-full bg-[#F9F7F2] border border-[#E5E3DC] px-3 py-2 text-xs text-[#1A1A1A] input-focus font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
