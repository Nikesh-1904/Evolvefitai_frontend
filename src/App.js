// src/App.js - Complete Modern App with Theme Provider

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import the modern theme
import modernFitnessTheme from './theme/modernFitnessTheme';

// Import components
import Navbar from './components/Navbar';

// Import pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import WorkoutGenerator from './pages/WorkoutGenerator';
import WorkoutHistory from './pages/WorkoutHistory';
import Profile from './pages/Profile';
import WorkoutSession from './pages/WorkoutSession';
import FreestyleLog from './pages/FreestyleLog';
import MealPlanGenerator from './pages/MealPlanGenerator';
import OAuthCallback from './pages/OAuthCallback';

// Protected Route component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 50%, #252A3D 100%)',
        color: 'white'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(0, 212, 255, 0.3)',
            borderTop: '3px solid #00D4FF',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ fontSize: '1.1rem' }}>Loading EvolveFitAI...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public Route component (for login page)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 50%, #252A3D 100%)',
        color: 'white'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(0, 212, 255, 0.3)',
            borderTop: '3px solid #00D4FF',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ fontSize: '1.1rem' }}>Initializing...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <ThemeProvider theme={modernFitnessTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } 
              />
              <Route path="/oauth/callback" element={<OAuthCallback />} />

              {/* Protected Routes */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <Navbar />
                  <div style={{ paddingTop: '80px' }}> {/* Account for fixed navbar */}
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/generate-workout" element={<WorkoutGenerator />} />
                      <Route path="/workout-session" element={<WorkoutSession />} />
                      <Route path="/log-workout" element={<FreestyleLog />} />
                      <Route path="/workout-history" element={<WorkoutHistory />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/meal-plan-generator" element={<MealPlanGenerator />} />

                      {/* Fallback route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
