// src/pages/DashboardNew.js - Premium Dashboard with Action Cards

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Chip,
  Stack,
  Slide,
} from '@mui/material';
import {
  AutoAwesome,
  Lightbulb,
  Restaurant,
  Create,
  TrendingUp,
  EmojiEvents,
  CalendarMonth,
  FitnessCenter,
  LocalFireDepartment,
  Timer,
  ArrowForward,
  Refresh,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import ModernCard from '../components/ModernCard';
import communityService from '../services/api/communityService';

// Quick Action Card Component
const ActionCard = ({ title, description, icon, color, onClick, badge }) => {
  return (
    <ModernCard
      variant="glass"
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 40px ${color}40`,
        },
      }}
      onClick={onClick}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '12px',
              background: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 28, color } })}
          </Box>
          {badge && (
            <Chip
              label={badge}
              size="small"
              sx={{
                background: `${color}20`,
                color,
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          )}
        </Box>
        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
          {description}
        </Typography>
        <Button
          endIcon={<ArrowForward />}
          sx={{
            color,
            textTransform: 'none',
            fontWeight: 600,
            p: 0,
            '&:hover': {
              background: 'transparent',
            },
          }}
        >
          Get Started
        </Button>
      </Box>
    </ModernCard>
  );
};

// Stat Card Component
const StatCard = ({ label, value, icon, color, trend }) => {
  return (
    <ModernCard variant="glass">
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '10px',
              background: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 24, color } })}
          </Box>
          {trend && (
            <Chip
              label={trend}
              size="small"
              sx={{
                background: trend.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: trend.startsWith('+') ? '#10B981' : '#EF4444',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          )}
        </Box>
        <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          {label}
        </Typography>
      </Box>
    </ModernCard>
  );
};

// Recent Activity Item
const ActivityItem = ({ icon, title, time, color }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        borderRadius: '12px',
        background: 'rgba(30, 41, 59, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.2s',
        '&:hover': {
          background: 'rgba(30, 41, 59, 0.5)',
          border: `1px solid ${color}40`,
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '8px',
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 20, color } })}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
          {time}
        </Typography>
      </Box>
    </Box>
  );
};

function DashboardNew() {
  const navigate = useNavigate();
  const { user, stats } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    if (user?.gym_id) {
      fetchUpcomingBookings();
    }
  }, [user]);

  const fetchUpcomingBookings = async () => {
    setLoadingBookings(true);
    try {
      const data = await communityService.getUserBookings({ limit: 3 });
      const bookings = Array.isArray(data) ? data : [];
      const upcoming = bookings
        .filter((b) => b.status === 'active' && new Date(b.start_time) > new Date())
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        .slice(0, 3);
      setUpcomingBookings(upcoming);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Calculate progress towards goal (example: 50 workouts per month)
  const workoutGoal = 50;
  const workoutProgress = ((stats?.total_workouts || 0) % workoutGoal / workoutGoal) * 100;

  return (
    <Box>
      {/* Welcome Section */}
      <Slide direction="down" in={true} timeout={600}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: '#FFFFFF',
              fontWeight: 700,
              mb: 1,
              letterSpacing: '-0.02em',
            }}
          >
            Welcome back, {user?.full_name?.split(' ')[0] || user?.username}! 👋
          </Typography>
          <Typography variant="body1" sx={{ color: '#94A3B8', fontSize: '1.125rem' }}>
            Ready to crush your fitness goals today? Let's get started.
          </Typography>
        </Box>
      </Slide>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Total Workouts"
            value={stats?.total_workouts || 0}
            icon={<FitnessCenter />}
            color="#00D4FF"
            trend="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Calories Burned"
            value={`${Math.round(stats?.total_calories_burned || 0)}`}
            icon={<LocalFireDepartment />}
            color="#F59E0B"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Training Time"
            value={`${Math.round((stats?.total_duration || 0) / 60)}h`}
            icon={<Timer />}
            color="#7C3AED"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Achievements"
            value={stats?.achievements_unlocked || 0}
            icon={<EmojiEvents />}
            color="#10B981"
            trend="+2"
          />
        </Grid>
      </Grid>

      {/* Monthly Goal Progress */}
      <ModernCard variant="glass" sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                Monthly Workout Goal
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                {stats?.total_workouts || 0} of {workoutGoal} workouts completed
              </Typography>
            </Box>
            <Chip
              label={`${Math.round(workoutProgress)}%`}
              sx={{
                background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                fontWeight: 600,
              }}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(workoutProgress, 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
              },
            }}
          />
        </Box>
      </ModernCard>

      {/* Quick Actions */}
      <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <ActionCard
            title="Generate Workout"
            description="Create a personalized AI-powered workout plan"
            icon={<AutoAwesome />}
            color="#00D4FF"
            badge="AI Powered"
            onClick={() => navigate('/generate-workout')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ActionCard
            title="AI Recommendations"
            description="Get smart workout suggestions based on your history"
            icon={<Lightbulb />}
            color="#F59E0B"
            badge="Smart"
            onClick={() => navigate('/workout-recommendations')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ActionCard
            title="Plan Your Meals"
            description="Generate nutrition plans tailored to your goals"
            icon={<Restaurant />}
            color="#10B981"
            onClick={() => navigate('/meal-plan-generator')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ActionCard
            title="Log Workout"
            description="Quickly track your completed exercises"
            icon={<Create />}
            color="#7C3AED"
            onClick={() => navigate('/log-workout')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ActionCard
            title="View Analytics"
            description="Track your progress with detailed insights"
            icon={<TrendingUp />}
            color="#EC4899"
            onClick={() => navigate('/analytics')}
          />
        </Grid>
        {user?.gym_id && (
          <Grid item xs={12} md={4}>
            <ActionCard
              title="Book Gym Time"
              description="Reserve your spot at the gym"
              icon={<CalendarMonth />}
              color="#06B6D4"
              onClick={() => navigate('/gym-bookings')}
            />
          </Grid>
        )}
      </Grid>

      {/* Two Column Layout */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <ModernCard variant="glass">
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                  Recent Activity
                </Typography>
                <IconButton size="small" sx={{ color: '#00D4FF' }}>
                  <Refresh />
                </IconButton>
              </Box>
              <Stack spacing={2}>
                {stats?.total_workouts > 0 ? (
                  <>
                    <ActivityItem
                      icon={<FitnessCenter />}
                      title="Completed Upper Body Workout"
                      time="2 hours ago"
                      color="#00D4FF"
                    />
                    <ActivityItem
                      icon={<Restaurant />}
                      title="Saved High Protein Meal Plan"
                      time="Yesterday"
                      color="#10B981"
                    />
                    <ActivityItem
                      icon={<EmojiEvents />}
                      title="Unlocked 'First Month' Achievement"
                      time="2 days ago"
                      color="#F59E0B"
                    />
                  </>
                ) : (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                      No recent activity. Start your first workout!
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AutoAwesome />}
                      onClick={() => navigate('/generate-workout')}
                      sx={{
                        mt: 2,
                        background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        textTransform: 'none',
                      }}
                    >
                      Generate Workout
                    </Button>
                  </Box>
                )}
              </Stack>
            </Box>
          </ModernCard>
        </Grid>

        {/* Upcoming Bookings */}
        <Grid item xs={12} md={4}>
          <ModernCard variant="glass">
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 3 }}>
                Upcoming Bookings
              </Typography>
              {user?.gym_id ? (
                loadingBookings ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                      Loading...
                    </Typography>
                  </Box>
                ) : upcomingBookings.length > 0 ? (
                  <Stack spacing={2}>
                    {upcomingBookings.map((booking) => {
                      const date = new Date(booking.start_time);
                      return (
                        <Box
                          key={booking.id}
                          sx={{
                            p: 2,
                            borderRadius: '8px',
                            background: 'rgba(0, 212, 255, 0.05)',
                            border: '1px solid rgba(0, 212, 255, 0.2)',
                          }}
                        >
                          <Typography variant="body2" sx={{ color: '#00D4FF', fontWeight: 600, mb: 0.5 }}>
                            {date.toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                      );
                    })}
                    <Button
                      onClick={() => navigate('/gym-bookings')}
                      sx={{
                        color: '#00D4FF',
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      View All Bookings
                    </Button>
                  </Stack>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <CalendarMonth sx={{ fontSize: 48, color: '#94A3B8', opacity: 0.3, mb: 1 }} />
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
                      No upcoming bookings
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate('/gym-bookings')}
                      sx={{
                        color: '#00D4FF',
                        borderColor: 'rgba(0, 212, 255, 0.3)',
                        textTransform: 'none',
                      }}
                    >
                      Book Now
                    </Button>
                  </Box>
                )
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
                    Join a gym to book sessions
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/gyms')}
                    sx={{
                      color: '#00D4FF',
                      borderColor: 'rgba(0, 212, 255, 0.3)',
                      textTransform: 'none',
                    }}
                  >
                    Discover Gyms
                  </Button>
                </Box>
              )}
            </Box>
          </ModernCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardNew;
