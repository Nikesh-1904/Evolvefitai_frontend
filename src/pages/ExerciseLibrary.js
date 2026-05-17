// src/pages/ExerciseLibrary.js — Evolve / minimal exercise library

import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Collapse,
  Alert,
} from '@mui/material';
import { PageContainer } from '../components/design-system';
import { Loading } from '../components/design-system';
import ModernInput, { ModernSelect } from '../components/ModernInput';
import workoutService from '../services/api/workoutService';
import { ev } from '../theme/evolveDarkTheme';

const mono = { fontFamily: ev.mono };
const display = { fontFamily: ev.display };
const monoLabel = { ...mono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: ev.chalkDim };

const exerciseTypeLabels = {
  WEIGHT_BASED: 'Weight & Reps',
  REPS_ONLY: 'Reps only',
  DURATION: 'Duration',
  DISTANCE_DURATION: 'Distance & time',
  QUALITATIVE: 'Qualitative',
};

function ExerciseRow({ idx, exercise, expanded, onToggle }) {
  return (
    <Box sx={{ borderTop: `1px solid ${ev.rule}`, '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` } }}>
      <Box
        onClick={onToggle}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '30px 1fr auto', md: '40px 1fr 140px 120px 24px' },
          gap: '28px',
          alignItems: 'baseline',
          py: '28px',
          cursor: 'pointer',
          transition: 'padding-left .2s ease',
          '&:hover': { pl: '12px', '& .row-arrow': { color: ev.accent } },
        }}
      >
        <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>
          {String(idx).padStart(2, '0')}
        </Box>
        <Box>
          <Box sx={{ ...display, fontSize: 'clamp(22px, 2.2vw, 28px)', letterSpacing: '-0.01em', color: ev.chalk, lineHeight: 1.1 }}>
            {exercise.name}
          </Box>
          <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: '8px' }}>
            {(exercise.muscle_groups || []).slice(0, 3).join(' · ') || 'general'}
          </Box>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' }, ...mono, fontSize: 12, color: ev.chalkDim, textAlign: 'right', letterSpacing: '0.08em' }}>
          {exerciseTypeLabels[exercise.exercise_type] || exercise.exercise_type || 'exercise'}
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' }, ...mono, fontSize: 12, color: ev.chalkDim, textAlign: 'right', letterSpacing: '0.08em' }}>
          {exercise.difficulty || 'intermediate'}
        </Box>
        <Box className="row-arrow" sx={{ ...display, fontSize: 18, fontStyle: 'italic', color: ev.chalkMute, justifySelf: 'end', transition: 'color .2s ease' }}>
          {expanded ? '↑' : '↓'}
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ pl: { md: '68px' }, pb: 5, pr: 3, pt: 1 }}>
          {exercise.instructions && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ ...monoLabel, mb: 2 }}>Instructions</Box>
              <Box sx={{ color: ev.chalk, fontSize: 14, lineHeight: 1.65, whiteSpace: 'pre-line', maxWidth: '70ch' }}>
                {exercise.instructions}
              </Box>
            </Box>
          )}

          {exercise.equipment && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ ...monoLabel, mb: 1.5 }}>Equipment</Box>
              <Box sx={{ ...mono, fontSize: 13, color: ev.chalk, letterSpacing: '0.08em' }}>
                {exercise.equipment}
              </Box>
            </Box>
          )}

          {exercise.muscle_groups?.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ ...monoLabel, mb: 1.5 }}>Target muscles</Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, ...mono, fontSize: 12, color: ev.chalkDim }}>
                {exercise.muscle_groups.map((m, i) => (
                  <Box key={i} component="span" sx={{ color: ev.chalk }}>· {m}</Box>
                ))}
              </Box>
            </Box>
          )}

          {exercise.met_value && (
            <Box sx={{ mb: 4, ...monoLabel, color: ev.chalkMute }}>
              MET value · <Box component="b" sx={{ color: ev.chalk, fontWeight: 500 }}>{exercise.met_value}</Box>
            </Box>
          )}

          {exercise.videos?.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ ...monoLabel, mb: 2 }}>Video tutorials · {exercise.videos.length}</Box>
              <Stack spacing={0}>
                {exercise.videos.slice(0, 3).map((video, i) => (
                  <Box
                    key={i}
                    component="a"
                    href={video.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      py: 2,
                      borderTop: `1px solid ${ev.rule}`,
                      '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
                      textDecoration: 'none',
                      color: ev.chalk,
                      transition: 'background-color .15s ease, padding-left .15s ease',
                      '&:hover': { backgroundColor: ev.ruleSoft, pl: 1.5, color: ev.accent },
                    }}
                  >
                    <Box sx={{ fontSize: 14, fontWeight: 500 }}>{video.title}</Box>
                    {video.duration > 0 && (
                      <Box sx={{ ...mono, fontSize: 11, color: ev.chalkMute, letterSpacing: '0.08em' }}>
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {exercise.tips?.length > 0 && (
            <Box>
              <Box sx={{ ...monoLabel, mb: 2 }}>Tips</Box>
              <Stack spacing={0}>
                {exercise.tips.map((tip, i) => (
                  <Box key={i} sx={{
                    py: 2.5,
                    borderTop: `1px solid ${ev.rule}`,
                    '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
                  }}>
                    <Box sx={{ ...monoLabel, color: ev.accent, mb: 1 }}>{tip.tip_type}</Box>
                    <Box sx={{ color: ev.chalk, fontSize: 14, lineHeight: 1.6 }}>{tip.content}</Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true); setError('');
      try {
        const params = { skip: 0, limit: 20 };
        if (muscleGroupFilter) params.muscle_group = muscleGroupFilter;
        if (difficultyFilter) params.difficulty = difficultyFilter;
        if (equipmentFilter) params.equipment = equipmentFilter;
        const data = await workoutService.getExercises(params);
        const list = Array.isArray(data) ? data : data.exercises || [];
        setExercises(list);
      } catch (err) {
        console.error(err);
        setError('Failed to load exercises. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [muscleGroupFilter, difficultyFilter, equipmentFilter]);

  const filtered = exercises.filter((ex) => ex.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const muscleGroupOptions = [
    { value: '', label: 'All muscle groups' },
    ...['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'].map((m) => ({ value: m, label: m })),
  ];
  const difficultyOptions = [
    { value: '', label: 'All difficulties' },
    ...['beginner', 'intermediate', 'advanced'].map((d) => ({ value: d, label: d })),
  ];
  const equipmentOptions = [
    { value: '', label: 'All equipment' },
    ...['Barbell', 'Dumbbell', 'Bodyweight', 'Machine', 'Cable', 'Resistance Band'].map((e) => ({ value: e, label: e })),
  ];

  return (
    <PageContainer
      title="Library"
      subtitle="Every movement we know about. Search, filter, learn the form — then take it into a session."
    >
      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {/* ============ SEARCH + FILTERS ============ */}
      <Box sx={{ borderTop: `1px solid ${ev.rule}`, borderBottom: `1px solid ${ev.rule}`, py: 5, mb: 5 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr 1fr 1fr' }, gap: 4 }}>
          <ModernInput
            label="Search exercises"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. bench press"
          />
          <ModernSelect
            label="Muscle group"
            value={muscleGroupFilter}
            onChange={(e) => setMuscleGroupFilter(e.target.value)}
            options={muscleGroupOptions}
          />
          <ModernSelect
            label="Difficulty"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            options={difficultyOptions}
          />
          <ModernSelect
            label="Equipment"
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
            options={equipmentOptions}
          />
        </Box>
      </Box>

      {/* ============ LIST ============ */}
      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <Box sx={{ py: '64px', borderTop: `1px solid ${ev.rule}`, borderBottom: `1px solid ${ev.rule}`, textAlign: 'center' }}>
          <Box sx={{ ...display, fontSize: 28, color: ev.chalk }}>No exercises found</Box>
          <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: 1.5 }}>
            {searchQuery ? 'Try a different search or clear the filters' : 'Adjust the filters above'}
          </Box>
        </Box>
      ) : (
        <Box>
          <Box sx={{ ...monoLabel, mb: 3 }}>
            Showing {filtered.length} exercise{filtered.length !== 1 ? 's' : ''}
          </Box>
          <Box>
            {filtered.map((exercise, i) => (
              <ExerciseRow
                key={exercise.id}
                idx={i + 1}
                exercise={exercise}
                expanded={expandedId === exercise.id}
                onToggle={() => setExpandedId(expandedId === exercise.id ? null : exercise.id)}
              />
            ))}
          </Box>
        </Box>
      )}
    </PageContainer>
  );
}

export default ExerciseLibrary;
