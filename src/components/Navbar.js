// src/components/Navbar.js - Modern Redesigned Navbar

import React, { useState } from 'react';
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
  Divider
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
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Hide on scroll component
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const modernPages = [
  { name: 'Dashboard', path: '/', icon: <Dashboard /> },
  { name: 'Generate Workout', path: '/generate-workout', icon: <AutoAwesome /> },
  { name: 'Meal Planner', path: '/meal-planner', icon: <Restaurant /> },
  { name: 'Log Workout', path: '/log-workout', icon: <Create /> },
  { name: 'History', path: '/workout-history', icon: <History /> },
];

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

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
      <AppBar 
        position="fixed" 
        sx={{
          background: 'rgba(10, 14, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          border: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 1 }}>
            {/* Desktop Logo */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center',
              mr: 4
            }}>
              <Box sx={{
                p: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #00D4FF, #7C3AED)',
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FitnessCenter sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Typography
                variant="h5"
                noWrap
                sx={{
                  fontFamily: 'Montserrat',
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #00D4FF, #FFFFFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/')}
              >
                EvolveFit
                <Chip 
                  label="AI" 
                  size="small" 
                  sx={{ 
                    ml: 1,
                    background: 'linear-gradient(45deg, #7C3AED, #00D4FF)',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }} 
                />
              </Typography>
            </Box>

            {/* Mobile Menu Icon */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                onClick={handleOpenNavMenu}
                sx={{ color: 'white' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiMenu-paper': {
                    background: 'rgba(26, 31, 46, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    mt: 1
                  }
                }}
              >
                {modernPages.map((page) => (
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
                    <Box sx={{ mr: 2, color: isActivePage(page.path) ? '#00D4FF' : '#94A3B8' }}>
                      {page.icon}
                    </Box>
                    <Typography 
                      textAlign="center"
                      sx={{ 
                        color: isActivePage(page.path) ? '#00D4FF' : 'white',
                        fontWeight: isActivePage(page.path) ? 600 : 400
                      }}
                    >
                      {page.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Mobile Logo */}
            <Box sx={{ 
              display: { xs: 'flex', md: 'none' }, 
              alignItems: 'center',
              flexGrow: 1
            }}>
              <Box sx={{
                p: 1,
                borderRadius: 1.5,
                background: 'linear-gradient(45deg, #00D4FF, #7C3AED)',
                mr: 1.5
              }}>
                <FitnessCenter sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontFamily: 'Montserrat',
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #00D4FF, #FFFFFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                EvolveFitAI
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ 
              flexGrow: 1, 
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              gap: 1
            }}>
              {modernPages.map((page) => (
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
                <IconButton sx={{ color: '#94A3B8' }}>
                  <Badge badgeContent={3} color="error" variant="dot">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* User Avatar Menu */}
              <Tooltip title="Account settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40,
                      background: 'linear-gradient(45deg, #00D4FF, #7C3AED)',
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ 
                  mt: '45px',
                  '& .MuiMenu-paper': {
                    background: 'rgba(26, 31, 46, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    minWidth: 220
                  }
                }}
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {/* User Info Header */}
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>
                    {userName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    {user?.email}
                  </Typography>
                  <Chip 
                    label="Pro User" 
                    size="small" 
                    sx={{ 
                      mt: 1,
                      background: 'linear-gradient(45deg, #7C3AED, #00D4FF)',
                      color: 'white',
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>

                <MenuItem 
                  onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}
                  sx={{ py: 1.5, '&:hover': { background: 'rgba(0, 212, 255, 0.05)' } }}
                >
                  <AccountCircle sx={{ mr: 2, color: '#00D4FF' }} />
                  <Typography>Profile</Typography>
                </MenuItem>

                <MenuItem 
                  onClick={() => { handleCloseUserMenu(); navigate('/settings'); }}
                  sx={{ py: 1.5, '&:hover': { background: 'rgba(0, 212, 255, 0.05)' } }}
                >
                  <Settings sx={{ mr: 2, color: '#94A3B8' }} />
                  <Typography>Settings</Typography>
                </MenuItem>

                <MenuItem 
                  onClick={() => { handleCloseUserMenu(); navigate('/analytics'); }}
                  sx={{ py: 1.5, '&:hover': { background: 'rgba(0, 212, 255, 0.05)' } }}
                >
                  <TrendingUp sx={{ mr: 2, color: '#10B981' }} />
                  <Typography>Analytics</Typography>
                </MenuItem>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                <MenuItem 
                  onClick={handleLogout}
                  sx={{ 
                    py: 1.5, 
                    color: '#EF4444',
                    '&:hover': { background: 'rgba(239, 68, 68, 0.05)' } 
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
