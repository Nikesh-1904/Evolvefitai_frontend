// src/pages/FreestyleLog.js

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  Chip,
  IconButton,
  Alert,
  TextField,
  InputAdornment,
  Autocomplete,
  CircularProgress,
  Divider,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Timer
} from '@mui/material';
import {
  AddCircle,
  Delete,
  Notes,
  CheckCircle,
  Search,
  FitnessCenter
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const FreestyleLog = () => {
  const navigate = useNavigate();

  const [loggedExercises, setLoggedExercises] = useState([]);
  const [notes, setNotes] = useState('');
  const [startTime] = useState(new Date());
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDurationModalOpen, setDurationModalOpen] = useState(false);
  const [manualDuration, setManualDuration] = useState(45); // Default to 45 mins

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSearchChange = async (event, value) => {
    setInputValue(value);
    if (value && value.length > 2) {
      setLoading(true);
      try {
        const results = await apiService.getExerciseDetails(value);
        // Now, we expect results to be objects with exercise details
        const formattedOptions = Array.isArray(results)
          ? results.map(r => r.exercise).filter(Boolean) // Keep the whole exercise object
          : (results.exercise ? [results.exercise] : []);
        setOptions(formattedOptions);
      } catch (err) {
        console.error("Search failed:", err);
        setOptions([]);
      }
      setLoading(false);
    } else {
      setOptions([]);
    }
  };

  const handleAddExercise = (exercise) => {
    if (exercise && exercise.name && !loggedExercises.some(ex => ex.name === exercise.name)) {
      // Create the initial set based on exercise_type
      let initialSet = {};
      switch (exercise.exercise_type) {
        case 'REPS_ONLY':
          initialSet = { reps: 8 };
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
          initialSet = { reps: 8, weight: 0 };
          break;
      }

      setLoggedExercises([
        ...loggedExercises,
        { ...exercise, sets: [initialSet] }
      ]);
      setInputValue('');
      setOptions([]);
    }
  };

  const handleAddSet = (exerciseIndex) => {
    const updatedExercises = [...loggedExercises];
    const exercise = updatedExercises[exerciseIndex];
    const sets = exercise.sets;
    const previousSet = sets.length > 0 ? sets[sets.length - 1] : sets[0]; // Use first set as template if last is gone
    updatedExercises[exerciseIndex].sets.push({ ...previousSet });
    setLoggedExercises(updatedExercises);
  };

  const handleRemoveExercise = (exerciseIndex) => {
    const updatedExercises = [...loggedExercises];
    updatedExercises.splice(exerciseIndex, 1);
    setLoggedExercises(updatedExercises);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...loggedExercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    setLoggedExercises(updatedExercises);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...loggedExercises];
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    setLoggedExercises(updatedExercises);
  };

  const handleFinishWorkout = () => {
    // Basic check before opening the modal
    if (loggedExercises.length === 0) {
      setError('Please add at least one exercise before finishing.');
      return;
    }
    setError('');
    setDurationModalOpen(true); // Just open the modal
  };

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

  const handleSaveWithDuration = async () => {
    setIsSubmitting(true);
    setError('');

    const exercises_completed = loggedExercises.map(ex => ({
      name: ex.name,
      exercise_type: ex.exercise_type, // 👈 Add the type
      sets: ex.sets.map(set => {
        const cleanSet = {};
        // Clean the set to only include relevant data for its type
        switch (ex.exercise_type) {
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
                break;
        }
        return cleanSet;
      }),
    })).filter(ex => ex.sets.length > 0);

    // No need to check for empty exercises here, as it's done before opening the modal

    const logPayload = {
      duration_minutes: manualDuration, // Use the duration from the modal
      notes,
      exercises_completed,
      workout_date: new Date().toISOString(),
    };

    try {
      await apiService.logWorkout(logPayload);
      setDurationModalOpen(false); // Close modal on success
      navigate('/workout-history');
    } catch (err) {
      setError(err.message || 'Failed to save workout log.');
      setIsSubmitting(false); // Keep modal open to show the error
    }
  };
  
  // The JSX for the popup modal
  const renderDurationModal = () => (
    <Dialog open={isDurationModalOpen} onClose={() => setDurationModalOpen(false)}>
      <DialogTitle>Confirm Workout Duration</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Typography variant="body2" sx={{ mb: 2 }}>
          What was the total duration of your workout in minutes?
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Duration (minutes)"
          type="number"
          fullWidth
          variant="outlined"
          value={manualDuration}
          onChange={(e) => setManualDuration(parseInt(e.target.value, 10) || 0)}
          inputProps={{ min: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setDurationModalOpen(false)}>Cancel</Button>
        <Button 
          onClick={handleSaveWithDuration} 
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Save Workout'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Log a New Workout
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Add Exercise</Typography>
        <Autocomplete
          freeSolo
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          options={options}
          loading={loading}
          inputValue={inputValue}
          onInputChange={handleSearchChange}
          getOptionLabel={(option) => option.name || ""} // 👈 Tell Autocomplete how to display the object
          onChange={(event, newValue) => {
            handleAddExercise(newValue); // Pass the whole object
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for an exercise to add..."
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: (
                  <>{loading ? <CircularProgress color="inherit" size={20} /> : null}{params.InputProps.endAdornment}</>
                ),
              }}
            />
          )}
        />
      </Paper>

      {loggedExercises.length === 0 && (
          <Box textAlign="center" sx={{ color: 'text.secondary', my: 5 }}>
              <FitnessCenter sx={{ fontSize: 40, mb: 1 }} />
              <Typography>Your workout is empty.</Typography>
              <Typography>Use the search bar above to add your first exercise.</Typography>
          </Box>
      )}

      {loggedExercises.map((exercise, exIndex) => (
        <Card key={exIndex} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{exercise.name}</Typography>
              <IconButton onClick={() => handleRemoveExercise(exIndex)} color="error" aria-label="Remove Exercise"><Delete /></IconButton>
            </Box>
            <Divider sx={{ my: 1 }} />
            {exercise.sets.map((set, setIndex) => (
              <Grid container spacing={2} key={setIndex} alignItems="center" sx={{ mb: 1.5 }}>
                <Grid item xs={1}><Chip label={setIndex + 1} /></Grid>
                {renderSetInputs(exercise, exIndex, set, setIndex)}
                <Grid item xs={2}><IconButton onClick={() => handleRemoveSet(exIndex, setIndex)} color="error" aria-label="Remove Set"><Delete /></IconButton></Grid>                
              </Grid>
            ))}
            <Button onClick={() => handleAddSet(exIndex)} startIcon={<AddCircle />} variant="text" fullWidth sx={{ mt: 1 }}>Add Set</Button>
          </CardContent>
        </Card>
      ))}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            label="Workout Notes"
            multiline
            rows={3}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            InputProps={{ startAdornment: <Notes sx={{ mr: 1, color: 'text.secondary' }} /> }}
          />
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleFinishWorkout} color="primary" variant="contained" size="large" startIcon={<CheckCircle />} disabled={isSubmitting || loggedExercises.length === 0}>
          {isSubmitting ? 'Saving...' : 'Finish & Log Workout'}
        </Button>
      </Box>

      {renderDurationModal()} {/* 👈 ADD THIS LINE */}
    </Container>
  );
};

export default FreestyleLog;