import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl / ⌘', 'Enter'], description: 'Format & Generate Daily text' },
    { keys: ['Ctrl / ⌘', 'Shift', 'C'], description: 'Copy output to clipboard' },
    { keys: ['Escape'], description: 'Close active drawer / modal' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-[#F9F7F2] border border-[#E5E3DC] p-6 shadow-editorial text-[#1A1A1A]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DC]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 border border-[#1A1A1A] bg-[#1A1A1A] text-[#F9F7F2] flex items-center justify-center font-serif text-sm italic">
              K
            </div>
            <div>
              <h3 className="serif-title italic text-xl font-light leading-none">Keyboard Commands</h3>
              <p className="text-[9px] uppercase tracking-widest opacity-50 mt-1">Accelerators</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-[#D1CFCA] bg-white text-[#1A1A1A] hover:border-[#1A1A1A] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 space-y-2.5">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-white border border-[#E5E3DC] text-xs"
            >
              <span className="text-[#2A2A2A] font-medium">{s.description}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="px-2 py-0.5 bg-[#F9F7F2] text-[#1A1A1A] border border-[#D1CFCA] font-mono text-[10px] font-bold"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-[#1A1A1A] text-[#F9F7F2] py-3 uppercase text-[10px] tracking-[0.2em] font-bold hover:bg-[#333] transition cursor-pointer active:scale-98"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
