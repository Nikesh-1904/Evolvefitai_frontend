// src/pages/Profile.js — Evolve / minimal profile

import React, { useState, useEffect } from 'react';
import { Box, Stack, CircularProgress, Alert } from '@mui/material';
import { Save, Refresh } from '@mui/icons-material';

import { useAuth } from '../contexts/AuthContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { PageContainer } from '../components/design-system';
import { communityService } from '../services/api';
import authService from '../services/api/authService';
import workoutService from '../services/api/workoutService';

import ModernInput, { ModernSelect } from '../components/ModernInput';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';
import { ev } from '../theme/evolveDarkTheme';

const mono = { fontFamily: ev.mono };
const display = { fontFamily: ev.display };
const monoLabel = { ...mono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: ev.chalkDim };

const Section = ({ idx, title, italic, children }) => (
  <Box sx={{ py: 6, borderTop: `1px solid ${ev.rule}` }}>
    <Box sx={{ display: { xs: 'block', md: 'grid' }, gridTemplateColumns: '180px 1fr', gap: 6, alignItems: 'start' }}>
      <Box>
        <Box sx={monoLabel}>{String(idx).padStart(2, '0')}</Box>
        <Box sx={{ ...display, fontSize: 'clamp(24px, 2.4vw, 32px)', letterSpacing: '-0.015em', color: ev.chalk, mt: 1.5, lineHeight: 1.1 }}>
          {title}
          {italic && <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}> {italic}</Box>}
        </Box>
      </Box>
      <Box sx={{ mt: { xs: 4, md: 0 } }}>{children}</Box>
    </Box>
  </Box>
);

