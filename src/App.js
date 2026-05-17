// src/App.js

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import { AchievementsProvider } from './contexts/AchievementsContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Import components (always loaded)
import NavbarNew from './components/NavbarNew';
import Breadcrumbs from './components/Breadcrumbs';
import DynamicThemeWrapper from './components/DynamicThemeWrapper';
import ErrorBoundary from './components/ErrorBoundary';
import { Container, CircularProgress, Box } from '@mui/material';

// Eager load critical pages (for faster first render)
import LoginPage from './pages/LoginPage';
import OAuthCallback from './pages/OAuthCallback';
import OnboardingPage from './pages/OnboardingPage';

// Lazy load all other pages (code splitting)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WorkoutGenerator = lazy(() => import('./pages/WorkoutGenerator'));
const WorkoutHistory = lazy(() => import('./pages/WorkoutHistory'));
const Profile = lazy(() => import('./pages/Profile'));
const Analytics = lazy(() => import('./pages/Analytics'));
const WorkoutSession = lazy(() => import('./pages/WorkoutSession'));
const FreestyleLog = lazy(() => import('./pages/FreestyleLog'));
const WorkoutPlanDetail = lazy(() => import('./pages/WorkoutPlanDetail'));
const UserPreferences = lazy(() => import('./components/UserPreferences'));
const AchievementsPanel = lazy(() => import('./components/AchievementsPanel'));
const Notifications = lazy(() => import('./pages/Notifications'));
const ExerciseLibrary = lazy(() => import('./pages/ExerciseLibrary'));
const WorkoutRecommendations = lazy(() => import('./pages/WorkoutRecommendations'));

// Loading fallback component
const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <CircularProgress
      size={48}
      sx={{
        color: '#00D4FF',
      }}
    />
    <Box
      sx={{
        color: '#94A3B8',
        fontSize: '0.875rem',
        fontWeight: 500,
      }}
    >
      Loading...
    </Box>
  </Box>
);

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
            <Suspense fallback={<PageLoader />}>
              <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/generate-workout" element={<WorkoutGenerator />} />
            <Route path="/workout-session" element={<WorkoutSession />} />
            <Route path="/log-workout" element={<FreestyleLog />} />
            <Route path="/workout-history" element={<WorkoutHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/exercises" element={<ExerciseLibrary />} />
            <Route path="/workout-recommendations" element={<WorkoutRecommendations />} />
            <Route path="/workout-plan/:planId" element={<WorkoutPlanDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/settings" element={<UserPreferences />} />
            <Route path="/achievements" element={<AchievementsPanel />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Fallback route for any other logged-in paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
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
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;