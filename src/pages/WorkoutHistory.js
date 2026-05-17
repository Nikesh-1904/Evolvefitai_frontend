// src/pages/WorkoutHistory.js — Evolve / minimal history + plans

import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { PageContainer } from '../components/design-system';
import { LoadingSpinner } from '../components/design-system/Loading';
import { useWorkoutPlans, useWorkoutLogs } from '../hooks/useWorkouts';
import { SecondaryButton } from '../components/ModernButton';
import { ev } from '../theme/evolveDarkTheme';

const mono = { fontFamily: ev.mono };
const display = { fontFamily: ev.display };

const monoLabel = { ...mono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: ev.chalkDim };
const monoMeta  = { ...mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: ev.chalkDim };

const dialogPaper = {
  sx: {
    backgroundColor: ev.ink,
    border: `1px solid ${ev.rule}`,
    borderRadius: 0,
    maxHeight: '85vh',
  },
};

function StatCell({ index, label, value, unit, isLast, isFirst }) {
  return (
    <Box
      sx={{
        py: '40px',
        px: { xs: 3, md: '36px' },
        pl: { md: isFirst ? 0 : '36px' },
        pr: { md: isLast ? 0 : '36px' },
        borderRight: { md: isLast ? 'none' : `1px solid ${ev.rule}` },
        borderBottom: { xs: isLast ? 'none' : `1px solid ${ev.rule}`, md: 'none' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Box sx={monoLabel}>{label}</Box>
        <Box sx={{ ...monoLabel, color: ev.chalkMute }}>{String(index).padStart(2, '0')}</Box>
      </Box>
      <Box sx={{ ...display, fontSize: 'clamp(40px, 4.5vw, 60px)', lineHeight: 0.95, letterSpacing: '-0.025em', color: ev.chalk, mt: '24px' }}>
        {value}
        {unit && (
          <Box component="span" sx={{ ...mono, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: ev.chalkMute, ml: '6px' }}>
            {unit}
          </Box>
        )}
      </Box>
    </Box>
  );
}

const formatSetDisplay = (set, exerciseType) => {
  switch (exerciseType) {
    case 'WEIGHT_BASED':       return `${set.weight}kg × ${set.reps}`;
    case 'REPS_ONLY':          return `${set.reps} reps`;
    case 'DURATION':           return `${set.duration_seconds}s`;
    case 'DISTANCE_DURATION':  return `${set.distance_km}km in ${set.duration_seconds}s`;
    case 'QUALITATIVE':        return set.notes || `${set.duration_seconds}s`;
    default:                   return `${set.weight || 0}kg × ${set.reps || 0}`;
  }
};

function WorkoutHistory() {
  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [tab, setTab] = useState(0);

  const { data: workoutLogs, loading: logsLoading } = useWorkoutLogs();
  const { data: workoutPlans, loading: plansLoading } = useWorkoutPlans();

  const loading = logsLoading || plansLoading;
  const workouts = workoutLogs || [];

  const totalHours = Math.round(workouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0) / 60);
  const aiGeneratedCount = (workoutPlans || []).filter((p) => p.ai_generated).length;
  const thisWeekWorkouts = workouts.filter((w) => {
    const d = new Date(w.workout_date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  }).length;

  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.workout_date) - new Date(a.workout_date));
  const sortedPlans = [...(workoutPlans || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (loading) return <LoadingSpinner fullScreen message="Loading history" />;

  return (
    <PageContainer
      title="History"
      subtitle="Every session you've logged. Every plan you've built. A complete record of what you've actually done."
    >
      {/* ============ STATS ============ */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, borderTop: `1px solid ${ev.rule}`, borderBottom: `1px solid ${ev.rule}`, mb: 6 }}>
        <StatCell index={1} label="Sessions logged" value={workouts.length}            isFirst />
        <StatCell index={2} label="Total time"      value={totalHours}                 unit="hr" />
        <StatCell index={3} label="Active plans"    value={(workoutPlans || []).length} />
        <StatCell index={4} label="AI generated"    value={aiGeneratedCount}            isLast />
      </Box>

      {/* ============ TABS ============ */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          borderBottom: `1px solid ${ev.rule}`,
          minHeight: 'auto',
          mb: 4,
          '& .MuiTabs-indicator': { backgroundColor: ev.accent, height: '1px' },
          '& .MuiTab-root': {
            ...mono,
            fontSize: 11,
            letterSpacing: '0.18em',
            color: ev.chalkMute,
            minHeight: 'auto',
            py: 2.5,
            px: 0,
            mr: 5,
            '&.Mui-selected': { color: ev.chalk },
          },
        }}
      >
        <Tab label="Sessions" />
        <Tab label="Plans" />
      </Tabs>

      {/* ============ SESSIONS TAB ============ */}
      {tab === 0 && (
        <Box>
          <Box sx={{ ...monoLabel, mb: 4 }}>
            {workouts.length} total · <Box component="b" sx={{ color: ev.chalk, fontWeight: 500 }}>{thisWeekWorkouts}</Box> this week
          </Box>

          {sortedWorkouts.length === 0 ? (
            <Box sx={{ py: '64px', borderTop: `1px solid ${ev.rule}`, borderBottom: `1px solid ${ev.rule}`, textAlign: 'center' }}>
              <Box sx={{ ...display, fontSize: 28, color: ev.chalk }}>Nothing logged yet</Box>
              <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: 1.5 }}>Your sessions will appear here once you log them</Box>
              <Box
                onClick={() => navigate('/log-workout')}
                sx={{
                  display: 'inline-flex',
                  mt: 4,
                  cursor: 'pointer',
                  ...mono,
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: ev.chalk,
                  borderBottom: `1px solid ${ev.chalk}`,
                  pb: '4px',
                  '&:hover': { color: ev.accent, borderColor: ev.accent },
                }}
              >
                Log a workout ↗
              </Box>
            </Box>
          ) : (
            <Box>
              {sortedWorkouts.map((w, i) => {
                const exerciseCount = w.exercises_completed?.length || 0;
                const setCount = w.exercises_completed?.reduce((s, ex) => s + (ex.sets?.length || 0), 0) || 0;
                return (
                  <Box
                    key={i}
                    onClick={() => setSelectedWorkout(w)}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '30px 1fr auto', md: '40px 1fr 120px 120px 120px 24px' },
                      gap: '28px',
                      alignItems: 'baseline',
                      py: '28px',
                      borderTop: `1px solid ${ev.rule}`,
                      '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
                      cursor: 'pointer',
                      transition: 'padding-left .2s ease',
                      '&:hover': { pl: '12px', '& .row-arrow': { color: ev.accent } },
                    }}
                  >
                    <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>
                      {String(i + 1).padStart(2, '0')}
                    </Box>
                    <Box>
                      <Box sx={{ ...display, fontSize: 'clamp(22px, 2.2vw, 28px)', letterSpacing: '-0.01em', color: ev.chalk, lineHeight: 1.1 }}>
                        {new Date(w.workout_date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}
                      </Box>
                      <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: '8px' }}>
                        {new Date(w.workout_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </Box>
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'block' }, ...mono, fontSize: 13, color: ev.chalkDim, textAlign: 'right' }}>
                      {w.duration_minutes || '—'} <Box component="span" sx={{ color: ev.chalkMute }}>min</Box>
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'block' }, ...mono, fontSize: 13, color: ev.chalkDim, textAlign: 'right' }}>
                      {exerciseCount} <Box component="span" sx={{ color: ev.chalkMute }}>movements</Box>
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'block' }, ...mono, fontSize: 13, color: ev.chalkDim, textAlign: 'right' }}>
                      {setCount} <Box component="span" sx={{ color: ev.chalkMute }}>sets</Box>
                    </Box>
                    <Box className="row-arrow" sx={{ ...display, fontSize: 18, fontStyle: 'italic', color: ev.chalkMute, justifySelf: 'end' }}>↗</Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      )}

      {/* ============ PLANS TAB ============ */}
      {tab === 1 && (
        <Box>
          <Box sx={{ ...monoLabel, mb: 4 }}>
            {(workoutPlans || []).length} total · <Box component="b" sx={{ color: ev.chalk, fontWeight: 500 }}>{aiGeneratedCount}</Box> AI generated
          </Box>

          {sortedPlans.length === 0 ? (
            <Box sx={{ py: '64px', borderTop: `1px solid ${ev.rule}`, borderBottom: `1px solid ${ev.rule}`, textAlign: 'center' }}>
              <Box sx={{ ...display, fontSize: 28, color: ev.chalk }}>No plans yet</Box>
              <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: 1.5 }}>Generate your first plan to get started</Box>
              <Box
                onClick={() => navigate('/generate-workout')}
                sx={{
                  display: 'inline-flex',
                  mt: 4,
                  cursor: 'pointer',
                  ...mono,
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: ev.chalk,
                  borderBottom: `1px solid ${ev.chalk}`,
                  pb: '4px',
                  '&:hover': { color: ev.accent, borderColor: ev.accent },
                }}
              >
                Generate plan ↗
              </Box>
            </Box>
          ) : (
            <Box>
              {sortedPlans.map((plan, i) => (
                <Box
                  key={plan.id}
                  onClick={() => navigate(`/workout-plan/${plan.id}`)}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '30px 1fr auto', md: '40px 1fr 120px 120px 24px' },
                    gap: '28px',
                    alignItems: 'baseline',
                    py: '28px',
                    borderTop: `1px solid ${ev.rule}`,
                    '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
                    cursor: 'pointer',
                    transition: 'padding-left .2s ease',
                    '&:hover': { pl: '12px', '& .row-arrow': { color: ev.accent } },
                  }}
                >
                  <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>
                    {String(i + 1).padStart(2, '0')}
                  </Box>
                  <Box>
                    <Box sx={{ ...display, fontSize: 'clamp(22px, 2.2vw, 28px)', letterSpacing: '-0.01em', color: ev.chalk, lineHeight: 1.1 }}>
                      {plan.name}
                    </Box>
                    <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: '8px' }}>
                      {plan.ai_generated ? 'AI generated' : 'Manual plan'} · created {new Date(plan.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </Box>
                  </Box>
                  <Box sx={{ display: { xs: 'none', md: 'block' }, ...mono, fontSize: 13, color: ev.chalkDim, textAlign: 'right' }}>
                    {plan.estimated_duration || 45} <Box component="span" sx={{ color: ev.chalkMute }}>min</Box>
                  </Box>
                  <Box sx={{ display: { xs: 'none', md: 'block' }, ...mono, fontSize: 13, color: ev.chalkDim, textAlign: 'right' }}>
                    {plan.exercises?.length || 0} <Box component="span" sx={{ color: ev.chalkMute }}>movements</Box>
                  </Box>
                  <Box className="row-arrow" sx={{ ...display, fontSize: 18, fontStyle: 'italic', color: ev.chalkMute, justifySelf: 'end' }}>↗</Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* ============ WORKOUT DETAIL DIALOG ============ */}
      {selectedWorkout && (
        <Dialog open={!!selectedWorkout} onClose={() => setSelectedWorkout(null)} fullWidth maxWidth="md" PaperProps={dialogPaper}>
          <DialogTitle sx={{ p: 4, borderBottom: `1px solid ${ev.rule}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Box sx={monoLabel}>Session log</Box>
              <Box sx={{ ...display, fontSize: 32, color: ev.chalk, letterSpacing: '-0.015em', mt: 1 }}>
                {new Date(selectedWorkout.workout_date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
              </Box>
              <Box sx={{ ...monoMeta, mt: 1 }}>
                {new Date(selectedWorkout.workout_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                {selectedWorkout.duration_minutes && ` · ${selectedWorkout.duration_minutes} min`}
              </Box>
            </Box>
            <IconButton onClick={() => setSelectedWorkout(null)} sx={{ color: ev.chalkDim }}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 4 }}>
            {selectedWorkout.exercises_completed?.length > 0 ? (
              <Box>
                <Box sx={{ ...monoLabel, mb: 3 }}>Exercises completed</Box>
                {selectedWorkout.exercises_completed.map((exercise, i) => (
                  <Box key={i} sx={{
                    display: 'grid',
                    gridTemplateColumns: '36px 1fr',
                    gap: 3,
                    alignItems: 'baseline',
                    py: 3,
                    borderTop: `1px solid ${ev.rule}`,
                    '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
                  }}>
                    <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>
                      {String(i + 1).padStart(2, '0')}
                    </Box>
                    <Box>
                      <Box sx={{ ...display, fontSize: 22, letterSpacing: '-0.01em', color: ev.chalk }}>
                        {exercise.name || `Exercise ${i + 1}`}
                      </Box>
                      {exercise.sets?.length > 0 && (
                        <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 2, ...mono, fontSize: 12, color: ev.chalkDim }}>
                          {exercise.sets.map((set, si) => (
                            <Box key={si}>
                              <Box component="span" sx={{ color: ev.chalkMute }}>{String(si + 1).padStart(2, '0')}</Box>{' '}
                              <Box component="span" sx={{ color: ev.chalk }}>{formatSetDisplay(set, exercise.exercise_type)}</Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ ...monoLabel, color: ev.chalkMute }}>No exercises recorded</Box>
            )}

            {selectedWorkout.notes && (
              <Box sx={{ mt: 5, pt: 4, borderTop: `1px solid ${ev.rule}` }}>
                <Box sx={{ ...monoLabel, mb: 2 }}>Session notes</Box>
                <Box sx={{ ...display, fontStyle: 'italic', fontSize: 20, lineHeight: 1.4, color: ev.chalk, maxWidth: '40ch' }}>
                  "{selectedWorkout.notes}"
                </Box>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 3, borderTop: `1px solid ${ev.rule}` }}>
            <SecondaryButton onClick={() => setSelectedWorkout(null)}>Close</SecondaryButton>
          </DialogActions>
        </Dialog>
      )}
    </PageContainer>
  );
}

export default WorkoutHistory;
