// src/hooks/useMeals.js - Meal-specific hooks

import { mealService } from '../services/api';
import { useApi } from './useApi';

/**
 * Hook for generating meal plan
 */
export const useGenerateMealPlan = () => {
  return useApi((requestData) => mealService.generateMealPlan(requestData));
};

/**
 * Hook for fetching meal plans
 */
export const useMealPlans = () => {
  return useApi(() => mealService.getMealPlans(), true);
};

/**
 * Hook for saving meal plan
 */
export const useSaveMealPlan = () => {
  return useApi((mealPlan) => mealService.saveMealPlan(mealPlan));
};
