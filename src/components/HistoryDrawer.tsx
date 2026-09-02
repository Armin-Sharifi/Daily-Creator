import React, { useState } from 'react';
import { X, Search, Trash2, Calendar, Copy, Check, ArrowRight, Clock } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onLoadItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onLoadItem,
  onDeleteItem,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.content.toLowerCase().includes(query) ||
      item.dateString.toLowerCase().includes(query)
    );
  });

  const handleCopy = (item: HistoryItem) => {
    navigator.clipboard.writeText(item.content);
    setCopiedId(item.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#F9F7F2] border-l border-[#E5E3DC] h-full flex flex-col shadow-editorial text-[#1A1A1A] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E5E3DC] flex items-center justify-between bg-[#F4F2ED]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#1A1A1A] bg-[#1A1A1A] text-[#F9F7F2] flex items-center justify-center font-serif italic text-sm">
              J
            </div>
            <div>
              <h3 className="serif-title italic text-2xl font-light leading-none">Task Journal Archive</h3>
              <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">
                {history.length} {history.length === 1 ? 'entry' : 'entries'} stored locally
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#D1CFCA] bg-white text-[#1A1A1A] hover:border-[#1A1A1A] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Actions */}
        <div className="p-4 border-b border-[#E5E3DC] space-y-2 bg-[#F9F7F2]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#1A1A1A] opacity-40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past logs..."
              className="w-full bg-white border border-[#E5E3DC] pl-9 pr-3.5 py-2 text-xs text-[#1A1A1A] placeholder:text-[#999999] input-focus font-sans"
            />
          </div>
          {history.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={onClearAll}
                className="text-[10px] uppercase tracking-widest font-bold text-[#b91c1c] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Clear archive
              </button>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16 opacity-50 space-y-2">
              <Clock className="w-8 h-8 mx-auto stroke-1" />
              <p className="serif-title italic text-base">No archive entries found.</p>
              <p className="text-[10px] uppercase tracking-widest">
                Generating notes automatically logs them here.
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E5E3DC] p-4 space-y-3 shadow-editorial-sm hover:border-[#1A1A1A] transition"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#F4F2ED]">
                  <span className="serif-title italic text-base text-[#1A1A1A]">
                    {item.dateString}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest opacity-40 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-xs text-[#2A2A2A] font-mono line-clamp-3 whitespace-pre-line bg-[#F9F7F2] p-2.5 border border-[#E5E3DC]">
                  {item.content}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[9px] uppercase tracking-widest opacity-50 font-bold">
                    {item.tasksCount} {item.tasksCount === 1 ? 'task' : 'tasks'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(item)}
                      className="flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-[#F9F7F2] border border-[#D1CFCA] hover:border-[#1A1A1A] transition cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        onLoadItem(item);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-[#1A1A1A] hover:bg-[#333] text-[#F9F7F2] transition cursor-pointer"
                    >
                      <span>Load</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1 opacity-40 hover:opacity-100 hover:text-[#b91c1c] transition cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
