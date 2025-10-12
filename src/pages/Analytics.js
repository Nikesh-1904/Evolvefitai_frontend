// src/pages/Analytics.js - Modern AI Fitness Analytics Dashboard

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Grid,
  Skeleton,
  Stack,
  Avatar,
  Chip,
  Fade,
  Zoom,
} from '@mui/material';
import {
  TrendingUp,
  LocalFireDepartment,
  FitnessCenter,
  Timeline,
  CalendarToday,
  ShowChart,
  EmojiEvents,
  Speed,
} from '@mui/icons-material';

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
  Filler
} from 'chart.js';

import apiService from '../services/apiService';

// Import our modern components
import ModernCard, { StatCard } from '../components/ModernCard';
import ModernInput, { ModernSelect } from '../components/ModernInput';
import { PrimaryButton, SecondaryButton } from '../components/ModernButton';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aggregation, setAggregation] = useState('day');
  
  // State for the progression chart
  const [exerciseList, setExerciseList] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [progressionData, setProgressionData] = useState(null);
  const [progressionLoading, setProgressionLoading] = useState(false);

  // Effect for the main analytics data (heatmap & calorie chart)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [data, exercises] = await Promise.all([
          apiService.getAnalyticsData(aggregation),
          apiService.getLoggedExercises()
        ]);
        setAnalyticsData(data);
        setExerciseList(exercises);
      } catch (err) {
        setError('Failed to load analytics data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [aggregation]);

  // Effect to fetch progression data when an exercise is selected
  useEffect(() => {
    if (selectedExercise) {
      const fetchProgressionData = async () => {
        setProgressionLoading(true);
        setProgressionData(null);
        try {
          const data = await apiService.getExerciseProgression(selectedExercise);
          setProgressionData(data);
        } catch (err) {
          console.error("Failed to fetch progression data:", err);
        } finally {
          setProgressionLoading(false);
        }
      };

      fetchProgressionData();
    }
  }, [selectedExercise]);

  const handleAggregationChange = (newAggregation) => {
    if (newAggregation !== null) {
      setAggregation(newAggregation);
    }
  };

  // Chart configurations
  const today = new Date();
  const oneYearAgo = new Date(new Date().setFullYear(today.getFullYear() - 1));
  const heatmapValues = analyticsData?.workout_heatmap.map(dateStr => ({ date: new Date(dateStr) })) || [];

  const chartData = {
    labels: analyticsData?.calorie_timeseries.map(d => new Date(d.date).toLocaleDateString()) || [],
    datasets: [{
      label: 'Calories Burned',
      data: analyticsData?.calorie_timeseries.map(d => d.value) || [],
      borderColor: '#00D4FF',
      backgroundColor: 'rgba(0, 212, 255, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#00D4FF',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: 4,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(37, 42, 61, 0.95)',
        titleColor: '#FFFFFF',
        bodyColor: '#CBD5E1',
        borderColor: 'rgba(0, 212, 255, 0.5)',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: false,
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#94A3B8',
          font: {
            size: 12,
          }
        }
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#94A3B8',
          font: {
            size: 12,
          }
        }
      }
    }
  };

  // Dynamically create the progression chart data and label
  const progressionChartLabel = progressionData?.[0]?.metric_type || 'Progression';
  const progressionChartData = {
    labels: progressionData?.map(d => new Date(d.workout_date).toLocaleDateString()) || [],
    datasets: [{
      label: progressionChartLabel,
      data: progressionData?.map(d => d.primary_metric_value) || [],
      borderColor: '#7C3AED',
      backgroundColor: 'rgba(124, 58, 237, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#7C3AED',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: 4,
    }],
  };

  const progressionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#94A3B8',
          font: {
            size: 12,
          }
        }
      },
      y: {
        beginAtZero: false,
        grace: '10%',
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#94A3B8',
          font: {
            size: 12,
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(37, 42, 61, 0.95)',
        titleColor: '#FFFFFF',
        bodyColor: '#CBD5E1',
        borderColor: 'rgba(124, 58, 237, 0.5)',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          footer: function(tooltipItems) {
            const dataIndex = tooltipItems[0].dataIndex;
            if (!progressionData || !progressionData[dataIndex]) return '';
            
            const sets = progressionData[dataIndex].sets;
            const metricType = progressionData[dataIndex].metric_type;
            
            return sets.map(set => {
              if (metricType === 'Volume (kg)') {
                return ` - ${set.reps || 0} reps @ ${set.weight || 0} kg`;
              }
              if (metricType === 'Total Reps') {
                return ` - ${set.reps || 0} reps`;
              }
              if (metricType === 'Total Duration (sec)') {
                return ` - ${set.duration_seconds || 0} seconds`;
              }
              if (metricType === 'Total Distance (km)') {
                return ` - ${set.distance_km || 0} km`;
              }
              return '';
            }).join('\n');
          }
        }
      }
    }
  };

  // Get aggregation options
  const aggregationOptions = [
    { value: 'day', label: 'Daily', icon: <CalendarToday /> },
    { value: 'week', label: 'Weekly', icon: <ShowChart /> },
    { value: 'month', label: 'Monthly', icon: <Timeline /> },
  ];

  // Calculate summary stats
  const totalWorkouts = analyticsData?.workout_heatmap?.length || 0;
  const totalCalories = analyticsData?.calorie_timeseries?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
  const avgCaloriesPerWorkout = totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0;
  const currentStreak = calculateWorkoutStreak(analyticsData?.workout_heatmap || []);

  function calculateWorkoutStreak(workoutDates) {
    if (!workoutDates.length) return 0;
    
    const dates = workoutDates.map(date => new Date(date).getTime()).sort((a, b) => b - a);
    let streak = 0;
    const today = new Date().getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    for (let i = 0; i < dates.length; i++) {
      const daysDiff = Math.floor((today - dates[i]) / oneDayMs);
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0F1419 0%, #1A202C 50%, #2D3748 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" height={200} sx={{ mb: 4, borderRadius: '16px' }} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '16px' }} />
              </Grid>
            ))}
            <Grid item xs={12} md={8}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '16px' }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '16px' }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0F1419 0%, #1A202C 50%, #2D3748 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Alert 
            severity="error"
            sx={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              '& .MuiAlert-message': { color: '#FFFFFF' },
            }}
          >
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F1419 0%, #1A202C 50%, #2D3748 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Fade in timeout={500}>
          <Box>
            <ModernCard
              variant="feature"
              elevation="high"
              sx={{ mb: 4, position: 'relative', overflow: 'hidden' }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '2.5rem',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  📊
                </Box>
                
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                    fontWeight: 400,
                    fontSize: { xs: '1.8rem', sm: '2.5rem' },
                    color: '#FFFFFF',
                    lineHeight: 1.2,
                    mb: 1,
                  }}
                >
                  Your Analytics Dashboard
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: '#CBD5E1',
                    fontWeight: 500,
                    fontSize: '1.125rem',
                    maxWidth: '600px',
                    mx: 'auto',
                  }}
                >
                  Track your progress, analyze your performance, and celebrate your achievements
                </Typography>
              </Box>
            </ModernCard>
          </Box>
        </Fade>

        {/* Summary Stats */}
        <Zoom in timeout={700}>
          <Box>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={6} md={3}>
                <StatCard
                  icon={<FitnessCenter />}
                  value={totalWorkouts}
                  label="Total Workouts"
                  variant="stat"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 212, 255, 0.05) 100%)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                  }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatCard
                  icon={<LocalFireDepartment />}
                  value={totalCalories.toLocaleString()}
                  label="Total Calories"
                  variant="stat"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(255, 51, 102, 0.1) 0%, rgba(255, 51, 102, 0.05) 100%)',
                    border: '1px solid rgba(255, 51, 102, 0.2)',
                  }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatCard
                  icon={<TrendingUp />}
                  value={avgCaloriesPerWorkout}
                  label="Avg per Workout"
                  variant="stat"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatCard
                  icon={<EmojiEvents />}
                  value={currentStreak}
                  label="Day Streak"
                  variant="stat"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Zoom>

        <Grid container spacing={4}>
          {/* Workout Heatmap */}
          <Grid item xs={12} lg={8}>
            <Fade in timeout={900}>
              <Box>
                <ModernCard
                  title="Workout Consistency"
                  subtitle="Your workout activity over the past year"
                  variant="glass"
                  headerAction={
                    <Chip
                      icon={<CalendarToday />}
                      label="Last 12 Months"
                      size="small"
                      sx={{ 
                        background: 'rgba(0, 212, 255, 0.1)', 
                        color: '#00D4FF',
                        fontWeight: 600,
                      }}
                    />
                  }
                >
                  <Box sx={{ 
                    '& .react-calendar-heatmap': { 
                      width: '100% !important',
                      height: 'auto !important',
                    },
                    '& .react-calendar-heatmap .color-empty': {
                      fill: 'rgba(255, 255, 255, 0.05)',
                    },
                    '& .react-calendar-heatmap .color-filled': {
                      fill: '#00D4FF',
                    },
                    '& .react-calendar-heatmap text': {
                      fill: '#94A3B8',
                      fontSize: '10px',
                    }
                  }}>
                    <CalendarHeatmap
                      startDate={oneYearAgo}
                      endDate={today}
                      values={heatmapValues}
                      classForValue={value => !value ? 'color-empty' : 'color-filled'}
                      tooltipDataAttrs={value => ({ 
                        'data-tip': `${value.date ? new Date(value.date).toLocaleDateString() : 'No workouts'}` 
                      })}
                    />
                  </Box>
                </ModernCard>
              </Box>
            </Fade>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} lg={4}>
            <Fade in timeout={1100}>
              <Box>
                <ModernCard
                  title="Performance Insights"
                  subtitle="Key metrics at a glance"
                  variant="glass"
                >
                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        width: 48, 
                        height: 48,
                        background: 'linear-gradient(135deg, #00D4FF 0%, #0EA5E9 100%)',
                      }}>
                        <Speed />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                          Consistency Score
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#00D4FF', fontWeight: 600 }}>
                          {totalWorkouts > 0 ? Math.min(100, Math.round((totalWorkouts / 365) * 100 * 3)) : 0}%
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        width: 48, 
                        height: 48,
                        background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                      }}>
                        <LocalFireDepartment />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                          Best Month
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                          {analyticsData?.calorie_timeseries?.length > 0 ? 
                            new Date(Math.max(...analyticsData.calorie_timeseries.map(d => new Date(d.date)))).toLocaleDateString('en', { month: 'long' })
                            : 'No data'
                          }
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        width: 48, 
                        height: 48,
                        background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                      }}>
                        <TrendingUp />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                          Progress Trend
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#7C3AED', fontWeight: 600 }}>
                          {totalWorkouts > 0 ? 'Improving' : 'Get Started'}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </ModernCard>
              </Box>
            </Fade>
          </Grid>

          {/* Calorie Chart */}
          <Grid item xs={12}>
            <Fade in timeout={1300}>
              <Box>
                <ModernCard
                  title="Calories Burned"
                  subtitle="Track your calorie burn over time"
                  variant="glass"
                  headerAction={
                    <Stack direction="row" spacing={1}>
                      {aggregationOptions.map((option) => (
                        <Chip
                          key={option.value}
                          icon={option.icon}
                          label={option.label}
                          clickable
                          color={aggregation === option.value ? 'primary' : 'default'}
                          onClick={() => handleAggregationChange(option.value)}
                          size="small"
                          sx={{
                            borderRadius: '12px',
                            fontWeight: 600,
                            ...(aggregation === option.value && {
                              background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                              color: '#FFFFFF',
                            }),
                            '&:hover': {
                              transform: 'translateY(-1px)',
                            }
                          }}
                        />
                      ))}
                    </Stack>
                  }
                >
                  <Box sx={{ height: 400, position: 'relative' }}>
                    {analyticsData?.calorie_timeseries?.length > 0 ? (
                      <Line data={chartData} options={chartOptions} />
                    ) : (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        color: '#94A3B8',
                        textAlign: 'center',
                      }}>
                        <Box>
                          <LocalFireDepartment sx={{ fontSize: '4rem', mb: 2, opacity: 0.3 }} />
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            No calorie data yet
                          </Typography>
                          <Typography variant="body2">
                            Start logging workouts to see your progress here
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </ModernCard>
              </Box>
            </Fade>
          </Grid>

          {/* Exercise Progression */}
          <Grid item xs={12}>
            <Fade in timeout={1500}>
              <Box>
                <ModernCard
                  title="Exercise Progression"
                  subtitle="Track your improvement on specific exercises"
                  variant="glass"
                  headerAction={
                    <Chip
                      icon={<ShowChart />}
                      label="Personal Records"
                      size="small"
                      sx={{ 
                        background: 'rgba(124, 58, 237, 0.1)', 
                        color: '#7C3AED',
                        fontWeight: 600,
                      }}
                    />
                  }
                >
                  <Box sx={{ mb: 4 }}>
                    <ModernSelect
                      label="Select Exercise"
                      value={selectedExercise || ''}
                      onChange={(e) => setSelectedExercise(e.target.value)}
                      options={[
                        { value: '', label: 'Choose an exercise...' },
                        ...exerciseList.map(exercise => ({ 
                          value: exercise, 
                          label: exercise 
                        }))
                      ]}
                      variant="outlined"
                      placeholder="Search exercises..."
                      fullWidth
                    />
                  </Box>

                  {progressionLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: '12px' }} />
                    </Box>
                  )}

                  {progressionData && progressionData.length > 0 && (
                    <Box sx={{ height: 400, position: 'relative' }}>
                      <Line data={progressionChartData} options={progressionChartOptions} />
                    </Box>
                  )}

                  {progressionData && progressionData.length === 0 && !progressionLoading && selectedExercise && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: 300,
                      color: '#94A3B8',
                      textAlign: 'center',
                    }}>
                      <Box>
                        <ShowChart sx={{ fontSize: '4rem', mb: 2, opacity: 0.3 }} />
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          No data for {selectedExercise}
                        </Typography>
                        <Typography variant="body2">
                          Start logging this exercise to track your progression
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {!selectedExercise && !progressionLoading && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: 300,
                      color: '#94A3B8',
                      textAlign: 'center',
                    }}>
                      <Box>
                        <FitnessCenter sx={{ fontSize: '4rem', mb: 2, opacity: 0.3 }} />
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Select an exercise above
                        </Typography>
                        <Typography variant="body2">
                          Choose any exercise to see your progress over time
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </ModernCard>
              </Box>
            </Fade>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
            📈 Analytics powered by your workout data and AI insights
          </Typography>
          <Typography variant="caption" sx={{ color: '#6B7280' }}>
            Keep logging workouts to see more detailed analytics and trends
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Analytics;