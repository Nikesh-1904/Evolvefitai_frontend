// src/pages/WorkoutGenerator.js
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
import apiService from '../services/apiService';

function WorkoutGenerator() {
  const { user } = useAuth();
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
      const plan = await apiService.generateWorkout(duration);
      setWorkoutPlan(plan);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to generate workout');
    } finally {
      setGenerating(false);
    }
  };

  const loadExerciseDetails = async (exerciseId, exerciseName) => {
    if (exerciseDetails[exerciseId]) return;

    try {
      const [videos, tips] = await Promise.all([
        apiService.getExerciseVideos(exerciseId).catch(() => []),
        apiService.getExerciseTips(exerciseId).catch(() => [])
      ]);

      setExerciseDetails(prev => ({
        ...prev,
        [exerciseId]: { videos, tips }
      }));
    } catch (error) {
      console.error('Failed to load exercise details:', error);
    }
  };

  const handleTipInteraction = async (tipId, interactionType) => {
    try {
      await apiService.interactWithTip(tipId, interactionType);
      // Optionally refresh tips or show feedback
    } catch (error) {
      console.error('Failed to interact with tip:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        AI Workout Generator
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Get a personalized workout powered by artificial intelligence
      </Typography>

      {/* Generation Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Math.max(15, Math.min(120, e.target.value)))}
                inputProps={{ min: 15, max: 120 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleGenerateWorkout}
                disabled={generating}
                startIcon={generating ? <CircularProgress size={20} /> : <AutoAwesome />}
              >
                {generating ? 'Generating...' : 'Generate AI Workout'}
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                AI will create a personalized workout based on your profile: {user?.fitness_goal || 'general fitness'} goal, 
                {user?.experience_level || 'intermediate'} level
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Generated Workout */}
      {workoutPlan && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FitnessCenter color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5">
                {workoutPlan.name}
              </Typography>
              {workoutPlan.ai_generated && (
                <Chip
                  label={`AI: ${workoutPlan.ai_model}`}
                  color="primary"
                  size="small"
                  sx={{ ml: 2 }}
                />
              )}
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {workoutPlan.description}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Chip
                icon={<Timer />}
                label={`${workoutPlan.estimated_duration} minutes`}
                variant="outlined"
              />
              <Chip
                label={workoutPlan.difficulty}
                variant="outlined"
              />
              <Chip
                label={`${workoutPlan.exercises?.length || 0} exercises`}
                variant="outlined"
              />
            </Box>

            {/* Exercise List */}
            {workoutPlan.exercises && workoutPlan.exercises.map((exercise, index) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  onClick={() => exercise.exercise_id && loadExerciseDetails(exercise.exercise_id, exercise.name)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                      {index + 1}. {exercise.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                      {exercise.sets} sets × {exercise.reps} reps
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exercise.rest_seconds}s rest
                    </Typography>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {/* Exercise Instructions */}
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {exercise.instructions}
                      </Typography>
                      
                      {exercise.muscle_groups && (
                        <Box sx={{ mb: 2 }}>
                          {exercise.muscle_groups.map((muscle, idx) => (
                            <Chip
                              key={idx}
                              label={muscle}
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </Box>
                      )}
                    </Grid>

                    {/* Exercise Videos */}
                    {exerciseDetails[exercise.exercise_id]?.videos?.length > 0 && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>
                          <VideoLibrary sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Video Tutorials
                        </Typography>
                        <List dense>
                          {exerciseDetails[exercise.exercise_id].videos.slice(0, 2).map((video, idx) => (
                            <ListItem
                              key={idx}
                              sx={{ pl: 0 }}
                              button
                              component="a"
                              href={video.youtube_url}
                              target="_blank"
                            >
                              <ListItemText
                                primary={video.title}
                                secondary={`${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, '0')}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                    )}

                    {/* Exercise Tips */}
                    {exerciseDetails[exercise.exercise_id]?.tips?.length > 0 && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>
                          <Lightbulb sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Pro Tips
                        </Typography>
                        {exerciseDetails[exercise.exercise_id].tips.slice(0, 2).map((tip, idx) => (
                          <Card key={idx} variant="outlined" sx={{ mb: 1, p: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2">
                                  {tip.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {tip.content}
                                </Typography>
                              </Box>
                              <Box>
                                <IconButton
                                  size="small"
                                  onClick={() => handleTipInteraction(tip.id, 'like')}
                                >
                                  <ThumbUp fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleTipInteraction(tip.id, 'dislike')}
                                >
                                  <ThumbDown fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Card>
                        ))}
                      </Grid>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}

            {/* Action Buttons */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => {
                  // Navigate to workout execution or log workout
                  console.log('Start workout:', workoutPlan);
                }}
              >
                Start Workout
              </Button>
              <Button
                variant="outlined"
                onClick={handleGenerateWorkout}
              >
                Generate New Workout
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default WorkoutGenerator;