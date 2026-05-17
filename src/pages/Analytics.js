// src/pages/Analytics.js — Evolve / minimal analytics

import React, { useState } from 'react';
import { Box, Alert } from '@mui/material';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
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

import { PageContainer } from '../components/design-system';
import { LoadingSpinner } from '../components/design-system/Loading';

import { useAnalyticsData, useLoggedExercises, useExerciseProgression } from '../hooks/useAnalytics';

import { ModernSelect } from '../components/ModernInput';
import ExerciseProgressionChart from '../components/ExerciseProgressionChart';
import PlateauAnalysis from '../components/PlateauAnalysis';
import PredictiveAnalytics from '../components/PredictiveAnalytics';

import { ev } from '../theme/evolveDarkTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const PAGE_X = 'clamp(28px, 6vw, 96px)';

const mono = { fontFamily: ev.mono };
const display = { fontFamily: ev.display };
const monoLabel = { ...mono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: ev.chalkDim };
const monoMeta  = { ...mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: ev.chalkDim };

// ---------- helpers ----------

function calculateWorkoutStreak(workoutDates) {
  if (!workoutDates.length) return 0;
  const dates = workoutDates.map((d) => new Date(d).getTime()).sort((a, b) => b - a);
  let streak = 0;
  const todayMs = new Date().getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  for (let i = 0; i < dates.length; i++) {
    const diff = Math.floor((todayMs - dates[i]) / dayMs);
    if (diff === streak) streak++;
    else if (diff > streak) break;
  }
  return streak;
}

// ---------- small components ----------

function SectionHead({ title, italic, right }) {
  return (
    <Box sx={{ display: { xs: 'block', md: 'grid' }, gridTemplateColumns: '1fr 1fr', alignItems: 'end', mb: '40px' }}>
      <Box sx={{ ...display, fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1, letterSpacing: '-0.02em', color: ev.chalk }}>
        {title}
        {italic && <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}> {italic}</Box>}
      </Box>
      {right && (
        <Box sx={{ justifySelf: { md: 'end' }, textAlign: { md: 'right' }, mt: { xs: 2, md: 0 }, display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: { md: 'flex-end' } }}>
          {right}
        </Box>
      )}
    </Box>
  );
}

function StatCell({ index, label, value, unit, sub, isLast, isFirst }) {
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
      {sub && <Box sx={{ mt: '14px', ...monoMeta }}>{sub}</Box>}
    </Box>
  );
}

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

// ---------- chart configs ----------

const baseChartOptions = (showTooltipCallback) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: ev.chalk,
      titleColor: ev.ink,
      bodyColor: ev.ink,
      borderColor: ev.chalk,
      borderWidth: 0,
      cornerRadius: 0,
      displayColors: false,
      padding: 10,
      titleFont: { family: ev.mono, size: 10, weight: '500' },
      bodyFont: { family: ev.mono, size: 11, weight: '500' },
      ...(showTooltipCallback ? { callbacks: { footer: showTooltipCallback } } : {}),
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
});

// ---------- page ----------

