// src/pages/Profile.js - Modern Categorized Profile Page

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Box,
  Chip,
  Stack,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  AccountCircle,
  Save,
  Person,
  FitnessCenter,
  Restaurant,
  Info,
  VpnKey,
  QrCode2,
  CardMembership,
  Refresh,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { usePreferences } from '../contexts/PreferencesContext';

// Import new design system components
import { PageContainer } from '../components/design-system';
import { Alert } from '../components/design-system';

// Import API services
import { communityService } from '../services/api';
import authService from '../services/api/authService';

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

  // QR Code and Membership state
  const [qrCodeData, setQrCodeData] = useState(null);
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [membershipInfo, setMembershipInfo] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(false);

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

  // Fetch QR code when user joins a gym
  useEffect(() => {
    if (user?.gym_id) {
      fetchQRCode();
      fetchMembershipInfo();
    }
  }, [user?.gym_id]);

  // Function to fetch user QR code
  const fetchQRCode = async () => {
    if (!user?.gym_id) {
      console.log('User has no gym_id, skipping QR code fetch');
      return;
    }

    setQrCodeLoading(true);
    try {
      const data = await authService.getUserQRCode();
      console.log('QR Code data:', data);
      setQrCodeData(data);
    } catch (err) {
      console.error('Failed to fetch QR code:', err);
      setQrCodeData(null);
    } finally {
      setQrCodeLoading(false);
    }
  };

  // Function to fetch membership info
  const fetchMembershipInfo = async () => {
    if (!user?.gym_id) {
      console.log('User has no gym_id, skipping membership info fetch');
      return;
    }

    setMembershipLoading(true);
    try {
      const data = await authService.getMembershipInfo();
      console.log('Membership info:', data);
      setMembershipInfo(data);
    } catch (err) {
      console.error('Failed to fetch membership info:', err);
      setMembershipInfo(null);
    } finally {
      setMembershipLoading(false);
    }
  };

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
      const response = await communityService.joinGymByCode(gymCodeInput);
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
    <PageContainer
      title="Your Fitness Profile"
      subtitle="Personalize your fitness journey for better AI recommendations"
      maxWidth="lg"
    >
      {/* Success/Error Messages */}
      {message && (
        <Alert severity="success" closable sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" closable sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {gymCodeMessage && (
        <Alert severity="success" closable sx={{ mb: 3 }}>
          {gymCodeMessage}
        </Alert>
      )}

      {gymCodeError && (
        <Alert severity="error" closable sx={{ mb: 3 }}>
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
          {/* Gym Affiliation, QR Code & Membership Section */}
          <Grid item xs={12}>
            <ModernCard
              title="Gym Affiliation"
              subtitle={user?.gym_id ? "Manage your gym membership" : "Join a gym community"}
              variant="glass"
              headerAction={<FitnessCenter sx={{ color: '#00D4FF' }} />}
            >
              {user?.gym_id ? (
                <Grid container spacing={3}>
                  {/* Membership Info */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                        border: '1px solid rgba(124, 58, 237, 0.2)',
                      }}
                    >
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CardMembership sx={{ color: '#7C3AED' }} />
                          <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                            Membership Details
                          </Typography>
                        </Box>

                        {membershipLoading ? (
                          <CircularProgress size={24} sx={{ color: '#7C3AED' }} />
                        ) : membershipInfo ? (
                          <Stack spacing={1.5}>
                            <Box>
                              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                Gym Name
                              </Typography>
                              <Typography variant="body1" sx={{ color: '#CBD5E1', fontWeight: 500 }}>
                                {membershipInfo.gym_name || 'N/A'}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                Membership Status
                              </Typography>
                              <Chip
                                label={membershipInfo.membership_status || 'ACTIVE'}
                                size="small"
                                sx={{
                                  mt: 0.5,
                                  background: membershipInfo.membership_status === 'ACTIVE'
                                    ? 'linear-gradient(135deg, #10B981 0%, #34D399 100%)'
                                    : 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                                  color: '#FFFFFF',
                                  fontWeight: 600,
                                }}
                              />
                            </Box>

                            {membershipInfo.membership_expiry && (
                              <Box>
                                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                  Membership Expiry
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#CBD5E1', fontWeight: 500 }}>
                                  {new Date(membershipInfo.membership_expiry).toLocaleDateString()}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                        ) : (
                          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                            Unable to load membership details
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </Grid>

                  {/* QR Code Display */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 168, 255, 0.05) 100%)',
                        border: '1px solid rgba(0, 212, 255, 0.2)',
                        textAlign: 'center',
                      }}
                    >
                      <Stack spacing={2} alignItems="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <QrCode2 sx={{ color: '#00D4FF' }} />
                          <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                            Check-In QR Code
                          </Typography>
                        </Box>

                        {qrCodeLoading ? (
                          <CircularProgress size={100} sx={{ color: '#00D4FF' }} />
                        ) : qrCodeData?.qr_code_url ? (
                          <>
                            <Box
                              sx={{
                                p: 2,
                                background: '#FFFFFF',
                                borderRadius: '12px',
                                display: 'inline-block',
                              }}
                            >
                              <img
                                src={qrCodeData.qr_code_url}
                                alt="User QR Code"
                                style={{
                                  width: '200px',
                                  height: '200px',
                                  display: 'block',
                                }}
                              />
                            </Box>
                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                              Show this QR code at gym entrance for check-in
                            </Typography>
                            <Button
                              startIcon={<Refresh />}
                              onClick={fetchQRCode}
                              sx={{
                                color: '#00D4FF',
                                textTransform: 'none',
                                '&:hover': {
                                  background: 'rgba(0, 212, 255, 0.1)',
                                },
                              }}
                            >
                              Refresh QR Code
                            </Button>
                          </>
                        ) : (
                          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                            QR code not available
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
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
                      disabled={loading}
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
    </PageContainer>
  );
}

export default Profile;