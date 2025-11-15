// src/components/design-system/EmptyState.js - Standardized Empty States

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
  FitnessCenter as WorkoutIcon,
  Restaurant as MealIcon,
  ShowChart as AnalyticsIcon,
  Search as SearchIcon,
  Error as ErrorIcon,
  Inbox as InboxIcon,
} from '@mui/icons-material';

/**
 * Standardized Empty State component for consistent messaging when no data is available
 *
 * @param {Object} props
 * @param {string} props.type - Type of empty state (workout, meal, analytics, search, error, default)
 * @param {string} props.title - Main message
 * @param {string} props.description - Optional detailed description
 * @param {Object} props.action - Optional action button { label, onClick }
 * @param {React.ReactNode} props.icon - Custom icon component
 * @param {Object} props.sx - Additional MUI sx styling
 */
const EmptyState = ({
  type = 'default',
  title,
  description,
  action,
  icon: CustomIcon,
  sx = {},
}) => {
  // Default icons based on type
  const getDefaultIcon = () => {
    switch (type) {
      case 'workout':
        return WorkoutIcon;
      case 'meal':
        return MealIcon;
      case 'analytics':
        return AnalyticsIcon;
      case 'search':
        return SearchIcon;
      case 'error':
        return ErrorIcon;
      default:
        return InboxIcon;
    }
  };

  // Default messages based on type
  const getDefaultMessage = () => {
    switch (type) {
      case 'workout':
        return {
          title: 'No Workouts Yet',
          description: 'Start your fitness journey by generating your first workout plan.',
        };
      case 'meal':
        return {
          title: 'No Meal Plans Yet',
          description: 'Create your first meal plan to fuel your fitness goals.',
        };
      case 'analytics':
        return {
          title: 'No Data Available',
          description: 'Complete some workouts to see your progress analytics.',
        };
      case 'search':
        return {
          title: 'No Results Found',
          description: 'Try adjusting your search or filters.',
        };
      case 'error':
        return {
          title: 'Something Went Wrong',
          description: 'We encountered an error loading this data. Please try again.',
        };
      default:
        return {
          title: 'Nothing Here Yet',
          description: 'This section is currently empty.',
        };
    }
  };

  const Icon = CustomIcon || getDefaultIcon();
  const defaults = getDefaultMessage();
  const displayTitle = title || defaults.title;
  const displayDescription = description || defaults.description;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 3,
        ...sx,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <Icon sx={{ fontSize: 40, color: 'text.secondary' }} />
      </Box>

      <Typography
        variant="h5"
        color="text.primary"
        gutterBottom
        sx={{ fontWeight: 600, mb: 1 }}
      >
        {displayTitle}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 400, mb: action ? 3 : 0 }}
      >
        {displayDescription}
      </Typography>

      {action && (
        <Button
          variant="contained"
          onClick={action.onClick}
          sx={{ mt: 2 }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
