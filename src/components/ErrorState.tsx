import React from 'react';
import { AlertTriangle, RefreshCw, HelpCircle } from 'lucide-react';

interface ErrorStateProps {
  onRetry: () => void;
  onUseSample: (url: string) => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ onRetry, onUseSample }) => {
  return (
    <div className="w-full max-w-[550px] bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center my-4 animate-fade-in shadow-2xl">
      <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-3 border border-white/20">
        <AlertTriangle className="w-8 h-8 text-amber-300" />
      </div>

      <div className="bg-white/15 border border-white/20 px-4 py-1.5 rounded-lg text-white font-bold text-sm tracking-wider uppercase mb-2">
        Error: WRONG URL / LINK UNREADABLE
      </div>

      <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-[420px] mb-6 font-light">
        We could not extract a public video stream from this link. Please make sure the URL is public, un-restricted, and formatted correctly.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto bg-white text-[#C80A0A] font-bold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider hover:bg-neutral-100 active:scale-95 transition-all shadow flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Another Link</span>
        </button>

        <button
          onClick={() => onUseSample('https://youtube.com/watch?v=dQw4w9WgXcQ')}
          className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-5 py-2.5 rounded-xl border border-white/20 uppercase tracking-wider transition-all flex items-center justify-center gap-2"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Load Test Sample</span>
        </button>
      </div>
    </div>
  );
};
