// src/hooks/useCommunity.js - Community-specific hooks

import { communityService } from '../services/api';
import { useApi } from './useApi';

/**
 * Hook for fetching leaderboard
 */
export const useLeaderboard = (limit = 10) => {
  return useApi(() => communityService.getLeaderboard(limit), true, [limit]);
};

/**
 * Hook for fetching achievements
 */
export const useAchievements = () => {
  return useApi(() => communityService.getAchievements(), true);
};

/**
 * Hook for unlocking achievement
 */
export const useUnlockAchievement = () => {
  return useApi((achievementId) => communityService.unlockAchievement(achievementId));
};
