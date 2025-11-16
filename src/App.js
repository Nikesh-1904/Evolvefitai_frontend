// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import { AchievementsProvider } from './contexts/AchievementsContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Import components
import NavbarNew from './components/NavbarNew';
import Breadcrumbs from './components/Breadcrumbs';
import DynamicThemeWrapper from './components/DynamicThemeWrapper';
import { Container } from '@mui/material';

// Import pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import WorkoutGenerator from './pages/WorkoutGenerator';
import WorkoutHistory from './pages/WorkoutHistory';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import WorkoutSession from './pages/WorkoutSession';
import FreestyleLog from './pages/FreestyleLog';
import MealPlanGenerator from './pages/MealPlanGenerator';
import WorkoutPlanDetail from './pages/WorkoutPlanDetail';
import OAuthCallback from './pages/OAuthCallback';
import OnboardingPage from './pages/OnboardingPage';
import UserPreferences from './components/UserPreferences';
import AchievementsPanel from './components/AchievementsPanel';
import CommunityLeaderboard from './pages/CommunityLeaderboard';
import Notifications from './pages/Notifications';
import MealPlanLibrary from './pages/MealPlanLibrary';
import ExerciseLibrary from './pages/ExerciseLibrary';
import WorkoutRecommendations from './pages/WorkoutRecommendations';
import GymDiscovery from './pages/GymDiscovery';
import GymBookings from './pages/GymBookings';

// This component handles the core logic for redirecting users
function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0A0E1A' }}>
        {/* You can replace this with a more sophisticated spinner component if you like */}
        <p style={{ color: 'white' }}>Loading Application...</p>
      </div>
    );
  }

  // If user is logged in but HAS NOT completed onboarding, force them to the onboarding page
  if (user && !user.has_completed_onboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If user is logged in AND HAS completed onboarding, show the main app
  if (user) {
    return (
      <>
        <NavbarNew />
        <div style={{ paddingTop: '80px' }}>
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <Breadcrumbs />
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/generate-workout" element={<WorkoutGenerator />} />
            <Route path="/workout-session" element={<WorkoutSession />} />
            <Route path="/log-workout" element={<FreestyleLog />} />
            <Route path="/workout-history" element={<WorkoutHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/meal-plan-generator" element={<MealPlanGenerator />} />
            <Route path="/meal-plans" element={<MealPlanLibrary />} />
            <Route path="/exercises" element={<ExerciseLibrary />} />
            <Route path="/workout-recommendations" element={<WorkoutRecommendations />} />
            <Route path="/gyms" element={<GymDiscovery />} />
            <Route path="/gym-bookings" element={<GymBookings />} />
            <Route path="/workout-plan/:planId" element={<WorkoutPlanDetail />} />
            <Route path="/analytics" element={<Analytics />} /> {/* <-- THIS ROUTE WAS MISSING */}
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/settings" element={<UserPreferences />} />
            <Route path="/achievements" element={<AchievementsPanel />} />
            <Route path="/leaderboard" element={<CommunityLeaderboard />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Fallback route for any other logged-in paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Container>
        </div>
      </>
    );
  }

  // If user is not logged in, only show public pages
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />
      {/* Any other public pages would go here */}

      {/* Fallback for any other logged-out paths, redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
      <AuthProvider>
        <PreferencesProvider>
          <AchievementsProvider>
            <NotificationProvider>
              <DynamicThemeWrapper> {/* Reads preferences and applies the correct theme */}
                <Router>
                  <AppRoutes />
                </Router>
              </DynamicThemeWrapper>
            </NotificationProvider>
          </AchievementsProvider>
        </PreferencesProvider>
      </AuthProvider>
  );
}

export default App;