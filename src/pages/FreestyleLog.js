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
  DialogTitle
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
        const formattedOptions = Array.isArray(results) 
          ? results.map(r => r.exercise ? r.exercise.name : r.name).filter(Boolean)
          : (results.exercise ? [results.exercise.name] : []);
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

  const handleAddExercise = (exerciseName) => {
    if (exerciseName && !loggedExercises.some(ex => ex.name === exerciseName)) {
      setLoggedExercises([
        ...loggedExercises,
        { name: exerciseName, sets: [{ reps: 8, weight: 0 }] }
      ]);
      setInputValue(''); 
      setOptions([]);
    }
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

  const handleAddSet = (exerciseIndex) => {
    const updatedExercises = [...loggedExercises];
    const sets = updatedExercises[exerciseIndex].sets;
    const previousSet = sets.length > 0 ? sets[sets.length - 1] : { reps: 8, weight: 0 };
    updatedExercises[exerciseIndex].sets.push({ ...previousSet });
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

  const handleSaveWithDuration = async () => {
    setIsSubmitting(true);
    setError('');

    const exercises_completed = loggedExercises.map(ex => ({
      name: ex.name,
      sets: ex.sets.map(set => ({
        reps: parseInt(set.reps, 10) || 0,
        weight: parseFloat(set.weight) || 0,
      })),
    })).filter(ex => ex.sets.length > 0 && ex.sets.some(s => s.reps > 0));

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
          onChange={(event, newValue) => {
            handleAddExercise(newValue);
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
                <Grid item xs={5}><TextField label="Weight" type="number" value={set.weight} onChange={(e) => handleSetChange(exIndex, setIndex, 'weight', e.target.value)} fullWidth InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }} /></Grid>
                <Grid item xs={4}><TextField label="Reps" type="number" value={set.reps} onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)} fullWidth /></Grid>
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