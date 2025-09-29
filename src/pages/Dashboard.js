import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  Chip,
} from '@mui/material';
import {
  FitnessCenter,
  Restaurant,
  TrendingUp,
  PlayArrow,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [workoutLogsData, workoutPlansData] = await Promise.all([
        apiService.getWorkoutLogs(),
        apiService.getWorkoutPlans(),
      ]);
      
      setRecentWorkouts(workoutLogsData.slice(0, 3));
      setWorkoutPlans(workoutPlansData.slice(0, 3));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWorkout = async () => {
    navigate('/generate-workout');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.full_name || user?.email?.split('@')[0] || 'Fitness Enthusiast'}! 💪
      </Typography>

      {(!user?.fitness_goal || !user?.experience_level) && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Complete your profile to get better AI workout recommendations!{' '}
          <Button onClick={() => navigate('/profile')} size="small">
            Update Profile
          </Button>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FitnessCenter color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  AI Workout
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Generate a personalized workout using AI
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={handleGenerateWorkout}
                startIcon={<PlayArrow />}
              >
                Generate Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Workout Plans */}
        <Grid item xs={12} md={6} lg={9}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Workout Plans
              </Typography>
              {workoutPlans.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No workout plans yet. Generate your first AI-powered workout!
                </Typography>
              ) : (
                <Box>
                  {workoutPlans.map((plan, index) => (
                    <Box
                      key={plan.id}
                      sx={{
                        p: 2,
                        mb: 1,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box>
                          <Typography variant="subtitle1">
                            {plan.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {plan.description}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            {plan.ai_generated && (
                              <Chip
                                label={`AI: ${plan.ai_model}`}
                                size="small"
                                color="primary"
                                sx={{ mr: 1 }}
                              />
                            )}
                            <Chip
                              label={`${plan.estimated_duration} min`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Workouts */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Workouts
              </Typography>
              {recentWorkouts.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No workouts logged yet. Complete your first workout!
                </Typography>
              ) : (
                <Box>
                  {recentWorkouts.map((workout, index) => (
                    <Box
                      key={workout.id}
                      sx={{
                        p: 2,
                        mb: 1,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle1">
                        {new Date(workout.workout_date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duration: {workout.duration_minutes || 'N/A'} minutes
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Exercises: {workout.exercises_completed?.length || 0}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* User Stats */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Fitness Profile
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Goal:</strong> {user?.fitness_goal || 'Not set'}
                </Typography>
                <Typography variant="body2">
                  <strong>Experience:</strong> {user?.experience_level || 'Not set'}
                </Typography>
                <Typography variant="body2">
                  <strong>Activity Level:</strong> {user?.activity_level || 'Not set'}
                </Typography>
                {user?.weight && (
                  <Typography variant="body2">
                    <strong>Weight:</strong> {user.weight} kg
                  </Typography>
                )}
                {user?.height && (
                  <Typography variant="body2">
                    <strong>Height:</strong> {user.height} cm
                  </Typography>
                )}
              </Box>
              <Button
                sx={{ mt: 2 }}
                onClick={() => navigate('/profile')}
                variant="outlined"
                size="small"
              >
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;