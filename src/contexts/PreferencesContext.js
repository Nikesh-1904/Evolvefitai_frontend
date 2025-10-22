// src/contexts/PreferencesContext.js - User Preferences Management Context

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext'; // --- MODIFICATION ---
import apiService from '../services/apiService'; // --- MODIFICATION ---

const PreferencesContext = createContext();

// Default preferences
const defaultPreferences = {
  // Theme and UI preferences
  theme: 'dark', // 'light', 'dark', 'auto'
  primaryColor: '#00D4FF', // Brand colors
  accentColor: '#7C3AED',
  
  // Units and measurements
  weightUnit: 'kg', // 'kg' or 'lbs'
  heightUnit: 'cm', // 'cm' or 'ft/in'
  distanceUnit: 'km', // 'km' or 'miles'
  temperatureUnit: 'celsius', // 'celsius' or 'fahrenheit'
  
  // Notifications
  notifications: {
    workoutReminders: true,
    progressUpdates: true,
    achievementAlerts: true,
    mealPlanReminders: true,
    weeklyReports: true,
    emailNotifications: true,
    pushNotifications: true,
  },
  
  // Dashboard customization
  dashboardLayout: {
    showQuickStats: true,
    showRecentWorkouts: true,
    showWorkoutPlans: true,
    showProgressChart: true,
    showAchievements: true,
    showMotivationalQuotes: true,
    widgetOrder: ['stats', 'quickActions', 'workoutPlans', 'recentActivity', 'achievements'],
  },
  
  // Workout preferences
  workoutPreferences: {
    defaultRestTime: 60, // seconds
    autoStartTimer: false,
    playCompletionSounds: true,
    showExerciseVideos: true,
    trackHeartRate: false,
  },
  
  // Privacy and data
  privacy: {
    shareProgressPublicly: false,
    allowDataForResearch: true,
    anonymizeData: true,
  },
  
  // Accessibility
  accessibility: {
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReaderOptimized: false,
  },
  
  // Advanced AI preferences
  aiPreferences: {
    personalizedRecommendations: true,
    adaptiveDifficulty: true,
    predictiveScheduling: true,
    contextAwareSuggestions: true,
  },
};

// Preferences reducer
const preferencesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PREFERENCE':
      return {
        ...state,
        [action.category]: {
          ...state[action.category],
          [action.key]: action.value,
        },
      };
    
    case 'SET_NESTED_PREFERENCE':
      return {
        ...state,
        [action.category]: {
          ...state[action.category],
          [action.subcategory]: {
            ...state[action.category][action.subcategory],
            [action.key]: action.value,
          },
        },
      };
    
    case 'RESET_PREFERENCES':
      return { ...defaultPreferences };
    
    case 'LOAD_PREFERENCES':
      return { ...defaultPreferences, ...(action.preferences || {}) };
    
    case 'UPDATE_DASHBOARD_LAYOUT':
      return {
        ...state,
        dashboardLayout: {
          ...state.dashboardLayout,
          ...action.layout,
        },
      };
    
    default:
      return state;
  }
};

export const PreferencesProvider = ({ children }) => {
  const [preferences, dispatch] = useReducer(preferencesReducer, defaultPreferences);
  const { user, updateProfile } = useAuth(); // Get user and updateProfile from AuthContext
  // Load preferences from localStorage on mount
  useEffect(() => {
    if (user && user.preferences) {
      if (JSON.stringify(user.preferences) !== JSON.stringify(preferences)) {
        console.log('🔄 Loading preferences from user object...');
        dispatch({ type: 'LOAD_PREFERENCES', preferences: user.preferences });
      }
    } else if (!user) {
      // If user logs out, reset to default
      dispatch({ type: 'RESET_PREFERENCES' });
    }
  }, [user, preferences]);

// Save preferences to backend whenever they change
  useEffect(() => {
    // We don't want to save during the initial load or if the user is not logged in
    if (!user || !user.preferences) {
      return;
    }

    // A simple debounce to prevent saving on every single keystroke
    const handler = setTimeout(() => {
      // Check if preferences have actually changed from what's on the user object
      if (JSON.stringify(preferences) !== JSON.stringify(user.preferences)) {
        console.log('💾 Saving preferences to backend...');
        
        // We use the updateProfile function from AuthContext,
        // which is already built to handle this.
        updateProfile({ preferences: preferences })
          .catch(error => {
            console.error('Failed to save preferences:', error);
            // Here you could add a toast notification for the user
          });
      }
    }, 1000); // Wait 1 second after the last change to save

    // Cleanup the timeout
    return () => {
      clearTimeout(handler);
    };
  }, [preferences, user, updateProfile]);

  // Helper functions
  const setPreference = (category, key, value) => {
    dispatch({ type: 'SET_PREFERENCE', category, key, value });
  };

  const setNestedPreference = (category, subcategory, key, value) => {
    dispatch({ type: 'SET_NESTED_PREFERENCE', category, subcategory, key, value });
  };

  const resetPreferences = () => {
    dispatch({ type: 'RESET_PREFERENCES' });
  };

  const updateDashboardLayout = (layout) => {
    dispatch({ type: 'UPDATE_DASHBOARD_LAYOUT', layout });
  };

  // Convert units based on preferences
  const convertWeight = (weightInKg) => {
    if (preferences.weightUnit === 'lbs') {
      return (weightInKg * 2.20462).toFixed(1);
    }
    return weightInKg.toFixed(1);
  };

  const convertHeight = (heightInCm) => {
    if (preferences.heightUnit === 'ft/in') {
      const totalInches = heightInCm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = (totalInches % 12).toFixed(0);
      return `${feet}'${inches}"`;
    }
    return `${heightInCm} cm`;
  };

  const convertDistance = (distanceInKm) => {
    if (preferences.distanceUnit === 'miles') {
      return (distanceInKm * 0.621371).toFixed(2);
    }
    return distanceInKm.toFixed(2);
  };

  const getUnitLabel = (type) => {
    const units = {
      weight: preferences.weightUnit,
      height: preferences.heightUnit === 'ft/in' ? 'ft' : preferences.heightUnit,
      distance: preferences.distanceUnit,
    };
    return units[type] || '';
  };

  const contextValue = {
    preferences,
    setPreference,
    setNestedPreference,
    resetPreferences,
    updateDashboardLayout,
    convertWeight,
    convertHeight,
    convertDistance,
    getUnitLabel,
  };

  return (
    <PreferencesContext.Provider value={contextValue}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export default PreferencesContext;