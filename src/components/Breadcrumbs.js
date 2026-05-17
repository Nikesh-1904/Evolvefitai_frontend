// src/components/Breadcrumbs.js — mono crumbs, hairline rule

import React from 'react';
import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ev } from '../theme/evolveDarkTheme';

const routeNames = {
  '/': 'Today',
  '/generate-workout': 'Generate workout',
  '/workout-recommendations': 'AI recommendations',
  '/exercises': 'Exercise library',
  '/log-workout': 'Log workout',
  '/workout-history': 'Workout history',
  '/profile': 'Profile',
  '/analytics': 'Analytics',
  '/achievements': 'Achievements',
  '/settings': 'Settings',
  '/notifications': 'Notifications',
};

const baseCrumb = {
  fontFamily: ev.mono,
  fontSize: 11,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  transition: 'color .2s ease',
};

function Breadcrumbs() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (location.pathname === '/') return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        color: ev.chalkMute,
        py: 1,
      }}
    >
      <Box
        component="button"
        onClick={() => navigate('/')}
        sx={{ ...baseCrumb, color: ev.chalkMute, '&:hover': { color: ev.chalk } }}
      >
        Today
      </Box>

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const name = routeNames[to] || value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <React.Fragment key={to}>
            <Box component="span" sx={{ color: ev.chalkMute, fontFamily: ev.mono, fontSize: 11 }}>/</Box>
            {last ? (
              <Box component="span" sx={{ ...baseCrumb, cursor: 'default', color: ev.chalk }}>
                {name}
              </Box>
            ) : (
              <Box
                component="button"
                onClick={() => navigate(to)}
                sx={{ ...baseCrumb, color: ev.chalkMute, '&:hover': { color: ev.chalk } }}
              >
                {name}
              </Box>
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
}

export default Breadcrumbs;
