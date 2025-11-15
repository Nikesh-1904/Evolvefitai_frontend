// src/components/Navbar.js - Modern Redesigned Navbar with Gravitas One Brand Text

import React, { useState, useMemo, useEffect } from 'react';
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
  Tooltip,
  MenuItem,
  useScrollTrigger,
  Slide,
  Badge,
  Chip,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  FitnessCenter,
  Menu as MenuIcon,
  AccountCircle,
  Notifications,
  Dashboard,
  Create,
  Restaurant,
  History,
  TrendingUp,
  Settings,
  Logout,
  AutoAwesome,
  EmojiEvents as LeaderboardIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/api/authService';

// Hide on scroll component
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const basePages = [
  { name: 'Dashboard', path: '/', icon: <Dashboard /> },
  { name: 'Generate Workout', path: '/generate-workout', icon: <AutoAwesome /> },
  { name: 'Meal Planner', path: '/meal-plan-generator', icon: <Restaurant /> },
  { name: 'Log Workout', path: '/log-workout', icon: <Create /> },
  { name: 'History', path: '/workout-history', icon: <History /> },
  // Leaderboard is now conditional
];

const communityPages = [
    { name: 'Leaderboard', path: '/leaderboard', icon: <LeaderboardIcon /> },
];

function Navbar() {
  const { user, logout, stats } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const visiblePages = useMemo(() => {
    let pages = [...basePages];
    // If the user has joined a gym, add the community pages
    if (user?.gym_id) {
      pages = pages.concat(communityPages);
    }
    return pages;
  }, [user]);

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
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
      // Poll for new notifications every 60 seconds
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
    navigate('/login');
  };

  const isActivePage = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const userName = user?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <HideOnScroll>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Desktop Logo with Gravitas One */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                cursor: 'pointer',
                mr: 4
              }}
              onClick={() => navigate('/')}
            >
              <FitnessCenter sx={{ mr: 1, fontSize: 32, color: '#00D4FF' }} />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Gravitas One", "Montserrat", sans-serif', // Gravitas One for brand
                  fontWeight: 400,
                  fontSize: '1.5rem',
                  letterSpacing: '-0.01em',
                  background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textDecoration: 'none',
                }}
              >
                EvolveFit
              </Typography>
            </Box>

            {/* Mobile Menu Icon */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiPaper-root': {
                    background: 'rgba(26, 31, 46, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                {visiblePages.map((page) => (
                  <MenuItem
                    key={page.name}
                    onClick={() => handleNavigate(page.path)}
                    sx={{
                      py: 1.5,
                      background: isActivePage(page.path) ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                      borderLeft: isActivePage(page.path) ? '3px solid #00D4FF' : 'none',
                      '&:hover': {
                        background: 'rgba(0, 212, 255, 0.05)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {page.icon}
                      <Typography>{page.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Mobile Logo with Gravitas One */}
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                alignItems: 'center',
                flexGrow: 1,
                justifyContent: 'center'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Gravitas One", "Montserrat", sans-serif', // Gravitas One for brand
                  fontWeight: 400,
                  fontSize: '1.3rem',
                  letterSpacing: '-0.01em',
                  background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textDecoration: 'none',
                }}
              >
                EvolveFitAI
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {visiblePages.map((page) => (
                <Button
                  key={page.name}
                  onClick={() => handleNavigate(page.path)}
                  startIcon={page.icon}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: isActivePage(page.path) ? 700 : 500,
                    color: isActivePage(page.path) ? '#00D4FF' : 'white',
                    background: isActivePage(page.path) ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                    border: isActivePage(page.path) ? '1px solid rgba(0, 212, 255, 0.3)' : '1px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(0, 212, 255, 0.1)',
                      color: '#00D4FF',
                      borderColor: 'rgba(0, 212, 255, 0.3)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* User Menu */}
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton onClick={() => navigate('/notifications')} sx={{ color: 'white' }}>
                  <Badge badgeContent={unreadCount} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* User Avatar Menu */}
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ 
                    background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
                    fontWeight: 600
                  }}>
                    {userName.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ 
                  mt: '45px',
                  '& .MuiPaper-root': {
                    background: 'rgba(26, 31, 46, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    minWidth: 280,
                  }
                }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {/* User Info Header */}
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Typography variant="h6" sx={{ 
                    fontFamily: '"Gravitas One", "Montserrat", sans-serif', // Gravitas One for user name
                    fontWeight: 400,
                    fontSize: '1.1rem'
                  }}>
                    {userName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                  
                  {/* Level Progress */}
                  {stats && stats.level_progress && (
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Chip
                          label={`Level ${stats.level_progress.current_level}`}
                          size="small"
                          sx={{
                            background: 'linear-gradient(45deg, #00D4FF 0%, #7C3AED 100%)',
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Next Level
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(stats.level_progress.current_points / stats.level_progress.points_for_next_level) * 100}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {stats.level_progress.current_points.toLocaleString()} / {stats.level_progress.points_for_next_level.toLocaleString()} Points
                      </Typography>
                    </Box>
                  )}
                </Box>

                <MenuItem
                  onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}
                  sx={{ py: 1.5, '&:hover': { background: 'rgba(0, 212, 255, 0.05)' } }}
                >
                  <AccountCircle sx={{ mr: 2 }} />
                  <Typography>Profile</Typography>
                </MenuItem>

                <MenuItem
                  onClick={() => { handleCloseUserMenu(); navigate('/settings'); }}
                  sx={{ py: 1.5, '&:hover': { background: 'rgba(0, 212, 255, 0.05)' } }}
                >
                  <Settings sx={{ mr: 2 }} />
                  <Typography>Settings</Typography>
                </MenuItem>

                <MenuItem
                  onClick={() => { handleCloseUserMenu(); navigate('/analytics'); }}
                  sx={{ py: 1.5, '&:hover': { background: 'rgba(0, 212, 255, 0.05)' } }}
                >
                  <TrendingUp sx={{ mr: 2 }} />
                  <Typography>Analytics</Typography>
                </MenuItem>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                <MenuItem
                  onClick={handleLogout}
                  sx={{ 
                    py: 1.5, 
                    color: '#EF4444',
                    '&:hover': { 
                      background: 'rgba(239, 68, 68, 0.1)' 
                    } 
                  }}
                >
                  <Logout sx={{ mr: 2 }} />
                  <Typography>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
}

export default Navbar;