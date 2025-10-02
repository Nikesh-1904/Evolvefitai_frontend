// src/services/apiService.js - Complete API Service with Authentication

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

    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'API request failed' }));
      console.error(`❌ API Error: ${response.status} - ${errorData.detail}`);
      throw new Error(errorData.detail || `API request failed: ${response.status}`);
    }

    // Handle cases where the response body might be empty
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return response.json();
    }

    return {};
  }

  // ==========================================
  // AUTHENTICATION ENDPOINTS (FIXED)
  // ==========================================

  async login(email, password) {
    console.log('🔐 Attempting login for:', email);

    // FastAPI Users expects form data for JWT login
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${this.baseURL}/auth/jwt/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(errorData.detail || 'Invalid credentials');
    }

    const data = await response.json();
    console.log('✅ Login successful, saving token');

    // Save token to localStorage
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('token_type', data.token_type);

    return data;
  }

  async register(userData) {
    console.log('📝 Registering new user:', userData.email);

    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    console.log('🚪 Logging out user');

    try {
      await this.request('/auth/jwt/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.warn('Logout request failed, clearing token anyway:', error);
    }

    // Always clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('token_type');

    return { message: 'Logged out successfully' };
  }

  async googleLogin() {
    console.log('🔍 Initiating Google OAuth');

    // Redirect to Google OAuth
    window.location.href = `${this.baseURL}/auth/google/authorize`;
  }

  // ==========================================
  // USER PROFILE ENDPOINTS
  // ==========================================

  async getCurrentUser() {
    return this.request('/auth/users/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/users/me', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  // ==========================================
  // WORKOUT ENDPOINTS
  // ==========================================

  async generateWorkout(requestData) {
    return this.request('/ai/workouts/generate', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async getExerciseDetails(exerciseName) {
    try {
      console.log(`🔍 Fetching exercise details for: ${exerciseName}`);
      const response = await this.request(`/ai/exercises/search?name=${encodeURIComponent(exerciseName)}`);

      if (Array.isArray(response) && response.length > 0) {
        const exerciseData = response[0];
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

  async saveWorkoutPlan(workoutPlan) {
    return this.request('/workouts/plans', {
      method: 'POST',
      body: JSON.stringify(workoutPlan),
    });
  }

  async getWorkoutPlans() {
    return this.request('/workouts/plans');
  }

  async logWorkout(logData) {
    return this.request('/workouts/logs', {
      method: 'POST',
      body: JSON.stringify(logData),
    });
  }

  async getWorkoutLogs(limit = 20) {
    return this.request(`/workouts/logs?limit=${limit}`);
  }

  // ==========================================
  // MEAL PLAN ENDPOINTS
  // ==========================================

  async generateMealPlan(requestData) {
    return this.request('/ai/meal-plans/generate', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  // ==========================================
  // EXERCISE FEEDBACK ENDPOINTS
  // ==========================================

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

  async analyzePlateaus(data = {}) {
    return this.request('/ai/analyze-plateau', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('token_type');
  }
}

const apiService = new ApiService();
export default apiService;
