// src/components/PredictiveAnalytics.js — Evolve / minimal predictive analytics

import React, { useState, useEffect } from 'react';
import { Box, Alert, LinearProgress } from '@mui/material';
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
import { PrimaryButton } from './ModernButton';
import mockAIService from '../services/mockAIService';
import { ev } from '../theme/evolveDarkTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const mono = { fontFamily: ev.mono };
const display = { fontFamily: ev.display };
const monoLabel = { ...mono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: ev.chalkDim };

function PredictiveAnalytics() {
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchPredictions(); }, []);

  const fetchPredictions = async () => {
    setLoading(true); setError('');
    try {
      let data;
      try {
        const response = await fetch('/api/v1/ai/predictive-analytics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Backend endpoint not available');
        data = await response.json();
      } catch (apiError) {
        console.warn('Real API failed, using mock data:', apiError.message);
        data = await mockAIService.getPredictiveAnalytics();
      }
      setPredictions(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load predictive analytics');
    } finally {
      setLoading(false);
    }
  };

  const chartData = () => {
    if (!predictions?.future_performance) return null;
    const historical = predictions.historical_data || [];
    const future = predictions.future_performance || [];
    return {
      labels: [...historical.map((d) => d.date), ...future.map((d) => d.date)],
      datasets: [
        {
          label: 'Historical',
          data: [...historical.map((d) => d.value), ...new Array(future.length).fill(null)],
          borderColor: ev.chalk,
          backgroundColor: 'rgba(236, 233, 226, 0.06)',
          borderWidth: 1.5,
          fill: true,
          tension: 0.32,
          pointBackgroundColor: ev.chalk,
          pointBorderColor: ev.ink,
          pointBorderWidth: 1,
          pointRadius: 3,
        },
        {
          label: 'Predicted',
          data: [
            ...new Array(historical.length - 1).fill(null),
            historical[historical.length - 1]?.value,
            ...future.map((d) => d.value),
          ],
          borderColor: ev.accent,
          backgroundColor: 'rgba(201, 255, 74, 0.08)',
          borderWidth: 1.5,
          borderDash: [4, 4],
          fill: true,
          tension: 0.32,
          pointBackgroundColor: ev.accent,
          pointBorderColor: ev.ink,
          pointBorderWidth: 1,
          pointRadius: 3,
        },
        {
          label: 'Upper bound',
          data: [
            ...new Array(historical.length - 1).fill(null),
            historical[historical.length - 1]?.value,
            ...future.map((d) => d.upper_bound),
          ],
          borderColor: 'rgba(201, 255, 74, 0.25)',
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderDash: [2, 3],
          fill: false,
          tension: 0.32,
          pointRadius: 0,
        },
        {
          label: 'Lower bound',
          data: [
            ...new Array(historical.length - 1).fill(null),
            historical[historical.length - 1]?.value,
            ...future.map((d) => d.lower_bound),
          ],
          borderColor: 'rgba(201, 255, 74, 0.25)',
          backgroundColor: 'rgba(201, 255, 74, 0.04)',
          borderWidth: 1,
          borderDash: [2, 3],
          fill: '-1',
          tension: 0.32,
          pointRadius: 0,
        },
      ],
    };
  };

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
          filter: (item) => !item.text.toLowerCase().includes('bound'),
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
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: ev.chalkMute, font: { family: ev.mono, size: 10 } },
      },
      y: {
        grid: { color: ev.rule, drawBorder: false },
        border: { display: false },
        ticks: { color: ev.chalkMute, font: { family: ev.mono, size: 10 } },
      },
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
  };

  if (loading) {
    return (
      <Box>
        <Box sx={monoLabel}>AI · predictive analytics</Box>
        <Box sx={{ ...display, fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.02em', color: ev.chalk, mt: 1.5, lineHeight: 1 }}>
          Looking <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>ahead</Box>
        </Box>
        <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: 4 }}>Modeling your trajectory…</Box>
        <Box sx={{ mt: 2, maxWidth: 320 }}>
          <LinearProgress sx={{ height: '1px', backgroundColor: ev.rule, '& .MuiLinearProgress-bar': { backgroundColor: ev.accent } }} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Box sx={monoLabel}>AI · predictive analytics</Box>
        <Box sx={{ ...display, fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.02em', color: ev.chalk, mt: 1.5, lineHeight: 1 }}>
          Looking <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>ahead</Box>
        </Box>
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
        <Box sx={{ mt: 3 }}>
          <PrimaryButton onClick={fetchPredictions}>Retry ↗</PrimaryButton>
        </Box>
      </Box>
    );
  }

  if (!predictions) return null;

  const improvement = predictions.predicted_improvement ?? 0;
  const consistencyScore = predictions.consistency_score ?? 0;

  return (
    <Box>
      <Box sx={{ display: { xs: 'block', md: 'grid' }, gridTemplateColumns: '1fr 1fr', alignItems: 'end', mb: 5 }}>
        <Box>
          <Box sx={monoLabel}>AI · predictive analytics</Box>
          <Box sx={{ ...display, fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.02em', color: ev.chalk, mt: 1.5, lineHeight: 1 }}>
            Looking <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>ahead</Box>
          </Box>
        </Box>
        <Box sx={{ justifySelf: { md: 'end' }, ...monoLabel, mt: { xs: 2, md: 0 } }}>
          Based on your training history
        </Box>
      </Box>

      {/* Stats row */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        borderTop: `1px solid ${ev.rule}`,
        borderBottom: `1px solid ${ev.rule}`,
        mb: 6,
      }}>
        {[
          {
            label: '30-day projection',
            value: `${improvement >= 0 ? '+' : ''}${improvement}`,
            unit: '%',
            sub: predictions.trend || 'Improving',
            accent: improvement >= 0 ? ev.accent : ev.warn,
          },
          {
            label: 'Goal ETA',
            value: predictions.goal_achievement_date || '—',
            sub: 'At current pace',
          },
          {
            label: 'Consistency score',
            value: String(consistencyScore).padStart(2, '0'),
            unit: '/100',
            sub: consistencyScore >= 70 ? 'Strong' : consistencyScore >= 40 ? 'Steady' : 'Build it back',
          },
        ].map((s, i, arr) => (
          <Box key={s.label} sx={{
            py: '40px',
            px: { xs: 3, md: '36px' },
            pl: { md: i === 0 ? 0 : '36px' },
            pr: { md: i === arr.length - 1 ? 0 : '36px' },
            borderRight: { md: i < arr.length - 1 ? `1px solid ${ev.rule}` : 'none' },
            borderBottom: { xs: i < arr.length - 1 ? `1px solid ${ev.rule}` : 'none', md: 'none' },
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Box sx={monoLabel}>{s.label}</Box>
              <Box sx={{ ...monoLabel, color: ev.chalkMute }}>{String(i + 1).padStart(2, '0')}</Box>
            </Box>
            <Box sx={{ ...display, fontSize: 'clamp(40px, 4.5vw, 60px)', lineHeight: 0.95, letterSpacing: '-0.025em', color: ev.chalk, mt: '24px' }}>
              {s.value}
              {s.unit && (
                <Box component="span" sx={{ ...mono, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: ev.chalkMute, ml: '6px' }}>
                  {s.unit}
                </Box>
              )}
            </Box>
            <Box sx={{ mt: '14px', ...mono, fontSize: 11, letterSpacing: '0.06em', color: s.accent || ev.chalkDim }}>
              {s.sub}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Chart */}
      {chartData() && (
        <Box sx={{ mb: 6 }}>
          <Box sx={{ ...monoLabel, mb: 3 }}>Performance forecast</Box>
          <Box sx={{ height: 360 }}>
            <Line data={chartData()} options={chartOptions} />
          </Box>
          <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: 3, maxWidth: '70ch' }}>
            The lighter band represents the model's 95% confidence interval — your real trajectory will land somewhere inside it.
          </Box>
        </Box>
      )}

      {/* Insights */}
      {predictions.insights?.length > 0 && (
        <Box sx={{ py: 5, borderTop: `1px solid ${ev.rule}` }}>
          <Box sx={{ ...monoLabel, mb: 3 }}>Key insights · what the data reveals</Box>
          {predictions.insights.map((insight, i) => (
            <Box key={i} sx={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr',
              gap: 3,
              alignItems: 'baseline',
              py: 3,
              borderTop: `1px solid ${ev.rule}`,
              '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
            }}>
              <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>
                {String(i + 1).padStart(2, '0')}
              </Box>
              <Box>
                <Box sx={{ ...display, fontSize: 20, color: ev.chalk, letterSpacing: '-0.005em', lineHeight: 1.2 }}>
                  {insight.title}
                </Box>
                {insight.description && (
                  <Box sx={{ mt: 1.5, color: ev.chalkDim, fontSize: 14, lineHeight: 1.55, maxWidth: '60ch' }}>
                    {insight.description}
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Recommendations */}
      {predictions.recommendations?.length > 0 && (
        <Box sx={{ py: 5, borderTop: `1px solid ${ev.rule}` }}>
          <Box sx={{ ...monoLabel, mb: 3 }}>Recommendations</Box>
          {predictions.recommendations.map((rec, i) => (
            <Box key={i} sx={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr auto',
              gap: 3,
              alignItems: 'baseline',
              py: 3,
              borderTop: `1px solid ${ev.rule}`,
              '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
            }}>
              <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>
                {String(i + 1).padStart(2, '0')}
              </Box>
              <Box>
                <Box sx={{ ...display, fontSize: 20, color: ev.chalk, letterSpacing: '-0.005em', lineHeight: 1.2 }}>
                  {rec.title}
                </Box>
                {rec.action && (
                  <Box sx={{ mt: 1.5, color: ev.chalkDim, fontSize: 14, lineHeight: 1.55, maxWidth: '60ch' }}>
                    {rec.action}
                  </Box>
                )}
              </Box>
              <Box sx={{
                ...mono,
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: rec.priority === 'high' ? ev.warn : ev.chalkMute,
              }}>
                {rec.priority || 'normal'}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Goal progress */}
      {predictions.goal_progress?.length > 0 && (
        <Box sx={{ py: 5, borderTop: `1px solid ${ev.rule}` }}>
          <Box sx={{ ...monoLabel, mb: 3 }}>Goal forecast</Box>
          {predictions.goal_progress.map((goal, i) => (
            <Box key={i} sx={{
              py: 3,
              borderTop: `1px solid ${ev.rule}`,
              '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
                <Box sx={{ ...display, fontSize: 20, color: ev.chalk, letterSpacing: '-0.005em' }}>
                  {goal.goal_name}
                </Box>
                <Box sx={{ ...display, fontSize: 24, color: ev.chalk, letterSpacing: '-0.015em' }}>
                  {goal.current_progress}<Box component="span" sx={{ ...mono, fontSize: 11, color: ev.chalkMute, ml: 0.5 }}>%</Box>
                </Box>
              </Box>
              <Box sx={{ position: 'relative', height: '1px', backgroundColor: ev.rule }}>
                <Box sx={{
                  position: 'absolute',
                  inset: '-1px 0 0 0',
                  width: `${goal.current_progress}%`,
                  height: '3px',
                  backgroundColor: ev.accent,
                }} />
              </Box>
              <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: 2 }}>
                Est. completion · {goal.estimated_completion_date}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default PredictiveAnalytics;
