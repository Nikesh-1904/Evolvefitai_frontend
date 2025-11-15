// src/pages/Dashboard.js - Refactored with Design System Components

import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Box,
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
import { usePreferences } from '../contexts/PreferencesContext';

// New Design System Imports
import { PageContainer, Section } from '../components/design-system';
import { Alert } from '../components/design-system';
import { LoadingSpinner } from '../components/design-system/Loading';
import { useDashboardOverview, useLoggedExercises } from '../hooks/useAnalytics';
import { useWorkoutPlans, useWorkoutLogs } from '../hooks/useWorkouts';
import { mealService } from '../services/api';

// Existing Components
import ModernCard, { StatCard, QuickActionCard } from '../components/ModernCard';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';
import AIModelBadge from '../components/AIModelBadge';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { convertWeight, convertHeight, getUnitLabel } = usePreferences();

  // Use new hooks for data fetching
  const { data: stats, loading: statsLoading } = useDashboardOverview();
  const { data: workoutPlans, loading: plansLoading } = useWorkoutPlans();
  const { data: workoutLogs, loading: logsLoading } = useWorkoutLogs(3);

  // Meal plan generation states
  const [mealPlanLoading, setMealPlanLoading] = useState(false);
  const [mealPlanDialog, setMealPlanDialog] = useState(false);
  const [generatedMealPlan, setGeneratedMealPlan] = useState(null);
  const [mealPlanError, setMealPlanError] = useState('');

  const loading = statsLoading || plansLoading || logsLoading;

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

  // Loading state
  if (loading) {
    return <LoadingSpinner fullScreen message="Loading your fitness dashboard..." />;
  }

  const userName = user?.full_name || user?.email?.split('@')[0] || 'Fitness Warrior';
  const recentWorkouts = workoutLogs?.slice(0, 3) || [];
  const recentPlans = workoutPlans?.slice(0, 3) || [];

  return (
    <PageContainer
      title={`Welcome back, ${userName}!`}
      subtitle="Ready to crush your fitness goals today? 💪"
      maxWidth="lg"
    >
      {/* Profile Completion Alert */}
      {(!user?.fitness_goal || !user?.experience_level) && (
        <Alert
          severity="info"
          closable
          title="Complete Your Profile"
          sx={{ mb: 4 }}
        >
          To get the most personalized AI workout plans, please complete your profile settings.
          <Box sx={{ mt: 1 }}>
            <SecondaryButton
              size="small"
              onClick={() => navigate('/profile')}
              sx={{ mt: 1 }}
            >
              Complete Profile
            </SecondaryButton>
          </Box>
        </Alert>
      )}

      {/* Stats Section */}
      <Section title="Your Stats" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard
              icon={<EmojiEvents />}
              label="Total Workouts"
              value={stats?.total_workouts || 0}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard
              icon={<LocalFireDepartment />}
              label="Current Streak"
              value={`${stats?.current_streak || 0} days`}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard
              icon={<Timer />}
              label="Total Minutes"
              value={stats?.total_minutes || 0}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard
              icon={<TrendingUp />}
              label="This Week"
              value={stats?.workouts_this_week || 0}
            />
          </Grid>
        </Grid>
      </Section>

      {/* Quick Actions Section */}
      <Section title="Quick Actions" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <QuickActionCard
              icon={<AutoAwesome />}
              title="Generate Workout"
              description="Create a personalized AI workout plan"
              onClick={handleGenerateWorkout}
              gradient="linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <QuickActionCard
              icon={<Restaurant />}
              title="Meal Plan"
              description="Get AI-powered meal suggestions"
              onClick={handleGenerateMealPlan}
              gradient="linear-gradient(135deg, #FF3366 0%, #FF6B35 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <QuickActionCard
              icon={<TrendingUp />}
              title="View Analytics"
              description="Track your progress over time"
              onClick={() => navigate('/analytics')}
              gradient="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
            />
          </Grid>
        </Grid>
      </Section>

      {/* Recent Workout Plans Section */}
      <Section
        title="Recent Workout Plans"
        actions={
          <SecondaryButton
            size="small"
            endIcon={<NavigateNext />}
            onClick={() => navigate('/workout-history')}
          >
            View All
          </SecondaryButton>
        }
        sx={{ mb: 4 }}
      >
        {recentPlans.length === 0 ? (
          <ModernCard variant="glass">
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                No workout plans yet. Generate your first AI-powered workout!
              </Typography>
              <PrimaryButton
                startIcon={<AutoAwesome />}
                onClick={handleGenerateWorkout}
              >
                Generate Workout
              </PrimaryButton>
            </Box>
          </ModernCard>
        ) : (
          <Grid container spacing={3}>
            {recentPlans.map((plan) => (
              <Grid item xs={12} md={4} key={plan.id}>
                <ModernCard
                  title={plan.name || `${plan.difficulty} Workout`}
                  subtitle={`${plan.focus_area} • ${plan.duration} min`}
                  variant="default"
                  hover
                  cardActions={
                    <PrimaryButton
                      size="small"
                      startIcon={<PlayArrow />}
                      onClick={() => handleStartWorkoutPlan(plan)}
                    >
                      Start Workout
                    </PrimaryButton>
                  }
                >
                  <Typography variant="body2" color="text.secondary">
                    {plan.exercises?.length || 0} exercises
                  </Typography>
                </ModernCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Section>

      {/* Recent Activity Section */}
      <Section title="Recent Activity">
        <ModernCard variant="default">
          {recentWorkouts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No recent workouts. Start your first workout today!
              </Typography>
            </Box>
          ) : (
            <List>
              {recentWorkouts.map((workout, index) => (
                <React.Fragment key={workout.id}>
                  <ListItem
                    sx={{
                      px: 0,
                      '&:hover': {
                        bgcolor: 'action.hover',
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {workout.workout_plan_name || 'Workout Session'}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {new Date(workout.logged_at).toLocaleDateString()} •{' '}
                          {workout.duration_minutes} min •{' '}
                          {workout.exercises_completed} exercises
                        </Typography>
                      }
                    />
                    <CheckCircle sx={{ color: 'success.main', ml: 2 }} />
                  </ListItem>
                  {index < recentWorkouts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </ModernCard>
      </Section>

      {/* Meal Plan Dialog */}
      <Dialog
        open={mealPlanDialog}
        onClose={handleCloseMealPlanDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Your AI Meal Plan</Typography>
          <IconButton onClick={handleCloseMealPlanDialog}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {mealPlanLoading ? (
            <LoadingSpinner message="Generating your personalized meal plan..." />
          ) : mealPlanError ? (
            <Alert severity="error" closable>
              {mealPlanError}
            </Alert>
          ) : generatedMealPlan ? (
            <Box>
              {generatedMealPlan.meals?.map((meal, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {meal.meal_type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {meal.calories} cal • {meal.protein}g protein • {meal.carbs}g carbs •{' '}
                    {meal.fat}g fat
                  </Typography>
                  <Typography variant="body1">{meal.description}</Typography>
                  {index < generatedMealPlan.meals.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={handleCloseMealPlanDialog}>
            Close
          </SecondaryButton>
          <PrimaryButton onClick={handleViewFullMealPlanner}>
            Customize Meal Plan
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}

export default Dashboard;
