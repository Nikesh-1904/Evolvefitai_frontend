// src/pages/WorkoutGenerator.js — Evolve / minimal generator

import React, { useState } from 'react';
import {
  Box,
  Grid,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
} from '@mui/material';
import {
  PlayArrow,
  VideoLibrary,
  ThumbUp,
  ThumbDown,
  Save,
  Close,
  OpenInNew,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import { PageContainer } from '../components/design-system';
import { workoutService } from '../services/api';
import { useGenerateWorkout, useExerciseDetails, useSaveWorkoutPlan } from '../hooks/useWorkouts';
import ModernInput, { ModernSelect } from '../components/ModernInput';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';
import { ev } from '../theme/evolveDarkTheme';

const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];
const workoutTypes = ['Gym', 'Home Workout', 'Yoga', 'Cardio', 'HIIT'];

const monoLabel = {
  fontFamily: ev.mono,
  fontSize: 10,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: ev.chalkDim,
};

const sectionHead = {
  fontFamily: ev.display,
  fontSize: 'clamp(28px, 3vw, 40px)',
  letterSpacing: '-0.015em',
  color: ev.chalk,
  lineHeight: 1,
};

function WorkoutGenerator() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { execute: generateWorkout, loading: generating, error: generateError } = useGenerateWorkout();
  const { execute: saveWorkoutPlan } = useSaveWorkoutPlan();
  const { execute: getExerciseDetails } = useExerciseDetails();

  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [duration, setDuration] = useState(45);
  const [success, setSuccess] = useState('');
  const [exerciseDetails, setExerciseDetails] = useState({});
  const [generationTime, setGenerationTime] = useState(null);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [numExercises, setNumExercises] = useState('');
  const [workoutType, setWorkoutType] = useState('');
  const [loadingExerciseDetails, setLoadingExerciseDetails] = useState({});
  const [detailsDialog, setDetailsDialog] = useState(null);

  const error = generateError ? 'Failed to generate workout. Please try again.' : '';

  const handleMuscleToggle = (muscle) =>
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );

  const handleGenerate = async () => {
    setSuccess(''); setWorkoutPlan(null); setGenerationTime(null);
    const startTime = Date.now();
    try {
      const response = await generateWorkout({
        user_preferences: {
          fitness_goal: user?.fitness_goal || 'general_fitness',
          experience_level: user?.experience_level || 'intermediate',
        },
        duration_minutes: duration,
        target_muscle_groups: selectedMuscles,
        num_exercises: numExercises ? parseInt(numExercises, 10) : null,
        workout_type: workoutType || null,
      });
      const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
      setGenerationTime(timeTaken);
      setWorkoutPlan(response);
      setSuccess(`Workout generated in ${timeTaken}s by ${response.ai_model || 'AI'}.`);
    } catch (_) { /* hook surfaces error */ }
  };

  const fetchExerciseDetails = async (name) => {
    if (exerciseDetails[name]) { setDetailsDialog(name); return; }
    setLoadingExerciseDetails((p) => ({ ...p, [name]: true }));
    try {
      const details = await getExerciseDetails(name);
      setExerciseDetails((p) => ({ ...p, [name]: details }));
      setDetailsDialog(name);
    } catch (err) {
      console.error('Failed to fetch exercise details:', err);
    } finally {
      setLoadingExerciseDetails((p) => ({ ...p, [name]: false }));
    }
  };

  const handleStartWorkout = () => workoutPlan && navigate('/workout-session', { state: { workoutPlan } });
  const handleSaveWorkout = async () => {
    if (!workoutPlan) return;
    try { await saveWorkoutPlan(workoutPlan); setSuccess('Plan saved.'); } catch (_) {}
  };
  const handleFeedback = async (name, kind) => {
    try { await workoutService.submitExerciseFeedback(name, kind); setSuccess('Feedback noted. Coach updated.'); }
    catch (err) { console.error(err); }
  };

  const numExerciseOptions = [
    { value: '', label: 'AI decides' },
    ...Array.from({ length: 8 }, (_, i) => ({ value: i + 3, label: `${i + 3}` })),
  ];
  const workoutTypeOptions = [{ value: '', label: 'Any' }, ...workoutTypes.map((t) => ({ value: t, label: t }))];

  return (
    <PageContainer
      title="Generate"
      subtitle="Personalized programming built from your profile, recent training, and the constraints you set below."
    >
      {success && <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 4 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {/* ============ PARAMETERS ============ */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, borderTop: `1px solid ${ev.rule}`, borderBottom: `1px solid ${ev.rule}` }}>
        {/* Left — parameters */}
        <Box sx={{ p: { xs: 3, md: 5 }, borderRight: { md: `1px solid ${ev.rule}` }, borderBottom: { xs: `1px solid ${ev.rule}`, md: 'none' } }}>
          <Box sx={{ ...monoLabel, mb: 4 }}>01 · Parameters</Box>
          <Stack spacing={5}>
            <ModernInput
              label="Duration (minutes)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Math.max(15, Math.min(120, parseInt(e.target.value) || 45)))}
              helperText="15 – 120"
            />
            <ModernSelect
              label="Number of exercises"
              value={numExercises}
              onChange={(e) => setNumExercises(e.target.value)}
              options={numExerciseOptions}
              helperText="Let the model decide, or set a specific count"
            />
            <ModernSelect
              label="Environment"
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              options={workoutTypeOptions}
              helperText="Where you'll train today"
            />
          </Stack>
        </Box>

        {/* Right — muscle groups */}
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Box sx={{ ...monoLabel, mb: 4 }}>02 · Target muscles</Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {muscleGroups.map((muscle) => {
              const active = selectedMuscles.includes(muscle);
              return (
                <Box
                  key={muscle}
                  onClick={() => handleMuscleToggle(muscle)}
                  sx={{
                    cursor: 'pointer',
                    px: 2.5,
                    py: 1.25,
                    border: `1px solid ${active ? ev.chalk : ev.rule}`,
                    backgroundColor: active ? ev.chalk : 'transparent',
                    color: active ? ev.ink : ev.chalkDim,
                    fontFamily: ev.mono,
                    fontSize: 11,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    transition: 'color .15s ease, border-color .15s ease, background-color .15s ease',
                    '&:hover': { borderColor: active ? ev.chalk : ev.chalkMute, color: active ? ev.ink : ev.chalk },
                  }}
                >
                  {muscle}
                </Box>
              );
            })}
          </Box>

          {user && (user.fitness_goal || user.experience_level) && (
            <Box sx={{ mt: 5, pt: 4, borderTop: `1px solid ${ev.rule}` }}>
              <Box sx={{ ...monoLabel, mb: 2 }}>Inferred from your profile</Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, ...monoLabel, color: ev.chalk }}>
                {user.fitness_goal && <Box>Goal · <Box component="span" sx={{ color: ev.chalkMute }}>{user.fitness_goal.replace('_', ' ')}</Box></Box>}
                {user.experience_level && <Box>Level · <Box component="span" sx={{ color: ev.chalkMute }}>{user.experience_level}</Box></Box>}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* ============ GENERATE STRIP ============ */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, py: 6, flexWrap: 'wrap' }}>
        <Box>
          <Box sx={{ ...monoLabel }}>{generating ? 'Working' : 'Ready'}</Box>
          <Box sx={{ ...sectionHead, mt: 2 }}>
            {generating ? 'Generating…' : 'Compose this workout.'}
          </Box>
        </Box>
        <PrimaryButton onClick={handleGenerate} disabled={generating} loading={generating} size="large">
          {generating ? 'Generating' : 'Generate ↗'}
        </PrimaryButton>
      </Box>

      {/* ============ RESULT ============ */}
      {workoutPlan && (
        <Box sx={{ borderTop: `1px solid ${ev.rule}` }}>
          {/* Summary */}
          <Box sx={{ py: 6 }}>
            <Box sx={{ ...monoLabel }}>The plan</Box>
            <Box sx={{
              fontFamily: ev.display,
              fontSize: 'clamp(40px, 5vw, 64px)',
              letterSpacing: '-0.02em',
              color: ev.chalk,
              mt: 2,
              lineHeight: 1,
            }}>
              {workoutPlan.name || 'Your session'}
            </Box>
            {workoutPlan.description && (
              <Box sx={{ mt: 3, maxWidth: '60ch', color: ev.chalkDim, fontWeight: 300, fontSize: 15, lineHeight: 1.55 }}>
                {workoutPlan.description}
              </Box>
            )}

            <Box sx={{
              mt: 6,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              borderTop: `1px solid ${ev.rule}`,
              borderBottom: `1px solid ${ev.rule}`,
            }}>
              {[
                { label: 'Duration',   value: `${workoutPlan.estimated_duration || duration}`, unit: 'min' },
                { label: 'Exercises',  value: workoutPlan.exercises?.length || 0 },
                { label: 'Difficulty', value: workoutPlan.difficulty_level || 'Moderate' },
                { label: 'Calories',   value: workoutPlan.estimated_calories ? `~${workoutPlan.estimated_calories}` : '—', unit: 'kcal' },
              ].map((s, i, arr) => (
                <Box key={s.label} sx={{
                  py: 4,
                  px: 3,
                  borderRight: { md: i < arr.length - 1 ? `1px solid ${ev.rule}` : 'none' },
                  borderBottom: { xs: i < arr.length - 1 ? `1px solid ${ev.rule}` : 'none', md: 'none' },
                }}>
                  <Box sx={monoLabel}>{s.label}</Box>
                  <Box sx={{ fontFamily: ev.display, fontSize: 'clamp(36px, 4vw, 48px)', color: ev.chalk, letterSpacing: '-0.02em', mt: 2 }}>
                    {s.value}
                    {s.unit && <Box component="span" sx={{ fontFamily: ev.mono, fontSize: 12, color: ev.chalkMute, ml: 0.75, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.unit}</Box>}
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <PrimaryButton onClick={handleStartWorkout} startIcon={<PlayArrow />}>Begin session</PrimaryButton>
              <SecondaryButton onClick={handleSaveWorkout} startIcon={<Save />}>Save plan</SecondaryButton>
              {generationTime && (
                <Box sx={{ ...monoLabel, alignSelf: 'center', color: ev.accent }}>
                  ⚡ {generationTime}s
                </Box>
              )}
            </Box>
          </Box>

          {/* Exercise list */}
          <Box sx={{ py: 6, borderTop: `1px solid ${ev.rule}` }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, alignItems: 'end', mb: 6 }}>
              <Box sx={sectionHead}>The <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>movements</Box></Box>
              <Box sx={{ justifySelf: { md: 'end' }, ...monoLabel }}>{workoutPlan.exercises?.length || 0} total</Box>
            </Box>

            <Box>
              {workoutPlan.exercises?.map((exercise, index) => (
                <Box key={index} sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '30px 1fr', md: '40px 1fr auto' },
                  gap: 4,
                  alignItems: 'baseline',
                  py: 4,
                  borderTop: `1px solid ${ev.rule}`,
                  '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
                }}>
                  <Box sx={{ fontFamily: ev.mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>
                    {String(index + 1).padStart(2, '0')}
                  </Box>
                  <Box>
                    <Box sx={{ fontFamily: ev.display, fontSize: 'clamp(22px, 2.4vw, 28px)', letterSpacing: '-0.01em', color: ev.chalk, lineHeight: 1.1 }}>
                      {exercise.name}
                    </Box>
                    {exercise.instructions && (
                      <Box sx={{ mt: 1.5, color: ev.chalkDim, fontWeight: 300, fontSize: 13, lineHeight: 1.55, maxWidth: '70ch' }}>
                        {exercise.instructions}
                      </Box>
                    )}
                    {exercise.muscle_groups?.length > 0 && (
                      <Box sx={{ mt: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap', ...monoLabel }}>
                        {exercise.muscle_groups.map((m, i) => (
                          <Box key={i} component="span" sx={{ color: ev.chalkDim }}>· {m}</Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      onClick={() => fetchExerciseDetails(exercise.name)}
                      sx={{
                        cursor: 'pointer',
                        ...monoLabel,
                        color: ev.chalkDim,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        '&:hover': { color: ev.accent },
                      }}
                    >
                      {loadingExerciseDetails[exercise.name] ? <CircularProgress size={12} /> : <VideoLibrary sx={{ fontSize: 14 }} />}
                      {loadingExerciseDetails[exercise.name] ? 'Loading' : 'Videos'}
                    </Box>
                    <IconButton size="small" onClick={() => handleFeedback(exercise.name, 'like')} sx={{ color: ev.chalkMute, '&:hover': { color: ev.accent } }}>
                      <ThumbUp sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleFeedback(exercise.name, 'dislike')} sx={{ color: ev.chalkMute, '&:hover': { color: ev.warn } }}>
                      <ThumbDown sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ py: 6, borderTop: `1px solid ${ev.rule}` }}>
            <Box sx={{ ...monoLabel }}>Reminder</Box>
            <Box sx={{ mt: 2, ...sectionHead, fontStyle: 'italic', color: ev.chalkDim, maxWidth: '22ch' }}>
              Warm up. Hydrate. Listen to the body.
            </Box>
            <Box sx={{ mt: 4 }}>
              <PrimaryButton onClick={handleStartWorkout} startIcon={<PlayArrow />} size="large">
                Begin session ↗
              </PrimaryButton>
            </Box>
          </Box>
        </Box>
      )}

      {/* ============ EXERCISE DETAILS DIALOG ============ */}
      <Dialog
        open={!!detailsDialog}
        onClose={() => setDetailsDialog(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { backgroundColor: ev.ink, border: `1px solid ${ev.rule}`, borderRadius: 0, maxHeight: '85vh' } }}
      >
        {detailsDialog && exerciseDetails[detailsDialog] && (
          <>
            <DialogTitle sx={{ p: 4, borderBottom: `1px solid ${ev.rule}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Box sx={monoLabel}>Exercise</Box>
                <Box sx={{ fontFamily: ev.display, fontSize: 32, color: ev.chalk, letterSpacing: '-0.015em', mt: 1 }}>{detailsDialog}</Box>
              </Box>
              <IconButton onClick={() => setDetailsDialog(null)} sx={{ color: ev.chalkDim }}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <Stack spacing={5}>
                {Array.isArray(exerciseDetails[detailsDialog]?.videos) && exerciseDetails[detailsDialog].videos.length > 0 && (
                  <Box>
                    <Box sx={{ ...monoLabel, mb: 3 }}>Demonstrations</Box>
                    <Grid container spacing={2}>
                      {exerciseDetails[detailsDialog].videos.map((video, idx) => (
                        <Grid item xs={12} sm={6} key={idx}>
                          <Box
                            onClick={() => (video.youtube_url || video.url) && window.open(video.youtube_url || video.url, '_blank')}
                            sx={{
                              cursor: 'pointer',
                              border: `1px solid ${ev.rule}`,
                              p: 0,
                              transition: 'border-color .2s ease',
                              '&:hover': { borderColor: ev.chalkMute, '& .play-overlay': { opacity: 1 } },
                            }}
                          >
                            {(video.thumbnail_url || video.thumbnail) && (
                              <Box sx={{ position: 'relative' }}>
                                <Box
                                  component="img"
                                  src={video.thumbnail_url || video.thumbnail}
                                  alt={video.title || `Video ${idx + 1}`}
                                  sx={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
                                />
                                <Box
                                  className="play-overlay"
                                  sx={{
                                    position: 'absolute', inset: 0,
                                    background: 'rgba(0,0,0,0.6)',
                                    display: 'grid', placeItems: 'center',
                                    opacity: 0, transition: 'opacity .2s ease',
                                  }}
                                >
                                  <PlayArrow sx={{ fontSize: 48, color: ev.accent }} />
                                </Box>
                              </Box>
                            )}
                            <Box sx={{ p: 2 }}>
                              <Box sx={{ fontFamily: ev.body, fontSize: 14, color: ev.chalk, fontWeight: 500 }}>
                                {video.title || `Video ${idx + 1}`}
                              </Box>
                              {video.duration && (
                                <Box sx={{ ...monoLabel, mt: 1 }}>{video.duration}</Box>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {Array.isArray(exerciseDetails[detailsDialog]?.tips) && exerciseDetails[detailsDialog].tips.length > 0 && (
                  <Box>
                    <Box sx={{ ...monoLabel, mb: 3 }}>Form tips</Box>
                    <Stack spacing={0}>
                      {exerciseDetails[detailsDialog].tips.map((tip, idx) => (
                        <Box key={idx} sx={{
                          py: 2.5,
                          borderTop: `1px solid ${ev.rule}`,
                          '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
                          color: ev.chalk,
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}>
                          {tip.content || tip.title || tip}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {Array.isArray(exerciseDetails[detailsDialog]?.equipment) && exerciseDetails[detailsDialog].equipment.length > 0 && (
                  <Box>
                    <Box sx={{ ...monoLabel, mb: 2 }}>Equipment</Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                      {exerciseDetails[detailsDialog].equipment.map((item, idx) => (
                        <Box key={idx} sx={{
                          ...monoLabel,
                          color: ev.chalk,
                          px: 2,
                          py: 1,
                          border: `1px solid ${ev.rule}`,
                        }}>
                          {item}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: `1px solid ${ev.rule}` }}>
              <SecondaryButton onClick={() => setDetailsDialog(null)} endIcon={<OpenInNew sx={{ fontSize: 14 }} />}>
                Close
              </SecondaryButton>
            </DialogActions>
          </>
        )}
      </Dialog>
    </PageContainer>
  );
}

export default WorkoutGenerator;
