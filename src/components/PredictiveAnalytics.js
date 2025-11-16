// src/components/PredictiveAnalytics.js - AI-Powered Predictive Analytics

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Timeline,
  ShowChart,
  CalendarToday,
  EmojiEvents,
  Warning,
  CheckCircle,
  AutoAwesome,
  Speed,
  LocalFireDepartment,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import ModernCard from './ModernCard';
import { PrimaryButton } from './ModernButton';
import { Alert } from './design-system';

const PredictiveAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState('');

  // Fetch predictions on mount
  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/ai/predictive-analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch predictions');
      }

      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      console.error('Error fetching predictions:', err);
      setError(err.message || 'Failed to load predictive analytics');
    } finally {
      setLoading(false);
    }
  };

  // Chart configuration for predictions
  const getPredictionChartData = () => {
    if (!predictions?.future_performance) return null;

    const historicalData = predictions.historical_data || [];
    const futureData = predictions.future_performance || [];

    return {
      labels: [
        ...historicalData.map(d => d.date),
        ...futureData.map(d => d.date)
      ],
      datasets: [
        {
          label: 'Historical Performance',
          data: [
            ...historicalData.map(d => d.value),
            ...new Array(futureData.length).fill(null)
          ],
          borderColor: '#00D4FF',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#00D4FF',
        },
        {
          label: 'Predicted Performance',
          data: [
            ...new Array(historicalData.length - 1).fill(null),
            historicalData[historicalData.length - 1]?.value,
            ...futureData.map(d => d.value)
          ],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderDash: [5, 5],
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#10B981',
        },
        {
          label: 'Confidence Range (Upper)',
          data: [
            ...new Array(historicalData.length - 1).fill(null),
            historicalData[historicalData.length - 1]?.value,
            ...futureData.map(d => d.upper_bound)
          ],
          borderColor: 'rgba(16, 185, 129, 0.3)',
          backgroundColor: 'transparent',
          borderDash: [2, 2],
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        },
        {
          label: 'Confidence Range (Lower)',
          data: [
            ...new Array(historicalData.length - 1).fill(null),
            historicalData[historicalData.length - 1]?.value,
            ...futureData.map(d => d.lower_bound)
          ],
          borderColor: 'rgba(16, 185, 129, 0.3)',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          borderDash: [2, 2],
          fill: '-1',
          tension: 0.4,
          pointRadius: 0,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#CBD5E1',
          font: { size: 12 },
          usePointStyle: true,
          filter: (item) => !item.text.includes('Confidence Range'),
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(26, 31, 46, 0.95)',
        titleColor: '#FFFFFF',
        bodyColor: '#CBD5E1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#94A3B8',
          font: { size: 11 }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#94A3B8',
          font: { size: 11 }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  if (loading) {
    return (
      <ModernCard title="Predictive Analytics" subtitle="AI-powered future performance predictions" variant="glass">
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Avatar sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 3,
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          }}>
            <AutoAwesome sx={{ fontSize: '2.5rem' }} />
          </Avatar>
          <Typography variant="body1" sx={{ color: '#CBD5E1', mb: 2 }}>
            Analyzing your workout data and generating predictions...
          </Typography>
          <LinearProgress
            sx={{
              maxWidth: 400,
              mx: 'auto',
              borderRadius: '8px',
              height: 6,
              background: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #10B981 0%, #00D4FF 100%)',
              }
            }}
          />
        </Box>
      </ModernCard>
    );
  }

  if (error) {
    return (
      <ModernCard title="Predictive Analytics" subtitle="AI-powered future performance predictions" variant="glass">
        <Alert severity="error">
          {error}
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <PrimaryButton onClick={fetchPredictions}>
            Retry
          </PrimaryButton>
        </Box>
      </ModernCard>
    );
  }

  if (!predictions) {
    return null;
  }

  return (
    <Grid container spacing={3}>
      {/* Prediction Stats */}
      <Grid item xs={12} md={4}>
        <ModernCard
          variant="glass"
          sx={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2,
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            }}>
              <TrendingUp sx={{ fontSize: '2rem' }} />
            </Avatar>
            <Typography variant="h4" sx={{ color: '#10B981', fontWeight: 700, mb: 1 }}>
              {predictions.predicted_improvement >= 0 ? '+' : ''}{predictions.predicted_improvement}%
            </Typography>
            <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 1 }}>
              Predicted 30-Day Improvement
            </Typography>
            <Chip
              label={predictions.trend || 'Improving'}
              size="small"
              sx={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10B981',
                fontWeight: 600,
              }}
            />
          </Box>
        </ModernCard>
      </Grid>

      <Grid item xs={12} md={4}>
        <ModernCard
          variant="glass"
          sx={{
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2,
              background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
            }}>
              <CalendarToday sx={{ fontSize: '2rem' }} />
            </Avatar>
            <Typography variant="h4" sx={{ color: '#00D4FF', fontWeight: 700, mb: 1 }}>
              {predictions.goal_achievement_date || 'N/A'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
              Estimated Goal Achievement
            </Typography>
          </Box>
        </ModernCard>
      </Grid>

      <Grid item xs={12} md={4}>
        <ModernCard
          variant="glass"
          sx={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2,
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            }}>
              <Speed sx={{ fontSize: '2rem' }} />
            </Avatar>
            <Typography variant="h4" sx={{ color: '#F59E0B', fontWeight: 700, mb: 1 }}>
              {predictions.consistency_score || 0}/100
            </Typography>
            <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
              Consistency Score
            </Typography>
          </Box>
        </ModernCard>
      </Grid>

      {/* Prediction Chart */}
      <Grid item xs={12}>
        <ModernCard
          title="Performance Prediction"
          subtitle="AI-powered forecast of your fitness progress"
          variant="feature"
          headerAction={
            <Chip
              icon={<AutoAwesome />}
              label="AI Prediction"
              sx={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10B981',
                fontWeight: 600,
              }}
            />
          }
        >
          <Box sx={{ height: 400 }}>
            {getPredictionChartData() && (
              <Line data={getPredictionChartData()} options={chartOptions} />
            )}
          </Box>

          <Box sx={{ mt: 3, p: 2, borderRadius: '12px', background: 'rgba(0, 212, 255, 0.05)' }}>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1 }}>
              📊 The shaded area represents the 95% confidence interval for predictions
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block' }}>
              🤖 Predictions are based on your historical workout data, consistency patterns, and performance trends
            </Typography>
          </Box>
        </ModernCard>
      </Grid>

      {/* AI Insights */}
      <Grid item xs={12} md={6}>
        <ModernCard
          title="Key Insights"
          subtitle="What the data reveals"
          variant="glass"
        >
          <List>
            {predictions.insights?.map((insight, idx) => (
              <ListItem
                key={idx}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: '12px',
                  background: 'rgba(0, 212, 255, 0.05)',
                  border: '1px solid rgba(0, 212, 255, 0.1)',
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <CheckCircle sx={{ color: '#00D4FF' }} />
                </ListItemIcon>
                <ListItemText
                  primary={insight.title}
                  secondary={insight.description}
                  primaryTypographyProps={{
                    sx: { color: '#FFFFFF', fontWeight: 600, fontSize: '0.95rem' }
                  }}
                  secondaryTypographyProps={{
                    sx: { color: '#94A3B8', fontSize: '0.85rem' }
                  }}
                />
              </ListItem>
            )) || (
              <Typography variant="body2" sx={{ color: '#94A3B8', textAlign: 'center', py: 2 }}>
                No insights available yet. Keep logging workouts!
              </Typography>
            )}
          </List>
        </ModernCard>
      </Grid>

      {/* Recommendations */}
      <Grid item xs={12} md={6}>
        <ModernCard
          title="AI Recommendations"
          subtitle="Actions to optimize your progress"
          variant="glass"
        >
          <List>
            {predictions.recommendations?.map((rec, idx) => (
              <ListItem
                key={idx}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: '12px',
                  background: rec.priority === 'high'
                    ? 'rgba(255, 51, 102, 0.1)'
                    : 'rgba(16, 185, 129, 0.05)',
                  border: `1px solid ${rec.priority === 'high' ? 'rgba(255, 51, 102, 0.2)' : 'rgba(16, 185, 129, 0.1)'}`,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {rec.priority === 'high' ? (
                    <Warning sx={{ color: '#FF3366' }} />
                  ) : (
                    <EmojiEvents sx={{ color: '#10B981' }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={rec.title}
                  secondary={rec.action}
                  primaryTypographyProps={{
                    sx: { color: '#FFFFFF', fontWeight: 600, fontSize: '0.95rem' }
                  }}
                  secondaryTypographyProps={{
                    sx: { color: '#94A3B8', fontSize: '0.85rem' }
                  }}
                />
              </ListItem>
            )) || (
              <Typography variant="body2" sx={{ color: '#94A3B8', textAlign: 'center', py: 2 }}>
                No recommendations at this time. You're doing great!
              </Typography>
            )}
          </List>
        </ModernCard>
      </Grid>

      {/* Goal Progress Prediction */}
      {predictions.goal_progress && (
        <Grid item xs={12}>
          <ModernCard
            title="Goal Achievement Forecast"
            subtitle="Projected timeline to reach your fitness goals"
            variant="glass"
          >
            <Stack spacing={3}>
              {predictions.goal_progress.map((goal, idx) => (
                <Box key={idx}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                      {goal.goal_name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                      {goal.current_progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={goal.current_progress}
                    sx={{
                      height: 12,
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #10B981 0%, #00D4FF 100%)',
                        borderRadius: '8px',
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#94A3B8', mt: 0.5, display: 'block' }}>
                    Estimated completion: {goal.estimated_completion_date}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </ModernCard>
        </Grid>
      )}
    </Grid>
  );
};

export default PredictiveAnalytics;
