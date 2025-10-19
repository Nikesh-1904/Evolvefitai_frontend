// src/pages/WorkoutHistory.js - Modern AI Fitness Workout History & Progress Tracking

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Stack,
  Avatar,
  Skeleton,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Fade,
  Slide,
  Zoom,
  Divider,
} from '@mui/material';
import {
  CalendarToday,
  Timer,
  FitnessCenter,
  TrendingUp,
  AutoAwesome,
  PlayArrow,
  History,
  EmojiEvents,
  LocalFireDepartment,
  Speed,
  Assessment,
  Close,
  Visibility,
  MonitorWeight,
  DirectionsRun,
  SelfImprovement,
} from '@mui/icons-material';
import apiService from '../services/apiService';
import AIModelBadge from '../components/AIModelBadge';

// Import our modern components
import ModernCard, { StatCard } from '../components/ModernCard';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';
import ContextualHelp from '../components/ContextualHelp';

function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`history-tabpanel-${index}`}
      aria-labelledby={`history-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function WorkoutHistory() {
  // State management (preserving all original functionality)
  const [workouts, setWorkouts] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadWorkoutHistory();
  }, []);

  const loadWorkoutHistory = async () => {
    try {
      const [workoutLogs, plans] = await Promise.all([
        apiService.getWorkoutLogs(),
        apiService.getWorkoutPlans(),
      ]);
      setWorkouts(workoutLogs);
      setWorkoutPlans(plans);
    } catch (error) {
      console.error('Failed to load workout history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout);
  };

  const handleCloseDialog = () => {
    setSelectedWorkout(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get exercise type info
  const getExerciseTypeInfo = (exerciseType) => {
    switch (exerciseType) {
      case 'WEIGHT_BASED':
        return { icon: <MonitorWeight />, color: '#00D4FF', label: 'Weight Based' };
      case 'REPS_ONLY':
        return { icon: <FitnessCenter />, color: '#10B981', label: 'Reps Only' };
      case 'DURATION':
        return { icon: <Timer />, color: '#7C3AED', label: 'Duration' };
      case 'DISTANCE_DURATION':
        return { icon: <DirectionsRun />, color: '#FF3366', label: 'Distance + Time' };
      case 'QUALITATIVE':
        return { icon: <SelfImprovement />, color: '#F59E0B', label: 'Qualitative' };
      default:
        return { icon: <FitnessCenter />, color: '#94A3B8', label: 'Exercise' };
    }
  };

  const formatSetDisplay = (set, exerciseType) => {
    switch (exerciseType) {
      case 'WEIGHT_BASED':
        return `${set.weight}kg × ${set.reps}`;
      case 'REPS_ONLY':
        return `${set.reps} reps`;
      case 'DURATION':
        return `${set.duration_seconds}s`;
      case 'DISTANCE_DURATION':
        return `${set.distance_km}km in ${set.duration_seconds}s`;
      case 'QUALITATIVE':
        return set.notes || `${set.duration_seconds}s`;
      default:
        return `${set.weight || 0}kg × ${set.reps || 0}`;
    }
  };

  // Calculate stats
  const totalHours = Math.round(workouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0) / 60);
  const aiGeneratedCount = workoutPlans.filter(p => p.ai_generated).length;
  const thisWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.workout_date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  }).length;

  // Sort workouts by date (most recent first)
  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(b.workout_date) - new Date(a.workout_date)
  );

  // Sort plans by creation date (most recent first)
  const sortedPlans = [...workoutPlans].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0F1419 0%, #1A202C 50%, #2D3748 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" height={200} sx={{ mb: 4, borderRadius: '16px' }} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '16px' }} />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '16px' }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F1419 0%, #1A202C 50%, #2D3748 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Fade in timeout={500}>
          <Box>
            <ModernCard
              variant="feature"
              elevation="high"
              sx={{ mb: 4, position: 'relative', overflow: 'hidden' }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '2.5rem',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  📈
                </Box>
                
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
                  Your Fitness Journey
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: '#CBD5E1',
                    fontWeight: 500,
                    fontSize: '1.125rem',
                    maxWidth: '600px',
                    mx: 'auto',
                  }}
                >
                  Track your progress, review your workouts, and celebrate your achievements
                </Typography>
              </Box>
            </ModernCard>
          </Box>
        </Fade>

        {/* Summary Stats */}
        <Zoom in timeout={700}>
          <Box>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={6} md={3}>
                <StatCard
                  icon={<FitnessCenter />}
                  value={workouts.length}
                  label="Total Workouts"
                  variant="stat"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 212, 255, 0.05) 100%)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                  }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatCard
                  icon={<Assessment />}
                  value={workoutPlans.length}
                  label="Workout Plans"
                  variant="stat"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatCard
                  icon={<Timer />}
                  value={`${totalHours}h`}
                  label="Total Time"
                  variant="stat"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                  }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatCard
                  icon={<AutoAwesome />}
                  value={aiGeneratedCount}
                  label="AI Generated"
                  variant="stat"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(255, 51, 102, 0.1) 0%, rgba(255, 51, 102, 0.05) 100%)',
                    border: '1px solid rgba(255, 51, 102, 0.2)',
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Zoom>

        {/* Navigation Tabs */}
        <Fade in timeout={900}>
          <Box>
            <ModernCard variant="glass" sx={{ mb: 4 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                    height: 3,
                    borderRadius: '3px',
                  },
                  '& .MuiTab-root': {
                    color: '#94A3B8',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    minWidth: 120,
                    '&.Mui-selected': {
                      color: '#FFFFFF',
                    },
                  },
                }}
              >
                <Tab
                  icon={<History />}
                  label="Workout History"
                  iconPosition="start"
                  sx={{ gap: 1 }}
                />
                <Tab
                  icon={<Assessment />}
                  label="My Plans"
                  iconPosition="start"
                  sx={{ gap: 1 }}
                />
              </Tabs>
            </ModernCard>
          </Box>
        </Fade>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {/* Completed Workouts */}
          <Slide direction="right" in timeout={1100}>
            <Box>
              <ModernCard
                title="🏋️ Completed Workouts"
                subtitle={`${workouts.length} total sessions • ${thisWeekWorkouts} this week`}
                variant="glass"
                sx={{ mb: 3 }}
              >
                {sortedWorkouts.length === 0 ? (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    color: '#94A3B8',
                  }}>
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '30px',
                        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#00D4FF',
                        fontSize: '3rem',
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      <FitnessCenter sx={{ fontSize: '3rem' }} />
                    </Box>
                    
                    <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 1 }}>
                      No workouts completed yet
                    </Typography>
                    
                    <Typography variant="body1" sx={{ color: '#94A3B8', mb: 3 }}>
                      Start your fitness journey today and track your progress here
                    </Typography>

                    <PrimaryButton
                      onClick={() => window.location.href = '/freestyle-log'}
                      startIcon={<PlayArrow />}
                    >
                      Log Your First Workout
                    </PrimaryButton>
                  </Box>
                ) : (
                  <Stack spacing={3}>
                    {sortedWorkouts.map((workout, index) => (
                      <Box
                        key={index}
                        onClick={() => handleWorkoutClick(workout)}
                        sx={{
                          p: 3,
                          borderRadius: '16px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            background: 'rgba(255, 255, 255, 0.08)',
                            borderColor: 'rgba(0, 212, 255, 0.3)',
                            boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2)',
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                              }}
                            >
                              <CalendarToday />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: '#FFFFFF',
                                  fontWeight: 600,
                                  mb: 0.5,
                                }}
                              >
                                {new Date(workout.workout_date).toLocaleDateString('en', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                {new Date(workout.workout_date).toLocaleTimeString('en', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Typography>
                            </Box>
                          </Box>

                          <IconButton
                            sx={{
                              color: '#00D4FF',
                              '&:hover': {
                                background: 'rgba(0, 212, 255, 0.1)',
                              }
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </Box>

                        {/* Workout Stats */}
                        <Stack direction="row" spacing={1} sx={{ mb: workout.notes ? 2 : 0, flexWrap: 'wrap', gap: 1 }}>
                          {workout.duration_minutes && (
                            <Chip
                              icon={<Timer />}
                              label={`${workout.duration_minutes} min`}
                              size="small"
                              sx={{ 
                                background: 'rgba(124, 58, 237, 0.2)',
                                color: '#7C3AED',
                                fontWeight: 500,
                              }}
                            />
                          )}
                          
                          <Chip
                            icon={<FitnessCenter />}
                            label={`${workout.exercises_completed?.length || 0} exercises`}
                            size="small"
                            sx={{ 
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#10B981',
                              fontWeight: 500,
                            }}
                          />

                          {workout.exercises_completed && (
                            <Chip
                              icon={<Speed />}
                              label={`${workout.exercises_completed.reduce((sum, ex) => sum + (ex.sets?.length || 0), 0)} sets`}
                              size="small"
                              sx={{ 
                                background: 'rgba(0, 212, 255, 0.2)',
                                color: '#00D4FF',
                                fontWeight: 500,
                              }}
                            />
                          )}
                        </Stack>

                        {/* Workout Notes */}
                        {workout.notes && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#CBD5E1',
                              fontStyle: 'italic',
                              background: 'rgba(255, 255, 255, 0.03)',
                              p: 2,
                              borderRadius: '8px',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                            }}
                          >
                            "{workout.notes}"
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Stack>
                )}
              </ModernCard>
            </Box>
          </Slide>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Workout Plans */}
          <Slide direction="left" in timeout={1100}>
            <Box>
              <ModernCard
                title="📋 Your Workout Plans"
                subtitle={`${workoutPlans.length} total plans • ${aiGeneratedCount} AI-generated`}
                variant="glass"
                sx={{ mb: 3 }}
              >
                {sortedPlans.length === 0 ? (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    color: '#94A3B8',
                  }}>
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '30px',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#10B981',
                        fontSize: '3rem',
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      <Assessment sx={{ fontSize: '3rem' }} />
                    </Box>
                    
                    <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 1 }}>
                      No workout plans yet
                    </Typography>
                    
                    <Typography variant="body1" sx={{ color: '#94A3B8', mb: 3 }}>
                      Generate your first AI-powered workout plan to get started
                    </Typography>

                    <PrimaryButton
                      onClick={() => window.location.href = '/workout-generator'}
                      startIcon={<AutoAwesome />}
                    >
                      Generate AI Workout
                    </PrimaryButton>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {sortedPlans.map((plan, index) => (
                      <Grid item xs={12} sm={6} lg={4} key={index}>
                        <ModernCard
                          variant="glass"
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 12px 40px rgba(0, 212, 255, 0.3)',
                            }
                          }}
                          onClick={() => window.location.href = `/workout-plan/${plan.id}`}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                background: plan.ai_generated 
                                  ? 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)'
                                  : 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                              }}
                            >
                              {plan.ai_generated ? <AutoAwesome /> : <Assessment />}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                                  fontWeight: 400,
                                  color: '#FFFFFF',
                                  mb: 0.5,
                                  fontSize: '1.125rem',
                                }}
                              >
                                {plan.name}
                              </Typography>
                              {plan.ai_generated && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                  <AIModelBadge />
                                </Box>
                              )}
                            </Box>
                          </Box>

                          {plan.description && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#CBD5E1',
                                mb: 3,
                                lineHeight: 1.6,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {plan.description}
                            </Typography>
                          )}

                          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                            <Chip
                              icon={<Timer />}
                              label={`${plan.estimated_duration || 45} min`}
                              size="small"
                              sx={{ 
                                background: 'rgba(0, 212, 255, 0.2)',
                                color: '#00D4FF',
                                fontWeight: 500,
                              }}
                            />
                            
                            <Chip
                              icon={<FitnessCenter />}
                              label={`${plan.exercises?.length || 0} exercises`}
                              size="small"
                              sx={{ 
                                background: 'rgba(16, 185, 129, 0.2)',
                                color: '#10B981',
                                fontWeight: 500,
                              }}
                            />
                          </Stack>

                          <Box sx={{ pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                              Created: {new Date(plan.created_at).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </ModernCard>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </ModernCard>
            </Box>
          </Slide>
        </TabPanel>

        {/* Workout Detail Dialog */}
        {selectedWorkout && (
          <Dialog
            open={!!selectedWorkout}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="md"
            PaperProps={{
              sx: {
                background: 'rgba(26, 31, 46, 0.95)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                maxHeight: '80vh',
              }
            }}
          >
            <DialogTitle
              sx={{
                fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                fontWeight: 400,
                color: '#FFFFFF',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  width: 48, 
                  height: 48,
                  background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                }}>
                  <CalendarToday />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: 'inherit', fontWeight: 'inherit' }}>
                    Workout Details
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                    {new Date(selectedWorkout.workout_date).toLocaleDateString('en', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={handleCloseDialog} sx={{ color: '#94A3B8' }}>
                <Close />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
              {/* Workout Summary */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, borderRadius: '12px', background: 'rgba(124, 58, 237, 0.1)' }}>
                    <Timer sx={{ color: '#7C3AED', fontSize: '2rem', mb: 1 }} />
                    <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                      {selectedWorkout.duration_minutes || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7C3AED' }}>
                      Minutes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)' }}>
                    <FitnessCenter sx={{ color: '#10B981', fontSize: '2rem', mb: 1 }} />
                    <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                      {selectedWorkout.exercises_completed?.length || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#10B981' }}>
                      Exercises
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Exercise Details */}
              {selectedWorkout.exercises_completed && selectedWorkout.exercises_completed.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      mb: 3,
                    }}
                  >
                    Exercises Completed
                  </Typography>
                  
                  <Stack spacing={2}>
                    {selectedWorkout.exercises_completed.map((exercise, index) => {
                      const typeInfo = getExerciseTypeInfo(exercise.exercise_type);
                      
                      return (
                        <Box
                          key={index}
                          sx={{
                            p: 3,
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar sx={{ 
                              width: 40, 
                              height: 40,
                              background: `${typeInfo.color}20`,
                              border: `2px solid ${typeInfo.color}40`,
                            }}>
                              {React.cloneElement(typeInfo.icon, { sx: { color: typeInfo.color, fontSize: '1.25rem' } })}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                                {exercise.name || `Exercise ${index + 1}`}
                              </Typography>
                              <Typography variant="body2" sx={{ color: typeInfo.color }}>
                                {typeInfo.label}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Sets Display */}
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {exercise.sets?.map((set, setIndex) => (
                              <Chip
                                key={setIndex}
                                label={`Set ${setIndex + 1}: ${formatSetDisplay(set, exercise.exercise_type)}`}
                                size="small"
                                sx={{
                                  background: `${typeInfo.color}20`,
                                  color: typeInfo.color,
                                  fontWeight: 500,
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              )}

              {/* Workout Notes */}
              {selectedWorkout.notes && (
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      mb: 2,
                    }}
                  >
                    Session Notes
                  </Typography>
                  
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: '12px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#CBD5E1',
                        fontStyle: 'italic',
                        lineHeight: 1.6,
                      }}
                    >
                      "{selectedWorkout.notes}"
                    </Typography>
                  </Box>
                </Box>
              )}
            </DialogContent>
            
            <DialogActions sx={{ p: 3 }}>
              <SecondaryButton onClick={handleCloseDialog}>
                Close
              </SecondaryButton>
            </DialogActions>
          </Dialog>
        )}

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
            🏆 Keep up the great work on your fitness journey!
          </Typography>
          <Typography variant="caption" sx={{ color: '#6B7280' }}>
            Every workout brings you closer to your goals
          </Typography>
        </Box>
        <ContextualHelp page="workout-history" />
      </Container>
    </Box>
  );
}

export default WorkoutHistory;