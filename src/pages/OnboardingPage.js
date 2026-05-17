// src/pages/OnboardingPage.js — Evolve / minimal 3-step onboarding

import React, { useState } from 'react';
import { Box, Stack, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import ModernInput from '../components/ModernInput';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';
import { ev } from '../theme/evolveDarkTheme';

const PAGE_X = 'clamp(28px, 6vw, 96px)';

const mono = { fontFamily: ev.mono };
const display = { fontFamily: ev.display };
const monoLabel = { ...mono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: ev.chalkDim };

const steps = [
  { num: '01', name: 'Identity' },
  { num: '02', name: 'Body' },
  { num: '03', name: 'Goals' },
];

const fitnessGoals = [
  { value: 'weight_loss',      label: 'Weight loss' },
  { value: 'muscle_gain',      label: 'Muscle gain' },
  { value: 'strength',         label: 'Strength' },
  { value: 'endurance',        label: 'Endurance' },
  { value: 'general_fitness',  label: 'General fitness' },
];

const dietaryRestrictions = [
  { value: 'vegetarian',  label: 'Vegetarian' },
  { value: 'vegan',       label: 'Vegan' },
  { value: 'gluten_free', label: 'Gluten free' },
  { value: 'dairy_free',  label: 'Dairy free' },
  { value: 'keto',        label: 'Keto' },
  { value: 'paleo',       label: 'Paleo' },
];

function OnboardingPage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    fitness_goal: user?.fitness_goal || '',
    dietary_restrictions: user?.dietary_restrictions || [],
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const toggleRestriction = (value) => {
    setFormData((prev) => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.includes(value)
        ? prev.dietary_restrictions.filter((r) => r !== value)
        : [...prev.dietary_restrictions, value],
    }));
  };

  const validateStep = () => {
    const errs = {};
    if (activeStep === 0 && (!formData.username || formData.username.trim().length < 3)) {
      errs.username = 'Username must be at least 3 characters';
    }
    if (activeStep === 1) {
      if (!formData.age || formData.age < 13) errs.age = 'Must be at least 13';
      if (!formData.weight || formData.weight < 30) errs.weight = 'Enter a valid weight';
      if (!formData.height || formData.height < 100) errs.height = 'Enter a valid height in cm';
    }
    if (activeStep === 2 && !formData.fitness_goal) {
      errs.fitness_goal = 'Pick a primary goal';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => { if (validateStep()) setActiveStep((s) => s + 1); };
  const handleBack = () => setActiveStep((s) => Math.max(0, s - 1));

  const handleFinish = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true); setSubmitError('');
    try {
      await updateProfile({ ...formData, has_completed_onboarding: true });
      navigate('/');
    } catch (err) {
      setSubmitError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Stack spacing={5}>
            <Box>
              <Box
                component="h1"
                sx={{
                  m: 0,
                  ...display,
                  fontWeight: 400,
                  fontSize: 'clamp(56px, 8vw, 120px)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.025em',
                  color: ev.chalk,
                }}
              >
                Welcome to <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>Evolvefit</Box>
                <Box component="span" sx={{ color: ev.accent }}>.</Box>{' '}
                <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>AI</Box>
              </Box>
              <Box sx={{ mt: 4, maxWidth: '54ch', color: ev.chalk, fontSize: 16, lineHeight: 1.55, fontWeight: 500 }}>
                Three quick steps to set up your profile. We'll use these to tailor what you see — workouts, plans, and the analysis on your dashboard.
              </Box>
            </Box>

            <Box sx={{ pt: 4, borderTop: `1px solid ${ev.rule}` }}>
              <Box sx={{ ...monoLabel, mb: 3 }}>Choose a username</Box>
              <ModernInput
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="A unique display name"
                required
                error={!!fieldErrors.username}
                helperText={fieldErrors.username || 'Visible to others — minimum 3 characters'}
              />
            </Box>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={5}>
            <Box>
              <Box
                component="h1"
                sx={{
                  m: 0,
                  ...display,
                  fontWeight: 400,
                  fontSize: 'clamp(56px, 8vw, 120px)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.025em',
                  color: ev.chalk,
                }}
              >
                Body <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>basics</Box>
                <Box component="span" sx={{ color: ev.accent }}>.</Box>
              </Box>
              <Box sx={{ mt: 4, maxWidth: '54ch', color: ev.chalk, fontSize: 16, lineHeight: 1.55, fontWeight: 500 }}>
                We use these to calibrate calorie estimates, BMI, and intensity targets. Enter actual values, not aspirational ones.
              </Box>
            </Box>

            <Box sx={{ pt: 4, borderTop: `1px solid ${ev.rule}`, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 4 }}>
              <ModernInput
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Years"
                required
                error={!!fieldErrors.age}
                helperText={fieldErrors.age}
              />
              <ModernInput
                label="Weight · kg"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 72"
                required
                error={!!fieldErrors.weight}
                helperText={fieldErrors.weight}
              />
              <ModernInput
                label="Height · cm"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g. 178"
                required
                error={!!fieldErrors.height}
                helperText={fieldErrors.height}
              />
            </Box>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={5}>
            <Box>
              <Box
                component="h1"
                sx={{
                  m: 0,
                  ...display,
                  fontWeight: 400,
                  fontSize: 'clamp(56px, 8vw, 120px)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.025em',
                  color: ev.chalk,
                }}
              >
                Your <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>goal</Box>
                <Box component="span" sx={{ color: ev.accent }}>.</Box>
              </Box>
              <Box sx={{ mt: 4, maxWidth: '54ch', color: ev.chalk, fontSize: 16, lineHeight: 1.55, fontWeight: 500 }}>
                Pick the primary thing you're training toward. You can change this anytime.
              </Box>
            </Box>

            <Box sx={{ pt: 4, borderTop: `1px solid ${ev.rule}` }}>
              <Box sx={{ ...monoLabel, mb: 3 }}>Primary goal · pick one</Box>
              <Box>
                {fitnessGoals.map((g, i) => {
                  const active = formData.fitness_goal === g.value;
                  return (
                    <Box
                      key={g.value}
                      onClick={() => setFormData((p) => ({ ...p, fitness_goal: g.value }))}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '40px 1fr 24px',
                        gap: 3,
                        alignItems: 'baseline',
                        py: 3,
                        borderTop: `1px solid ${ev.rule}`,
                        '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
                        cursor: 'pointer',
                        transition: 'padding-left .2s ease, background-color .15s ease',
                        backgroundColor: active ? ev.ink2 : 'transparent',
                        '&:hover': { pl: '12px' },
                      }}
                    >
                      <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: active ? ev.accent : ev.chalkMute }}>
                        {String(i + 1).padStart(2, '0')}
                      </Box>
                      <Box sx={{ ...display, fontSize: 'clamp(22px, 2.2vw, 28px)', letterSpacing: '-0.01em', color: active ? ev.chalk : ev.chalk, lineHeight: 1.1 }}>
                        {g.label}
                      </Box>
                      <Box sx={{ ...display, fontSize: 18, fontStyle: 'italic', color: active ? ev.accent : ev.chalkMute, justifySelf: 'end' }}>
                        {active ? '✓' : '·'}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              {fieldErrors.fitness_goal && (
                <Alert severity="error" sx={{ mt: 3 }}>{fieldErrors.fitness_goal}</Alert>
              )}
            </Box>

            <Box sx={{ pt: 4, borderTop: `1px solid ${ev.rule}` }}>
              <Box sx={{ ...monoLabel, mb: 3 }}>Dietary restrictions · optional</Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {dietaryRestrictions.map((d) => {
                  const active = formData.dietary_restrictions.includes(d.value);
                  return (
                    <Box
                      key={d.value}
                      onClick={() => toggleRestriction(d.value)}
                      sx={{
                        cursor: 'pointer',
                        px: 2.5,
                        py: 1.25,
                        border: `1px solid ${active ? ev.chalk : ev.rule}`,
                        backgroundColor: active ? ev.chalk : 'transparent',
                        color: active ? ev.ink : ev.chalkDim,
                        ...mono,
                        fontSize: 11,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        transition: 'all .15s ease',
                        '&:hover': { borderColor: active ? ev.chalk : ev.chalkMute, color: active ? ev.ink : ev.chalk },
                      }}
                    >
                      {d.label}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Stack>
        );

      default:
        return null;
    }
  };

  const isLastStep = activeStep === steps.length - 1;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: ev.ink, animation: 'ev-rise .45s ease both' }}>

      {/* ============ HEADER ============ */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: PAGE_X,
        py: 4,
        borderBottom: `1px solid ${ev.rule}`,
      }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.75 }}>
          <Box sx={{ ...display, fontSize: 22, color: ev.chalk, letterSpacing: '-0.01em', lineHeight: 1 }}>
            Evolvefit
          </Box>
          <Box sx={{ ...display, fontSize: 22, color: ev.accent, lineHeight: 1 }}>.</Box>
          <Box sx={{ ...display, fontStyle: 'italic', fontSize: 18, color: ev.chalkDim, lineHeight: 1, ml: 0.25 }}>
            AI
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 4 }}>
          {steps.map((s, i) => (
            <Box
              key={s.num}
              sx={{
                ...mono,
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: i === activeStep ? ev.chalk : ev.chalkMute,
                position: 'relative',
                '&::before': i === activeStep ? {
                  content: '"·"',
                  position: 'absolute',
                  left: -12,
                  color: ev.accent,
                } : {},
              }}
            >
              {s.num} · {s.name}
            </Box>
          ))}
        </Box>
      </Box>

      {/* ============ PROGRESS BAR ============ */}
      <Box sx={{ position: 'relative', height: '1px', backgroundColor: ev.rule }}>
        <Box sx={{
          position: 'absolute',
          inset: 0,
          width: `${((activeStep + 1) / steps.length) * 100}%`,
          backgroundColor: ev.accent,
          transition: 'width .4s cubic-bezier(.2,.7,.1,1)',
        }} />
      </Box>

      {/* ============ MAIN ============ */}
      <Box sx={{ px: PAGE_X, py: 'clamp(56px, 9vh, 110px)', maxWidth: 920, mx: 'auto' }}>
        {submitError && <Alert severity="error" onClose={() => setSubmitError('')} sx={{ mb: 5 }}>{submitError}</Alert>}

        {renderStepContent()}

        {/* ============ NAV ============ */}
        <Box sx={{
          mt: 6,
          pt: 5,
          borderTop: `1px solid ${ev.rule}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}>
          {activeStep > 0 ? (
            <SecondaryButton onClick={handleBack} disabled={isSubmitting}>
              ← Back
            </SecondaryButton>
          ) : <Box />}

          <Box sx={{ ...monoLabel, color: ev.chalkMute }}>
            Step {String(activeStep + 1).padStart(2, '0')} of {String(steps.length).padStart(2, '0')}
          </Box>

          {isLastStep ? (
            <PrimaryButton onClick={handleFinish} loading={isSubmitting} disabled={isSubmitting}>
              {isSubmitting ? 'Saving' : 'Finish ↗'}
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={handleNext}>
              Continue ↗
            </PrimaryButton>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default OnboardingPage;
