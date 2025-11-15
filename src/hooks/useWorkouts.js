// src/hooks/useWorkouts.js - Workout-specific hooks

import { workoutService } from '../services/api';
import { useApi } from './useApi';

/**
 * Hook for fetching workout plans
 */
export const useWorkoutPlans = () => {
  return useApi(() => workoutService.getWorkoutPlans(), true);
};

/**
 * Hook for fetching a single workout plan
 */
export const useWorkoutPlan = (planId) => {
  return useApi(() => workoutService.getWorkoutPlanById(planId), !!planId, [planId]);
};

/**
 * Hook for generating workout
 */
export const useGenerateWorkout = () => {
  return useApi((requestData) => workoutService.generateWorkout(requestData));
};

/**
 * Hook for fetching workout logs
 */
export const useWorkoutLogs = (limit = 20) => {
  return useApi(() => workoutService.getWorkoutLogs(limit), true, [limit]);
};

/**
 * Hook for logging workout
 */
export const useLogWorkout = () => {
  return useApi((logData) => workoutService.logWorkout(logData));
};

/**
 * Hook for fetching exercise details
 */
export const useExerciseDetails = (exerciseName) => {
  return useApi(
    () => workoutService.getExerciseDetails(exerciseName),
    !!exerciseName,
    [exerciseName]
  );
};

/**
 * Hook for saving workout plan
 */
export const useSaveWorkoutPlan = () => {
  return useApi((workoutPlan) => workoutService.saveWorkoutPlan(workoutPlan));
};
