// src/contexts/AchievementsContext.js - Achievements and Gamification System

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AchievementsContext = createContext();

// Achievement definitions
const achievementDefinitions = {
  // Workout milestones
  first_workout: {
    id: 'first_workout',
    name: 'Getting Started',
    description: 'Complete your first workout',
    icon: '🏋️',
    category: 'workout',
    points: 50,
    rarity: 'common',
    requirements: { workoutsCompleted: 1 },
  },
  workout_streak_7: {
    id: 'workout_streak_7',
    name: 'Week Warrior',
    description: 'Complete workouts for 7 consecutive days',
    icon: '🔥',
    category: 'streak',
    points: 200,
    rarity: 'uncommon',
    requirements: { consecutiveDays: 7 },
  },
  workout_streak_30: {
    id: 'workout_streak_30',
    name: 'Monthly Marvel',
    description: 'Complete workouts for 30 consecutive days',
    icon: '💎',
    category: 'streak',
    points: 1000,
    rarity: 'rare',
    requirements: { consecutiveDays: 30 },
  },
  workouts_25: {
    id: 'workouts_25',
    name: 'Quarter Century',
    description: 'Complete 25 total workouts',
    icon: '🏆',
    category: 'milestone',
    points: 300,
    rarity: 'uncommon',
    requirements: { workoutsCompleted: 25 },
  },
  workouts_100: {
    id: 'workouts_100',
    name: 'Centurion',
    description: 'Complete 100 total workouts',
    icon: '👑',
    category: 'milestone',
    points: 1500,
    rarity: 'epic',
    requirements: { workoutsCompleted: 100 },
  },
  
  // Time-based achievements
  workout_time_10h: {
    id: 'workout_time_10h',
    name: 'Time Keeper',
    description: 'Accumulate 10 hours of workout time',
    icon: '⏰',
    category: 'time',
    points: 250,
    rarity: 'uncommon',
    requirements: { totalWorkoutHours: 10 },
  },
  workout_time_100h: {
    id: 'workout_time_100h',
    name: 'Time Master',
    description: 'Accumulate 100 hours of workout time',
    icon: '⚡',
    category: 'time',
    points: 2000,
    rarity: 'legendary',
    requirements: { totalWorkoutHours: 100 },
  },
  
  // Weight and strength achievements
  weight_lifted_1000kg: {
    id: 'weight_lifted_1000kg',
    name: 'Heavy Lifter',
    description: 'Lift a total of 1000kg across all workouts',
    icon: '💪',
    category: 'strength',
    points: 400,
    rarity: 'rare',
    requirements: { totalWeightLifted: 1000 },
  },
  
  // AI and technology achievements
  ai_workout_10: {
    id: 'ai_workout_10',
    name: 'AI Collaborator',
    description: 'Complete 10 AI-generated workouts',
    icon: '🤖',
    category: 'ai',
    points: 300,
    rarity: 'uncommon',
    requirements: { aiWorkoutsCompleted: 10 },
  },
  
  // Social and profile achievements
  profile_complete: {
    id: 'profile_complete',
    name: 'Profile Perfectionist',
    description: 'Complete your full fitness profile',
    icon: '📝',
    category: 'profile',
    points: 100,
    rarity: 'common',
    requirements: { profileComplete: true },
  },
  
  // Special achievements
  early_bird: {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a workout before 7 AM',
    icon: '🌅',
    category: 'special',
    points: 150,
    rarity: 'uncommon',
    requirements: { earlyWorkout: true },
  },
  night_owl: {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a workout after 10 PM',
    icon: '🦉',
    category: 'special',
    points: 150,
    rarity: 'uncommon',
    requirements: { lateWorkout: true },
  },
  
  // Progress achievements
  weight_loss_5kg: {
    id: 'weight_loss_5kg',
    name: 'Weight Warrior',
    description: 'Lose 5kg from your starting weight',
    icon: '📉',
    category: 'progress',
    points: 500,
    rarity: 'rare',
    requirements: { weightLost: 5 },
  },
  strength_gain: {
    id: 'strength_gain',
    name: 'Getting Stronger',
    description: 'Increase your max weight in any exercise by 25%',
    icon: '📈',
    category: 'progress',
    points: 400,
    rarity: 'rare',
    requirements: { strengthIncrease: 25 },
  },
};

// Level system
const levelSystem = {
  1: { name: 'Beginner', minPoints: 0, maxPoints: 499, color: '#94A3B8', icon: '🌱' },
  2: { name: 'Novice', minPoints: 500, maxPoints: 999, color: '#10B981', icon: '🏃' },
  3: { name: 'Apprentice', minPoints: 1000, maxPoints: 1999, color: '#3B82F6', icon: '💪' },
  4: { name: 'Intermediate', minPoints: 2000, maxPoints: 3999, color: '#8B5CF6', icon: '🏋️' },
  5: { name: 'Advanced', minPoints: 4000, maxPoints: 7999, color: '#F59E0B', icon: '🏆' },
  6: { name: 'Expert', minPoints: 8000, maxPoints: 15999, color: '#EF4444', icon: '🥇' },
  7: { name: 'Master', minPoints: 16000, maxPoints: 31999, color: '#EC4899', icon: '👑' },
  8: { name: 'Grandmaster', minPoints: 32000, maxPoints: 63999, color: '#6366F1', icon: '⭐' },
  9: { name: 'Legend', minPoints: 64000, maxPoints: 127999, color: '#8B5CF6', icon: '🌟' },
  10: { name: 'Mythic', minPoints: 128000, maxPoints: Infinity, color: '#F59E0B', icon: '🔱' },
};

