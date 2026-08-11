import React, { useState } from 'react';
import { Search, Clipboard, X, CheckCircle2, ArrowRight, ShieldCheck, Ban, Sparkles } from 'lucide-react';

interface LinkInputProps {
  url: string;
  setUrl: (val: string) => void;
  onVerify: () => void;
  isVerifying: boolean;
  onSelectSample: (sampleUrl: string) => void;
}

const SUPPORTED_PLATFORMS = ['YouTube (4K)', 'TikTok Reel', 'Insta Reel', 'X / Twitter', 'Vimeo HD'];

export const LinkInput: React.FC<LinkInputProps> = ({
  url,
  setUrl,
  onVerify,
  isVerifying,
}) => {
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 2000);
      }
    } catch {
      // Ignore if clipboard permission denied
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isVerifying) {
      onVerify();
    }
  };

  return (
    <div className="w-full max-w-[760px] flex flex-col items-center">
      {/* Search Bar Input Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white/10 backdrop-blur-md border border-white/25 hover:border-white/40 focus-within:border-white rounded-2xl p-2.5 sm:p-3.5 mb-5 shadow-2xl transition-all relative group"
      >
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full flex items-center">
            <Search className="w-5 h-5 text-white/60 absolute left-4 pointer-events-none" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste video link here (YouTube, TikTok, X, Instagram...)"
              className="w-full bg-white/10 text-white placeholder-white/60 pl-12 pr-20 py-3.5 sm:py-4 rounded-xl border border-transparent focus:border-white focus:bg-white/15 focus:outline-none text-[14px] sm:text-[15px] font-medium transition-all"
            />
            {/* Action icons: Paste / Clear */}
            <div className="absolute right-3 flex items-center gap-1">
              {url ? (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Clear link"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePaste}
                  className="flex items-center gap-1 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-all"
                  title="Paste from clipboard"
                >
                  {copiedSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300 font-semibold">Pasted!</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-3.5 h-3.5" />
                      <span className="font-semibold">Paste</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Verify / Fetch Button */}
          <button
            type="submit"
            disabled={!url.trim() || isVerifying}
            className="w-full md:w-auto bg-white text-[#C80A0A] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-[14px] sm:text-[15px] px-7 py-3.5 sm:py-4 rounded-xl shrink-0 uppercase tracking-wider hover:bg-neutral-100 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{isVerifying ? 'Verifying...' : 'Verify Video'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </form>

      {/* Platform Supported Badges (Static Text Only - Not Clickable) */}
      <div className="flex flex-wrap justify-center items-center gap-2 text-white/80 text-[11px] sm:text-xs font-medium uppercase tracking-wider mb-3 select-none">
        <span className="text-white/60 text-[10px] uppercase font-mono tracking-widest mr-1">Supported Platforms:</span>
        {SUPPORTED_PLATFORMS.map((platformLabel) => (
          <span
            key={platformLabel}
            className="px-3 py-1 bg-white/10 rounded-full border border-white/15 text-white/90 cursor-default"
          >
            {platformLabel}
          </span>
        ))}
      </div>

      {/* Clean, Safe & Free Guarantee Notice */}
      <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-white/90 font-medium select-none">
        <span className="flex items-center gap-1.5 bg-emerald-950/50 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Free & Unlimited</span>
        </span>
        <span className="flex items-center gap-1.5 bg-black/25 text-white/90 px-3 py-1 rounded-full border border-white/15">
          <Ban className="w-3.5 h-3.5 text-amber-300" />
          <span>Zero Ads, Adult Content or Popups</span>
        </span>
        <span className="flex items-center gap-1.5 bg-black/25 text-white/90 px-3 py-1 rounded-full border border-white/15">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>Clean & Safe Experience</span>
        </span>
      </div>
    </div>
  );
};
