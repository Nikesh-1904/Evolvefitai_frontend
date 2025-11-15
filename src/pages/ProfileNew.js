// src/pages/ProfileNew.js - Apple-inspired Profile with History Tabs

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Box,
  Chip,
  Stack,
  CircularProgress,
  Button,
  Tabs,
  Tab,
  Avatar,
  Fade,
  Slide,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Person,
  FitnessCenter,
  Restaurant,
  QrCode2,
  CardMembership,
  Refresh,
  Edit,
  TrendingUp,
  LocalFireDepartment,
  Timer,
  CalendarToday,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { communityService } from '../services/api';
import authService from '../services/api/authService';
import workoutService from '../services/api/workoutService';
import mealService from '../services/api/mealService';
import ModernCard from '../components/ModernCard';
import ModernInput, { ModernSelect } from '../components/ModernInput';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={value === index} timeout={500}>
          <Box sx={{ pt: 4 }}>{children}</Box>
        </Fade>
      )}
    </div>
  );
}

function ProfileNew() {
  const { user, updateProfile, fetchUserStats, stats } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Profile state
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

  // QR & Membership
  const [qrCodeData, setQrCodeData] = useState(null);
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [membershipInfo, setMembershipInfo] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(false);

  // History data
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
  }, [user]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchWorkoutHistory();
    } else if (activeTab === 2) {
      fetchMealHistory();
    }
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
      const data = await workoutService.getWorkoutLogs({ limit: 10 });
      setWorkoutHistory(Array.isArray(data) ? data : data.logs || []);
    } catch (err) {
      console.error('Failed to fetch workout history:', err);
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
    <Box>
      {/* Hero Section with Avatar */}
      <Slide direction="down" in={true} timeout={600}>
        <Box
          sx={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            mb: 4,
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Box sx={{ p: 6, position: 'relative', zIndex: 1 }}>
            <Stack direction="row" spacing={4} alignItems="center">
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
                  fontSize: '3rem',
                  fontWeight: 700,
                  boxShadow: '0 20px 60px rgba(0, 212, 255, 0.4)',
                  border: '4px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    mb: 1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {user?.full_name || user?.username}
                </Typography>
                <Typography variant="body1" sx={{ color: '#94A3B8', mb: 2 }}>
                  {user?.email}
                </Typography>
                <Stack direction="row" spacing={3}>
                  <Box>
                    <Typography variant="h5" sx={{ color: '#00D4FF', fontWeight: 600 }}>
                      {stats?.total_workouts || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      Workouts
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ color: '#F59E0B', fontWeight: 600 }}>
                      {Math.round(stats?.total_calories_burned || 0)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      Calories
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ color: '#7C3AED', fontWeight: 600 }}>
                      {Math.round((stats?.total_duration || 0) / 60)}h
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      Training Time
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Button
                variant={editing ? 'outlined' : 'contained'}
                startIcon={<Edit />}
                onClick={() => setEditing(!editing)}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  ...(editing
                    ? {
                        color: '#00D4FF',
                        borderColor: 'rgba(0, 212, 255, 0.3)',
                      }
                    : {
                        background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
                        color: '#FFFFFF',
                        '&:hover': {
                          boxShadow: '0 8px 24px rgba(0, 212, 255, 0.4)',
                        },
                      }),
                }}
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Slide>

      {/* Messages */}
      {message && (
        <Fade in={Boolean(message)}>
          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              mb: 3,
            }}
          >
            <Typography sx={{ color: '#10B981' }}>{message}</Typography>
          </Box>
        </Fade>
      )}

      {error && (
        <Fade in={Boolean(error)}>
          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              mb: 3,
            }}
          >
            <Typography sx={{ color: '#EF4444' }}>{error}</Typography>
          </Box>
        </Fade>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', mb: 0 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
            },
            '& .MuiTab-root': {
              color: '#94A3B8',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              minHeight: 64,
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
          <Tab icon={<FitnessCenter />} iconPosition="start" label="Workout History" />
          <Tab icon={<Restaurant />} iconPosition="start" label="Meal Plans" />
          {user?.gym_id && <Tab icon={<CardMembership />} iconPosition="start" label="Membership" />}
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
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
                  disabled={loading}
                  sx={{
                    px: 6,
                    py: 1.5,
                    borderRadius: '12px',
                    background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0, 212, 255, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
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
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#00D4FF' }} />
          </Box>
        ) : workoutHistory.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <FitnessCenter sx={{ fontSize: 80, color: '#94A3B8', opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#94A3B8', mb: 1 }}>
              No workout history yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Start logging your workouts to see them here
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#94A3B8', borderColor: 'rgba(255, 255, 255, 0.05)' }}>Date</TableCell>
                  <TableCell sx={{ color: '#94A3B8', borderColor: 'rgba(255, 255, 255, 0.05)' }}>Duration</TableCell>
                  <TableCell sx={{ color: '#94A3B8', borderColor: 'rgba(255, 255, 255, 0.05)' }}>Calories</TableCell>
                  <TableCell sx={{ color: '#94A3B8', borderColor: 'rgba(255, 255, 255, 0.05)' }}>Exercises</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workoutHistory.map((workout) => (
                  <TableRow
                    key={workout.id}
                    sx={{
                      '&:hover': {
                        background: 'rgba(0, 212, 255, 0.05)',
                      },
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <TableCell sx={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                      {new Date(workout.workout_date || workout.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                      {workout.duration_minutes} min
                    </TableCell>
                    <TableCell sx={{ color: '#F59E0B', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                      {Math.round(workout.calories_burned || 0)}
                    </TableCell>
                    <TableCell sx={{ color: '#00D4FF', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                      {workout.exercises_completed?.length || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {historyLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#00D4FF' }} />
          </Box>
        ) : mealHistory.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Restaurant sx={{ fontSize: 80, color: '#94A3B8', opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#94A3B8', mb: 1 }}>
              No meal plans yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Create your first meal plan to see it here
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {mealHistory.map((plan) => (
              <Grid item xs={12} md={6} key={plan.id}>
                <ModernCard variant="glass">
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 2 }}>
                      {plan.name}
                    </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                          Calories:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#F59E0B', fontWeight: 600 }}>
                          {plan.target_calories}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                          Protein:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#00D4FF', fontWeight: 600 }}>
                          {plan.target_protein}g
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                          Meals:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                          {plan.meals?.length || 0}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </ModernCard>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {user?.gym_id && (
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <ModernCard variant="glass">
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CardMembership sx={{ fontSize: 48, color: '#7C3AED', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 3 }}>
                    Membership Details
                  </Typography>
                  {membershipLoading ? (
                    <CircularProgress size={32} sx={{ color: '#7C3AED' }} />
                  ) : membershipInfo ? (
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                          Gym Name
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                          {membershipInfo.gym_name}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                          Status
                        </Typography>
                        <br />
                        <Chip
                          label={membershipInfo.membership_status || 'ACTIVE'}
                          sx={{
                            mt: 1,
                            background:
                              membershipInfo.membership_status === 'ACTIVE'
                                ? 'linear-gradient(45deg, #10B981 0%, #34D399 100%)'
                                : 'linear-gradient(45deg, #EF4444 0%, #F87171 100%)',
                            color: '#FFFFFF',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        onClick={handleLeaveGym}
                        sx={{
                          mt: 3,
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
                </Box>
              </ModernCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <ModernCard variant="glass">
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <QrCode2 sx={{ fontSize: 48, color: '#00D4FF', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 3 }}>
                    Check-in QR Code
                  </Typography>
                  {qrCodeLoading ? (
                    <CircularProgress size={32} sx={{ color: '#00D4FF' }} />
                  ) : qrCodeData?.qr_code ? (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: '#FFFFFF',
                        display: 'inline-block',
                      }}
                    >
                      <img
                        src={qrCodeData.qr_code}
                        alt="Gym Check-in QR Code"
                        style={{ width: 200, height: 200, display: 'block' }}
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                      QR code not available
                    </Typography>
                  )}
                </Box>
              </ModernCard>
            </Grid>
          </Grid>
        </TabPanel>
      )}
    </Box>
  );
}

export default ProfileNew;
