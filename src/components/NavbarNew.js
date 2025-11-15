// src/components/NavbarNew.js - Clean, Organized Navbar with Dropdowns

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  MenuItem,
  useScrollTrigger,
  Slide,
  Badge,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  FitnessCenter,
  Menu as MenuIcon,
  Dashboard,
  Restaurant,
  People,
  Person,
  Notifications as NotificationsIcon,
  AutoAwesome,
  Lightbulb,
  LibraryBooks,
  Create,
  Business,
  CalendarMonth,
  EmojiEvents,
  ExpandMore,
  Settings,
  Logout,
  Analytics as AnalyticsIcon,
  EmojiEventsOutlined,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/api/authService';

// Hide on scroll
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// Navigation structure with dropdowns
const navigationConfig = {
  main: [
    { name: 'Dashboard', path: '/', icon: <Dashboard /> },
  ],
  dropdowns: [
    {
      label: 'Workouts',
      icon: <FitnessCenter />,
      items: [
        { name: 'Generate Workout', path: '/generate-workout', icon: <AutoAwesome /> },
        { name: 'AI Recommendations', path: '/workout-recommendations', icon: <Lightbulb /> },
        { name: 'Exercise Library', path: '/exercises', icon: <LibraryBooks /> },
        { name: 'Log Workout', path: '/log-workout', icon: <Create /> },
      ],
    },
    {
      label: 'Nutrition',
      icon: <Restaurant />,
      items: [
        { name: 'Meal Planner', path: '/meal-plan-generator', icon: <Restaurant /> },
        { name: 'My Meal Plans', path: '/meal-plans', icon: <LibraryBooks /> },
      ],
    },
  ],
  conditional: {
    community: {
      label: 'Community',
      icon: <People />,
      requiresGym: true,
      items: [
        { name: 'Discover Gyms', path: '/gyms', icon: <Business /> },
        { name: 'My Bookings', path: '/gym-bookings', icon: <CalendarMonth /> },
        { name: 'Leaderboard', path: '/leaderboard', icon: <EmojiEvents /> },
      ],
    },
  },
};

