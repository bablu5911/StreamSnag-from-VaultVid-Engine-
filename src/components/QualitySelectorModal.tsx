import React, { useState } from 'react';
import type { VideoInfo, QualityOption } from '../types';
import { Download, Check, Sparkles, X, FileVideo, Music, Film } from 'lucide-react';

interface QualitySelectorModalProps {
  video: VideoInfo;
  onClose: () => void;
  onConfirmDownload: (quality: QualityOption) => void;
  isDownloading: boolean;
  downloadProgress: number;
}

export const QualitySelectorModal: React.FC<QualitySelectorModalProps> = ({
  video,
  onClose,
  onConfirmDownload,
  isDownloading,
  downloadProgress,
}) => {
  const [selectedQuality, setSelectedQuality] = useState<QualityOption>(
    video.availableQualities[0] || video.availableQualities[1]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-[640px] bg-white text-black p-6 sm:p-8 rounded-3xl shadow-2xl border border-black/10 flex flex-col items-center relative overflow-hidden">
        {/* Close Button */}
        {!isDownloading && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#C80A0A]/10 flex items-center justify-center text-[#C80A0A]">
            <Download className="w-5 h-5" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold uppercase tracking-widest text-black">
            Select Acquisition Quality
          </h3>
        </div>

        <p className="text-xs text-gray-500 text-center max-w-[420px] mb-6 font-medium">
          Choose your desired resolution or audio stream format for{' '}
          <span className="text-black font-semibold line-clamp-1">"{video.title}"</span>
        </p>

        {/* Quality Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6 max-h-[300px] overflow-y-auto pr-1">
          {video.availableQualities.map((quality) => {
            const isSelected = selectedQuality.id === quality.id;
            const isAudio = quality.isAudioOnly;

            return (
              <button
                key={quality.id}
                type="button"
                onClick={() => !isDownloading && setSelectedQuality(quality)}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all relative ${
                  isSelected
                    ? 'border-[#C80A0A] bg-[#C80A0A]/5 ring-2 ring-[#C80A0A]/20 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-[#C80A0A] text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isAudio ? <Music className="w-4 h-4" /> : quality.id === '4k' ? <Sparkles className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-bold text-gray-900 truncate">
                      {quality.label}
                    </span>
                    <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded">
                      {quality.format}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-1">
                    <span>{quality.filesize}</span>
                    <span>•</span>
                    <span className="text-gray-400 font-mono text-[11px] truncate">
                      {quality.codec}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-3 right-3 text-[#C80A0A]">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Download State Progress Bar or Action CTA */}
        {isDownloading ? (
          <div className="w-full flex flex-col items-center gap-3 bg-gray-50 p-5 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between w-full text-xs font-bold text-gray-700 uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <FileVideo className="w-4 h-4 text-[#C80A0A] animate-bounce" />
                Downloading Stream ({selectedQuality.label})...
              </span>
              <span className="font-mono text-[#C80A0A]">{downloadProgress}%</span>
            </div>

            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-[#C80A0A] h-full transition-all duration-200 ease-out"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>

            <span className="text-[11px] text-gray-500 font-mono">
              Bypassing headers & assembling media payload...
            </span>
          </div>
        ) : (
          <button
            onClick={() => onConfirmDownload(selectedQuality)}
            className="mt-2 bg-[#C80A0A] text-white font-bold text-[14px] px-10 py-4 rounded-2xl uppercase tracking-wider hover:bg-red-700 active:scale-95 transition-all shadow-xl w-full flex items-center justify-center gap-2 group"
          >
            <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            <span>Start Download ({selectedQuality.filesize})</span>
          </button>
        )}
      </div>
    </div>
  );
};
