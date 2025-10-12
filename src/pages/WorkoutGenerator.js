// src/pages/WorkoutGenerator.js - Modern AI Workout Generator with Fixed Video/Tips Functionality

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Stack,
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
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

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
  
  // State management (preserved from original)
  const [generating, setGenerating] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [duration, setDuration] = useState(45);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [exerciseDetails, setExerciseDetails] = useState({});
  const [generationTime, setGenerationTime] = useState(null);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [numExercises, setNumExercises] = useState('');
  const [workoutType, setWorkoutType] = useState('');

  // All functions preserved exactly as original
  const handleMuscleToggle = (muscle) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle]
    );
  };

  const handleGenerateWorkout = async () => {
    setGenerating(true);
    setError('');
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

      const response = await apiService.generateWorkout(requestData);
      const endTime = Date.now();
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

      setGenerationTime(timeTaken);
      setWorkoutPlan(response);
      setSuccess(`Workout generated in ${timeTaken}s by ${response.ai_model || 'AI'}!`);
    } catch (err) {
      setError('Failed to generate workout. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const fetchExerciseDetails = async (exerciseName) => {
    if (exerciseDetails[exerciseName]) return exerciseDetails[exerciseName];
    try {
      const details = await apiService.getExerciseDetails(exerciseName);
      setExerciseDetails(prev => ({ ...prev, [exerciseName]: details }));
      return details;
    } catch (error) {
      console.error('Failed to fetch exercise details:', error);
      throw error; // Re-throw the error so the calling function can catch it
    }
  };

  // FIXED: Handle video watching - open first available video
  const handleWatchVideo = async (exerciseName) => {
    try {
      // 'details' will now be populated either from cache or the fresh API call
      const details = await fetchExerciseDetails(exerciseName);
      
      if (details && details.videos && details.videos.length > 0) {
        // Open the first video in a new tab
        window.open(details.videos[0].url, '_blank');
      } else {
        setError('No video available for this exercise');
      }
    } catch (error) {
      console.error('Failed to open video:', error);
      setError('Failed to load video');
    }
  };

  // FIXED: Handle tips - fetch and display tips
  const handleGetTips = async (exerciseName) => {
    try {
      await fetchExerciseDetails(exerciseName);
    } catch (error) {
      console.error('Failed to fetch tips:', error);
      setError('Failed to load exercise tips');
    }
  };

  const handleStartWorkout = () => {
    if (!workoutPlan) return;
    navigate('/workout-session', { state: { workoutPlan: workoutPlan } });
  };

  const handleSaveWorkout = async () => {
    if (!workoutPlan) return;
    try {
      await apiService.saveWorkoutPlan(workoutPlan);
      setSuccess('Workout saved successfully!');
    } catch (error) {
      setError('Failed to save workout');
    }
  };

  const handleExerciseFeedback = async (exerciseName, feedback) => {
    try {
      await apiService.submitExerciseFeedback(exerciseName, feedback);
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Modern Hero Section */}
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
            🤖
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
            AI Workout Generator
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
            Get personalized workouts powered by advanced AI models, tailored to your goals and preferences
          </Typography>
        </Box>
      </ModernCard>

      {/* Success/Error Messages */}
      {success && (
        <Alert 
          severity="success" 
          onClose={() => setSuccess('')}
          sx={{ 
            mb: 3,
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            '& .MuiAlert-message': { color: '#FFFFFF' },
          }}
        >
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError('')}
          sx={{ 
            mb: 3,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            '& .MuiAlert-message': { color: '#FFFFFF' },
          }}
        >
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

                        {/* Action Buttons - FIXED */}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                          <SecondaryButton
                            size="small"
                            onClick={() => handleWatchVideo(exercise.name)}
                            startIcon={<VideoLibrary />}
                          >
                            Watch Video
                          </SecondaryButton>
                          
                          <SecondaryButton
                            size="small"
                            onClick={() => handleGetTips(exercise.name)}
                            startIcon={<Lightbulb />}
                          >
                            Get Tips
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

                        {/* Exercise Details (when loaded) - FIXED */}
                        {exerciseDetails[exercise.name] && (
                          <Box sx={{ mt: 2, p: 2, borderRadius: '12px', background: 'rgba(0, 212, 255, 0.05)' }}>
                            {exerciseDetails[exercise.name].videos && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ color: '#00D4FF', fontWeight: 600, mb: 1 }}>
                                  🎬 Available Videos:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                  {exerciseDetails[exercise.name].videos.slice(0, 3).map((video, idx) => (
                                    <SecondaryButton
                                      key={idx}
                                      size="small"
                                      onClick={() => window.open(video.url, '_blank')}
                                      startIcon={<VideoLibrary />}
                                    >
                                      Video {idx + 1}
                                    </SecondaryButton>
                                  ))}
                                </Box>
                              </Box>
                            )}

                            {exerciseDetails[exercise.name].tips && (
                              <Box>
                                <Typography variant="body2" sx={{ color: '#7C3AED', fontWeight: 600, mb: 1 }}>
                                  💡 Exercise Tips:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                  {exerciseDetails[exercise.name].tips.slice(0, 3).map((tip, idx) => (
                                    <Chip
                                      key={idx}
                                      label={tip}
                                      size="small"
                                      sx={{
                                        background: 'rgba(124, 58, 237, 0.1)',
                                        color: '#7C3AED',
                                        fontSize: '0.75rem',
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </Box>
                        )}
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
    </Container>
  );
}

export default WorkoutGenerator;