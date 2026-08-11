import type { UserUsage, DownloadHistoryItem, MembershipTier } from '../types';

const USAGE_KEY = 'streamsnag_user_usage_v1';
const HISTORY_KEY = 'streamsnag_download_history_v1';

const INITIAL_USAGE: UserUsage = {
  dailyCount: 0,
  maxFreeLimit: 999999,
  lastResetTimestamp: Date.now(),
  isMember: true,
  membershipTier: 'yearly',
};

export const getUserUsage = (): UserUsage => {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return INITIAL_USAGE;
    const data: UserUsage = JSON.parse(raw);
    
    // Check if 24 hours (86400000 ms) passed since last reset
    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    if (now - data.lastResetTimestamp > TWENTY_FOUR_HOURS) {
      const resetData: UserUsage = {
        ...data,
        dailyCount: 0,
        lastResetTimestamp: now,
      };
      localStorage.setItem(USAGE_KEY, JSON.stringify(resetData));
      return resetData;
    }
    return data;
  } catch {
    return INITIAL_USAGE;
  }
};

export const incrementUsage = (): UserUsage => {
  const current = getUserUsage();
  const updated: UserUsage = {
    ...current,
    dailyCount: current.dailyCount + 1,
  };
  localStorage.setItem(USAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const activateMembership = (tier: MembershipTier): UserUsage => {
  const current = getUserUsage();
  const updated: UserUsage = {
    ...current,
    isMember: true,
    membershipTier: tier,
  };
  localStorage.setItem(USAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const getDownloadHistory = (): DownloadHistoryItem[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addDownloadToHistory = (item: Omit<DownloadHistoryItem, 'id' | 'timestamp'>): DownloadHistoryItem => {
  const history = getDownloadHistory();
  const newItem: DownloadHistoryItem = {
    ...item,
    id: `dl_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
  };
  const updated = [newItem, ...history.slice(0, 19)]; // Keep latest 20 downloads
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return newItem;
};

export const clearDownloadHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};
