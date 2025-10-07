// src/pages/WorkoutPlanDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Timer,
  FitnessCenter,
  PlayArrow,
  ExpandMore,
  VideoLibrary,
  Lightbulb,
  ThumbUp,
  ThumbDown
} from '@mui/icons-material';
import apiService from '../services/apiService';
import AIModelBadge from '../components/AIModelBadge';

function WorkoutPlanDetail() {
  const { planId } = useParams();
  const navigate = useNavigate();
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
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <Box>
              <Typography variant="h4" gutterBottom>🏋️ {plan.name}</Typography>
              <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                <Chip icon={<Timer />} label={`${plan.estimated_duration} min`} />
                <Chip icon={<FitnessCenter />} label={plan.difficulty} />
                {plan.ai_generated && <AIModelBadge aiModel={plan.ai_model} aiGenerated={plan.ai_generated} />}
              </Box>
            </Box>
            <Button variant="contained" size="large" onClick={handleStartWorkout} startIcon={<PlayArrow />}>
              Start Workout
            </Button>
          </Box>
          <Typography variant="body1" color="text.secondary" paragraph>{plan.description}</Typography>
          
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>📋 Exercises ({plan.exercises?.length || 0})</Typography>
          {plan.exercises?.map((exercise, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>{index + 1}. {exercise.name}</Typography>
                <Chip label={`${exercise.sets} sets x ${exercise.reps} reps`} size="small" />
              </AccordionSummary>
              <AccordionDetails>
                 {/* This is where the video/tips logic from WorkoutGenerator would go */}
                 <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="body2" color="text.secondary">{exercise.instructions}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                       <Button fullWidth variant="outlined" startIcon={<VideoLibrary />} onClick={() => fetchExerciseDetails(exercise.name)}>
                         Load Video & Tips
                       </Button>
                    </Grid>
                 </Grid>

                 {exerciseDetails[exercise.name] && (
                    <Box mt={2} p={2} borderRadius={2} sx={{backgroundColor: 'action.hover'}}>
                       {/* Video and Tip rendering logic */}
                       <Typography variant="subtitle2">Video/Tips for {exercise.name} appear here.</Typography>
                    </Box>
                 )}
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>
    </Container>
  );
}

export default WorkoutPlanDetail;