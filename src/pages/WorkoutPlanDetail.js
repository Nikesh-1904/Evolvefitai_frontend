// src/pages/WorkoutPlanDetail.js - Modern AI Fitness Workout Plan Details

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Alert,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  IconButton,
  Stack,
  Avatar,
  Skeleton,
  Fade,
  Slide,
  Zoom,
  Divider,
} from '@mui/material';
import {
  Timer,
  FitnessCenter,
  PlayArrow,
  ExpandMore,
  VideoLibrary,
  LightbulbOutlined,
  Info,
  Speed,
  EmojiEvents,
  AutoAwesome,
  MonitorWeight,
  DirectionsRun,
  SelfImprovement,
  OpenInNew,
} from '@mui/icons-material';
import apiService from '../services/apiService';
import AIModelBadge from '../components/AIModelBadge';

// Import our modern components
import ModernCard from '../components/ModernCard';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';

function WorkoutPlanDetail() {
  const { planId } = useParams();
  const navigate = useNavigate();
  
  // State management (preserving all original functionality)
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exerciseDetails, setExerciseDetails] = useState({});

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const planData = await apiService.getWorkoutPlanById(planId);
        setPlan(planData);
      } catch (err) {
        setError('Failed to load workout plan. It may not exist or you may not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  const fetchExerciseDetails = async (exerciseName) => {
    if (exerciseDetails[exerciseName]) return;
    
    try {
      const details = await apiService.getExerciseDetails(exerciseName);
      setExerciseDetails(prev => ({ ...prev, [exerciseName]: details }));
    } catch (error) {
      console.error('Failed to fetch exercise details:', error);
    }
  };

  const handleStartWorkout = () => {
    if (!plan) return;
    navigate('/workout-session', { state: { workoutPlan: plan } });
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#FF3366';
      default: return '#94A3B8';
    }
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
            <Grid item xs={12} md={8}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '16px' }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '16px' }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0F1419 0%, #1A202C 50%, #2D3748 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Alert 
            severity="error"
            sx={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              '& .MuiAlert-message': { color: '#FFFFFF' },
            }}
          >
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  if (!plan) {
    return null;
  }

  const difficultyColor = getDifficultyColor(plan.difficulty);

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
              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '25px',
                    background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '3rem',
                    mx: 'auto',
                    mb: 4,
                  }}
                >
                  🏋️
                </Box>
                
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                    fontWeight: 400,
                    fontSize: { xs: '2rem', sm: '3rem' },
                    color: '#FFFFFF',
                    lineHeight: 1.2,
                    mb: 2,
                  }}
                >
                  {plan.name}
                </Typography>

                {/* Plan Metadata */}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ justifyContent: 'center', alignItems: 'center', mb: 3 }}
                >
                  <Chip
                    icon={<Timer />}
                    label={`${plan.estimated_duration || 45} minutes`}
                    sx={{ 
                      background: 'rgba(0, 212, 255, 0.1)', 
                      color: '#00D4FF',
                      fontWeight: 600,
                      py: 1,
                      px: 2,
                    }}
                  />
                  
                  <Chip
                    icon={<Speed />}
                    label={plan.difficulty || 'Intermediate'}
                    sx={{ 
                      background: `${difficultyColor}20`,
                      color: difficultyColor,
                      fontWeight: 600,
                      py: 1,
                      px: 2,
                    }}
                  />

                  <Chip
                    icon={<FitnessCenter />}
                    label={`${plan.exercises?.length || 0} exercises`}
                    sx={{ 
                      background: 'rgba(16, 185, 129, 0.1)', 
                      color: '#10B981',
                      fontWeight: 600,
                      py: 1,
                      px: 2,
                    }}
                  />

                  {plan.ai_generated && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <AIModelBadge />
                    </Box>
                  )}
                </Stack>

                {/* Start Workout Button */}
                <PrimaryButton
                  onClick={handleStartWorkout}
                  size="large"
                  startIcon={<PlayArrow />}
                  sx={{
                    minWidth: '250px',
                    py: 2,
                    px: 4,
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    mb: plan.description ? 4 : 0,
                  }}
                >
                  Start Workout
                </PrimaryButton>

                {/* Description */}
                {plan.description && (
                  <Box sx={{ mt: 4, maxWidth: '600px', mx: 'auto' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#CBD5E1',
                        fontWeight: 500,
                        fontSize: '1.125rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {plan.description}
                    </Typography>
                  </Box>
                )}
              </Box>
            </ModernCard>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {/* Exercise List */}
          <Grid item xs={12} lg={8}>
            <Slide direction="right" in timeout={700}>
              <Box>
                <ModernCard
                  title={`📋 Exercise Breakdown`}
                  subtitle={`${plan.exercises?.length || 0} exercises in this workout`}
                  variant="glass"
                  sx={{ mb: 3 }}
                >
                  <Stack spacing={2}>
                    {plan.exercises?.map((exercise, index) => {
                      const typeInfo = getExerciseTypeInfo(exercise.exercise_type);
                      
                      return (
                        <Accordion
                          key={index}
                          sx={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '16px !important',
                            '&:before': { display: 'none' },
                            '& .MuiAccordionSummary-root': {
                              borderRadius: '16px',
                              minHeight: '80px',
                              '&.Mui-expanded': {
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0,
                              }
                            },
                            '& .MuiAccordionDetails-root': {
                              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                              backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            }
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMore sx={{ color: '#94A3B8' }} />}
                            sx={{
                              '& .MuiAccordionSummary-content': {
                                alignItems: 'center',
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
                              {/* Exercise Number Badge */}
                              <Avatar
                                sx={{
                                  width: 48,
                                  height: 48,
                                  background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                                  fontWeight: 700,
                                  fontSize: '1.25rem',
                                }}
                              >
                                {index + 1}
                              </Avatar>

                              {/* Exercise Info */}
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: '#FFFFFF',
                                    fontWeight: 600,
                                    mb: 0.5,
                                  }}
                                >
                                  {exercise.name}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Avatar
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      background: `${typeInfo.color}40`,
                                    }}
                                  >
                                    {React.cloneElement(typeInfo.icon, { sx: { fontSize: '0.875rem', color: typeInfo.color } })}
                                  </Avatar>
                                  <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                                    {typeInfo.label}
                                  </Typography>
                                  
                                  {exercise.reps && (
                                    <>
                                      <Box sx={{ width: '4px', height: '4px', borderRadius: '50%', background: '#94A3B8', mx: 1 }} />
                                      <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                        {exercise.reps} reps
                                      </Typography>
                                    </>
                                  )}
                                  
                                  {exercise.sets && (
                                    <>
                                      <Box sx={{ width: '4px', height: '4px', borderRadius: '50%', background: '#94A3B8', mx: 1 }} />
                                      <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                        {exercise.sets} sets
                                      </Typography>
                                    </>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </AccordionSummary>
                          
                          <AccordionDetails>
                            {/* Exercise Instructions */}
                            {exercise.instructions && (
                              <Box sx={{ mb: 3 }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: '#FFFFFF',
                                    fontWeight: 600,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                  }}
                                >
                                  <Info sx={{ fontSize: '1.25rem', color: '#00D4FF' }} />
                                  Instructions
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    color: '#CBD5E1',
                                    lineHeight: 1.6,
                                    ml: 4,
                                  }}
                                >
                                  {exercise.instructions}
                                </Typography>
                              </Box>
                            )}

                            {/* Load Videos & Tips Button */}
                            <Box sx={{ mb: 3 }}>
                              <SecondaryButton
                                onClick={() => fetchExerciseDetails(exercise.name)}
                                startIcon={<VideoLibrary />}
                                disabled={!!exerciseDetails[exercise.name]}
                              >
                                {exerciseDetails[exercise.name] ? 'Loaded' : 'Load Videos & Tips'}
                              </SecondaryButton>
                            </Box>

                            {/* Exercise Details */}
                            {exerciseDetails[exercise.name] && (
                              <Box>
                                {/* Videos Section */}
                                {exerciseDetails[exercise.name].videos?.length > 0 && (
                                  <Box sx={{ mb: 4 }}>
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        color: '#FFFFFF',
                                        fontWeight: 600,
                                        mb: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                      }}
                                    >
                                      <VideoLibrary sx={{ fontSize: '1.25rem', color: '#FF3366' }} />
                                      Video Demonstrations
                                    </Typography>
                                    
                                    <Grid container spacing={2}>
                                      {exerciseDetails[exercise.name].videos.slice(0, 2).map((video, videoIndex) => (
                                        <Grid item xs={12} sm={6} key={videoIndex}>
                                          <ModernCard
                                            variant="glass"
                                            sx={{ 
                                              cursor: 'pointer',
                                              transition: 'all 0.3s ease',
                                              '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 32px rgba(255, 51, 102, 0.3)',
                                              }
                                            }}
                                            onClick={() => {
                                              if (video.youtube_url || video.url) {
                                                window.open(video.youtube_url || video.url, '_blank');
                                              }
                                            }}
                                          >
                                            <Box sx={{ textAlign: 'center' }}>
                                              {video.thumbnail_url && (
                                                <Box sx={{ position: 'relative', mb: 2 }}>
                                                  <img
                                                    src={video.thumbnail_url}
                                                    alt={video.title || `Video ${videoIndex + 1}`}
                                                    style={{
                                                      width: '100%',
                                                      height: '120px',
                                                      objectFit: 'cover',
                                                      borderRadius: '8px',
                                                    }}
                                                  />
                                                  <Box
                                                    sx={{
                                                      position: 'absolute',
                                                      top: '50%',
                                                      left: '50%',
                                                      transform: 'translate(-50%, -50%)',
                                                      width: 48,
                                                      height: 48,
                                                      borderRadius: '50%',
                                                      background: 'rgba(255, 51, 102, 0.9)',
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justifyContent: 'center',
                                                    }}
                                                  >
                                                    <PlayArrow sx={{ color: '#FFFFFF', fontSize: '1.5rem' }} />
                                                  </Box>
                                                </Box>
                                              )}
                                              
                                              <Typography
                                                variant="body1"
                                                sx={{
                                                  color: '#FFFFFF',
                                                  fontWeight: 600,
                                                  mb: 1,
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  gap: 1,
                                                }}
                                              >
                                                {video.title || `Video ${videoIndex + 1}`}
                                                <OpenInNew sx={{ fontSize: '1rem', color: '#94A3B8' }} />
                                              </Typography>
                                            </Box>
                                          </ModernCard>
                                        </Grid>
                                      ))}
                                    </Grid>
                                  </Box>
                                )}

                                {/* Tips Section */}
                                {exerciseDetails[exercise.name].tips?.length > 0 && (
                                  <Box>
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        color: '#FFFFFF',
                                        fontWeight: 600,
                                        mb: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                      }}
                                    >
                                      <LightbulbOutlined sx={{ fontSize: '1.25rem', color: '#F59E0B' }} />
                                      Pro Tips
                                    </Typography>
                                    
                                    <List sx={{ p: 0 }}>
                                      {exerciseDetails[exercise.name].tips.slice(0, 3).map((tip, tipIndex) => (
                                        <ListItem
                                          key={tipIndex}
                                          sx={{
                                            background: 'rgba(245, 158, 11, 0.1)',
                                            border: '1px solid rgba(245, 158, 11, 0.2)',
                                            borderRadius: '12px',
                                            mb: 1,
                                            pl: 3,
                                          }}
                                        >
                                          <ListItemText
                                            primary={
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  color: '#CBD5E1',
                                                  fontWeight: 500,
                                                }}
                                              >
                                                • {tip}
                                              </Typography>
                                            }
                                          />
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Box>
                                )}
                              </Box>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                  </Stack>
                </ModernCard>
              </Box>
            </Slide>
          </Grid>

          {/* Workout Summary Sidebar */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Quick Stats */}
              <Slide direction="left" in timeout={900}>
                <Box>
                  <ModernCard
                    title="Workout Overview"
                    subtitle="What to expect from this session"
                    variant="glass"
                  >
                    <Stack spacing={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          width: 48, 
                          height: 48,
                          background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
                        }}>
                          <Timer />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                            Duration
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#00D4FF', fontWeight: 600 }}>
                            ~{plan.estimated_duration || 45} minutes
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          width: 48, 
                          height: 48,
                          background: `linear-gradient(135deg, ${difficultyColor} 0%, ${difficultyColor}80 100%)`,
                        }}>
                          <Speed />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                            Difficulty
                          </Typography>
                          <Typography variant="body2" sx={{ color: difficultyColor, fontWeight: 600 }}>
                            {plan.difficulty || 'Intermediate'}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          width: 48, 
                          height: 48,
                          background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                        }}>
                          <FitnessCenter />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                            Exercises
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                            {plan.exercises?.length || 0} movements
                          </Typography>
                        </Box>
                      </Box>

                      {plan.ai_generated && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            width: 48, 
                            height: 48,
                            background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                          }}>
                            <AutoAwesome />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                              AI Generated
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#7C3AED', fontWeight: 600 }}>
                              Personalized for you
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Stack>
                  </ModernCard>
                </Box>
              </Slide>

              {/* Exercise Types Breakdown */}
              <Slide direction="left" in timeout={1100}>
                <Box>
                  <ModernCard
                    title="Exercise Types"
                    subtitle="Variety in this workout"
                    variant="glass"
                  >
                    {plan.exercises && plan.exercises.length > 0 ? (
                      <Stack spacing={2}>
                        {Object.entries(
                          plan.exercises.reduce((acc, exercise) => {
                            const type = exercise.exercise_type || 'WEIGHT_BASED';
                            acc[type] = (acc[type] || 0) + 1;
                            return acc;
                          }, {})
                        ).map(([type, count]) => {
                          const typeInfo = getExerciseTypeInfo(type);
                          return (
                            <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ 
                                width: 40, 
                                height: 40,
                                background: `${typeInfo.color}20`,
                                border: `2px solid ${typeInfo.color}40`,
                              }}>
                                {React.cloneElement(typeInfo.icon, { sx: { color: typeInfo.color, fontSize: '1.25rem' } })}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                                  {typeInfo.label}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                  {count} exercise{count !== 1 ? 's' : ''}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        })}
                      </Stack>
                    ) : (
                      <Typography variant="body2" sx={{ color: '#94A3B8', textAlign: 'center' }}>
                        No exercises found
                      </Typography>
                    )}
                  </ModernCard>
                </Box>
              </Slide>

              {/* Call to Action */}
              <Slide direction="left" in timeout={1300}>
                <Box>
                  <ModernCard variant="glass" sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#FFFFFF',
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      Ready to crush this workout?
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#94A3B8',
                        mb: 3,
                        lineHeight: 1.6,
                      }}
                    >
                      Start your session now and track your progress with our intelligent logging system.
                    </Typography>
                    
                    <PrimaryButton
                      onClick={handleStartWorkout}
                      fullWidth
                      size="large"
                      startIcon={<PlayArrow />}
                      sx={{ py: 2, fontSize: '1.125rem' }}
                    >
                      Begin Workout
                    </PrimaryButton>
                  </ModernCard>
                </Box>
              </Slide>
            </Stack>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
            🎯 Optimized workout plan designed for maximum results
          </Typography>
          <Typography variant="caption" sx={{ color: '#6B7280' }}>
            All exercises include video demonstrations and professional tips
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default WorkoutPlanDetail;