// Achievements reducer
const achievementsReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_ACHIEVEMENTS':
      return {
        ...state,
        unlockedAchievements: action.achievements || [],
        totalPoints: action.totalPoints || 0,
        level: action.level || 1,
      };
    
    case 'UNLOCK_ACHIEVEMENT':
      const newAchievement = action.achievement;
      const isAlreadyUnlocked = state.unlockedAchievements.some(a => a.id === newAchievement.id);
      
      if (isAlreadyUnlocked) return state;
      
      const newTotalPoints = state.totalPoints + newAchievement.points;
      const newLevel = calculateLevel(newTotalPoints);
      
      return {
        ...state,
        unlockedAchievements: [...state.unlockedAchievements, {
          ...newAchievement,
          unlockedAt: new Date().toISOString(),
        }],
        totalPoints: newTotalPoints,
        level: newLevel,
        recentAchievements: [newAchievement, ...state.recentAchievements.slice(0, 4)],
      };
    
    case 'CLEAR_RECENT_ACHIEVEMENTS':
      return {
        ...state,
        recentAchievements: [],
      };
    
    case 'SET_USER_STATS':
      return {
        ...state,
        userStats: { ...state.userStats, ...action.stats },
      };
    
    default:
      return state;
  }
};

const calculateLevel = (points) => {
  for (const level in levelSystem) {
    const { minPoints, maxPoints } = levelSystem[level];
    if (points >= minPoints && points <= maxPoints) {
      return parseInt(level);
    }
  }
  return 1;
};

const initialState = {
  unlockedAchievements: [],
  recentAchievements: [],
  totalPoints: 0,
  level: 1,
  userStats: {
    workoutsCompleted: 0,
    totalWorkoutHours: 0,
    consecutiveDays: 0,
    maxConsecutiveDays: 0,
    totalWeightLifted: 0,
    aiWorkoutsCompleted: 0,
    profileComplete: false,
  },
};

export const AchievementsProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(achievementsReducer, initialState);

  // Load achievements from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem('fitness-app-achievements');
    if (savedAchievements) {
      try {
        const parsed = JSON.parse(savedAchievements);
        dispatch({ 
          type: 'LOAD_ACHIEVEMENTS', 
          achievements: parsed.unlockedAchievements,
          totalPoints: parsed.totalPoints,
          level: parsed.level,
        });
      } catch (error) {
        console.error('Failed to load achievements:', error);
      }
    }
  }, []);

  // Save achievements to localStorage
  useEffect(() => {
    const achievementsData = {
      unlockedAchievements: state.unlockedAchievements,
      totalPoints: state.totalPoints,
      level: state.level,
    };
    localStorage.setItem('fitness-app-achievements', JSON.stringify(achievementsData));
  }, [state.unlockedAchievements, state.totalPoints, state.level]);

  // Check for new achievements when user stats change
  useEffect(() => {
    checkForNewAchievements();
  }, [state.userStats]);

  const checkForNewAchievements = () => {
    Object.values(achievementDefinitions).forEach(achievement => {
      const isUnlocked = state.unlockedAchievements.some(a => a.id === achievement.id);
      if (!isUnlocked && checkAchievementRequirements(achievement, state.userStats)) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievement });
      }
    });
  };

  const checkAchievementRequirements = (achievement, stats) => {
    const req = achievement.requirements;
    
    if (req.workoutsCompleted && stats.workoutsCompleted >= req.workoutsCompleted) return true;
    if (req.consecutiveDays && stats.consecutiveDays >= req.consecutiveDays) return true;
    if (req.totalWorkoutHours && stats.totalWorkoutHours >= req.totalWorkoutHours) return true;
    if (req.totalWeightLifted && stats.totalWeightLifted >= req.totalWeightLifted) return true;
    if (req.aiWorkoutsCompleted && stats.aiWorkoutsCompleted >= req.aiWorkoutsCompleted) return true;
    if (req.profileComplete && stats.profileComplete) return true;
    if (req.earlyWorkout && stats.earlyWorkout) return true;
    if (req.lateWorkout && stats.lateWorkout) return true;
    if (req.weightLost && stats.weightLost >= req.weightLost) return true;
    if (req.strengthIncrease && stats.strengthIncrease >= req.strengthIncrease) return true;
    
    return false;
  };

  const updateUserStats = (newStats) => {
    dispatch({ type: 'SET_USER_STATS', stats: newStats });
  };

  const getCurrentLevel = () => {
    return levelSystem[state.level];
  };

  const getNextLevel = () => {
    return levelSystem[state.level + 1];
  };

  const getProgressToNextLevel = () => {
    const currentLevel = getCurrentLevel();
    const nextLevel = getNextLevel();
    
    if (!nextLevel) return 100; // Max level
    
    const pointsInCurrentLevel = state.totalPoints - currentLevel.minPoints;
    const pointsNeededForNextLevel = nextLevel.minPoints - currentLevel.minPoints;
    
    return (pointsInCurrentLevel / pointsNeededForNextLevel) * 100;
  };

  const getAchievementsByCategory = (category) => {
    return Object.values(achievementDefinitions)
      .filter(achievement => achievement.category === category);
  };

  const getUnlockedAchievementsByCategory = (category) => {
    return state.unlockedAchievements
      .filter(achievement => achievement.category === category);
  };

  const contextValue = {
    // State
    unlockedAchievements: state.unlockedAchievements,
    recentAchievements: state.recentAchievements,
    totalPoints: state.totalPoints,
    level: state.level,
    userStats: state.userStats,
    
    // Functions
    updateUserStats,
    getCurrentLevel,
    getNextLevel,
    getProgressToNextLevel,
    getAchievementsByCategory,
    getUnlockedAchievementsByCategory,
    
    // Static data
    achievementDefinitions,
    levelSystem,
  };

  return (
    <AchievementsContext.Provider value={contextValue}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};

export default AchievementsContext;