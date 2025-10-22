// src/pages/GymSelection.js - Modern Dark Glass UI

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Chip,
  InputAdornment,
  Container,
  Button,
  LinearProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const GymSelection = () => {
  const { user } = useAuth();
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [occupancyData, setOccupancyData] = useState({});

  useEffect(() => {
    loadGyms();
  }, [search]);

  const loadGyms = async () => {
    try {
      setLoading(true);
      const data = await apiService.searchGyms(search);
      setGyms(data);

      // Fetch occupancy data for each gym
      const occupancyPromises = data.map((gym) =>
        apiService.fetchGymOccupancy(gym.id).catch(() => null)
      );
      const occupancies = await Promise.all(occupancyPromises);

      const occupancyMap = {};
      data.forEach((gym, index) => {
        if (occupancies[index]) {
          occupancyMap[gym.id] = occupancies[index];
        }
      });
      setOccupancyData(occupancyMap);
    } catch (error) {
      console.error('Failed to load gyms:', error);
      toast.error('Failed to load gyms');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGym = async (gymId) => {
    try {
      await apiService.joinGym(gymId);
      toast.success('Successfully joined gym!');
      loadGyms(); // Reload to reflect changes
    } catch (error) {
      console.error('Failed to join gym:', error);
      toast.error('Failed to join gym');
    }
  };

  const getOccupancyColor = (percentage) => {
    if (percentage < 40) return '#10B981'; // Green
    if (percentage < 70) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  const getOccupancyLabel = (percentage) => {
    if (percentage < 40) return 'Low';
    if (percentage < 70) return 'Moderate';
    return 'High';
  };

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 50%, #252A3D 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: 12,
      }}>
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ color: '#00D4FF', mb: 3 }} />
          <Typography variant="h6" sx={{ color: '#CBD5E1' }}>
            Loading gyms...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 50%, #252A3D 100%)',
      pt: 12,
      pb: 6,
    }}>
      <Container maxWidth="lg">
        {/* Hero Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
            p: 2,
            borderRadius: 3,
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
          }}>
            <FitnessCenterIcon sx={{ fontSize: 48, color: '#00D4FF' }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(45deg, #00D4FF, #FFFFFF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Find Your Gym
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: '#94A3B8', maxWidth: 600, mx: 'auto' }}>
            Join a gym to compete on the leaderboard and track your progress! 💪
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search for gyms by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#00D4FF' }} />
                </InputAdornment>
              ),
              sx: {
                background: 'rgba(26, 31, 46, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: 2,
                color: 'white',
                '&:hover': {
                  borderColor: '#00D4FF',
                  boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
                },
                '&.Mui-focused': {
                  borderColor: '#00D4FF',
                  boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              },
            }}
          />
        </Box>

        {/* Current Gym Badge */}
        {user?.gym_id && (
          <Alert
            severity="success"
            icon={<CheckCircleIcon />}
            sx={{
              mb: 4,
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 2,
              color: '#10B981',
              '& .MuiAlert-icon': { color: '#10B981' },
            }}
          >
            You are currently a member of a gym
          </Alert>
        )}

        {/* Gym Cards Grid */}
        {gyms.length > 0 ? (
          <Grid container spacing={3}>
            {gyms.map((gym) => {
              const occupancy = occupancyData[gym.id];
              const occupancyPercentage = occupancy
                ? Math.round((occupancy.current_occupancy / occupancy.capacity) * 100)
                : null;

              return (
                <Grid item xs={12} md={6} lg={4} key={gym.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(26, 31, 46, 0.8)',
                      backdropFilter: 'blur(20px)',
                      border: user?.gym_id === gym.id
                        ? '2px solid rgba(0, 212, 255, 0.5)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 48px rgba(0, 212, 255, 0.15)',
                        borderColor: 'rgba(0, 212, 255, 0.4)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Gym Name */}
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <FitnessCenterIcon sx={{ color: '#00D4FF' }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                          {gym.name}
                        </Typography>
                        {user?.gym_id === gym.id && (
                          <Chip
                            label="Current"
                            size="small"
                            sx={{
                              background: 'linear-gradient(45deg, #00D4FF, #7C3AED)',
                              color: 'white',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                            }}
                          />
                        )}
                      </Box>

                      {/* Address */}
                      <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
                        <LocationOnIcon sx={{ color: '#94A3B8', fontSize: 20, mt: 0.3 }} />
                        <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.6 }}>
                          {gym.address}
                        </Typography>
                      </Box>

                      {/* Members Count */}
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <PeopleIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                          {gym.member_count || 0} members
                        </Typography>
                      </Box>

                      {/* Occupancy */}
                      {occupancyPercentage !== null && (
                        <Box mt={2}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2" sx={{ color: '#CBD5E1', fontWeight: 600 }}>
                              Current Occupancy
                            </Typography>
                            <Chip
                              label={getOccupancyLabel(occupancyPercentage)}
                              size="small"
                              sx={{
                                background: `${getOccupancyColor(occupancyPercentage)}20`,
                                color: getOccupancyColor(occupancyPercentage),
                                fontWeight: 600,
                                fontSize: '0.7rem',
                              }}
                            />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(occupancyPercentage, 100)}
                            sx={{
                              height: 8,
                              borderRadius: 1,
                              backgroundColor: 'rgba(37, 42, 61, 0.6)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 1,
                                background: `linear-gradient(90deg, ${getOccupancyColor(occupancyPercentage)}, ${getOccupancyColor(occupancyPercentage)}CC)`,
                              },
                            }}
                          />
                          <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.5 }}>
                            {occupancy.current_occupancy} / {occupancy.capacity} capacity
                          </Typography>
                        </Box>
                      )}
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0 }}>
                      {user?.gym_id === gym.id ? (
                        <Button
                          fullWidth
                          disabled
                          startIcon={<CheckCircleIcon />}
                          sx={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10B981',
                            fontWeight: 600,
                            borderRadius: 2,
                            py: 1.5,
                            '&.Mui-disabled': {
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#10B981',
                            },
                          }}
                        >
                          Current Gym
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          onClick={() => handleJoinGym(gym.id)}
                          sx={{
                            background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: 2,
                            py: 1.5,
                            boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 30px rgba(0, 212, 255, 0.4)',
                              filter: 'brightness(1.1)',
                            },
                          }}
                        >
                          Join This Gym
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box sx={{
            textAlign: 'center',
            p: 8,
            background: 'rgba(26, 31, 46, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
          }}>
            <FitnessCenterIcon sx={{ fontSize: 80, color: '#94A3B8', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
              No Gyms Found
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Try adjusting your search criteria
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default GymSelection;
