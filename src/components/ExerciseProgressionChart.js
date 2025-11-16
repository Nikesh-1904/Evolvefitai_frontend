// src/components/ExerciseProgressionChart.js - Exercise Progression Tracking

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material';
import {
  Line
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  TrendingUp,
  TrendingDown,
  Remove as TrendingFlat,
} from '@mui/icons-material';
import analyticsService from '../services/api/analyticsService';
import ModernCard from './ModernCard';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * ExerciseProgressionChart Component
 * Displays progression chart for a specific exercise over time
 */
function ExerciseProgressionChart() {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exerciseList, setExerciseList] = useState([]);
  const [progressionData, setProgressionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [error, setError] = useState('');

  // Fetch list of logged exercises on mount
  useEffect(() => {
    fetchLoggedExercises();
  }, []);

  const fetchLoggedExercises = async () => {
    setLoadingExercises(true);
    try {
      const exercises = await analyticsService.getLoggedExercises();
      setExerciseList(exercises || []);

      // Auto-select first exercise if available
      if (exercises && exercises.length > 0) {
        setSelectedExercise(exercises[0]);
        fetchProgressionData(exercises[0]);
      }
    } catch (err) {
      console.error('Failed to fetch logged exercises:', err);
      setError('Failed to load exercise list');
    } finally {
      setLoadingExercises(false);
    }
  };

  const fetchProgressionData = async (exerciseName) => {
    if (!exerciseName) return;

    setLoading(true);
    setError('');
    try {
      const data = await analyticsService.getExerciseProgression(exerciseName);
      setProgressionData(data);
    } catch (err) {
      console.error('Failed to fetch progression data:', err);
      setError('Failed to load progression data');
      setProgressionData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseChange = (event) => {
    const exercise = event.target.value;
    setSelectedExercise(exercise);
    fetchProgressionData(exercise);
  };

  // Calculate trend
  const calculateTrend = () => {
    if (!progressionData || !progressionData.progression || progressionData.progression.length < 2) {
      return { direction: 'flat', percentage: 0 };
    }

    const data = progressionData.progression;
    const firstValue = data[0].max_weight || data[0].max_reps || 0;
    const lastValue = data[data.length - 1].max_weight || data[data.length - 1].max_reps || 0;

    if (firstValue === 0) return { direction: 'flat', percentage: 0 };

    const percentage = ((lastValue - firstValue) / firstValue) * 100;
    const direction = percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'flat';

    return { direction, percentage: Math.abs(percentage).toFixed(1) };
  };

  const trend = calculateTrend();

  // Prepare chart data
  const prepareChartData = () => {
    if (!progressionData || !progressionData.progression) {
      return null;
    }

    const labels = progressionData.progression.map((item) =>
      new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    const datasets = [];

    // Weight-based progression
    if (progressionData.progression.some((item) => item.max_weight !== null)) {
      datasets.push({
        label: 'Max Weight (kg)',
        data: progressionData.progression.map((item) => item.max_weight),
        borderColor: '#00D4FF',
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#00D4FF',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
      });
    }

    // Reps progression
    if (progressionData.progression.some((item) => item.max_reps !== null)) {
      datasets.push({
        label: 'Max Reps',
        data: progressionData.progression.map((item) => item.max_reps),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
      });
    }

    // Volume progression (sets * reps * weight)
    if (progressionData.progression.some((item) => item.total_volume !== null)) {
      datasets.push({
        label: 'Total Volume',
        data: progressionData.progression.map((item) => item.total_volume),
        borderColor: '#7C3AED',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#7C3AED',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
      });
    }

    return {
      labels,
      datasets,
    };
  };

  const chartData = prepareChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#FFFFFF',
          font: {
            size: 12,
            family: 'Montserrat, sans-serif',
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(26, 31, 46, 0.95)',
        titleColor: '#FFFFFF',
        bodyColor: '#CBD5E1',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#94A3B8',
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#94A3B8',
          font: {
            size: 11,
          },
        },
        beginAtZero: true,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <ModernCard
      title="Exercise Progression Tracker"
      subtitle="Track your strength gains and improvements over time"
      variant="glass"
    >
      {/* Exercise Selector */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel
            sx={{
              color: '#94A3B8',
              '&.Mui-focused': {
                color: '#00D4FF',
              },
            }}
          >
            Select Exercise
          </InputLabel>
          <Select
            value={selectedExercise}
            onChange={handleExerciseChange}
            disabled={loadingExercises || exerciseList.length === 0}
            label="Select Exercise"
            sx={{
              color: '#FFFFFF',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 212, 255, 0.3)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#00D4FF',
              },
              '.MuiSvgIcon-root': {
                color: '#94A3B8',
              },
            }}
          >
            {exerciseList.map((exercise) => (
              <MenuItem
                key={exercise}
                value={exercise}
                sx={{
                  color: '#FFFFFF',
                  '&:hover': {
                    background: 'rgba(0, 212, 255, 0.1)',
                  },
                  '&.Mui-selected': {
                    background: 'rgba(0, 212, 255, 0.2)',
                    '&:hover': {
                      background: 'rgba(0, 212, 255, 0.3)',
                    },
                  },
                }}
              >
                {exercise}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Trend Indicator */}
      {progressionData && progressionData.progression && progressionData.progression.length > 1 && (
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Chip
            icon={
              trend.direction === 'up' ? (
                <TrendingUp />
              ) : trend.direction === 'down' ? (
                <TrendingDown />
              ) : (
                <TrendingFlat />
              )
            }
            label={`${trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}${trend.percentage}%`}
            sx={{
              background:
                trend.direction === 'up'
                  ? 'rgba(16, 185, 129, 0.2)'
                  : trend.direction === 'down'
                  ? 'rgba(239, 68, 68, 0.2)'
                  : 'rgba(148, 163, 184, 0.2)',
              color:
                trend.direction === 'up' ? '#10B981' : trend.direction === 'down' ? '#EF4444' : '#94A3B8',
              fontWeight: 600,
            }}
          />
          <Chip
            label={`${progressionData.progression.length} workouts tracked`}
            sx={{
              background: 'rgba(0, 212, 255, 0.1)',
              color: '#00D4FF',
              fontWeight: 600,
            }}
          />
        </Stack>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#00D4FF' }} />
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" sx={{ color: '#EF4444' }}>
            {error}
          </Typography>
        </Box>
      )}

      {/* Empty State */}
      {!loading && !error && exerciseList.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
            No Exercise Data Yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Start logging workouts to track your progression!
          </Typography>
        </Box>
      )}

      {/* Chart */}
      {!loading && !error && chartData && chartData.datasets.length > 0 && (
        <Box sx={{ height: 350 }}>
          <Line data={chartData} options={chartOptions} />
        </Box>
      )}

      {/* No Data for Selected Exercise */}
      {!loading && !error && selectedExercise && (!progressionData || !progressionData.progression || progressionData.progression.length === 0) && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
            No Data Available
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            No progression data found for {selectedExercise}
          </Typography>
        </Box>
      )}
    </ModernCard>
  );
}

export default ExerciseProgressionChart;
