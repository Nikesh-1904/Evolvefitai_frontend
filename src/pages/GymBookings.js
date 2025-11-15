// src/pages/GymBookings.js - Gym Booking System

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add,
  Close,
  Delete,
  Schedule,
  CalendarToday,
  AccessTime,
  LocationOn,
} from '@mui/icons-material';
import { PageContainer } from '../components/design-system';
import { Alert, EmptyState, Loading } from '../components/design-system';
import ModernCard from '../components/ModernCard';
import communityService from '../services/api/communityService';
import { useAuth } from '../contexts/AuthContext';

// Booking status colors
const statusColors = {
  active: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: '#10B981' },
  cancelled: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#EF4444' },
  completed: { bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.3)', text: '#94A3B8' },
};

// Individual Booking Card
const BookingCard = ({ booking, onCancel }) => {
  const statusStyle = statusColors[booking.status] || statusColors.active;
  const startTime = new Date(booking.start_time);
  const endTime = new Date(booking.end_time);
  const isPast = endTime < new Date();
  const canCancel = booking.status === 'active' && !isPast;

  return (
    <ModernCard variant="glass">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              Gym Booking
            </Typography>
            <Chip
              label={booking.status.toUpperCase()}
              size="small"
              sx={{
                background: statusStyle.bg,
                border: `1px solid ${statusStyle.border}`,
                color: statusStyle.text,
                fontWeight: 600,
              }}
            />
          </Box>
          {canCancel && (
            <IconButton
              onClick={() => onCancel(booking)}
              sx={{
                color: '#EF4444',
                '&:hover': {
                  background: 'rgba(239, 68, 68, 0.1)',
                },
              }}
            >
              <Delete />
            </IconButton>
          )}
        </Box>

        {/* Booking Details */}
        <Grid container spacing={2}>
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
                <CalendarToday sx={{ fontSize: 16, color: '#00D4FF' }} />
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Date
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#00D4FF', fontWeight: 600 }}>
                {startTime.toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '8px',
                background: 'rgba(124, 58, 237, 0.05)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <AccessTime sx={{ fontSize: 16, color: '#7C3AED' }} />
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Time
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#7C3AED', fontWeight: 600 }}>
                {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ModernCard>
  );
};

// Create Booking Dialog
const CreateBookingDialog = ({ open, onClose, onSubmit, gymId }) => {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');

    if (!startDate || !startTime || !endTime) {
      setError('Please fill in all fields');
      return;
    }

    // Combine date and time
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${startDate}T${endTime}`);

    // Validation
    if (endDateTime <= startDateTime) {
      setError('End time must be after start time');
      return;
    }

    if (startDateTime < new Date()) {
      setError('Cannot book for past times');
      return;
    }

    onSubmit({
      gym_id: gymId,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
          Create Booking
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#CBD5E1' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" closable>
              {error}
            </Alert>
          )}

          <TextField
            label="Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              '& .MuiInputLabel-root': {
                color: '#94A3B8',
              },
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 212, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00D4FF',
                },
              },
            }}
          />

          <TextField
            label="Start Time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              '& .MuiInputLabel-root': {
                color: '#94A3B8',
              },
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 212, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00D4FF',
                },
              },
            }}
          />

          <TextField
            label="End Time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              '& .MuiInputLabel-root': {
                color: '#94A3B8',
              },
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 212, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00D4FF',
                },
              },
            }}
          />
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
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
            color: '#FFFFFF',
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
            '&:hover': {
              background: 'linear-gradient(45deg, #00B8E6 0%, #6B21A8 100%)',
            },
          }}
        >
          Create Booking
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function GymBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.gym_id) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await communityService.getUserBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError(err.message || 'Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (bookingData) => {
    try {
      await communityService.createBooking(bookingData);
      setSuccess('Booking created successfully!');
      setCreateDialogOpen(false);
      fetchBookings();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to create booking:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    }
  };

  const handleCancelBooking = async (booking) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await communityService.cancelBooking(booking.id);
        setSuccess('Booking cancelled successfully!');
        fetchBookings();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Failed to cancel booking:', err);
        setError(err.message || 'Failed to cancel booking. Please try again.');
      }
    }
  };

  // Check if user has a gym
  if (!user?.gym_id) {
    return (
      <PageContainer
        title="My Bookings"
        subtitle="Manage your gym visit bookings"
        icon="📅"
        maxWidth="lg"
      >
        <EmptyState
          title="No Gym Membership"
          description="You need to join a gym before you can create bookings"
          action={{
            label: "Discover Gyms",
            onClick: () => window.location.href = '/gyms'
          }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="My Bookings"
      subtitle="Manage your gym visit bookings"
      icon="📅"
      maxWidth="lg"
    >
      {/* Success Message */}
      {success && (
        <Alert severity="success" closable sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" closable sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Create Booking Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            px: 3,
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
          Create Booking
        </Button>
      </Box>

      {/* Bookings List */}
      {loading ? (
        <Loading />
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No Bookings Yet"
          description="Create your first gym booking to reserve your spot"
          action={{
            label: "Create Booking",
            onClick: () => setCreateDialogOpen(true)
          }}
        />
      ) : (
        <>
          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
            Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
          </Typography>
          <Grid container spacing={3}>
            {bookings.map((booking) => (
              <Grid item xs={12} md={6} key={booking.id}>
                <BookingCard
                  booking={booking}
                  onCancel={handleCancelBooking}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Create Booking Dialog */}
      <CreateBookingDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateBooking}
        gymId={user?.gym_id}
      />
    </PageContainer>
  );
}

export default GymBookings;
