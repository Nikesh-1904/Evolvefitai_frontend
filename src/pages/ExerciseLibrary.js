// src/pages/ExerciseLibrary.js - Browse Exercise Library

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Collapse,
  Button,
} from '@mui/material';
import {
  Search,
  FilterList,
  ExpandMore,
  ExpandLess,
  FitnessCenter,
  PlayCircle,
  Info,
} from '@mui/icons-material';
import { PageContainer } from '../components/design-system';
import { Alert, EmptyState, Loading } from '../components/design-system';
import ModernCard from '../components/ModernCard';
import { ModernSelect } from '../components/ModernInput';
import workoutService from '../services/api/workoutService';

// Exercise difficulty colors
const difficultyColors = {
  beginner: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: '#10B981' },
  intermediate: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)', text: '#FBBF24' },
  advanced: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#EF4444' },
};

// Exercise type labels
const exerciseTypeLabels = {
  WEIGHT_BASED: 'Weight & Reps',
  REPS_ONLY: 'Reps Only',
  DURATION: 'Duration',
  DISTANCE_DURATION: 'Distance & Time',
  QUALITATIVE: 'Qualitative',
};

// Individual Exercise Card
const ExerciseCard = ({ exercise }) => {
  const [expanded, setExpanded] = useState(false);
  const difficultyStyle = difficultyColors[exercise.difficulty] || difficultyColors.intermediate;

  return (
    <ModernCard variant="glass">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              {exercise.name}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={exercise.difficulty || 'Intermediate'}
                size="small"
                sx={{
                  background: difficultyStyle.bg,
                  border: `1px solid ${difficultyStyle.border}`,
                  color: difficultyStyle.text,
                  fontWeight: 600,
                }}
              />
              <Chip
                label={exerciseTypeLabels[exercise.exercise_type] || exercise.exercise_type}
                size="small"
                sx={{
                  background: 'rgba(0, 212, 255, 0.1)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  color: '#00D4FF',
                }}
              />
              {exercise.equipment && (
                <Chip
                  label={exercise.equipment}
                  size="small"
                  sx={{
                    background: 'rgba(124, 58, 237, 0.1)',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                    color: '#7C3AED',
                  }}
                />
              )}
            </Stack>
          </Box>
        </Box>

        {/* Muscle Groups */}
        {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#94A3B8', mb: 0.5, display: 'block' }}>
              Target Muscles:
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
              {exercise.muscle_groups.map((muscle, index) => (
                <Chip
                  key={index}
                  label={muscle}
                  size="small"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#CBD5E1',
                    fontSize: '0.75rem',
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Expand/Collapse Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              color: '#00D4FF',
              '&:hover': {
                background: 'rgba(0, 212, 255, 0.1)',
              },
            }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
            <Typography variant="body2" sx={{ ml: 1 }}>
              {expanded ? 'Hide Details' : 'View Details'}
            </Typography>
          </IconButton>
        </Box>

        {/* Expanded Details */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {/* Instructions */}
            {exercise.instructions && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#CBD5E1', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <Info sx={{ fontSize: 18 }} />
                  Instructions
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', whiteSpace: 'pre-line' }}>
                  {exercise.instructions}
                </Typography>
              </Box>
            )}

            {/* MET Value */}
            {exercise.met_value && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  MET Value (Calorie Burn): <strong style={{ color: '#00D4FF' }}>{exercise.met_value}</strong>
                </Typography>
              </Box>
            )}

            {/* Videos */}
            {exercise.videos && exercise.videos.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#CBD5E1', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <PlayCircle sx={{ fontSize: 18 }} />
                  Video Tutorials ({exercise.videos.length})
                </Typography>
                <Stack spacing={1}>
                  {exercise.videos.slice(0, 3).map((video, index) => (
                    <Box
                      key={index}
                      component="a"
                      href={video.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        p: 1.5,
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        textDecoration: 'none',
                        display: 'block',
                        transition: 'all 0.2s',
                        '&:hover': {
                          background: 'rgba(0, 212, 255, 0.1)',
                          border: '1px solid rgba(0, 212, 255, 0.3)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#CBD5E1', fontSize: '0.875rem' }}>
                        {video.title}
                      </Typography>
                      {video.duration > 0 && (
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          Duration: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Tips */}
            {exercise.tips && exercise.tips.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#CBD5E1', fontWeight: 600, mb: 1 }}>
                  Pro Tips
                </Typography>
                <Stack spacing={1}>
                  {exercise.tips.map((tip, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 1.5,
                        borderRadius: '8px',
                        background: 'rgba(16, 185, 129, 0.05)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600, display: 'block', mb: 0.5 }}>
                        {tip.tip_type}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#CBD5E1', fontSize: '0.875rem' }}>
                        {tip.content}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Collapse>
      </Box>
    </ModernCard>
  );
};

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, [muscleGroupFilter, difficultyFilter, equipmentFilter]);

  const fetchExercises = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        skip: page * 20,
        limit: 20,
      };

      if (muscleGroupFilter) params.muscle_group = muscleGroupFilter;
      if (difficultyFilter) params.difficulty = difficultyFilter;
      if (equipmentFilter) params.equipment = equipmentFilter;

      const data = await workoutService.getExercises(params);

      // Backend returns array with exercises
      const exerciseList = Array.isArray(data) ? data : data.exercises || [];

      setExercises(exerciseList);
      setHasMore(exerciseList.length === 20);
    } catch (err) {
      console.error('Failed to fetch exercises:', err);
      setError('Failed to load exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter exercises by search query (client-side)
  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const muscleGroupOptions = [
    { value: '', label: 'All Muscle Groups' },
    { value: 'Chest', label: 'Chest' },
    { value: 'Back', label: 'Back' },
    { value: 'Legs', label: 'Legs' },
    { value: 'Shoulders', label: 'Shoulders' },
    { value: 'Arms', label: 'Arms' },
    { value: 'Core', label: 'Core' },
    { value: 'Cardio', label: 'Cardio' },
  ];

  const difficultyOptions = [
    { value: '', label: 'All Difficulties' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const equipmentOptions = [
    { value: '', label: 'All Equipment' },
    { value: 'Barbell', label: 'Barbell' },
    { value: 'Dumbbell', label: 'Dumbbell' },
    { value: 'Bodyweight', label: 'Bodyweight' },
    { value: 'Machine', label: 'Machine' },
    { value: 'Cable', label: 'Cable' },
    { value: 'Resistance Band', label: 'Resistance Band' },
  ];

  return (
    <PageContainer
      title="Exercise Library"
      subtitle="Browse and discover exercises for your workouts"
      icon="💪"
      maxWidth="lg"
    >
      {/* Error Message */}
      {error && (
        <Alert severity="error" closable sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#00D4FF' }} />
                </InputAdornment>
              ),
              sx: {
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                color: '#FFFFFF',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 212, 255, 0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00D4FF',
                },
              },
            }}
          />
          <Button
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              color: showFilters ? '#00D4FF' : '#CBD5E1',
              borderColor: showFilters ? '#00D4FF' : 'rgba(255, 255, 255, 0.1)',
              border: '1px solid',
              textTransform: 'none',
              px: 3,
              '&:hover': {
                borderColor: '#00D4FF',
                background: 'rgba(0, 212, 255, 0.1)',
              },
            }}
          >
            Filters
          </Button>
        </Stack>

        {/* Filter Options */}
        <Collapse in={showFilters}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <ModernSelect
                label="Muscle Group"
                value={muscleGroupFilter}
                onChange={(e) => setMuscleGroupFilter(e.target.value)}
                options={muscleGroupOptions}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <ModernSelect
                label="Difficulty"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                options={difficultyOptions}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <ModernSelect
                label="Equipment"
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
                options={equipmentOptions}
              />
            </Grid>
          </Grid>
        </Collapse>
      </Box>

      {/* Exercise List */}
      {loading ? (
        <Loading />
      ) : filteredExercises.length === 0 ? (
        <EmptyState
          type="workout"
          title="No Exercises Found"
          description={searchQuery ? "Try adjusting your search or filters" : "Start browsing exercises to build your workout"}
        />
      ) : (
        <>
          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
            Showing {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''}
          </Typography>
          <Stack spacing={2}>
            {filteredExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </Stack>
        </>
      )}
    </PageContainer>
  );
}

export default ExerciseLibrary;
