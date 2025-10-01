// src/services/apiService.js

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
      const errorData = await response.json().catch(() => ({ detail: 'API request failed' }));
      throw new Error(errorData.detail || `API request failed: ${response.status}`);
    }
    
    // Handle cases where the response body might be empty
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return response.json();
    }
    return {};
  }

  // Workout generation
  async generateWorkout(requestData) {
    return this.request('/ai/workouts/generate', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  // Exercise details
  async getExerciseDetails(exerciseName) {
    return this.request(`/ai/exercises/search?name=${encodeURIComponent(exerciseName)}`);
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

  // Workout Logs (Sessions)
  async logWorkout(logData) {
    return this.request('/workouts/logs', {
      method: 'POST',
      body: JSON.stringify(logData),
    });
  }

  async getWorkoutLogs(limit = 20) {
    return this.request(`/workouts/logs?limit=${limit}`);
  }

  async getWorkoutLog(logId) {
    return this.request(`/workouts/logs/${logId}`); // Assuming an endpoint like this exists or will be created
  }

  // User profile
  async updateUserProfile(profileData) {
    return this.request('/auth/users/me', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  async getUserProfile() {
    return this.request('/auth/users/me');
  }

  // Exercise feedback
  async submitExerciseFeedback(exerciseId, feedback) {
    return this.request('/ai/tips/interact', {
      method: 'POST',
      body: JSON.stringify({
        tip_id: exerciseId,
        interaction_type: feedback,
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
    return this.request('/ai/meal-plans/generate', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }

  async getMealPlans() {
    return this.request('/meal-plans');
  }
}

const apiService = new ApiService();
export default apiService;