import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={handleInstallClick}
        disabled={isInstalling}
        className="flex items-center gap-1.5 border border-[#1A1A1A] bg-[#1A1A1A] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.15em] font-bold text-[#F9F7F2] hover:bg-[#333333] active:scale-95 transition-all cursor-pointer"
        title="Install app to your device"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{isInstalling ? 'Installing...' : 'Install PWA'}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          id="pwa-ios-install-btn"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 border border-[#D1CFCA] bg-white px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A] hover:border-[#1A1A1A] active:scale-95 transition cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#1A1A1A]" />
          <span>Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm bg-[#F9F7F2] border border-[#E5E3DC] p-6 shadow-editorial text-[#1A1A1A]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DC]">
                <div>
                  <h3 className="text-xl serif-title italic font-light">Install on iOS</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-60 mt-0.5">Safari Home Screen App</p>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-[#1A1A1A] opacity-60 hover:opacity-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-3.5 text-xs">
                <div className="flex items-start gap-3 p-3 bg-white border border-[#E5E3DC]">
                  <div className="flex items-center justify-center w-5 h-5 bg-[#1A1A1A] text-[#F9F7F2] text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-[#2A2A2A] leading-relaxed">
                    Tap the <strong className="font-semibold inline-flex items-center gap-1">Share <Share className="w-3 h-3 inline" /></strong> button in Safari's bottom toolbar.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white border border-[#E5E3DC]">
                  <div className="flex items-center justify-center w-5 h-5 bg-[#1A1A1A] text-[#F9F7F2] text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-[#2A2A2A] leading-relaxed">
                    Scroll down and tap <strong className="font-semibold">Add to Home Screen</strong>.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full bg-[#1A1A1A] text-[#F9F7F2] py-3 uppercase text-[11px] tracking-[0.2em] font-bold hover:bg-[#333] transition active:scale-98"
              >
                Understood
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
