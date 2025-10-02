// src/services/apiService.js - Enhanced with better exercise functionality

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

  // Meal plan generation - UPDATED
  async generateMealPlan(requestData) {
    return this.request('/ai/meal-plans/generate', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  // Get exercise details with videos and tips - ENHANCED
  async getExerciseDetails(exerciseName) {
    try {
      console.log(`🔍 Fetching exercise details for: ${exerciseName}`);
      const response = await this.request(`/ai/exercises/search?name=${encodeURIComponent(exerciseName)}`);

      if (Array.isArray(response) && response.length > 0) {
        const exerciseData = response[0]; // Take the first result
        console.log(`✅ Exercise details fetched for ${exerciseName}:`, exerciseData);
        return {
          exercise: exerciseData.exercise || {},
          videos: exerciseData.videos || [],
          tips: exerciseData.tips || []
        };
      } else {
        console.warn(`⚠️ No exercise details found for: ${exerciseName}`);
        return {
          exercise: { name: exerciseName, instructions: 'No details available' },
          videos: [],
          tips: []
        };
      }
    } catch (error) {
      console.error(`❌ Failed to fetch exercise details for ${exerciseName}:`, error);
      // Return fallback data instead of throwing
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
  }

  // Submit exercise feedback - NEW
  async submitExerciseFeedback(exerciseName, feedbackType) {
    try {
      console.log(`📝 Submitting feedback: ${feedbackType} for ${exerciseName}`);
      const response = await this.request('/ai/exercises/feedback', {
        method: 'POST',
        body: JSON.stringify({
          exercise_name: exerciseName,
          feedback_type: feedbackType
        }),
      });
      console.log(`✅ Feedback submitted successfully:`, response);
      return response;
    } catch (error) {
      console.error(`❌ Failed to submit feedback for ${exerciseName}:`, error);
      throw error;
    }
  }

  // Interact with tips - ENHANCED
  async submitTipInteraction(tipId, interactionType) {
    try {
      console.log(`👍 Submitting tip interaction: ${interactionType} for tip ${tipId}`);
      const response = await this.request('/ai/tips/interact', {
        method: 'POST',
        body: JSON.stringify({
          tip_id: tipId,
          interaction_type: interactionType
        }),
      });
      console.log(`✅ Tip interaction recorded:`, response);
      return response;
    } catch (error) {
      console.error(`❌ Failed to record tip interaction:`, error);
      throw error;
    }
  }

  // Workout management
  async getWorkoutPlans() {
    return this.request('/workouts/plans');
  }

  async saveWorkoutPlan(workoutPlan) {
    return this.request('/workouts/plans', {
      method: 'POST',
      body: JSON.stringify(workoutPlan),
    });
  }

  async getWorkoutLogs(limit = 20) {
    return this.request(`/workouts/logs?limit=${limit}`);
  }

  async logWorkout(logData) {
    return this.request('/workouts/logs', {
      method: 'POST',
      body: JSON.stringify(logData),
    });
  }

  // User profile
  async getCurrentUser() {
    return this.request('/auth/users/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/users/me', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  // Plateau analysis
  async analyzePlateaus(data = {}) {
    return this.request('/ai/analyze-plateau', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

const apiService = new ApiService();
export default apiService;
