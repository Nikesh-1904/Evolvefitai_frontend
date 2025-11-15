// src/services/api/analyticsService.js - Analytics & Stats Service

import BaseApiClient from './baseApi';

/**
 * Analytics Service
 * Handles all analytics and statistics API calls
 */
class AnalyticsService extends BaseApiClient {
  /**
   * Get dashboard overview stats
   */
  async getDashboardOverview() {
    return this.get('/stats/overview');
  }

  /**
   * Get analytics data with aggregation
   */
  async getAnalyticsData(aggregation = 'day') {
    return this.get('/stats/analytics', { aggregate_by: aggregation });
  }

  /**
   * Get logged exercises
   */
  async getLoggedExercises() {
    return this.get('/stats/logged-exercises');
  }

  /**
   * Get exercise progression data
   */
  async getExerciseProgression(exerciseName) {
    return this.get('/stats/exercise-progression', {
      exercise_name: exerciseName
    });
  }

  /**
   * Analyze plateau
   */
  async analyzePlateaus(data = {}) {
    return this.post('/ai/analyze-plateau', data);
  }
}

export default new AnalyticsService();
