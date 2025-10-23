// src/pages/Profile.js - Modern Categorized Profile Page

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Alert,
  Chip,
  Avatar,
  Stack,
  Divider,
} from '@mui/material';
import {
  AccountCircle,
  Save,
  Person,
  FitnessCenter,
  Restaurant,
  Info,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { usePreferences } from '../contexts/PreferencesContext';
import apiService from '../services/apiService';
// Import our modern components
import ModernCard from '../components/ModernCard';
import ModernInput, { ModernSelect } from '../components/ModernInput';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';
import ContextualHelp from '../components/ContextualHelp';


function Profile() {
  const { user, updateProfile, fetchUserStats } = useAuth();
  const { preferences } = usePreferences();
  
  // State management (preserved from original)
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    fitness_goal: '',
    experience_level: '',
    activity_level: '',
    dietary_restrictions: [],
  });
  const [gymCodeInput, setGymCodeInput] = useState('');
  const [gymCodeLoading, setGymCodeLoading] = useState(false);
  const [gymCodeMessage, setGymCodeMessage] = useState('');
  const [gymCodeError, setGymCodeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  // All useEffect and functions preserved exactly as original
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        username: user.username || '',
        age: user.age || '',
        weight: user.weight || '',
        height: user.height || '',
        gender: user.gender || '',
        fitness_goal: user.fitness_goal || '',
        experience_level: user.experience_level || '',
        activity_level: user.activity_level || '',
        dietary_restrictions: user.dietary_restrictions || [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear username error when user types
    if (name === 'username' && usernameError) {
      setUsernameError('');
    }
  };

  const handleDietaryRestrictionsChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      dietary_restrictions: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setUsernameError('');

    try {
      // Validate required fields
      if (!formData.full_name.trim()) {
        throw new Error('Full name is required');
      }
      if (!formData.username.trim()) {
        throw new Error('Username is required');
      }

      // Convert numeric fields
      const profileData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
      };

      await updateProfile(profileData);
      setMessage('Profile updated successfully!');
      
      // Auto-clear success message
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.message && error.message.toLowerCase().includes('username')) {
        setUsernameError(error.message);
      } else {
        setError(error.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGymSubmit = async (e) => {
    e.preventDefault();
    setGymCodeLoading(true);
    setGymCodeError('');
    setGymCodeMessage('');

    try {
      const response = await apiService.joinGymByCode(gymCodeInput);
      setGymCodeMessage(response.message || 'Successfully joined gym!');
      setGymCodeInput(''); // Clear input on success
      // Refresh user data to get the new gym_id
      await fetchUserStats(); // This re-fetches the user object via AuthContext
      // Auto-clear success message
      setTimeout(() => setGymCodeMessage(''), 4000);
    } catch (err) {
      setGymCodeError(err.message || 'Failed to join gym. Please check the code.');
    } finally {
      setGymCodeLoading(false);
    }
  };
  // Options for select fields (preserved from original)
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const fitnessGoalOptions = [
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'muscle_gain', label: 'Muscle Gain' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'strength', label: 'Strength' },
    { value: 'general_fitness', label: 'General Fitness' },
  ];

  const experienceLevelOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const activityLevelOptions = [
    { value: 'sedentary', label: 'Sedentary (Desk job, no exercise)' },
    { value: 'lightly_active', label: 'Lightly Active (Light exercise 1-3 days/week)' },
    { value: 'moderately_active', label: 'Moderately Active (Moderate exercise 3-5 days/week)' },
    { value: 'very_active', label: 'Very Active (Hard exercise 6-7 days/week)' },
    { value: 'extremely_active', label: 'Extremely Active (Physical job + exercise)' },
  ];

  const dietaryRestrictionsOptions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten_free', label: 'Gluten Free' },
    { value: 'dairy_free', label: 'Dairy Free' },
    { value: 'keto', label: 'Keto' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'low_carb', label: 'Low Carb' },
    { value: 'halal', label: 'Halal' },
    { value: 'kosher', label: 'Kosher' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Modern Profile Header */}
      <ModernCard 
        variant="feature" 
        elevation="high"
        sx={{ mb: 4, position: 'relative', overflow: 'hidden' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
              fontSize: '2.5rem',
              fontFamily: '"Gravitas One", "Montserrat", sans-serif',
              fontWeight: 400,
            }}
          >
            {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                fontWeight: 400,
                fontSize: { xs: '1.8rem', sm: '2.5rem' },
                color: '#FFFFFF',
                lineHeight: 1.2,
                mb: 1,
              }}
            >
              Your Fitness Profile
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: '#CBD5E1',
                fontWeight: 500,
                fontSize: '1.125rem',
                mb: 2,
              }}
            >
              Personalize your fitness journey for better AI recommendations
            </Typography>

            {/* Profile Completion Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle sx={{ color: '#10B981', fontSize: '1.25rem' }} />
              <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                Profile Active
              </Typography>
            </Box>
          </Box>
        </Box>
      </ModernCard>

      {/* Success/Error Messages */}
      {message && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3,
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            '& .MuiAlert-message': { color: '#FFFFFF' },
          }}
        >
          {message}
        </Alert>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            '& .MuiAlert-message': { color: '#FFFFFF' },
          }}
        >
          {error}
        </Alert>
      )}

      {gymCodeMessage && (
        <Alert severity="success" sx={{ mb: 3, /* ... styles ... */ }}>
          {gymCodeMessage}
        </Alert>
      )}
      {gymCodeError && (
        <Alert severity="error" sx={{ mb: 3, /* ... styles ... */ }}>
          {gymCodeError}
        </Alert>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {/* Personal Information Section */}
          <Grid item xs={12} md={6}>
            <ModernCard
              title="Personal Information"
              subtitle="Basic details about you"
              variant="glass"
              headerAction={<Person sx={{ color: '#00D4FF' }} />}
            >
              <Stack spacing={3}>
                <ModernInput
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  variant="outlined"
                  startIcon={<Person />}
                />

                <ModernInput
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a unique username"
                  required
                  variant="outlined"
                  error={!!usernameError}
                  helperText={usernameError}
                  startIcon={<AccountCircle />}
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <ModernInput
                      label="Age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Your age"
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <ModernSelect
                      label="Gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      options={genderOptions}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Stack>
            </ModernCard>
          </Grid>

          {/* Physical Metrics Section */}
          <Grid item xs={12} md={6}>
            <ModernCard
              title="Physical Metrics"
              subtitle="Body measurements for accurate calculations"
              variant="glass"
              headerAction={<Info sx={{ color: '#FF3366' }} />}
            >
              <Stack spacing={3}>
                <ModernInput
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Your current weight"
                  variant="outlined"
                  helperText={
                    preferences.weightUnit === 'lbs' 
                      ? "Your display preference is 'lbs', but please enter your weight in kg." 
                      : "Used for calorie and workout intensity calculations"
                  }
                />

                <ModernInput
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Your height in centimeters"
                  variant="outlined"
                  helperText={
                    preferences.heightUnit === 'ft/in' 
                      ? "Your display preference is 'ft/in', but please enter your height in cm." 
                      : "Used for BMI and fitness recommendations"
                  }
                />

                {/* BMI Display */}
                {formData.weight && formData.height && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      background: 'rgba(0, 212, 255, 0.1)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 0.5 }}>
                      Your BMI
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                        color: '#00D4FF',
                        fontWeight: 400,
                      }}
                    >
                      {((parseFloat(formData.weight) / (parseFloat(formData.height) / 100) ** 2) || 0).toFixed(1)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </ModernCard>
          </Grid>

          {/* Fitness Goals Section */}
          <Grid item xs={12} md={6}>
            <ModernCard
              title="Fitness Goals"
              subtitle="Define your fitness objectives and experience"
              variant="glass"
              headerAction={<FitnessCenter sx={{ color: '#7C3AED' }} />}
            >
              <Stack spacing={3}>
                <ModernSelect
                  label="Fitness Goal"
                  name="fitness_goal"
                  value={formData.fitness_goal}
                  onChange={handleChange}
                  options={fitnessGoalOptions}
                  placeholder="What do you want to achieve?"
                  variant="outlined"
                />

                <ModernSelect
                  label="Experience Level"
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                  options={experienceLevelOptions}
                  placeholder="Your fitness experience"
                  variant="outlined"
                />

                <ModernSelect
                  label="Activity Level"
                  name="activity_level"
                  value={formData.activity_level}
                  onChange={handleChange}
                  options={activityLevelOptions}
                  placeholder="How active are you?"
                  variant="outlined"
                  helperText="This helps calculate your daily calorie needs"
                />
              </Stack>
            </ModernCard>
          </Grid>

          {/* Dietary Preferences Section */}
          <Grid item xs={12} md={6}>
            <ModernCard
              title="Dietary Preferences"
              subtitle="Customize meal recommendations to your needs"
              variant="glass"
              headerAction={<Restaurant sx={{ color: '#10B981' }} />}
            >
              <Stack spacing={3}>
                <ModernSelect
                  label="Dietary Restrictions"
                  name="dietary_restrictions"
                  value={formData.dietary_restrictions}
                  onChange={handleDietaryRestrictionsChange}
                  options={dietaryRestrictionsOptions}
                  placeholder="Select any dietary restrictions"
                  multiple={true}
                  variant="outlined"
                  helperText="Select all that apply to get personalized meal plans"
                />

                {/* Selected Restrictions Display */}
                {formData.dietary_restrictions.length > 0 && (
                  <Box>
                    <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 1 }}>
                      Selected Restrictions:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.dietary_restrictions.map((restriction) => (
                        <Chip
                          key={restriction}
                          label={dietaryRestrictionsOptions.find(opt => opt.value === restriction)?.label || restriction}
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                            color: '#FFFFFF',
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Stack>
            </ModernCard>
          </Grid>
          {/* --- 👇 5. ADD NEW GYM CODE SECTION --- */}
          <Grid item xs={12}>
            <ModernCard
              title="Gym Affiliation"
              subtitle={user?.gym_id ? "Manage your gym membership" : "Join a gym community"}
              variant="glass"
              headerAction={<FitnessCenter sx={{ color: '#00D4FF' }} />}
            >
              {user?.gym_id ? (
                <Box>
                  <Typography variant="body1" sx={{ color: '#CBD5E1', mb: 2 }}>
                    You are currently a member of a gym. {/* You could display the gym name here if you fetch it */}
                  </Typography>
                  <SecondaryButton
                    // Add leave gym functionality if needed
                    // onClick={handleLeaveGym}
                    color="error"
                  >
                    Leave Gym (Implement Later)
                  </SecondaryButton>
                </Box>
              ) : (
                <form onSubmit={handleJoinGymSubmit}>
                  <Stack spacing={2}>
                    <Typography variant="body1" sx={{ color: '#CBD5E1' }}>
                      Enter the unique code provided by your gym to join its community leaderboard.
                    </Typography>
                    <ModernInput
                      label="Gym Code"
                      name="gym_code"
                      value={gymCodeInput}
                      onChange={(e) => setGymCodeInput(e.target.value)}
                      placeholder="Enter gym code"
                      required
                      variant="outlined"
                      startIcon={<VpnKey />}
                      error={!!gymCodeError}
                      helperText={gymCodeError || "Ask your gym administrator for the code."}
                    />
                    <PrimaryButton
                      type="submit"
                      loading={gymCodeLoading}
                      disabled={loading} // Disable if profile save is happening
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      {gymCodeLoading ? 'Joining...' : 'Join Gym'}
                    </PrimaryButton>
                  </Stack>
                </form>
              )}
            </ModernCard>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <SecondaryButton
            type="button"
            onClick={() => {
              if (user) {
                setFormData({
                  full_name: user.full_name || '',
                  username: user.username || '',
                  age: user.age || '',
                  weight: user.weight || '',
                  height: user.height || '',
                  gender: user.gender || '',
                  fitness_goal: user.fitness_goal || '',
                  experience_level: user.experience_level || '',
                  activity_level: user.activity_level || '',
                  dietary_restrictions: user.dietary_restrictions || [],
                });
                setMessage('Changes have been reset.');
                setError('');
                setUsernameError('');
              }
            }}
            disabled={loading}
          >
            Reset Changes
          </SecondaryButton>
          
          <PrimaryButton
            type="submit"
            loading={loading}
            startIcon={<Save />}
            sx={{ minWidth: '200px' }}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </PrimaryButton>
        </Box>

        {/* Profile Completion Tips */}
        <ModernCard
          variant="default"
          sx={{ mt: 4 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                fontWeight: 400,
                color: '#FFFFFF',
                mb: 2,
              }}
            >
              💡 Pro Tips for Better AI Recommendations
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ color: '#CBD5E1', fontWeight: 600, mb: 1 }}>
                    Complete Your Goals
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    Set specific fitness goals for personalized workout plans
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ color: '#CBD5E1', fontWeight: 600, mb: 1 }}>
                    Accurate Measurements
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    Provide accurate weight and height for precise calculations
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ color: '#CBD5E1', fontWeight: 600, mb: 1 }}>
                    Dietary Preferences
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    Include dietary restrictions for custom meal recommendations
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </ModernCard>
      </form>
      <ContextualHelp page="profile" />
    </Container>
  );
}

export default Profile;