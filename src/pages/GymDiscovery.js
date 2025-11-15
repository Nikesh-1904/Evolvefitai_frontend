// src/pages/GymDiscovery.js - Gym Discovery & Browsing

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Stack,
  TextField,
  InputAdornment,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  LocationOn,
  People,
  Schedule,
  AttachMoney,
  Phone,
  Email,
  Close,
  Add,
} from '@mui/icons-material';
import { PageContainer } from '../components/design-system';
import { Alert, EmptyState, Loading } from '../components/design-system';
import ModernCard from '../components/ModernCard';
import communityService from '../services/api/communityService';
import { useAuth } from '../contexts/AuthContext';

// Individual Gym Card Component
const GymCard = ({ gym, onJoin, onViewDetails, isCurrentGym }) => {
  return (
    <ModernCard variant="glass">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                color: '#FFFFFF',
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {gym.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94A3B8', mb: 1.5 }}>
              <LocationOn sx={{ fontSize: 16 }} />
              <Typography variant="body2">
                {gym.address}, {gym.city}, {gym.state} {gym.zip_code}
              </Typography>
            </Box>
          </Box>
          {isCurrentGym && (
            <Chip
              label="Current Gym"
              size="small"
              sx={{
                background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        {/* Gym Details */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {gym.capacity && (
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '8px',
                  background: 'rgba(0, 212, 255, 0.05)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <People sx={{ fontSize: 18, color: '#00D4FF' }} />
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Capacity
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#00D4FF', fontWeight: 600 }}>
                  {gym.capacity} members
                </Typography>
              </Box>
            </Grid>
          )}
          {gym.monthly_fee && (
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <AttachMoney sx={{ fontSize: 18, color: '#10B981' }} />
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Monthly Fee
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#10B981', fontWeight: 600 }}>
                  ${gym.monthly_fee}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Operating Hours */}
        {gym.operating_hours && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Schedule sx={{ fontSize: 18, color: '#7C3AED' }} />
              <Typography variant="body2" sx={{ color: '#CBD5E1', fontWeight: 600 }}>
                Operating Hours
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94A3B8', ml: 3.5 }}>
              {gym.operating_hours}
            </Typography>
          </Box>
        )}

        {/* Contact Information */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          {gym.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ fontSize: 16, color: '#94A3B8' }} />
              <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                {gym.phone}
              </Typography>
            </Box>
          )}
          {gym.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email sx={{ fontSize: 16, color: '#94A3B8' }} />
              <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                {gym.email}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            size="medium"
            onClick={() => onViewDetails(gym)}
            sx={{
              flex: 1,
              py: 1,
              color: '#00D4FF',
              borderColor: 'rgba(0, 212, 255, 0.3)',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              '&:hover': {
                borderColor: '#00D4FF',
                background: 'rgba(0, 212, 255, 0.1)',
              },
            }}
          >
            View Details
          </Button>
          {!isCurrentGym && (
            <Button
              variant="contained"
              size="medium"
              startIcon={<Add />}
              onClick={() => onJoin(gym)}
              sx={{
                flex: 1,
                py: 1,
                background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                  background: 'linear-gradient(45deg, #00B8E6 0%, #6B21A8 100%)',
                },
              }}
            >
              Join Gym
            </Button>
          )}
        </Stack>
      </Box>
    </ModernCard>
  );
};

// Gym Details Dialog
const GymDetailsDialog = ({ gym, open, onClose }) => {
  if (!gym) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(26, 31, 46, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
          {gym.name}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#CBD5E1' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Location */}
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#00D4FF', fontWeight: 600, mb: 1 }}>
              Location
            </Typography>
            <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
              {gym.address}
              <br />
              {gym.city}, {gym.state} {gym.zip_code}
            </Typography>
          </Box>

          {/* Details Grid */}
          <Grid container spacing={2}>
            {gym.capacity && (
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>Capacity</Typography>
                <Typography variant="body1" sx={{ color: '#00D4FF', fontWeight: 600 }}>
                  {gym.capacity} members
                </Typography>
              </Grid>
            )}
            {gym.monthly_fee && (
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>Monthly Fee</Typography>
                <Typography variant="body1" sx={{ color: '#10B981', fontWeight: 600 }}>
                  ${gym.monthly_fee}
                </Typography>
              </Grid>
            )}
          </Grid>

          {/* Operating Hours */}
          {gym.operating_hours && (
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#00D4FF', fontWeight: 600, mb: 1 }}>
                Operating Hours
              </Typography>
              <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                {gym.operating_hours}
              </Typography>
            </Box>
          )}

          {/* Contact */}
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#00D4FF', fontWeight: 600, mb: 1 }}>
              Contact Information
            </Typography>
            <Stack spacing={1}>
              {gym.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ fontSize: 16, color: '#94A3B8' }} />
                  <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                    {gym.phone}
                  </Typography>
                </Box>
              )}
              {gym.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 16, color: '#94A3B8' }} />
                  <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                    {gym.email}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#CBD5E1',
            textTransform: 'none',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function GymDiscovery() {
  const { user } = useAuth();
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGym, setSelectedGym] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async (search = '') => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;

      const data = await communityService.listGyms(params);
      setGyms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch gyms:', err);
      setError(err.message || 'Failed to load gyms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchGyms(searchQuery);
  };

  const handleJoinGym = async (gym) => {
    if (window.confirm(`Are you sure you want to join ${gym.name}?`)) {
      try {
        await communityService.joinGym(gym.id);
        alert(`Successfully joined ${gym.name}!`);
        // Refresh the gym list
        fetchGyms(searchQuery);
        // Reload the page to update user's gym info
        window.location.reload();
      } catch (err) {
        console.error('Failed to join gym:', err);
        alert(err.message || 'Failed to join gym. Please try again.');
      }
    }
  };

  const handleViewDetails = (gym) => {
    setSelectedGym(gym);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
    setSelectedGym(null);
  };

  return (
    <PageContainer
      title="Discover Gyms"
      subtitle="Find and join gyms near you"
      icon="🏋️"
      maxWidth="lg"
    >
      {/* Error Message */}
      {error && (
        <Alert severity="error" closable sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            placeholder="Search by gym name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#00D4FF' }} />
                </InputAdornment>
              ),
              sx: {
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                color: '#FFFFFF',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 212, 255, 0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00D4FF',
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              px: 4,
              py: 1.5,
              background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
              color: '#FFFFFF',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '12px',
              '&:hover': {
                background: 'linear-gradient(45deg, #00B8E6 0%, #6B21A8 100%)',
              },
            }}
          >
            Search
          </Button>
        </Stack>
      </Box>

      {/* Current Gym Info */}
      {user?.gym_id && (
        <Box
          sx={{
            p: 2.5,
            borderRadius: '12px',
            background: 'rgba(0, 212, 255, 0.05)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            mb: 3,
          }}
        >
          <Typography variant="body2" sx={{ color: '#00D4FF', fontWeight: 600 }}>
            You are currently a member of a gym. You can browse other gyms, but joining a new gym will remove you from your current gym.
          </Typography>
        </Box>
      )}

      {/* Gyms List */}
      {loading ? (
        <Loading />
      ) : gyms.length === 0 ? (
        <EmptyState
          title="No Gyms Found"
          description={searchQuery ? "Try adjusting your search query" : "No gyms available at this time"}
        />
      ) : (
        <>
          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
            Showing {gyms.length} gym{gyms.length !== 1 ? 's' : ''}
          </Typography>
          <Grid container spacing={3}>
            {gyms.map((gym) => (
              <Grid item xs={12} md={6} key={gym.id}>
                <GymCard
                  gym={gym}
                  onJoin={handleJoinGym}
                  onViewDetails={handleViewDetails}
                  isCurrentGym={user?.gym_id === gym.id}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Gym Details Dialog */}
      <GymDetailsDialog
        gym={selectedGym}
        open={detailsDialogOpen}
        onClose={handleCloseDetails}
      />
    </PageContainer>
  );
}

export default GymDiscovery;
