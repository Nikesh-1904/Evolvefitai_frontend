// src/components/Breadcrumbs.js - Premium Breadcrumb Navigation

import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Typography, Box, Link } from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// Route name mapping
const routeNames = {
  '/': 'Dashboard',
  '/generate-workout': 'Generate Workout',
  '/workout-recommendations': 'AI Recommendations',
  '/exercises': 'Exercise Library',
  '/log-workout': 'Log Workout',
  '/workout-history': 'Workout History',
  '/meal-plan-generator': 'Meal Planner',
  '/meal-plans': 'My Meal Plans',
  '/gyms': 'Discover Gyms',
  '/gym-bookings': 'My Bookings',
  '/leaderboard': 'Leaderboard',
  '/profile': 'Profile',
  '/analytics': 'Analytics',
  '/achievements': 'Achievements',
  '/settings': 'Settings',
  '/notifications': 'Notifications',
};

function Breadcrumbs() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on dashboard
  if (location.pathname === '/') {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <MuiBreadcrumbs
        separator={<NavigateNext fontSize="small" sx={{ color: '#94A3B8' }} />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 1,
          },
        }}
      >
        {/* Home link */}
        <Link
          component="button"
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: '#94A3B8',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            '&:hover': {
              color: '#00D4FF',
            },
            transition: 'color 0.2s',
          }}
        >
          <Home sx={{ fontSize: 18 }} />
          Home
        </Link>

        {/* Current page(s) */}
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const name = routeNames[to] || value.charAt(0).toUpperCase() + value.slice(1);

          return last ? (
            <Typography
              key={to}
              sx={{
                color: '#00D4FF',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {name}
            </Typography>
          ) : (
            <Link
              key={to}
              component="button"
              onClick={() => navigate(to)}
              sx={{
                color: '#94A3B8',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
                '&:hover': {
                  color: '#00D4FF',
                },
                transition: 'color 0.2s',
              }}
            >
              {name}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
}

export default Breadcrumbs;