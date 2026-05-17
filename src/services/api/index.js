// src/services/api/index.js - API Services Export

import authService from './authService';
import workoutService from './workoutService';
import analyticsService from './analyticsService';
import communityService from './communityService';

/**
 * Named exports for individual services (preferred approach)
 */
export {
  authService,
  workoutService,
  analyticsService,
  communityService,
};

/**
 * Combined API service object for backward compatibility
 * This allows existing code to continue working with the old apiService pattern
 */
const api = {
  // Auth methods
  login: (...args) => authService.login(...args),
  register: (...args) => authService.register(...args),
  logout: (...args) => authService.logout(...args),
  googleLogin: (...args) => authService.googleLogin(...args),
  getCurrentUser: (...args) => authService.getCurrentUser(...args),
  updateProfile: (...args) => authService.updateProfile(...args),
  isAuthenticated: (...args) => authService.isAuthenticated(...args),
  getToken: (...args) => authService.getToken(...args),
  clearAuth: (...args) => authService.clearAuth(...args),

  // Workout methods
  generateWorkout: (...args) => workoutService.generateWorkout(...args),
  getExerciseDetails: (...args) => workoutService.getExerciseDetails(...args),
  saveWorkoutPlan: (...args) => workoutService.saveWorkoutPlan(...args),
  getWorkoutPlanById: (...args) => workoutService.getWorkoutPlanById(...args),
  getWorkoutPlans: (...args) => workoutService.getWorkoutPlans(...args),
  logWorkout: (...args) => workoutService.logWorkout(...args),
  getWorkoutLogs: (...args) => workoutService.getWorkoutLogs(...args),
  submitExerciseFeedback: (...args) => workoutService.submitExerciseFeedback(...args),
  submitTipInteraction: (...args) => workoutService.submitTipInteraction(...args),

  // Analytics methods
  getDashboardOverview: (...args) => analyticsService.getDashboardOverview(...args),
  getAnalyticsData: (...args) => analyticsService.getAnalyticsData(...args),
  getLoggedExercises: (...args) => analyticsService.getLoggedExercises(...args),
  getExerciseProgression: (...args) => analyticsService.getExerciseProgression(...args),
  analyzePlateaus: (...args) => analyticsService.analyzePlateaus(...args),

  // Community methods
  joinGymByCode: (...args) => communityService.joinGymByCode(...args),
  joinGym: (...args) => communityService.joinGym(...args),
  fetchGymOccupancy: (...args) => communityService.fetchGymOccupancy(...args),
  getAchievementStatus: (...args) => communityService.getAchievementStatus(...args),
  unlockAchievement: (...args) => communityService.unlockAchievement(...args),
};

export default api;
