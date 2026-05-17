// src/components/NavbarNew.js — thin hairline top bar, evolve/ system

import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person,
  Notifications as NotificationsIcon,
  Settings,
  Logout,
  Analytics as AnalyticsIcon,
  EmojiEventsOutlined,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationPanel from './NotificationPanel';
import { ev } from '../theme/evolveDarkTheme';

const navItems = [
  { name: 'Today',    path: '/' },
  { name: 'Train',    path: '/generate-workout' },
  { name: 'Library',  path: '/exercises' },
  { name: 'Log',      path: '/log-workout' },
  { name: 'Stats',    path: '/analytics' },
];

const workoutMenu = [
  { name: 'Generate workout',    path: '/generate-workout' },
  { name: 'AI recommendations',  path: '/workout-recommendations' },
  { name: 'Exercise library',    path: '/exercises' },
  { name: 'Freestyle log',       path: '/log-workout' },
  { name: 'Workout history',     path: '/workout-history' },
];

function NavbarNew() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const [mobileAnchor, setMobileAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);

  const isActive = (path) => location.pathname === path;
  const close = (setter) => () => setter(null);
  const open  = (setter) => (e) => setter(e.currentTarget);
  const go    = (path, closer) => () => { closer(); navigate(path); };

  const handleLogout = async () => {
    setUserAnchor(null);
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  const initials =
    (user.full_name?.[0] || user.username?.[0] || user.email?.[0] || 'U').toUpperCase();
  const lastName =
    user.full_name ? user.full_name.split(' ').slice(-1)[0] : (user.username || user.email || '');

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: ev.ink,
        backgroundImage: 'none',
        color: ev.chalk,
        borderBottom: `1px solid ${ev.rule}`,
        boxShadow: 'none',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: 64,
          px: { xs: 3, md: 'clamp(28px, 6vw, 96px)' },
          display: 'grid',
          gridTemplateColumns: { xs: 'auto 1fr auto', md: '1fr auto 1fr' },
          alignItems: 'center',
          gap: 2,
        }}
      >
        {/* LEFT — brand */}
        <Box
          onClick={() => navigate('/')}
          sx={{
            cursor: 'pointer',
            fontFamily: ev.display,
            fontSize: 20,
            letterSpacing: '-0.01em',
            color: ev.chalk,
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 1,
          }}
        >
          evolve
          <Box
            component="span"
            sx={{
              fontFamily: ev.mono,
              fontSize: 9,
              letterSpacing: '0.22em',
              color: ev.chalkMute,
              textTransform: 'uppercase',
              verticalAlign: 'super',
            }}
          >
            n.
          </Box>
        </Box>

        {/* CENTER — nav (desktop) */}
        <Box
          component="nav"
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 4,
            justifySelf: 'center',
          }}
        >
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Box
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  fontFamily: ev.mono,
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: active ? ev.chalk : ev.chalkMute,
                  transition: 'color .2s ease',
                  '&:hover': { color: ev.chalk },
                  '&::before': active
                    ? {
                        content: '"·"',
                        position: 'absolute',
                        left: -12,
                        color: ev.accent,
                      }
                    : {},
                }}
              >
                {item.name}
              </Box>
            );
          })}
        </Box>

        {/* MOBILE — hamburger */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton size="small" onClick={open(setMobileAnchor)}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={mobileAnchor}
            open={Boolean(mobileAnchor)}
            onClose={close(setMobileAnchor)}
            PaperProps={{
              sx: {
                backgroundColor: ev.ink,
                border: `1px solid ${ev.rule}`,
                borderRadius: 0,
                mt: 1,
                minWidth: 220,
              },
            }}
          >
            {navItems.map((item) => (
              <MenuItem key={item.path} onClick={go(item.path, close(setMobileAnchor))}>
                <ListItemText
                  primaryTypographyProps={{
                    fontFamily: ev.mono,
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: isActive(item.path) ? ev.chalk : ev.chalkDim,
                  }}
                >
                  {item.name}
                </ListItemText>
              </MenuItem>
            ))}
            <Divider sx={{ borderColor: ev.rule, my: 1 }} />
            {workoutMenu.map((item) => (
              <MenuItem key={item.path} onClick={go(item.path, close(setMobileAnchor))}>
                <ListItemText
                  primaryTypographyProps={{ fontFamily: ev.body, fontSize: 13, color: ev.chalkDim }}
                >
                  {item.name}
                </ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* RIGHT — meta + actions */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2.5,
            justifySelf: 'end',
            fontFamily: ev.mono,
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: ev.chalkDim,
          }}
        >
          <Box sx={{ display: { xs: 'none', md: 'inline' } }}>
            {new Date().toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
          </Box>

          <IconButton size="small" onClick={open(setNotifAnchor)} aria-label="notifications">
            <Badge
              badgeContent={unreadCount}
              color="secondary"
              overlap="circular"
              sx={{ '& .MuiBadge-badge': { backgroundColor: ev.accent, color: ev.ink, fontFamily: ev.mono, fontSize: 9 } }}
            >
              <NotificationsIcon sx={{ fontSize: 18 }} />
            </Badge>
          </IconButton>
          <NotificationPanel
            anchorEl={notifAnchor}
            open={Boolean(notifAnchor)}
            onClose={close(setNotifAnchor)}
            notifications={notifications}
            loading={loading}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
          />

          <Box
            onClick={open(setUserAnchor)}
            sx={{
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              color: ev.chalk,
              transition: 'color .2s ease',
              '&:hover': { color: ev.accent },
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                border: `1px solid ${ev.rule}`,
                display: 'grid',
                placeItems: 'center',
                fontFamily: ev.display,
                fontSize: 13,
                color: ev.chalk,
                lineHeight: 1,
              }}
            >
              {initials}
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'inline' } }}>
              {lastName}
            </Box>
          </Box>

          <Menu
            anchorEl={userAnchor}
            open={Boolean(userAnchor)}
            onClose={close(setUserAnchor)}
            PaperProps={{
              sx: {
                backgroundColor: ev.ink,
                border: `1px solid ${ev.rule}`,
                borderRadius: 0,
                mt: 1.5,
                minWidth: 220,
              },
            }}
          >
            <MenuItem onClick={go('/profile', close(setUserAnchor))}>
              <ListItemIcon><Person sx={{ color: ev.chalkDim, fontSize: 18 }} /></ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontFamily: ev.mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: ev.chalk }}>
                Profile
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={go('/analytics', close(setUserAnchor))}>
              <ListItemIcon><AnalyticsIcon sx={{ color: ev.chalkDim, fontSize: 18 }} /></ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontFamily: ev.mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: ev.chalk }}>
                Analytics
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={go('/achievements', close(setUserAnchor))}>
              <ListItemIcon><EmojiEventsOutlined sx={{ color: ev.chalkDim, fontSize: 18 }} /></ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontFamily: ev.mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: ev.chalk }}>
                Achievements
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={go('/settings', close(setUserAnchor))}>
              <ListItemIcon><Settings sx={{ color: ev.chalkDim, fontSize: 18 }} /></ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontFamily: ev.mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: ev.chalk }}>
                Settings
              </ListItemText>
            </MenuItem>
            <Divider sx={{ borderColor: ev.rule, my: 1 }} />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><Logout sx={{ color: ev.warn, fontSize: 18 }} /></ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontFamily: ev.mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: ev.warn }}>
                Log out
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavbarNew;
