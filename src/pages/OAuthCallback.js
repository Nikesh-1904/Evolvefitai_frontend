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

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Check for error parameters
        const errorParam = searchParams.get('error');
        if (errorParam) {
          console.error('❌ OAuth error received:', errorParam);
          setError(decodeURIComponent(errorParam));
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Get the access token from URL params
        const accessToken = searchParams.get('access_token');
        const tokenType = searchParams.get('token_type');

        if (!accessToken) {
          console.error('❌ No access token found in callback URL');
          setError('No access token received from OAuth provider');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        console.log('✅ OAuth callback received, processing token...');

        // Handle the OAuth callback through AuthContext
        await handleOAuthCallback(accessToken);

        console.log('✅ OAuth login successful, redirecting to dashboard...');
        navigate('/');

      } catch (error) {
        console.error('❌ OAuth callback processing failed:', error);
        setError(error.message || 'OAuth authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processCallback();
  }, [searchParams, handleOAuthCallback, navigate]);

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
