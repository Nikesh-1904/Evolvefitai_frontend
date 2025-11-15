// src/services/api/workoutService.js - Workout Service

import BaseApiClient from './baseApi';

/**
 * Workout Service
 * Handles all workout-related API calls
 */
class WorkoutService extends BaseApiClient {
  /**
   * Generate AI workout plan
   */
  async generateWorkout(requestData) {
    return this.post('/ai/workouts/generate', requestData);
  }

  /**
   * Get exercise details by name
   */
  async getExerciseDetails(exerciseName) {
    try {
      console.log(`🔍 Fetching exercise details for: ${exerciseName}`);
      const response = await this.get('/ai/exercises/search', {
        name: exerciseName
      });

      if (Array.isArray(response) && response.length > 0) {
        const exerciseData = response[0];
        console.log(`✅ Exercise details fetched for ${exerciseName}`);
        return {
          exercise: exerciseData.exercise || {},
          videos: exerciseData.videos || [],
          tips: exerciseData.tips || []
        };
      } else {
        console.warn(`⚠️ No exercise details found for: ${exerciseName}`);
        return this.getDefaultExerciseData(exerciseName);
      }
    } catch (error) {
      console.error(`❌ Failed to fetch exercise details for ${exerciseName}:`, error);
      return this.getDefaultExerciseData(exerciseName);
    }
  }

  /**
   * Get default exercise data when API fails
   */
  getDefaultExerciseData(exerciseName) {
    return {
      exercise: {
        name: exerciseName,
        instructions: 'Exercise details temporarily unavailable. Please try again later.'
      },
      videos: [{
        title: `Search for ${exerciseName} tutorials`,
        youtube_url: `https://www.youtube.com/results?search_query=${exerciseName.replace(' ', '+')}+exercise+tutorial`,
        duration: 0,
        thumbnail_url: ''
      }],
      tips: [{
        title: 'Exercise Safely',
        content: 'Always warm up before exercising and focus on proper form.',
        tip_type: 'Safety'
      }]
    };
  }

  /**
   * Save workout plan
   */
  async saveWorkoutPlan(workoutPlan) {
    return this.post('/workouts/plans', workoutPlan);
  }

  /**
   * Get workout plan by ID
   */
  async getWorkoutPlanById(planId) {
    return this.get(`/workouts/plans/${planId}`);
  }

  /**
   * Get all workout plans for current user
   */
  async getWorkoutPlans() {
    return this.get('/workouts/plans');
  }

  /**
   * Log workout completion
   */
  async logWorkout(logData) {
    return this.post('/workouts/logs', logData);
  }

  /**
   * Get workout logs
   */
  async getWorkoutLogs(limit = 20) {
    return this.get('/workouts/logs', { limit });
  }

  /**
   * Submit exercise feedback
   */
  async submitExerciseFeedback(exerciseName, feedbackType) {
    try {
      console.log(`📝 Submitting feedback: ${feedbackType} for ${exerciseName}`);
      const response = await this.post('/ai/exercises/feedback', {
        exercise_name: exerciseName,
        feedback_type: feedbackType
      });
      console.log(`✅ Feedback submitted successfully`);
      return response;
    } catch (error) {
      console.error(`❌ Failed to submit feedback for ${exerciseName}:`, error);
      throw error;
    }
  }

  /**
   * Submit tip interaction
   */
  async submitTipInteraction(tipId, interactionType) {
    try {
      console.log(`👍 Submitting tip interaction: ${interactionType} for tip ${tipId}`);
      const response = await this.post('/ai/tips/interact', {
        tip_id: tipId,
        interaction_type: interactionType
      });
      console.log(`✅ Tip interaction recorded`);
      return response;
    } catch (error) {
      console.error(`❌ Failed to record tip interaction:`, error);
      throw error;
    }
  }
}

export default new WorkoutService();
