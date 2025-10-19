// src/components/ContextualHelp.js - Smart Help System and Onboarding

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Stack,
  Avatar,
  Chip,
  Zoom,
  Fade,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Help,
  Close,
  NavigateNext,
  NavigateBefore,
  CheckCircle,
  Lightbulb,
  AutoAwesome,
  FitnessCenter,
  Dashboard,
  Settings,
  EmojiEvents,
  PlayCircle,
} from '@mui/icons-material';

// Import our contexts and components
import { useAuth } from '../contexts/AuthContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { useAchievements } from '../contexts/AchievementsContext';
import ModernCard from './ModernCard';
import { PrimaryButton, SecondaryButton } from './ModernButton';

const ContextualHelp = ({ page, trigger }) => {
  const { user } = useAuth();
  const { preferences } = usePreferences();
  const { unlockedAchievements } = useAchievements();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [helpOpen, setHelpOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showFAB, setShowFAB] = useState(true);

  // Page-specific help content
  const helpContent = {
    dashboard: {
      title: '🏠 Dashboard Help',
      sections: [
        {
          title: 'Quick Stats Overview',
          content: 'Monitor your daily calories burned, workout time, and progress at the top of your dashboard. These update in real-time as you complete workouts.',
          icon: <Dashboard />,
        },
        {
          title: 'Quick Actions',
          content: 'Use the colorful action cards to quickly generate AI workouts, log freestyle workouts, or create meal plans. These are your main entry points for activities.',
          icon: <PlayCircle />,
        },
        {
          title: 'Workout Plans',
          content: 'View and start your saved workout plans. AI-generated plans are marked with a special badge. Click "Start" to begin a workout session.',
          icon: <FitnessCenter />,
        },
        {
          title: 'Achievements',
          content: 'Track your fitness milestones and unlock achievements. Complete specific goals to earn points and level up your fitness profile.',
          icon: <EmojiEvents />,
        },
      ],
    },
    
    profile: {
      title: '👤 Profile Help',
      sections: [
        {
          title: 'Personal Information',
          content: 'Keep your basic info updated for better AI recommendations. Your age, weight, and height help generate more accurate workout and nutrition plans.',
          icon: <Settings />,
        },
        {
          title: 'Fitness Goals',
          content: 'Set specific fitness goals like weight loss, muscle gain, or general fitness. The AI uses these to tailor your workout recommendations.',
          icon: <FitnessCenter />,
        },
        {
          title: 'Dietary Preferences',
          content: 'Add dietary restrictions and preferences to get personalized meal recommendations that align with your lifestyle and health needs.',
          icon: <AutoAwesome />,
        },
      ],
    },
    
    'workout-session': {
      title: '💪 Workout Session Help',
      sections: [
        {
          title: 'Exercise Navigation',
          content: 'Use the sidebar to jump between exercises or use the Previous/Next buttons. Your current exercise is highlighted at the top.',
          icon: <FitnessCenter />,
        },
        {
          title: 'Set Logging',
          content: 'Log each set as you complete it. The app adapts to different exercise types - weights, reps, time, or qualitative feedback.',
          icon: <CheckCircle />,
        },
        {
          title: 'Exercise Videos',
          content: 'Click on exercise names to see demonstration videos and professional tips. This helps ensure proper form and technique.',
          icon: <PlayCircle />,
        },
      ],
    },
    
    'workout-history': {
      title: '📈 History Help',
      sections: [
        {
          title: 'Workout Timeline',
          content: 'Review all your completed workouts in chronological order. Click on any workout to see detailed exercise and set information.',
          icon: <FitnessCenter />,
        },
        {
          title: 'Progress Tracking',
          content: 'Monitor your total workouts, time spent, and improvements over time. Use this data to stay motivated and track your journey.',
          icon: <EmojiEvents />,
        },
      ],
    },
  };

  // Onboarding steps for new users
  const onboardingSteps = [
    {
      title: 'Welcome to AI Fitness! 🎉',
      content: 'Your personal AI-powered fitness companion is ready to help you achieve your goals. Let\'s get you started with a quick tour.',
      icon: '🚀',
    },
    {
      title: 'Complete Your Profile',
      content: 'First, complete your fitness profile with your goals, experience level, and preferences. This helps our AI create better recommendations just for you.',
      icon: '👤',
      action: 'Go to Profile',
      actionPath: '/profile',
    },
    {
      title: 'Generate Your First Workout',
      content: 'Try our AI workout generator! It creates personalized workouts based on your goals, available time, and fitness level.',
      icon: '🏋️',
      action: 'Generate Workout',
      actionPath: '/workout-generator',
    },
    {
      title: 'Track Your Progress',
      content: 'Log your workouts, track your progress, and unlock achievements. Every workout brings you closer to your fitness goals!',
      icon: '📊',
    },
    {
      title: 'Customize Your Experience',
      content: 'Visit Settings to personalize your app experience - change units, notifications, dashboard layout, and more.',
      icon: '⚙️',
      action: 'Open Settings',
      actionPath: '/settings',
    },
  ];

  // Smart tips based on user data and context
  const getContextualTips = () => {
    const tips = [];
    
    if (!user?.fitness_goal) {
      tips.push({
        title: 'Set Your Fitness Goal',
        content: 'Complete your profile to get personalized AI workout recommendations.',
        action: 'Complete Profile',
        actionPath: '/profile',
        priority: 'high',
      });
    }
    
    if (unlockedAchievements.length === 0) {
      tips.push({
        title: 'Unlock Your First Achievement',
        content: 'Complete a workout to earn your first achievement and start your fitness journey!',
        action: 'Start Workout',
        actionPath: '/workout-generator',
        priority: 'medium',
      });
    }
    
    if (!preferences.notifications?.workoutReminders) {
      tips.push({
        title: 'Enable Workout Reminders',
        content: 'Turn on notifications to stay consistent with your fitness routine.',
        action: 'Open Settings',
        actionPath: '/settings',
        priority: 'low',
      });
    }
    
    return tips.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  // Auto-show onboarding for new users
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('fitness-app-onboarding-completed');
    if (!hasSeenOnboarding && user && unlockedAchievements.length === 0) {
      setOnboardingOpen(true);
    }
  }, [user, unlockedAchievements]);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('fitness-app-onboarding-completed', 'true');
    setOnboardingOpen(false);
  };

  const handleStepNavigation = (direction) => {
    if (direction === 'next') {
      setActiveStep((prev) => Math.min(prev + 1, onboardingSteps.length - 1));
    } else {
      setActiveStep((prev) => Math.max(prev - 1, 0));
    }
  };

  const contextualTips = getContextualTips();
  const currentPageHelp = helpContent[page] || helpContent.dashboard;

  return (
    <>
      {/* Floating Help Button */}
      {showFAB && (
        <Zoom in>
          <Fab
            color="primary"
            onClick={() => setHelpOpen(true)}
            sx={{
              position: 'fixed',
              bottom: isMobile ? 80 : 24,
              right: 24,
              background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
              },
              zIndex: 1000,
            }}
          >
            <Help />
          </Fab>
        </Zoom>
      )}

      {/* Help Dialog */}
      <Dialog
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            background: 'rgba(26, 31, 46, 0.95)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: isMobile ? 0 : '24px',
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
            py: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
              }}
            >
              <Lightbulb />
            </Avatar>
            <Typography variant="h5" sx={{ fontFamily: 'inherit', fontWeight: 'inherit' }}>
              {currentPageHelp.title}
            </Typography>
          </Box>
          
          <IconButton onClick={() => setHelpOpen(false)} sx={{ color: '#94A3B8' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ py: 4 }}>
          {/* Contextual Tips */}
          {contextualTips.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 600,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <AutoAwesome sx={{ color: '#F59E0B' }} />
                Smart Tips for You
              </Typography>
              
              <Stack spacing={2}>
                {contextualTips.slice(0, 3).map((tip, index) => (
                  <Card
                    key={index}
                    sx={{
                      background: `rgba(${tip.priority === 'high' ? '239, 68, 68' : tip.priority === 'medium' ? '245, 158, 11' : '59, 130, 246'}, 0.1)`,
                      border: `1px solid rgba(${tip.priority === 'high' ? '239, 68, 68' : tip.priority === 'medium' ? '245, 158, 11' : '59, 130, 246'}, 0.2)`,
                      borderRadius: '12px',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
                        {tip.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 2 }}>
                        {tip.content}
                      </Typography>
                      {tip.action && (
                        <PrimaryButton
                          size="small"
                          onClick={() => {
                            setHelpOpen(false);
                            window.location.href = tip.actionPath;
                          }}
                        >
                          {tip.action}
                        </PrimaryButton>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}

          {/* Page-specific Help */}
          <Typography
            variant="h6"
            sx={{
              color: '#FFFFFF',
              fontWeight: 600,
              mb: 3,
            }}
          >
            How to Use This Page
          </Typography>
          
          <Stack spacing={3}>
            {currentPageHelp.sections.map((section, index) => (
              <Card
                key={index}
                sx={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar
                      sx={{
                        background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                        width: 40,
                        height: 40,
                      }}
                    >
                      {section.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                      {section.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#CBD5E1', lineHeight: 1.6 }}>
                    {section.content}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <SecondaryButton onClick={() => setOnboardingOpen(true)}>
            Show Tour
          </SecondaryButton>
          <PrimaryButton onClick={() => setHelpOpen(false)}>
            Got It!
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      {/* Onboarding Dialog */}
      <Dialog
        open={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            background: 'rgba(26, 31, 46, 0.95)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: isMobile ? 0 : '24px',
          }
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: '"Gravitas One", "Montserrat", sans-serif',
            fontWeight: 400,
            color: '#FFFFFF',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            py: 3,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
              fontSize: '2rem',
            }}
          >
            {onboardingSteps[activeStep]?.icon}
          </Avatar>
          
          <Typography variant="h5" sx={{ fontFamily: 'inherit', fontWeight: 'inherit' }}>
            Getting Started
          </Typography>
          
          <Typography variant="body2" sx={{ color: '#CBD5E1', mt: 1 }}>
            Step {activeStep + 1} of {onboardingSteps.length}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ py: 4, textAlign: 'center' }}>
          <Fade in key={activeStep}>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                {onboardingSteps[activeStep]?.title}
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: '#CBD5E1',
                  lineHeight: 1.6,
                  mb: 4,
                  maxWidth: 400,
                  mx: 'auto',
                }}
              >
                {onboardingSteps[activeStep]?.content}
              </Typography>

              {onboardingSteps[activeStep]?.action && (
                <PrimaryButton
                  onClick={() => {
                    setOnboardingOpen(false);
                    window.location.href = onboardingSteps[activeStep].actionPath;
                  }}
                  sx={{ mb: 2 }}
                >
                  {onboardingSteps[activeStep].action}
                </PrimaryButton>
              )}
            </Box>
          </Fade>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <SecondaryButton
            onClick={() => handleStepNavigation('prev')}
            disabled={activeStep === 0}
            startIcon={<NavigateBefore />}
          >
            Previous
          </SecondaryButton>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onboardingSteps.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: index <= activeStep 
                    ? 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)'
                    : 'rgba(255, 255, 255, 0.2)',
                }}
              />
            ))}
          </Box>
          
          {activeStep === onboardingSteps.length - 1 ? (
            <PrimaryButton
              onClick={handleCompleteOnboarding}
              endIcon={<CheckCircle />}
            >
              Complete Tour
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={() => handleStepNavigation('next')}
              endIcon={<NavigateNext />}
            >
              Next
            </PrimaryButton>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContextualHelp;