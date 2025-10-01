// src/pages/WorkoutGenerator.js - Updated with muscle group targeting

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
  Tooltip,
  LinearProgress,
  Divider,
  Paper
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
  Save,
  Refresh,
  Computer,
  Psychology,
  Settings,
  SmartToy,
  LocalFireDepartment,
  TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import AIModelBadge from '../components/AIModelBadge'; // Assuming you moved this to a separate component file as per the structure

// --- NEW: AVAILABLE MUSCLE GROUPS ---
const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];

function WorkoutGenerator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [duration, setDuration] = useState(45);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [exerciseDetails, setExerciseDetails] = useState({});
  const [generationTime, setGenerationTime] = useState(null);
  
  // --- NEW: STATE FOR MUSCLE SELECTION ---
  const [selectedMuscles, setSelectedMuscles] = useState([]);

  // --- NEW: HANDLER FOR TOGGLING MUSCLE SELECTION ---
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
        // --- NEW: ADD SELECTED MUSCLES TO THE REQUEST ---
        target_muscle_groups: selectedMuscles,
      };

      console.log('🚀 Generating workout with data:', requestData);
      
      const response = await apiService.generateWorkout(requestData);
      
      const endTime = Date.now();
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
      setGenerationTime(timeTaken);
      
      setWorkoutPlan(response);
      
      console.log('✅ Workout generated successfully!', response);
      setSuccess(`Workout generated in ${timeTaken}s by ${response.ai_model || 'AI'}!`);
      
    } catch (err) {
      console.error('❌ Error generating workout:', err);
      setError('Failed to generate workout. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const fetchExerciseDetails = async (exerciseName) => {
    try {
      console.log('🔍 Fetching details for exercise:', exerciseName);
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          🤖 AI Workout Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Get personalized workouts powered by advanced AI models
        </Typography>
      </Box>

      <Card sx={{ mb: 3, background: 'linear-gradient(45deg, #f5f5f5 30%, #e3f2fd 90%)' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🎯 Workout Preferences
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                type="number"
                label="Duration (minutes)"
                value={duration}
                onChange={(e) => setDuration(Math.max(15, Math.min(120, parseInt(e.target.value) || 45)))}
                fullWidth
                inputProps={{ min: 15, max: 120 }}
                helperText="15-120 minutes"
              />
            </Grid>
            
            <Grid item xs={12} sm={8}>
              <Button
                variant="contained"
                size="large"
                onClick={handleGenerateWorkout}
                disabled={generating}
                startIcon={generating ? <CircularProgress size={20} /> : <AutoAwesome />}
                sx={{ 
                  minWidth: 200,
                  height: 56,
                  background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF5252 30%, #26A69A 90%)',
                  }
                }}
              >
                {generating ? 'Generating AI Workout...' : '🚀 Generate AI Workout'}
              </Button>
            </Grid>
          </Grid>

          {/* --- NEW: UI FOR MUSCLE GROUP SELECTION --- */}
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              Target Muscle Groups (Optional)
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {muscleGroups.map((muscle) => (
                <Chip
                  key={muscle}
                  label={muscle}
                  clickable
                  onClick={() => handleMuscleToggle(muscle)}
                  color={selectedMuscles.includes(muscle) ? 'primary' : 'default'}
                  variant={selectedMuscles.includes(muscle) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>

          {user && (
            <Box mt={3}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                💪 Based on your profile:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {user.fitness_goal && (
                  <Chip 
                    icon={<TrendingUp />}
                    label={`Goal: ${user.fitness_goal.replace(/_/g, ' ')}`} 
                    size="small" 
                    variant="outlined" 
                  />
                )}
                {user.experience_level && (
                  <Chip 
                    icon={<FitnessCenter />}
                    label={`Level: ${user.experience_level}`} 
                    size="small" 
                    variant="outlined" 
                  />
                )}
              </Box>
            </Box>
          )}

          {generating && (
            <Box mt={3}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                🧠 AI is analyzing your profile and generating a personalized workout...
              </Typography>
              <LinearProgress 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                  }
                }} 
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {workoutPlan && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
              <Box flex={1}>
                <Typography variant="h4" gutterBottom>
                  🏋️ {workoutPlan.name || 'Your Personalized Workout'}
                </Typography>
                
                <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                  <Chip 
                    icon={<Timer />} 
                    label={`${workoutPlan.estimated_duration || duration} min`} 
                    color="primary" 
                  />
                  <Chip 
                    icon={<FitnessCenter />} 
                    label={workoutPlan.difficulty_level || 'Moderate'} 
                    color="secondary" 
                  />
                  {workoutPlan.estimated_calories && (
                    <Chip 
                      icon={<LocalFireDepartment />}
                      label={`~${workoutPlan.estimated_calories} cal`} 
                      color="error"
                      variant="outlined" 
                    />
                  )}
                  
                  <AIModelBadge 
                    aiModel={workoutPlan.ai_model}
                    aiGenerated={workoutPlan.ai_generated}
                    size="medium"
                  />
                  
                  {generationTime && (
                    <Chip 
                      label={`Generated in ${generationTime}s`} 
                      size="small"
                      variant="outlined"
                      color="info"
                    />
                  )}
                </Box>
              </Box>
              
              <Box display="flex" flexDirection="column" gap={1} ml={2}>
                <Button
                  variant="outlined"
                  onClick={handleSaveWorkout}
                  startIcon={<Save />}
                  size="small"
                >
                  Save Plan
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleStartWorkout}
                  startIcon={<PlayArrow />}
                  sx={{ 
                    minWidth: 160,
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                  }}
                >
                  Start Workout
                </Button>
              </Box>
            </Box>

            {workoutPlan.description && (
              <Typography variant="body1" color="text.secondary" paragraph>
                {workoutPlan.description}
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h5" gutterBottom>
              📋 Exercises ({workoutPlan.exercises?.length || 0})
            </Typography>
            
            {workoutPlan.exercises?.map((exercise, index) => (
              <Accordion 
                key={index} 
                sx={{ mb: 1, '&:before': { display: 'none' }, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px !important' }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center" width="100%">
                    <Typography 
                      variant="h6" 
                      sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}
                    >
                      {index + 1}
                    </Typography>
                    
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                      {exercise.name}
                    </Typography>
                    
                    <Box display="flex" gap={1} mr={2}>
                      <Chip label={`${exercise.sets} sets`} size="small" />
                      <Chip label={`${exercise.reps} reps`} size="small" />
                    </Box>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails>
                  {exercise.instructions && (
                    <Typography variant="body2" color="text.secondary" paragraph>
                      <strong>Instructions:</strong> {exercise.instructions}
                    </Typography>
                  )}

                  {/* --- NEW: DISPLAY TARGET MUSCLES FOR EACH EXERCISE --- */}
                  {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                        Target Muscles:
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {exercise.muscle_groups.map((muscle, idx) => (
                          <Chip key={idx} label={muscle} size="small" variant="outlined" color="primary" />
                        ))}
                      </Box>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default WorkoutGenerator;