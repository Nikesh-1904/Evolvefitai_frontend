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
    return this.post('/gyms/join-by-code', { gym_code: gymCode });
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

  /**
   * Leave current gym
   */
  async leaveGym(gymId) {
    console.log(`🚪 Leaving gym ID: ${gymId}`);
    return this.post(`/gyms/${gymId}/leave`, {});
  }

  /**
   * Create gym booking
   */
  async createBooking(bookingData) {
    console.log(`📅 Creating booking:`, bookingData);
    return this.post('/gyms/bookings/', bookingData);
  }

  /**
   * Get user's bookings
   */
  async getUserBookings(params = {}) {
    console.log(`📋 Fetching user bookings`);
    return this.get('/users/bookings/', params);
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId) {
    console.log(`❌ Cancelling booking ID: ${bookingId}`);
    return this.delete(`/users/bookings/${bookingId}`);
  }
}

const communityServiceInstance = new CommunityService();
export default communityServiceInstance;
