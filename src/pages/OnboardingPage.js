// src/pages/OnboardingPage.js

import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Grid
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const steps = ['Welcome', 'Your Stats', 'Fitness Goals'];

const commonDietaryRestrictions = [
  'vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'keto', 'paleo'
];

const fitnessGoals = [
  'weight_loss', 'muscle_gain', 'strength', 'endurance', 'general_fitness'
];

function OnboardingPage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    fitness_goal: user?.fitness_goal || '',
    dietary_restrictions: user?.dietary_restrictions || [],
  });
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDietaryRestrictionToggle = (restriction) => {
    setFormData(prev => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.includes(restriction)
        ? prev.dietary_restrictions.filter(r => r !== restriction)
        : [...prev.dietary_restrictions, restriction]
    }));
  };
  
  const validateStep = () => {
    const newErrors = {};
    if (activeStep === 0 && (!formData.username || formData.username.trim().length < 3)) {
      newErrors.username = 'Username must be at least 3 characters long.';
    }
    if (activeStep === 1) {
      if (!formData.age || formData.age < 13) newErrors.age = 'You must be at least 13 years old.';
      if (!formData.weight || formData.weight < 30) newErrors.weight = 'Please enter a valid weight.';
      if (!formData.height || formData.height < 100) newErrors.height = 'Please enter a valid height in cm.';
    }
    if (activeStep === 2 && !formData.fitness_goal) {
      newErrors.fitness_goal = 'Please select a fitness goal.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleFinish = async () => {
    if (validateStep()) {
      console.log("Submitting onboarding data:", formData);
      // In the next step, we will replace this console.log with the API call
      // await updateProfile({ ...formData, has_completed_onboarding: true });
      // navigate('/'); 
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h5" gutterBottom>Welcome to EvolveFit AI!</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Let's set up your public profile.</Typography>
            <TextField
              required
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username || "This is your unique name on the platform."}
            />
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h5" gutterBottom>Your Physical Stats</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>This data helps us personalize your workouts and calorie estimates.</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField required fullWidth label="Age" name="age" type="number" value={formData.age} onChange={handleChange} error={!!errors.age} helperText={errors.age || "Your age helps tailor plans."} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField required fullWidth label="Weight (kg)" name="weight" type="number" value={formData.weight} onChange={handleChange} error={!!errors.weight} helperText={errors.weight || "For accurate calorie tracking."} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField required fullWidth label="Height (cm)" name="height" type="number" value={formData.height} onChange={handleChange} error={!!errors.height} helperText={errors.height || "Helps in exercise personalization."} />
              </Grid>
            </Grid>
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h5" gutterBottom>Fitness Goals & Preferences</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Tell us what you want to achieve.</Typography>
            <FormControl fullWidth required error={!!errors.fitness_goal}>
              <InputLabel>Primary Fitness Goal</InputLabel>
              <Select name="fitness_goal" value={formData.fitness_goal} onChange={handleChange} label="Primary Fitness Goal">
                {fitnessGoals.map(goal => (
                  <MenuItem key={goal} value={goal}>{goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</MenuItem>
                ))}
              </Select>
              {errors.fitness_goal && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{errors.fitness_goal}</Typography>}
            </FormControl>
            <Typography color="text.secondary" sx={{ mt: 3, mb: 1 }}>Dietary Restrictions (Optional)</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {commonDietaryRestrictions.map(restriction => (
                <Chip
                  key={restriction}
                  label={restriction.replace('_', ' ')}
                  clickable
                  color={formData.dietary_restrictions.includes(restriction) ? 'primary' : 'default'}
                  onClick={() => handleDietaryRestrictionToggle(restriction)}
                />
              ))}
            </Box>
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={handleFinish}>Finish Setup</Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>Next</Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default OnboardingPage;