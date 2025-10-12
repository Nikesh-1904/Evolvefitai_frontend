// src/pages/OnboardingPage.js - Modern AI Fitness Onboarding Experience

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Grid,
  Alert,
  Stack,
  Avatar,
  LinearProgress,
  Fade,
  Slide,
} from '@mui/material';
import {
  Person,
  MonitorWeight,
  FitnessCenter,
  CheckCircle,
  AutoAwesome,
  TrendingUp,
  Restaurant,
  EmojiEvents,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import our modern components
import ModernCard from '../components/ModernCard';
import ModernInput, { ModernSelect } from '../components/ModernInput';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';

const steps = ['Welcome', 'Your Stats', 'Fitness Goals'];

const commonDietaryRestrictions = [
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'gluten_free', label: 'Gluten Free', emoji: '🌾' },
  { value: 'dairy_free', label: 'Dairy Free', emoji: '🥛' },
  { value: 'keto', label: 'Keto', emoji: '🥑' },
  { value: 'paleo', label: 'Paleo', emoji: '🥩' },
];

const fitnessGoals = [
  { value: 'weight_loss', label: 'Weight Loss', icon: <TrendingUp />, color: '#FF3366' },
  { value: 'muscle_gain', label: 'Muscle Gain', icon: <FitnessCenter />, color: '#00D4FF' },
  { value: 'strength', label: 'Strength', icon: <EmojiEvents />, color: '#7C3AED' },
  { value: 'endurance', label: 'Endurance', icon: <AutoAwesome />, color: '#10B981' },
  { value: 'general_fitness', label: 'General Fitness', icon: <CheckCircle />, color: '#F59E0B' },
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
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
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
    
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinish = async () => {
    if (validateStep()) {
      setIsSubmitting(true);
      setSubmitError('');
      try {
        await updateProfile({ ...formData, has_completed_onboarding: true });
        navigate('/dashboard');
      } catch (err) {
        setSubmitError(err.message || "Failed to save profile. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 0: return <Person />;
      case 1: return <MonitorWeight />;
      case 2: return <FitnessCenter />;
      default: return <CheckCircle />;
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in timeout={500}>
            <Box>
              {/* Welcome Hero */}
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '30px',
                    background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '3rem',
                    mx: 'auto',
                    mb: 4,
                    animation: 'pulse 2s infinite',
                  }}
                >
                  🚀
                </Box>
                
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                    fontWeight: 400,
                    fontSize: { xs: '2rem', sm: '2.5rem' },
                    color: '#FFFFFF',
                    lineHeight: 1.2,
                    mb: 2,
                  }}
                >
                  Welcome to EvolveFit AI!
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: '#CBD5E1',
                    fontWeight: 500,
                    fontSize: '1.25rem',
                    maxWidth: '600px',
                    mx: 'auto',
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  Let's create your personalized fitness profile in just 3 simple steps. 
                  This helps our AI generate workouts and meal plans tailored specifically for you.
                </Typography>

                {/* Feature Preview */}
                <Grid container spacing={2} sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ 
                        width: 60, 
                        height: 60, 
                        mx: 'auto', 
                        mb: 1,
                        background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
                      }}>
                        <AutoAwesome />
                      </Avatar>
                      <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                        AI Workouts
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ 
                        width: 60, 
                        height: 60, 
                        mx: 'auto', 
                        mb: 1,
                        background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                      }}>
                        <Restaurant />
                      </Avatar>
                      <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                        Meal Plans
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ 
                        width: 60, 
                        height: 60, 
                        mx: 'auto', 
                        mb: 1,
                        background: 'linear-gradient(135deg, #FF3366 0%, #FF6B35 100%)',
                      }}>
                        <TrendingUp />
                      </Avatar>
                      <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                        Progress Tracking
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Username Input */}
              <ModernCard variant="glass" sx={{ maxWidth: 500, mx: 'auto' }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    mb: 3,
                    textAlign: 'center',
                  }}
                >
                  Choose Your Username
                </Typography>
                
                <ModernInput
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter a unique username"
                  required
                  variant="outlined"
                  error={!!fieldErrors.username}
                  helperText={fieldErrors.username || "This will be your public display name"}
                  startIcon={<Person />}
                  fullWidth
                />
              </ModernCard>
            </Box>
          </Fade>
        );

      case 1:
        return (
          <Slide direction="left" in timeout={500}>
            <Box>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #FF3366 0%, #FF6B35 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '2rem',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  📊
                </Box>
                
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    mb: 2,
                  }}
                >
                  Your Physical Stats
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: '#CBD5E1',
                    maxWidth: '500px',
                    mx: 'auto',
                  }}
                >
                  This information helps our AI create personalized workouts and accurate calorie estimates just for you.
                </Typography>
              </Box>

              <ModernCard variant="glass" sx={{ maxWidth: 600, mx: 'auto' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <ModernInput
                      label="Age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Your age"
                      required
                      variant="outlined"
                      error={!!fieldErrors.age}
                      helperText={fieldErrors.age}
                      fullWidth
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <ModernInput
                      label="Weight (kg)"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="Your weight"
                      required
                      variant="outlined"
                      error={!!fieldErrors.weight}
                      helperText={fieldErrors.weight}
                      fullWidth
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <ModernInput
                      label="Height (cm)"
                      name="height"
                      type="number"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="Your height"
                      required
                      variant="outlined"
                      error={!!fieldErrors.height}
                      helperText={fieldErrors.height}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                {/* BMI Preview */}
                {formData.weight && formData.height && (
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                        border: '1px solid rgba(0, 212, 255, 0.2)',
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 1 }}>
                        Your BMI Preview
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                          color: '#00D4FF',
                          fontWeight: 400,
                        }}
                      >
                        {((parseFloat(formData.weight) / (parseFloat(formData.height) / 100) ** 2) || 0).toFixed(1)}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </ModernCard>
            </Box>
          </Slide>
        );

      case 2:
        return (
          <Slide direction="left" in timeout={500}>
            <Box>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '2rem',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  🎯
                </Box>
                
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    mb: 2,
                  }}
                >
                  Fitness Goals & Preferences
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: '#CBD5E1',
                    maxWidth: '500px',
                    mx: 'auto',
                  }}
                >
                  Tell us what you want to achieve and any dietary preferences you have.
                </Typography>
              </Box>

              <Stack spacing={4}>
                {/* Fitness Goals */}
                <ModernCard variant="glass">
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      mb: 3,
                      textAlign: 'center',
                    }}
                  >
                    Primary Fitness Goal
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {fitnessGoals.map((goal) => (
                      <Grid item xs={12} sm={6} md={4} key={goal.value}>
                        <Box
                          onClick={() => setFormData(prev => ({ ...prev, fitness_goal: goal.value }))}
                          sx={{
                            p: 3,
                            borderRadius: '16px',
                            border: '2px solid',
                            borderColor: formData.fitness_goal === goal.value 
                              ? goal.color 
                              : 'rgba(255, 255, 255, 0.1)',
                            background: formData.fitness_goal === goal.value 
                              ? `${goal.color}20` 
                              : 'rgba(255, 255, 255, 0.05)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              borderColor: goal.color,
                              background: `${goal.color}10`,
                            }
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 50,
                              height: 50,
                              mx: 'auto',
                              mb: 2,
                              background: `linear-gradient(135deg, ${goal.color} 0%, ${goal.color}80 100%)`,
                            }}
                          >
                            {goal.icon}
                          </Avatar>
                          <Typography
                            variant="h6"
                            sx={{
                              color: '#FFFFFF',
                              fontWeight: 600,
                              mb: 0.5,
                            }}
                          >
                            {goal.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  
                  {fieldErrors.fitness_goal && (
                    <Alert severity="error" sx={{ mt: 2, background: 'rgba(239, 68, 68, 0.1)' }}>
                      {fieldErrors.fitness_goal}
                    </Alert>
                  )}
                </ModernCard>

                {/* Dietary Restrictions */}
                <ModernCard variant="glass">
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      mb: 2,
                      textAlign: 'center',
                    }}
                  >
                    Dietary Preferences (Optional)
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#94A3B8',
                      textAlign: 'center',
                      mb: 3,
                    }}
                  >
                    Select any dietary restrictions to personalize your meal plans
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
                    {commonDietaryRestrictions.map((restriction) => (
                      <Chip
                        key={restriction.value}
                        label={`${restriction.emoji} ${restriction.label}`}
                        clickable
                        color={formData.dietary_restrictions.includes(restriction.value) ? 'primary' : 'default'}
                        onClick={() => handleDietaryRestrictionToggle(restriction.value)}
                        sx={{
                          borderRadius: '20px',
                          fontWeight: 600,
                          py: 2,
                          px: 1,
                          ...(formData.dietary_restrictions.includes(restriction.value) && {
                            background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                            color: '#FFFFFF',
                          }),
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                          }
                        }}
                      />
                    ))}
                  </Box>
                </ModernCard>
              </Stack>
            </Box>
          </Slide>
        );

      default:
        return 'Unknown step';
    }
  };

  const progressPercentage = ((activeStep + 1) / steps.length) * 100;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F1419 0%, #1A202C 50%, #2D3748 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Progress Header */}
        <ModernCard
          variant="glass"
          sx={{
            mb: 4,
            background: 'rgba(37, 42, 61, 0.6)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                fontWeight: 400,
                color: '#FFFFFF',
              }}
            >
              Setup Progress
            </Typography>
            
            <Typography variant="body1" sx={{ color: '#00D4FF', fontWeight: 600 }}>
              {activeStep + 1} of {steps.length}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              mb: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                borderRadius: 4,
              },
            }}
          />

          <Stepper activeStep={activeStep} sx={{ '& .MuiStepLabel-label': { color: '#94A3B8' } }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={({ active, completed }) => (
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        background: completed || active 
                          ? 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)'
                          : 'rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                      }}
                    >
                      {completed ? <CheckCircle /> : getStepIcon(index)}
                    </Avatar>
                  )}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: activeStep >= index ? '#FFFFFF' : '#94A3B8',
                      fontWeight: activeStep === index ? 600 : 400,
                    }}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </ModernCard>

        {/* Error Message */}
        {submitError && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              '& .MuiAlert-message': { color: '#FFFFFF' },
            }}
          >
            {submitError}
          </Alert>
        )}

        {/* Step Content */}
        <Box sx={{ mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {activeStep > 0 && (
            <SecondaryButton
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Back
            </SecondaryButton>
          )}
          
          {activeStep === steps.length - 1 ? (
            <PrimaryButton
              onClick={handleFinish}
              loading={isSubmitting}
              disabled={isSubmitting}
              size="large"
              sx={{ minWidth: '200px' }}
            >
              {isSubmitting ? 'Setting up your profile...' : '🚀 Complete Setup'}
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={handleNext}
              size="large"
              sx={{ minWidth: '160px' }}
            >
              Next Step
            </PrimaryButton>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
            🤖 Powered by EvolveFit AI - Your Personal Fitness Assistant
          </Typography>
          <Typography variant="caption" sx={{ color: '#6B7280' }}>
            All information is securely encrypted and used only to personalize your experience
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default OnboardingPage;