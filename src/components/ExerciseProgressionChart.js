// src/components/ExerciseProgressionChart.js — Evolve / minimal exercise progression

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { Line } from 'react-chartjs-2';
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

import analyticsService from '../services/api/analyticsService';
import { ModernSelect } from './ModernInput';
import { ev } from '../theme/evolveDarkTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const mono = { fontFamily: ev.mono };
const display = { fontFamily: ev.display };
const monoLabel = { ...mono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: ev.chalkDim };

function ExerciseProgressionChart() {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exerciseList, setExerciseList] = useState([]);
  const [progressionData, setProgressionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoggedExercises = async () => {
      setLoadingExercises(true);
      try {
        const exercises = await analyticsService.getLoggedExercises();
        setExerciseList(exercises || []);
        if (exercises && exercises.length > 0) {
          setSelectedExercise(exercises[0]);
          fetchProgressionData(exercises[0]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load exercise list');
      } finally {
        setLoadingExercises(false);
      }
    };
    fetchLoggedExercises();
  }, []);

  const fetchProgressionData = async (exerciseName) => {
    if (!exerciseName) return;
    setLoading(true); setError('');
    try {
      const data = await analyticsService.getExerciseProgression(exerciseName);
      setProgressionData(data);
    } catch (err) {
      console.error(err);
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

  const calculateTrend = () => {
    if (!progressionData?.progression || progressionData.progression.length < 2) {
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
  const trendColor = trend.direction === 'up' ? ev.accent : trend.direction === 'down' ? ev.warn : ev.chalkMute;
  const trendArrow = trend.direction === 'up' ? '▲' : trend.direction === 'down' ? '▼' : '·';

  const prepareChartData = () => {
    if (!progressionData?.progression) return null;
    const labels = progressionData.progression.map((item) =>
      new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    );

    const datasets = [];
    const baseDataset = {
      tension: 0.32,
      pointRadius: 3,
      pointBorderColor: ev.ink,
      pointBorderWidth: 1,
      borderWidth: 1.5,
      fill: true,
    };

    if (progressionData.progression.some((item) => item.max_weight !== null)) {
      datasets.push({
        ...baseDataset,
        label: 'Max weight · kg',
        data: progressionData.progression.map((item) => item.max_weight),
        borderColor: ev.chalk,
        backgroundColor: 'rgba(236, 233, 226, 0.06)',
        pointBackgroundColor: ev.chalk,
      });
    }
    if (progressionData.progression.some((item) => item.max_reps !== null)) {
      datasets.push({
        ...baseDataset,
        label: 'Max reps',
        data: progressionData.progression.map((item) => item.max_reps),
        borderColor: ev.accent,
        backgroundColor: 'rgba(201, 255, 74, 0.06)',
        pointBackgroundColor: ev.accent,
      });
    }
    if (progressionData.progression.some((item) => item.total_volume !== null)) {
      datasets.push({
        ...baseDataset,
        label: 'Total volume',
        data: progressionData.progression.map((item) => item.total_volume),
        borderColor: ev.chalkDim,
        backgroundColor: 'rgba(163, 160, 154, 0.04)',
        pointBackgroundColor: ev.chalkDim,
      });
    }
    return { labels, datasets };
  };

  const chartData = prepareChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'start',
        labels: {
          color: ev.chalkDim,
          font: { family: ev.mono, size: 10 },
          usePointStyle: true,
          boxWidth: 8,
          padding: 16,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: ev.chalk,
        titleColor: ev.ink,
        bodyColor: ev.ink,
        borderWidth: 0,
        cornerRadius: 0,
        displayColors: false,
        padding: 10,
        titleFont: { family: ev.mono, size: 10, weight: '500' },
        bodyFont: { family: ev.mono, size: 11, weight: '500' },
        callbacks: {
          label: (ctx) => {
            const label = ctx.dataset.label || '';
            return label ? `${label}: ${ctx.parsed.y?.toFixed(1) ?? ''}` : '';
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: ev.chalkMute, font: { family: ev.mono, size: 10 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: ev.rule, drawBorder: false },
        border: { display: false },
        ticks: { color: ev.chalkMute, font: { family: ev.mono, size: 10 } },
      },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  return (
    <Box>
      <Box sx={{ display: { xs: 'block', md: 'grid' }, gridTemplateColumns: '1fr 1fr', alignItems: 'end', mb: 5 }}>
        <Box>
          <Box sx={monoLabel}>Exercise tracker</Box>
          <Box sx={{ ...display, fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.02em', color: ev.chalk, mt: 1.5, lineHeight: 1 }}>
            Strength <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>over time</Box>
          </Box>
        </Box>
        {progressionData?.progression?.length > 1 && (
          <Box sx={{ justifySelf: { md: 'end' }, display: 'flex', gap: 4, mt: { xs: 3, md: 0 } }}>
            <Box sx={{ textAlign: { md: 'right' } }}>
              <Box sx={monoLabel}>Trend</Box>
              <Box sx={{ ...mono, fontSize: 14, color: trendColor, letterSpacing: '0.08em', mt: 1 }}>
                {trendArrow} {trend.direction === 'flat' ? 'flat' : `${trend.percentage}%`}
              </Box>
            </Box>
            <Box sx={{ textAlign: { md: 'right' } }}>
              <Box sx={monoLabel}>Sessions</Box>
              <Box sx={{ ...display, fontSize: 24, color: ev.chalk, letterSpacing: '-0.01em', mt: 0.5 }}>
                {String(progressionData.progression.length).padStart(2, '0')}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Selector */}
      <Box sx={{ maxWidth: 480, mb: 5 }}>
        <ModernSelect
          label="Select exercise"
          value={selectedExercise}
          onChange={handleExerciseChange}
          disabled={loadingExercises || exerciseList.length === 0}
          options={exerciseList.map((ex) => ({ value: ex, label: ex }))}
          placeholder={loadingExercises ? 'Loading' : 'Choose an exercise'}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {/* Chart */}
      <Box sx={{ height: 360 }}>
        {loading && (
          <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
            <CircularProgress size={28} />
          </Box>
        )}

        {!loading && !error && exerciseList.length === 0 && !loadingExercises && (
          <Box sx={{ display: 'grid', placeItems: 'center', height: '100%', textAlign: 'center' }}>
            <Box>
              <Box sx={{ ...display, fontSize: 28, color: ev.chalk }}>No exercise data yet</Box>
              <Box sx={{ ...monoLabel, mt: 1.5 }}>Start logging workouts to populate this</Box>
            </Box>
          </Box>
        )}

        {!loading && !error && chartData && chartData.datasets.length > 0 && (
          <Line data={chartData} options={chartOptions} />
        )}

        {!loading && !error && selectedExercise && progressionData?.progression?.length === 0 && (
          <Box sx={{ display: 'grid', placeItems: 'center', height: '100%', textAlign: 'center' }}>
            <Box>
              <Box sx={{ ...display, fontSize: 28, color: ev.chalk }}>No data for "{selectedExercise}"</Box>
              <Box sx={{ ...monoLabel, mt: 1.5 }}>Log this exercise to track progression</Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ExerciseProgressionChart;
