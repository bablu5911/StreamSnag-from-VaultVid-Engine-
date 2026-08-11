import React, { useState } from 'react';
import type { VideoInfo } from '../types';
import { Play, Pause, Download, Volume2, VolumeX, Maximize2, ShieldCheck, Sparkles, Clock, Eye, Sliders } from 'lucide-react';

interface VideoResultPanelProps {
  video: VideoInfo;
  onDirectDownload: () => void;
  onOpenQualityModal: () => void;
}

export const VideoResultPanel: React.FC<VideoResultPanelProps> = ({
  video,
  onDirectDownload,
  onOpenQualityModal,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const topQuality = video.availableQualities[0]?.label || 'Best Available HD';

  return (
    <div className="w-full flex flex-col items-center gap-6 mt-4 animate-fade-in">
      {/* Video Preview and Acquisition Panel */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-black/40 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/20 shadow-2xl w-full max-w-[900px]">
        {/* Interactive Video Preview Box */}
        <div className="w-full md:w-[360px] aspect-video rounded-xl overflow-hidden bg-black relative group shadow-lg border border-white/10 shrink-0">
          <video
            ref={videoRef}
            src={video.sampleVideoUrl}
            poster={video.thumbnail}
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Video Player Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-100 md:opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5">
            {/* Top Badges */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-[#C80A0A] text-white px-2 py-0.5 rounded shadow">
                {video.platform}
              </span>
              <span className="text-[10px] font-mono bg-black/60 text-white/90 px-2 py-0.5 rounded flex items-center gap-1 border border-white/10">
                <Clock className="w-3 h-3 text-amber-300" />
                {video.duration}
              </span>
            </div>

            {/* Middle Play Button */}
            <div className="flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition-all transform hover:scale-110 active:scale-95 shadow-xl border border-white/30"
                title={isPlaying ? 'Pause Preview' : 'Play Preview'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>
            </div>

            {/* Bottom Quick Controls */}
            <div className="flex items-center justify-between text-xs text-white/80">
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="hover:text-white transition-colors" title={isMuted ? 'Unmute' : 'Mute'}>
                  {isMuted ? <VolumeX className="w-4 h-4 text-white/70" /> : <Volume2 className="w-4 h-4 text-white" />}
                </button>
                <span className="text-[11px] font-mono text-white/70">PREVIEW</span>
              </div>
              <button onClick={handleFullscreen} className="hover:text-white transition-colors" title="Fullscreen">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Info & Acquisition Trigger */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 flex-1 w-full">
          <div className="flex items-center gap-2">
            <span className="font-marck text-3xl sm:text-4xl text-white">StreamSnag</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Direct Download Ready
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-base sm:text-lg font-bold text-white line-clamp-2 leading-snug">
              {video.title}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-white/75 font-medium mt-0.5">
              <span className="text-white/90 font-semibold">{video.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-white/60" />
                {video.viewCount}
              </span>
              <span>•</span>
              <span className="text-amber-300 font-semibold">{topQuality}</span>
            </div>
          </div>

          <p className="text-xs text-white/80 max-w-[340px] leading-relaxed font-light">
            Click below to instantly download the best available video quality directly to your Downloads folder.
          </p>

          {/* Main 1-Click Direct Download Action Button */}
          <div className="flex flex-col items-center md:items-start gap-2.5 w-full sm:w-auto">
            <button
              onClick={onDirectDownload}
              className="w-full sm:w-auto bg-white text-[#C80A0A] font-bold text-[14px] px-8 py-3.5 rounded-xl uppercase tracking-wider hover:bg-neutral-100 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              <span>Direct Download Best Quality</span>
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            </button>

            <button
              onClick={onOpenQualityModal}
              className="text-xs text-white/70 hover:text-white underline font-medium transition-colors flex items-center gap-1.5 mt-1 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>More Formats (MP3 Audio / Custom Qualities)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
