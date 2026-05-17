// src/pages/WorkoutPlanDetail.js — Evolve / minimal plan detail

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Alert, Collapse } from '@mui/material';
import { PlayArrow, VideoLibrary, OpenInNew } from '@mui/icons-material';

import { workoutService } from '../services/api';
import { PageContainer } from '../components/design-system';
import { LoadingSpinner } from '../components/design-system/Loading';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';
import { ev } from '../theme/evolveDarkTheme';

const mono = { fontFamily: ev.mono };
const display = { fontFamily: ev.display };
const monoLabel = { ...mono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: ev.chalkDim };

const exerciseTypeLabel = (t) => ({
  WEIGHT_BASED: 'Weighted',
  REPS_ONLY: 'Reps only',
  DURATION: 'Duration',
  DISTANCE_DURATION: 'Distance · time',
  QUALITATIVE: 'Qualitative',
}[t] || 'Exercise');

function ExerciseRow({ idx, exercise, details, loading, expanded, onToggle, onLoadDetails }) {
  return (
    <Box sx={{ borderTop: `1px solid ${ev.rule}`, '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` } }}>
      <Box
        onClick={onToggle}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '30px 1fr auto', md: '40px 1fr 140px 140px 24px' },
          gap: '28px',
          alignItems: 'baseline',
          py: '28px',
          cursor: 'pointer',
          transition: 'padding-left .2s ease',
          '&:hover': { pl: '12px' },
        }}
      >
        <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>
          {String(idx).padStart(2, '0')}
        </Box>
        <Box>
          <Box sx={{ ...display, fontSize: 'clamp(22px, 2.4vw, 30px)', letterSpacing: '-0.01em', color: ev.chalk, lineHeight: 1.1 }}>
            {exercise.name}
          </Box>
          <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: '8px' }}>
            {exerciseTypeLabel(exercise.exercise_type)}
          </Box>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' }, ...mono, fontSize: 13, color: ev.chalkDim, textAlign: 'right' }}>
          {exercise.sets || 1} <Box component="span" sx={{ color: ev.chalkMute }}>sets</Box>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' }, ...mono, fontSize: 13, color: ev.chalkDim, textAlign: 'right' }}>
          {exercise.reps || '—'} <Box component="span" sx={{ color: ev.chalkMute }}>reps</Box>
        </Box>
        <Box sx={{ ...display, fontSize: 18, fontStyle: 'italic', color: expanded ? ev.accent : ev.chalkMute, justifySelf: 'end' }}>
          {expanded ? '↑' : '↓'}
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ pl: { md: '68px' }, pb: 5, pr: 3, pt: 1 }}>
          {exercise.instructions && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ ...monoLabel, mb: 2 }}>Instructions</Box>
              <Box sx={{ color: ev.chalk, fontSize: 14, lineHeight: 1.65, maxWidth: '70ch' }}>
                {exercise.instructions}
              </Box>
            </Box>
          )}

          {!details && (
            <SecondaryButton onClick={onLoadDetails} startIcon={<VideoLibrary />} disabled={loading}>
              {loading ? 'Loading' : 'Load videos & tips'}
            </SecondaryButton>
          )}

          {details && (
            <Box>
              {details.videos?.length > 0 && (
                <Box sx={{ mb: 5 }}>
                  <Box sx={{ ...monoLabel, mb: 2 }}>Videos · {details.videos.length}</Box>
                  <Box>
                    {details.videos.slice(0, 4).map((video, i) => (
                      <Box
                        key={i}
                        component="a"
                        href={video.youtube_url || video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          py: 2.5,
                          borderTop: `1px solid ${ev.rule}`,
                          '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
                          textDecoration: 'none',
                          color: ev.chalk,
                          transition: 'background-color .15s ease, padding-left .15s ease',
                          '&:hover': { backgroundColor: ev.ruleSoft, pl: 1.5, color: ev.accent },
                        }}
                      >
                        <Box sx={{ fontSize: 14, fontWeight: 500 }}>{video.title || `Video ${i + 1}`}</Box>
                        <OpenInNew sx={{ fontSize: 14, color: ev.chalkMute }} />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {details.tips?.length > 0 && (
                <Box>
                  <Box sx={{ ...monoLabel, mb: 2 }}>Pro tips</Box>
                  {details.tips.slice(0, 4).map((tip, i) => (
                    <Box key={i} sx={{
                      py: 2.5,
                      borderTop: `1px solid ${ev.rule}`,
                      '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
                      color: ev.chalk,
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}>
                      {typeof tip === 'string' ? tip : (tip.content || tip.title)}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

function WorkoutPlanDetail() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exerciseDetails, setExerciseDetails] = useState({});
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [loadingDetailsFor, setLoadingDetailsFor] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await workoutService.getWorkoutPlanById(planId);
        setPlan(data);
      } catch (err) {
        setError('Failed to load workout plan. It may not exist or you may not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId]);

  const fetchExerciseDetails = async (name) => {
    if (exerciseDetails[name]) return;
    setLoadingDetailsFor(name);
    try {
      const details = await workoutService.getExerciseDetails(name);
      setExerciseDetails((prev) => ({ ...prev, [name]: details }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetailsFor(null);
    }
  };

  const handleStartWorkout = () => plan && navigate('/workout-session', { state: { workoutPlan: plan } });

  if (loading) return <LoadingSpinner fullScreen message="Loading plan" />;

  if (error) {
    return (
      <PageContainer title="Plan" subtitle="Workout plan detail">
        <Alert severity="error">{error}</Alert>
      </PageContainer>
    );
  }

  if (!plan) return null;

  const typeBreakdown = Object.entries(
    (plan.exercises || []).reduce((acc, ex) => {
      const type = ex.exercise_type || 'WEIGHT_BASED';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {})
  );

  return (
    <PageContainer
      title={plan.name}
      subtitle={plan.description || (plan.ai_generated ? 'AI generated plan, ready when you are.' : 'Manual workout plan.')}
      actions={
        <PrimaryButton onClick={handleStartWorkout} startIcon={<PlayArrow />} size="large">
          Begin session
        </PrimaryButton>
      }
    >
      {/* ============ OVERVIEW STATS ============ */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, borderTop: `1px solid ${ev.rule}`, borderBottom: `1px solid ${ev.rule}`, mb: 6 }}>
        {[
          { idx: 1, label: 'Duration',   value: plan.estimated_duration || 45, unit: 'min',  isFirst: true },
          { idx: 2, label: 'Movements',  value: plan.exercises?.length || 0 },
          { idx: 3, label: 'Difficulty', value: plan.difficulty || 'Intermediate' },
          { idx: 4, label: 'Source',     value: plan.ai_generated ? 'AI' : 'Manual', isLast: true },
        ].map((s) => (
          <Box
            key={s.label}
            sx={{
              py: '40px',
              px: { xs: 3, md: '36px' },
              pl: { md: s.isFirst ? 0 : '36px' },
              pr: { md: s.isLast ? 0 : '36px' },
              borderRight: { md: s.isLast ? 'none' : `1px solid ${ev.rule}` },
              borderBottom: { xs: !s.isLast ? `1px solid ${ev.rule}` : 'none', md: 'none' },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Box sx={monoLabel}>{s.label}</Box>
              <Box sx={{ ...monoLabel, color: ev.chalkMute }}>{String(s.idx).padStart(2, '0')}</Box>
            </Box>
            <Box sx={{ ...display, fontSize: 'clamp(40px, 4.5vw, 60px)', lineHeight: 0.95, letterSpacing: '-0.025em', color: ev.chalk, mt: '24px' }}>
              {s.value}
              {s.unit && (
                <Box component="span" sx={{ ...mono, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: ev.chalkMute, ml: '6px' }}>
                  {s.unit}
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      {/* ============ EXERCISE BREAKDOWN ============ */}
      <Box sx={{ display: { xs: 'block', md: 'grid' }, gridTemplateColumns: '1fr 1fr', alignItems: 'end', mb: 5 }}>
        <Box sx={{ ...display, fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.02em', color: ev.chalk, lineHeight: 1 }}>
          The <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>movements</Box>
        </Box>
        <Box sx={{ justifySelf: { md: 'end' }, mt: { xs: 2, md: 0 }, ...monoLabel }}>
          {plan.exercises?.length || 0} total · tap a row to expand
        </Box>
      </Box>

      <Box sx={{ mb: 6 }}>
        {(plan.exercises || []).map((exercise, i) => (
          <ExerciseRow
            key={i}
            idx={i + 1}
            exercise={exercise}
            details={exerciseDetails[exercise.name]}
            loading={loadingDetailsFor === exercise.name}
            expanded={expandedIdx === i}
            onToggle={() => setExpandedIdx(expandedIdx === i ? null : i)}
            onLoadDetails={() => fetchExerciseDetails(exercise.name)}
          />
        ))}
      </Box>

      {/* ============ TYPE BREAKDOWN ============ */}
      {typeBreakdown.length > 0 && (
        <Box sx={{ py: 6, borderTop: `1px solid ${ev.rule}` }}>
          <Box sx={{ ...monoLabel, mb: 3 }}>Exercise type breakdown</Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {typeBreakdown.map(([type, count]) => (
              <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', py: 2, borderBottom: `1px solid ${ev.rule}` }}>
                <Box sx={{ ...mono, fontSize: 13, color: ev.chalk, letterSpacing: '0.08em' }}>{exerciseTypeLabel(type)}</Box>
                <Box sx={{ ...display, fontSize: 28, color: ev.chalk, letterSpacing: '-0.01em' }}>
                  {String(count).padStart(2, '0')}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* ============ FINAL CTA ============ */}
      <Box sx={{ py: 6, borderTop: `1px solid ${ev.rule}` }}>
        <Box sx={{ ...display, fontSize: 'clamp(36px, 4.5vw, 56px)', letterSpacing: '-0.02em', color: ev.chalk, lineHeight: 1 }}>
          Ready when you are<Box component="span" sx={{ color: ev.accent }}>.</Box>
        </Box>
        <Box sx={{ mt: 4 }}>
          <PrimaryButton onClick={handleStartWorkout} startIcon={<PlayArrow />} size="large">
            Begin session ↗
          </PrimaryButton>
        </Box>
      </Box>
    </PageContainer>
  );
}

export default WorkoutPlanDetail;
