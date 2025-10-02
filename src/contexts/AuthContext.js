// src/contexts/AuthContext.js - Fixed Authentication Context

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          console.log('🔍 Found token, fetching user profile...');
          const userProfile = await apiService.getCurrentUser();
          setUser(userProfile);
          console.log('✅ User authenticated:', userProfile.email);
        } catch (error) {
          console.error('❌ Token invalid, clearing auth:', error);
          apiService.clearAuth();
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log('🔐 AuthContext: Starting login process...');

      // Call the apiService login function
      const loginResponse = await apiService.login(email, password);

      // Get the user profile after successful login
      const userProfile = await apiService.getCurrentUser();
      setUser(userProfile);

      console.log('✅ AuthContext: Login successful for', userProfile.email);
      return loginResponse;
    } catch (error) {
      console.error('❌ AuthContext: Login failed:', error);
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      console.log('📝 AuthContext: Starting registration process...');

      const registerResponse = await apiService.register(userData);

      // Automatically log in after successful registration
      if (userData.email && userData.password) {
        await login(userData.email, userData.password);
      }

      console.log('✅ AuthContext: Registration successful');
      return registerResponse;
    } catch (error) {
      console.error('❌ AuthContext: Registration failed:', error);
      throw error;
    }
  };

  // Google login function
  const googleLogin = async () => {
    try {
      console.log('🔍 AuthContext: Starting Google OAuth...');

      // This will redirect to Google OAuth
      await apiService.googleLogin();

      // Note: The actual user setting happens in the OAuth callback
    } catch (error) {
      console.error('❌ AuthContext: Google login failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('🚪 AuthContext: Starting logout process...');

      await apiService.logout();
      setUser(null);

      console.log('✅ AuthContext: Logout successful');
    } catch (error) {
      console.error('❌ AuthContext: Logout failed:', error);
      // Still clear user state even if API call fails
      apiService.clearAuth();
      setUser(null);
    }
  };

  // Update user profile function
  const updateProfile = async (profileData) => {
    try {
      console.log('👤 AuthContext: Updating user profile...');

      const updatedUser = await apiService.updateProfile(profileData);
      setUser(updatedUser);

      console.log('✅ AuthContext: Profile updated successfully');
      return updatedUser;
    } catch (error) {
      console.error('❌ AuthContext: Profile update failed:', error);
      throw error;
    }
  };

  // Handle OAuth callback (called from OAuthCallback component)
  const handleOAuthCallback = async (token) => {
    try {
      console.log('🔄 AuthContext: Processing OAuth callback...');

      // Save the token
      localStorage.setItem('token', token);
      localStorage.setItem('token_type', 'bearer');

      // Get user profile
      const userProfile = await apiService.getCurrentUser();
      setUser(userProfile);

      console.log('✅ AuthContext: OAuth callback processed for', userProfile.email);
      return userProfile;
    } catch (error) {
      console.error('❌ AuthContext: OAuth callback failed:', error);
      apiService.clearAuth();
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    googleLogin,
    logout,
    updateProfile,
    handleOAuthCallback,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
