// src/pages/WorkoutSession.js — Evolve / minimal active session

import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Autocomplete,
  Stack,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  SkipNext,
  SkipPrevious,
  CheckCircle,
  Delete,
  Warning,
  PlayArrow,
  VideoLibrary,
  Add,
  Remove,
  Close,
  OpenInNew,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { workoutService } from '../services/api';

import ModernInput from '../components/ModernInput';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';
import { PageContainer } from '../components/design-system';
import { ev } from '../theme/evolveDarkTheme';

const PAGE_X = 'clamp(28px, 6vw, 96px)';

const monoLabel = {
  fontFamily: ev.mono,
  fontSize: 11,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: ev.chalkDim,
};

const dialogPaper = {
  sx: {
    backgroundColor: ev.ink,
    border: `1px solid ${ev.rule}`,
    borderRadius: 0,
    maxHeight: '85vh',
  },
};

function WorkoutSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const workoutPlan = location.state?.workoutPlan;

  const [editablePlan, setEditablePlan] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [loggedData, setLoggedData] = useState({});
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);
  const [manualDuration, setManualDuration] = useState(45);
  const [videoOpen, setVideoOpen] = useState(false);
  const [currentVideos, setCurrentVideos] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');

  // Elapsed session timer
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const elapsed = Math.floor((now - startedAt) / 1000);
  const hh = String(Math.floor(elapsed / 3600)).padStart(2, '0');
  const mm = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  useEffect(() => {
    if (!workoutPlan) {
      navigate('/generate-workout');
      return;
    }
    setEditablePlan(workoutPlan);
    const initialData = {};
    workoutPlan.exercises.forEach((exercise, index) => {
      const reps = parseInt(String(exercise.reps).split('-')[0]) || 8;
      let initialSet = {};
      switch (exercise.exercise_type) {
        case 'REPS_ONLY':         initialSet = { reps }; break;
        case 'DURATION':
        case 'QUALITATIVE':       initialSet = { duration_seconds: 60 }; break;
        case 'DISTANCE_DURATION': initialSet = { distance_km: 1, duration_seconds: 300 }; break;
        case 'WEIGHT_BASED':
        default:                  initialSet = { reps, weight: 0 }; break;
      }
      initialData[index] = [initialSet];
    });
    setLoggedData(initialData);
  }, [workoutPlan, navigate]);

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updatedSets = [...(loggedData[exerciseIndex] || [])];
    if (!updatedSets[setIndex]) updatedSets[setIndex] = { reps: '', weight: '' };
    updatedSets[setIndex][field] = value;
    setLoggedData({ ...loggedData, [exerciseIndex]: updatedSets });
  };

  const handleAddSet = (exerciseIndex) => {
    const sets = loggedData[exerciseIndex] || [];
    const previousSet = sets.length > 0 ? sets[sets.length - 1] : null;
    const planExercise = editablePlan.exercises[exerciseIndex];
    const newSet = {
      reps: previousSet ? previousSet.reps : (parseInt(String(planExercise.reps).split('-')[0]) || 8),
      weight: previousSet ? previousSet.weight : 0,
    };
    setLoggedData({ ...loggedData, [exerciseIndex]: [...sets, newSet] });
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updatedSets = [...(loggedData[exerciseIndex] || [])];
    updatedSets.splice(setIndex, 1);
    setLoggedData({ ...loggedData, [exerciseIndex]: updatedSets });
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < editablePlan.exercises.length - 1) setCurrentExerciseIndex(currentExerciseIndex + 1);
  };
  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) setCurrentExerciseIndex(currentExerciseIndex - 1);
  };

  const handleFinishWorkout = () => {
    const exercises_completed = editablePlan.exercises
      .map((exercise, index) => ({ name: exercise.name, sets: loggedData[index] || [] }))
      .filter((e) => e.sets.length > 0);

    if (exercises_completed.length === 0) {
      setError('Log at least one set to finish the workout.');
      return;
    }
    setError('');
    setManualDuration(Math.max(1, Math.round(elapsed / 60)));
    setDurationOpen(true);
  };

  const handleSaveWithDuration = async () => {
    setIsSubmitting(true); setError('');
    const exercises_completed = editablePlan.exercises
      .map((exercise, index) => ({
        name: exercise.name,
        exercise_type: exercise.exercise_type || 'WEIGHT_BASED',
        sets: (loggedData[index] || []).map((set) => {
          const cleanSet = {};
          switch (exercise.exercise_type) {
            case 'WEIGHT_BASED':
              cleanSet.reps = parseInt(set.reps, 10) || 0;
              cleanSet.weight = parseFloat(set.weight) || 0; break;
            case 'REPS_ONLY':
              cleanSet.reps = parseInt(set.reps, 10) || 0; break;
            case 'DURATION':
              cleanSet.duration_seconds = parseInt(set.duration_seconds, 10) || 0; break;
            case 'DISTANCE_DURATION':
              cleanSet.duration_seconds = parseInt(set.duration_seconds, 10) || 0;
              cleanSet.distance_km = parseFloat(set.distance_km) || 0; break;
            case 'QUALITATIVE':
              cleanSet.duration_seconds = parseInt(set.duration_seconds, 10) || 0;
              cleanSet.notes = set.notes || ''; break;
            default:
              cleanSet.reps = parseInt(set.reps, 10) || 0;
              cleanSet.weight = parseFloat(set.weight) || 0; break;
          }
          return cleanSet;
        }),
      }))
      .filter((e) => e.sets.length > 0);

    try {
      await workoutService.logWorkout({
        workout_plan_id: editablePlan.id,
        duration_minutes: manualDuration,
        notes,
        exercises_completed,
        workout_date: new Date().toISOString(),
      });
      setDurationOpen(false);
      navigate('/workout-history');
    } catch (err) {
      setError(err.message || 'Failed to save workout log.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveExercise = (indexToRemove) => {
    if (!editablePlan) return;
    const newExercises = editablePlan.exercises.filter((_, i) => i !== indexToRemove);
    setEditablePlan((prev) => ({ ...prev, exercises: newExercises }));
    if (currentExerciseIndex >= newExercises.length) {
      setCurrentExerciseIndex(Math.max(0, newExercises.length - 1));
    }
  };

  const handleWatchVideo = async (exerciseName) => {
    setVideoOpen(true); setVideoLoading(true);
    try {
      const details = await workoutService.getExerciseDetails(exerciseName);
      setCurrentVideos(details.videos || []);
    } catch (err) {
      console.error(err);
      setCurrentVideos([]);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleSearchChange = async (_, value) => {
    setSearchInputValue(value);
    if (value && value.length > 2) {
      setSearchLoading(true);
      try {
        const results = await workoutService.getExerciseDetails(value);
        const formatted = Array.isArray(results)
          ? results.map((r) => r.exercise).filter(Boolean)
          : (results.exercise ? [results.exercise] : []);
        setSearchOptions(formatted);
      } catch (err) {
        console.error(err);
        setSearchOptions([]);
      }
      setSearchLoading(false);
    } else {
      setSearchOptions([]);
    }
  };

  const handleSelectNewExercise = (exercise) => {
    if (exercise && exercise.name) {
      const newExerciseObject = { ...exercise, sets: exercise.sets || 1, reps: exercise.reps || '8-12' };
      setEditablePlan((prev) => ({ ...prev, exercises: [...prev.exercises, newExerciseObject] }));
      const newIndex = editablePlan.exercises.length;
      setLoggedData((prev) => ({ ...prev, [newIndex]: [{ reps: 8, weight: 0 }] }));
      setIsAddingExercise(false);
      setSearchInputValue('');
      setSearchOptions([]);
    }
  };

  const exerciseTypeLabel = (t) => ({
    WEIGHT_BASED: 'Weighted',
    REPS_ONLY: 'Reps only',
    DURATION: 'Duration',
    DISTANCE_DURATION: 'Distance · time',
    QUALITATIVE: 'Qualitative',
  })[t] || 'Exercise';

  const renderSetInputs = (exercise, exIndex, set, setIndex) => {
    switch (exercise.exercise_type) {
      case 'REPS_ONLY':
        return (
          <ModernInput
            label="Reps"
            type="number"
            value={set.reps || ''}
            onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)}
          />
        );
      case 'DURATION':
        return (
          <ModernInput
            label="Duration · seconds"
            type="number"
            value={set.duration_seconds || ''}
            onChange={(e) => handleSetChange(exIndex, setIndex, 'duration_seconds', e.target.value)}
          />
        );
      case 'DISTANCE_DURATION':
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            <ModernInput
              label="Distance · km"
              type="number"
              value={set.distance_km || ''}
              onChange={(e) => handleSetChange(exIndex, setIndex, 'distance_km', e.target.value)}
            />
            <ModernInput
              label="Duration · seconds"
              type="number"
              value={set.duration_seconds || ''}
              onChange={(e) => handleSetChange(exIndex, setIndex, 'duration_seconds', e.target.value)}
            />
          </Box>
        );
      case 'QUALITATIVE':
        return (
          <ModernInput
            label="Notes"
            value={set.notes || ''}
            onChange={(e) => handleSetChange(exIndex, setIndex, 'notes', e.target.value)}
            placeholder="e.g. vinyasa flow, focused on hips"
          />
        );
      case 'WEIGHT_BASED':
      default:
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            <ModernInput
              label="Weight · kg"
              type="number"
              value={set.weight || ''}
              onChange={(e) => handleSetChange(exIndex, setIndex, 'weight', e.target.value)}
            />
            <ModernInput
              label="Reps"
              type="number"
              value={set.reps || ''}
              onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)}
            />
          </Box>
        );
    }
  };

  if (!editablePlan) return null;

  const currentExercise = editablePlan.exercises[currentExerciseIndex];
  const currentLoggedSets = loggedData[currentExerciseIndex] || [];
  const progress = ((currentExerciseIndex + 1) / editablePlan.exercises.length) * 100;
  const totalSets = Object.values(loggedData).flat().length;

  return (
    <Box sx={{ animation: 'ev-rise .45s ease both' }}>

      {/* ============ HERO ============ */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
        alignItems: 'end',
        gap: 6,
        px: PAGE_X,
        pt: 'clamp(64px, 10vh, 120px)',
        pb: 'clamp(48px, 8vh, 96px)',
        borderBottom: `1px solid ${ev.rule}`,
      }}>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ ...monoLabel }}>Active session · live</Box>
          <Box component="h1" sx={{
            m: 0, mt: 2,
            fontFamily: ev.display,
            fontWeight: 400,
            fontSize: 'clamp(48px, 6.5vw, 96px)',
            lineHeight: 0.92,
            letterSpacing: '-0.025em',
            color: ev.chalk,
          }}>
            {editablePlan.name}<Box component="span" sx={{ color: ev.accent }}>.</Box>
          </Box>
        </Box>

        {/* Right — live timer */}
        <Box sx={{ textAlign: { md: 'right' } }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25, ...monoLabel, color: ev.chalkDim, letterSpacing: '0.24em' }}>
            <Box sx={{
              width: 7, height: 7, borderRadius: '50%',
              backgroundColor: ev.accent,
              animation: 'ev-breathe 2.4s ease-in-out infinite',
            }} />
            Elapsed
          </Box>
          <Box sx={{
            fontFamily: ev.display,
            fontSize: 'clamp(56px, 6.5vw, 96px)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: ev.chalk,
            mt: 2,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {hh}
            <Box component="span" sx={{ color: ev.chalkMute, animation: 'ev-blink 1s steps(2,end) infinite' }}>:</Box>
            {mm}
            <Box component="span" sx={{ color: ev.chalkMute, animation: 'ev-blink 1s steps(2,end) infinite' }}>:</Box>
            {ss}
          </Box>
        </Box>
      </Box>

      {/* ============ PROGRESS STRIP ============ */}
      <Box sx={{ px: PAGE_X, pt: 5, pb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', ...monoLabel, color: ev.chalkMute, mb: 2 }}>
          <Box>Exercise <Box component="b" sx={{ color: ev.chalk, fontWeight: 500 }}>{String(currentExerciseIndex + 1).padStart(2, '0')}</Box> / {String(editablePlan.exercises.length).padStart(2, '0')}</Box>
          <Box>{totalSets} sets logged · {Math.round(progress)}%</Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: '1px',
            backgroundColor: ev.rule,
            '& .MuiLinearProgress-bar': { backgroundColor: ev.accent },
          }}
        />
      </Box>

      {error && (
        <Box sx={{ px: PAGE_X, pb: 3 }}>
          <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
        </Box>
      )}

      {/* ============ MAIN ============ */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1.6fr 1fr' },
        borderTop: `1px solid ${ev.rule}`,
      }}>
        {/* LEFT — current exercise */}
        <Box sx={{
          px: PAGE_X,
          py: 6,
          borderRight: { lg: `1px solid ${ev.rule}` },
          borderBottom: { xs: `1px solid ${ev.rule}`, lg: 'none' },
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Box sx={{ ...monoLabel }}>
              {String(currentExerciseIndex + 1).padStart(2, '0')} · {exerciseTypeLabel(currentExercise.exercise_type)}
            </Box>
            <SecondaryButton size="small" onClick={() => handleWatchVideo(currentExercise.name)} startIcon={<VideoLibrary />}>
              Watch demo
            </SecondaryButton>
          </Box>
          <Box sx={{
            mt: 2,
            fontFamily: ev.display,
            fontSize: 'clamp(36px, 4.5vw, 64px)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: ev.chalk,
          }}>
            {currentExercise.name}
          </Box>
          {currentExercise.reps && (
            <Box sx={{ ...monoLabel, mt: 2 }}>
              Target · {currentExercise.reps} reps
            </Box>
          )}

          {/* Sets */}
          <Box sx={{ mt: 6 }}>
            <Box sx={{ ...monoLabel, mb: 3 }}>Performance</Box>
            <Stack spacing={0}>
              {currentLoggedSets.map((set, setIndex) => (
                <Box key={setIndex} sx={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr auto',
                  gap: 4,
                  alignItems: 'center',
                  py: 3.5,
                  borderTop: `1px solid ${ev.rule}`,
                  '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
                }}>
                  <Box sx={{
                    fontFamily: ev.display,
                    fontSize: 28,
                    color: ev.chalk,
                    letterSpacing: '-0.01em',
                    lineHeight: 1,
                  }}>
                    {String(setIndex + 1).padStart(2, '0')}
                  </Box>
                  {renderSetInputs(currentExercise, currentExerciseIndex, set, setIndex)}
                  <IconButton size="small" onClick={() => handleRemoveSet(currentExerciseIndex, setIndex)} sx={{ color: ev.chalkMute, '&:hover': { color: ev.warn } }}>
                    <Remove fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              {currentLoggedSets.length === 0 && (
                <Box sx={{ py: 6, textAlign: 'center', borderTop: `1px solid ${ev.rule}`, borderBottom: `1px solid ${ev.rule}` }}>
                  <Box sx={{ fontFamily: ev.display, fontSize: 24, color: ev.chalk }}>No sets logged</Box>
                  <Box sx={{ ...monoLabel, mt: 1.5 }}>Tap "Add set" to begin</Box>
                </Box>
              )}
            </Stack>

            <Box sx={{ mt: 4 }}>
              <PrimaryButton onClick={() => handleAddSet(currentExerciseIndex)} startIcon={<Add />} fullWidth>
                Add set
              </PrimaryButton>
            </Box>
          </Box>

          {/* Navigation */}
          <Box sx={{ mt: 6, pt: 5, borderTop: `1px solid ${ev.rule}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <SecondaryButton onClick={handlePrevExercise} disabled={currentExerciseIndex === 0} startIcon={<SkipPrevious />}>
              Previous
            </SecondaryButton>
            <Box sx={monoLabel}>{currentExerciseIndex + 1} of {editablePlan.exercises.length}</Box>
            <SecondaryButton onClick={handleNextExercise} disabled={currentExerciseIndex === editablePlan.exercises.length - 1} endIcon={<SkipNext />}>
              Next
            </SecondaryButton>
          </Box>
        </Box>

        {/* RIGHT — plan + notes + actions */}
        <Box sx={{ px: PAGE_X, py: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 4 }}>
            <Box sx={monoLabel}>Plan · all movements</Box>
            <Box
              onClick={() => setIsAddingExercise((v) => !v)}
              sx={{ cursor: 'pointer', ...monoLabel, color: ev.chalkDim, '&:hover': { color: ev.accent } }}
            >
              {isAddingExercise ? 'Cancel' : '+ Add exercise'}
            </Box>
          </Box>

          {isAddingExercise && (
            <Box sx={{ mb: 4 }}>
              <Autocomplete
                options={searchOptions}
                loading={searchLoading}
                inputValue={searchInputValue}
                getOptionLabel={(o) => o.name || ''}
                onInputChange={handleSearchChange}
                onChange={(_, v) => handleSelectNewExercise(v)}
                renderInput={(params) => (
                  <ModernInput
                    {...params}
                    label="Search exercise library"
                    placeholder="Type to search"
                  />
                )}
              />
            </Box>
          )}

          <Stack spacing={0}>
            {editablePlan.exercises.map((exercise, index) => {
              const active = index === currentExerciseIndex;
              const hasLogged = (loggedData[index] || []).length > 0;
              return (
                <Box
                  key={index}
                  onClick={() => setCurrentExerciseIndex(index)}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '36px 1fr auto auto',
                    gap: 2,
                    alignItems: 'baseline',
                    py: 2.5,
                    borderTop: `1px solid ${ev.rule}`,
                    '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
                    cursor: 'pointer',
                    transition: 'background-color .15s ease',
                    backgroundColor: active ? ev.ink2 : 'transparent',
                    '&:hover': { backgroundColor: ev.ruleSoft },
                  }}
                >
                  <Box sx={{ ...monoLabel, color: active ? ev.accent : ev.chalkMute }}>
                    {String(index + 1).padStart(2, '0')}
                  </Box>
                  <Box sx={{
                    fontFamily: ev.display,
                    fontSize: 16,
                    color: active ? ev.chalk : (hasLogged ? ev.chalkDim : ev.chalk),
                    letterSpacing: '-0.005em',
                    textDecoration: hasLogged && !active ? 'line-through' : 'none',
                    textDecorationColor: ev.chalkMute,
                  }}>
                    {exercise.name}
                  </Box>
                  <Box sx={{ ...monoLabel, color: hasLogged ? ev.accent : ev.chalkMute }}>
                    {hasLogged ? '✓' : '·'}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); handleRemoveExercise(index); }}
                    sx={{ color: ev.chalkMute, '&:hover': { color: ev.warn } }}
                  >
                    <Delete sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              );
            })}
          </Stack>

          <Box sx={{ mt: 6 }}>
            <Box sx={{ ...monoLabel, mb: 3 }}>Session notes</Box>
            <ModernInput
              label="Notes (optional)"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it feel? Anything to remember next time?"
            />
          </Box>

          <Box sx={{ mt: 6, pt: 5, borderTop: `1px solid ${ev.rule}` }}>
            <Stack spacing={2}>
              <PrimaryButton onClick={handleFinishWorkout} disabled={isSubmitting} startIcon={<CheckCircle />} size="large" fullWidth>
                {isSubmitting ? 'Saving' : 'Finish & log workout'}
              </PrimaryButton>
              <SecondaryButton onClick={() => setShowQuitDialog(true)} startIcon={<Warning />} fullWidth sx={{ color: ev.warn, borderColor: ev.rule, '&:hover': { color: ev.warn, borderColor: ev.warn } }}>
                Cancel session
              </SecondaryButton>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* ============ DIALOGS ============ */}
      <Dialog open={showQuitDialog} onClose={() => setShowQuitDialog(false)} maxWidth="sm" fullWidth PaperProps={dialogPaper}>
        <DialogTitle sx={{ p: 4, borderBottom: `1px solid ${ev.rule}` }}>
          <Box sx={monoLabel}>Confirm</Box>
          <Box sx={{ fontFamily: ev.display, fontSize: 36, color: ev.chalk, letterSpacing: '-0.015em', mt: 1 }}>Cancel session?</Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ color: ev.chalkDim, fontSize: 15, lineHeight: 1.55, fontWeight: 400 }}>
            Logged data for this session will be lost. This cannot be undone.
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: `1px solid ${ev.rule}`, gap: 1.5 }}>
          <SecondaryButton onClick={() => setShowQuitDialog(false)}>Continue session</SecondaryButton>
          <PrimaryButton onClick={() => navigate('/')} sx={{ backgroundColor: ev.warn, borderColor: ev.warn, color: ev.ink, '&:hover': { backgroundColor: ev.warn, opacity: 0.85 } }}>
            Yes, cancel
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      <Dialog open={durationOpen} onClose={() => setDurationOpen(false)} maxWidth="sm" fullWidth PaperProps={dialogPaper}>
        <DialogTitle sx={{ p: 4, borderBottom: `1px solid ${ev.rule}` }}>
          <Box sx={monoLabel}>Step 02 · final</Box>
          <Box sx={{ fontFamily: ev.display, fontSize: 36, color: ev.chalk, letterSpacing: '-0.015em', mt: 1 }}>Confirm duration</Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          <Box sx={{ color: ev.chalkDim, fontSize: 15, lineHeight: 1.55, fontWeight: 400, mb: 4 }}>
            Total session duration in minutes (pre-filled from your live timer).
          </Box>
          <ModernInput
            label="Duration · minutes"
            type="number"
            value={manualDuration}
            onChange={(e) => setManualDuration(parseInt(e.target.value, 10) || 0)}
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: `1px solid ${ev.rule}`, gap: 1.5 }}>
          <SecondaryButton onClick={() => setDurationOpen(false)}>Back</SecondaryButton>
          <PrimaryButton onClick={handleSaveWithDuration} loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Saving' : 'Save workout'}
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      <Dialog open={videoOpen} onClose={() => setVideoOpen(false)} fullWidth maxWidth="md" PaperProps={dialogPaper}>
        <DialogTitle sx={{ p: 4, borderBottom: `1px solid ${ev.rule}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Box sx={monoLabel}>Demonstrations</Box>
            <Box sx={{ fontFamily: ev.display, fontSize: 28, color: ev.chalk, letterSpacing: '-0.015em', mt: 1 }}>
              {currentExercise?.name}
            </Box>
          </Box>
          <IconButton onClick={() => setVideoOpen(false)} sx={{ color: ev.chalkDim }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {videoLoading ? (
            <Box sx={{ py: 6 }}>
              <LinearProgress sx={{ height: '1px', backgroundColor: ev.rule, '& .MuiLinearProgress-bar': { backgroundColor: ev.accent } }} />
            </Box>
          ) : currentVideos.length > 0 ? (
            <Grid container spacing={2}>
              {currentVideos.map((video, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box
                    onClick={() => (video.youtube_url || video.url) && window.open(video.youtube_url || video.url, '_blank')}
                    sx={{
                      cursor: 'pointer',
                      border: `1px solid ${ev.rule}`,
                      transition: 'border-color .2s ease',
                      '&:hover': { borderColor: ev.chalkMute, '& .play-overlay': { opacity: 1 } },
                    }}
                  >
                    {video.thumbnail_url && (
                      <Box sx={{ position: 'relative' }}>
                        <Box component="img" src={video.thumbnail_url} alt={video.title || `Video ${index + 1}`} sx={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                        <Box className="play-overlay" sx={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'grid', placeItems: 'center', opacity: 0, transition: 'opacity .2s ease' }}>
                          <PlayArrow sx={{ fontSize: 48, color: ev.accent }} />
                        </Box>
                      </Box>
                    )}
                    <Box sx={{ p: 2 }}>
                      <Box sx={{ fontFamily: ev.body, fontSize: 14, color: ev.chalk, fontWeight: 500 }}>{video.title || `Video ${index + 1}`}</Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Box sx={{ fontFamily: ev.display, fontSize: 24, color: ev.chalk }}>No videos found</Box>
              <Box sx={{ ...monoLabel, mt: 1.5 }}>Demonstrations are not available for this exercise</Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: `1px solid ${ev.rule}` }}>
          <SecondaryButton onClick={() => setVideoOpen(false)} endIcon={<OpenInNew sx={{ fontSize: 14 }} />}>Close</SecondaryButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default WorkoutSession;
