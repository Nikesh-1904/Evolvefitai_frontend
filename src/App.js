import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import WorkoutGenerator from './pages/WorkoutGenerator';
import WorkoutHistory from './pages/WorkoutHistory';
import Profile from './pages/Profile';
// --- 1. IMPORT THE NEW COMPONENT ---
import OAuthCallback from './pages/OAuthCallback';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
});

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    // You might want a better loading spinner here
    return <div>Loading session...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

// We need a wrapper for our routes so they can use the useAuth hook
// which requires being inside the AuthProvider.
function AppRoutes() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* --- 2. ADD THE NEW ROUTE --- */}
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Navbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/generate-workout" element={<WorkoutGenerator />} />
                <Route path="/workout-history" element={<WorkoutHistory />} />
                <Route path="/profile" element={<Profile />} />
                {/* Add a catch-all for any other protected routes */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* AuthProvider now correctly wraps the routes */}
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;