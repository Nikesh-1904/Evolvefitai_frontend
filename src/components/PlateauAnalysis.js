// src/components/PlateauAnalysis.js - AI-Powered Plateau Detection & Analysis

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Alert as MuiAlert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import {
  TrendingFlat,
  Lightbulb,
  Warning,
  CheckCircle,
  ExpandMore,
  ExpandLess,
  AutoAwesome,
  FitnessCenter,
} from '@mui/icons-material';
import ModernCard from './ModernCard';
import { PrimaryButton, SecondaryButton } from './ModernButton';
import analyticsService from '../services/api/analyticsService';

/**
 * PlateauAnalysis Component
 * Analyzes user's workout data to detect plateaus and provide AI-powered recommendations
 */
function PlateauAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);

  const analyzeProgress = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await analyticsService.analyzePlateaus();
      setAnalysis(data);
      setExpanded(true);
    } catch (err) {
      console.error('Failed to analyze plateau:', err);
      setError('Failed to analyze your progress. Make sure you have logged enough workouts.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'plateau':
        return { bg: 'rgba(251, 191, 36, 0.2)', color: '#FBBF24', icon: <TrendingFlat /> };
      case 'improving':
        return { bg: 'rgba(16, 185, 129, 0.2)', color: '#10B981', icon: <CheckCircle /> };
      case 'declining':
        return { bg: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', icon: <Warning /> };
      default:
        return { bg: 'rgba(148, 163, 184, 0.2)', color: '#94A3B8', icon: <FitnessCenter /> };
    }
  };

  return (
    <ModernCard
      title="AI Plateau Analysis"
      subtitle="Detect plateaus and get personalized recommendations"
      variant="glass"
    >
      {!analysis ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <AutoAwesome sx={{ fontSize: 40, color: '#00D4FF' }} />
          </Box>

          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
            Analyze Your Progress
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3, maxWidth: 400, mx: 'auto' }}>
            Our AI will analyze your workout history to detect plateaus and provide personalized recommendations to help you break through.
          </Typography>

          {error && (
            <MuiAlert severity="error" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
              {error}
            </MuiAlert>
          )}

          <PrimaryButton
            onClick={analyzeProgress}
            loading={loading}
            disabled={loading}
            startIcon={<AutoAwesome />}
            size="large"
          >
            {loading ? 'Analyzing...' : 'Analyze My Progress'}
          </PrimaryButton>
        </Box>
      ) : (
        <Box>
          {/* Overall Status */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Chip
                icon={getStatusColor(analysis.overall_status).icon}
                label={analysis.overall_status?.toUpperCase() || 'UNKNOWN'}
                sx={{
                  background: getStatusColor(analysis.overall_status).bg,
                  color: getStatusColor(analysis.overall_status).color,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              />
              {analysis.plateau_detected && (
                <Chip
                  icon={<Warning />}
                  label="Plateau Detected"
                  sx={{
                    background: 'rgba(251, 191, 36, 0.2)',
                    color: '#FBBF24',
                    fontWeight: 600,
                  }}
                />
              )}
            </Stack>

            {analysis.summary && (
              <Typography variant="body1" sx={{ color: '#FFFFFF', mb: 2 }}>
                {analysis.summary}
              </Typography>
            )}
          </Box>

          {/* AI Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <Box
              sx={{
                p: 3,
                borderRadius: '16px',
                background: 'rgba(0, 212, 255, 0.05)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                mb: 3,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Lightbulb sx={{ color: '#00D4FF' }} />
                <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                  AI Recommendations
                </Typography>
              </Stack>

              <List sx={{ p: 0 }}>
                {analysis.recommendations.slice(0, expanded ? undefined : 3).map((rec, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 0,
                      py: 1,
                      alignItems: 'flex-start',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <CheckCircle sx={{ color: '#10B981', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={rec.title || rec}
                      secondary={rec.description}
                      primaryTypographyProps={{
                        sx: { color: '#FFFFFF', fontWeight: 600, fontSize: '0.875rem' },
                      }}
                      secondaryTypographyProps={{
                        sx: { color: '#CBD5E1', fontSize: '0.8125rem' },
                      }}
                    />
                  </ListItem>
                ))}
              </List>

              {analysis.recommendations.length > 3 && (
                <Button
                  onClick={() => setExpanded(!expanded)}
                  endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
                  sx={{
                    color: '#00D4FF',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    mt: 1,
                  }}
                >
                  {expanded ? 'Show Less' : `Show ${analysis.recommendations.length - 3} More`}
                </Button>
              )}
            </Box>
          )}

          {/* Exercise-Specific Analysis */}
          {analysis.exercise_analysis && analysis.exercise_analysis.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 600 }}>
                Exercise Breakdown
              </Typography>

              <Stack spacing={2}>
                {analysis.exercise_analysis.map((exercise, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                        {exercise.exercise_name}
                      </Typography>
                      <Chip
                        size="small"
                        label={exercise.status?.toUpperCase() || 'N/A'}
                        sx={{
                          background: getStatusColor(exercise.status).bg,
                          color: getStatusColor(exercise.status).color,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      />
                    </Stack>
                    {exercise.note && (
                      <Typography variant="caption" sx={{ color: '#CBD5E1' }}>
                        {exercise.note}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="center">
            <SecondaryButton
              onClick={() => setAnalysis(null)}
              size="small"
            >
              Close
            </SecondaryButton>
            <PrimaryButton
              onClick={analyzeProgress}
              loading={loading}
              disabled={loading}
              startIcon={<AutoAwesome />}
              size="small"
            >
              Re-Analyze
            </PrimaryButton>
          </Stack>
        </Box>
      )}
    </ModernCard>
  );
}

export default PlateauAnalysis;
