// src/pages/Dashboard.js - Modern Redesigned Version

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  Chip,
  Paper,
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
  LinearProgress,
  Avatar,
  Stack,
} from '@mui/material';
import {
  FitnessCenter,
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
  Bolt,
  Insights,
  NavigateNext,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

// Custom styled components
const GlowingCard = ({ children, gradient, ...props }) => (
  <Card 
    {...props}
    sx={{
      position: 'relative',
      overflow: 'hidden',
      background: 'rgba(26, 31, 46, 0.8)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 3,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: `0 20px 60px ${gradient ? 'rgba(0, 212, 255, 0.2)' : 'rgba(0, 0, 0, 0.4)'}`,
        borderColor: 'rgba(0, 212, 255, 0.3)',
      },
      '&::before': gradient ? {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #00D4FF, #7C3AED)',
      } : {},
      ...props.sx
    }}
  >
    {children}
  </Card>
);

const GradientButton = ({ children, variant = 'primary', ...props }) => {
  const gradients = {
    primary: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
    secondary: 'linear-gradient(135deg, #FF3366 0%, #FF6B35 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
  };

  return (
    <Button
      {...props}
      sx={{
        background: gradients[variant],
        borderRadius: 2.5,
        padding: '14px 28px',
        fontWeight: 600,
        fontSize: '0.95rem',
        textTransform: 'none',
        boxShadow: `0 4px 20px ${variant === 'primary' ? 'rgba(0, 212, 255, 0.3)' : 'rgba(255, 51, 102, 0.3)'}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 30px ${variant === 'primary' ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255, 51, 102, 0.4)'}`,
          filter: 'brightness(1.1)',
        },
        ...props.sx
      }}
    >
      {children}
    </Button>
  );
};

const StatCard = ({ icon, value, label, change, color = '#00D4FF' }) => (
  <Paper sx={{ 
    p: 2.5, 
    background: 'rgba(37, 42, 61, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    textAlign: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      borderColor: color,
      boxShadow: `0 8px 25px ${color}20`
    }
  }}>
    <Box sx={{ mb: 1.5, color }}>
      {icon}
    </Box>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {label}
    </Typography>
    {change && (
      <Chip 
        label={change} 
        size="small"
        sx={{ 
          background: change.startsWith('+') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          color: change.startsWith('+') ? '#10B981' : '#EF4444',
          border: 'none',
          fontSize: '0.7rem'
        }}
      />
    )}
  </Paper>
);

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Meal plan generation states
  const [mealPlanLoading, setMealPlanLoading] = useState(false);
  const [mealPlanDialog, setMealPlanDialog] = useState(false);
  const [generatedMealPlan, setGeneratedMealPlan] = useState(null);
  const [mealPlanError, setMealPlanError] = useState('');

  // Simple inline AI badge component
  const SimpleAIBadge = ({ aiModel, aiGenerated }) => {
    if (!aiGenerated || !aiModel) {
      return (
        <Chip 
          label="Rule-based" 
          size="small" 
          sx={{ 
            background: 'rgba(148, 163, 184, 0.2)',
            color: '#94A3B8',
            border: '1px solid rgba(148, 163, 184, 0.3)'
          }}
        />
      );
    }
    return (
      <Chip 
        label={aiModel.includes('Groq') ? 'Groq AI ⚡' : aiModel.includes('OpenRouter') ? 'OpenRouter AI 🚀' : 'AI Generated 🤖'} 
        size="small" 
        sx={{
          background: 'linear-gradient(45deg, #7C3AED, #00D4FF)',
          color: 'white',
          fontWeight: 600,
          border: 'none'
        }}
      />
    );
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [workoutLogsData, workoutPlansData] = await Promise.all([
        apiService.getWorkoutLogs(),
        apiService.getWorkoutPlans(),
      ]);
      setRecentWorkouts(workoutLogsData.slice(0, 3));
      setWorkoutPlans(workoutPlansData.slice(0, 3));
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

      const mealPlan = await apiService.generateMealPlan(requestData);
      setGeneratedMealPlan(mealPlan);
      setMealPlanDialog(true);
    } catch (error) {
      setMealPlanError(error.message || 'Failed to generate meal plan. Please try again.');
    } finally {
      setMealPlanLoading(false);
    }
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

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 100%)'
      }}>
        <Box textAlign="center">
          <CircularProgress 
            size={60} 
            sx={{ 
              color: '#00D4FF',
              mb: 3,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} 
          />
          <Typography variant="h6" sx={{ color: '#CBD5E1' }}>
            Loading your fitness dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  const userName = user?.full_name || user?.email?.split('@')[0] || 'Fitness Warrior';

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 50%, #252A3D 100%)',
      pt: 4,
      pb: 6
    }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box sx={{ mb: 6 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar sx={{ 
              width: 56, 
              height: 56, 
              background: 'linear-gradient(45deg, #00D4FF, #7C3AED)',
              fontSize: '1.5rem',
              fontWeight: 700
            }}>
              {userName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 800, 
                background: 'linear-gradient(45deg, #00D4FF, #FFFFFF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5
              }}>
                Welcome back, {userName}! 
              </Typography>
              <Typography variant="body1" sx={{ color: '#94A3B8' }}>
                Ready to crush your fitness goals today? 💪
              </Typography>
            </Box>
          </Box>

          {(!user?.fitness_goal || !user?.experience_level) && (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3,
                background: 'rgba(0, 212, 255, 0.1)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: 2,
                '& .MuiAlert-icon': { color: '#00D4FF' }
              }}
              action={
                <Button 
                  onClick={() => navigate('/profile')} 
                  size="small" 
                  variant="outlined"
                  sx={{ borderColor: '#00D4FF', color: '#00D4FF' }}
                >
                  Complete Profile
                </Button>
              }
            >
              Complete your profile to unlock personalized AI recommendations!
            </Alert>
          )}
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <StatCard
              icon={<LocalFireDepartment sx={{ fontSize: 32 }} />}
              value="1,247"
              label="Calories Burned"
              change="+12%"
              color="#FF3366"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard
              icon={<Timer sx={{ fontSize: 32 }} />}
              value="47h"
              label="Total Workout Time"
              change="+8%"
              color="#00D4FF"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard
              icon={<EmojiEvents sx={{ fontSize: 32 }} />}
              value="23"
              label="Workouts Completed"
              change="+15%"
              color="#10B981"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard
              icon={<TrendingUp sx={{ fontSize: 32 }} />}
              value="Level 7"
              label="Fitness Level"
              change="+1"
              color="#7C3AED"
            />
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            mb: 3,
            background: 'linear-gradient(45deg, #FFFFFF, #CBD5E1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Quick Actions ⚡
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <GlowingCard gradient>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      background: 'linear-gradient(45deg, #00D4FF, #7C3AED)',
                      mr: 2 
                    }}>
                      <AutoAwesome sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        AI Workout Generator
                      </Typography>
                      <Chip label="Powered by AI" size="small" sx={{ 
                        background: 'rgba(124, 58, 237, 0.2)',
                        color: '#7C3AED',
                        fontWeight: 600
                      }} />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    Generate personalized workouts powered by advanced AI, tailored to your goals and fitness level.
                  </Typography>
                  <GradientButton
                    onClick={handleGenerateWorkout}
                    fullWidth
                    startIcon={<Bolt />}
                  >
                    Generate Workout
                  </GradientButton>
                </CardContent>
              </GlowingCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <GlowingCard>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      background: 'linear-gradient(45deg, #FF3366, #FF6B35)',
                      mr: 2 
                    }}>
                      <Create sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Freestyle Logger
                      </Typography>
                      <Chip label="Manual Entry" size="small" sx={{ 
                        background: 'rgba(255, 51, 102, 0.2)',
                        color: '#FF3366',
                        fontWeight: 600
                      }} />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    Manually log your workouts with custom exercises, sets, and reps tracking.
                  </Typography>
                  <GradientButton
                    onClick={() => navigate('/log-workout')}
                    variant="secondary"
                    fullWidth
                    startIcon={<Create />}
                  >
                    Log Workout
                  </GradientButton>
                </CardContent>
              </GlowingCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <GlowingCard>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      background: 'linear-gradient(45deg, #10B981, #34D399)',
                      mr: 2 
                    }}>
                      <Restaurant sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        AI Meal Planner
                      </Typography>
                      <Chip label="Nutrition AI" size="small" sx={{ 
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10B981',
                        fontWeight: 600
                      }} />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    Get personalized meal plans that complement your fitness journey and dietary preferences.
                  </Typography>
                  <GradientButton
                    onClick={handleGenerateMealPlan}
                    variant="success"
                    fullWidth
                    startIcon={mealPlanLoading ? 
                      <CircularProgress size={20} sx={{ color: 'white' }} /> : 
                      <Restaurant />
                    }
                    disabled={mealPlanLoading}
                  >
                    {mealPlanLoading ? 'Generating...' : 'Generate Meal Plan'}
                  </GradientButton>
                  {mealPlanError && (
                    <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5 }}>
                      {mealPlanError}
                    </Alert>
                  )}
                </CardContent>
              </GlowingCard>
            </Grid>
          </Grid>
        </Box>

        {/* Content Grid */}
        <Grid container spacing={4}>
          {/* Workout Plans */}
          <Grid item xs={12} md={8}>
            <GlowingCard sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Your Workout Plans 🏋️‍♀️
                  </Typography>
                  <Button 
                    endIcon={<NavigateNext />}
                    onClick={() => navigate('/workouts')}
                    sx={{ color: '#00D4FF' }}
                  >
                    View All
                  </Button>
                </Box>

                {workoutPlans.length === 0 ? (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    background: 'rgba(37, 42, 61, 0.3)',
                    borderRadius: 2,
                    border: '1px dashed rgba(255, 255, 255, 0.1)'
                  }}>
                    <FitnessCenter sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      No workout plans yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Generate your first AI-powered workout to get started!
                    </Typography>
                    <GradientButton onClick={handleGenerateWorkout} size="small">
                      Create First Workout
                    </GradientButton>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {workoutPlans.map((plan, index) => (
                      <Paper key={index} sx={{ 
                        p: 3, 
                        background: 'rgba(37, 42, 61, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'rgba(0, 212, 255, 0.3)',
                          transform: 'translateX(4px)'
                        }
                      }}>
                        <Box display="flex" alignItems="center" justifyContent="between" gap={2}>
                          <Box flex={1}>
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                              {plan.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {plan.description}
                            </Typography>
                            <Box display="flex" gap={1}>
                              {plan.ai_generated && (
                                <SimpleAIBadge 
                                  aiModel={plan.ai_model} 
                                  aiGenerated={plan.ai_generated} 
                                />
                              )}
                              <Chip label={`${plan.exercises?.length || 0} exercises`} size="small" />
                              <Chip label={`${plan.estimated_duration || 30} min`} size="small" />
                            </Box>
                          </Box>
                          <IconButton sx={{ color: '#00D4FF' }}>
                            <PlayArrow />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </GlowingCard>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={4}>
            <GlowingCard sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Recent Activity 📊
                </Typography>

                {recentWorkouts.length === 0 ? (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    background: 'rgba(37, 42, 61, 0.3)',
                    borderRadius: 2,
                    border: '1px dashed rgba(255, 255, 255, 0.1)'
                  }}>
                    <Insights sx={{ fontSize: 40, color: '#94A3B8', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      No recent workouts
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Complete your first workout!
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {recentWorkouts.map((workout, index) => (
                      <Paper key={index} sx={{ 
                        p: 2, 
                        background: 'rgba(37, 42, 61, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 1.5
                      }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          {new Date(workout.workout_date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Duration: {workout.duration_minutes || 'N/A'} min
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Exercises: {workout.exercises_completed?.length || 0}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={85} 
                          sx={{ mt: 1, height: 4 }}
                        />
                      </Paper>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </GlowingCard>
          </Grid>
        </Grid>

        {/* Fitness Profile */}
        <Box sx={{ mt: 6 }}>
          <GlowingCard>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Your Fitness Profile 👤
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={2}>
                  <Chip 
                    label={`Goal: ${user?.fitness_goal || 'Not set'}`} 
                    sx={{ width: '100%', justifyContent: 'center' }}
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Chip 
                    label={`Level: ${user?.experience_level || 'Not set'}`}
                    sx={{ width: '100%', justifyContent: 'center' }}
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Chip 
                    label={`Activity: ${user?.activity_level || 'Not set'}`}
                    sx={{ width: '100%', justifyContent: 'center' }}
                  />
                </Grid>
                {user?.weight && (
                  <Grid item xs={6} sm={4} md={2}>
                    <Chip 
                      label={`Weight: ${user.weight} kg`}
                      sx={{ width: '100%', justifyContent: 'center' }}
                    />
                  </Grid>
                )}
                {user?.height && (
                  <Grid item xs={6} sm={4} md={2}>
                    <Chip 
                      label={`Height: ${user.height} cm`}
                      sx={{ width: '100%', justifyContent: 'center' }}
                    />
                  </Grid>
                )}
              </Grid>
              <Button
                onClick={() => navigate('/profile')}
                variant="outlined"
                sx={{ mt: 3 }}
                startIcon={<Create />}
              >
                Update Profile
              </Button>
            </CardContent>
          </GlowingCard>
        </Box>

        {/* Meal Plan Dialog */}
        <Dialog 
          open={mealPlanDialog} 
          onClose={handleCloseMealPlanDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.95) 0%, rgba(37, 42, 61, 0.95) 100%)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
            }
          }}
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 1.5, 
                  background: 'linear-gradient(45deg, #10B981, #34D399)',
                  mr: 2 
                }}>
                  <Restaurant sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  AI Generated Meal Plan
                </Typography>
              </Box>
              <IconButton onClick={handleCloseMealPlanDialog}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent>
            {generatedMealPlan && (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {generatedMealPlan.name}
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip 
                      label={`${generatedMealPlan.target_calories} kcal`} 
                      sx={{ background: 'rgba(0, 212, 255, 0.2)', color: '#00D4FF' }}
                    />
                    <Chip 
                      label={`${generatedMealPlan.target_protein}g protein`} 
                      sx={{ background: 'rgba(255, 51, 102, 0.2)', color: '#FF3366' }}
                    />
                    {generatedMealPlan.ai_generated && (
                      <SimpleAIBadge 
                        aiModel={generatedMealPlan.ai_model} 
                        aiGenerated={generatedMealPlan.ai_generated} 
                      />
                    )}
                  </Box>
                </Box>

                <List>
                  {Object.entries(generatedMealPlan.meals || {}).map(([mealType, meal]) => (
                    <React.Fragment key={mealType}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ 
                              textTransform: 'capitalize', 
                              fontWeight: 600,
                              mb: 1 
                            }}>
                              {mealType}: {meal.name}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {meal.instructions}
                              </Typography>
                              <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                                <Chip label={`${meal.calories} kcal`} size="small" />
                                <Chip label={`${meal.protein}g protein`} size="small" />
                                <Chip label={`${meal.carbs}g carbs`} size="small" />
                                <Chip label={`${meal.fat}g fat`} size="small" />
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                <strong>Ingredients:</strong> {meal.ingredients?.join(', ')}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseMealPlanDialog} variant="outlined">
              Close
            </Button>
            <GradientButton 
              onClick={handleViewFullMealPlanner}
              variant="success"
            >
              View Full Meal Planner
            </GradientButton>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default Dashboard;
