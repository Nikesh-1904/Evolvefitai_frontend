// src/pages/WorkoutGenerator.js - Fixed Exercise Details Display

import React, { useState } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Stack,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  PlayArrow,
  AutoAwesome,
  Timer,
  FitnessCenter,
  VideoLibrary,
  Lightbulb,
  ThumbUp,
  ThumbDown,
  Save,
  LocalFireDepartment,
  TrendingUp,
  Psychology,
  Close,
  ExpandMore,
  ExpandLess,
  OpenInNew,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import new design system components
import { PageContainer } from '../components/design-system';
import { Alert } from '../components/design-system';

// Import API services
import { workoutService } from '../services/api';

// Import new hooks
import { useGenerateWorkout, useExerciseDetails, useSaveWorkoutPlan } from '../hooks/useWorkouts';

// Import our modern components
import ModernCard, { StatCard } from '../components/ModernCard';
import ModernInput, { ModernSelect } from '../components/ModernInput';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';
import AIModelBadge from '../components/AIModelBadge';

const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];
const workoutTypes = ['Gym', 'Home Workout', 'Yoga', 'Cardio', 'HIIT'];

function WorkoutGenerator() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Use new hooks
  const { execute: generateWorkout, loading: generating, error: generateError } = useGenerateWorkout();
  const { execute: saveWorkoutPlan, loading: saving } = useSaveWorkoutPlan();
  const { execute: getExerciseDetails } = useExerciseDetails();

  // State management
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [duration, setDuration] = useState(45);
  const [success, setSuccess] = useState('');
  const [exerciseDetails, setExerciseDetails] = useState({});
  const [generationTime, setGenerationTime] = useState(null);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [numExercises, setNumExercises] = useState('');
  const [workoutType, setWorkoutType] = useState('');

  // New state for exercise details display
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [loadingExerciseDetails, setLoadingExerciseDetails] = useState({});
  const [exerciseDetailsDialog, setExerciseDetailsDialog] = useState(null);

  const error = generateError ? 'Failed to generate workout. Please try again.' : '';

  // All functions preserved exactly as original
  const handleMuscleToggle = (muscle) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle]
    );
  };

  const handleGenerateWorkout = async () => {
    setSuccess('');
    setWorkoutPlan(null);
    setGenerationTime(null);
    const startTime = Date.now();

    try {
      const requestData = {
        user_preferences: {
          fitness_goal: user?.fitness_goal || 'general_fitness',
          experience_level: user?.experience_level || 'intermediate',
        },
        duration_minutes: duration,
        target_muscle_groups: selectedMuscles,
        num_exercises: numExercises ? parseInt(numExercises, 10) : null,
        workout_type: workoutType || null,
      };

      const response = await generateWorkout(requestData);
      const endTime = Date.now();
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

      setGenerationTime(timeTaken);
      setWorkoutPlan(response);
      setSuccess(`Workout generated in ${timeTaken}s by ${response.ai_model || 'AI'}!`);
    } catch (err) {
      // Error handled by hook
    }
  };

  // Enhanced fetchExerciseDetails function
  const fetchExerciseDetails = async (exerciseName) => {
    if (exerciseDetails[exerciseName]) {
      // If already loaded, just toggle display
      setExerciseDetailsDialog(exerciseName);
      return;
    }

    setLoadingExerciseDetails(prev => ({ ...prev, [exerciseName]: true }));

    try {
      const details = await getExerciseDetails(exerciseName);
      setExerciseDetails(prev => ({ ...prev, [exerciseName]: details }));
      setExerciseDetailsDialog(exerciseName);
    } catch (error) {
      console.error('Failed to fetch exercise details:', error);
    } finally {
      setLoadingExerciseDetails(prev => ({ ...prev, [exerciseName]: false }));
    }
  };

  const handleStartWorkout = () => {
    if (!workoutPlan) return;
    navigate('/workout-session', { state: { workoutPlan: workoutPlan } });
  };

  const handleSaveWorkout = async () => {
    if (!workoutPlan) return;
    try {
      await saveWorkoutPlan(workoutPlan);
      setSuccess('Workout saved successfully!');
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleExerciseFeedback = async (exerciseName, feedback) => {
    try {
      await workoutService.submitExerciseFeedback(exerciseName, feedback);
      setSuccess(`Feedback submitted! This helps improve AI recommendations.`);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  // Options for select fields
  const numExerciseOptions = [
    { value: '', label: 'AI Decides' },
    ...Array.from({ length: 8 }, (_, i) => ({ value: i + 3, label: `${i + 3}` }))
  ];

  const workoutTypeOptions = [
    { value: '', label: 'Any' },
    ...workoutTypes.map(type => ({ value: type, label: type }))
  ];

  return (
    <PageContainer
      title="AI Workout Generator"
      subtitle="Get personalized workouts powered by advanced AI models, tailored to your goals and preferences"
      icon="💪"
      maxWidth="lg"
    >
      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" closable onClose={() => setSuccess('')} sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" closable onClose={() => {}} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Workout Preferences Section */}
        <Grid item xs={12} md={6}>
          <ModernCard
            title="Workout Preferences"
            subtitle="Customize your AI-generated workout"
            variant="glass"
            headerAction={<FitnessCenter sx={{ color: '#00D4FF' }} />}
          >
            <Stack spacing={3}>
              <ModernInput
                label="Duration (minutes)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Math.max(15, Math.min(120, parseInt(e.target.value) || 45)))}
                variant="outlined"
                helperText="15-120 minutes"
                startIcon={<Timer />}
              />

              <ModernSelect
                label="Number of Exercises"
                value={numExercises}
                onChange={(e) => setNumExercises(e.target.value)}
                options={numExerciseOptions}
                variant="outlined"
                helperText="Let AI decide or set a specific number"
              />

              <ModernSelect
                label="Workout Type"
                value={workoutType}
                onChange={(e) => setWorkoutType(e.target.value)}
                options={workoutTypeOptions}
                variant="outlined"
                helperText="Choose your preferred workout environment"
              />
            </Stack>
          </ModernCard>
        </Grid>

        {/* Muscle Groups Section */}
        <Grid item xs={12} md={6}>
          <ModernCard
            title="Target Muscle Groups"
            subtitle="Select specific areas to focus on (optional)"
            variant="glass"
            headerAction={<Psychology sx={{ color: '#7C3AED' }} />}
          >
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {muscleGroups.map((muscle) => (
                  <Chip
                    key={muscle}
                    label={muscle}
                    onClick={() => handleMuscleToggle(muscle)}
                    color={selectedMuscles.includes(muscle) ? 'primary' : 'default'}
                    variant={selectedMuscles.includes(muscle) ? 'filled' : 'outlined'}
                    sx={{
                      borderRadius: '12px',
                      fontWeight: 600,
                      ...(selectedMuscles.includes(muscle) && {
                        background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                        color: '#FFFFFF',
                      }),
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)',
                      }
                    }}
                  />
                ))}
              </Box>

              {/* User Profile Info */}
              {user && (
                <Box sx={{ mt: 2, p: 2, borderRadius: '12px', background: 'rgba(0, 212, 255, 0.05)' }}>
                  <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 1, fontWeight: 600 }}>
                    💪 Based on your profile:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {user.fitness_goal && (
                      <Chip 
                        label={`Goal: ${user.fitness_goal.replace('_', ' ')}`} 
                        size="small" 
                        variant="outlined"
                        sx={{ color: '#00D4FF', borderColor: '#00D4FF' }}
                      />
                    )}
                    {user.experience_level && (
                      <Chip 
                        label={`Level: ${user.experience_level}`} 
                        size="small" 
                        variant="outlined"
                        sx={{ color: '#7C3AED', borderColor: '#7C3AED' }}
                      />
                    )}
                  </Box>
                </Box>
              )}
            </Stack>
          </ModernCard>
        </Grid>

        {/* Generate Button Section */}
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center' }}>
            <PrimaryButton
              onClick={handleGenerateWorkout}
              disabled={generating}
              loading={generating}
              size="large"
              startIcon={generating ? undefined : <AutoAwesome />}
              sx={{ 
                minWidth: '280px',
                height: '60px',
                fontSize: '1.125rem',
                fontWeight: 700,
              }}
            >
              {generating ? 'Generating AI Workout...' : '🚀 Generate AI Workout'}
            </PrimaryButton>

            {generating && (
              <Typography variant="body2" sx={{ color: '#CBD5E1', mt: 2 }}>
                🧠 AI is analyzing your profile and preferences...
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Generated Workout Results */}
        {workoutPlan && (
          <>
            {/* Workout Summary */}
            <Grid item xs={12}>
              <ModernCard
                title={workoutPlan.name || 'Your Personalized Workout'}
                subtitle={workoutPlan.description}
                variant="feature"
                headerAction={
                  workoutPlan.ai_generated && (
                    <AIModelBadge
                      aiModel={workoutPlan.ai_model}
                      aiGenerated={workoutPlan.ai_generated}
                    />
                  )
                }
              >
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} sm={3}>
                    <StatCard
                      icon={<Timer />}
                      value={`${workoutPlan.estimated_duration || duration} min`}
                      label="Duration"
                      variant="stat"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <StatCard
                      icon={<FitnessCenter />}
                      value={workoutPlan.exercises?.length || 0}
                      label="Exercises"
                      variant="stat"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <StatCard
                      icon={<TrendingUp />}
                      value={workoutPlan.difficulty_level || 'Moderate'}
                      label="Difficulty"
                      variant="stat"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <StatCard
                      icon={<LocalFireDepartment />}
                      value={workoutPlan.estimated_calories ? `~${workoutPlan.estimated_calories}` : 'N/A'}
                      label="Calories"
                      variant="stat"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <SecondaryButton
                    onClick={handleSaveWorkout}
                    startIcon={<Save />}
                  >
                    Save Plan
                  </SecondaryButton>
                  
                  <PrimaryButton
                    onClick={handleStartWorkout}
                    startIcon={<PlayArrow />}
                    size="large"
                  >
                    Start Workout
                  </PrimaryButton>
                </Box>

                {generationTime && (
                  <Typography variant="caption" sx={{ 
                    color: '#10B981', 
                    fontWeight: 600,
                    textAlign: 'center',
                    display: 'block',
                    mt: 2 
                  }}>
                    ⚡ Generated in {generationTime}s
                  </Typography>
                )}
              </ModernCard>
            </Grid>

            {/* Exercise List */}
            <Grid item xs={12}>
              <ModernCard
                title={`Exercises (${workoutPlan.exercises?.length || 0})`}
                subtitle="Your personalized workout routine"
                variant="glass"
              >
                <List sx={{ p: 0 }}>
                  {workoutPlan.exercises?.map((exercise, index) => (
                    <React.Fragment key={index}>
                      <ListItem
                        sx={{
                          px: 0,
                          py: 3,
                          flexDirection: 'column',
                          alignItems: 'stretch',
                        }}
                      >
                        {/* Exercise Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, width: '100%' }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '10px',
                              background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              fontWeight: 700,
                              fontSize: '1.125rem',
                            }}
                          >
                            {index + 1}
                          </Box>
                          
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                              fontWeight: 400,
                              color: '#FFFFFF',
                              flex: 1,
                            }}
                          >
                            {exercise.name}
                          </Typography>
                        </Box>

                        {/* Exercise Details */}
                        {exercise.instructions && (
                          <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 2, lineHeight: 1.6 }}>
                            📝 {exercise.instructions}
                          </Typography>
                        )}

                        {/* Muscle Groups */}
                        {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
                              🎯 Target Muscles:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {exercise.muscle_groups.map((muscle, idx) => (
                                <Chip
                                  key={idx}
                                  label={muscle}
                                  size="small"
                                  sx={{
                                    background: 'rgba(0, 212, 255, 0.1)',
                                    color: '#00D4FF',
                                    fontSize: '0.75rem',
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                          <SecondaryButton
                            size="small"
                            onClick={() => fetchExerciseDetails(exercise.name)}
                            startIcon={loadingExerciseDetails[exercise.name] ? <CircularProgress size={16} /> : <VideoLibrary />}
                            disabled={loadingExerciseDetails[exercise.name]}
                          >
                            {loadingExerciseDetails[exercise.name] ? 'Loading...' : 'Watch Videos'}
                          </SecondaryButton>

                          {/* Feedback Buttons */}
                          <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                            <Typography variant="caption" sx={{ color: '#94A3B8', mr: 1 }}>
                              Help improve AI:
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleExerciseFeedback(exercise.name, 'like')}
                              sx={{ color: '#10B981' }}
                            >
                              <ThumbUp fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleExerciseFeedback(exercise.name, 'dislike')}
                              sx={{ color: '#EF4444' }}
                            >
                              <ThumbDown fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </ListItem>
                      
                      {index < (workoutPlan.exercises?.length || 0) - 1 && (
                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </ModernCard>
            </Grid>

            {/* Workout Tips */}
            <Grid item xs={12}>
              <ModernCard
                title="Workout Summary & Tips"
                variant="default"
              >
                <Typography variant="body1" sx={{ color: '#CBD5E1', mb: 2, lineHeight: 1.6 }}>
                  This {workoutPlan.estimated_duration || duration}-minute {workoutPlan.difficulty_level || 'moderate'} workout 
                  targets {workoutPlan.exercises?.length || 0} different exercises.
                  {workoutPlan.estimated_calories && ` You'll burn approximately ${workoutPlan.estimated_calories} calories.`}
                </Typography>
                
                <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.6 }}>
                  💪 Remember to warm up before starting, stay hydrated throughout, and listen to your body!
                </Typography>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <PrimaryButton
                    onClick={handleStartWorkout}
                    startIcon={<PlayArrow />}
                    size="large"
                    sx={{ minWidth: '240px' }}
                  >
                    🚀 Start This Workout Now
                  </PrimaryButton>
                </Box>
              </ModernCard>
            </Grid>
          </>
        )}

        {/* AI Info Footer */}
        <Grid item xs={12}>
          <ModernCard variant="glass">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 1 }}>
                🤖 Powered by advanced AI models including Groq Llama3, Ollama, and rule-based systems
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                💪 Every workout is personalized based on your fitness profile and goals
              </Typography>
            </Box>
          </ModernCard>
        </Grid>
      </Grid>

    <Dialog
      open={!!exerciseDetailsDialog}
      onClose={() => setExerciseDetailsDialog(null)}
      maxWidth="md"
      fullWidth
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
      {exerciseDetailsDialog && exerciseDetails[exerciseDetailsDialog] && (
        <>
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
            <Box>
              <Typography variant="h5" sx={{ fontFamily: 'inherit', fontWeight: 'inherit' }}>
                {exerciseDetailsDialog}
              </Typography>
              <Typography variant="body2" sx={{ color: '#CBD5E1', mt: 0.5 }}>
                Exercise details, videos, and tips
              </Typography>
            </Box>
            <IconButton onClick={() => setExerciseDetailsDialog(null)} sx={{ color: '#94A3B8' }}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Stack spacing={3}>
              {/* Exercise Videos */}
              {Array.isArray(exerciseDetails[exerciseDetailsDialog]?.videos) &&
                exerciseDetails[exerciseDetailsDialog].videos.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{
                    color: '#00D4FF',
                    fontWeight: 600,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <VideoLibrary /> Video Demonstrations
                  </Typography>
                  <Grid container spacing={2}>
                    {exerciseDetails[exerciseDetailsDialog].videos.map((video, idx) => (
                      <Grid item xs={12} sm={6} key={idx}>
                        <ModernCard variant="glass" sx={{ cursor: 'pointer' }}>
                          <Box
                            onClick={() => {
                              if (video.youtube_url) {
                                window.open(video.youtube_url, '_blank');
                              } else if (video.url) {
                                window.open(video.url, '_blank');
                              }
                            }}
                            sx={{
                              textAlign: 'center',
                              '&:hover .video-overlay': {
                                opacity: 1,
                              }
                            }}
                          >
                            {(video.thumbnail_url || video.thumbnail) && (
                              <Box sx={{ position: 'relative', mb: 2 }}>
                                <img
                                  src={video.thumbnail_url || video.thumbnail}
                                  alt={video.title || `Video ${idx + 1}`}
                                  style={{
                                    width: '100%',
                                    height: '120px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                  }}
                                />
                                <Box
                                  className="video-overlay"
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'rgba(0, 0, 0, 0.7)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '8px',
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease',
                                  }}
                                >
                                  <PlayArrow sx={{ fontSize: '3rem', color: '#00D4FF' }} />
                                </Box>
                              </Box>
                            )}
                            <Typography variant="body1" sx={{
                              color: '#FFFFFF',
                              fontWeight: 600,
                              mb: 1,
                            }}>
                              {video.title || `Video ${idx + 1}`}
                            </Typography>
                            {video.duration && (
                              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                Duration: {video.duration}
                              </Typography>
                            )}
                            <Box sx={{ mt: 2 }}>
                              <SecondaryButton
                                size="small"
                                endIcon={<OpenInNew />}
                                fullWidth
                              >
                                Watch Video
                              </SecondaryButton>
                            </Box>
                          </Box>
                        </ModernCard>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Exercise Tips */}
              {Array.isArray(exerciseDetails[exerciseDetailsDialog]?.tips) &&
                exerciseDetails[exerciseDetailsDialog].tips.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{
                    color: '#7C3AED',
                    fontWeight: 600,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <Lightbulb /> Exercise Tips
                  </Typography>
                  <Grid container spacing={1}>
                    {exerciseDetails[exerciseDetailsDialog].tips.map((tip, idx) => (
                      <Grid item xs={12} sm={6} md={4} key={idx}>
                        <Box sx={{
                          p: 2,
                          borderRadius: '12px',
                          background: 'rgba(124, 58, 237, 0.1)',
                          border: '1px solid rgba(124, 58, 237, 0.2)',
                        }}>
                          <Typography variant="body2" sx={{
                            color: '#FFFFFF',
                            fontWeight: 500,
                            lineHeight: 1.5,
                          }}>
                            💡 {tip.content || tip.title || tip}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Equipment Requirements */}
              {Array.isArray(exerciseDetails[exerciseDetailsDialog]?.equipment) &&
                exerciseDetails[exerciseDetailsDialog].equipment.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 1, fontWeight: 600 }}>
                    🏋️ Equipment Needed:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {exerciseDetails[exerciseDetailsDialog].equipment.map((item, idx) => (
                      <Chip
                        key={idx}
                        label={item}
                        size="small"
                        sx={{
                          background: 'rgba(0, 212, 255, 0.1)',
                          color: '#00D4FF',
                          fontSize: '0.75rem',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <SecondaryButton onClick={() => setExerciseDetailsDialog(null)}>
              Close
            </SecondaryButton>
          </DialogActions>
        </>
      )}
    </Dialog>

    </PageContainer>
  );
}

export default WorkoutGenerator;