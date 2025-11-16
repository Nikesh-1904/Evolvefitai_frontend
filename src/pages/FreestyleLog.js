// src/pages/FreestyleLog.js - Modern AI Fitness Workout Logger

import React, { useState } from 'react';
import {
  Typography,
  Box,
  Chip,
  IconButton,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Avatar,
  Fade,
  Slide,
  Zoom,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Delete,
  Notes,
  CheckCircle,
  Search,
  FitnessCenter,
  Timer,
  Speed,
  MonitorWeight,
  DirectionsRun,
  SelfImprovement,
  Add,
  Remove,
  Mic,
  Videocam,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { workoutService } from '../services/api';

// Import our modern components
import ModernCard from '../components/ModernCard';
import ModernInput from '../components/ModernInput';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';
import { PageContainer, Alert } from '../components/design-system';
import VoiceWorkoutLogger from '../components/VoiceWorkoutLogger';
import FormCorrectionAI from '../components/FormCorrectionAI';

const FreestyleLog = () => {
  const navigate = useNavigate();
  
  // State management (preserving all original functionality)
  const [loggedExercises, setLoggedExercises] = useState([]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDurationModalOpen, setDurationModalOpen] = useState(false);
  const [manualDuration, setManualDuration] = useState(45);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isVoiceLoggerOpen, setVoiceLoggerOpen] = useState(false);
  const [isFormAnalysisOpen, setFormAnalysisOpen] = useState(false);

  // All original handlers preserved exactly
  const handleSearchChange = async (event, value) => {
    setInputValue(value);
    if (value && value.length > 2) {
      setLoading(true);
      try {
        const results = await workoutService.getExerciseDetails(value);
        const formattedOptions = Array.isArray(results)
          ? results.map(r => r.exercise).filter(Boolean)
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

  const handleVoiceExerciseLogged = (parsedCommand) => {
    // Check if exercise already exists
    const existingExerciseIndex = loggedExercises.findIndex(
      ex => ex.name.toLowerCase() === parsedCommand.exercise.toLowerCase()
    );

    if (existingExerciseIndex >= 0) {
      // Add set to existing exercise
      const updatedExercises = [...loggedExercises];
      updatedExercises[existingExerciseIndex].sets.push(parsedCommand.sets[0]);
      setLoggedExercises(updatedExercises);
    } else {
      // Add new exercise
      setLoggedExercises([
        ...loggedExercises,
        {
          name: parsedCommand.exercise,
          exercise_type: parsedCommand.exercise_type,
          sets: parsedCommand.sets
        }
      ]);
    }
  };

  const handleFormAnalyzed = (analysis) => {
    setError('');
    console.log('Form analysis:', analysis);
    // You can display a success message or add the analyzed exercise to the log
  };

  const handleAddSet = (exerciseIndex) => {
    const updatedExercises = [...loggedExercises];
    const exercise = updatedExercises[exerciseIndex];
    const sets = exercise.sets;
    const previousSet = sets.length > 0 ? sets[sets.length - 1] : sets[0];
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
    if (loggedExercises.length === 0) {
      setError('Please add at least one exercise before finishing.');
      return;
    }
    setError('');
    setDurationModalOpen(true);
  };

  const handleSaveWithDuration = async () => {
    setIsSubmitting(true);
    setError('');
    
    const exercises_completed = loggedExercises.map(ex => ({
      name: ex.name,
      exercise_type: ex.exercise_type,
      sets: ex.sets.map(set => {
        const cleanSet = {};
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

    const logPayload = {
      duration_minutes: manualDuration,
      notes,
      exercises_completed,
      workout_date: new Date().toISOString(),
    };

    try {
      await workoutService.logWorkout(logPayload);
      setDurationModalOpen(false);
      navigate('/workout-history');
    } catch (err) {
      setError(err.message || 'Failed to save workout log.');
      setIsSubmitting(false);
    }
  };

  // Get exercise type icon and color
  const getExerciseTypeInfo = (exerciseType) => {
    switch (exerciseType) {
      case 'WEIGHT_BASED':
        return { icon: <MonitorWeight />, color: '#00D4FF', label: 'Weight Based' };
      case 'REPS_ONLY':
        return { icon: <FitnessCenter />, color: '#10B981', label: 'Reps Only' };
      case 'DURATION':
        return { icon: <Timer />, color: '#7C3AED', label: 'Duration' };
      case 'DISTANCE_DURATION':
        return { icon: <DirectionsRun />, color: '#FF3366', label: 'Distance + Time' };
      case 'QUALITATIVE':
        return { icon: <SelfImprovement />, color: '#F59E0B', label: 'Qualitative' };
      default:
        return { icon: <FitnessCenter />, color: '#94A3B8', label: 'Exercise' };
    }
  };

  const renderSetInputs = (exercise, exIndex, set, setIndex) => {
    const typeInfo = getExerciseTypeInfo(exercise.exercise_type);
    
    switch (exercise.exercise_type) {
      case 'REPS_ONLY':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ModernInput
              label="Reps"
              type="number"
              value={set.reps || ''}
              onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
            />
          </Box>
        );

      case 'DURATION':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ModernInput
              label="Duration (seconds)"
              type="number"
              value={set.duration_seconds || ''}
              onChange={(e) => handleSetChange(exIndex, setIndex, 'duration_seconds', e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              endText="sec"
            />
          </Box>
        );

      case 'DISTANCE_DURATION':
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ModernInput
              label="Distance (km)"
              type="number"
              value={set.distance_km || ''}
              onChange={(e) => handleSetChange(exIndex, setIndex, 'distance_km', e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              endText="km"
            />
            <ModernInput
              label="Duration (sec)"
              type="number"
              value={set.duration_seconds || ''}
              onChange={(e) => handleSetChange(exIndex, setIndex, 'duration_seconds', e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              endText="sec"
            />
          </Box>
        );

      case 'QUALITATIVE':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ModernInput
              label="Notes"
              value={set.notes || ''}
              onChange={(e) => handleSetChange(exIndex, setIndex, 'notes', e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              placeholder="e.g., Vinyasa flow, focused on hips"
            />
          </Box>
        );

      case 'WEIGHT_BASED':
      default:
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ModernInput
              label="Weight (kg)"
              type="number"
              value={set.weight || ''}
              onChange={(e) => handleSetChange(exIndex, setIndex, 'weight', e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              endText="kg"
            />
            <ModernInput
              label="Reps"
              type="number"
              value={set.reps || ''}
              onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
            />
          </Box>
        );
    }
  };

  // Duration modal
  const renderDurationModal = () => (
    <Dialog
      open={isDurationModalOpen}
      onClose={() => setDurationModalOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(26, 31, 46, 0.95)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
        }
      }}
    >
      <DialogTitle sx={{ 
        fontFamily: '"Gravitas One", "Montserrat", sans-serif',
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'center',
      }}>
        <Avatar sx={{ 
          width: 60, 
          height: 60,
          mx: 'auto',
          mb: 2,
          background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
        }}>
          <Timer />
        </Avatar>
        Confirm Workout Duration
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Typography variant="body1" sx={{ color: '#CBD5E1', mb: 3 }}>
          What was the total duration of your workout in minutes?
        </Typography>
        
        <ModernInput
          label="Duration (minutes)"
          type="number"
          value={manualDuration}
          onChange={(e) => setManualDuration(parseInt(e.target.value, 10) || 0)}
          fullWidth
          variant="outlined"
          inputProps={{ min: 1 }}
        />
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 2, justifyContent: 'center' }}>
        <SecondaryButton onClick={() => setDurationModalOpen(false)}>
          Cancel
        </SecondaryButton>
        <PrimaryButton 
          onClick={handleSaveWithDuration}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Workout'}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );

  // Calculate workout progress
  const totalSets = loggedExercises.reduce((sum, ex) => sum + ex.sets.length, 0);

  return (
    <PageContainer
      title="Log Your Workout"
      subtitle="Track your exercises, sets, and reps with our smart logging system"
      icon="💪"
      maxWidth="lg"
    >
      {/* Progress Indicator */}
      {loggedExercises.length > 0 && (
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', mb: 4 }}>
          <Chip
            icon={<FitnessCenter />}
            label={`${loggedExercises.length} exercise${loggedExercises.length !== 1 ? 's' : ''}`}
            sx={{
              background: 'rgba(0, 212, 255, 0.1)',
              color: '#00D4FF',
              fontWeight: 600,
            }}
          />
          <Chip
            icon={<Speed />}
            label={`${totalSets} set${totalSets !== 1 ? 's' : ''}`}
            sx={{
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10B981',
              fontWeight: 600,
            }}
          />
        </Stack>
      )}

      {/* Error Alert */}
      {error && !isDurationModalOpen && (
        <Alert severity="error" closable sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Exercise Search */}
      <Fade in timeout={700}>
        <Box>
          <ModernCard
              title="Add Exercise"
              subtitle="Search from our comprehensive exercise database or use voice commands"
              variant="glass"
              sx={{ mb: 4 }}
              action={
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Voice Commands - Log workouts hands-free" arrow>
                    <IconButton
                      onClick={() => setVoiceLoggerOpen(true)}
                      sx={{
                        background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                        color: '#FFFFFF',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #00BFEA 0%, #6B2FD4 100%)',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Mic />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="AI Form Check - Analyze your exercise form" arrow>
                    <IconButton
                      onClick={() => setFormAnalysisOpen(true)}
                      sx={{
                        background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
                        color: '#FFFFFF',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #6B2FD4 0%, #9673E6 100%)',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Videocam />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            >
              <Autocomplete
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                options={options}
                loading={loading}
                inputValue={inputValue}
                onInputChange={handleSearchChange}
                getOptionLabel={(option) => option.name || ""}
                onChange={(event, newValue) => {
                  handleAddExercise(newValue);
                }}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    py: 1.5,
                    '&:hover': {
                      background: 'rgba(0, 212, 255, 0.1)',
                    }
                  }}>
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32,
                      background: `linear-gradient(135deg, ${getExerciseTypeInfo(option.exercise_type).color} 0%, ${getExerciseTypeInfo(option.exercise_type).color}80 100%)`,
                    }}>
                      {getExerciseTypeInfo(option.exercise_type).icon}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                        {option.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        {getExerciseTypeInfo(option.exercise_type).label}
                      </Typography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <ModernInput
                    {...params}
                    label="Search exercises"
                    placeholder="Type an exercise name..."
                    variant="outlined"
                    startIcon={<Search />}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading && <LinearProgress sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </ModernCard>
          </Box>
        </Fade>

      {/* Empty State */}
      {loggedExercises.length === 0 && (
        <Slide direction="up" in timeout={900}>
          <Box>
              <ModernCard
                variant="glass"
                sx={{ textAlign: 'center', py: 6 }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '30px',
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00D4FF',
                    fontSize: '3rem',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <FitnessCenter sx={{ fontSize: '3rem' }} />
                </Box>
                
                <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 1 }}>
                  Your workout is empty
                </Typography>
                
                <Typography variant="body1" sx={{ color: '#94A3B8' }}>
                  Use the search bar above to add your first exercise
                </Typography>
              </ModernCard>
            </Box>
          </Slide>
        )}

      {/* Exercise Cards */}
      <Stack spacing={3}>
          {loggedExercises.map((exercise, exIndex) => {
            const typeInfo = getExerciseTypeInfo(exercise.exercise_type);
            
            return (
              <Fade key={exIndex} in timeout={500 + exIndex * 100}>
                <Box>
                  <ModernCard variant="glass">
                    {/* Exercise Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          width: 48, 
                          height: 48,
                          background: `linear-gradient(135deg, ${typeInfo.color} 0%, ${typeInfo.color}80 100%)`,
                        }}>
                          {typeInfo.icon}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                              fontWeight: 400,
                              color: '#FFFFFF',
                            }}
                          >
                            {exercise.name}
                          </Typography>
                          <Chip
                            label={typeInfo.label}
                            size="small"
                            sx={{ 
                              background: `${typeInfo.color}20`,
                              color: typeInfo.color,
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                      </Box>
                      
                      <IconButton 
                        onClick={() => handleRemoveExercise(exIndex)} 
                        sx={{ 
                          color: '#FF3366',
                          '&:hover': {
                            background: 'rgba(255, 51, 102, 0.1)',
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>

                    {/* Sets */}
                    <Stack spacing={2}>
                      {exercise.sets.map((set, setIndex) => (
                        <Box
                          key={setIndex}
                          sx={{
                            p: 3,
                            borderRadius: '16px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#CBD5E1', fontWeight: 600 }}>
                              Set {setIndex + 1}
                            </Typography>
                            {exercise.sets.length > 1 && (
                              <IconButton 
                                onClick={() => handleRemoveSet(exIndex, setIndex)} 
                                size="small"
                                sx={{ 
                                  color: '#FF3366',
                                  '&:hover': {
                                    background: 'rgba(255, 51, 102, 0.1)',
                                  }
                                }}
                              >
                                <Remove />
                              </IconButton>
                            )}
                          </Box>
                          
                          {renderSetInputs(exercise, exIndex, set, setIndex)}
                        </Box>
                      ))}
                      
                      {/* Add Set Button */}
                      <SecondaryButton
                        onClick={() => handleAddSet(exIndex)}
                        startIcon={<Add />}
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Add Set
                      </SecondaryButton>
                    </Stack>
                  </ModernCard>
                </Box>
              </Fade>
            );
          })}
      </Stack>

      {/* Workout Notes */}
      {loggedExercises.length > 0 && (
        <Fade in timeout={1000}>
          <Box sx={{ mt: 4 }}>
              <ModernCard
                title="Workout Notes"
                subtitle="Add any additional notes about your session"
                variant="glass"
              >
                <ModernInput
                  label="Notes (optional)"
                  multiline
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did the workout feel? Any observations or achievements..."
                  variant="outlined"
                  fullWidth
                  startIcon={<Notes />}
                />
              </ModernCard>
            </Box>
          </Fade>
        )}

      {/* Finish Workout Button */}
      {loggedExercises.length > 0 && (
        <Zoom in timeout={1200}>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
              <PrimaryButton
                onClick={handleFinishWorkout}
                disabled={isSubmitting || loggedExercises.length === 0}
                size="large"
                startIcon={<CheckCircle />}
                sx={{
                  minWidth: '250px',
                  py: 2,
                  px: 4,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                }}
              >
                {isSubmitting ? 'Saving...' : 'Finish & Log Workout'}
              </PrimaryButton>
            </Box>
          </Zoom>
        )}

      {/* Duration Modal */}
      {renderDurationModal()}

      {/* Voice Workout Logger */}
      <VoiceWorkoutLogger
        isOpen={isVoiceLoggerOpen}
        onClose={() => setVoiceLoggerOpen(false)}
        onExerciseLogged={handleVoiceExerciseLogged}
      />

      {/* Form Correction AI */}
      <FormCorrectionAI
        isOpen={isFormAnalysisOpen}
        onClose={() => setFormAnalysisOpen(false)}
        onFormAnalyzed={handleFormAnalyzed}
      />
    </PageContainer>
  );
};

export default FreestyleLog;