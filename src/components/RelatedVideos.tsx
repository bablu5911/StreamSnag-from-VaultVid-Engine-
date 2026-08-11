import React from 'react';
import type { RelatedVideo } from '../types';
import { Sparkles, Download, Eye, Clock } from 'lucide-react';

interface RelatedVideosProps {
  videos: RelatedVideo[];
  onSelectRelated: (url: string) => void;
}

export const RelatedVideos: React.FC<RelatedVideosProps> = ({
  videos,
  onSelectRelated,
}) => {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="w-full max-w-[900px] mt-6 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/90">
            Relative Optimized Findings & HQ Variants
          </span>
        </div>
        <span className="text-[10px] font-mono text-white/60 bg-white/10 px-2 py-0.5 rounded border border-white/10">
          StreamSnag AI Search
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectRelated(item.originalUrl)}
            className="bg-black/30 p-3.5 rounded-xl flex flex-col items-start gap-2.5 border border-white/10 cursor-pointer hover:border-white/40 hover:bg-black/50 transition-all group shadow-md"
          >
            {/* Thumbnail Box */}
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-white/5 relative border border-white/10">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 bg-[#C80A0A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow uppercase">
                {item.resolution}
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-300" />
                {item.duration}
              </div>
            </div>

            {/* Content Details */}
            <div className="flex flex-col gap-1 w-full">
              <h4 className="text-xs font-semibold text-white/90 line-clamp-1 group-hover:text-white transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center justify-between text-[11px] text-white/60">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {item.views}
                </span>
                <span className="text-[#C80A0A] group-hover:translate-x-0.5 transition-transform font-semibold text-[10px] uppercase flex items-center gap-1">
                  Fetch <Download className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