function NavbarNew() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Menu states
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [workoutsMenuAnchor, setWorkoutsMenuAnchor] = useState(null);
  const [nutritionMenuAnchor, setNutritionMenuAnchor] = useState(null);
  const [communityMenuAnchor, setCommunityMenuAnchor] = useState(null);

  // Notifications
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return;
      try {
        const data = await authService.getNotifications();
        const count = data.notifications?.filter((n) => !n.is_read).length || 0;
        setUnreadCount(count);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleOpenMenu = (setter) => (event) => {
    setter(event.currentTarget);
  };

  const handleCloseMenu = (setter) => () => {
    setter(null);
  };

  const handleNavigate = (path, closeFn) => () => {
    navigate(path);
    closeFn();
  };

  const handleLogout = async () => {
    setUserMenuAnchor(null);
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(10, 14, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo */}
            <FitnessCenter sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#00D4FF' }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              onClick={() => navigate('/')}
              sx={{
                mr: 4,
                display: { xs: 'none', md: 'flex' },
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              EvolveFit AI
            </Typography>

            {/* Mobile Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                onClick={handleOpenMenu(setMobileMenuAnchor)}
                sx={{ color: '#FFFFFF' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleCloseMenu(setMobileMenuAnchor)}
                PaperProps={{
                  sx: {
                    background: 'rgba(26, 31, 46, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    mt: 1,
                  },
                }}
              >
                <MenuItem onClick={handleNavigate('/', handleCloseMenu(setMobileMenuAnchor))}>
                  <ListItemIcon><Dashboard sx={{ color: '#00D4FF' }} /></ListItemIcon>
                  <ListItemText>Dashboard</ListItemText>
                </MenuItem>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* Workouts Section */}
                <MenuItem disabled sx={{ opacity: 0.5, py: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                    WORKOUTS
                  </Typography>
                </MenuItem>
                {navigationConfig.dropdowns[0].items.map((item) => (
                  <MenuItem key={item.path} onClick={handleNavigate(item.path, handleCloseMenu(setMobileMenuAnchor))}>
                    <ListItemIcon>{React.cloneElement(item.icon, { sx: { color: '#00D4FF' } })}</ListItemIcon>
                    <ListItemText>{item.name}</ListItemText>
                  </MenuItem>
                ))}

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />

                {/* Nutrition Section */}
                <MenuItem disabled sx={{ opacity: 0.5, py: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                    NUTRITION
                  </Typography>
                </MenuItem>
                {navigationConfig.dropdowns[1].items.map((item) => (
                  <MenuItem key={item.path} onClick={handleNavigate(item.path, handleCloseMenu(setMobileMenuAnchor))}>
                    <ListItemIcon>{React.cloneElement(item.icon, { sx: { color: '#00D4FF' } })}</ListItemIcon>
                    <ListItemText>{item.name}</ListItemText>
                  </MenuItem>
                ))}

                {/* Community Section (if user has gym) */}
                {user.gym_id && (
                  <>
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
                    <MenuItem disabled sx={{ opacity: 0.5, py: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                        COMMUNITY
                      </Typography>
                    </MenuItem>
                    {navigationConfig.conditional.community.items.map((item) => (
                      <MenuItem key={item.path} onClick={handleNavigate(item.path, handleCloseMenu(setMobileMenuAnchor))}>
                        <ListItemIcon>{React.cloneElement(item.icon, { sx: { color: '#00D4FF' } })}</ListItemIcon>
                        <ListItemText>{item.name}</ListItemText>
                      </MenuItem>
                    ))}
                  </>
                )}
              </Menu>
            </Box>

            {/* Mobile Logo */}
            <FitnessCenter sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: '#00D4FF' }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              onClick={() => navigate('/')}
              sx={{
                flexGrow: 1,
                display: { xs: 'flex', md: 'none' },
                fontFamily: 'Gravitas One',
                fontSize: '1.25rem',
                background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              EvolveFit
            </Typography>

            {/* Desktop Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {/* Dashboard */}
              <Button
                onClick={() => navigate('/')}
                sx={{
                  color: isActive('/') ? '#00D4FF' : '#FFFFFF',
                  fontWeight: isActive('/') ? 600 : 400,
                  textTransform: 'none',
                  px: 2,
                  '&:hover': {
                    background: 'rgba(0, 212, 255, 0.1)',
                  },
                }}
              >
                <Dashboard sx={{ mr: 1, fontSize: 20 }} />
                Dashboard
              </Button>

              {/* Workouts Dropdown */}
              <Button
                onClick={handleOpenMenu(setWorkoutsMenuAnchor)}
                endIcon={<ExpandMore />}
                sx={{
                  color: '#FFFFFF',
                  textTransform: 'none',
                  px: 2,
                  '&:hover': {
                    background: 'rgba(0, 212, 255, 0.1)',
                  },
                }}
              >
                <FitnessCenter sx={{ mr: 1, fontSize: 20 }} />
                Workouts
              </Button>
              <Menu
                anchorEl={workoutsMenuAnchor}
                open={Boolean(workoutsMenuAnchor)}
                onClose={handleCloseMenu(setWorkoutsMenuAnchor)}
                PaperProps={{
                  sx: {
                    background: 'rgba(26, 31, 46, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    mt: 1,
                    minWidth: 220,
                  },
                }}
              >
                {navigationConfig.dropdowns[0].items.map((item) => (
                  <MenuItem
                    key={item.path}
                    onClick={handleNavigate(item.path, handleCloseMenu(setWorkoutsMenuAnchor))}
                    sx={{
                      color: isActive(item.path) ? '#00D4FF' : '#FFFFFF',
                      '&:hover': {
                        background: 'rgba(0, 212, 255, 0.1)',
                      },
                    }}
                  >
                    <ListItemIcon>{React.cloneElement(item.icon, { sx: { color: isActive(item.path) ? '#00D4FF' : '#CBD5E1' } })}</ListItemIcon>
                    <ListItemText>{item.name}</ListItemText>
                  </MenuItem>
                ))}
              </Menu>

              {/* Nutrition Dropdown */}
              <Button
                onClick={handleOpenMenu(setNutritionMenuAnchor)}
                endIcon={<ExpandMore />}
                sx={{
                  color: '#FFFFFF',
                  textTransform: 'none',
                  px: 2,
                  '&:hover': {
                    background: 'rgba(0, 212, 255, 0.1)',
                  },
                }}
              >
                <Restaurant sx={{ mr: 1, fontSize: 20 }} />
                Nutrition
              </Button>
              <Menu
                anchorEl={nutritionMenuAnchor}
                open={Boolean(nutritionMenuAnchor)}
                onClose={handleCloseMenu(setNutritionMenuAnchor)}
                PaperProps={{
                  sx: {
                    background: 'rgba(26, 31, 46, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    mt: 1,
                    minWidth: 220,
                  },
                }}
              >
                {navigationConfig.dropdowns[1].items.map((item) => (
                  <MenuItem
                    key={item.path}
                    onClick={handleNavigate(item.path, handleCloseMenu(setNutritionMenuAnchor))}
                    sx={{
                      color: isActive(item.path) ? '#00D4FF' : '#FFFFFF',
                      '&:hover': {
                        background: 'rgba(0, 212, 255, 0.1)',
                      },
                    }}
                  >
                    <ListItemIcon>{React.cloneElement(item.icon, { sx: { color: isActive(item.path) ? '#00D4FF' : '#CBD5E1' } })}</ListItemIcon>
                    <ListItemText>{item.name}</ListItemText>
                  </MenuItem>
                ))}
              </Menu>

              {/* Community Dropdown (conditional) */}
              {user.gym_id && (
                <>
                  <Button
                    onClick={handleOpenMenu(setCommunityMenuAnchor)}
                    endIcon={<ExpandMore />}
                    sx={{
                      color: '#FFFFFF',
                      textTransform: 'none',
                      px: 2,
                      '&:hover': {
                        background: 'rgba(0, 212, 255, 0.1)',
                      },
                    }}
                  >
                    <People sx={{ mr: 1, fontSize: 20 }} />
                    Community
                  </Button>
                  <Menu
                    anchorEl={communityMenuAnchor}
                    open={Boolean(communityMenuAnchor)}
                    onClose={handleCloseMenu(setCommunityMenuAnchor)}
                    PaperProps={{
                      sx: {
                        background: 'rgba(26, 31, 46, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        mt: 1,
                        minWidth: 220,
                      },
                    }}
                  >
                    {navigationConfig.conditional.community.items.map((item) => (
                      <MenuItem
                        key={item.path}
                        onClick={handleNavigate(item.path, handleCloseMenu(setCommunityMenuAnchor))}
                        sx={{
                          color: isActive(item.path) ? '#00D4FF' : '#FFFFFF',
                          '&:hover': {
                            background: 'rgba(0, 212, 255, 0.1)',
                          },
                        }}
                      >
                        <ListItemIcon>{React.cloneElement(item.icon, { sx: { color: isActive(item.path) ? '#00D4FF' : '#CBD5E1' } })}</ListItemIcon>
                        <ListItemText>{item.name}</ListItemText>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </Box>

            {/* Right Side Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Notifications */}
              <IconButton
                onClick={() => navigate('/notifications')}
                sx={{
                  color: '#FFFFFF',
                  '&:hover': {
                    background: 'rgba(0, 212, 255, 0.1)',
                  },
                }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* User Menu */}
              <IconButton onClick={handleOpenMenu(setUserMenuAnchor)} sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleCloseMenu(setUserMenuAnchor)}
                PaperProps={{
                  sx: {
                    background: 'rgba(26, 31, 46, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    mt: 1,
                    minWidth: 220,
                  },
                }}
              >
                <MenuItem onClick={handleNavigate('/profile', handleCloseMenu(setUserMenuAnchor))}>
                  <ListItemIcon><Person sx={{ color: '#00D4FF' }} /></ListItemIcon>
                  <ListItemText>Profile & History</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleNavigate('/analytics', handleCloseMenu(setUserMenuAnchor))}>
                  <ListItemIcon><AnalyticsIcon sx={{ color: '#00D4FF' }} /></ListItemIcon>
                  <ListItemText>Analytics</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleNavigate('/achievements', handleCloseMenu(setUserMenuAnchor))}>
                  <ListItemIcon><EmojiEventsOutlined sx={{ color: '#00D4FF' }} /></ListItemIcon>
                  <ListItemText>Achievements</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleNavigate('/settings', handleCloseMenu(setUserMenuAnchor))}>
                  <ListItemIcon><Settings sx={{ color: '#00D4FF' }} /></ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><Logout sx={{ color: '#EF4444' }} /></ListItemIcon>
                  <ListItemText sx={{ color: '#EF4444' }}>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
}

export default NavbarNew;