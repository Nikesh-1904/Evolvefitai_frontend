// src/services/api/communityService.js - Community & Gym Service

import BaseApiClient from './baseApi';

/**
 * Community Service
 * Handles all community, gym, and social features API calls
 */
class CommunityService extends BaseApiClient {
  /**
   * List all gyms with optional search
   */
  async listGyms(params = {}) {
    console.log('🏢 Fetching gym list', params);
    return this.get('/gyms', params);
  }

  /**
   * Get gym details by ID
   */
  async getGymDetails(gymId) {
    console.log(`🏢 Fetching details for gym ID: ${gymId}`);
    return this.get(`/gyms/${gymId}`);
  }

  /**
   * Join gym using code
   */
  async joinGymByCode(gymCode) {
    console.log(`🔑 Attempting to join gym with code: ${gymCode}`);
    return this.post('/community/join-by-code', { gym_code: gymCode });
  }

  /**
   * Join gym by ID
   */
  async joinGym(gymId) {
    console.log(`➕ Joining gym ID: ${gymId}`);
    return this.post(`/gyms/${gymId}/join`, {});
  }

  /**
   * Get gym occupancy data
   */
  async fetchGymOccupancy(gymId) {
    console.log(`📊 Fetching occupancy for gym ID: ${gymId}`);
    return this.get(`/gyms/${gymId}/occupancy`);
  }

  /**
   * Get leaderboard for user's gym
   */
  async fetchMyGymLeaderboard(limit = 10) {
    console.log(`🏆 Fetching leaderboard for current user's gym`);
    return this.get('/community/leaderboard/my-gym', { limit });
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
