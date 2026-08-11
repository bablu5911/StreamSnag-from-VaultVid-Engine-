import React from 'react';
import { History, ShieldCheck, Ban } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  historyCount,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4 backdrop-blur-md bg-[#C80A0A]/85 border-b border-white/10 shadow-lg transition-all">
      {/* Brand Title */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <svg width="34" height="34" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow">
          <path fillRule="evenodd" clipRule="evenodd" d="M60 120C26.8629 120 0 93.1371 0 60V0C22.5654 0 42.2213 12.4569 52.4662 30.8691C38.4788 34.2089 28.0787 46.7902 28.0787 61.8006V63.1443C28.0787 79.9648 41.7146 93.6006 58.5353 93.6006H59.8789L59.8785 61.8006C59.8785 79.3633 74.1159 93.6006 91.6787 93.6006L91.6787 61.8006C91.6787 44.2783 77.5071 30.0661 60 30.0008L60 0H62.5352C94.2722 0 120 25.7279 120 57.4648V60C120 93.1371 93.1371 120 60 120Z" fill="white"/>
        </svg>
        <div className="flex flex-col">
          <span className="font-italiana text-2xl sm:text-3xl uppercase tracking-widest text-white font-bold leading-none">
            StreamSnag
          </span>
          <span className="text-[10px] text-white/70 uppercase tracking-widest font-mono">
            VaultVid Engine
          </span>
        </div>
      </div>

      {/* Action Badges & Library Access */}
      <div className="flex items-center gap-2 sm:gap-4 text-white/90 font-medium">
        {/* 100% Free & Unlimited Badge */}
        <div className="flex items-center gap-1.5 bg-emerald-950/60 text-emerald-300 px-3 sm:px-4 py-1.5 rounded-full border border-emerald-500/30 text-xs font-semibold backdrop-blur-sm shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="hidden xs:inline">100% Free & Unlimited</span>
          <span className="xs:hidden">Free</span>
        </div>

        {/* Zero Ads Badge */}
        <div className="hidden md:flex items-center gap-1.5 bg-black/25 text-white/90 px-3 py-1.5 rounded-full border border-white/15 text-xs font-medium backdrop-blur-sm">
          <Ban className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>Zero Ads & Popups</span>
        </div>

        {/* History / Library Toggle Button */}
        <button
          onClick={onOpenHistory}
          className="relative flex items-center gap-1.5 bg-white text-[#C80A0A] hover:bg-neutral-100 text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
          title="View Recent Downloads"
        >
          <History className="w-4 h-4" />
          <span>Library</span>
          {historyCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#C80A0A] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow">
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
