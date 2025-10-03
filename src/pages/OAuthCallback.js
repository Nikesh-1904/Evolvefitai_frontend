// src/pages/OAuthCallback.js - Definitive Version
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

function OAuthCallback() {
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Step 1: Get the URL fragment (the part after '#')
        const hash = window.location.hash;

        if (!hash) {
          throw new Error('Authentication token not found in URL. The authentication provider might be misconfigured.');
        }

        // Step 2: Parse the fragment to get the token
        const params = new URLSearchParams(hash.substring(1)); // Remove the leading '#'
        const accessToken = params.get('access_token');

        if (!accessToken) {
          throw new Error('Authentication failed: Access token is missing from the callback URL.');
        }
        
        console.log('✅ OAuth callback successful. Processing token...');

        // Step 3: Pass the token to the AuthContext to be processed
        await handleOAuthCallback(accessToken);

        console.log('✅ User session established. Redirecting to dashboard...');
        
        // Step 4: Navigate to the dashboard, replacing the callback URL in history
        navigate('/', { replace: true });

      } catch (err) {
        console.error('❌ OAuth callback processing failed:', err);
        setError(err.message || 'An unexpected error occurred during login.');
        
        // Redirect back to login after showing the error for a few seconds
        setTimeout(() => navigate('/login', { replace: true }), 4000);
      }
    };

    processAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // The empty dependency array [] is crucial. It ensures this runs ONLY ONCE.

  return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 100%)',
          color: 'white',
          p: 4,
          textAlign: 'center',
        }}
      >
        {error ? (
          <>
            <Alert severity="error" sx={{ mb: 3, maxWidth: 400 }}>{error}</Alert>
            <Typography variant="body1" color="text.secondary">Redirecting to login page...</Typography>
          </>
        ) : (
          <>
            <CircularProgress size={60} sx={{ color: '#00D4FF', mb: 3 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>Finalizing Authentication...</Typography>
            <Typography variant="body2" color="text.secondary">Please wait while we securely set up your session.</Typography>
          </>
        )}
      </Box>
  );
}

export default OAuthCallback;