// src/contexts/AchievementsContext.js - Achievements and Gamification System

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { communityService } from '../services/api'; // 👈 --- NEW ---

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
      // We only store the list of unlocked achievements
      return {
        ...state,
        unlockedAchievements: action.achievements || [],
      };
    
    case 'ADD_RECENT_ACHIEVEMENT':
      // This is just for the UI popup
      return {
        ...state,
        recentAchievements: [action.achievement, ...state.recentAchievements.slice(0, 4)],
      };
    
    case 'CLEAR_RECENT_ACHIEVEMENTS':
      return {
        ...state,
        recentAchievements: [],
      };
    
    default:
      return state;
  }
};

const initialState = {
  unlockedAchievements: [],
  recentAchievements: [],
};

export const AchievementsProvider = ({ children }) => {
  // --- WE NOW GET ALL DYNAMIC DATA FROM AuthContext ---
  const { user, stats, fetchUserStats } = useAuth();
  const [state, dispatch] = useReducer(achievementsReducer, initialState);

  // --- Load achievements from BACKEND ---
  useEffect(() => {
    if (user) {
      console.log('🏆 AchievementsContext: User found, fetching status...');
      communityService.getAchievementStatus()
        .then(data => {
          dispatch({
            type: 'LOAD_ACHIEVEMENTS',
            achievements: data.unlocked_achievements,
          });
        })
        .catch(error => {
          console.error('Failed to load achievements status:', error);
        });
    } else {
      // User logged out, clear the state
      dispatch({ type: 'LOAD_ACHIEVEMENTS', achievements: [] });
    }
  }, [user]);

  // --- Check for new achievements when user stats change ---
  useEffect(() => {
    // Wait for auth to be loaded and stats to be available
    if (user && stats) {
      checkForNewAchievements(stats, user);
    }
    // We listen on stats and the unlocked list to re-check
  }, [stats, state.unlockedAchievements, user]);


const checkAchievementRequirements = (achievement, authStats, authUser) => {
    const req = achievement.requirements;
    
    // This function now maps the requirement keys to the `stats` object
    // from useAuth() (which comes from stats.py)
    
    if (req.workoutsCompleted && authStats.workouts_completed >= req.workoutsCompleted) return true;
    if (req.totalWorkoutHours && authStats.total_workout_time_hours >= req.totalWorkoutHours) return true;
    
    // --- We don't have these stats yet, but this is how you'd check ---
    // if (req.consecutiveDays && authStats.consecutiveDays >= req.consecutiveDays) return true;
    // if (req.totalWeightLifted && authStats.totalWeightLifted >= req.totalWeightLifted) return true;
    // if (req.aiWorkoutsCompleted && authStats.aiWorkoutsCompleted >= req.aiWorkoutsCompleted) return true;
    
    // Check profile completion from the user object
    if (req.profileComplete && authUser.has_completed_onboarding) return true;
    
    // ... (other checks like earlyBird, weightLost, etc. would go here) ...
    if (req.earlyWorkout && stats.earlyWorkout) return true;
    if (req.lateWorkout && stats.lateWorkout) return true;
    if (req.weightLost && stats.weightLost >= req.weightLost) return true;
    if (req.strengthIncrease && stats.strengthIncrease >= req.strengthIncrease) return true;
    
    return false;
  };

const checkForNewAchievements = (authStats, authUser) => {
    Object.values(achievementDefinitions).forEach(achievement => {
      // Check if ID is in our state
      const isUnlocked = state.unlockedAchievements.some(a => a.achievement_id === achievement.id);
      
      if (!isUnlocked && checkAchievementRequirements(achievement, authStats, authUser)) {
        // --- THIS IS THE NEW UNLOCK LOGIC ---
        console.log(`🎉 Unlocking new achievement: ${achievement.name}`);
        
        // 1. Call the backend to permanently unlock and add points
        communityService.unlockAchievement(achievement.id)
          .then(response => {
            // `response` is the new AchievementStatus
            
            // 2. Update our local list of achievements from the server's response
            dispatch({ type: 'LOAD_ACHIEVEMENTS', achievements: response.unlocked_achievements });
            
            // 3. Show the popup
            dispatch({ type: 'ADD_RECENT_ACHIEVEMENT', achievement });
            
            // 4. THIS IS THE MAGIC: Tell AuthContext to refresh its stats
            // This will update the points and level for the *entire* app.
            fetchUserStats();
          })
          .catch(error => {
            console.error(`Failed to unlock achievement ${achievement.id}:`, error);
          });
      }
    });
  };

  const getCurrentLevel = () => {
    const levelNum = stats?.level_progress?.current_level || 1;
    return levelSystem[levelNum];
  };

  const getNextLevel = () => {
    const levelNum = stats?.level_progress?.current_level || 1;
    return levelSystem[levelNum + 1];
  };

  const getProgressToNextLevel = () => {
    const currentPoints = stats?.level_progress?.current_points || 0;
    const currentLevel = getCurrentLevel();
    const nextLevel = getNextLevel();
    
    if (!nextLevel) return 100; // Max level
    
    const pointsInCurrentLevel = currentPoints - currentLevel.minPoints;
    const pointsNeededForNextLevel = nextLevel.minPoints - currentLevel.minPoints;
    
    if (pointsNeededForNextLevel === 0) return 100;
    
    return (pointsInCurrentLevel / pointsNeededForNextLevel) * 100;
  };

  const getAchievementsByCategory = (category) => {
    return Object.values(achievementDefinitions)
      .filter(achievement => achievement.category === category);
  };

  const getUnlockedAchievementsByCategory = (category) => {
    // Match on achievement_id from the DB model
    const unlockedIds = new Set(state.unlockedAchievements.map(a => a.achievement_id));
    return Object.values(achievementDefinitions)
      .filter(ach => ach.category === category && unlockedIds.has(ach.id));
  };

const contextValue = {
    // --- State (now read-only from AuthContext) ---
    unlockedAchievements: state.unlockedAchievements,
    recentAchievements: state.recentAchievements,
    totalPoints: stats?.level_progress?.current_points || 0,
    level: stats?.level_progress?.current_level || 1,
    
    // --- Functions (simplified) ---
    getCurrentLevel,
    getNextLevel,
    getProgressToNextLevel,
    getAchievementsByCategory,
    getUnlockedAchievementsByCategory,
    
    // --- Static data ---
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