import { useState, useEffect } from 'react';
import type { VideoInfo, QualityOption, RelatedVideo } from './types';
import {
  isValidVideoUrl,
  extractVideoMetadata,
  getRelatedVideos,
  triggerBrowserDownload,
} from './utils/videoExtractor';
import {
  getDownloadHistory,
  addDownloadToHistory,
  clearDownloadHistory,
} from './utils/storage';

import { Header } from './components/Header';
import { LinkInput } from './components/LinkInput';
import { VerificationState } from './components/VerificationState';
import { ErrorState } from './components/ErrorState';
import { VideoResultPanel } from './components/VideoResultPanel';
import { RelatedVideos } from './components/RelatedVideos';
import { QualitySelectorModal } from './components/QualitySelectorModal';
import { DownloadHistoryDrawer } from './components/DownloadHistoryDrawer';
import { AmbientBackground } from './components/AmbientBackground';

export function App() {
  const [url, setUrl] = useState('');
  const [appState, setAppState] = useState<'idle' | 'verifying' | 'verified' | 'error'>('idle');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<RelatedVideo[]>([]);
  
  // Modals & Drawers
  const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Download & History States
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [history, setHistory] = useState(getDownloadHistory());

  useEffect(() => {
    setHistory(getDownloadHistory());
  }, []);

  // Handle Video Verification Process
  const handleVerify = async (targetUrl?: string) => {
    const linkToVerify = targetUrl || url;
    if (!isValidVideoUrl(linkToVerify)) {
      setAppState('error');
      return;
    }

    setAppState('verifying');
    setVideoInfo(null);

    try {
      const data = await extractVideoMetadata(linkToVerify);
      setVideoInfo(data);
      const related = getRelatedVideos(data);
      setRelatedVideos(related);
      setAppState('verified');
    } catch {
      setAppState('error');
    }
  };

  const handleSelectSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    handleVerify(sampleUrl);
  };

  // Handle Download Trigger (100% Free & Unlimited)
  const handleConfirmDownload = async (quality: QualityOption) => {
    if (!videoInfo) return;

    setIsDownloading(true);
    setDownloadProgress(15);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => (prev >= 90 ? 90 : prev + 15));
    }, 300);

    const filename = `StreamSnag_${videoInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}_${quality.resolution}.${quality.format}`;
    const success = await triggerBrowserDownload(quality.downloadUrl || videoInfo.sampleVideoUrl, filename);

    clearInterval(interval);

    if (success) {
      setDownloadProgress(100);

      addDownloadToHistory({
        videoTitle: videoInfo.title,
        thumbnail: videoInfo.thumbnail,
        platform: videoInfo.platform,
        qualityLabel: quality.label,
        format: quality.format,
        filesize: quality.filesize,
        downloadUrl: quality.downloadUrl || videoInfo.sampleVideoUrl,
      });

      setHistory(getDownloadHistory());
    }

    setTimeout(() => {
      setIsDownloading(false);
      setIsQualityModalOpen(false);
    }, 600);
  };

  // Direct 1-Click Best Quality Download Handler
  const handleDirectBestDownload = (targetInfo?: VideoInfo | null) => {
    const info = targetInfo || videoInfo;
    if (!info) return;

    const bestQuality = info.availableQualities[0] || {
      id: 'best_hd',
      label: 'Best HD Quality',
      resolution: '1080p Full HD',
      codec: 'H.264 / AAC',
      filesize: 'Auto Stream',
      format: 'mp4',
      downloadUrl: info.sampleVideoUrl,
    };

    handleConfirmDownload(bestQuality);
  };

  const handleClearHistory = () => {
    clearDownloadHistory();
    setHistory([]);
  };

  return (
    <section className="relative min-h-screen w-full bg-[#C80A0A] flex flex-col z-10 font-manrope text-white pb-16 overflow-hidden">
      {/* Non-Intrusive Ambient Motion Graphics Canvas */}
      <AmbientBackground />

      {/* Fixed Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center w-full pt-[100px] md:pt-[150px]">
        <div className="flex flex-col items-center w-full px-8 text-center z-20 relative max-w-[900px] mx-auto">
          {/* a) Logo SVG -- white fill, 80x80, mb-12 */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-12 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M60 120C26.8629 120 0 93.1371 0 60V0C22.5654 0 42.2213 12.4569 52.4662 30.8691C38.4788 34.2089 28.0787 46.7902 28.0787 61.8006V63.1443C28.0787 79.9648 41.7146 93.6006 58.5353 93.6006H59.8789L59.8785 61.8006C59.8785 79.3633 74.1159 93.6006 91.6787 93.6006L91.6787 61.8006C91.6787 44.2783 77.5071 30.0661 60 30.0008L60 0H62.5352C94.2722 0 120 25.7279 120 57.4648V60C120 93.1371 93.1371 120 60 120Z"
              fill="white"
            />
          </svg>

          {/* b) Platform Mission Statement Text */}
          <p className="text-white text-[15px] sm:text-[16px] w-full max-w-[480px] leading-[1.6] mb-[40px] uppercase tracking-wider mx-auto font-normal">
            Engineered for ultra-fast, uncompromised media acquisition — download 4K HD videos, audio tracks, and reels effortlessly with zero limits
          </p>

          {/* Downloader Core Search & Link Extraction Input */}
          <LinkInput
            url={url}
            setUrl={setUrl}
            onVerify={() => handleVerify()}
            isVerifying={appState === 'verifying'}
            onSelectSample={handleSelectSample}
          />

          {/* CONDITIONAL APPLICATION STATES */}
          {appState === 'verifying' && <VerificationState />}

          {appState === 'error' && (
            <ErrorState
              onRetry={() => {
                setUrl('');
                setAppState('idle');
              }}
              onUseSample={handleSelectSample}
            />
          )}

          {appState === 'verified' && videoInfo && (
            <>
              <VideoResultPanel
                video={videoInfo}
                onDirectDownload={() => handleDirectBestDownload()}
                onOpenQualityModal={() => setIsQualityModalOpen(true)}
              />

              <RelatedVideos
                videos={relatedVideos}
                onSelectRelated={(relUrl) => handleSelectSample(relUrl)}
              />
            </>
          )}

          {/* c) Cursive signature */}
          <div className="font-marck text-white/95 text-[38px] sm:text-[52px] md:text-[62px] leading-tight mb-6 mt-10 select-none tracking-wide font-normal">
            Bablu Menariya
          </div>

          {/* d) Platform Statements (Title Case, font-light) */}
          <div className="text-white leading-[1.6] mb-[40px] w-full flex flex-col items-center font-light">
            <p className="mb-[24px] text-[15px] sm:text-[16px] w-[460px] max-w-full text-center">
              I Created StreamSnag Because Downloading Online Media Should Be Instant, Private, And Seamless. Our Engine Deciphers High-Bitrate Video Streams Directly Without Annoying Ads Or Quality Loss.
            </p>
            <p className="text-[15px] sm:text-[16px] w-[460px] max-w-full text-center">
              Enjoy Unrestricted Ultra HD Downloads Across YouTube, TikTok, Instagram, Twitter, And Vimeo. Superior Speed, High-Fidelity Audio, And Complete Convenience.
            </p>
          </div>
        </div>
      </div>

      {/* MODALS AND DRAWERS */}
      {isQualityModalOpen && videoInfo && (
        <QualitySelectorModal
          video={videoInfo}
          onClose={() => setIsQualityModalOpen(false)}
          onConfirmDownload={handleConfirmDownload}
          isDownloading={isDownloading}
          downloadProgress={downloadProgress}
        />
      )}

      <DownloadHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClear={handleClearHistory}
        onRedownload={(item) => triggerBrowserDownload(item.downloadUrl, `StreamSnag_${item.videoTitle}.${item.format}`)}
      />
    </section>
  );
}

export default App;
