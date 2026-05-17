// src/pages/LoginPage.js — Evolve / minimal auth

import React, { useState } from 'react';
import { Box, Alert, Tab, Tabs, Stack, IconButton } from '@mui/material';
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import ModernInput from '../components/ModernInput';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';
import { ev } from '../theme/evolveDarkTheme';

const PAGE_X = 'clamp(28px, 6vw, 96px)';

const monoLabel = {
  fontFamily: ev.mono,
  fontSize: 11,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: ev.chalkDim,
};

function TabPanel({ children, value, index }) {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ pt: 4 }}>
      {value === index && children}
    </Box>
  );
}

function LoginPage() {
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', confirmPassword: '', full_name: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleTabChange = (_, v) => { setTab(v); setError(''); setSuccess(''); };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(loginData.email, loginData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');

    if (!registerData.full_name.trim()) { setError('Full name is required'); setLoading(false); return; }
    if (registerData.password !== registerData.confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
    if (registerData.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }

    try {
      await register({
        email: registerData.email,
        password: registerData.password,
        full_name: registerData.full_name,
      });
      setSuccess('Account created. Sign in below.');
      setTab(0);
      setRegisterData({ email: '', password: '', confirmPassword: '', full_name: '' });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true); setError('');
    try {
      await googleLogin();
    } catch (err) {
      setError(err.message || 'Google login failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: ev.ink,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
      }}
    >
      {/* LEFT — editorial pane */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: `1px solid ${ev.rule}`,
          p: PAGE_X,
        }}
      >
        <Box sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 1, ...monoLabel, color: ev.chalkMute }}>
          <Box
            component="span"
            sx={{
              fontFamily: ev.display,
              fontSize: 28,
              color: ev.chalk,
              letterSpacing: '-0.01em',
              textTransform: 'none',
              lineHeight: 1,
            }}
          >
            evolve
          </Box>
          <Box component="span" sx={{ fontFamily: ev.mono, fontSize: 10, color: ev.chalkMute, letterSpacing: '0.24em' }}>n.</Box>
        </Box>

        <Box>
          <Box sx={monoLabel}>Issue 047 · Spring 2026</Box>
          <Box
            component="h1"
            sx={{
              m: 0,
              mt: 4,
              fontFamily: ev.display,
              fontWeight: 400,
              fontSize: 'clamp(64px, 7vw, 120px)',
              lineHeight: 0.88,
              letterSpacing: '-0.025em',
              color: ev.chalk,
              maxWidth: '12ch',
            }}
          >
            Train<Box component="span" sx={{ color: ev.accent }}>.</Box><br />
            <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>refined.</Box>
          </Box>
          <Box sx={{ mt: 5, maxWidth: '42ch', color: ev.chalkDim, fontWeight: 400, fontSize: 15, lineHeight: 1.55 }}>
            An AI training platform built for athletes who want their programming to actually adapt — to their body, their goals, the rep they just left in the rack.
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: `1px solid ${ev.rule}`, pt: 4 }}>
          <Box>
            <Box sx={monoLabel}>AI generated</Box>
            <Box sx={{ fontFamily: ev.display, fontSize: 36, color: ev.chalk, mt: 1.5, letterSpacing: '-0.02em' }}>plans</Box>
          </Box>
          <Box>
            <Box sx={monoLabel}>Real-time</Box>
            <Box sx={{ fontFamily: ev.display, fontSize: 36, color: ev.chalk, mt: 1.5, letterSpacing: '-0.02em' }}>coach</Box>
          </Box>
          <Box>
            <Box sx={monoLabel}>Honest</Box>
            <Box sx={{ fontFamily: ev.display, fontSize: 36, color: ev.chalk, mt: 1.5, letterSpacing: '-0.02em', fontStyle: 'italic' }}>data</Box>
          </Box>
        </Box>
      </Box>

      {/* RIGHT — form pane */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 4, md: PAGE_X },
        }}
      >
        <Box sx={{ maxWidth: 440, width: '100%', mx: 'auto' }}>
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4 }}>
            <Box sx={{ fontFamily: ev.display, fontSize: 32, color: ev.chalk, letterSpacing: '-0.01em' }}>
              evolve<Box component="span" sx={{ color: ev.accent }}>.</Box>
            </Box>
          </Box>

          <Box sx={monoLabel}>
            {tab === 0 ? '01 · Sign in' : '02 · Create account'}
          </Box>
          <Box
            component="h2"
            sx={{
              m: 0,
              mt: 2,
              fontFamily: ev.display,
              fontWeight: 400,
              fontSize: 'clamp(40px, 4.5vw, 64px)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: ev.chalk,
            }}
          >
            {tab === 0 ? <>Welcome <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>back.</Box></> : <>Begin <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>here.</Box></>}
          </Box>

          {success && <Alert severity="success" sx={{ mt: 4 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>}

          <Box sx={{ mt: 5 }}>
            <SecondaryButton fullWidth onClick={handleGoogleLogin} loading={googleLoading} disabled={loading} startIcon={<GoogleIcon />}>
              Continue with Google
            </SecondaryButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4, ...monoLabel, color: ev.chalkMute }}>
            <Box sx={{ flex: 1, height: '1px', backgroundColor: ev.rule }} />
            <Box>or with email</Box>
            <Box sx={{ flex: 1, height: '1px', backgroundColor: ev.rule }} />
          </Box>

          <Tabs
            value={tab}
            onChange={handleTabChange}
            sx={{
              mt: 4,
              borderBottom: `1px solid ${ev.rule}`,
              minHeight: 'auto',
              '& .MuiTabs-indicator': { backgroundColor: ev.accent, height: '1px' },
              '& .MuiTab-root': {
                fontFamily: ev.mono,
                fontSize: 11,
                letterSpacing: '0.18em',
                color: ev.chalkMute,
                minHeight: 'auto',
                py: 2,
                px: 0,
                mr: 4,
                '&.Mui-selected': { color: ev.chalk },
              },
            }}
          >
            <Tab label="Sign in" />
            <Tab label="Sign up" />
          </Tabs>

          <TabPanel value={tab} index={0}>
            <Box component="form" onSubmit={handleLoginSubmit}>
              <Stack spacing={4}>
                <ModernInput
                  label="Email"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@domain.com"
                  required
                />
                <ModernInput
                  label="Password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  endIcon={
                    <IconButton onClick={() => setShowPw(!showPw)} size="small" sx={{ color: ev.chalkMute }}>
                      {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  }
                />
                <PrimaryButton type="submit" fullWidth loading={loading} disabled={googleLoading}>
                  {loading ? 'Signing in…' : 'Sign in ↗'}
                </PrimaryButton>
              </Stack>
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Box component="form" onSubmit={handleRegisterSubmit}>
              <Stack spacing={4}>
                <ModernInput
                  label="Full name"
                  name="full_name"
                  value={registerData.full_name}
                  onChange={(e) => setRegisterData(p => ({ ...p, full_name: e.target.value }))}
                  placeholder="Your full name"
                  required
                />
                <ModernInput
                  label="Email"
                  name="email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@domain.com"
                  required
                />
                <ModernInput
                  label="Password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  value={registerData.password}
                  onChange={(e) => setRegisterData(p => ({ ...p, password: e.target.value }))}
                  placeholder="At least 6 characters"
                  helperText="Minimum 6 characters"
                  required
                  endIcon={
                    <IconButton onClick={() => setShowPw(!showPw)} size="small" sx={{ color: ev.chalkMute }}>
                      {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  }
                />
                <ModernInput
                  label="Confirm password"
                  name="confirmPassword"
                  type={showConfirmPw ? 'text' : 'password'}
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Repeat password"
                  required
                  endIcon={
                    <IconButton onClick={() => setShowConfirmPw(!showConfirmPw)} size="small" sx={{ color: ev.chalkMute }}>
                      {showConfirmPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  }
                />
                <PrimaryButton type="submit" fullWidth loading={loading} disabled={googleLoading}>
                  {loading ? 'Creating account…' : 'Create account ↗'}
                </PrimaryButton>
              </Stack>
            </Box>
          </TabPanel>

          <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${ev.rule}`, ...monoLabel, color: ev.chalkMute, textAlign: 'center' }}>
            By continuing you accept the terms & privacy policy
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
