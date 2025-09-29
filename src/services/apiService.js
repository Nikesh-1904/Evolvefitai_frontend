// src/services/apiService.js - Add workout session methods

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return response.json();
  }

  // Workout generation
  async generateWorkout(preferences) {
    return this.request('/ai/generate-workout', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }

  // Exercise details
  async getExerciseDetails(exerciseName) {
    return this.request(`/workouts/exercises/${encodeURIComponent(exerciseName)}`);
  }

  // Workout plans
  async saveWorkoutPlan(workoutPlan) {
    return this.request('/workouts/plans', {
      method: 'POST',
      body: JSON.stringify(workoutPlan),
    });
  }

  async getWorkoutPlans() {
    return this.request('/workouts/plans');
  }

  // Workout sessions - NEW METHODS
  async saveWorkoutSession(sessionData) {
    return this.request('/workouts/sessions', {
      method: 'POST',
      body: JSON.stringify({
        workout_plan_id: sessionData.workout_plan?.id || null,
        duration_minutes: sessionData.duration_minutes,
        exercises_completed: sessionData.exercises_completed,
        notes: sessionData.notes,
        completed_sets: sessionData.completed_sets,
        calories_burned: sessionData.estimated_calories || null,
        difficulty_rating: sessionData.difficulty_rating || null,
        workout_date: sessionData.completed_at || new Date().toISOString()
      }),
    });
  }

  async getWorkoutSessions() {
    return this.request('/workouts/sessions');
  }

  async getWorkoutSession(sessionId) {
    return this.request(`/workouts/sessions/${sessionId}`);
  }

  // User profile
  async updateUserProfile(profileData) {
    return this.request('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  async getUserProfile() {
    return this.request('/auth/me');
  }

  // Exercise feedback
  async submitExerciseFeedback(exerciseId, feedback) {
    return this.request('/workouts/feedback', {
      method: 'POST',
      body: JSON.stringify({
        exercise_id: exerciseId,
        feedback_type: feedback, // 'like' or 'dislike'
      }),
    });
  }

  // Plateau analysis
  async analyzePlateau(workoutHistory) {
    return this.request('/ai/analyze-plateau', {
      method: 'POST',
      body: JSON.stringify({ workout_history: workoutHistory }),
    });
  }

  // Meal plans
  async generateMealPlan(preferences) {
    return this.request('/ai/generate-meal-plan', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }

  async getMealPlans() {
    return this.request('/meals/plans');
  }
}

const apiService = new ApiService();
export default apiService;