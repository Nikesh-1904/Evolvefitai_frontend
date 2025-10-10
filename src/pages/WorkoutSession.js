// src/pages/WorkoutSession.js - Reworked for data logging

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  IconButton,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  InputAdornment,
  Timer
} from '@mui/material';
import {
  SkipNext,
  SkipPrevious,
  CheckCircle,
  FitnessCenter,
  AddCircle,
  Delete,
  Notes,
  Warning,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const WorkoutSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const workoutPlan = location.state?.workoutPlan;

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [loggedData, setLoggedData] = useState({});
  const [notes, setNotes] = useState('');
  const [startTime] = useState(new Date());
  const [error, setError] = useState('');
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!workoutPlan) {
      navigate('/workout-generator');
    } else {
      // Pre-populate one set for each exercise based on its type
      const initialData = {};
      workoutPlan.exercises.forEach((exercise, index) => {
        let initialSet = {};
        const reps = parseInt(String(exercise.reps).split('-')[0]) || 8;

        switch (exercise.exercise_type) {
            case 'REPS_ONLY':
                initialSet = { reps };
                break;
            case 'DURATION':
            case 'QUALITATIVE':
                initialSet = { duration_seconds: 60 };
                break;
            case 'DISTANCE_DURATION':
                initialSet = { distance_km: 1, duration_seconds: 300 };
                break;
            case 'WEIGHT_BASED':
            default:
                initialSet = { reps: reps, weight: 0 };
                break;
        }
        initialData[index] = [initialSet];
      });
      setLoggedData(initialData);
    }
  }, [workoutPlan, navigate]);

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updatedSets = [...(loggedData[exerciseIndex] || [])];
    if (!updatedSets[setIndex]) updatedSets[setIndex] = { reps: '', weight: '' };
    updatedSets[setIndex][field] = value;
    setLoggedData({ ...loggedData, [exerciseIndex]: updatedSets });
  };

  const handleAddSet = (exerciseIndex) => {
    const sets = loggedData[exerciseIndex] || [];
    const previousSet = sets.length > 0 ? sets[sets.length - 1] : null;
    const planExercise = workoutPlan.exercises[exerciseIndex];
    
    const newSet = {
      reps: previousSet ? previousSet.reps : (parseInt(String(planExercise.reps).split('-')[0]) || 8),
      weight: previousSet ? previousSet.weight : 0,
    };

    setLoggedData({ ...loggedData, [exerciseIndex]: [...sets, newSet] });
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updatedSets = [...(loggedData[exerciseIndex] || [])];
    updatedSets.splice(setIndex, 1);
    setLoggedData({ ...loggedData, [exerciseIndex]: updatedSets });
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < workoutPlan.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const handleFinishWorkout = async () => {
    setIsSubmitting(true);
    setError('');

    const exercises_completed = workoutPlan.exercises
      .map((exercise, index) => ({
        name: exercise.name,
        exercise_type: exercise.exercise_type || 'WEIGHT_BASED', // Pass the type
        sets: (loggedData[index] || []).map(set => {
          // This cleaning logic can be copied from FreestyleLog.js
          const cleanSet = {};
          switch (exercise.exercise_type) {
            case 'WEIGHT_BASED':
              cleanSet.reps = parseInt(set.reps, 10) || 0;
              cleanSet.weight = parseFloat(set.weight) || 0;
              break;
            case 'REPS_ONLY':
              cleanSet.reps = parseInt(set.reps, 10) || 0;
              break;
            case 'DURATION':
              cleanSet.duration_seconds = parseInt(set.duration_seconds, 10) || 0;
              break;
            case 'DISTANCE_DURATION':
              cleanSet.duration_seconds = parseInt(set.duration_seconds, 10) || 0;
              cleanSet.distance_km = parseFloat(set.distance_km) || 0;
              break;
            case 'QUALITATIVE':
              cleanSet.duration_seconds = parseInt(set.duration_seconds, 10) || 0;
              cleanSet.notes = set.notes || '';
              break;
            default:
              cleanSet.reps = parseInt(set.reps, 10) || 0;
              cleanSet.weight = parseFloat(set.weight) || 0;
              break;
          }
          return cleanSet;
        }),
      }))
      .filter(exercise => exercise.sets.length > 0);  // Only include exercises with at least one logged set

    if (exercises_completed.length === 0) {
      setError('Please log at least one set with reps to finish the workout.');
      setIsSubmitting(false);
      return;
    }
    
    const duration_minutes = Math.round((new Date() - startTime) / (1000 * 60));

    const logPayload = {
      workout_plan_id: workoutPlan.id,
      duration_minutes,
      notes,
      exercises_completed,
      workout_date: new Date().toISOString(),
    };

    try {
      await apiService.logWorkout(logPayload);
      navigate('/workout-history');
    } catch (err) {
      setError(err.message || 'Failed to save workout log. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!workoutPlan) {
    return null; // Redirecting in useEffect
  }

  const currentExercise = workoutPlan.exercises[currentExerciseIndex];
  const currentLoggedSets = loggedData[currentExerciseIndex] || [];

  const renderSetInputs = (exercise, exIndex, set, setIndex) => {
    switch (exercise.exercise_type) {
      case 'REPS_ONLY':
        return (
          <Grid item xs={9}>
            <TextField label="Reps" type="number" value={set.reps || ''} onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)} fullWidth />
          </Grid>
        );
      case 'DURATION':
        return (
          <Grid item xs={9}>
            <TextField label="Duration" type="number" value={set.duration_seconds || ''} onChange={(e) => handleSetChange(exIndex, setIndex, 'duration_seconds', e.target.value)} fullWidth InputProps={{ endAdornment: <InputAdornment position="end">sec</InputAdornment> }} />
          </Grid>
        );
      case 'DISTANCE_DURATION':
        return (
          <>
            <Grid item xs={4.5}><TextField label="Distance" type="number" value={set.distance_km || ''} onChange={(e) => handleSetChange(exIndex, setIndex, 'distance_km', e.target.value)} fullWidth InputProps={{ endAdornment: <InputAdornment position="end">km</InputAdornment> }} /></Grid>
            <Grid item xs={4.5}><TextField label="Duration" type="number" value={set.duration_seconds || ''} onChange={(e) => handleSetChange(exIndex, setIndex, 'duration_seconds', e.target.value)} fullWidth InputProps={{ endAdornment: <InputAdornment position="end">sec</InputAdornment> }} /></Grid>
          </>
        );
      case 'QUALITATIVE':
         return (
          <Grid item xs={9}>
            <TextField label="Notes for this activity" type="text" value={set.notes || ''} onChange={(e) => handleSetChange(exIndex, setIndex, 'notes', e.target.value)} fullWidth placeholder="e.g., Vinyasa flow, focused on hips"/>
          </Grid>
        );
      case 'WEIGHT_BASED':
      default:
        return (
          <>
            <Grid item xs={4.5}><TextField label="Weight" type="number" value={set.weight || ''} onChange={(e) => handleSetChange(exIndex, setIndex, 'weight', e.target.value)} fullWidth InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }} /></Grid>
            <Grid item xs={4.5}><TextField label="Reps" type="number" value={set.reps || ''} onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)} fullWidth /></Grid>
          </>
        );
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Log: {workoutPlan.name}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <IconButton onClick={handlePrevExercise} disabled={currentExerciseIndex === 0}>
              <SkipPrevious />
            </IconButton>
            <Box textAlign="center">
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{currentExercise.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Exercise {currentExerciseIndex + 1} of {workoutPlan.exercises.length}
              </Typography>
              <Chip label={`AI Target: ${currentExercise.sets} sets of ${currentExercise.reps} reps`} sx={{ mt: 1 }} />
            </Box>
            <IconButton onClick={handleNextExercise} disabled={currentExerciseIndex === workoutPlan.exercises.length - 1}>
              <SkipNext />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Your Performance</Typography>

          {currentLoggedSets.map((set, setIndex) => (
            <Grid container spacing={2} key={setIndex} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={1}>
                <Chip label={setIndex + 1} color="primary" />
              </Grid>
              {renderSetInputs(currentExercise, currentExerciseIndex, set, setIndex)}
              
              <Grid item xs={2}>
                <IconButton onClick={() => handleRemoveSet(currentExerciseIndex, setIndex)} color="error" aria-label="Remove Set">
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          {currentLoggedSets.length === 0 && (
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ my: 2 }}>
                Click "Add Set" to log your performance.
            </Typography>
          )}

          <Button 
            onClick={() => handleAddSet(currentExerciseIndex)} 
            startIcon={<AddCircle />}
            variant="outlined"
            fullWidth
            sx={{ mt: 1 }}
          >
            Add Set
          </Button>

        </CardContent>
      </Card>
      
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <TextField
            label="Workout Notes"
            multiline
            rows={3}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about your workout..."
            InputProps={{ startAdornment: <Notes sx={{ mr: 1, color: 'text.secondary' }} /> }}
          />
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button onClick={() => setShowQuitDialog(true)} color="error" variant="text" startIcon={<Warning />}>
          Cancel Workout
        </Button>
        <Button onClick={handleFinishWorkout} color="primary" variant="contained" size="large" startIcon={<CheckCircle />} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Finish & Log Workout'}
        </Button>
      </Box>

      {/* Exercise List */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Workout Plan
          </Typography>
          <List dense>
            {workoutPlan.exercises.map((exercise, index) => (
              <ListItem
                key={index}
                button
                onClick={() => setCurrentExerciseIndex(index)}
                sx={{
                  bgcolor: index === currentExerciseIndex ? 'action.selected' : 'transparent',
                  borderRadius: 1,
                  mb: 0.5
                }}
              >
                <ListItemIcon>
                  {loggedData[index] && loggedData[index].length > 0 ? (
                    <CheckCircle color="success" />
                  ) : (
                    <FitnessCenter color={index === currentExerciseIndex ? 'primary' : 'disabled'} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={exercise.name}
                  secondary={`${exercise.sets} sets × ${exercise.reps}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Dialog open={showQuitDialog} onClose={() => setShowQuitDialog(false)}>
        <DialogTitle>Cancel Workout?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this session? Any logged data for this workout will be lost.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQuitDialog(false)}>Continue Logging</Button>
          <Button onClick={() => navigate('/dashboard')} color="error">
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WorkoutSession;