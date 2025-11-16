// src/components/NotificationPanel.js - Notification Dropdown Panel

import React from 'react';
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  Chip,
  Button,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  FitnessCenter,
  EmojiEvents,
  Restaurant,
  TrendingUp,
  Info,
  MarkEmailRead,
  OpenInNew,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Notification icon mapping
const getNotificationIcon = (type) => {
  const iconMap = {
    workout: <FitnessCenter sx={{ fontSize: 20 }} />,
    achievement: <EmojiEvents sx={{ fontSize: 20 }} />,
    meal: <Restaurant sx={{ fontSize: 20 }} />,
    progress: <TrendingUp sx={{ fontSize: 20 }} />,
    general: <Info sx={{ fontSize: 20 }} />,
  };
  return iconMap[type] || <Info sx={{ fontSize: 20 }} />;
};

// Get color by notification type
const getIconColor = (type) => {
  const colorMap = {
    workout: '#00D4FF',
    achievement: '#FFD700',
    meal: '#10B981',
    progress: '#7C3AED',
    general: '#94A3B8',
  };
  return colorMap[type] || '#00D4FF';
};

/**
 * NotificationPanel Component
 * Dropdown panel for displaying notifications in the navbar
 */
function NotificationPanel({
  anchorEl,
  open,
  onClose,
  notifications = [],
  loading = false,
  onMarkAsRead,
  onMarkAllAsRead,
}) {
  const navigate = useNavigate();

  const unreadNotifications = notifications.filter((n) => !n.is_read);
  const recentNotifications = notifications.slice(0, 5); // Show only 5 most recent

  const handleViewAll = () => {
    navigate('/notifications');
    onClose();
  };

  const handleMarkAsRead = (notificationId) => {
    onMarkAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          width: 400,
          maxHeight: 500,
          background: 'rgba(26, 31, 46, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          mt: 1.5,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(0, 212, 255, 0.05)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          >
            Notifications
            {unreadNotifications.length > 0 && (
              <Chip
                label={unreadNotifications.length}
                size="small"
                sx={{
                  ml: 1,
                  background: 'linear-gradient(135deg, #00D4FF 0%, #00A8FF 100%)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 20,
                }}
              />
            )}
          </Typography>
          {unreadNotifications.length > 0 && (
            <Button
              size="small"
              startIcon={<CheckCircle sx={{ fontSize: 16 }} />}
              onClick={handleMarkAllAsRead}
              sx={{
                color: '#10B981',
                textTransform: 'none',
                fontSize: '0.8rem',
                minWidth: 'auto',
                '&:hover': {
                  background: 'rgba(16, 185, 129, 0.1)',
                },
              }}
            >
              Mark all read
            </Button>
          )}
        </Box>
      </Box>

      {/* Notifications List */}
      <Box sx={{ maxHeight: 380, overflowY: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} sx={{ color: '#00D4FF' }} />
          </Box>
        ) : recentNotifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '16px',
                background: 'rgba(0, 212, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Info sx={{ fontSize: 32, color: '#00D4FF' }} />
            </Box>
            <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 0.5 }}>
              No Notifications
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              You're all caught up!
            </Typography>
          </Box>
        ) : (
          recentNotifications.map((notification, index) => (
            <Box key={notification.id}>
              <MenuItem
                sx={{
                  py: 1.5,
                  px: 2,
                  background: notification.is_read
                    ? 'transparent'
                    : 'rgba(0, 212, 255, 0.05)',
                  '&:hover': {
                    background: 'rgba(0, 212, 255, 0.1)',
                  },
                  alignItems: 'flex-start',
                  gap: 1.5,
                }}
              >
                {/* Icon */}
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: `${getIconColor(notification.type)}20`,
                    color: getIconColor(notification.type),
                  }}
                >
                  {getNotificationIcon(notification.type)}
                </Avatar>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: notification.is_read ? '#94A3B8' : '#FFFFFF',
                        fontWeight: notification.is_read ? 500 : 600,
                        fontSize: '0.875rem',
                        lineHeight: 1.4,
                        flex: 1,
                      }}
                    >
                      {notification.title}
                    </Typography>
                    {!notification.is_read && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#00D4FF',
                          ml: 1,
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color: notification.is_read ? '#64748B' : '#CBD5E1',
                      fontSize: '0.75rem',
                      lineHeight: 1.3,
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    {notification.message}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#64748B',
                        fontSize: '0.7rem',
                      }}
                    >
                      {formatTimeAgo(notification.created_at)}
                    </Typography>

                    {!notification.is_read && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        sx={{
                          color: '#00D4FF',
                          padding: 0.5,
                          '&:hover': {
                            background: 'rgba(0, 212, 255, 0.2)',
                          },
                        }}
                      >
                        <MarkEmailRead sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </MenuItem>
              {index < recentNotifications.length - 1 && (
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
              )}
            </Box>
          ))
        )}
      </Box>

      {/* Footer */}
      {recentNotifications.length > 0 && (
        <>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Box sx={{ p: 1.5, textAlign: 'center' }}>
            <Button
              fullWidth
              endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
              onClick={handleViewAll}
              sx={{
                color: '#00D4FF',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  background: 'rgba(0, 212, 255, 0.1)',
                },
              }}
            >
              View All Notifications
            </Button>
          </Box>
        </>
      )}
    </Menu>
  );
}

// Helper function to format time ago
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default NotificationPanel;
