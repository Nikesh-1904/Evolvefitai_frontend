// src/pages/LoginPage.js - Modern AI Fitness Login/Register with Premium Design

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Alert,
  Tab,
  Tabs,
  Divider,
  Stack,
  Chip,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Google as GoogleIcon,
  FitnessCenter,
  Visibility,
  VisibilityOff,
  AutoAwesome,
  TrendingUp,
  LocalFireDepartment,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import our modern components
import ModernCard from '../components/ModernCard';
import ModernInput from '../components/ModernInput';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';

function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function LoginPage() {
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: ''
  });
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(loginData.email, loginData.password);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (!registerData.full_name.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await register({
        email: registerData.email,
        password: registerData.password,
        full_name: registerData.full_name,
      });
      setSuccess('Account created successfully! Please login.');
      setTabValue(0); // Switch to login tab
      setRegisterData({ email: '', password: '', confirmPassword: '', full_name: '' });
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      await googleLogin();
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLoginInputChange = (e) => {
    setLoginData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegisterInputChange = (e) => {
    setRegisterData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F1419 0%, #1A202C 50%, #2D3748 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', minHeight: '80vh' }}>
          {/* Left Side - Branding & Features */}
          <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
            {/* Brand Header */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '1.5rem',
                  }}
                >
                  <FitnessCenter />
                </Box>
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                      fontWeight: 400,
                      fontSize: '2rem',
                      color: '#FFFFFF',
                      lineHeight: 1.2,
                    }}
                  >
                    EvolveAI Fitness
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#CBD5E1', fontWeight: 500 }}>
                    Your AI-Powered Fitness Journey
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                  fontWeight: 400,
                  fontSize: '1.75rem',
                  color: '#FFFFFF',
                  mb: 2,
                  lineHeight: 1.3,
                }}
              >
                Transform Your Body with Intelligent Fitness
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: '#94A3B8',
                  fontSize: '1.125rem',
                  lineHeight: 1.6,
                  maxWidth: '500px',
                }}
              >
                Join thousands of fitness enthusiasts using AI-powered workouts, 
                personalized meal plans, and intelligent progress tracking to achieve their goals faster.
              </Typography>
            </Box>

            {/* Feature Highlights */}
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
                  }}
                >
                  <AutoAwesome />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 0.5 }}>
                    AI-Powered Workouts
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    Personalized workout plans generated by advanced AI models
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                  }}
                >
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 0.5 }}>
                    Smart Progress Tracking
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    Intelligent analytics to track your fitness journey and optimize results
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, #FF3366 0%, #FF6B35 100%)',
                  }}
                >
                  <LocalFireDepartment />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 0.5 }}>
                    Nutrition Planning
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    AI-generated meal plans tailored to your dietary preferences and goals
                  </Typography>
                </Box>
              </Box>
            </Stack>

            {/* Trust Indicators */}
            <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 2, fontWeight: 600 }}>
                Trusted by fitness enthusiasts worldwide
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="🤖 AI-Powered" size="small" sx={{ 
                  background: 'rgba(0, 212, 255, 0.1)', 
                  color: '#00D4FF',
                  fontWeight: 500,
                }} />
                <Chip label="📊 Data-Driven" size="small" sx={{ 
                  background: 'rgba(124, 58, 237, 0.1)', 
                  color: '#7C3AED',
                  fontWeight: 500,
                }} />
                <Chip label="🎯 Results-Focused" size="small" sx={{ 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  color: '#10B981',
                  fontWeight: 500,
                }} />
              </Box>
            </Box>
          </Box>

          {/* Right Side - Auth Form */}
          <Box sx={{ flex: { xs: 1, md: 0.6 }, maxWidth: '480px', mx: 'auto' }}>
            <ModernCard
              variant="glass"
              elevation="high"
              sx={{ 
                p: { xs: 3, sm: 4 },
                background: 'rgba(37, 42, 61, 0.8)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Auth Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                    fontWeight: 400,
                    fontSize: '1.75rem',
                    color: '#FFFFFF',
                    mb: 1,
                  }}
                >
                  {tabValue === 0 ? 'Welcome Back' : 'Join EvolveAI'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#CBD5E1' }}>
                  {tabValue === 0 
                    ? 'Sign in to continue your fitness journey' 
                    : 'Start your AI-powered transformation today'
                  }
                </Typography>
              </Box>

              {/* Success/Error Messages */}
              {success && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 3,
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    '& .MuiAlert-message': { color: '#FFFFFF' },
                  }}
                >
                  {success}
                </Alert>
              )}
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    '& .MuiAlert-message': { color: '#FFFFFF' },
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Google Login */}
              <SecondaryButton
                fullWidth
                onClick={handleGoogleLogin}
                loading={googleLoading}
                disabled={loading}
                startIcon={<GoogleIcon />}
                sx={{ mb: 3, py: 1.5 }}
              >
                Continue with Google
              </SecondaryButton>

              <Divider sx={{ 
                mb: 3,
                '&::before, &::after': { borderColor: 'rgba(255, 255, 255, 0.12)' },
                '& .MuiDivider-wrapper': { color: '#94A3B8' }
              }}>
                or
              </Divider>

              {/* Auth Tabs */}
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  mb: 3,
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                    height: 3,
                    borderRadius: '3px',
                  },
                  '& .MuiTab-root': {
                    color: '#94A3B8',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&.Mui-selected': {
                      color: '#FFFFFF',
                    },
                  },
                }}
              >
                <Tab label="Sign In" />
                <Tab label="Sign Up" />
              </Tabs>

              {/* Login Form */}
              <TabPanel value={tabValue} index={0}>
                <form onSubmit={handleLoginSubmit}>
                  <Stack spacing={3}>
                    <ModernInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginInputChange}
                      placeholder="Enter your email"
                      required
                      variant="outlined"
                    />

                    <ModernInput
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={handleLoginInputChange}
                      placeholder="Enter your password"
                      required
                      variant="outlined"
                      endIcon={
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{ color: '#94A3B8' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      }
                    />

                    <PrimaryButton
                      type="submit"
                      fullWidth
                      loading={loading}
                      disabled={googleLoading}
                      sx={{ py: 1.5, mt: 2 }}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </PrimaryButton>
                  </Stack>
                </form>
              </TabPanel>

              {/* Register Form */}
              <TabPanel value={tabValue} index={1}>
                <form onSubmit={handleRegisterSubmit}>
                  <Stack spacing={3}>
                    <ModernInput
                      label="Full Name"
                      name="full_name"
                      type="text"
                      value={registerData.full_name}
                      onChange={handleRegisterInputChange}
                      placeholder="Enter your full name"
                      required
                      variant="outlined"
                    />

                    <ModernInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={registerData.email}
                      onChange={handleRegisterInputChange}
                      placeholder="Enter your email"
                      required
                      variant="outlined"
                    />

                    <ModernInput
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={handleRegisterInputChange}
                      placeholder="Create a password (min. 6 characters)"
                      required
                      variant="outlined"
                      helperText="Password must be at least 6 characters long"
                      endIcon={
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{ color: '#94A3B8' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      }
                    />

                    <ModernInput
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerData.confirmPassword}
                      onChange={handleRegisterInputChange}
                      placeholder="Confirm your password"
                      required
                      variant="outlined"
                      endIcon={
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          sx={{ color: '#94A3B8' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      }
                    />

                    <PrimaryButton
                      type="submit"
                      fullWidth
                      loading={loading}
                      disabled={googleLoading}
                      sx={{ py: 1.5, mt: 2 }}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </PrimaryButton>
                  </Stack>
                </form>
              </TabPanel>

              {/* Footer */}
              <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </Typography>
              </Box>
            </ModernCard>

            {/* Mobile Brand */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mt: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  mb: 1,
                }}
              >
                EvolveAI Fitness
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                Your AI-Powered Fitness Journey
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;