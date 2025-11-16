// src/components/LoadingSkeleton.js - Loading Skeleton Components

import React from 'react';
import {
  Box,
  Skeleton,
  Grid,
  Stack,
} from '@mui/material';

/**
 * Card Skeleton - For loading cards
 */
export const CardSkeleton = ({ height = 200 }) => (
  <Box
    sx={{
      p: 3,
      borderRadius: '20px',
      background: 'rgba(30, 41, 59, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}
  >
    <Stack spacing={2}>
      <Skeleton
        variant="text"
        width="60%"
        height={32}
        sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
      />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={height}
        sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}
      />
      <Stack direction="row" spacing={1}>
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
        />
        <Box sx={{ flex: 1 }}>
          <Skeleton
            variant="text"
            width="80%"
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
          />
          <Skeleton
            variant="text"
            width="40%"
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
          />
        </Box>
      </Stack>
    </Stack>
  </Box>
);

/**
 * Dashboard Skeleton - For loading dashboard
 */
export const DashboardSkeleton = () => (
  <Box sx={{ py: 3 }}>
    {/* Header Skeleton */}
    <Box sx={{ mb: 4 }}>
      <Skeleton
        variant="text"
        width="30%"
        height={48}
        sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', mb: 1 }}
      />
      <Skeleton
        variant="text"
        width="50%"
        height={24}
        sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
      />
    </Box>

    {/* Stats Grid */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item}>
          <CardSkeleton height={120} />
        </Grid>
      ))}
    </Grid>

    {/* Chart Skeletons */}
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <CardSkeleton height={400} />
      </Grid>
      <Grid item xs={12} md={4}>
        <CardSkeleton height={400} />
      </Grid>
    </Grid>
  </Box>
);

/**
 * List Skeleton - For loading lists
 */
export const ListSkeleton = ({ items = 5 }) => (
  <Stack spacing={2}>
    {Array.from({ length: items }).map((_, index) => (
      <Box
        key={index}
        sx={{
          p: 2,
          borderRadius: '12px',
          background: 'rgba(30, 41, 59, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Skeleton
            variant="circular"
            width={48}
            height={48}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton
              variant="text"
              width="70%"
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
            />
            <Skeleton
              variant="text"
              width="40%"
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
            />
          </Box>
          <Skeleton
            variant="rectangular"
            width={80}
            height={32}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}
          />
        </Stack>
      </Box>
    ))}
  </Stack>
);

/**
 * Table Skeleton - For loading tables
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <Box
    sx={{
      p: 3,
      borderRadius: '20px',
      background: 'rgba(30, 41, 59, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}
  >
    {/* Table Header */}
    <Stack direction="row" spacing={2} sx={{ mb: 2, pb: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={`${100 / columns}%`}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
        />
      ))}
    </Stack>

    {/* Table Rows */}
    <Stack spacing={1.5}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Stack key={rowIndex} direction="row" spacing={2}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              width={`${100 / columns}%`}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
            />
          ))}
        </Stack>
      ))}
    </Stack>
  </Box>
);

/**
 * Profile Skeleton - For loading profile page
 */
export const ProfileSkeleton = () => (
  <Box sx={{ py: 3 }}>
    <Grid container spacing={3}>
      {/* Profile Header */}
      <Grid item xs={12}>
        <Box
          sx={{
            p: 4,
            borderRadius: '20px',
            background: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Skeleton
              variant="circular"
              width={100}
              height={100}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton
                variant="text"
                width="40%"
                height={40}
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', mb: 1 }}
              />
              <Skeleton
                variant="text"
                width="60%"
                height={24}
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
              />
            </Box>
          </Stack>
        </Box>
      </Grid>

      {/* Profile Content */}
      <Grid item xs={12} md={4}>
        <CardSkeleton height={300} />
      </Grid>
      <Grid item xs={12} md={8}>
        <CardSkeleton height={300} />
      </Grid>
    </Grid>
  </Box>
);

/**
 * Generic Skeleton - Customizable skeleton
 */
export const GenericSkeleton = ({ variant = 'card', height = 200, items = 1 }) => {
  const skeletonMap = {
    card: <CardSkeleton height={height} />,
    list: <ListSkeleton items={items} />,
    table: <TableSkeleton rows={items} />,
    dashboard: <DashboardSkeleton />,
    profile: <ProfileSkeleton />,
  };

  return skeletonMap[variant] || <CardSkeleton height={height} />;
};

export default GenericSkeleton;
