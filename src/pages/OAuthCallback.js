import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

function OAuthCallback() {
  const { handleOAuthCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // The token is sent by the backend in the URL's "hash" fragment.
    // Example: /auth/callback#access_token=...&token_type=bearer
    const hash = location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // remove the '#'
      const accessToken = params.get('access_token');

      if (accessToken) {
        // Use an async IIFE to handle the async callback handler.
        (async () => {
          const result = await handleOAuthCallback(accessToken);
          if (result.success) {
            // This is the redirect to the dashboard you mentioned.
            navigate('/');
          } else {
            // If handling the token fails, send back to login with an error.
            navigate('/login', { state: { error: result.error } });
          }
        })();
      } else {
        console.error("OAuth callback did not contain an access token.");
        navigate('/login', { state: { error: "Login failed: No access token received." } });
      }
    } else {
        console.error("OAuth callback was called without a hash fragment.");
        navigate('/login', { state: { error: "Login failed: Invalid callback." } });
    }
  }, [location, navigate]); // Intentionally omitting handleOAuthCallback to run only once.

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Finalizing login, please wait...</Typography>
    </Box>
  );
}

export default OAuthCallback;