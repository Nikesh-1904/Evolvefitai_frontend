// src/pages/WorkoutRecommendations.js — Evolve / minimal AI recommendations

import React, { useState, useEffect } from 'react';
import { Box, Stack, Alert } from '@mui/material';
import { PlayArrow, Refresh, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { PageContainer } from '../components/design-system';
import { Loading } from '../components/design-system';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';
import workoutService from '../services/api/workoutService';
import { ev } from '../theme/evolveDarkTheme';

const mono = { fontFamily: ev.mono };
const display = { fontFamily: ev.display };
const monoLabel = { ...mono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: ev.chalkDim };

function Toggle({ active, onClick, children }) {
  return (
    <Box
      onClick={onClick}
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
      {children}
    </Box>
  );
}

function WorkoutRecommendations() {
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [lookbackDays, setLookbackDays] = useState(7);

  useEffect(() => {
    fetchRecommendation();
  }, [lookbackDays]);

  const fetchRecommendation = async () => {
    setLoading(true); setError('');
    try {
      const data = await workoutService.getWorkoutRecommendation({ lookback_days: lookbackDays });
      setRecommendation(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load workout recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkout = () => {
    if (!recommendation) return;
    sessionStorage.setItem('currentWorkout', JSON.stringify({
      id: recommendation.id,
      name: recommendation.name,
      exercises: recommendation.exercises,
      ai_generated: true,
      ai_model: recommendation.ai_model,
    }));
    navigate('/workout-session', { state: { workoutPlan: recommendation } });
  };

  const handleSaveWorkout = async () => {
    if (!recommendation) return;
    setSaving(true);
    try {
      await workoutService.saveWorkoutPlan({
        name: recommendation.name,
        description: recommendation.description,
        exercises: recommendation.exercises,
        difficulty: recommendation.difficulty,
        estimated_duration: recommendation.estimated_duration,
        ai_generated: true,
        ai_model: recommendation.ai_model,
      });
      setSavedMessage('Plan saved to your library.');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to save workout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer
      title="Recommended"
      subtitle="A workout the model picked for you based on what you've trained recently and what you've been neglecting."
    >
      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
      {savedMessage && <Alert severity="success" sx={{ mb: 4 }}>{savedMessage}</Alert>}

      {/* ============ LOOKBACK ============ */}
      <Box sx={{ borderTop: `1px solid ${ev.rule}`, borderBottom: `1px solid ${ev.rule}`, py: 4, mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 3, flexWrap: 'wrap' }}>
        <Box>
          <Box sx={monoLabel}>Lookback window</Box>
          <Box sx={{ ...display, fontSize: 28, color: ev.chalk, letterSpacing: '-0.015em', mt: 1 }}>
            Last <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>{lookbackDays}</Box> days
          </Box>
        </Box>
        <Stack direction="row" spacing={1.5}>
          {[7, 14, 30].map((days) => (
            <Toggle key={days} active={lookbackDays === days} onClick={() => setLookbackDays(days)}>
              {days}d
            </Toggle>
          ))}
        </Stack>
      </Box>

      {loading ? (
        <Loading />
      ) : !recommendation ? (
        <Box sx={{ py: '80px', borderTop: `1px solid ${ev.rule}`, borderBottom: `1px solid ${ev.rule}`, textAlign: 'center' }}>
          <Box sx={{ ...display, fontSize: 32, color: ev.chalk, letterSpacing: '-0.015em' }}>
            No recommendation<Box component="span" sx={{ color: ev.accent }}>.</Box>
          </Box>
          <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: 2 }}>
            Log a few workouts first so the model has something to work with
          </Box>
        </Box>
      ) : (
        <Box>
          {/* ============ HEADLINE ============ */}
          <Box>
            <Box sx={monoLabel}>The plan</Box>
            <Box sx={{
              ...display,
              fontSize: 'clamp(40px, 5vw, 64px)',
              letterSpacing: '-0.02em',
              color: ev.chalk,
              mt: 2,
              lineHeight: 1,
            }}>
              {recommendation.name}
            </Box>
            {recommendation.description && (
              <Box sx={{ mt: 3, maxWidth: '60ch', color: ev.chalkDim, fontWeight: 400, fontSize: 15, lineHeight: 1.55 }}>
                {recommendation.description}
              </Box>
            )}
          </Box>

          {/* ============ STATS ============ */}
          <Box sx={{
            mt: 5,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            borderTop: `1px solid ${ev.rule}`,
            borderBottom: `1px solid ${ev.rule}`,
          }}>
            {[
              { idx: 1, label: 'Difficulty', value: recommendation.difficulty || 'Intermediate' },
              { idx: 2, label: 'Duration',   value: recommendation.estimated_duration || 45, unit: 'min' },
              { idx: 3, label: 'Movements',  value: recommendation.exercises?.length || 0 },
            ].map((s, i, arr) => (
              <Box key={s.label} sx={{
                py: 4,
                px: 3,
                borderRight: { md: i < arr.length - 1 ? `1px solid ${ev.rule}` : 'none' },
                borderBottom: { xs: i < arr.length - 1 ? `1px solid ${ev.rule}` : 'none', md: 'none' },
              }}>
                <Box sx={monoLabel}>{s.label}</Box>
                <Box sx={{ ...display, fontSize: 'clamp(36px, 4vw, 48px)', color: ev.chalk, letterSpacing: '-0.02em', mt: 2 }}>
                  {s.value}
                  {s.unit && <Box component="span" sx={{ ...mono, fontSize: 12, color: ev.chalkMute, ml: 0.75, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.unit}</Box>}
                </Box>
              </Box>
            ))}
          </Box>

          {/* ============ WHY ============ */}
          <Box sx={{ py: 5, borderBottom: `1px solid ${ev.rule}` }}>
            <Box sx={monoLabel}>Why this</Box>
            <Box sx={{
              mt: 2,
              ...display,
              fontStyle: 'italic',
              fontSize: 'clamp(24px, 2.6vw, 32px)',
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
              color: ev.chalk,
              maxWidth: '40ch',
            }}>
              "Targets muscle groups you haven't trained in the last <Box component="span" sx={{ fontStyle: 'normal', color: ev.accent }}>{lookbackDays} days</Box>. Keeps your programming balanced."
            </Box>
          </Box>

          {/* ============ EXERCISES ============ */}
          <Box sx={{ py: 6 }}>
            <Box sx={{ ...monoLabel, mb: 3 }}>The movements · {recommendation.exercises?.length || 0}</Box>
            {recommendation.exercises?.map((exercise, i) => (
              <Box key={i} sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '30px 1fr', md: '40px 1fr 80px 80px 80px' },
                gap: 3,
                alignItems: 'baseline',
                py: '24px',
                borderTop: `1px solid ${ev.rule}`,
                '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
              }}>
                <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>
                  {String(i + 1).padStart(2, '0')}
                </Box>
                <Box>
                  <Box sx={{ ...display, fontSize: 'clamp(20px, 2vw, 26px)', letterSpacing: '-0.01em', color: ev.chalk, lineHeight: 1.1 }}>
                    {exercise.name}
                  </Box>
                  {exercise.muscle_groups?.length > 0 && (
                    <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: 1 }}>
                      {exercise.muscle_groups.slice(0, 3).join(' · ')}
                    </Box>
                  )}
                  {exercise.notes && (
                    <Box sx={{ mt: 1.5, color: ev.chalkDim, fontSize: 13, lineHeight: 1.55, maxWidth: '60ch' }}>
                      {exercise.notes}
                    </Box>
                  )}
                </Box>
                {exercise.sets && (
                  <Box sx={{ display: { xs: 'none', md: 'block' }, ...mono, fontSize: 13, color: ev.chalkDim, textAlign: 'right' }}>
                    {exercise.sets} <Box component="span" sx={{ color: ev.chalkMute }}>sets</Box>
                  </Box>
                )}
                {exercise.reps && (
                  <Box sx={{ display: { xs: 'none', md: 'block' }, ...mono, fontSize: 13, color: ev.chalkDim, textAlign: 'right' }}>
                    {exercise.reps} <Box component="span" sx={{ color: ev.chalkMute }}>reps</Box>
                  </Box>
                )}
                {exercise.rest_seconds && (
                  <Box sx={{ display: { xs: 'none', md: 'block' }, ...mono, fontSize: 13, color: ev.chalkDim, textAlign: 'right' }}>
                    {exercise.rest_seconds}s <Box component="span" sx={{ color: ev.chalkMute }}>rest</Box>
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          {/* ============ ACTIONS ============ */}
          <Box sx={{ py: 5, borderTop: `1px solid ${ev.rule}`, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <PrimaryButton onClick={handleStartWorkout} startIcon={<PlayArrow />} size="large">
              Begin session
            </PrimaryButton>
            <SecondaryButton onClick={handleSaveWorkout} startIcon={<Save />} disabled={saving}>
              {saving ? 'Saving' : 'Save plan'}
            </SecondaryButton>
            <SecondaryButton onClick={fetchRecommendation} startIcon={<Refresh />}>
              New suggestion
            </SecondaryButton>
          </Box>
        </Box>
      )}
    </PageContainer>
  );
}

export default WorkoutRecommendations;
