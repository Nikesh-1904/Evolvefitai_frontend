// src/services/api/authService.js - Authentication Service

import BaseApiClient from './baseApi';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService extends BaseApiClient {
  /**
   * Login with email and password
   */
  async login(email, password) {
    console.log('🔐 Attempting login for:', email);

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const data = await this.postForm('/auth/jwt/login', formData);
    console.log('✅ Login successful, saving token');

    // Save token to localStorage
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('token_type', data.token_type);

    return data;
  }

  /**
   * Register new user
   */
  async register(userData) {
    console.log('📝 Registering new user:', userData.email);
    return this.post('/auth/register', userData);
  }

  /**
   * Logout current user
   */
  async logout() {
    console.log('🚪 Logging out user');

    try {
      await this.post('/auth/jwt/logout', {});
    } catch (error) {
      console.warn('Logout request failed, clearing token anyway:', error);
    }

    // Always clear local storage
    this.clearAuth();

    return { message: 'Logged out successfully' };
  }

  /**
   * Initiate Google OAuth login
   */
  async googleLogin() {
    try {
      console.log('🔍 Initiating Google OAuth: Fetching authorization URL...');

      const response = await this.get('/auth/google/authorize');

      if (response && response.authorization_url) {
        console.log('✅ Authorization URL received. Redirecting to Google...');
        window.location.href = response.authorization_url;
      } else {
        throw new Error('Could not retrieve Google authorization URL.');
      }
    } catch (error) {
      console.error('❌ Google login initiation failed:', error);
      throw new Error('Failed to start the Google login process. Please try again.');
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    return this.get('/auth/users/me');
  }

  /**
   * Update current user profile
   */
  async updateProfile(profileData) {
    return this.patch('/auth/users/me', profileData);
  }

  /**
   * Get user QR code for gym check-ins
   */
  async getUserQRCode() {
    return this.get('/users/me/qr-code');
  }

  /**
   * Get user membership information
   */
  async getMembershipInfo() {
    return this.get('/users/me/membership-info');
  }

  /**
   * Get user notifications
   */
  async getNotifications() {
    return this.get('/users/me/notifications');
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId) {
    return this.patch(`/users/me/notifications/${notificationId}/read`, {});
  }

  /**
   * Get user notification preferences
   */
  async getNotificationPreferences() {
    return this.get('/users/me/preferences');
  }

  /**
   * Update user notification preferences
   */
  async updateNotificationPreferences(preferences) {
    return this.patch('/users/me/preferences', preferences);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Get current auth token
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Clear authentication data
   */
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('token_type');
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
