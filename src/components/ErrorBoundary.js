// src/components/ErrorBoundary.js - Error Boundary Component

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import {
  ErrorOutline,
  Refresh,
  Home,
} from '@mui/icons-material';
import ModernCard from './ModernCard';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console (in production, send to error tracking service)
    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send to error tracking service (Sentry, etc.)
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 100%)',
            p: 3,
          }}
        >
          <Box sx={{ maxWidth: 600, width: '100%' }}>
            <ModernCard variant="glass">
              <Box sx={{ textAlign: 'center', py: 4 }}>
                {/* Error Icon */}
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '24px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '2px solid rgba(239, 68, 68, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <ErrorOutline sx={{ fontSize: 56, color: '#EF4444' }} />
                </Box>

                {/* Error Message */}
                <Typography
                  variant="h4"
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    mb: 2,
                    fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                  }}
                >
                  Oops! Something went wrong
                </Typography>

                <Typography variant="body1" sx={{ color: '#CBD5E1', mb: 4 }}>
                  We're sorry for the inconvenience. The application encountered an unexpected error.
                </Typography>

                {/* Development Mode Error Details */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <Box
                    sx={{
                      mb: 4,
                      p: 2,
                      borderRadius: '12px',
                      background: 'rgba(239, 68, 68, 0.05)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      textAlign: 'left',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#EF4444',
                        fontFamily: 'monospace',
                        display: 'block',
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      Error Details (Development Mode):
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#CBD5E1',
                        fontFamily: 'monospace',
                        display: 'block',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {this.state.error.toString()}
                    </Typography>
                  </Box>
                )}

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    onClick={this.handleGoHome}
                    startIcon={<Home />}
                    sx={{
                      background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                      color: '#FFFFFF',
                      textTransform: 'none',
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #00A8FF 0%, #6D28D9 100%)',
                      },
                    }}
                  >
                    Go to Homepage
                  </Button>
                  <Button
                    onClick={this.handleReload}
                    startIcon={<Refresh />}
                    sx={{
                      border: '1px solid rgba(0, 212, 255, 0.3)',
                      color: '#00D4FF',
                      textTransform: 'none',
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': {
                        background: 'rgba(0, 212, 255, 0.1)',
                        border: '1px solid rgba(0, 212, 255, 0.5)',
                      },
                    }}
                  >
                    Reload Page
                  </Button>
                </Stack>

                {/* Help Text */}
                <Typography
                  variant="caption"
                  sx={{
                    color: '#64748B',
                    display: 'block',
                    mt: 4,
                  }}
                >
                  If this problem persists, please contact support or try clearing your browser cache.
                </Typography>
              </Box>
            </ModernCard>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