function Profile() {
  const { user, updateProfile, fetchUserStats } = useAuth();
  const { preferences } = usePreferences();

  const [formData, setFormData] = useState({
    full_name: '', username: '', age: '', weight: '', height: '', gender: '',
    fitness_goal: '', experience_level: '', activity_level: '', dietary_restrictions: [],
  });
  const [gymCodeInput, setGymCodeInput] = useState('');
  const [gymCodeLoading, setGymCodeLoading] = useState(false);
  const [gymCodeMessage, setGymCodeMessage] = useState('');
  const [gymCodeError, setGymCodeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const [qrCodeData, setQrCodeData] = useState(null);
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [membershipInfo, setMembershipInfo] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(false);

  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        username: user.username || '',
        age: user.age || '',
        weight: user.weight || '',
        height: user.height || '',
        gender: user.gender || '',
        fitness_goal: user.fitness_goal || '',
        experience_level: user.experience_level || '',
        activity_level: user.activity_level || '',
        dietary_restrictions: user.dietary_restrictions || [],
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.gym_id) {
      const fetchQRCode = async () => {
        setQrCodeLoading(true);
        try {
          const data = await authService.getUserQRCode();
          setQrCodeData(data);
        } catch (err) {
          console.error(err);
          setQrCodeData(null);
        } finally {
          setQrCodeLoading(false);
        }
      };
      const fetchMembershipInfo = async () => {
        setMembershipLoading(true);
        try {
          const data = await authService.getMembershipInfo();
          setMembershipInfo(data);
        } catch (err) {
          console.error(err);
          setMembershipInfo(null);
        } finally {
          setMembershipLoading(false);
        }
      };
      fetchQRCode();
      fetchMembershipInfo();
    }
  }, [user?.gym_id]);

  useEffect(() => {
    const fetchWorkoutHistory = async () => {
      setHistoryLoading(true);
      try {
        const data = await workoutService.getWorkoutLogs(5);
        setWorkoutHistory(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (err) {
        console.error(err);
        setWorkoutHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchWorkoutHistory();
  }, []);

  const refetchQR = async () => {
    if (!user?.gym_id) return;
    setQrCodeLoading(true);
    try {
      const data = await authService.getUserQRCode();
      setQrCodeData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setQrCodeLoading(false);
    }
  };

  const handleLeaveGym = async () => {
    if (!user?.gym_id) return;
    if (window.confirm('Leave this gym? You can join another later.')) {
      try {
        await communityService.leaveGym(user.gym_id);
        setMessage('Left the gym. Reloading.');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        setError(err.message || 'Failed to leave gym.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'username' && usernameError) setUsernameError('');
  };

  const handleDietaryRestrictionsChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, dietary_restrictions: typeof value === 'string' ? value.split(',') : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage(''); setUsernameError('');
    try {
      if (!formData.full_name.trim()) throw new Error('Full name is required');
      if (!formData.username.trim()) throw new Error('Username is required');
      await updateProfile({
        ...formData,
        age: formData.age ? parseInt(formData.age, 10) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
      });
      setMessage('Profile updated.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      if (err.message?.toLowerCase().includes('username')) setUsernameError(err.message);
      else setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGymSubmit = async (e) => {
    e.preventDefault(); e.stopPropagation();
    setGymCodeLoading(true); setGymCodeError(''); setGymCodeMessage('');
    try {
      const response = await communityService.joinGymByCode(gymCodeInput);
      setGymCodeMessage(response.message || 'Joined. Reloading.');
      setGymCodeInput('');
      await fetchUserStats();
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setGymCodeError(err.message || 'Failed to join. Check the code.');
    } finally {
      setGymCodeLoading(false);
    }
  };

  const genderOptions = [
    { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' },
  ];
  const fitnessGoalOptions = [
    { value: 'weight_loss', label: 'Weight loss' }, { value: 'muscle_gain', label: 'Muscle gain' },
    { value: 'endurance', label: 'Endurance' }, { value: 'strength', label: 'Strength' },
    { value: 'general_fitness', label: 'General fitness' },
  ];
  const experienceLevelOptions = [
    { value: 'beginner', label: 'Beginner' }, { value: 'intermediate', label: 'Intermediate' }, { value: 'advanced', label: 'Advanced' },
  ];
  const activityLevelOptions = [
    { value: 'sedentary', label: 'Sedentary' },
    { value: 'lightly_active', label: 'Lightly active' },
    { value: 'moderately_active', label: 'Moderately active' },
    { value: 'very_active', label: 'Very active' },
    { value: 'extremely_active', label: 'Extremely active' },
  ];
  const dietaryRestrictionsOptions = [
    { value: 'vegetarian', label: 'Vegetarian' }, { value: 'vegan', label: 'Vegan' },
    { value: 'gluten_free', label: 'Gluten free' }, { value: 'dairy_free', label: 'Dairy free' },
    { value: 'keto', label: 'Keto' }, { value: 'paleo', label: 'Paleo' },
    { value: 'low_carb', label: 'Low carb' }, { value: 'halal', label: 'Halal' }, { value: 'kosher', label: 'Kosher' },
  ];

  const bmi = (formData.weight && formData.height)
    ? (parseFloat(formData.weight) / (parseFloat(formData.height) / 100) ** 2).toFixed(1)
    : null;

  return (
    <PageContainer
      title="Profile"
      subtitle="Your details, your goals, and your gym affiliation. The model uses these to tailor what you see."
    >
      {message && <Alert severity="success" onClose={() => setMessage('')} sx={{ mb: 3 }}>{message}</Alert>}
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3 }}>{error}</Alert>}
      {gymCodeMessage && <Alert severity="success" onClose={() => setGymCodeMessage('')} sx={{ mb: 3 }}>{gymCodeMessage}</Alert>}
      {gymCodeError && <Alert severity="error" onClose={() => setGymCodeError('')} sx={{ mb: 3 }}>{gymCodeError}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>

        {/* ============ IDENTITY ============ */}
        <Section idx={1} title="Identity">
          <Stack spacing={4}>
            <ModernInput
              label="Full name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            <ModernInput
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              error={!!usernameError}
              helperText={usernameError}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
              <ModernInput
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
              />
              <ModernSelect
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={genderOptions}
              />
            </Box>
          </Stack>
        </Section>

        {/* ============ BODY ============ */}
        <Section idx={2} title="Body" italic="metrics">
          <Stack spacing={4}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
              <ModernInput
                label="Weight · kg"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                helperText={preferences.weightUnit === 'lbs' ? "Display in lbs; enter value in kg." : 'For calorie + intensity calcs.'}
              />
              <ModernInput
                label="Height · cm"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                helperText={preferences.heightUnit === 'ft/in' ? "Display in ft/in; enter value in cm." : 'For BMI + recommendations.'}
              />
            </Box>

            {bmi && (
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                py: 3,
                borderTop: `1px solid ${ev.rule}`,
                borderBottom: `1px solid ${ev.rule}`,
              }}>
                <Box sx={monoLabel}>Body mass index</Box>
                <Box sx={{ ...display, fontSize: 36, color: ev.chalk, letterSpacing: '-0.02em' }}>{bmi}</Box>
              </Box>
            )}
          </Stack>
        </Section>

        {/* ============ TRAINING ============ */}
        <Section idx={3} title="Training" italic="profile">
          <Stack spacing={4}>
            <ModernSelect
              label="Primary goal"
              name="fitness_goal"
              value={formData.fitness_goal}
              onChange={handleChange}
              options={fitnessGoalOptions}
              placeholder="What are you training toward?"
            />
            <ModernSelect
              label="Experience"
              name="experience_level"
              value={formData.experience_level}
              onChange={handleChange}
              options={experienceLevelOptions}
              placeholder="Where are you now?"
            />
            <ModernSelect
              label="Daily activity"
              name="activity_level"
              value={formData.activity_level}
              onChange={handleChange}
              options={activityLevelOptions}
              placeholder="How active is your day-to-day?"
              helperText="Used to calibrate daily calorie targets."
            />
          </Stack>
        </Section>

        {/* ============ DIET ============ */}
        <Section idx={4} title="Diet" italic="preferences">
          <ModernSelect
            label="Dietary restrictions"
            name="dietary_restrictions"
            value={formData.dietary_restrictions}
            onChange={handleDietaryRestrictionsChange}
            options={dietaryRestrictionsOptions}
            placeholder="Pick anything that applies"
            multiple
            helperText="Used for meal recommendations."
          />
        </Section>

        {/* ============ GYM ============ */}
        <Section idx={5} title="Gym" italic={user?.gym_id ? 'membership' : 'affiliation'}>
          {user?.gym_id ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 240px' }, gap: 5, alignItems: 'start' }}>
              <Stack spacing={3} sx={{ ...mono, fontSize: 13, color: ev.chalk, letterSpacing: '0.06em' }}>
                {membershipLoading ? (
                  <CircularProgress size={20} />
                ) : membershipInfo ? (
                  <>
                    <Box>
                      <Box sx={monoLabel}>Gym</Box>
                      <Box sx={{ ...display, fontSize: 24, letterSpacing: '-0.01em', color: ev.chalk, mt: 1.5 }}>
                        {membershipInfo.gym_name || '—'}
                      </Box>
                    </Box>
                    <Box>
                      <Box sx={monoLabel}>Status</Box>
                      <Box sx={{
                        ...mono, fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase',
                        color: membershipInfo.membership_status === 'ACTIVE' ? ev.accent : ev.warn,
                        mt: 1.5,
                      }}>
                        {membershipInfo.membership_status || 'ACTIVE'}
                      </Box>
                    </Box>
                    {membershipInfo.membership_expiry && (
                      <Box>
                        <Box sx={monoLabel}>Expires</Box>
                        <Box sx={{ ...mono, fontSize: 13, color: ev.chalk, mt: 1.5 }}>
                          {new Date(membershipInfo.membership_expiry).toLocaleDateString()}
                        </Box>
                      </Box>
                    )}
                    <Box sx={{ pt: 2 }}>
                      <SecondaryButton
                        onClick={handleLeaveGym}
                        sx={{ color: ev.warn, '&:hover': { borderColor: ev.warn, color: ev.warn } }}
                      >
                        Leave gym
                      </SecondaryButton>
                    </Box>
                  </>
                ) : (
                  <Box sx={monoLabel}>Unable to load membership details</Box>
                )}
              </Stack>

              <Box sx={{ textAlign: 'center', border: `1px solid ${ev.rule}`, p: 3 }}>
                <Box sx={{ ...monoLabel, mb: 2 }}>Check-in QR</Box>
                {qrCodeLoading ? (
                  <Box sx={{ py: 6 }}><CircularProgress size={32} /></Box>
                ) : qrCodeData?.qr_code_url ? (
                  <>
                    <Box sx={{ p: 1.5, backgroundColor: ev.chalk, display: 'inline-block' }}>
                      <Box
                        component="img"
                        src={qrCodeData.qr_code_url}
                        alt="User QR code"
                        sx={{ width: 180, height: 180, display: 'block' }}
                      />
                    </Box>
                    <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: 2 }}>
                      Scan at gym entrance
                    </Box>
                    <Box
                      onClick={refetchQR}
                      sx={{
                        mt: 2,
                        cursor: 'pointer',
                        ...mono,
                        fontSize: 11,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: ev.chalkDim,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        '&:hover': { color: ev.accent },
                      }}
                    >
                      <Refresh sx={{ fontSize: 14 }} /> Refresh
                    </Box>
                  </>
                ) : (
                  <Box sx={{ ...monoLabel, color: ev.chalkMute, py: 4 }}>QR not available</Box>
                )}
              </Box>
            </Box>
          ) : (
            <Stack spacing={3}>
              <Box sx={{ color: ev.chalkDim, fontSize: 15, lineHeight: 1.55 }}>
                Enter your gym's unique code to link your account.
              </Box>
              <ModernInput
                label="Gym code"
                name="gym_code"
                value={gymCodeInput}
                onChange={(e) => setGymCodeInput(e.target.value)}
                placeholder="e.g. ABC123"
                error={!!gymCodeError}
                helperText={gymCodeError || "Ask your gym admin for the code."}
                onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleJoinGymSubmit(e); } }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <PrimaryButton onClick={handleJoinGymSubmit} loading={gymCodeLoading} disabled={loading || !gymCodeInput}>
                  {gymCodeLoading ? 'Joining' : 'Join gym'}
                </PrimaryButton>
              </Box>
            </Stack>
          )}
        </Section>

        {/* ============ RECENT ============ */}
        <Section idx={6} title="Recent" italic="sessions">
          {historyLoading ? (
            <Box sx={{ display: 'grid', placeItems: 'center', py: 5 }}>
              <CircularProgress size={24} />
            </Box>
          ) : workoutHistory.length === 0 ? (
            <Box sx={{ py: 4, ...monoLabel, color: ev.chalkMute }}>
              No workouts logged yet
            </Box>
          ) : (
            <Box>
              {workoutHistory.map((w, i) => {
                const date = new Date(w.workout_date || w.created_at);
                const exerciseCount = w.exercises_completed?.length || 0;
                return (
                  <Box key={i} sx={{
                    display: 'grid',
                    gridTemplateColumns: '30px 1fr auto auto',
                    gap: 3,
                    alignItems: 'baseline',
                    py: 2.5,
                    borderTop: `1px solid ${ev.rule}`,
                    '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
                  }}>
                    <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>
                      {String(i + 1).padStart(2, '0')}
                    </Box>
                    <Box sx={{ ...display, fontSize: 18, color: ev.chalk, letterSpacing: '-0.005em' }}>
                      {date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                    </Box>
                    <Box sx={{ ...mono, fontSize: 12, color: ev.chalkDim }}>
                      {Math.round(w.duration_minutes || w.duration || 0)} <Box component="span" sx={{ color: ev.chalkMute }}>min</Box>
                    </Box>
                    <Box sx={{ ...mono, fontSize: 12, color: ev.chalkDim }}>
                      {exerciseCount} <Box component="span" sx={{ color: ev.chalkMute }}>movements</Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Section>

        {/* ============ ACTIONS ============ */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 6, pt: 5, borderTop: `1px solid ${ev.rule}` }}>
          <SecondaryButton
            type="button"
            onClick={() => {
              if (user) {
                setFormData({
                  full_name: user.full_name || '',
                  username: user.username || '',
                  age: user.age || '',
                  weight: user.weight || '',
                  height: user.height || '',
                  gender: user.gender || '',
                  fitness_goal: user.fitness_goal || '',
                  experience_level: user.experience_level || '',
                  activity_level: user.activity_level || '',
                  dietary_restrictions: user.dietary_restrictions || [],
                });
                setMessage('Changes reset.');
                setError('');
                setUsernameError('');
              }
            }}
            disabled={loading}
          >
            Reset
          </SecondaryButton>
          <PrimaryButton type="submit" loading={loading} startIcon={<Save />}>
            {loading ? 'Saving' : 'Save profile'}
          </PrimaryButton>
        </Box>
      </Box>
    </PageContainer>
  );
}

export default Profile;
