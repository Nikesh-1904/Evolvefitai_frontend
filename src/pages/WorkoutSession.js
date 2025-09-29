// src/pages/WorkoutSession.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  LinearProgress,
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
  Rating
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Stop,
  Timer,
  FitnessCenter,
  RestaurantMenu,
  CheckCircle,
  Cancel,
  VolumeUp,
  VolumeOff,
  Add,
  Remove,
  Notes,
  Star
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const WorkoutSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const workoutPlan = location.state?.workoutPlan;
  
  // Workout state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [workoutStartTime] = useState(new Date());
  const [completedSets, setCompletedSets] = useState({});
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [exerciseNotes, setExerciseNotes] = useState({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Timer ref
  const timerRef = useRef(null);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    if (!workoutPlan) {
      navigate('/generate-workout');
      return;
    }
  }, [workoutPlan, navigate]);

  useEffect(() => {
    if (timeRemaining > 0 && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [timeRemaining, isPaused]);

  const playSound = (type = 'beep') => {
    if (!soundEnabled) return;
    
    // Create different sound frequencies for different events
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
      case 'start':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        break;
      case 'rest':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        break;
      case 'complete':
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        break;
      default:
        oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
    }
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const handleTimerComplete = () => {
    playSound(isResting ? 'start' : 'rest');
    
    if (isResting) {
      // Rest period complete, start next set or exercise
      setIsResting(false);
      if (currentSet < getCurrentExercise().sets) {
        setCurrentSet(prev => prev + 1);
      } else {
        // Move to next exercise
        if (currentExerciseIndex < workoutPlan.exercises.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
          setCurrentSet(1);
        } else {
          // Workout complete
          completeWorkout();
        }
      }
    } else {
      // Exercise set complete, start rest period
      markSetComplete();
      if (currentSet < getCurrentExercise().sets) {
        startRestPeriod();
      } else if (currentExerciseIndex < workoutPlan.exercises.length - 1) {
        startRestPeriod(120); // Longer rest between exercises
      } else {
        // Workout complete
        completeWorkout();
      }
    }
  };

  const getCurrentExercise = () => {
    return workoutPlan?.exercises[currentExerciseIndex] || {};
  };

  const startExercise = () => {
    const exercise = getCurrentExercise();
    const duration = exercise.duration_seconds || 30;
    setTimeRemaining(duration);
    playSound('start');
  };

  const startRestPeriod = (customDuration = null) => {
    const restTime = customDuration || 60; // Default 60 seconds rest
    setIsResting(true);
    setTimeRemaining(restTime);
    playSound('rest');
  };

  const markSetComplete = () => {
    const exerciseId = `${currentExerciseIndex}-${currentSet}`;
    setCompletedSets(prev => ({
      ...prev,
      [exerciseId]: {
        completed: true,
        timestamp: new Date(),
        reps: getCurrentExercise().reps,
        weight: getCurrentExercise().weight || null
      }
    }));
  };

  const completeWorkout = () => {
    setWorkoutComplete(true);
    playSound('complete');
    logWorkoutSession();
  };

  const logWorkoutSession = async () => {
    try {
      const workoutData = {
        workout_plan: workoutPlan,
        duration_minutes: Math.round((new Date() - workoutStartTime) / (1000 * 60)),
        exercises_completed: Object.keys(completedSets).length,
        completed_sets: completedSets,
        notes: exerciseNotes,
        completed_at: new Date().toISOString()
      };

      // TODO: Call API to save workout session
      console.log('Logging workout session:', workoutData);
      
      // For now, just store in localStorage
      const existingSessions = JSON.parse(localStorage.getItem('workoutSessions') || '[]');
      existingSessions.push(workoutData);
      localStorage.setItem('workoutSessions', JSON.stringify(existingSessions));
      
    } catch (error) {
      console.error('Failed to log workout session:', error);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleSkipSet = () => {
    if (currentSet < getCurrentExercise().sets) {
      setCurrentSet(prev => prev + 1);
    } else {
      handleSkipExercise();
    }
  };

  const handleSkipExercise = () => {
    if (currentExerciseIndex < workoutPlan.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      setTimeRemaining(0);
    } else {
      completeWorkout();
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setCurrentSet(1);
      setIsResting(false);
      setTimeRemaining(0);
    }
  };

  const handleQuitWorkout = () => {
    setShowQuitDialog(true);
  };

  const confirmQuit = () => {
    logWorkoutSession(); // Log partial session
    navigate('/dashboard');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    const totalExercises = workoutPlan?.exercises.length || 1;
    const totalSets = workoutPlan?.exercises.reduce((sum, ex) => sum + (ex.sets || 1), 0) || 1;
    const completedSetsCount = Object.keys(completedSets).length;
    return (completedSetsCount / totalSets) * 100;
  };

  if (!workoutPlan) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">No workout plan found. Please generate a workout first.</Alert>
      </Container>
    );
  }

  const currentExercise = getCurrentExercise();
  const progress = calculateProgress();

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">
          Workout Session
        </Typography>
        <Box display="flex" gap={1}>
          <IconButton onClick={() => setSoundEnabled(!soundEnabled)} color="primary">
            {soundEnabled ? <VolumeUp /> : <VolumeOff />}
          </IconButton>
          <Button variant="outlined" color="error" onClick={handleQuitWorkout}>
            Quit
          </Button>
        </Box>
      </Box>

      {/* Progress */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Overall Progress</Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progress)}% Complete
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ mb: 1, height: 8, borderRadius: 4 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">
              Exercise {currentExerciseIndex + 1} of {workoutPlan.exercises.length}
            </Typography>
            <Typography variant="body2">
              Set {currentSet} of {currentExercise.sets || 1}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Current Exercise */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justify="space-between" alignItems="flex-start" mb={2}>
            <Box flex={1}>
              <Typography variant="h5" gutterBottom>
                {currentExercise.name || 'Exercise'}
              </Typography>
              <Box display="flex" gap={1} mb={2}>
                {currentExercise.muscle_groups?.map((muscle, index) => (
                  <Chip key={index} label={muscle} size="small" color="primary" variant="outlined" />
                ))}
              </Box>
              {currentExercise.instructions && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  {currentExercise.instructions}
                </Typography>
              )}
            </Box>
            <Box textAlign="center" minWidth={120}>
              <Typography variant="h3" color={isResting ? "warning.main" : "primary.main"}>
                {formatTime(timeRemaining)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isResting ? 'Rest Time' : 'Exercise Time'}
              </Typography>
            </Box>
          </Box>

          {/* Exercise Details */}
          <Grid container spacing={2} mb={2}>
            {currentExercise.reps && (
              <Grid item xs={6} sm={3}>
                <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="h6">{currentExercise.reps}</Typography>
                  <Typography variant="caption">Reps</Typography>
                </Paper>
              </Grid>
            )}
            {currentExercise.sets && (
              <Grid item xs={6} sm={3}>
                <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="h6">{currentExercise.sets}</Typography>
                  <Typography variant="caption">Sets</Typography>
                </Paper>
              </Grid>
            )}
            {currentExercise.weight && (
              <Grid item xs={6} sm={3}>
                <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="h6">{currentExercise.weight}</Typography>
                  <Typography variant="caption">Weight</Typography>
                </Paper>
              </Grid>
            )}
            {currentExercise.duration_seconds && (
              <Grid item xs={6} sm={3}>
                <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="h6">{currentExercise.duration_seconds}s</Typography>
                  <Typography variant="caption">Duration</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>

          {/* Control Buttons */}
          <Box display="flex" justifyContent="center" gap={1} mb={2}>
            <IconButton onClick={handlePreviousExercise} disabled={currentExerciseIndex === 0}>
              <SkipPrevious />
            </IconButton>
            
            {timeRemaining === 0 && !isResting && (
              <Button
                variant="contained"
                size="large"
                onClick={startExercise}
                startIcon={<PlayArrow />}
                sx={{ minWidth: 120 }}
              >
                Start Set
              </Button>
            )}
            
            {timeRemaining > 0 && (
              <Button
                variant="contained"
                size="large"
                onClick={handlePauseResume}
                startIcon={isPaused ? <PlayArrow /> : <Pause />}
                color={isPaused ? "success" : "warning"}
                sx={{ minWidth: 120 }}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            )}
            
            <IconButton onClick={handleSkipSet}>
              <SkipNext />
            </IconButton>
          </Box>

          {/* Exercise Notes */}
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Notes for this exercise"
            variant="outlined"
            size="small"
            value={exerciseNotes[currentExerciseIndex] || ''}
            onChange={(e) => setExerciseNotes(prev => ({
              ...prev,
              [currentExerciseIndex]: e.target.value
            }))}
            InputProps={{
              startAdornment: <Notes sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </CardContent>
      </Card>

      {/* Exercise List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Exercise List
          </Typography>
          <List dense>
            {workoutPlan.exercises.map((exercise, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: index === currentExerciseIndex ? 'action.selected' : 'transparent',
                  borderRadius: 1,
                  mb: 0.5
                }}
              >
                <ListItemIcon>
                  {index < currentExerciseIndex ? (
                    <CheckCircle color="success" />
                  ) : index === currentExerciseIndex ? (
                    <FitnessCenter color="primary" />
                  ) : (
                    <FitnessCenter color="disabled" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={exercise.name}
                  secondary={`${exercise.sets} sets × ${exercise.reps || exercise.duration_seconds + 's'}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Quit Dialog */}
      <Dialog open={showQuitDialog} onClose={() => setShowQuitDialog(false)}>
        <DialogTitle>Quit Workout?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to quit this workout? Your progress will be saved.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQuitDialog(false)}>Continue</Button>
          <Button onClick={confirmQuit} color="error">
            Quit Workout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Completion Dialog */}
      <Dialog open={workoutComplete} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <CheckCircle color="success" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h5">Workout Complete!</Typography>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" mb={2}>
            <Typography variant="h6" gutterBottom>
              Great job! 🎉
            </Typography>
            <Typography color="text.secondary" mb={2}>
              You completed your workout in {Math.round((new Date() - workoutStartTime) / (1000 * 60))} minutes
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom>
              Rate this workout:
            </Typography>
            <Rating size="large" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button variant="contained" onClick={() => navigate('/workout-history')}>
            View History
          </Button>
          <Button variant="outlined" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WorkoutSession;