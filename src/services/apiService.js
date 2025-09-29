import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
    });

    // Add token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Workouts
  async generateWorkout(duration = 45) {
    const response = await this.api.post('/ai/workouts/generate', {
      duration_minutes: duration
    });
    return response.data;
  }

  async getWorkoutPlans() {
    const response = await this.api.get('/workouts/plans');
    return response.data;
  }

  async logWorkout(workoutData) {
    const response = await this.api.post('/workouts/logs', workoutData);
    return response.data;
  }

  async getWorkoutLogs() {
    const response = await this.api.get('/workouts/logs');
    return response.data;
  }

  // Exercises
  async getExercises(category = null) {
    const params = category ? { category } : {};
    const response = await this.api.get('/workouts/exercises', { params });
    return response.data;
  }

  async getExerciseVideos(exerciseId) {
    const response = await this.api.get(`/ai/exercises/${exerciseId}/videos`);
    return response.data;
  }

  async getExerciseTips(exerciseId) {
    const response = await this.api.get(`/ai/exercises/${exerciseId}/tips`);
    return response.data;
  }

  async interactWithTip(tipId, interactionType) {
    const response = await this.api.post(`/ai/tips/${tipId}/interact`, {
      tip_id: tipId,
      interaction_type: interactionType
    });
    return response.data;
  }
}

export default new ApiService();