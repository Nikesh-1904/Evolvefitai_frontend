// src/pages/GymAccess.js - Gym Access & QR Code Page

import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Stack,
  Chip,
} from '@mui/material';
import {
  Business,
  LocationOn,
  Schedule,
  Phone,
  Email,
} from '@mui/icons-material';
import { PageContainer } from '../components/design-system';
import ModernCard from '../components/ModernCard';
import GymQRCodeDisplay from '../components/GymQRCodeDisplay';
import { useAuth } from '../contexts/AuthContext';

function GymAccess() {
  const { user } = useAuth();

  // Mock gym data - in real app this would come from API
  const gymInfo = user?.gym_id ? {
    name: user.gym_name || 'Your Gym',
    address: '123 Fitness Street',
    city: 'San Francisco, CA 94102',
    phone: '(555) 123-4567',
    email: 'info@yourgym.com',
    hours: 'Mon-Fri: 5AM-11PM, Sat-Sun: 7AM-9PM',
    membershipStatus: user.membership_status || 'active',
  } : null;

  return (
    <PageContainer
      title="Gym Access"
      subtitle="Your QR code and gym membership information"
      maxWidth="lg"
    >
      {!gymInfo ? (
        <ModernCard variant="glass">
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Business sx={{ fontSize: 64, color: '#94A3B8', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
              No Gym Membership
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Join a gym to access your QR code and track attendance
            </Typography>
          </Box>
        </ModernCard>
      ) : (
        <Grid container spacing={3}>
          {/* QR Code Section */}
          <Grid item xs={12} md={6}>
            <GymQRCodeDisplay />
          </Grid>

          {/* Gym Information */}
          <Grid item xs={12} md={6}>
            <ModernCard
              title="Gym Information"
              subtitle="Your current gym membership details"
              variant="glass"
            >
              <Stack spacing={3}>
                {/* Membership Status */}
                <Box>
                  <Typography variant="caption" sx={{ color: '#94A3B8', mb: 1, display: 'block' }}>
                    Membership Status
                  </Typography>
                  <Chip
                    label={gymInfo.membershipStatus?.toUpperCase() || 'ACTIVE'}
                    sx={{
                      background: gymInfo.membershipStatus === 'active'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                      color: gymInfo.membershipStatus === 'active' ? '#10B981' : '#EF4444',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {/* Gym Name */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Business sx={{ color: '#00D4FF', mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 0.5 }}>
                      Gym Name
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                      {gymInfo.name}
                    </Typography>
                  </Box>
                </Box>

                {/* Address */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <LocationOn sx={{ color: '#00D4FF', mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 0.5 }}>
                      Location
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                      {gymInfo.address}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                      {gymInfo.city}
                    </Typography>
                  </Box>
                </Box>

                {/* Hours */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Schedule sx={{ color: '#00D4FF', mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 0.5 }}>
                      Operating Hours
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                      {gymInfo.hours}
                    </Typography>
                  </Box>
                </Box>

                {/* Contact Info */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Phone sx={{ color: '#00D4FF', mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 0.5 }}>
                      Phone
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                      {gymInfo.phone}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Email sx={{ color: '#00D4FF', mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 0.5 }}>
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                      {gymInfo.email}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </ModernCard>
          </Grid>
        </Grid>
      )}
    </PageContainer>
  );
}

export default GymAccess;
