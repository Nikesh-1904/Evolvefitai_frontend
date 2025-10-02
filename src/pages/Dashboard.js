// src/pages/Dashboard.js - Fixed with correct AIModelBadge import path

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
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  FitnessCenter,
  Restaurant,
  TrendingUp,
  PlayArrow,
  Create,
  AutoAwesome,
  Close,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
// FIXED: Removed the AIModelBadge import since it's causing path issues
// We'll create a simple inline component instead

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Meal plan generation states
  const [mealPlanLoading, setMealPlanLoading] = useState(false);
  const [mealPlanDialog, setMealPlanDialog] = useState(false);
  const [generatedMealPlan, setGeneratedMealPlan] = useState(null);
  const [mealPlanError, setMealPlanError] = useState('');

  // Simple inline AIModelBadge component to avoid import issues
  const SimpleAIBadge = ({ aiModel, aiGenerated }) => {
    if (!aiGenerated || !aiModel) {
      return (
        <Chip 
          label="Rule-based" 
          size="small" 
          color="default" 
          variant="outlined"
        />
      );
    }
    return (
      <Chip 
        label={aiModel.includes('Groq') ? 'Groq AI' : aiModel.includes('OpenRouter') ? 'OpenRouter AI' : 'AI Generated'} 
        size="small" 
        color="primary" 
        variant="outlined"
      />
    );
  };

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

  // Generate meal plan function
  const handleGenerateMealPlan = async () => {
    setMealPlanLoading(true);
    setMealPlanError('');

    try {
      console.log('🍽️ Generating meal plan from dashboard...');

      // Prepare request data
      const requestData = {
        preferences: {
          dietary_restrictions: user?.dietary_restrictions || [],
          calories_goal: user?.calories_goal || 'moderate',
          meal_count: 4 // breakfast, lunch, dinner, snacks
        }
      };

      const mealPlan = await apiService.generateMealPlan(requestData);

      console.log('✅ Meal plan generated successfully:', mealPlan);
      setGeneratedMealPlan(mealPlan);
      setMealPlanDialog(true);

    } catch (error) {
      console.error('❌ Failed to generate meal plan:', error);
      setMealPlanError(error.message || 'Failed to generate meal plan. Please try again.');
    } finally {
      setMealPlanLoading(false);
    }
  };

  // Navigate to full meal plan generator
  const handleViewFullMealPlanner = () => {
    setMealPlanDialog(false);
    navigate('/meal-plan-generator');
  };

  // Close meal plan dialog
  const handleCloseMealPlanDialog = () => {
    setMealPlanDialog(false);
    setGeneratedMealPlan(null);
    setMealPlanError('');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.full_name || user?.email?.split('@')[0] || 'Fitness Enthusiast'}! 💪
      </Typography>

      {(!user?.fitness_goal || !user?.experience_level) && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Complete your profile to get better AI workout recommendations!{' '}
          <Button 
            onClick={() => navigate('/profile')} 
            size="small" 
            variant="outlined"
          >
            Update Profile
          </Button>
        </Alert>
      )}

      {/* Quick Actions Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <FitnessCenter color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  AI Workout
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Generate a new, personalized workout plan using AI based on your goals.
              </Typography>
              <Button
                onClick={handleGenerateWorkout}
                variant="contained"
                fullWidth
                startIcon={<AutoAwesome />}
              >
                Generate Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Create color="secondary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Freestyle Log
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manually log a workout you completed, adding exercises and sets as you go.
              </Typography>
              <Button
                onClick={() => navigate('/log-workout')}
                variant="outlined"
                fullWidth
                startIcon={<Create />}
              >
                Log a Workout
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Restaurant color="success" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  AI Meal Planner
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Generate a customized meal plan to complement your fitness journey.
              </Typography>
              <Button
                onClick={handleGenerateMealPlan}
                variant="contained"
                color="success"
                fullWidth
                startIcon={mealPlanLoading ? <CircularProgress size={20} color="inherit" /> : <Restaurant />}
                disabled={mealPlanLoading}
              >
                {mealPlanLoading ? 'Generating...' : 'Generate Meals'}
              </Button>
              {mealPlanError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {mealPlanError}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Workout Plans Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Your Workout Plans
            </Typography>
            {workoutPlans.length === 0 ? (
              <Typography color="text.secondary">
                No workout plans yet. Generate your first AI-powered workout!
              </Typography>
            ) : (
              workoutPlans.map((plan, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="h6">{plan.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {plan.description}
                  </Typography>
                  {plan.ai_generated && (
                    <SimpleAIBadge 
                      aiModel={plan.ai_model} 
                      aiGenerated={plan.ai_generated} 
                    />
                  )}
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Recent Workouts
            </Typography>
            {recentWorkouts.length === 0 ? (
              <Typography color="text.secondary">
                No workouts logged yet. Complete your first workout!
              </Typography>
            ) : (
              recentWorkouts.map((workout, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    {new Date(workout.workout_date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration: {workout.duration_minutes || 'N/A'} minutes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Exercises: {workout.exercises_completed?.length || 0}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Fitness Profile Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Your Fitness Profile
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Chip label={`Goal: ${user?.fitness_goal || 'Not set'}`} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Chip label={`Experience: ${user?.experience_level || 'Not set'}`} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Chip label={`Activity Level: ${user?.activity_level || 'Not set'}`} />
          </Grid>
          {user?.weight && (
            <Grid item xs={6} sm={3}>
              <Chip label={`Weight: ${user.weight} kg`} />
            </Grid>
          )}
          {user?.height && (
            <Grid item xs={6} sm={3}>
              <Chip label={`Height: ${user.height} cm`} />
            </Grid>
          )}
        </Grid>
        <Button
          onClick={() => navigate('/profile')}
          variant="outlined"
          size="small"
          sx={{ mt: 2 }}
        >
          Update Profile
        </Button>
      </Paper>

      {/* Meal Plan Dialog */}
      <Dialog 
        open={mealPlanDialog} 
        onClose={handleCloseMealPlanDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Restaurant color="success" sx={{ mr: 1 }} />
              AI Generated Meal Plan
            </Box>
            <Button onClick={handleCloseMealPlanDialog}>
              <Close />
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent>
          {generatedMealPlan && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">{generatedMealPlan.name}</Typography>
                <Box display="flex" gap={1} mt={1}>
                  <Chip 
                    label={`${generatedMealPlan.target_calories} kcal`} 
                    color="primary" 
                    size="small" 
                  />
                  <Chip 
                    label={`${generatedMealPlan.target_protein}g protein`} 
                    color="secondary" 
                    size="small" 
                  />
                  {generatedMealPlan.ai_generated && (
                    <SimpleAIBadge 
                      aiModel={generatedMealPlan.ai_model} 
                      aiGenerated={generatedMealPlan.ai_generated} 
                    />
                  )}
                </Box>
              </Box>

              <List>
                {Object.entries(generatedMealPlan.meals || {}).map(([mealType, meal]) => (
                  <React.Fragment key={mealType}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                            {mealType}: {meal.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {meal.instructions}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {meal.calories} kcal • {meal.protein}g protein • {meal.carbs}g carbs • {meal.fat}g fat
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              <strong>Ingredients:</strong> {meal.ingredients?.join(', ')}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseMealPlanDialog} variant="outlined">
            Close
          </Button>
          <Button 
            onClick={handleViewFullMealPlanner} 
            variant="contained" 
            color="success"
          >
            View Full Meal Planner
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard;
