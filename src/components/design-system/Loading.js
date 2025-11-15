// src/components/design-system/Loading.js - Standardized Loading States

import React from 'react';
import {
  Box,
  CircularProgress,
  LinearProgress,
  Skeleton,
  Typography,
} from '@mui/material';

/**
 * Spinner Loading Component
 */
export const LoadingSpinner = ({
  size = 40,
  message,
  fullScreen = false,
  sx = {}
}) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...sx,
      }}
    >
      <CircularProgress size={size} thickness={4} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

/**
 * Linear Progress Bar
 */
export const LoadingBar = ({ message, sx = {} }) => (
  <Box sx={{ width: '100%', ...sx }}>
    <LinearProgress />
    {message && (
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: 'block', textAlign: 'center' }}
      >
        {message}
      </Typography>
    )}
  </Box>
);

/**
 * Skeleton Loaders for different content types
 */
export const SkeletonCard = ({ height = 200, sx = {} }) => (
  <Skeleton
    variant="rectangular"
    height={height}
    sx={{ borderRadius: 3, ...sx }}
  />
);

export const SkeletonText = ({ lines = 3, sx = {} }) => (
  <Box sx={sx}>
    {[...Array(lines)].map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        sx={{
          fontSize: '1rem',
          width: index === lines - 1 ? '80%' : '100%',
        }}
      />
    ))}
  </Box>
);

export const SkeletonAvatar = ({ size = 40, sx = {} }) => (
  <Skeleton variant="circular" width={size} height={size} sx={sx} />
);

/**
 * Complete Page Skeleton
 */
export const PageSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Skeleton variant="text" sx={{ fontSize: '2rem', width: '40%', mb: 3 }} />
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mb: 4 }}>
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} height={150} />
      ))}
    </Box>
    <SkeletonCard height={400} />
  </Box>
);

/**
 * Main Loading Component with multiple variants
 */
const Loading = ({
  variant = 'spinner',
  fullScreen = false,
  message,
  ...props
}) => {
  switch (variant) {
    case 'spinner':
      return <LoadingSpinner fullScreen={fullScreen} message={message} {...props} />;
    case 'bar':
      return <LoadingBar message={message} {...props} />;
    case 'page':
      return <PageSkeleton {...props} />;
    case 'card':
      return <SkeletonCard {...props} />;
    case 'text':
      return <SkeletonText {...props} />;
    default:
      return <LoadingSpinner fullScreen={fullScreen} message={message} {...props} />;
  }
};

export default Loading;
