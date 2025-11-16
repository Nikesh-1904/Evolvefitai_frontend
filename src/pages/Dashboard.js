// src/pages/Dashboard.js - Modern Redesigned Version with Phase 2 Components

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Stack,
  Skeleton,
} from '@mui/material';
import {
  Restaurant,
  TrendingUp,
  PlayArrow,
  Create,
  AutoAwesome,
  Close,
  CheckCircle,
  LocalFireDepartment,
  Timer,
  EmojiEvents,
  NavigateNext,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { workoutService, analyticsService, mealService } from '../services/api';

import { usePreferences } from '../contexts/PreferencesContext';
// Import our modern components
import ModernCard, { StatCard, QuickActionCard } from '../components/ModernCard';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';
import AIModelBadge from '../components/AIModelBadge';
import ContextualHelp from '../components/ContextualHelp';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management (preserved from original)
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  // Meal plan generation states
  const [mealPlanLoading, setMealPlanLoading] = useState(false);
  const [mealPlanDialog, setMealPlanDialog] = useState(false);
  const [generatedMealPlan, setGeneratedMealPlan] = useState(null);
  const [mealPlanError, setMealPlanError] = useState('');
  const { convertWeight, convertHeight, getUnitLabel } = usePreferences();

  // All useEffect and functions preserved exactly as original
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [workoutLogsData, workoutPlansData, statsData] = await Promise.all([
        workoutService.getWorkoutLogs(),
        workoutService.getWorkoutPlans(),
        analyticsService.getDashboardOverview(),
      ]);

      setRecentWorkouts(workoutLogsData.slice(0, 3));
      setWorkoutPlans(workoutPlansData.slice(0, 3));
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWorkout = () => {
    navigate('/generate-workout');
  };

  const handleGenerateMealPlan = async () => {
    setMealPlanLoading(true);
    setMealPlanError('');
    
    try {
      const requestData = {
        preferences: {
          dietary_restrictions: user?.dietary_restrictions || [],
          calories_goal: user?.calories_goal || 'moderate',
          meal_count: 4
        }
      };
      
      const mealPlan = await mealService.generateMealPlan(requestData);
      setGeneratedMealPlan(mealPlan);
      setMealPlanDialog(true);
    } catch (error) {
      setMealPlanError(error.message || 'Failed to generate meal plan. Please try again.');
    } finally {
      setMealPlanLoading(false);
    }
  };

  const handleStartWorkoutPlan = (planToStart) => {
    if (!planToStart) return;
    navigate('/workout-session', { state: { workoutPlan: planToStart } });
  };

  const handleViewFullMealPlanner = () => {
    setMealPlanDialog(false);
    navigate('/meal-plan-generator');
  };

  const handleCloseMealPlanDialog = () => {
    setMealPlanDialog(false);
    setGeneratedMealPlan(null);
    setMealPlanError('');
  };

  // Loading state with modern skeleton
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ color: '#00D4FF', mb: 3 }} />
          <Typography variant="h6" sx={{ color: '#CBD5E1', fontFamily: '"Inter", sans-serif' }}>
            Loading your fitness dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  const userName = user?.full_name || user?.email?.split('@')[0] || 'Fitness Warrior';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Modern Hero Section */}
      <ModernCard 
        variant="feature" 
        elevation="high"
        sx={{ mb: 4, position: 'relative', overflow: 'hidden' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
              fontSize: '2rem',
              fontFamily: '"Gravitas One", "Montserrat", sans-serif',
              fontWeight: 400,
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                fontWeight: 400,
                fontSize: { xs: '1.8rem', sm: '2.5rem' },
                color: '#FFFFFF',
                lineHeight: 1.2,
                mb: 1,
              }}
            >
              Welcome back, {userName}!
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: '#CBD5E1',
                fontWeight: 500,
                fontSize: '1.125rem',
              }}
            >
              Ready to crush your fitness goals today? 💪
            </Typography>
            
            {(!user?.fitness_goal || !user?.experience_level) && (
              <Alert
                severity="info"
                action={
                  <SecondaryButton
                    size="small"
                    onClick={() => navigate('/profile')}
                  >
                    Complete Profile
                  </SecondaryButton>
                }
                sx={{
                  mt: 2,
                  background: 'rgba(0, 212, 255, 0.1)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  '& .MuiAlert-message': { color: '#FFFFFF' },
                }}
              >
                Complete your profile to unlock personalized AI recommendations!
              </Alert>
            )}
          </Box>
        </Box>
      </ModernCard>

      {/* Modern Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loading || !stats ? (
          [...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <ModernCard variant="stat">
                <Skeleton variant="circular" width={48} height={48} sx={{ mb: 1 }} />
                <Skeleton width="60%" height={32} sx={{ mb: 1 }} />
                <Skeleton width="80%" height={20} />
              </ModernCard>
            </Grid>
          ))
        ) : (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<LocalFireDepartment />}
                value={stats.total_calories_burned.toLocaleString()}
                label="Calories Burned (Today)"
                change={stats.calories_change_percent > 0 ? `+${stats.calories_change_percent.toFixed(0)}%` : `${stats.calories_change_percent.toFixed(0)}%`}
                changeColor={stats.calories_change_percent > 0 ? '#10B981' : '#EF4444'}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Timer />}
                value={`${stats.total_workout_time_hours}h`}
                label="Workout Time (Today)"
                change={stats.time_change_percent > 0 ? `+${stats.time_change_percent.toFixed(0)}%` : `${stats.time_change_percent.toFixed(0)}%`}
                changeColor={stats.time_change_percent > 0 ? '#10B981' : '#EF4444'}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<EmojiEvents />}
                value={stats.workouts_completed}
                label="Total Workouts"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<TrendingUp />}
                value={`Level ${stats.level_progress.current_level}`}
                label="Fitness Level"
              />
            </Grid>
          </>
        )}
      </Grid>
      
      <Box sx={{ textAlign: 'center', mt: 2, mb: 3 }}>
        <PrimaryButton onClick={() => navigate('/achievements')} size="large">
          View Achievements
        </PrimaryButton>
      </Box>

      {/* Modern Quick Actions */}
      <Typography
        variant="h4"
        sx={{
          fontFamily: '"Gravitas One", "Montserrat", sans-serif',
          fontWeight: 400,
          fontSize: '1.75rem',
          color: '#FFFFFF',
          mb: 3,
        }}
      >
        Quick Actions ⚡
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <QuickActionCard
            icon={<AutoAwesome />}
            title="AI Workout Generator"
            description="Generate personalized workouts powered by advanced AI, tailored to your goals and fitness level."
            onClick={handleGenerateWorkout}
            gradient="linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <QuickActionCard
            icon={<Create />}
            title="Freestyle Logger"
            description="Manually log your workouts with custom exercises, sets, and reps tracking."
            onClick={() => navigate('/log-workout')}
            gradient="linear-gradient(135deg, #FF3366 0%, #FF6B35 100%)"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <QuickActionCard
            icon={<Restaurant />}
            title="AI Meal Planner"
            description="Get personalized meal plans that complement your fitness journey and dietary preferences."
            onClick={handleGenerateMealPlan}
            gradient="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
            sx={{ opacity: mealPlanLoading ? 0.7 : 1 }}
          />

          {mealPlanError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {mealPlanError}
            </Alert>
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <QuickActionCard
            icon={<PlayArrow />}
            title="AI Recommendations"
            description="Get smart workout suggestions based on your progress and fitness goals."
            onClick={() => navigate('/workout-recommendations')}
            gradient="linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <QuickActionCard
            icon={<TrendingUp />}
            title="View Analytics"
            description="Track your progress with detailed insights and performance charts."
            onClick={() => navigate('/analytics')}
            gradient="linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <QuickActionCard
            icon={<CheckCircle />}
            title="Exercise Library"
            description="Browse our comprehensive exercise library with detailed instructions and demos."
            onClick={() => navigate('/exercises')}
            gradient="linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)"
          />
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={4}>
        {/* Modern Workout Plans */}
        <Grid item xs={12} md={6}>
          <ModernCard
            title="Your Workout Plans 🏋️‍♀️"
            headerAction={
              <SecondaryButton
                size="small"
                endIcon={<NavigateNext />}
                onClick={() => navigate('/workouts')}
              >
                View All
              </SecondaryButton>
            }
            variant="glass"
          >
            {workoutPlans.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ color: '#CBD5E1', mb: 1 }}>
                  No workout plans yet
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
                  Generate your first AI-powered workout to get started!
                </Typography>
                <PrimaryButton
                  onClick={handleGenerateWorkout}
                  startIcon={<AutoAwesome />}
                >
                  Create First Workout
                </PrimaryButton>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {workoutPlans.map((plan, index) => (
                  <React.Fragment key={plan.id}>
                    <ListItem
                      sx={{
                        px: 0,
                        py: 2,
                        cursor: 'pointer',
                        borderRadius: '8px',
                        '&:hover': {
                          background: 'rgba(0, 212, 255, 0.05)',
                        }
                      }}
                      onClick={() => navigate(`/workout-plan/${plan.id}`)}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                                fontWeight: 400,
                                fontSize: '1rem',
                                color: '#FFFFFF',
                              }}
                            >
                              {plan.name}
                            </Typography>
                            {plan.ai_generated && (
                              <AIModelBadge
                                aiModel={plan.ai_model}
                                aiGenerated={plan.ai_generated}
                                size="small"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{ color: '#94A3B8', lineHeight: 1.4 }}
                          >
                            {plan.description}
                          </Typography>
                        }
                      />
                      <PrimaryButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartWorkoutPlan(plan);
                        }}
                        startIcon={<PlayArrow />}
                      >
                        Start
                      </PrimaryButton>
                    </ListItem>
                    {index < workoutPlans.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </ModernCard>
        </Grid>

        {/* Modern Recent Activity */}
        <Grid item xs={12} md={6}>
          <ModernCard
            title="Recent Activity 📊"
            variant="glass"
          >
            {recentWorkouts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ color: '#CBD5E1', mb: 1 }}>
                  No recent workouts
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Complete your first workout!
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {recentWorkouts.map((workout, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: '#FFFFFF',
                              mb: 0.5,
                            }}
                          >
                            {new Date(workout.workout_date).toLocaleDateString()}
                          </Typography>
                        }
                        secondary={
                          <Stack spacing={0.5}>
                            <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                              Duration: {workout.duration_minutes || 'N/A'} min
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                              Exercises: {Array.isArray(workout.exercises_completed) ? workout.exercises_completed.length : (typeof workout.exercises_completed === 'number' ? workout.exercises_completed : 0)}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                    {index < recentWorkouts.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </ModernCard>

          {/* Modern Fitness Profile Card */}
          <ModernCard
            title="Your Fitness Profile 👤"
            variant="default"
            sx={{ mt: 3 }}
          >
            <Stack spacing={2}>
              {user?.weight && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#CBD5E1' }}>Weight:</Typography>
                  <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                    {convertWeight(user.weight)} {getUnitLabel('weight')}
                  </Typography>
                </Box>
              )}
              
              {user?.height && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#CBD5E1' }}>Height:</Typography>
                  <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                    {convertHeight(user.height)}
                  </Typography>
                </Box>
              )}
              
              <SecondaryButton
                fullWidth
                onClick={() => navigate('/profile')}
                startIcon={<CheckCircle />}
                sx={{ mt: 2 }}
              >
                Update Profile
              </SecondaryButton>
            </Stack>
          </ModernCard>
        </Grid>
      </Grid>

      {/* Meal Plan Dialog (preserved functionality) */}
      <Dialog
        open={mealPlanDialog}
        onClose={handleCloseMealPlanDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(26, 31, 46, 0.95)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
          }
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: '"Gravitas One", "Montserrat", sans-serif',
            fontWeight: 400,
            color: '#FFFFFF',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          AI Generated Meal Plan
          <IconButton
            onClick={handleCloseMealPlanDialog}
            sx={{ position: 'absolute', right: 8, top: 8, color: '#94A3B8' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {generatedMealPlan && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                    color: '#FFFFFF',
                  }}
                >
                  {generatedMealPlan.name}
                </Typography>
                {generatedMealPlan.ai_generated && (
                  <AIModelBadge
                    aiModel={generatedMealPlan.ai_model}
                    aiGenerated={generatedMealPlan.ai_generated}
                  />
                )}
              </Box>
              
              <List>
                {Object.entries(generatedMealPlan.meals || {}).map(([mealType, meal]) => (
                  <ListItem key={mealType} sx={{ px: 0 }}>
                    <ListItemText
                      primary={`${mealType}: ${meal.name}`}
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 1 }}>
                            {meal.instructions}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                            Ingredients: {meal.ingredients?.join(', ')}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <SecondaryButton onClick={handleCloseMealPlanDialog}>
            Close
          </SecondaryButton>
          <PrimaryButton onClick={handleViewFullMealPlanner}>
            View Full Meal Planner
          </PrimaryButton>
        </DialogActions>
      </Dialog>
      <ContextualHelp page="dashboard" />
    </Container>
  );
}

export default Dashboard;