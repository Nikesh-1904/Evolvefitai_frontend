// src/services/api/mealService.js - Meal Plan Service

import BaseApiClient from './baseApi';

/**
 * Meal Plan Service
 * Handles all meal plan-related API calls
 */
class MealService extends BaseApiClient {
  /**
   * Generate AI meal plan
   */
  async generateMealPlan(requestData) {
    return this.post('/ai/meal-plans/generate', requestData);
  }
}

export default new MealService();
