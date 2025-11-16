// src/pages/Notifications.js - Notifications Center

import React, { useState } from 'react';
import {
  Typography,
  Box,
  Stack,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MarkEmailRead,
  Delete,
  FitnessCenter,
  Info,
  EmojiEvents,
  Restaurant,
  TrendingUp,
  CheckCircle,
  Refresh,
} from '@mui/icons-material';
import { PageContainer } from '../components/design-system';
import { Alert, EmptyState } from '../components/design-system';
import ModernCard from '../components/ModernCard';
import { useNotifications } from '../contexts/NotificationContext';

// Notification icon mapping
const getNotificationIcon = (type) => {
  const iconMap = {
    workout: <FitnessCenter sx={{ color: '#00D4FF' }} />,
    achievement: <EmojiEvents sx={{ color: '#FFD700' }} />,
    meal: <Restaurant sx={{ color: '#10B981' }} />,
    progress: <TrendingUp sx={{ color: '#7C3AED' }} />,
    general: <Info sx={{ color: '#94A3B8' }} />,
  };
  return iconMap[type] || <NotificationsIcon sx={{ color: '#00D4FF' }} />;
};

// Get color by notification type
const getNotificationColor = (type) => {
  const colorMap = {
    workout: 'rgba(0, 212, 255, 0.1)',
    achievement: 'rgba(255, 215, 0, 0.1)',
    meal: 'rgba(16, 185, 129, 0.1)',
    progress: 'rgba(124, 58, 237, 0.1)',
    general: 'rgba(148, 163, 184, 0.1)',
  };
  return colorMap[type] || 'rgba(0, 212, 255, 0.1)';
};

function Notifications() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setMessage('Notification marked as read');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      setError('Failed to update notification');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setMessage('All notifications marked as read');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      setError('Failed to update notifications');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <PageContainer
      title="Notifications"
      subtitle="Stay updated with your fitness journey"
      maxWidth="md"
    >
      {/* Messages */}
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

      {/* Header Actions */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
            {unreadCount > 0 ? `${unreadCount} Unread` : 'All Caught Up!'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<Refresh />}
            onClick={fetchNotifications}
            sx={{
              color: '#00D4FF',
              textTransform: 'none',
              '&:hover': {
                background: 'rgba(0, 212, 255, 0.1)',
              },
            }}
          >
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button
              startIcon={<CheckCircle />}
              onClick={handleMarkAllAsRead}
              sx={{
                color: '#10B981',
                textTransform: 'none',
                '&:hover': {
                  background: 'rgba(16, 185, 129, 0.1)',
                },
              }}
            >
              Mark All Read
            </Button>
          )}
        </Box>
      </Box>

      {/* Notifications List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#00D4FF' }} />
        </Box>
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No Notifications"
          description="You're all caught up! Check back later for updates."
        />
      ) : (
        <Stack spacing={2}>
          {notifications.map((notification) => (
            <ModernCard
              key={notification.id}
              variant="glass"
              sx={{
                background: notification.is_read
                  ? 'rgba(30, 41, 59, 0.4)'
                  : getNotificationColor(notification.type),
                border: notification.is_read
                  ? '1px solid rgba(255, 255, 255, 0.05)'
                  : '1px solid rgba(0, 212, 255, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 32px rgba(0, 212, 255, 0.15)',
                },
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                {/* Icon */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    background: 'rgba(0, 212, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getNotificationIcon(notification.type)}
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: notification.is_read ? '#94A3B8' : '#FFFFFF',
                        fontWeight: notification.is_read ? 500 : 600,
                        fontSize: '1rem',
                      }}
                    >
                      {notification.title}
                    </Typography>
                    {!notification.is_read && (
                      <Chip
                        label="New"
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #00D4FF 0%, #00A8FF 100%)',
                          color: '#FFFFFF',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    )}
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: notification.is_read ? '#64748B' : '#CBD5E1',
                      mb: 2,
                    }}
                  >
                    {notification.message}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      {new Date(notification.created_at).toLocaleString()}
                    </Typography>

                    {!notification.is_read && (
                      <IconButton
                        size="small"
                        onClick={() => handleMarkAsRead(notification.id)}
                        sx={{
                          color: '#00D4FF',
                          '&:hover': {
                            background: 'rgba(0, 212, 255, 0.1)',
                          },
                        }}
                      >
                        <MarkEmailRead fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Box>
            </ModernCard>
          ))}
        </Stack>
      )}
    </PageContainer>
  );
}

export default Notifications;
