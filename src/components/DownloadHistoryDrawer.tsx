import React from 'react';
import type { DownloadHistoryItem } from '../types';
import { X, Trash2, Download, Film, Clock } from 'lucide-react';

interface DownloadHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: DownloadHistoryItem[];
  onClear: () => void;
  onRedownload: (item: DownloadHistoryItem) => void;
}

export const DownloadHistoryDrawer: React.FC<DownloadHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClear,
  onRedownload,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[420px] bg-neutral-900 text-white h-full p-6 flex flex-col justify-between border-l border-white/10 shadow-2xl overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-[#C80A0A]" />
              <h3 className="text-lg font-bold uppercase tracking-wider">Acquisition History</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* History List */}
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 text-white/50 gap-3">
              <Download className="w-10 h-10 stroke-[1.5] text-white/30" />
              <p className="text-sm font-medium">No video acquisitions logged yet.</p>
              <span className="text-xs text-white/40 max-w-[220px]">
                Your recent downloads will appear here for fast re-access.
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 p-3.5 rounded-xl border border-white/10 flex items-start justify-between gap-3 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <img
                      src={item.thumbnail}
                      alt={item.videoTitle}
                      className="w-16 h-12 rounded-lg object-cover bg-white/5 shrink-0 border border-white/10"
                    />
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-xs font-semibold text-white/90 line-clamp-1 group-hover:text-white">
                        {item.videoTitle}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-white/60 mt-1">
                        <span className="bg-[#C80A0A]/80 text-white font-bold px-1.5 py-0.2 rounded uppercase">
                          {item.qualityLabel}
                        </span>
                        <span>{item.filesize}</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/40 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRedownload(item)}
                    className="p-2 bg-white/10 hover:bg-white text-white/80 hover:text-[#FF0000] rounded-lg transition-all shrink-0 active:scale-95"
                    title="Download File Again"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Clear Button */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-white/10 mt-6">
            <button
              onClick={onClear}
              className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/30 py-2.5 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History Log</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
