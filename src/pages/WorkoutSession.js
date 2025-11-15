// src/pages/WorkoutSession.js - Modern AI Fitness Active Workout Session

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Autocomplete,
  Stack,
  Avatar,
  LinearProgress,
  Fade,
  Slide,
  Zoom,
} from '@mui/material';
import {
  SkipNext,
  SkipPrevious,
  CheckCircle,
  FitnessCenter,
  Delete,
  Notes,
  Warning,
  PlayArrow,
  Timer,
  Speed,
  MonitorWeight,
  DirectionsRun,
  SelfImprovement,
  VideoLibrary,
  Add,
  Remove,
  OpenInNew,
  Close,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

// Import our modern components
import ModernCard from '../components/ModernCard';
import ModernInput from '../components/ModernInput';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';
import ContextualHelp from '../components/ContextualHelp';
import { PageContainer, Alert } from '../components/design-system';

const WorkoutSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const workoutPlan = location.state?.workoutPlan;
  
  // State management (preserving all original functionality)
  const [editablePlan, setEditablePlan] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [loggedData, setLoggedData] = useState({});
  const [notes, setNotes] = useState('');
  const [startTime] = useState(new Date());
  const [error, setError] = useState('');
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDurationModalOpen, setDurationModalOpen] = useState(false);
  const [manualDuration, setManualDuration] = useState(45);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentExerciseVideos, setCurrentExerciseVideos] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');

  // All original useEffect and handlers preserved exactly
  useEffect(() => {
    if (!workoutPlan) {
      navigate('/workout-generator');
    } else {
      setEditablePlan(workoutPlan);
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
    const planExercise = editablePlan.exercises[exerciseIndex];
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
    if (currentExerciseIndex < editablePlan.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const handleFinishWorkout = () => {
    const exercises_completed = editablePlan.exercises
      .map((exercise, index) => ({
        name: exercise.name,
        sets: loggedData[index] || [],
      }))
      .filter(exercise => exercise.sets.length > 0);

    if (exercises_completed.length === 0) {
      setError('Please log at least one set to finish the workout.');
      return;
    }

    setError('');
    setDurationModalOpen(true);
  };

  const handleSaveWithDuration = async () => {
    setIsSubmitting(true);
    setError('');
    
    const exercises_completed = editablePlan.exercises
      .map((exercise, index) => ({
        name: exercise.name,
        exercise_type: exercise.exercise_type || 'WEIGHT_BASED',
        sets: (loggedData[index] || []).map(set => {
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
      .filter(exercise => exercise.sets.length > 0);

    const logPayload = {
      workout_plan_id: editablePlan.id,
      duration_minutes: manualDuration,
      notes,
      exercises_completed,
      workout_date: new Date().toISOString(),
    };

    try {
      await apiService.logWorkout(logPayload);
      setDurationModalOpen(false);
      navigate('/workout-history');
    } catch (err) {
      setError(err.message || 'Failed to save workout log.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveExercise = (indexToRemove) => {
    if (!editablePlan) return;
    const newExercises = editablePlan.exercises.filter((_, index) => index !== indexToRemove);
    setEditablePlan(prev => ({ ...prev, exercises: newExercises }));
    if (currentExerciseIndex >= newExercises.length) {
      setCurrentExerciseIndex(Math.max(0, newExercises.length - 1));
    }
  };

  const handleWatchVideo = async (exerciseName) => {
    setVideoModalOpen(true);
    setVideoLoading(true);
    try {
      const details = await apiService.getExerciseDetails(exerciseName);
      setCurrentExerciseVideos(details.videos || []);
    } catch (error) {
      console.error("Failed to fetch video details:", error);
      setCurrentExerciseVideos([]);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleSearchChange = async (event, value) => {
    setSearchInputValue(value);
    if (value && value.length > 2) {
      setSearchLoading(true);
      try {
        const results = await apiService.getExerciseDetails(value);
        const formattedOptions = Array.isArray(results)
          ? results.map(r => r.exercise).filter(Boolean)
          : (results.exercise ? [results.exercise] : []);
        setSearchOptions(formattedOptions);
      } catch (err) {
        console.error("Search failed:", err);
        setSearchOptions([]);
      }
      setSearchLoading(false);
    } else {
      setSearchOptions([]);
    }
  };

  const handleSelectNewExercise = (exercise) => {
    if (exercise && exercise.name) {
      const newExerciseObject = {
        ...exercise,
        sets: exercise.sets || 1,
        reps: exercise.reps || '8-12',
      };
      setEditablePlan(prev => ({ ...prev, exercises: [...prev.exercises, newExerciseObject] }));
      const newIndex = editablePlan.exercises.length;
      const initialSet = { reps: 8, weight: 0 };
      setLoggedData(prev => ({ ...prev, [newIndex]: [initialSet] }));
      setIsAddingExercise(false);
      setSearchInputValue('');
      setSearchOptions([]);
    }
  };

  // Get exercise type info
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
    switch (exercise.exercise_type) {
      case 'REPS_ONLY':
        return (
          <ModernInput
            label="Reps"
            type="number"
            value={set.reps || ''}
            onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
          />
        );

      case 'DURATION':
        return (
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
          <ModernInput
            label="Notes"
            value={set.notes || ''}
            onChange={(e) => handleSetChange(exIndex, setIndex, 'notes', e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            placeholder="e.g., Vinyasa flow, focused on hips"
          />
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

  if (!editablePlan) {
    return null;
  }

  const currentExercise = editablePlan.exercises[currentExerciseIndex];
  const currentLoggedSets = loggedData[currentExerciseIndex] || [];
  const currentTypeInfo = getExerciseTypeInfo(currentExercise.exercise_type);
  const progress = ((currentExerciseIndex + 1) / editablePlan.exercises.length) * 100;
  const totalSets = Object.values(loggedData).flat().length;

  return (
    <PageContainer
      title={editablePlan.name}
      subtitle="Active Workout Session"
      icon="🏋️"
      maxWidth="lg"
    >
      {/* Progress Indicators */}
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', mb: 3 }}>
        <Chip
          icon={<FitnessCenter />}
          label={`Exercise ${currentExerciseIndex + 1}/${editablePlan.exercises.length}`}
          sx={{
            background: 'rgba(0, 212, 255, 0.1)',
            color: '#00D4FF',
            fontWeight: 600,
          }}
        />
        <Chip
          icon={<Speed />}
          label={`${totalSets} sets logged`}
          sx={{
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#10B981',
            fontWeight: 600,
          }}
        />
      </Stack>

      {/* Progress Bar */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1, textAlign: 'center' }}>
          Workout Progress: {Math.round(progress)}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
              borderRadius: 4,
            },
          }}
        />
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" closable sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Current Exercise Panel */}
        <Grid item xs={12} lg={8}>
          <Fade in timeout={700}>
            <Box>
                <ModernCard variant="glass" sx={{ mb: 3 }}>
                  {/* Exercise Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Avatar sx={{ 
                        width: 64, 
                        height: 64,
                        background: `linear-gradient(135deg, ${currentTypeInfo.color} 0%, ${currentTypeInfo.color}80 100%)`,
                      }}>
                        {currentTypeInfo.icon}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h4"
                          sx={{
                            fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                            fontWeight: 400,
                            color: '#FFFFFF',
                            mb: 1,
                          }}
                        >
                          {currentExercise.name}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={currentTypeInfo.label}
                            size="small"
                            sx={{ 
                              background: `${currentTypeInfo.color}20`,
                              color: currentTypeInfo.color,
                              fontWeight: 500,
                            }}
                          />
                          {currentExercise.reps && (
                            <Chip
                              label={`Target: ${currentExercise.reps} reps`}
                              size="small"
                              sx={{ 
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: '#CBD5E1',
                                fontWeight: 500,
                              }}
                            />
                          )}
                        </Stack>
                      </Box>
                    </Box>

                    <SecondaryButton
                      onClick={() => handleWatchVideo(currentExercise.name)}
                      startIcon={<VideoLibrary />}
                    >
                      Watch Demo
                    </SecondaryButton>
                  </Box>

                  {/* Sets Logging */}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                        fontWeight: 400,
                        color: '#FFFFFF',
                        mb: 3,
                      }}
                    >
                      Your Performance
                    </Typography>

                    <Stack spacing={2}>
                      {currentLoggedSets.map((set, setIndex) => (
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
                            <Typography variant="body1" sx={{ color: '#CBD5E1', fontWeight: 600 }}>
                              Set {setIndex + 1}
                            </Typography>
                            <IconButton 
                              onClick={() => handleRemoveSet(currentExerciseIndex, setIndex)} 
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
                          </Box>
                          
                          {renderSetInputs(currentExercise, currentExerciseIndex, set, setIndex)}
                        </Box>
                      ))}
                      
                      {/* Empty State */}
                      {currentLoggedSets.length === 0 && (
                        <Box sx={{ 
                          textAlign: 'center', 
                          py: 4,
                          color: '#94A3B8',
                          background: 'rgba(255, 255, 255, 0.02)',
                          borderRadius: '12px',
                          border: '1px dashed rgba(255, 255, 255, 0.1)',
                        }}>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            No sets logged yet
                          </Typography>
                          <Typography variant="body2">
                            Click "Add Set" below to start logging your performance
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Add Set Button */}
                      <PrimaryButton
                        onClick={() => handleAddSet(currentExerciseIndex)}
                        startIcon={<Add />}
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Add Set
                      </PrimaryButton>
                    </Stack>
                  </Box>
                </ModernCard>

                {/* Exercise Navigation */}
                <ModernCard variant="glass">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <SecondaryButton
                      onClick={handlePrevExercise}
                      disabled={currentExerciseIndex === 0}
                      startIcon={<SkipPrevious />}
                    >
                      Previous
                    </SecondaryButton>

                    <Typography variant="body1" sx={{ color: '#CBD5E1', fontWeight: 600 }}>
                      Exercise {currentExerciseIndex + 1} of {editablePlan.exercises.length}
                    </Typography>

                    <SecondaryButton
                      onClick={handleNextExercise}
                      disabled={currentExerciseIndex === editablePlan.exercises.length - 1}
                      endIcon={<SkipNext />}
                    >
                      Next
                    </SecondaryButton>
                  </Box>
                </ModernCard>
              </Box>
            </Fade>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Workout Plan Overview */}
              <Slide direction="left" in timeout={900}>
                <Box>
                  <ModernCard
                    title="Workout Plan"
                    subtitle="All exercises in this session"
                    variant="glass"
                    headerAction={
                      <SecondaryButton
                        onClick={() => setIsAddingExercise(!isAddingExercise)}
                        size="small"
                        startIcon={<Add />}
                      >
                        {isAddingExercise ? 'Cancel' : 'Add Exercise'}
                      </SecondaryButton>
                    }
                  >
                    {/* Add Exercise Search */}
                    {isAddingExercise && (
                      <Box sx={{ mb: 3 }}>
                        <Autocomplete
                          options={searchOptions}
                          loading={searchLoading}
                          inputValue={searchInputValue}
                          getOptionLabel={(option) => option.name || ""}
                          onInputChange={handleSearchChange}
                          onChange={(event, newValue) => {
                            handleSelectNewExercise(newValue);
                          }}
                          renderInput={(params) => (
                            <ModernInput
                              {...params}
                              label="Search exercises"
                              placeholder="Type to search..."
                              variant="outlined"
                              fullWidth
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {searchLoading && <LinearProgress sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                      </Box>
                    )}

                    {/* Exercise List */}
                    <List sx={{ p: 0 }}>
                      {editablePlan.exercises.map((exercise, index) => {
                        const typeInfo = getExerciseTypeInfo(exercise.exercise_type);
                        const hasLoggedSets = loggedData[index] && loggedData[index].length > 0;
                        
                        return (
                          <ListItem
                            key={index}
                            onClick={() => setCurrentExerciseIndex(index)}
                            sx={{
                              borderRadius: '12px',
                              mb: 1,
                              cursor: 'pointer',
                              background: index === currentExerciseIndex 
                                ? 'rgba(0, 212, 255, 0.1)' 
                                : 'transparent',
                              border: index === currentExerciseIndex 
                                ? '1px solid rgba(0, 212, 255, 0.2)' 
                                : '1px solid transparent',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.05)',
                              }
                            }}
                          >
                            <ListItemIcon>
                              <Avatar sx={{ 
                                width: 40, 
                                height: 40,
                                background: `linear-gradient(135deg, ${typeInfo.color} 0%, ${typeInfo.color}80 100%)`,
                              }}>
                                {typeInfo.icon}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                                  {exercise.name}
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                  <Chip
                                    size="small"
                                    label={typeInfo.label}
                                    sx={{ 
                                      background: `${typeInfo.color}20`,
                                      color: typeInfo.color,
                                      fontSize: '0.75rem',
                                    }}
                                  />
                                  {hasLoggedSets ? (
                                    <CheckCircle sx={{ color: '#10B981', fontSize: '1rem' }} />
                                  ) : (
                                    <Timer sx={{ color: '#94A3B8', fontSize: '1rem' }} />
                                  )}
                                </Box>
                              }
                            />
                            <IconButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveExercise(index);
                              }}
                              size="small"
                              sx={{ 
                                color: '#FF3366',
                                '&:hover': {
                                  background: 'rgba(255, 51, 102, 0.1)',
                                }
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  </ModernCard>
                </Box>
              </Slide>

              {/* Workout Notes */}
              <Slide direction="left" in timeout={1100}>
                <Box>
                  <ModernCard
                    title="Workout Notes"
                    subtitle="Add notes about your session"
                    variant="glass"
                  >
                    <ModernInput
                      label="Session Notes (optional)"
                      multiline
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="How did the workout feel? Any observations..."
                      variant="outlined"
                      fullWidth
                      startIcon={<Notes />}
                    />
                  </ModernCard>
                </Box>
              </Slide>

              {/* Action Buttons */}
              <Slide direction="left" in timeout={1300}>
                <Box>
                  <Stack spacing={2}>
                    <PrimaryButton
                      onClick={handleFinishWorkout}
                      disabled={isSubmitting}
                      size="large"
                      startIcon={<CheckCircle />}
                      fullWidth
                    >
                      {isSubmitting ? 'Saving...' : 'Finish & Log Workout'}
                    </PrimaryButton>

                    <SecondaryButton
                      onClick={() => setShowQuitDialog(true)}
                      startIcon={<Warning />}
                      fullWidth
                      sx={{ color: '#FF3366', borderColor: '#FF3366' }}
                    >
                      Cancel Workout
                    </SecondaryButton>
                  </Stack>
                </Box>
              </Slide>
            </Stack>
          </Grid>
        </Grid>

        {/* Quit Confirmation Dialog */}
        <Dialog
          open={showQuitDialog}
          onClose={() => setShowQuitDialog(false)}
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
              background: 'linear-gradient(135deg, #FF3366 0%, #FF6B35 100%)',
            }}>
              <Warning />
            </Avatar>
            Cancel Workout?
          </DialogTitle>
          
          <DialogContent sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: '#CBD5E1' }}>
              Are you sure you want to cancel this session? Any logged data for this workout will be lost.
            </Typography>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, gap: 2, justifyContent: 'center' }}>
            <SecondaryButton onClick={() => setShowQuitDialog(false)}>
              Continue Workout
            </SecondaryButton>
            <PrimaryButton 
              onClick={() => navigate('/dashboard')}
              sx={{ 
                background: 'linear-gradient(135deg, #FF3366 0%, #FF6B35 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FF3366 100%)',
                }
              }}
            >
              Yes, Cancel
            </PrimaryButton>
          </DialogActions>
        </Dialog>

        {/* Duration Modal */}
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

        {/* Video Modal */}
        <Dialog
          open={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              background: 'rgba(26, 31, 46, 0.95)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              maxHeight: '80vh',
            }
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: '"Gravitas One", "Montserrat", sans-serif',
              fontWeight: 400,
              color: '#FFFFFF',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ 
                width: 48, 
                height: 48,
                background: 'linear-gradient(135deg, #FF3366 0%, #FF6B35 100%)',
              }}>
                <VideoLibrary />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontFamily: 'inherit', fontWeight: 'inherit' }}>
                  Exercise Demonstrations
                </Typography>
                <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                  {currentExercise?.name}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setVideoModalOpen(false)} sx={{ color: '#94A3B8' }}>
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ pt: 3 }}>
            {videoLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <LinearProgress sx={{ width: '100%' }} />
              </Box>
            ) : currentExerciseVideos.length > 0 ? (
              <Grid container spacing={2}>
                {currentExerciseVideos.map((video, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <ModernCard variant="glass" sx={{ cursor: 'pointer' }}>
                      <Box
                        onClick={() => {
                          if (video.youtube_url || video.url) {
                            window.open(video.youtube_url || video.url, '_blank');
                          }
                        }}
                        sx={{
                          textAlign: 'center',
                          '&:hover .video-overlay': {
                            opacity: 1,
                          }
                        }}
                      >
                        {video.thumbnail_url && (
                          <Box sx={{ position: 'relative', mb: 2 }}>
                            <img
                              src={video.thumbnail_url}
                              alt={video.title || `Video ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '120px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                              }}
                            />
                            <Box
                              className="video-overlay"
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 0, 0, 0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                              }}
                            >
                              <PlayArrow sx={{ fontSize: '3rem', color: '#00D4FF' }} />
                            </Box>
                          </Box>
                        )}
                        <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 1 }}>
                          {video.title || `Video ${index + 1}`}
                        </Typography>
                        <SecondaryButton
                          size="small"
                          endIcon={<OpenInNew />}
                          fullWidth
                        >
                          Watch Video
                        </SecondaryButton>
                      </Box>
                    </ModernCard>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6, color: '#94A3B8' }}>
                <VideoLibrary sx={{ fontSize: '4rem', mb: 2, opacity: 0.3 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No videos found
                </Typography>
                <Typography variant="body2">
                  Video demonstrations are not available for this exercise
                </Typography>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 3 }}>
            <SecondaryButton onClick={() => setVideoModalOpen(false)}>
              Close
            </SecondaryButton>
          </DialogActions>
        </Dialog>
      <ContextualHelp page="workout-session" />
    </PageContainer>
  );
};

export default WorkoutSession;