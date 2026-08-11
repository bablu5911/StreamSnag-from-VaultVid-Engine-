export type VideoPlatform = 
  | 'youtube' 
  | 'tiktok' 
  | 'instagram' 
  | 'twitter' 
  | 'vimeo' 
  | 'facebook' 
  | 'twitch' 
  | 'reddit' 
  | 'generic';

export interface QualityOption {
  id: string;
  label: string;
  resolution: string;
  codec: string;
  filesize: string;
  format: 'mp4' | 'mkv' | 'mp3' | 'm4a' | 'webm' | 'gif';
  bitrate: string;
  fps?: number;
  isAudioOnly?: boolean;
  downloadUrl?: string;
}

export interface VideoInfo {
  id: string;
  url: string;
  title: string;
  platform: VideoPlatform;
  author: string;
  authorAvatar?: string;
  thumbnail: string;
  duration: string;
  viewCount: string;
  publishDate: string;
  aspect: string;
  availableQualities: QualityOption[];
  sampleVideoUrl: string;
}

export interface RelatedVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  resolution: string;
  platform: VideoPlatform;
  views: string;
  originalUrl: string;
}

export type MembershipTier = 'free' | 'weekly' | 'monthly' | 'yearly';

export interface UserUsage {
  dailyCount: number;
  maxFreeLimit: number;
  lastResetTimestamp: number;
  isMember: boolean;
  membershipTier: MembershipTier;
}

export interface DownloadHistoryItem {
  id: string;
  videoTitle: string;
  thumbnail: string;
  platform: VideoPlatform;
  qualityLabel: string;
  format: string;
  timestamp: string;
  filesize: string;
  downloadUrl: string;
}

export interface MembershipPlan {
  id: MembershipTier;
  name: string;
  price: string;
  period: string;
  badge?: string;
  features: string[];
  popular?: boolean;
}
