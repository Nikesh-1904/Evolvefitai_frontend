// src/pages/OAuthCallback.js - Fixed OAuth Callback Handler

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleOAuthCallback } = useAuth();
  const [error, setError] = useState('');

// src/pages/OAuthCallback.js - CORRECTED
  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get the fragment from the URL (e.g., '#access_token=...')
        const hash = window.location.hash;

        if (!hash) {
          throw new Error('Authentication failed: No token found in URL.');
        }

        // Use URLSearchParams to easily parse the fragment string
        const params = new URLSearchParams(hash.substring(1)); // Remove the leading '#'
        const accessToken = params.get('access_token');

        if (!accessToken) {
          throw new Error('Authentication failed: Access token is missing.');
        }
        
        console.log('✅ OAuth callback received, processing token...');

        // Handle the OAuth callback through AuthContext
        await handleOAuthCallback(accessToken);

        console.log('✅ OAuth login successful, redirecting to dashboard...');
        
        // Use navigate with replace to prevent the user from going "back" to the callback page
        navigate('/', { replace: true });

      } catch (err) {
        console.error('❌ OAuth callback processing failed:', err);
        setError(err.message || 'OAuth authentication failed.');
        
        // Redirect back to login after showing the error for a few seconds
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    processCallback();
    // We only want this to run once, and the dependencies are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 50%, #252A3D 100%)',
        color: 'white',
        p: 4,
      }}
    >
      {error ? (
        <Box textAlign="center">
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              maxWidth: 400,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444'
            }}
          >
            {error}
          </Alert>
          <Typography variant="body1" sx={{ color: '#94A3B8' }}>
            Redirecting to login page...
          </Typography>
        </Box>
      ) : (
        <Box textAlign="center">
          <CircularProgress
            size={60}
            sx={{
              color: '#00D4FF',
              mb: 3,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Completing your login...
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', maxWidth: 400 }}>
            Please wait while we securely authenticate your account with Google.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default OAuthCallback;
