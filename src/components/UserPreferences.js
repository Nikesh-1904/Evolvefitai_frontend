// src/components/UserPreferences.js - Comprehensive Settings Panel

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Switch,
  FormGroup,
  FormControlLabel,
  Tabs,
  Tab,
  Stack,
  Avatar,
  Divider,
  Chip,
  Alert,
  Slider,
} from '@mui/material';
import {
  Settings,
  Palette,
  Notifications,
  Security,
  Accessibility,
  Dashboard,
  FitnessCenter,
  Psychology,
  Language,
  Save,
} from '@mui/icons-material';

// Import our contexts and components
import { usePreferences } from '../contexts/PreferencesContext';
import ModernCard from './ModernCard';
import ModernInput, { ModernSelect } from './ModernInput';
import { PrimaryButton, SecondaryButton } from './ModernButton';

function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`preferences-tabpanel-${index}`}
      aria-labelledby={`preferences-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const UserPreferences = ({ onClose }) => {
  const {
    preferences,
    setTopLevelPreference, // 👈 --- GET NEW FUNCTION
    setPreference,
    setNestedPreference,
    resetPreferences,
    convertWeight,
    convertHeight,
    getUnitLabel,
  } = usePreferences();

  const [activeTab, setActiveTab] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTopLevelChange = (key, value) => {
    setTopLevelPreference(key, value); // e.g., setTopLevelPreference('theme', 'dark')
    setUnsavedChanges(true);
  };

  const handleNestedChange = (category, key, value) => {
    setPreference(category, key, value); // e.g., setPreference('notifications', 'workoutReminders', true)
    setUnsavedChanges(true);
  };

  const handleSavePreferences = () => {
    // Preferences are automatically saved via context
    setUnsavedChanges(false);
    if (onClose) onClose();
  };

  const handleResetPreferences = () => {
    resetPreferences();
    setUnsavedChanges(false);
  };

  const themeOptions = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' },
    { value: 'auto', label: 'System Default' },
  ];

  const unitOptions = {
    weight: [
      { value: 'kg', label: 'Kilograms (kg)' },
      { value: 'lbs', label: 'Pounds (lbs)' },
    ],
    height: [
      { value: 'cm', label: 'Centimeters (cm)' },
      { value: 'ft/in', label: 'Feet & Inches' },
    ],
    distance: [
      { value: 'km', label: 'Kilometers (km)' },
      { value: 'miles', label: 'Miles' },
    ],
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <ModernCard variant="feature" elevation="high" sx={{ mb: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 3,
              background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
            }}
          >
            <Settings sx={{ fontSize: '2rem' }} />
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
            User Preferences
          </Typography>
          
          <Typography variant="h6" sx={{ color: '#CBD5E1' }}>
            Customize your fitness experience
          </Typography>
        </Box>
      </ModernCard>

      {/* Unsaved Changes Alert */}
      {unsavedChanges && (
        <Alert
          severity="info"
          sx={{
            mb: 3,
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            '& .MuiAlert-message': { color: '#FFFFFF' },
          }}
        >
          You have unsaved changes. Don't forget to save your preferences!
        </Alert>
      )}

      {/* Navigation Tabs */}
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
          <Tab icon={<Palette />} label="Appearance" iconPosition="start" />
          <Tab icon={<Language />} label="Units & Format" iconPosition="start" />
          <Tab icon={<Notifications />} label="Notifications" iconPosition="start" />
          <Tab icon={<Dashboard />} label="Dashboard" iconPosition="start" />
          <Tab icon={<FitnessCenter />} label="Workout" iconPosition="start" />
          <Tab icon={<Psychology />} label="AI Features" iconPosition="start" />
          <Tab icon={<Security />} label="Privacy" iconPosition="start" />
          <Tab icon={<Accessibility />} label="Accessibility" iconPosition="start" />
        </Tabs>
      </ModernCard>

      {/* Appearance Tab */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ModernCard title="Theme Settings" variant="glass">
              <Stack spacing={3}>
                <ModernSelect
                  label="App Theme"
                  value={preferences.theme}
                  onChange={(e) => handleTopLevelChange('theme', e.target.value)}
                  options={themeOptions}
                  fullWidth
                />
                
                <Box>
                  <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
                    Primary Color
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {['#00D4FF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((color) => (
                      <Box
                        key={color}
                        onClick={() => handleTopLevelChange('primaryColor', color)}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: color,
                          cursor: 'pointer',
                          border: preferences.primaryColor === color 
                            ? '3px solid #FFFFFF' 
                            : '2px solid transparent',
                          transform: preferences.primaryColor === color ? 'scale(1.1)' : 'scale(1)',
                          transition: 'all 0.3s ease',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Stack>
            </ModernCard>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ModernCard title="Display Options" variant="glass">
              <Stack spacing={2}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.accessibility?.highContrast || false}
                        onChange={(e) => handleNestedChange('accessibility', 'highContrast', e.target.checked)}
                        sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                      />
                    }
                    label="High Contrast Mode"
                    sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.accessibility?.largeText || false}
                        onChange={(e) => handleNestedChange('accessibility', 'largeText', e.target.checked)}
                        sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                      />
                    }
                    label="Large Text Size"
                    sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.accessibility?.reduceMotion || false}
                        onChange={(e) => handleNestedChange('accessibility', 'reduceMotion', e.target.checked)}
                        sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                      />
                    }
                    label="Reduce Motion & Animations"
                    sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
                  />
                </FormGroup>
              </Stack>
            </ModernCard>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Units & Format Tab */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ModernCard title="Measurement Units" variant="glass">
              <Stack spacing={3}>
                <ModernSelect
                  label="Weight Unit"
                  value={preferences.weightUnit}
                  onChange={(e) => handleTopLevelChange('weightUnit', e.target.value)}
                  options={unitOptions.weight}
                  fullWidth
                />
                
                <ModernSelect
                  label="Height Unit"
                  value={preferences.heightUnit}
                  onChange={(e) => handleTopLevelChange('heightUnit', e.target.value)}
                  options={unitOptions.height}
                  fullWidth
                />
                
                <ModernSelect
                  label="Distance Unit"
                  value={preferences.distanceUnit}
                  onChange={(e) => handleTopLevelChange('distanceUnit', e.target.value)}
                  options={unitOptions.distance}
                  fullWidth
                />
              </Stack>
            </ModernCard>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ModernCard title="Preview" variant="glass">
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
                    Sample Weight Display:
                  </Typography>
                  <Chip
                    label={`70 ${getUnitLabel('weight')} (${convertWeight(70)} ${getUnitLabel('weight')})`}
                    sx={{ background: 'rgba(0, 212, 255, 0.2)', color: '#00D4FF' }}
                  />
                </Box>
                
                <Box>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
                    Sample Height Display:
                  </Typography>
                  <Chip
                    label={convertHeight(175)}
                    sx={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}
                  />
                </Box>
                
                <Box>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
                    Sample Distance Display:
                  </Typography>
                  <Chip
                    label={`${convertWeight(5)} ${getUnitLabel('distance')}`}
                    sx={{ background: 'rgba(124, 58, 237, 0.2)', color: '#7C3AED' }}
                  />
                </Box>
              </Stack>
            </ModernCard>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ModernCard title="Notification Types" variant="glass">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications?.workoutReminders || false}
                      onChange={(e) => handleNestedChange('notifications', 'workoutReminders', e.target.checked)}
                      sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                    />
                  }
                  label="Workout Reminders"
                  sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications?.progressUpdates || false}
                      onChange={(e) => handleNestedChange('notifications', 'progressUpdates', e.target.checked)}
                      sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                    />
                  }
                  label="Progress Updates"
                  sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications?.achievementAlerts || false}
                      onChange={(e) => handleNestedChange('notifications', 'progressUpdates', e.target.checked)}
                      sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                    />
                  }
                  label="Achievement Alerts"
                  sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications?.mealPlanReminders || false}
                      onChange={(e) => handlePreferenceChange('notifications', 'mealPlanReminders', e.target.checked)}
                      sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                    />
                  }
                  label="Meal Plan Reminders"
                  sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications?.weeklyReports || false}
                      onChange={(e) => handleNestedChange('notifications', 'progressUpdates', e.target.checked)}
                      sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                    />
                  }
                  label="Weekly Progress Reports"
                  sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
                />
              </FormGroup>
            </ModernCard>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ModernCard title="Delivery Methods" variant="glass">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications?.pushNotifications || false}
                      onChange={(e) => handleNestedChange('notifications', 'pushNotifications', e.target.checked)}
                      sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                    />
                  }
                  label="Push Notifications"
                  sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications?.emailNotifications || false}
                      onChange={(e) => handleNestedChange('notifications', 'pushNotifications', e.target.checked)}
                      sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                    />
                  }
                  label="Email Notifications"
                  sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
                />
              </FormGroup>
            </ModernCard>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Dashboard Tab */}
      <TabPanel value={activeTab} index={3}>
        <ModernCard title="Dashboard Layout" variant="glass">
          <Stack spacing={3}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
              Customize which widgets appear on your dashboard
            </Typography>
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.dashboardLayout?.showQuickStats || false}
                    onChange={(e) => handleNestedChange('dashboardLayout', 'showQuickStats', e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                  />
                }
                label="Quick Statistics Cards"
                sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.dashboardLayout?.showRecentWorkouts || false}
                    onChange={(e) => handleNestedChange('dashboardLayout', 'showQuickStats', e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                  />
                }
                label="Recent Workouts"
                sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.dashboardLayout?.showWorkoutPlans || false}
                    onChange={(e) => handleNestedChange('dashboardLayout', 'showQuickStats', e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                  />
                }
                label="Workout Plans"
                sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.dashboardLayout?.showAchievements || false}
                    onChange={(e) => handleNestedChange('dashboardLayout', 'showQuickStats', e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                  />
                }
                label="Achievements & Progress"
                sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.dashboardLayout?.showMotivationalQuotes || false}
                    onChange={(e) => handleNestedChange('dashboardLayout', 'showQuickStats', e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                  />
                }
                label="Motivational Quotes"
                sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
              />
            </FormGroup>
          </Stack>
        </ModernCard>
      </TabPanel>

      {/* Workout Tab */}
      <TabPanel value={activeTab} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ModernCard title="Workout Settings" variant="glass">
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body1" sx={{ color: '#FFFFFF', mb: 2 }}>
                    Default Rest Time: {preferences.workoutPreferences?.defaultRestTime || 60} seconds
                  </Typography>
                  <Slider
                    value={preferences.workoutPreferences?.defaultRestTime || 60}
                    onChange={(e, value) => handleNestedChange('workoutPreferences', 'defaultRestTime', value)}
                    min={30}
                    max={300}
                    step={15}
                    marks={[
                      { value: 30, label: '30s' },
                      { value: 60, label: '1m' },
                      { value: 120, label: '2m' },
                      { value: 300, label: '5m' },
                    ]}
                    sx={{
                      '& .MuiSlider-thumb': {
                        background: '#00D4FF',
                      },
                      '& .MuiSlider-track': {
                        background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                      },
                    }}
                  />
                </Box>
                
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.workoutPreferences?.autoStartTimer || false}
                        onChange={(e) => handleNestedChange('workoutPreferences', 'autoStartTimer', e.target.checked)}
                        sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                      />
                    }
                    label="Auto-start Rest Timer"
                    sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.workoutPreferences?.playCompletionSounds || false}
                        onChange={(e) => handleNestedChange('workoutPreferences', 'playCompletionSounds', e.target.checked)}
                        sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                      />
                    }
                    label="Play Completion Sounds"
                    sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.workoutPreferences?.showExerciseVideos || false}
                        onChange={(e) => handleNestedChange('workoutPreferences', 'showExerciseVideos', e.target.checked)}
                        sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                      />
                    }
                    label="Show Exercise Videos"
                    sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
                  />
                </FormGroup>
              </Stack>
            </ModernCard>
          </Grid>
        </Grid>
      </TabPanel>

      {/* AI Features Tab */}
      <TabPanel value={activeTab} index={5}>
        <ModernCard title="AI Personalization" variant="glass">
          <Stack spacing={3}>
            <Typography variant="body1" sx={{ color: '#CBD5E1', mb: 2 }}>
              Control how AI features personalize your fitness experience
            </Typography>
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.aiPreferences?.personalizedRecommendations || false}
                    onChange={(e) => handleNestedChange('aiPreferences', 'personalizedRecommendations', e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                  />
                }
                label="Personalized Exercise Recommendations"
                sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.aiPreferences?.adaptiveDifficulty || false}
                    onChange={(e) => handleNestedChange('aiPreferences', 'adaptiveDifficulty', e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                  />
                }
                label="Adaptive Workout Difficulty"
                sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.aiPreferences?.predictiveScheduling || false}
                    onChange={(e) => handleNestedChange('aiPreferences', 'predictiveScheduling', e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                  />
                }
                label="Predictive Workout Scheduling"
                sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.aiPreferences?.contextAwareSuggestions || false}
                    onChange={(e) => handleNestedChange('aiPreferences', 'contextAwareSuggestions', e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                  />
                }
                label="Context-aware Suggestions"
                sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
              />
            </FormGroup>
          </Stack>
        </ModernCard>
      </TabPanel>

      {/* Privacy Tab */}
      <TabPanel value={activeTab} index={6}>
        <ModernCard title="Privacy & Data" variant="glass">
          <Stack spacing={3}>
            <Typography variant="body1" sx={{ color: '#CBD5E1', mb: 2 }}>
              Control your data privacy and sharing preferences
            </Typography>
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.privacy?.shareProgressPublicly || false}
                    onChange={(e) => handleNestedChange('privacy', 'shareProgressPublicly', e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                  />
                }
                label="Share Progress Publicly"
                sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.privacy?.allowDataForResearch || false}
                    onChange={(e) => handleNestedChange('privacy', 'allowDataForResearch', e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                  />
                }
                label="Allow Data for Fitness Research"
                sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.privacy?.anonymizeData || false}
                    onChange={(e) => handleNestedChange('privacy', 'anonymizeData', e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                  />
                }
                label="Anonymize Personal Data"
                sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
              />
            </FormGroup>
          </Stack>
        </ModernCard>
      </TabPanel>

      {/* Accessibility Tab */}
      <TabPanel value={activeTab} index={7}>
        <ModernCard title="Accessibility Options" variant="glass">
          <Stack spacing={3}>
            <Typography variant="body1" sx={{ color: '#CBD5E1', mb: 2 }}>
              Make the app more accessible and comfortable for your needs
            </Typography>
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.accessibility?.highContrast || false}
                    onChange={(e) => handleNestedChange('accessibility', 'highContrast', e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                  />
                }
                label="High Contrast Mode"
                sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.accessibility?.largeText || false}
                    onChange={(e) => handleNestedChange('accessibility', 'largeText', e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                  />
                }
                label="Large Text Size"
                sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.accessibility?.reduceMotion || false}
                    onChange={(e) => handleNestedChange('accessibility', 'reduceMotion', e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                  />
                }
                label="Reduce Motion & Animations"
                sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.accessibility?.screenReaderOptimized || false}
                    onChange={(e) => handleNestedChange('accessibility', 'screenReaderOptimized', e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { background: '#00D4FF' } }}
                  />
                }
                label="Screen Reader Optimization"
                sx={{ '& .MuiFormControlLabel-label': { color: '#CBD5E1' } }}
              />
            </FormGroup>
          </Stack>
        </ModernCard>
      </TabPanel>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
        <SecondaryButton
          onClick={handleResetPreferences}
          color="error"
        >
          Reset to Defaults
        </SecondaryButton>
        
        <PrimaryButton
          onClick={handleSavePreferences}
          startIcon={<Save />}
          size="large"
        >
          Save Preferences
        </PrimaryButton>
      </Box>
    </Container>
  );
};

export default UserPreferences;