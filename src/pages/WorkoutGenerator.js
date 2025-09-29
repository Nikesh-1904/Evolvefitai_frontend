// src/pages/WorkoutGenerator.js - Updated with Start Workout functionality

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  ExpandMore,
  PlayArrow,
  AutoAwesome,
  Timer,
  FitnessCenter,
  VideoLibrary,
  Lightbulb,
  ThumbUp,
  ThumbDown,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // Add this import
import apiService from '../services/apiService';

function WorkoutGenerator() {
  const { user } = useAuth();
  const navigate = useNavigate(); // Add this
  const [generating, setGenerating] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [duration, setDuration] = useState(45);
  const [error, setError] = useState('');
  const [exerciseDetails, setExerciseDetails] = useState({});

  const handleGenerateWorkout = async () => {
    setGenerating(true);
    setError('');
    setWorkoutPlan(null);

    try {
      const requestData = {
        user_preferences: {
          fitness_goal: user?.fitness_goal || 'general_fitness',
          experience_level: user?.experience_level || 'intermediate',
          activity_level: user?.activity_level || 'moderately_active',
          dietary_restrictions: user?.dietary_restrictions || [],
        },
        duration_minutes: duration,
      };

      const response = await apiService.generateWorkout(requestData);
      setWorkoutPlan(response);
    } catch (err) {
      console.error('Error generating workout:', err);
      setError('Failed to generate workout. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const fetchExerciseDetails = async (exerciseName) => {
    try {
      const details = await apiService.getExerciseDetails(exerciseName);
      setExerciseDetails(prev => ({
        ...prev,
        [exerciseName]: details
      }));
    } catch (error) {
      console.error('Failed to fetch exercise details:', error);
    }
  };

  const handleStartWorkout = () => {
    if (!workoutPlan) return;
    
    // Navigate to workout execution page with workout plan
    navigate('/workout-session', { 
      state: { 
        workoutPlan: workoutPlan 
      } 
    });
  };

  const handleSaveWorkout = async () => {
    if (!workoutPlan) return;
    
    try {
      await apiService.saveWorkoutPlan(workoutPlan);
      // Show success message or update UI
      alert('Workout saved successfully!');
    } catch (error) {
      console.error('Failed to save workout:', error);
      alert('Failed to save workout');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        AI Workout Generator
      </Typography>

      {/* Generation Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <TextField
              type="number"
              label="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(Math.max(15, Math.min(120, parseInt(e.target.value) || 45)))}
              sx={{ width: 200 }}
              inputProps={{ min: 15, max: 120 }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleGenerateWorkout}
              disabled={generating}
              startIcon={generating ? <CircularProgress size={20} /> : <AutoAwesome />}
              sx={{ minWidth: 200 }}
            >
              {generating ? 'Generating...' : 'Generate Workout'}
            </Button>
          </Box>

          {user && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Based on your profile:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {user.fitness_goal && (
                  <Chip label={`Goal: ${user.fitness_goal.replace('_', ' ')}`} size="small" variant="outlined" />
                )}
                {user.experience_level && (
                  <Chip label={`Level: ${user.experience_level}`} size="small" variant="outlined" />
                )}
                {user.activity_level && (
                  <Chip label={`Activity: ${user.activity_level.replace('_', ' ')}`} size="small" variant="outlined" />
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Generated Workout */}
      {workoutPlan && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box>
                <Typography variant="h5" gutterBottom>
                  Your Personalized Workout
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <Chip 
                    icon={<Timer />} 
                    label={`${workoutPlan.duration_minutes} min`} 
                    color="primary" 
                  />
                  <Chip 
                    icon={<FitnessCenter />} 
                    label={workoutPlan.difficulty_level || 'Moderate'} 
                    color="secondary" 
                  />
                  {workoutPlan.estimated_calories && (
                    <Chip 
                      label={`~${workoutPlan.estimated_calories} cal`} 
                      variant="outlined" 
                    />
                  )}
                </Box>
              </Box>
              
              {/* Action Buttons */}
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  onClick={handleSaveWorkout}
                  startIcon={<FitnessCenter />}
                >
                  Save Workout
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleStartWorkout}
                  startIcon={<PlayArrow />}
                  sx={{ 
                    minWidth: 150,
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF5252 30%, #26A69A 90%)',
                    }
                  }}
                >
                  Start Workout
                </Button>
              </Box>
            </Box>

            {/* Workout Description */}
            {workoutPlan.description && (
              <Typography variant="body1" color="text.secondary" paragraph>
                {workoutPlan.description}
              </Typography>
            )}

            {/* Exercise List */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Exercises ({workoutPlan.exercises?.length || 0})
            </Typography>
            
            {workoutPlan.exercises?.map((exercise, index) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center" width="100%">
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      {index + 1}. {exercise.name}
                    </Typography>
                    <Box display="flex" gap={1} mr={2}>
                      {exercise.sets && (
                        <Chip label={`${exercise.sets} sets`} size="small" />
                      )}
                      {exercise.reps && (
                        <Chip label={`${exercise.reps} reps`} size="small" />
                      )}
                      {exercise.duration_seconds && (
                        <Chip label={`${exercise.duration_seconds}s`} size="small" />
                      )}
                      {exercise.weight && (
                        <Chip label={`${exercise.weight}`} size="small" color="secondary" />
                      )}
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      {exercise.instructions && (
                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Instructions:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {exercise.instructions}
                          </Typography>
                        </Box>
                      )}

                      {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Target Muscles:
                          </Typography>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            {exercise.muscle_groups.map((muscle, idx) => (
                              <Chip
                                key={idx}
                                label={muscle}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}

                      {exercise.equipment && (
                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Equipment:
                          </Typography>
                          <Chip label={exercise.equipment} size="small" color="info" />
                        </Box>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Button
                          size="small"
                          startIcon={<VideoLibrary />}
                          onClick={() => fetchExerciseDetails(exercise.name)}
                        >
                          Watch Video
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Lightbulb />}
                          onClick={() => fetchExerciseDetails(exercise.name)}
                        >
                          Get Tips
                        </Button>
                      </Box>
                      
                      {/* Exercise feedback */}
                      <Box display="flex" justifyContent="center" gap={1} mt={2}>
                        <IconButton size="small" color="success">
                          <ThumbUp />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <ThumbDown />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Exercise Details (videos, tips) */}
                  {exerciseDetails[exercise.name] && (
                    <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
                      {exerciseDetails[exercise.name].videos && (
                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Video Demonstrations:
                          </Typography>
                          <List dense>
                            {exerciseDetails[exercise.name].videos.slice(0, 2).map((video, idx) => (
                              <ListItem key={idx} divider>
                                <ListItemText
                                  primary={video.title}
                                  secondary={`Duration: ${video.duration}s`}
                                />
                                <Button
                                  size="small"
                                  href={video.youtube_url}
                                  target="_blank"
                                  startIcon={<VideoLibrary />}
                                >
                                  Watch
                                </Button>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}

                      {exerciseDetails[exercise.name].tips && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Exercise Tips:
                          </Typography>
                          <List dense>
                            {exerciseDetails[exercise.name].tips.slice(0, 3).map((tip, idx) => (
                              <ListItem key={idx}>
                                <ListItemText
                                  primary={tip.title}
                                  secondary={tip.content}
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
            ))}

            {/* Workout Summary */}
            <Box mt={3} p={2} bgcolor="primary.light" color="primary.contrastText" borderRadius={1}>
              <Typography variant="subtitle1" gutterBottom>
                💡 Workout Summary
              </Typography>
              <Typography variant="body2">
                This {workoutPlan.duration_minutes}-minute {workoutPlan.difficulty_level || 'moderate'} workout 
                targets {workoutPlan.exercises?.length || 0} different exercises. 
                {workoutPlan.estimated_calories && ` You'll burn approximately ${workoutPlan.estimated_calories} calories.`}
                Remember to stay hydrated and listen to your body!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default WorkoutGenerator;