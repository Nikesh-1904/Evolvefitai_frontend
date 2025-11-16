// src/components/GymQRCodeDisplay.js - Display QR Code for Gym Check-in

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import {
  QrCode2,
  Refresh,
  Download,
  Info,
} from '@mui/icons-material';
import ModernCard from './ModernCard';
import authService from '../services/api/authService';

/**
 * GymQRCodeDisplay Component
 * Displays user's QR code for gym check-in
 *
 * NOTE: This component requires 'qrcode.react' library to be installed:
 * npm install qrcode.react
 *
 * Once installed, uncomment the QRCodeSVG import and usage below
 */

// TODO: Uncomment this line after installing qrcode.react
// import { QRCodeSVG } from 'qrcode.react';

function GymQRCodeDisplay() {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQRCode();
  }, []);

  const fetchQRCode = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await authService.getUserQRCode();
      setQrData(data);
    } catch (err) {
      console.error('Failed to fetch QR code:', err);
      setError('Failed to load QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrData) return;

    // Create a canvas with the QR code
    const canvas = document.getElementById('gym-qr-code-canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `gym-qr-code-${Date.now()}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <ModernCard
      title="Your Gym QR Code"
      subtitle="Show this code at the gym entrance for check-in"
      variant="glass"
    >
      <Box sx={{ textAlign: 'center' }}>
        {loading && (
          <Box sx={{ py: 6 }}>
            <CircularProgress sx={{ color: '#00D4FF' }} />
            <Typography variant="body2" sx={{ color: '#94A3B8', mt: 2 }}>
              Loading your QR code...
            </Typography>
          </Box>
        )}

        {error && !loading && (
          <Box sx={{ py: 4 }}>
            <Typography variant="body1" sx={{ color: '#EF4444', mb: 2 }}>
              {error}
            </Typography>
            <Button
              onClick={fetchQRCode}
              startIcon={<Refresh />}
              sx={{
                color: '#00D4FF',
                textTransform: 'none',
                '&:hover': {
                  background: 'rgba(0, 212, 255, 0.1)',
                },
              }}
            >
              Retry
            </Button>
          </Box>
        )}

        {!loading && !error && qrData && (
          <>
            {/* QR Code Display */}
            <Box
              sx={{
                p: 4,
                borderRadius: '24px',
                background: '#FFFFFF',
                display: 'inline-block',
                mb: 3,
                boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2)',
              }}
            >
              {/* TODO: Uncomment this after installing qrcode.react */}
              {/* <QRCodeSVG
                value={qrData.qr_code_data || qrData.user_id || 'No Data'}
                size={256}
                level="H"
                includeMargin={true}
                fgColor="#0A0E1A"
                id="gym-qr-code-canvas"
              /> */}

              {/* Temporary Placeholder - Remove after uncommenting QRCodeSVG */}
              <Box
                sx={{
                  width: 256,
                  height: 256,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                  borderRadius: '16px',
                }}
              >
                <Stack spacing={2} alignItems="center">
                  <QrCode2 sx={{ fontSize: 80, color: '#00D4FF' }} />
                  <Typography
                    variant="caption"
                    sx={{ color: '#64748B', maxWidth: 200, textAlign: 'center' }}
                  >
                    QR Code will appear here
                    <br />
                    (Install qrcode.react library)
                  </Typography>
                </Stack>
              </Box>
            </Box>

            {/* QR Code Info */}
            <Stack spacing={2} alignItems="center">
              <Chip
                icon={<Info />}
                label="Valid for 30 days"
                sx={{
                  background: 'rgba(0, 212, 255, 0.1)',
                  color: '#00D4FF',
                  fontWeight: 600,
                }}
              />

              {qrData.expires_at && (
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Expires: {new Date(qrData.expires_at).toLocaleDateString()}
                </Typography>
              )}

              {/* Action Buttons */}
              <Stack direction="row" spacing={2}>
                <Button
                  onClick={fetchQRCode}
                  startIcon={<Refresh />}
                  sx={{
                    color: '#00D4FF',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'rgba(0, 212, 255, 0.1)',
                    },
                  }}
                >
                  Refresh
                </Button>
                <Button
                  onClick={handleDownload}
                  startIcon={<Download />}
                  sx={{
                    background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    px: 3,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #00A8FF 0%, #6D28D9 100%)',
                    },
                  }}
                >
                  Download
                </Button>
              </Stack>
            </Stack>

            {/* Instructions */}
            <Box
              sx={{
                mt: 4,
                p: 3,
                borderRadius: '16px',
                background: 'rgba(124, 58, 237, 0.1)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: '#FFFFFF', fontWeight: 600, mb: 1 }}
              >
                How to use:
              </Typography>
              <Typography variant="caption" sx={{ color: '#CBD5E1', display: 'block' }}>
                1. Show this QR code at your gym's entrance
                <br />
                2. Staff will scan it to check you in
                <br />
                3. Gym attendance will be automatically tracked
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </ModernCard>
  );
}

export default GymQRCodeDisplay;
