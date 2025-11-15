// src/pages/WorkoutRecommendations.js - AI Workout Recommendations

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Grid,
  Divider,
  Alert as MuiAlert,
} from '@mui/material';
import {
  AutoAwesome,
  Refresh,
  PlayArrow,
  TrendingUp,
  FitnessCenter,
  Schedule,
  Save,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/design-system';
import { Alert, EmptyState, Loading } from '../components/design-system';
import ModernCard from '../components/ModernCard';
import AIModelBadge from '../components/AIModelBadge';
import workoutService from '../services/api/workoutService';

// Exercise difficulty colors
const difficultyColors = {
  beginner: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: '#10B981' },
  intermediate: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)', text: '#FBBF24' },
  advanced: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#EF4444' },
};

function WorkoutRecommendations() {
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [lookbackDays, setLookbackDays] = useState(7);

  useEffect(() => {
    fetchRecommendation();
  }, [lookbackDays]);

  const fetchRecommendation = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await workoutService.getWorkoutRecommendation({ lookback_days: lookbackDays });
      setRecommendation(data);
    } catch (err) {
      console.error('Failed to fetch workout recommendation:', err);
      setError(err.message || 'Failed to load workout recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchRecommendation();
  };

  const handleStartWorkout = () => {
    if (!recommendation) return;

    // Store the workout in sessionStorage and navigate to workout session
    sessionStorage.setItem('currentWorkout', JSON.stringify({
      id: recommendation.id,
      name: recommendation.name,
      exercises: recommendation.exercises,
      ai_generated: true,
      ai_model: recommendation.ai_model,
    }));
    navigate('/workout-session');
  };

  const handleSaveWorkout = async () => {
    if (!recommendation) return;

    setSaving(true);
    try {
      const workoutData = {
        name: recommendation.name,
        description: recommendation.description,
        exercises: recommendation.exercises,
        difficulty: recommendation.difficulty,
        estimated_duration: recommendation.estimated_duration,
        ai_generated: true,
        ai_model: recommendation.ai_model,
      };

      await workoutService.saveWorkoutPlan(workoutData);
      alert('Workout saved successfully! You can find it in your workout history.');
    } catch (err) {
      console.error('Failed to save workout:', err);
      alert('Failed to save workout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const difficultyStyle = recommendation
    ? (difficultyColors[recommendation.difficulty] || difficultyColors.intermediate)
    : difficultyColors.intermediate;

  return (
    <PageContainer
      title="AI Workout Recommendations"
      subtitle="Smart workout suggestions based on your training history"
      icon="🤖"
      maxWidth="lg"
    >
      {/* Error Message */}
      {error && (
        <Alert severity="error" closable sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Lookback Days Selector */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 1.5 }}>
          Analyze workout history from the last:
        </Typography>
        <Stack direction="row" spacing={1}>
          {[7, 14, 30].map((days) => (
            <Button
              key={days}
              variant={lookbackDays === days ? 'contained' : 'outlined'}
              onClick={() => setLookbackDays(days)}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                background: lookbackDays === days ? 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)' : 'transparent',
                color: lookbackDays === days ? '#FFFFFF' : '#00D4FF',
                border: `1px solid ${lookbackDays === days ? 'transparent' : 'rgba(0, 212, 255, 0.3)'}`,
                '&:hover': {
                  background: lookbackDays === days
                    ? 'linear-gradient(45deg, #00B8E6 0%, #6B21A8 100%)'
                    : 'rgba(0, 212, 255, 0.1)',
                  borderColor: '#00D4FF',
                },
              }}
            >
              {days} days
            </Button>
          ))}
        </Stack>
      </Box>

      {/* Loading State */}
      {loading ? (
        <Loading />
      ) : !recommendation ? (
        <EmptyState
          title="No Recommendation Available"
          description="We couldn't generate a recommendation at this time. Please try again later."
        />
      ) : (
        <ModernCard variant="glass">
          <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <AutoAwesome sx={{ color: '#00D4FF', fontSize: 28 }} />
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#FFFFFF',
                      fontWeight: 700,
                    }}
                  >
                    {recommendation.name}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
                  {recommendation.description}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    label={recommendation.difficulty || 'Intermediate'}
                    size="small"
                    sx={{
                      background: difficultyStyle.bg,
                      border: `1px solid ${difficultyStyle.border}`,
                      color: difficultyStyle.text,
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<Schedule sx={{ fontSize: '16px' }} />}
                    label={`${recommendation.estimated_duration || 45} min`}
                    size="small"
                    sx={{
                      background: 'rgba(0, 212, 255, 0.1)',
                      color: '#00D4FF',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                    }}
                  />
                  <Chip
                    icon={<FitnessCenter sx={{ fontSize: '16px' }} />}
                    label={`${recommendation.exercises?.length || 0} exercises`}
                    size="small"
                    sx={{
                      background: 'rgba(124, 58, 237, 0.1)',
                      color: '#7C3AED',
                      border: '1px solid rgba(124, 58, 237, 0.2)',
                    }}
                  />
                </Stack>
              </Box>
              {recommendation.ai_model && <AIModelBadge model={recommendation.ai_model} />}
            </Box>

            {/* Why This Workout Section */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: '12px',
                background: 'rgba(0, 212, 255, 0.05)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUp sx={{ color: '#00D4FF', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ color: '#00D4FF', fontWeight: 600 }}>
                  Why This Workout?
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                Based on your workout history from the last {lookbackDays} days, this workout targets muscle groups
                that haven't been trained recently, helping you maintain balanced progress and prevent overtraining.
              </Typography>
            </Box>

            {/* Exercises List */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 2 }}>
                Exercises
              </Typography>
              <Stack spacing={2}>
                {recommendation.exercises?.map((exercise, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2.5,
                      borderRadius: '12px',
                      background: 'rgba(30, 41, 59, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        background: 'rgba(30, 41, 59, 0.6)',
                        border: '1px solid rgba(0, 212, 255, 0.2)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 0.5 }}>
                          {index + 1}. {exercise.name}
                        </Typography>
                        {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                            {exercise.muscle_groups.map((muscle, idx) => (
                              <Chip
                                key={idx}
                                label={muscle}
                                size="small"
                                sx={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  color: '#CBD5E1',
                                  fontSize: '0.75rem',
                                }}
                              />
                            ))}
                          </Stack>
                        )}
                      </Box>
                    </Box>

                    {/* Exercise Details */}
                    <Grid container spacing={2}>
                      {exercise.sets && (
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: '#94A3B8' }}>Sets</Typography>
                          <Typography variant="body1" sx={{ color: '#00D4FF', fontWeight: 600 }}>
                            {exercise.sets}
                          </Typography>
                        </Grid>
                      )}
                      {exercise.reps && (
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: '#94A3B8' }}>Reps</Typography>
                          <Typography variant="body1" sx={{ color: '#10B981', fontWeight: 600 }}>
                            {exercise.reps}
                          </Typography>
                        </Grid>
                      )}
                      {exercise.rest_seconds && (
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: '#94A3B8' }}>Rest</Typography>
                          <Typography variant="body1" sx={{ color: '#FBBF24', fontWeight: 600 }}>
                            {exercise.rest_seconds}s
                          </Typography>
                        </Grid>
                      )}
                    </Grid>

                    {exercise.notes && (
                      <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>Notes:</Typography>
                        <Typography variant="body2" sx={{ color: '#CBD5E1', mt: 0.5 }}>
                          {exercise.notes}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />

            {/* Action Buttons */}
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={handleStartWorkout}
                sx={{
                  flex: 1,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  borderRadius: '12px',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #00B8E6 0%, #6B21A8 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0, 212, 255, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Start Workout
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Save />}
                onClick={handleSaveWorkout}
                disabled={saving}
                sx={{
                  px: 3,
                  py: 1.5,
                  color: '#00D4FF',
                  borderColor: 'rgba(0, 212, 255, 0.3)',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  '&:hover': {
                    borderColor: '#00D4FF',
                    background: 'rgba(0, 212, 255, 0.1)',
                  },
                }}
              >
                {saving ? 'Saving...' : 'Save Workout'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                sx={{
                  px: 3,
                  py: 1.5,
                  color: '#CBD5E1',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  '&:hover': {
                    borderColor: '#00D4FF',
                    background: 'rgba(0, 212, 255, 0.1)',
                    color: '#00D4FF',
                  },
                }}
              >
                New Suggestion
              </Button>
            </Stack>
          </Box>
        </ModernCard>
      )}
    </PageContainer>
  );
}

export default WorkoutRecommendations;
