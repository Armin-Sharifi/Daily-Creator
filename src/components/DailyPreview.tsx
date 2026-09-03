import React, { useState } from 'react';
import { Copy, Check, Share2, Download, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyPreviewProps {
  dailyText: string;
  onCreateDaily: () => void;
  onCopyDaily: () => void;
  isCopied: boolean;
  tasksCount: number;
  timeoutsCount?: number;
}

export const DailyPreview: React.FC<DailyPreviewProps> = ({
  dailyText,
  onCreateDaily,
  onCopyDaily,
  isCopied,
  tasksCount,
  timeoutsCount = 0,
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const handleCopy = () => {
    if (!dailyText) return;
    onCopyDaily();
    setCopiedFormat('text');

    // Confetti effect on successful copy
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#10b981'],
      });
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      setCopiedFormat(null);
    }, 2000);
  };

  const handleShare = async () => {
    if (!dailyText) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Tasks & Standup',
          text: dailyText,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const handleDownloadTxt = () => {
    if (!dailyText) return;
    const blob = new Blob([dailyText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily-standup-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const characterCount = dailyText.length;
  const wordCount = dailyText.trim() ? dailyText.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-4">
      {/* Primary Action Button: "Generate Format / Create Daily" */}
      <button
        id="btnCreateText"
        type="button"
        onClick={onCreateDaily}
        className="w-full bg-[#1A1A1A] text-[#F9F7F2] py-4 uppercase text-[12px] tracking-[0.3em] font-bold hover:bg-[#333333] active:scale-[0.98] transition-all cursor-pointer shadow-editorial-sm flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        <span>Generate Format</span>
      </button>

      {/* Editorial Output Container */}
      <div className="paper-texture border border-[#E5E3DC] p-6 sm:p-8 shadow-editorial flex flex-col text-[#1A1A1A]">
        {/* Output Header */}
        <div className="mb-6 pb-4 border-b border-[#E5E3DC] flex items-start justify-between gap-4">
          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40 block mb-1">
              Formatted Output
            </span>
            <h2 className="serif-title text-2xl sm:text-3xl font-light leading-tight text-[#1A1A1A]">
              Daily Note
            </h2>
            <p className="text-xs opacity-50 font-mono italic tracking-tight mt-1">
              Template: Standard_Daily_Log
              {tasksCount > 0 && ` · ${tasksCount} ${tasksCount === 1 ? 'task' : 'tasks'}`}
              {timeoutsCount > 0 && ` · ${timeoutsCount} ${timeoutsCount === 1 ? 'timeout' : 'timeouts'}`}
            </p>
          </div>

          {dailyText && (
            <div className="text-right">
              <span className="text-[10px] font-mono opacity-50 block">
                {characterCount} chars
              </span>
              <span className="text-[10px] font-mono opacity-50 block">
                {wordCount} words
              </span>
            </div>
          )}
        </div>

        {/* Formatted Output Area */}
        <div className="relative">
          <textarea
            id="daily-output"
            readOnly
            value={dailyText}
            placeholder="Formatted daily standup log will appear here after clicking 'Generate Format'..."
            rows={8}
            className="w-full bg-transparent border-0 p-0 text-[13px] font-mono leading-relaxed text-[#2A2A2A] placeholder:text-[#999999] focus:outline-none resize-y min-h-[170px]"
          />
        </div>

        {/* Action Bar */}
        <div className="mt-6 flex items-center gap-3 border-t border-dashed border-[#D1CFCA] pt-5">
          {/* Copy Button */}
          <button
            id="btnCopy"
            type="button"
            onClick={handleCopy}
            disabled={!dailyText}
            className={`flex-1 border border-[#1A1A1A] py-3.5 px-4 uppercase text-[11px] tracking-widest font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              isCopied || copiedFormat
                ? 'bg-[#1A1A1A] text-[#F9F7F2]'
                : dailyText
                ? 'bg-transparent hover:bg-[#1A1A1A] hover:text-[#F9F7F2] text-[#1A1A1A] active:scale-[0.98]'
                : 'opacity-30 border-[#D1CFCA] text-[#1A1A1A] cursor-not-allowed'
            }`}
          >
            {isCopied || copiedFormat ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>

          {/* Quick Download / Share */}
          {dailyText && (
            <>
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={handleShare}
                  className="px-4 border border-[#1A1A1A] py-3.5 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-[#F9F7F2] transition-colors cursor-pointer text-[#1A1A1A]"
                  title="Share to Slack, Teams, WhatsApp, etc."
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="px-4 border border-[#1A1A1A] py-3.5 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-[#F9F7F2] transition-colors cursor-pointer text-[#1A1A1A]"
                title="Download as .txt"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
