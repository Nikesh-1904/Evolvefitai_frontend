// src/pages/CommunityLeaderboard.js - Modern Dark Glass UI

import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TimerIcon from '@mui/icons-material/Timer';
import { useAuth } from '../contexts/AuthContext';
import { PageContainer, LoadingSpinner, Alert } from '../components/design-system';
import { useLeaderboard } from '../hooks';
import ModernCard from '../components/ModernCard';

const CommunityLeaderboard = () => {
  const { user } = useAuth();
  const { data: leaderboard, loading, error } = useLeaderboard();

  const getRankIcon = (rank) => {
    if (rank === 1) return <EmojiEventsIcon sx={{ color: '#FFD700', fontSize: 32 }} />;
    if (rank === 2) return <EmojiEventsIcon sx={{ color: '#C0C0C0', fontSize: 28 }} />;
    if (rank === 3) return <EmojiEventsIcon sx={{ color: '#CD7F32', fontSize: 24 }} />;
    return <Typography variant="body1" sx={{ fontWeight: 700 }}>{rank}</Typography>;
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading leaderboard..." />;
  }

  return (
    <PageContainer
      title="Community Leaderboard"
      subtitle="Compete with fellow gym members and climb the ranks!"
      icon="🏆"
      maxWidth="lg"
    >
      {error && <Alert severity="error" closable sx={{ mb: 4 }}>{error}</Alert>}

      {/* Gym Info Card */}
      {leaderboard?.gym && (
        <ModernCard variant="glass" sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <FitnessCenterIcon sx={{ fontSize: 40, color: '#00D4FF' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {leaderboard.gym.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                {leaderboard.gym.address}
              </Typography>
            </Box>
          </Box>
        </ModernCard>
      )}

      {/* Leaderboard Table */}
      {leaderboard?.leaderboard && leaderboard.leaderboard.length > 0 ? (
        <ModernCard variant="glass" contentSx={{ p: 0 }}>
          <TableContainer
            sx={{
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(0, 212, 255, 0.05)' }}>
                  <TableCell sx={{ color: '#00D4FF', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    Rank
                  </TableCell>
                  <TableCell sx={{ color: '#00D4FF', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    Member
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#00D4FF', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <FitnessCenterIcon fontSize="small" />
                      Workouts
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#00D4FF', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <LocalFireDepartmentIcon fontSize="small" />
                      Calories
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#00D4FF', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <TimerIcon fontSize="small" />
                      Hours
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#00D4FF', fontWeight: 700, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    Streak
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.leaderboard.map((entry, index) => {
                  const isCurrentUser = entry.user_id === user?.id;
                  return (
                    <TableRow
                      key={entry.user_id}
                      sx={{
                        background: isCurrentUser
                          ? 'rgba(0, 212, 255, 0.1)'
                          : index % 2 === 0
                          ? 'rgba(37, 42, 61, 0.3)'
                          : 'transparent',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(0, 212, 255, 0.15)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <TableCell sx={{ color: 'white', py: 2 }}>
                        <Box display="flex" alignItems="center" justifyContent="center">
                          {getRankIcon(entry.rank)}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'white', py: 2 }}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              background: isCurrentUser
                                ? 'linear-gradient(45deg, #00D4FF, #7C3AED)'
                                : 'linear-gradient(45deg, #252A3D, #1A1F2E)',
                              fontWeight: 700,
                            }}
                          >
                            {entry.user_name?.charAt(0).toUpperCase() || '?'}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: isCurrentUser ? 700 : 500 }}>
                              {entry.user_name || 'Anonymous'}
                              {isCurrentUser && (
                                <Chip
                                  label="You"
                                  size="small"
                                  sx={{
                                    ml: 1,
                                    background: 'linear-gradient(45deg, #00D4FF, #7C3AED)',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                  }}
                                />
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'white', py: 2 }}>
                        <Chip
                          label={entry.workouts_completed}
                          size="small"
                          sx={{
                            background: 'rgba(0, 212, 255, 0.2)',
                            color: '#00D4FF',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'white', py: 2 }}>
                        <Chip
                          label={entry.total_calories?.toLocaleString() || 0}
                          size="small"
                          sx={{
                            background: 'rgba(255, 51, 102, 0.2)',
                            color: '#FF3366',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'white', py: 2 }}>
                        <Chip
                          label={Math.round((entry.total_minutes || 0) / 60)}
                          size="small"
                          sx={{
                            background: 'rgba(124, 58, 237, 0.2)',
                            color: '#7C3AED',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'white', py: 2 }}>
                        <Chip
                          label={`${entry.current_streak || 0} 🔥`}
                          size="small"
                          sx={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10B981',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </ModernCard>
        ) : (
          <ModernCard variant="glass" contentSx={{ textAlign: 'center', py: 6 }}>
            <EmojiEventsIcon sx={{ fontSize: 80, color: '#94A3B8', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
              No Leaderboard Data Yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Start working out to appear on the leaderboard!
            </Typography>
          </ModernCard>
        )}
    </PageContainer>
  );
};

export default CommunityLeaderboard;
