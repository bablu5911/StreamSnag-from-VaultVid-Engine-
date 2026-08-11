import React, { useEffect, useState } from 'react';
import { Loader2, ShieldCheck, Cpu, Radio } from 'lucide-react';

const STEPS = [
  'Connecting to Universal Stream Manifest...',
  'Bypassing DRM & Geo-restrictions...',
  'Extracting Available Resolutions (4K, 1080p, MP3)...',
  'Finalizing Stream Acquisition Node...',
];

export const VerificationState: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStepIndex(1), 350);
    const timer2 = setTimeout(() => setStepIndex(2), 750);
    const timer3 = setTimeout(() => setStepIndex(3), 1150);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="w-full max-w-[650px] bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 text-center my-4 animate-fade-in shadow-2xl">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
        <Loader2 className="w-12 h-12 text-white animate-spin relative z-10" />
      </div>

      <div className="flex flex-col items-center gap-1.5 mt-2">
        <div className="flex items-center gap-2 text-white/90 text-sm font-semibold uppercase tracking-wider">
          <Radio className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Analyzing Video Manifest</span>
        </div>
        <p className="text-xs font-mono text-white/70 tracking-wide h-6">
          {STEPS[stepIndex]}
        </p>
      </div>

      {/* Futuristic Progress Bar */}
      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden border border-white/10 mt-1">
        <div
          className="bg-gradient-to-r from-white via-amber-200 to-white h-full transition-all duration-300 ease-out"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between w-full text-[11px] text-white/50 font-mono mt-1">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Stream Protected
        </span>
        <span className="flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          VaultVid Engine v3.4
        </span>
      </div>
    </div>
  );
};
