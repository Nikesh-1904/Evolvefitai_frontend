import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  CalendarToday,
  Timer,
  FitnessCenter,
  TrendingUp,
} from '@mui/icons-material';
import apiService from '../services/apiService';

function WorkoutHistory() {
  const [workouts, setWorkouts] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkoutHistory();
  }, []);

  const loadWorkoutHistory = async () => {
    try {
      const [workoutLogs, plans] = await Promise.all([
        apiService.getWorkoutLogs(),
        apiService.getWorkoutPlans(),
      ]);
      
      setWorkouts(workoutLogs);
      setWorkoutPlans(plans);
    } catch (error) {
      console.error('Failed to load workout history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout);
  };

  const handleCloseDialog = () => {
    setSelectedWorkout(null);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading workout history...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Workout History
      </Typography>
      
      {/* Stats Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {workouts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Workouts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {workoutPlans.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Workout Plans
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {Math.round(workouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0) / 60)}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {workoutPlans.filter(p => p.ai_generated).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI Generated
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Workout Plans */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Your Workout Plans
      </Typography>
      
      {workoutPlans.length === 0 ? (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              No workout plans yet. Generate your first AI workout!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {workoutPlans.map((plan) => (
            <Grid item xs={12} md={6} key={plan.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6">
                      {plan.name}
                    </Typography>
                    {plan.ai_generated && (
                      <Chip
                        label={`AI: ${plan.ai_model}`}
                        color="primary"
                        size="small"
                      />
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {plan.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      icon={<Timer />}
                      label={`${plan.estimated_duration} min`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<FitnessCenter />}
                      label={`${plan.exercises?.length || 0} exercises`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={plan.difficulty}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    Created: {new Date(plan.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Workout Logs */}
      <Typography variant="h5" gutterBottom>
        Completed Workouts
      </Typography>
      
      {workouts.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              No completed workouts yet. Start your fitness journey today!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {workouts.map((workout) => (
            <Grid item xs={12} md={6} key={workout.id}>
              <Card 
                sx={{ cursor: 'pointer' }}
                onClick={() => handleWorkoutClick(workout)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">
                      {new Date(workout.workout_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {workout.duration_minutes && (
                      <Chip
                        icon={<Timer />}
                        label={`${workout.duration_minutes} min`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    <Chip
                      icon={<FitnessCenter />}
                      label={`${workout.exercises_completed?.length || 0} exercises`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  
                  {workout.notes && (
                    <Typography variant="body2" color="text.secondary">
                      {workout.notes}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Workout Detail Dialog */}
      <Dialog
        open={Boolean(selectedWorkout)}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedWorkout && (
          <>
            <DialogTitle>
              Workout Details - {new Date(selectedWorkout.workout_date).toLocaleDateString()}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  <strong>Duration:</strong> {selectedWorkout.duration_minutes || 'Not recorded'} minutes
                </Typography>
                <Typography variant="body1">
                  <strong>Exercises Completed:</strong> {selectedWorkout.exercises_completed?.length || 0}
                </Typography>
              </Box>
              
              {selectedWorkout.exercises_completed && selectedWorkout.exercises_completed.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Exercises
                  </Typography>
                  <List>
                    {selectedWorkout.exercises_completed.map((exercise, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={exercise.exercise_name || exercise.name || `Exercise ${index + 1}`}
                          secondary={
                            exercise.sets && exercise.reps 
                              ? `${exercise.sets} sets × ${Array.isArray(exercise.reps) ? exercise.reps.join(', ') : exercise.reps} reps`
                              : 'Details not recorded'
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              
              {selectedWorkout.notes && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Notes
                  </Typography>
                  <Typography variant="body1">
                    {selectedWorkout.notes}
                  </Typography>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}

export default WorkoutHistory;