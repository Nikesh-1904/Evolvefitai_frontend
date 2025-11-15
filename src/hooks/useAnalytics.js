// src/hooks/useAnalytics.js - Analytics-specific hooks

import { analyticsService } from '../services/api';
import { useApi } from './useApi';

/**
 * Hook for fetching dashboard overview
 */
export const useDashboardOverview = () => {
  return useApi(() => analyticsService.getDashboardOverview(), true);
};

/**
 * Hook for fetching analytics data
 */
export const useAnalyticsData = (aggregation = 'day') => {
  return useApi(
    () => analyticsService.getAnalyticsData(aggregation),
    true,
    [aggregation]
  );
};

/**
 * Hook for fetching logged exercises
 */
export const useLoggedExercises = () => {
  return useApi(() => analyticsService.getLoggedExercises(), true);
};

/**
 * Hook for fetching exercise progression
 */
export const useExerciseProgression = (exerciseName) => {
  return useApi(
    () => analyticsService.getExerciseProgression(exerciseName),
    !!exerciseName,
    [exerciseName]
  );
};

/**
 * Hook for analyzing plateaus
 */
export const useAnalyzePlateaus = () => {
  return useApi((data) => analyticsService.analyzePlateaus(data));
};
