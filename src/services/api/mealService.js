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

  /**
   * Save a meal plan
   */
  async saveMealPlan(mealPlanData) {
    return this.post('/meal-plans', mealPlanData);
  }

  /**
   * Get user's saved meal plans
   */
  async getMealPlans() {
    return this.get('/meal-plans');
  }

  /**
   * Get a specific meal plan by ID
   */
  async getMealPlanById(planId) {
    return this.get(`/meal-plans/${planId}`);
  }
}

const mealServiceInstance = new MealService();
export default mealServiceInstance;
