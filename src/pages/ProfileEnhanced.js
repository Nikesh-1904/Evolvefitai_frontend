// src/pages/ProfileEnhanced.js - Ultra Premium Profile Design

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Box,
  Chip,
  Stack,
  Button,
  Tabs,
  Tab,
  Avatar,
  Fade,
  Skeleton,
  Card,
  CardContent,
} from '@mui/material';
import {
  Person,
  FitnessCenter,
  Restaurant,
  QrCode2,
  CardMembership,
  Edit,
  Save,
  Close,
  LocalFireDepartment,
  Timer,
  RepeatOne,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { communityService } from '../services/api';
import authService from '../services/api/authService';
import workoutService from '../services/api/workoutService';
import mealService from '../services/api/mealService';
import ModernInput, { ModernSelect } from '../components/ModernInput';

// Elegant Tab Panel with smooth transitions
function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Fade in={value === index} timeout={800}>
          <Box sx={{ pt: 5 }}>{children}</Box>
        </Fade>
      )}
    </div>
  );
}

// Premium Workout Card
const WorkoutCard = ({ workout }) => {
  const date = new Date(workout.workout_date || workout.created_at);

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 24px 48px rgba(0, 212, 255, 0.2)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          '&::before': {
            opacity: 1,
          },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #00D4FF 0%, #7C3AED 100%)',
          opacity: 0,
          transition: 'opacity 0.4s ease',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 0.5 }}>
              {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
          <Chip
            label={`${workout.exercises_completed?.length || 0} exercises`}
            size="small"
            sx={{
              background: 'rgba(0, 212, 255, 0.15)',
              color: '#00D4FF',
              fontWeight: 600,
              border: '1px solid rgba(0, 212, 255, 0.3)',
            }}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box
              sx={{
                textAlign: 'center',
                p: 2,
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <LocalFireDepartment sx={{ color: '#F59E0B', fontSize: 28, mb: 1 }} />
              <Typography variant="h6" sx={{ color: '#F59E0B', fontWeight: 700 }}>
                {Math.round(workout.calories_burned || 0)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Calories
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                textAlign: 'center',
                p: 2,
                borderRadius: '12px',
                background: 'rgba(124, 58, 237, 0.1)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
              }}
            >
              <Timer sx={{ color: '#7C3AED', fontSize: 28, mb: 1 }} />
              <Typography variant="h6" sx={{ color: '#7C3AED', fontWeight: 700 }}>
                {workout.duration_minutes || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Minutes
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                textAlign: 'center',
                p: 2,
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <RepeatOne sx={{ color: '#10B981', fontSize: 28, mb: 1 }} />
              <Typography variant="h6" sx={{ color: '#10B981', fontWeight: 700 }}>
                {workout.exercises_completed?.length || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Exercises
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Premium Meal Plan Card
const MealPlanCard = ({ plan }) => {
  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 24px 48px rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          '&::before': {
            opacity: 1,
          },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #10B981 0%, #F59E0B 100%)',
          opacity: 0,
          transition: 'opacity 0.4s ease',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 3 }}>
          {plan.name}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Target Calories
              </Typography>
              <Typography variant="h6" sx={{ color: '#F59E0B', fontWeight: 700 }}>
                {plan.target_calories}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Protein
              </Typography>
              <Typography variant="h6" sx={{ color: '#00D4FF', fontWeight: 700 }}>
                {plan.target_protein}g
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Carbs
              </Typography>
              <Typography variant="h6" sx={{ color: '#7C3AED', fontWeight: 700 }}>
                {plan.target_carbs}g
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Meals
              </Typography>
              <Typography variant="h6" sx={{ color: '#10B981', fontWeight: 700 }}>
                {plan.meals?.length || 0}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

function ProfileEnhanced() {
  const { user, updateProfile, stats } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
  });

  const [qrCodeData, setQrCodeData] = useState(null);
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [membershipInfo, setMembershipInfo] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(false);

  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [mealHistory, setMealHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

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
      });

      if (user.gym_id) {
        fetchQRCode();
        fetchMembershipInfo();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchWorkoutHistory();
    } else if (activeTab === 2) {
      fetchMealHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchQRCode = async () => {
    if (!user?.gym_id) return;
    setQrCodeLoading(true);
    try {
      const data = await authService.getUserQRCode();
      setQrCodeData(data);
    } catch (err) {
      console.error('Failed to fetch QR code:', err);
    } finally {
      setQrCodeLoading(false);
    }
  };

  const fetchMembershipInfo = async () => {
    if (!user?.gym_id) return;
    setMembershipLoading(true);
    try {
      const data = await authService.getMembershipInfo();
      setMembershipInfo(data);
    } catch (err) {
      console.error('Failed to fetch membership info:', err);
    } finally {
      setMembershipLoading(false);
    }
  };

  const fetchWorkoutHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await workoutService.getWorkoutLogs(20);
      console.log('Workout history data:', data);
      setWorkoutHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch workout history:', err);
      setWorkoutHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchMealHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await mealService.getMealPlans();
      setMealHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch meal history:', err);
      setMealHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleLeaveGym = async () => {
    if (!user?.gym_id) return;
    if (window.confirm('Are you sure you want to leave your current gym?')) {
      try {
        await communityService.leaveGym(user.gym_id);
        setMessage('Successfully left the gym.');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        setError(err.message || 'Failed to leave gym.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const profileData = {
        full_name: formData.full_name,
        username: formData.username,
        gender: formData.gender || null,
        age: formData.age ? parseInt(formData.age) : null,
        fitness_goal: formData.fitness_goal || null,
        experience_level: formData.experience_level || null,
        activity_level: formData.activity_level || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
      };

      await updateProfile(profileData);
      setMessage('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const fitnessGoalOptions = [
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'muscle_gain', label: 'Muscle Gain' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'general_fitness', label: 'General Fitness' },
  ];

  const experienceOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary' },
    { value: 'lightly_active', label: 'Lightly Active' },
    { value: 'moderately_active', label: 'Moderately Active' },
    { value: 'very_active', label: 'Very Active' },
    { value: 'extremely_active', label: 'Extremely Active' },
  ];

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      {/* Ultra Premium Hero Section */}
      <Fade in={true} timeout={800}>
        <Box
          sx={{
            position: 'relative',
            borderRadius: '32px',
            overflow: 'hidden',
            mb: 5,
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.15), transparent 50%), radial-gradient(circle at 80% 50%, rgba(124, 58, 237, 0.15), transparent 50%)',
              pointerEvents: 'none',
            },
          }}
        >
          <Box sx={{ p: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
              <Avatar
                sx={{
                  width: { xs: 100, md: 140 },
                  height: { xs: 100, md: 140 },
                  background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 700,
                  boxShadow: '0 20px 60px rgba(0, 212, 255, 0.4), 0 0 80px rgba(124, 58, 237, 0.3)',
                  border: '5px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.4s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 30px 80px rgba(0, 212, 255, 0.6), 0 0 100px rgba(124, 58, 237, 0.5)',
                  },
                }}
              >
                {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </Avatar>

              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="h2"
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 800,
                    mb: 1,
                    letterSpacing: '-0.03em',
                    fontSize: { xs: '2rem', md: '3rem' },
                  }}
                >
                  {user?.full_name || user?.username}
                </Typography>
                <Typography variant="h6" sx={{ color: '#94A3B8', mb: 3, fontWeight: 400 }}>
                  {user?.email}
                </Typography>

                {/* Stats Row */}
                <Stack direction="row" spacing={4} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#00D4FF', fontWeight: 700, mb: 0.5 }}>
                      {stats?.total_workouts || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Workouts
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#F59E0B', fontWeight: 700, mb: 0.5 }}>
                      {Math.round(stats?.total_calories_burned || 0)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Calories
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#7C3AED', fontWeight: 700, mb: 0.5 }}>
                      {Math.round((stats?.total_duration || 0) / 60)}h
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Training
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Button
                variant={editing ? 'outlined' : 'contained'}
                startIcon={editing ? <Close /> : <Edit />}
                onClick={() => setEditing(!editing)}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '16px',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  minWidth: 150,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  ...(editing
                    ? {
                        color: '#EF4444',
                        borderColor: 'rgba(239, 68, 68, 0.4)',
                        '&:hover': {
                          borderColor: '#EF4444',
                          background: 'rgba(239, 68, 68, 0.1)',
                        },
                      }
                    : {
                        background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                        color: '#FFFFFF',
                        boxShadow: '0 8px 24px rgba(0, 212, 255, 0.3)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 32px rgba(0, 212, 255, 0.5)',
                        },
                      }),
                }}
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>

      {/* Messages */}
      {message && (
        <Fade in={Boolean(message)}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: '16px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              mb: 4,
            }}
          >
            <Typography sx={{ color: '#10B981', fontWeight: 500 }}>{message}</Typography>
          </Box>
        </Fade>
      )}

      {error && (
        <Fade in={Boolean(error)}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: '16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              mb: 4,
            }}
          >
            <Typography sx={{ color: '#EF4444', fontWeight: 500 }}>{error}</Typography>
          </Box>
        </Fade>
      )}

      {/* Premium Tabs */}
      <Box
        sx={{
          borderBottom: '2px solid rgba(255, 255, 255, 0.05)',
          mb: 2,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -2,
            left: 0,
            height: 2,
            background: 'linear-gradient(90deg, #00D4FF 0%, #7C3AED 100%)',
            width: `${100 / (user?.gym_id ? 4 : 3)}%`,
            transform: `translateX(${activeTab * 100}%)`,
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '2px 2px 0 0',
          },
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTab-root': {
              color: '#64748B',
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              minHeight: 72,
              px: 4,
              transition: 'all 0.3s ease',
              '&.Mui-selected': {
                color: '#FFFFFF',
              },
              '&:hover': {
                color: '#00D4FF',
                background: 'rgba(0, 212, 255, 0.05)',
              },
            },
          }}
        >
          <Tab icon={<Person />} iconPosition="start" label="Profile" />
          <Tab icon={<FitnessCenter />} iconPosition="start" label="Workouts" />
          <Tab icon={<Restaurant />} iconPosition="start" label="Nutrition" />
          {user?.gym_id && <Tab icon={<CardMembership />} iconPosition="start" label="Membership" />}
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ModernInput
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                disabled={!editing}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ModernInput
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!editing}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ModernInput
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                disabled={!editing}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ModernInput
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                disabled={!editing}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ModernInput
                label="Height (cm)"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                disabled={!editing}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ModernSelect
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={genderOptions}
                disabled={!editing}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ModernSelect
                label="Fitness Goal"
                name="fitness_goal"
                value={formData.fitness_goal}
                onChange={handleChange}
                options={fitnessGoalOptions}
                disabled={!editing}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ModernSelect
                label="Experience Level"
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
                options={experienceOptions}
                disabled={!editing}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ModernSelect
                label="Activity Level"
                name="activity_level"
                value={formData.activity_level}
                onChange={handleChange}
                options={activityOptions}
                disabled={!editing}
                fullWidth
              />
            </Grid>
            {editing && (
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<Save />}
                  disabled={loading}
                  sx={{
                    px: 6,
                    py: 2,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 24px rgba(0, 212, 255, 0.3)',
                    '&:hover': {
                      boxShadow: '0 12px 32px rgba(0, 212, 255, 0.5)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {historyLoading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} md={6} key={i}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '20px', bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
              </Grid>
            ))}
          </Grid>
        ) : workoutHistory.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <FitnessCenter sx={{ fontSize: 100, color: '#94A3B8', opacity: 0.2, mb: 3 }} />
            <Typography variant="h5" sx={{ color: '#CBD5E1', mb: 1, fontWeight: 600 }}>
              No workouts logged yet
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B' }}>
              Start tracking your fitness journey today
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {workoutHistory.map((workout) => (
              <Grid item xs={12} md={6} key={workout.id}>
                <WorkoutCard workout={workout} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {historyLoading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} md={6} key={i}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '20px', bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
              </Grid>
            ))}
          </Grid>
        ) : mealHistory.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Restaurant sx={{ fontSize: 100, color: '#94A3B8', opacity: 0.2, mb: 3 }} />
            <Typography variant="h5" sx={{ color: '#CBD5E1', mb: 1, fontWeight: 600 }}>
              No meal plans saved yet
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B' }}>
              Create your first nutrition plan
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {mealHistory.map((plan) => (
              <Grid item xs={12} md={6} key={plan.id}>
                <MealPlanCard plan={plan} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {user?.gym_id && (
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <CardMembership sx={{ fontSize: 64, color: '#7C3AED', mb: 3 }} />
                <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 4 }}>
                  Membership Details
                </Typography>
                {membershipLoading ? (
                  <Skeleton variant="rectangular" height={150} sx={{ borderRadius: '16px' }} />
                ) : membershipInfo ? (
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Gym Name
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600, mt: 1 }}>
                        {membershipInfo.gym_name}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Status
                      </Typography>
                      <br />
                      <Chip
                        label={membershipInfo.membership_status || 'ACTIVE'}
                        sx={{
                          mt: 1,
                          px: 3,
                          py: 2.5,
                          background:
                            membershipInfo.membership_status === 'ACTIVE'
                              ? 'linear-gradient(135deg, #10B981 0%, #34D399 100%)'
                              : 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                        }}
                      />
                    </Box>
                    <Button
                      variant="outlined"
                      onClick={handleLeaveGym}
                      sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: '12px',
                        color: '#EF4444',
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: '#EF4444',
                          background: 'rgba(239, 68, 68, 0.1)',
                        },
                      }}
                    >
                      Leave Gym
                    </Button>
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    Unable to load membership details
                  </Typography>
                )}
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(0, 168, 255, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <QrCode2 sx={{ fontSize: 64, color: '#00D4FF', mb: 3 }} />
                <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 4 }}>
                  Check-in QR Code
                </Typography>
                {qrCodeLoading ? (
                  <Skeleton variant="rectangular" width={220} height={220} sx={{ mx: 'auto', borderRadius: '16px' }} />
                ) : qrCodeData?.qr_code ? (
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: '20px',
                      background: '#FFFFFF',
                      display: 'inline-block',
                      boxShadow: '0 20px 60px rgba(0, 212, 255, 0.3)',
                    }}
                  >
                    <img
                      src={qrCodeData.qr_code}
                      alt="Gym Check-in QR Code"
                      style={{ width: 220, height: 220, display: 'block' }}
                    />
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    QR code not available
                  </Typography>
                )}
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      )}
    </Box>
  );
}

export default ProfileEnhanced;
