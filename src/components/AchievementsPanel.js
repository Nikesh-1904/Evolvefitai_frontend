// src/components/AchievementsPanel.js - Gamification and Achievement Display

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Tabs,
  Tab,
  Stack,
  Avatar,
  Chip,
  Card,
  CardContent,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  EmojiEvents,
  LocalFireDepartment,
  Timer,
  FitnessCenter,
  Psychology,
  TrendingUp,
  Lock,
  Star,
  Close,
  Share,
} from '@mui/icons-material';

// Import our contexts and components
import { useAchievements } from '../contexts/AchievementsContext';
import ModernCard from './ModernCard';
import { PrimaryButton, SecondaryButton } from './ModernButton';

function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`achievements-tabpanel-${index}`}
      aria-labelledby={`achievements-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AchievementCard = ({ achievement, isUnlocked, onClick }) => {
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#94A3B8';
      case 'uncommon': return '#10B981';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
      default: return '#94A3B8';
    }
  };

  const getRarityGradient = (rarity) => {
    switch (rarity) {
      case 'common': return 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)';
      case 'uncommon': return 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
      case 'rare': return 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)';
      case 'epic': return 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)';
      case 'legendary': return 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
      default: return 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)';
    }
  };

  return (
    <Card
      onClick={() => onClick && onClick(achievement)}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        background: isUnlocked 
          ? 'rgba(255, 255, 255, 0.08)' 
          : 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${isUnlocked ? getRarityColor(achievement.rarity) : 'rgba(255, 255, 255, 0.08)'}`,
        borderRadius: '16px',
        opacity: isUnlocked ? 1 : 0.6,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 32px ${getRarityColor(achievement.rarity)}40`,
        } : {},
        '&::before': isUnlocked ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: getRarityGradient(achievement.rarity),
        } : {},
      }}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              background: isUnlocked 
                ? getRarityGradient(achievement.rarity)
                : 'rgba(255, 255, 255, 0.1)',
              fontSize: '2rem',
            }}
          >
            {isUnlocked ? achievement.icon : <Lock />}
          </Avatar>
          
          {isUnlocked && achievement.unlockedAt && (
            <Chip
              label={new Date(achievement.unlockedAt).toLocaleDateString()}
              size="small"
              sx={{
                position: 'absolute',
                top: -5,
                right: -5,
                background: getRarityColor(achievement.rarity),
                color: '#FFFFFF',
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>
        
        <Typography
          variant="h6"
          sx={{
            color: isUnlocked ? '#FFFFFF' : '#94A3B8',
            fontWeight: 600,
            mb: 1,
          }}
        >
          {achievement.name}
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            color: isUnlocked ? '#CBD5E1' : '#6B7280',
            mb: 2,
            lineHeight: 1.4,
          }}
        >
          {achievement.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Chip
            label={achievement.rarity}
            size="small"
            sx={{
              background: `${getRarityColor(achievement.rarity)}20`,
              color: getRarityColor(achievement.rarity),
              fontWeight: 500,
              textTransform: 'capitalize',
            }}
          />
          
          <Chip
            icon={<Star sx={{ fontSize: '0.875rem' }} />}
            label={`${achievement.points} pts`}
            size="small"
            sx={{
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#F59E0B',
              fontWeight: 500,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const AchievementsPanel = () => {
  const {
    unlockedAchievements,
    totalPoints,
    level,
    getCurrentLevel,
    getNextLevel,
    getProgressToNextLevel,
    getAchievementsByCategory,
    getUnlockedAchievementsByCategory,
    achievementDefinitions,
  } = useAchievements();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progressToNext = getProgressToNextLevel();

  const categories = [
    { key: 'all', label: 'All Achievements', icon: <EmojiEvents /> },
    { key: 'workout', label: 'Workouts', icon: <FitnessCenter /> },
    { key: 'streak', label: 'Streaks', icon: <LocalFireDepartment /> },
    { key: 'milestone', label: 'Milestones', icon: <TrendingUp /> },
    { key: 'time', label: 'Time', icon: <Timer /> },
    { key: 'ai', label: 'AI Features', icon: <Psychology /> },
  ];

  const getAchievementsForTab = (categoryKey) => {
    if (categoryKey === 'all') {
      return Object.values(achievementDefinitions);
    }
    return getAchievementsByCategory(categoryKey);
  };

  const isAchievementUnlocked = (achievementId) => {
    return unlockedAchievements.some(a => a.id === achievementId);
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <ModernCard variant="feature" elevation="high" sx={{ mb: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mx: 'auto',
              mb: 3,
              background: currentLevel?.color 
                ? `linear-gradient(135deg, ${currentLevel.color} 0%, ${currentLevel.color}80 100%)`
                : 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
              fontSize: '3rem',
            }}
          >
            {currentLevel?.icon || '🏆'}
          </Avatar>
          
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Gravitas One", "Montserrat", sans-serif',
              fontWeight: 400,
              color: '#FFFFFF',
              mb: 1,
            }}
          >
            {currentLevel?.name || 'Fitness Enthusiast'}
          </Typography>
          
          <Typography variant="h6" sx={{ color: '#CBD5E1', mb: 3 }}>
            Level {level} • {totalPoints.toLocaleString()} Total Points
          </Typography>

          {/* Progress to Next Level */}
          {nextLevel && (
            <Box sx={{ maxWidth: 400, mx: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Progress to {nextLevel.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  {Math.round(progressToNext)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressToNext}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: currentLevel?.color 
                      ? `linear-gradient(135deg, ${currentLevel.color} 0%, ${nextLevel.color} 100%)`
                      : 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </ModernCard>

      {/* Achievement Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <ModernCard variant="glass" sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h4" sx={{ color: '#00D4FF', fontWeight: 700, mb: 1 }}>
              {unlockedAchievements.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
              Achievements Unlocked
            </Typography>
          </ModernCard>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <ModernCard variant="glass" sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h4" sx={{ color: '#10B981', fontWeight: 700, mb: 1 }}>
              {Object.keys(achievementDefinitions).length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
              Total Available
            </Typography>
          </ModernCard>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <ModernCard variant="glass" sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h4" sx={{ color: '#F59E0B', fontWeight: 700, mb: 1 }}>
              {totalPoints.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
              Total Points
            </Typography>
          </ModernCard>
        </Grid>
        
        <Grid item xs={6} md={3}>
          <ModernCard variant="glass" sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h4" sx={{ color: '#8B5CF6', fontWeight: 700, mb: 1 }}>
              {Math.round((unlockedAchievements.length / Object.keys(achievementDefinitions).length) * 100)}%
            </Typography>
            <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
              Completion Rate
            </Typography>
          </ModernCard>
        </Grid>
      </Grid>

      {/* Achievement Categories */}
      <ModernCard variant="glass" sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
              height: 3,
              borderRadius: '3px',
            },
            '& .MuiTab-root': {
              color: '#94A3B8',
              fontWeight: 600,
              textTransform: 'none',
              minWidth: 120,
              '&.Mui-selected': {
                color: '#FFFFFF',
              },
            },
          }}
        >
          {categories.map((category, index) => (
            <Tab
              key={category.key}
              icon={category.icon}
              label={category.label}
              iconPosition="start"
              sx={{ gap: 1 }}
            />
          ))}
        </Tabs>
      </ModernCard>

      {/* Achievement Grid */}
      {categories.map((category, index) => (
        <TabPanel key={category.key} value={activeTab} index={index}>
          <Grid container spacing={3}>
            {getAchievementsForTab(category.key).map((achievement, achIndex) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={achievement.id}>
                <Fade in timeout={300 + achIndex * 50}>
                  <div>
                    <AchievementCard
                      achievement={achievement}
                      isUnlocked={isAchievementUnlocked(achievement.id)}
                      onClick={setSelectedAchievement}
                    />
                  </div>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      ))}

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <Dialog
          open={!!selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(26, 31, 46, 0.95)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
            }
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: '"Gravitas One", "Montserrat", sans-serif',
              fontWeight: 400,
              color: '#FFFFFF',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'center',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  background: isAchievementUnlocked(selectedAchievement.id)
                    ? `linear-gradient(135deg, ${(() => {
                        switch (selectedAchievement.rarity) {
                          case 'common': return '#94A3B8';
                          case 'uncommon': return '#10B981';
                          case 'rare': return '#3B82F6';
                          case 'epic': return '#8B5CF6';
                          case 'legendary': return '#F59E0B';
                          default: return '#94A3B8';
                        }
                      })()} 0%, ${(() => {
                        switch (selectedAchievement.rarity) {
                          case 'common': return '#64748B';
                          case 'uncommon': return '#059669';
                          case 'rare': return '#1D4ED8';
                          case 'epic': return '#7C3AED';
                          case 'legendary': return '#D97706';
                          default: return '#64748B';
                        }
                      })()} 100%)`
                    : 'rgba(255, 255, 255, 0.1)',
                  fontSize: '2.5rem',
                }}
              >
                {isAchievementUnlocked(selectedAchievement.id) ? selectedAchievement.icon : <Lock />}
              </Avatar>
              
              <Typography variant="h5" sx={{ fontFamily: 'inherit', fontWeight: 'inherit' }}>
                {selectedAchievement.name}
              </Typography>
            </Box>
            
            <IconButton onClick={() => setSelectedAchievement(null)} sx={{ color: '#94A3B8' }}>
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography
              variant="body1"
              sx={{
                color: '#CBD5E1',
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              {selectedAchievement.description}
            </Typography>
            
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', mb: 3 }}>
              <Chip
                label={selectedAchievement.rarity}
                sx={{
                  background: `${(() => {
                    switch (selectedAchievement.rarity) {
                      case 'common': return '#94A3B8';
                      case 'uncommon': return '#10B981';
                      case 'rare': return '#3B82F6';
                      case 'epic': return '#8B5CF6';
                      case 'legendary': return '#F59E0B';
                      default: return '#94A3B8';
                    }
                  })()}20`,
                  color: (() => {
                    switch (selectedAchievement.rarity) {
                      case 'common': return '#94A3B8';
                      case 'uncommon': return '#10B981';
                      case 'rare': return '#3B82F6';
                      case 'epic': return '#8B5CF6';
                      case 'legendary': return '#F59E0B';
                      default: return '#94A3B8';
                    }
                  })(),
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              />
              
              <Chip
                icon={<Star />}
                label={`${selectedAchievement.points} points`}
                sx={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#F59E0B',
                  fontWeight: 600,
                }}
              />
              
              <Chip
                label={selectedAchievement.category}
                sx={{
                  background: 'rgba(124, 58, 237, 0.2)',
                  color: '#7C3AED',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              />
            </Stack>

            {isAchievementUnlocked(selectedAchievement.id) && (
              <Box>
                <Typography variant="body2" sx={{ color: '#10B981', mb: 1 }}>
                  ✅ Unlocked!
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Earned on {new Date(
                    unlockedAchievements.find(a => a.id === selectedAchievement.id)?.unlockedAt
                  ).toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 3, gap: 2, justifyContent: 'center' }}>
            <SecondaryButton onClick={() => setSelectedAchievement(null)}>
              Close
            </SecondaryButton>
            
            {isAchievementUnlocked(selectedAchievement.id) && (
              <PrimaryButton startIcon={<Share />}>
                Share Achievement
              </PrimaryButton>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default AchievementsPanel;