function Analytics() {
  const [aggregation, setAggregation] = useState('day');
  const [selectedExercise, setSelectedExercise] = useState(null);

  const { data: analyticsData, loading: analyticsLoading, error: analyticsError } = useAnalyticsData(aggregation);
  const { data: exerciseList, loading: exercisesLoading } = useLoggedExercises();
  const { data: progressionData, loading: progressionLoading } = useExerciseProgression(selectedExercise);

  const loading = analyticsLoading || exercisesLoading;
  const error = analyticsError ? 'Failed to load analytics data.' : '';

  const today = new Date();
  const oneYearAgo = new Date(new Date().setFullYear(today.getFullYear() - 1));
  const heatmapValues = analyticsData?.workout_heatmap.map((dateStr) => ({ date: new Date(dateStr) })) || [];

  const totalWorkouts = analyticsData?.workout_heatmap?.length || 0;
  const totalCalories = analyticsData?.calorie_timeseries?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
  const avgCaloriesPerWorkout = totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0;
  const currentStreak = calculateWorkoutStreak(analyticsData?.workout_heatmap || []);

  const calorieChartData = {
    labels: analyticsData?.calorie_timeseries.map((d) => new Date(d.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })) || [],
    datasets: [{
      label: 'Calories',
      data: analyticsData?.calorie_timeseries.map((d) => d.value) || [],
      borderColor: ev.accent,
      backgroundColor: 'rgba(201, 255, 74, 0.08)',
      fill: true,
      tension: 0.32,
      pointBackgroundColor: ev.accent,
      pointBorderColor: ev.ink,
      pointBorderWidth: 1,
      pointRadius: 3,
      borderWidth: 1.5,
    }],
  };

  const progressionFooter = (tooltipItems) => {
    const i = tooltipItems[0].dataIndex;
    if (!progressionData?.[i]) return '';
    const sets = progressionData[i].sets || [];
    const metric = progressionData[i].metric_type;
    return sets.map((set) => {
      if (metric === 'Volume (kg)') return ` ${set.reps || 0}r @ ${set.weight || 0}kg`;
      if (metric === 'Total Reps') return ` ${set.reps || 0} reps`;
      if (metric === 'Total Duration (sec)') return ` ${set.duration_seconds || 0}s`;
      if (metric === 'Total Distance (km)') return ` ${set.distance_km || 0}km`;
      return '';
    }).join('\n');
  };

  const progressionChartData = {
    labels: progressionData?.map((d) => new Date(d.workout_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })) || [],
    datasets: [{
      label: progressionData?.[0]?.metric_type || 'Progression',
      data: progressionData?.map((d) => d.primary_metric_value) || [],
      borderColor: ev.chalk,
      backgroundColor: 'rgba(236, 233, 226, 0.06)',
      fill: true,
      tension: 0.32,
      pointBackgroundColor: ev.chalk,
      pointBorderColor: ev.ink,
      pointBorderWidth: 1,
      pointRadius: 3,
      borderWidth: 1.5,
    }],
  };

  const aggregationOptions = [
    { value: 'day',   label: 'Daily' },
    { value: 'week',  label: 'Weekly' },
    { value: 'month', label: 'Monthly' },
  ];

  if (loading) return <LoadingSpinner fullScreen message="Loading analytics" />;

  return (
    <PageContainer
      title="Analytics"
      subtitle="How your training is trending. Counts, calories, consistency, progression on the lifts that matter."
    >
      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {/* ============ STATS ============ */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, borderTop: `1px solid ${ev.rule}`, borderBottom: `1px solid ${ev.rule}`, mb: 6 }}>
        <StatCell index={1} label="Workouts · total"     value={totalWorkouts}                            sub="Logged sessions" isFirst />
        <StatCell index={2} label="Calories · total"     value={totalCalories.toLocaleString()} unit="kcal" sub="Across all sessions" />
        <StatCell index={3} label="Avg per workout"      value={avgCaloriesPerWorkout}          unit="kcal" sub="Calorie average" />
        <StatCell index={4} label="Current streak"       value={currentStreak}                  unit="days" sub={currentStreak >= 3 ? 'On a roll' : 'Build it back'} isLast />
      </Box>

      {/* ============ CONSISTENCY (HEATMAP) ============ */}
      <Box sx={{ py: 6, borderTop: `1px solid ${ev.rule}` }}>
        <SectionHead
          title="Consistency"
          italic="· 12 months"
          right={<Box sx={monoMeta}>{totalWorkouts} sessions</Box>}
        />
        <Box sx={{
          '& .react-calendar-heatmap':                  { width: '100% !important', height: 'auto !important' },
          '& .react-calendar-heatmap .color-empty':     { fill: ev.rule },
          '& .react-calendar-heatmap .color-filled':    { fill: ev.accent },
          '& .react-calendar-heatmap text':             { fill: ev.chalkMute, fontSize: '9px', fontFamily: ev.mono, letterSpacing: '0.08em', textTransform: 'uppercase' },
          '& .react-calendar-heatmap rect':             { stroke: ev.ink, strokeWidth: 1, rx: 0 },
        }}>
          <CalendarHeatmap
            startDate={oneYearAgo}
            endDate={today}
            values={heatmapValues}
            classForValue={(value) => (!value ? 'color-empty' : 'color-filled')}
            tooltipDataAttrs={(value) => ({
              'data-tip': value.date ? new Date(value.date).toLocaleDateString() : 'No workout',
            })}
          />
        </Box>
      </Box>

      {/* ============ CALORIE TIMESERIES ============ */}
      <Box sx={{ py: 6, borderTop: `1px solid ${ev.rule}` }}>
        <SectionHead
          title="Calories"
          italic="burned"
          right={aggregationOptions.map((opt) => (
            <Toggle key={opt.value} active={aggregation === opt.value} onClick={() => setAggregation(opt.value)}>{opt.label}</Toggle>
          ))}
        />
        <Box sx={{ height: 320 }}>
          {analyticsData?.calorie_timeseries?.length > 0 ? (
            <Line data={calorieChartData} options={baseChartOptions()} />
          ) : (
            <Box sx={{ display: 'grid', placeItems: 'center', height: '100%', textAlign: 'center' }}>
              <Box>
                <Box sx={{ ...display, fontSize: 28, color: ev.chalk }}>No calorie data yet</Box>
                <Box sx={{ ...monoLabel, mt: 1.5 }}>Log workouts to populate this chart</Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* ============ EXERCISE PROGRESSION ============ */}
      <Box sx={{ py: 6, borderTop: `1px solid ${ev.rule}` }}>
        <SectionHead title="Exercise" italic="progression" />

        <Box sx={{ maxWidth: 480, mb: 5 }}>
          <ModernSelect
            label="Select exercise"
            value={selectedExercise || ''}
            onChange={(e) => setSelectedExercise(e.target.value)}
            options={[
              { value: '', label: 'Choose an exercise' },
              ...(exerciseList || []).map((ex) => ({ value: ex, label: ex })),
            ]}
          />
        </Box>

        <Box sx={{ height: 320 }}>
          {progressionLoading && (
            <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
              <LoadingSpinner message="Loading progression" />
            </Box>
          )}

          {!progressionLoading && progressionData?.length > 0 && (
            <Line data={progressionChartData} options={baseChartOptions(progressionFooter)} />
          )}

          {!progressionLoading && progressionData?.length === 0 && selectedExercise && (
            <Box sx={{ display: 'grid', placeItems: 'center', height: '100%', textAlign: 'center' }}>
              <Box>
                <Box sx={{ ...display, fontSize: 28, color: ev.chalk }}>No data for "{selectedExercise}"</Box>
                <Box sx={{ ...monoLabel, mt: 1.5 }}>Log this exercise to see progression</Box>
              </Box>
            </Box>
          )}

          {!progressionLoading && !selectedExercise && (
            <Box sx={{ display: 'grid', placeItems: 'center', height: '100%', textAlign: 'center' }}>
              <Box>
                <Box sx={{ ...display, fontSize: 28, color: ev.chalk }}>Pick an exercise above</Box>
                <Box sx={{ ...monoLabel, mt: 1.5 }}>Charts populate once you select one</Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* ============ DETAILED PROGRESSION ============ */}
      <Box sx={{ py: 6, borderTop: `1px solid ${ev.rule}` }}>
        <ExerciseProgressionChart />
      </Box>

      {/* ============ PLATEAU + PREDICTIVE ============ */}
      <Box sx={{ py: 6, borderTop: `1px solid ${ev.rule}` }}>
        <PlateauAnalysis />
      </Box>

      <Box sx={{ py: 6, borderTop: `1px solid ${ev.rule}` }}>
        <PredictiveAnalytics />
      </Box>

      <Box sx={{ pt: 6, mt: 4, borderTop: `1px solid ${ev.rule}` }}>
        <Box sx={{ ...monoLabel, color: ev.chalkMute, textAlign: 'center' }}>
          Charts update as you log more sessions
        </Box>
      </Box>
    </PageContainer>
  );
}

export default Analytics;
