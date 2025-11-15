// src/services/apiService.js - DEPRECATED - Use services/api/index.js instead
// This file is kept for backward compatibility with existing code

/**
 * @deprecated This service is deprecated. Use individual services from './api' instead:
 * - authService for authentication
 * - workoutService for workouts
 * - mealService for meal plans
 * - analyticsService for analytics
 * - communityService for community features
 *
 * Example migration:
 * Old: import apiService from './services/apiService';
 * New: import { authService, workoutService } from './services/api';
 */

import api from './api';

// Re-export the new API service for backward compatibility
export default api;
