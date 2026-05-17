// src/pages/FreestyleLog.js — Evolve / minimal freestyle logger

import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  Tooltip,
} from '@mui/material';
import { Delete, CheckCircle, Add, Remove, Mic, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { workoutService } from '../services/api';
import ModernInput from '../components/ModernInput';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';
import { PageContainer } from '../components/design-system';
import VoiceWorkoutLogger from '../components/VoiceWorkoutLogger';
import { ev } from '../theme/evolveDarkTheme';

const mono = { fontFamily: ev.mono };
const display = { fontFamily: ev.display };
const monoLabel = { ...mono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: ev.chalkDim };

const dialogPaper = {
  sx: { backgroundColor: ev.ink, border: `1px solid ${ev.rule}`, borderRadius: 0 },
};

const exerciseTypeLabel = (t) => ({
  WEIGHT_BASED: 'Weighted',
  REPS_ONLY: 'Reps only',
  DURATION: 'Duration',
  DISTANCE_DURATION: 'Distance · time',
  QUALITATIVE: 'Qualitative',
}[t] || 'Exercise');

function FreestyleLog() {
  const navigate = useNavigate();

  const [loggedExercises, setLoggedExercises] = useState([]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);
  const [manualDuration, setManualDuration] = useState(45);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [voiceOpen, setVoiceOpen] = useState(false);

  const handleSearchChange = async (_, value) => {
    setInputValue(value);
    if (value && value.length > 2) {
      setSearchLoading(true);
      try {
        const results = await workoutService.getExerciseDetails(value);
        const formatted = Array.isArray(results)
          ? results.map((r) => r.exercise).filter(Boolean)
          : (results.exercise ? [results.exercise] : []);
        setOptions(formatted);
      } catch (err) {
        console.error(err);
        setOptions([]);
      }
      setSearchLoading(false);
    } else {
      setOptions([]);
    }
  };

  const handleAddExercise = (exercise) => {
    if (exercise && exercise.name && !loggedExercises.some((ex) => ex.name === exercise.name)) {
      let initialSet = {};
      switch (exercise.exercise_type) {
        case 'REPS_ONLY':         initialSet = { reps: 8 }; break;
        case 'DURATION':
        case 'QUALITATIVE':       initialSet = { duration_seconds: 60 }; break;
        case 'DISTANCE_DURATION': initialSet = { distance_km: 1, duration_seconds: 300 }; break;
        case 'WEIGHT_BASED':
        default:                  initialSet = { reps: 8, weight: 0 }; break;
      }
      setLoggedExercises([...loggedExercises, { ...exercise, sets: [initialSet] }]);
      setInputValue('');
      setOptions([]);
    }
  };

  const handleVoiceExerciseLogged = (parsedCommand) => {
    const idx = loggedExercises.findIndex(
      (ex) => ex.name.toLowerCase() === parsedCommand.exercise.toLowerCase()
    );
    if (idx >= 0) {
      const updated = [...loggedExercises];
      updated[idx].sets.push(parsedCommand.sets[0]);
      setLoggedExercises(updated);
    } else {
      setLoggedExercises([...loggedExercises, {
        name: parsedCommand.exercise,
        exercise_type: parsedCommand.exercise_type,
        sets: parsedCommand.sets,
      }]);
    }
  };

  const handleAddSet = (exerciseIndex) => {
    const updated = [...loggedExercises];
    const sets = updated[exerciseIndex].sets;
    const prev = sets[sets.length - 1] || sets[0];
    updated[exerciseIndex].sets.push({ ...prev });
    setLoggedExercises(updated);
  };

  const handleRemoveExercise = (exerciseIndex) => {
    const updated = [...loggedExercises];
    updated.splice(exerciseIndex, 1);
    setLoggedExercises(updated);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updated = [...loggedExercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setLoggedExercises(updated);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updated = [...loggedExercises];
    updated[exerciseIndex].sets.splice(setIndex, 1);
    setLoggedExercises(updated);
  };

  const handleFinishWorkout = () => {
    if (loggedExercises.length === 0) {
      setError('Add at least one exercise before finishing.');
      return;
    }
    setError('');
    setDurationOpen(true);
  };

  const handleSaveWithDuration = async () => {
    setIsSubmitting(true); setError('');
    const exercises_completed = loggedExercises.map((ex) => ({
      name: ex.name,
      exercise_type: ex.exercise_type,
      sets: ex.sets.map((set) => {
        const cleanSet = {};
        switch (ex.exercise_type) {
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
          default: break;
        }
        return cleanSet;
      }),
    })).filter((ex) => ex.sets.length > 0);

    try {
      await workoutService.logWorkout({
        duration_minutes: manualDuration,
        notes,
        exercises_completed,
        workout_date: new Date().toISOString(),
      });
      setDurationOpen(false);
      navigate('/workout-history');
    } catch (err) {
      setError(err.message || 'Failed to save workout log.');
      setIsSubmitting(false);
    }
  };

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

  const totalSets = loggedExercises.reduce((sum, ex) => sum + ex.sets.length, 0);

  return (
    <PageContainer
      title="Log"
      subtitle="Manual entry for sessions you tracked on your own. Add exercises, log sets, save the workout."
    >
      {error && !durationOpen && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 4 }}>{error}</Alert>}

      {/* ============ ADD EXERCISE ============ */}
      <Box sx={{ borderTop: `1px solid ${ev.rule}`, borderBottom: `1px solid ${ev.rule}`, py: 5, mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, gap: 3, flexWrap: 'wrap' }}>
          <Box>
            <Box sx={monoLabel}>01 · Add exercise</Box>
            <Box sx={{ ...display, fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.015em', color: ev.chalk, mt: 1.5 }}>
              Search the <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>library</Box>
            </Box>
          </Box>
          <Tooltip title="Voice logging — hands free" placement="left">
            <IconButton
              onClick={() => setVoiceOpen(true)}
              sx={{
                border: `1px solid ${ev.rule}`,
                color: ev.chalk,
                borderRadius: 0,
                p: 1.5,
                '&:hover': { borderColor: ev.accent, color: ev.accent },
              }}
            >
              <Mic />
            </IconButton>
          </Tooltip>
        </Box>

        <Autocomplete
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          options={options}
          loading={searchLoading}
          inputValue={inputValue}
          onInputChange={handleSearchChange}
          getOptionLabel={(option) => option.name || ''}
          onChange={(_, v) => handleAddExercise(v)}
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 2,
              alignItems: 'baseline',
              py: 2,
              px: 0,
              borderBottom: `1px solid ${ev.rule}`,
              '&:hover': { backgroundColor: ev.ruleSoft },
              '&:last-of-type': { borderBottom: 'none' },
            }}>
              <Box>
                <Box sx={{ ...display, fontSize: 18, color: ev.chalk, letterSpacing: '-0.005em' }}>
                  {option.name}
                </Box>
              </Box>
              <Box sx={monoLabel}>
                {exerciseTypeLabel(option.exercise_type)}
              </Box>
            </Box>
          )}
          renderInput={(params) => (
            <ModernInput
              {...params}
              label="Type to search"
              placeholder="e.g. bench press, deadlift, squat"
            />
          )}
        />
      </Box>

      {/* ============ EMPTY STATE ============ */}
      {loggedExercises.length === 0 && (
        <Box sx={{ py: '80px', borderTop: `1px solid ${ev.rule}`, borderBottom: `1px solid ${ev.rule}`, textAlign: 'center' }}>
          <Box sx={{ ...display, fontSize: 32, color: ev.chalk, letterSpacing: '-0.015em' }}>
            Empty<Box component="span" sx={{ color: ev.accent }}>.</Box>
          </Box>
          <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: 2 }}>
            Search the library above to add your first exercise
          </Box>
        </Box>
      )}

      {/* ============ LOGGED EXERCISES ============ */}
      {loggedExercises.length > 0 && (
        <Box>
          <Box sx={{ ...monoLabel, mb: 3 }}>
            02 · Sets · {loggedExercises.length} exercise{loggedExercises.length !== 1 ? 's' : ''} · {totalSets} set{totalSets !== 1 ? 's' : ''}
          </Box>

          {loggedExercises.map((exercise, exIndex) => (
            <Box key={exIndex} sx={{
              borderTop: `1px solid ${ev.rule}`,
              '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
              py: 5,
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                  <Box sx={monoLabel}>
                    {String(exIndex + 1).padStart(2, '0')} · {exerciseTypeLabel(exercise.exercise_type)}
                  </Box>
                  <Box sx={{ ...display, fontSize: 'clamp(26px, 2.6vw, 36px)', letterSpacing: '-0.015em', color: ev.chalk, mt: 1.5, lineHeight: 1.1 }}>
                    {exercise.name}
                  </Box>
                </Box>
                <IconButton
                  onClick={() => handleRemoveExercise(exIndex)}
                  sx={{ color: ev.chalkMute, '&:hover': { color: ev.warn } }}
                >
                  <Delete />
                </IconButton>
              </Box>

              <Box>
                {exercise.sets.map((set, setIndex) => (
                  <Box key={setIndex} sx={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr auto',
                    gap: 4,
                    alignItems: 'center',
                    py: 3,
                    borderTop: `1px solid ${ev.rule}`,
                    '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
                  }}>
                    <Box sx={{ ...display, fontSize: 24, color: ev.chalk, letterSpacing: '-0.01em', lineHeight: 1 }}>
                      {String(setIndex + 1).padStart(2, '0')}
                    </Box>
                    {renderSetInputs(exercise, exIndex, set, setIndex)}
                    {exercise.sets.length > 1 ? (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveSet(exIndex, setIndex)}
                        sx={{ color: ev.chalkMute, '&:hover': { color: ev.warn } }}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                    ) : <Box sx={{ width: 32 }} />}
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 3 }}>
                <SecondaryButton onClick={() => handleAddSet(exIndex)} startIcon={<Add />} fullWidth>
                  Add set
                </SecondaryButton>
              </Box>
            </Box>
          ))}

          {/* ============ NOTES ============ */}
          <Box sx={{ mt: 6, pt: 5, borderTop: `1px solid ${ev.rule}` }}>
            <Box sx={{ ...monoLabel, mb: 3 }}>03 · Notes</Box>
            <ModernInput
              label="Session notes (optional)"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it feel? Anything to remember?"
            />
          </Box>

          {/* ============ FINISH ============ */}
          <Box sx={{ mt: 6, pt: 5, borderTop: `1px solid ${ev.rule}` }}>
            <PrimaryButton
              onClick={handleFinishWorkout}
              disabled={isSubmitting || loggedExercises.length === 0}
              size="large"
              startIcon={<CheckCircle />}
              fullWidth
            >
              {isSubmitting ? 'Saving' : 'Finish & log workout'}
            </PrimaryButton>
          </Box>
        </Box>
      )}

      {/* ============ DURATION DIALOG ============ */}
      <Dialog open={durationOpen} onClose={() => setDurationOpen(false)} maxWidth="sm" fullWidth PaperProps={dialogPaper}>
        <DialogTitle sx={{ p: 4, borderBottom: `1px solid ${ev.rule}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Box sx={monoLabel}>Final step</Box>
            <Box sx={{ ...display, fontSize: 32, color: ev.chalk, letterSpacing: '-0.015em', mt: 1 }}>Confirm duration</Box>
          </Box>
          <IconButton onClick={() => setDurationOpen(false)} sx={{ color: ev.chalkDim }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          <Box sx={{ color: ev.chalkDim, fontSize: 15, lineHeight: 1.55, mb: 4 }}>
            Total duration of this workout in minutes.
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

      <VoiceWorkoutLogger
        isOpen={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onExerciseLogged={handleVoiceExerciseLogged}
      />
    </PageContainer>
  );
}

export default FreestyleLog;
