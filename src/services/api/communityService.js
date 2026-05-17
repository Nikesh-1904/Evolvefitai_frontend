// src/services/api/communityService.js - Gym membership & achievements

import BaseApiClient from './baseApi';

/**
 * Community Service
 * Handles gym membership (join by code, leave) and achievement API calls.
 */
class CommunityService extends BaseApiClient {
  /**
   * Join gym using code
   */
  async joinGymByCode(gymCode) {
    console.log(`🔑 Attempting to join gym with code: ${gymCode}`);
    return this.post('/gyms/join-by-code', { gym_code: gymCode });
  }

  /**
   * Leave current gym
   */
  async leaveGym(gymId) {
    console.log(`🚪 Leaving gym ID: ${gymId}`);
    return this.post(`/gyms/${gymId}/leave`, {});
  }

  /**
   * Get achievement status
   */
  async getAchievementStatus() {
    console.log('🏆 Fetching achievement status from backend...');
    return this.get('/achievements/status');
  }

  /**
   * Unlock an achievement
   */
  async unlockAchievement(achievementId) {
    console.log(`🎉 Unlocking achievement: ${achievementId}`);
    return this.post('/achievements/unlock', { achievement_id: achievementId });
  }
}

const communityServiceInstance = new CommunityService();
export default communityServiceInstance;
