// src/components/PlateauAnalysis.js — Evolve / minimal plateau analysis

import React, { useState } from 'react';
import { Box, Stack, Collapse, Alert } from '@mui/material';
import { PrimaryButton, SecondaryButton } from './ModernButton';
import analyticsService from '../services/api/analyticsService';
import { ev } from '../theme/evolveDarkTheme';

const mono = { fontFamily: ev.mono };
const display = { fontFamily: ev.display };
const monoLabel = { ...mono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: ev.chalkDim };

const statusColor = (status) => {
  switch (status) {
    case 'improving': return ev.accent;
    case 'plateau':   return ev.chalkDim;
    case 'declining': return ev.warn;
    default:          return ev.chalkMute;
  }
};

function PlateauAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);

  const analyzeProgress = async () => {
    setLoading(true); setError('');
    try {
      const data = await analyticsService.analyzePlateaus();
      setAnalysis(data);
      setExpanded(true);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze. Log a few more workouts first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: { xs: 'block', md: 'grid' }, gridTemplateColumns: '1fr 1fr', alignItems: 'end', mb: '40px' }}>
        <Box>
          <Box sx={monoLabel}>AI · plateau analysis</Box>
          <Box sx={{ ...display, fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1, letterSpacing: '-0.02em', color: ev.chalk, mt: 1.5 }}>
            Where are you <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>stuck?</Box>
          </Box>
        </Box>
        {!analysis && (
          <Box sx={{ justifySelf: { md: 'end' }, mt: { xs: 3, md: 0 } }}>
            <PrimaryButton onClick={analyzeProgress} loading={loading} disabled={loading}>
              {loading ? 'Analyzing' : 'Run analysis ↗'}
            </PrimaryButton>
          </Box>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {!analysis && !loading && !error && (
        <Box sx={{
          py: '64px',
          borderTop: `1px solid ${ev.rule}`,
          borderBottom: `1px solid ${ev.rule}`,
          textAlign: 'center',
        }}>
          <Box sx={{ ...display, fontSize: 28, color: ev.chalk, letterSpacing: '-0.015em' }}>
            Not analyzed yet<Box component="span" sx={{ color: ev.accent }}>.</Box>
          </Box>
          <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: 2, maxWidth: '52ch', mx: 'auto', lineHeight: 1.55 }}>
            The model will look at your recent training and tell you which lifts are stalling and what to do about it.
          </Box>
        </Box>
      )}

      {analysis && (
        <Box>
          {/* Overall status row */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '180px 1fr' },
            gap: 4,
            py: 5,
            borderTop: `1px solid ${ev.rule}`,
            borderBottom: `1px solid ${ev.rule}`,
          }}>
            <Box>
              <Box sx={monoLabel}>Overall</Box>
              <Box sx={{
                ...mono,
                fontSize: 13,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: statusColor(analysis.overall_status),
                mt: 1.5,
              }}>
                {analysis.overall_status || 'Unknown'}
                {analysis.plateau_detected && (
                  <Box component="span" sx={{ ml: 1.5, color: ev.warn }}>· plateau</Box>
                )}
              </Box>
            </Box>
            {analysis.summary && (
              <Box sx={{ color: ev.chalk, fontSize: 15, lineHeight: 1.55, fontWeight: 400, maxWidth: '60ch' }}>
                {analysis.summary}
              </Box>
            )}
          </Box>

          {/* Recommendations */}
          {analysis.recommendations?.length > 0 && (
            <Box sx={{ py: 5, borderBottom: `1px solid ${ev.rule}` }}>
              <Box sx={{ ...monoLabel, mb: 3 }}>Recommendations · {analysis.recommendations.length}</Box>
              <Box>
                {analysis.recommendations.slice(0, expanded ? undefined : 3).map((rec, i) => {
                  const title = typeof rec === 'string' ? rec : (rec.title || rec.content);
                  const description = typeof rec === 'string' ? null : rec.description;
                  return (
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
                          {title}
                        </Box>
                        {description && (
                          <Box sx={{ mt: 1.5, color: ev.chalkDim, fontSize: 14, lineHeight: 1.55, maxWidth: '60ch' }}>
                            {description}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              {analysis.recommendations.length > 3 && (
                <Box
                  onClick={() => setExpanded(!expanded)}
                  sx={{
                    mt: 3,
                    display: 'inline-flex',
                    cursor: 'pointer',
                    ...monoLabel,
                    color: ev.chalkDim,
                    '&:hover': { color: ev.accent },
                  }}
                >
                  {expanded ? '↑ Show less' : `↓ Show ${analysis.recommendations.length - 3} more`}
                </Box>
              )}
            </Box>
          )}

          {/* Exercise breakdown */}
          {analysis.exercise_analysis?.length > 0 && (
            <Box sx={{ py: 5, borderBottom: `1px solid ${ev.rule}` }}>
              <Box sx={{ ...monoLabel, mb: 3 }}>Exercise breakdown</Box>
              <Box>
                {analysis.exercise_analysis.map((exercise, i) => (
                  <Box key={i} sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '30px 1fr auto', md: '40px 1fr auto' },
                    gap: 3,
                    alignItems: 'baseline',
                    py: 2.5,
                    borderTop: `1px solid ${ev.rule}`,
                    '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
                  }}>
                    <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>
                      {String(i + 1).padStart(2, '0')}
                    </Box>
                    <Box>
                      <Box sx={{ ...display, fontSize: 18, color: ev.chalk, letterSpacing: '-0.005em', lineHeight: 1.2 }}>
                        {exercise.exercise_name}
                      </Box>
                      {exercise.note && (
                        <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: 1 }}>{exercise.note}</Box>
                      )}
                    </Box>
                    <Box sx={{
                      ...mono,
                      fontSize: 11,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: statusColor(exercise.status),
                    }}>
                      {exercise.status || 'N/A'}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ pt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <PrimaryButton onClick={analyzeProgress} loading={loading} disabled={loading}>
              {loading ? 'Analyzing' : 'Re-analyze ↗'}
            </PrimaryButton>
            <SecondaryButton onClick={() => { setAnalysis(null); setExpanded(false); }}>
              Clear
            </SecondaryButton>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default PlateauAnalysis;
