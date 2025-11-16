// src/components/FormCorrectionAI.js - AI-Powered Exercise Form Analysis

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Stack,
  Avatar,
  Chip,
  LinearProgress,
  Grid,
  Divider,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Videocam,
  Close,
  FitnessCenter,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  PlayArrow,
  Stop,
  Upload,
  Refresh,
  TrendingUp,
  RadioButtonChecked,
} from '@mui/icons-material';
import { Alert } from './design-system';
import { PrimaryButton, SecondaryButton } from './ModernButton';

const FormCorrectionAI = ({ isOpen, onClose, onFormAnalyzed }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError('');
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Start recording
  const startRecording = () => {
    if (!streamRef.current) {
      setError('Camera not initialized');
      return;
    }

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm',
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedVideo(blob);
      setVideoPreview(URL.createObjectURL(blob));
      stopCamera();
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setRecordingTime(0);

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Handle file upload
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }

      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setError('Video size must be less than 100MB');
        return;
      }

      setRecordedVideo(file);
      setVideoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  // Analyze form with AI
  const analyzeForm = async () => {
    if (!recordedVideo) {
      setError('Please record or upload a video first');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // Convert video to base64 (for smaller videos) or use FormData for larger files
      const formData = new FormData();
      formData.append('video', recordedVideo);

      const response = await fetch('/api/v1/ai/analyze-exercise-form', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze exercise form');
      }

      const data = await response.json();
      setAnalysis(data);

      // Notify parent component
      if (onFormAnalyzed) {
        onFormAnalyzed(data);
      }
    } catch (err) {
      console.error('Error analyzing form:', err);
      setError(err.message || 'Failed to analyze exercise form');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset state
  const handleReset = () => {
    stopRecording();
    stopCamera();
    setRecordedVideo(null);
    setVideoPreview(null);
    setAnalysis(null);
    setError('');
    setRecordingTime(0);
  };

  // Close and reset
  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#FF3366';
      case 'warning': return '#F59E0B';
      case 'info': return '#00D4FF';
      case 'good': return '#10B981';
      default: return '#94A3B8';
    }
  };

  // Get severity icon
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <ErrorIcon />;
      case 'warning': return <Warning />;
      case 'good': return <CheckCircle />;
      default: return <RadioButtonChecked />;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(26, 31, 46, 0.95)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pb: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{
            width: 48,
            height: 48,
            background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
          }}>
            <FitnessCenter />
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Gravitas One", "Montserrat", sans-serif',
                fontWeight: 400,
                color: '#FFFFFF',
              }}
            >
              AI Form Correction
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              {isRecording ? `Recording... ${formatTime(recordingTime)}` : 'Record or upload your exercise video'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: '#94A3B8' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Video Section */}
          <Grid item xs={12} md={analysis ? 6 : 12}>
            {!videoPreview && (
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#000',
                  aspectRatio: '16/9',
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {isRecording && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 1,
                      borderRadius: '12px',
                      background: 'rgba(255, 51, 102, 0.9)',
                      color: '#FFFFFF',
                    }}
                  >
                    <RadioButtonChecked sx={{ fontSize: '1rem', animation: 'pulse 1s infinite' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      REC {formatTime(recordingTime)}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {videoPreview && (
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#000',
                }}
              >
                <video
                  src={videoPreview}
                  controls
                  style={{
                    width: '100%',
                    display: 'block',
                  }}
                />
              </Box>
            )}

            {/* Controls */}
            {!videoPreview && (
              <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="center">
                {!isRecording ? (
                  <>
                    <PrimaryButton
                      onClick={async () => {
                        await startCamera();
                        setTimeout(startRecording, 500);
                      }}
                      startIcon={<Videocam />}
                      sx={{ minWidth: '180px' }}
                    >
                      Start Recording
                    </PrimaryButton>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                    <SecondaryButton
                      onClick={() => fileInputRef.current?.click()}
                      startIcon={<Upload />}
                      sx={{ minWidth: '180px' }}
                    >
                      Upload Video
                    </SecondaryButton>
                  </>
                ) : (
                  <PrimaryButton
                    onClick={stopRecording}
                    startIcon={<Stop />}
                    sx={{
                      minWidth: '200px',
                      background: 'linear-gradient(135deg, #FF3366 0%, #FF6B9D 100%)',
                    }}
                  >
                    Stop Recording
                  </PrimaryButton>
                )}
              </Stack>
            )}

            {/* Instructions */}
            {!videoPreview && !isRecording && (
              <Box
                sx={{
                  mt: 3,
                  p: 3,
                  borderRadius: '16px',
                  background: 'rgba(124, 58, 237, 0.1)',
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                }}
              >
                <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 1 }}>
                  💡 Recording Tips:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Position yourself in full view of the camera"
                      sx={{ color: '#CBD5E1' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Ensure good lighting and a clear background"
                      sx={{ color: '#CBD5E1' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Perform 3-5 reps of the exercise"
                      sx={{ color: '#CBD5E1' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Keep the camera steady and at a side angle"
                      sx={{ color: '#CBD5E1' }}
                    />
                  </ListItem>
                </List>
              </Box>
            )}
          </Grid>

          {/* Analysis Results */}
          {analysis && (
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  background: 'rgba(124, 58, 237, 0.1)',
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{
                    width: 56,
                    height: 56,
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  }}>
                    <TrendingUp sx={{ fontSize: '2rem' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                      {analysis.exercise_name || 'Exercise Analyzed'}
                    </Typography>
                    <Chip
                      label={`Overall Score: ${analysis.overall_score || 0}/100`}
                      size="small"
                      sx={{
                        mt: 0.5,
                        background: `rgba(${analysis.overall_score >= 80 ? '16, 185, 129' : analysis.overall_score >= 60 ? '245, 158, 11' : '255, 51, 102'}, 0.2)`,
                        color: analysis.overall_score >= 80 ? '#10B981' : analysis.overall_score >= 60 ? '#F59E0B' : '#FF3366',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* Form Issues */}
                <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 2 }}>
                  Form Analysis:
                </Typography>

                {analysis.issues && analysis.issues.length > 0 ? (
                  <List>
                    {analysis.issues.map((issue, idx) => (
                      <ListItem
                        key={idx}
                        sx={{
                          p: 2,
                          mb: 1,
                          borderRadius: '12px',
                          background: `rgba(${getSeverityColor(issue.severity).replace('#', '')}, 0.1)`,
                          border: `1px solid ${getSeverityColor(issue.severity)}40`,
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {React.cloneElement(getSeverityIcon(issue.severity), {
                            sx: { color: getSeverityColor(issue.severity) }
                          })}
                        </ListItemIcon>
                        <ListItemText
                          primary={issue.title}
                          secondary={issue.description}
                          primaryTypographyProps={{
                            sx: { color: '#FFFFFF', fontWeight: 600, fontSize: '0.9rem' }
                          }}
                          secondaryTypographyProps={{
                            sx: { color: '#CBD5E1', fontSize: '0.85rem' }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Excellent form! No major issues detected.
                  </Alert>
                )}

                {/* Recommendations */}
                {analysis.recommendations && analysis.recommendations.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 2 }}>
                      💡 Recommendations:
                    </Typography>
                    <List dense>
                      {analysis.recommendations.map((rec, idx) => (
                        <ListItem key={idx}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle sx={{ color: '#00D4FF', fontSize: '1.25rem' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={rec}
                            primaryTypographyProps={{
                              sx: { color: '#CBD5E1', fontSize: '0.9rem' }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            </Grid>
          )}

          {/* Analyzing Progress */}
          {isAnalyzing && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Avatar sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 3,
                  background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
                }}>
                  <FitnessCenter sx={{ fontSize: '2.5rem' }} />
                </Avatar>
                <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
                  Analyzing your exercise form with AI...
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
                  This may take 10-30 seconds depending on video length
                </Typography>
                <LinearProgress
                  sx={{
                    maxWidth: 400,
                    mx: 'auto',
                    borderRadius: '8px',
                    height: 8,
                    background: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #7C3AED 0%, #00D4FF 100%)',
                    }
                  }}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        {!analysis && videoPreview && !isAnalyzing && (
          <>
            <SecondaryButton onClick={handleReset} startIcon={<Refresh />}>
              Record Again
            </SecondaryButton>
            <PrimaryButton
              onClick={analyzeForm}
              disabled={!recordedVideo}
              startIcon={<PlayArrow />}
            >
              Analyze Form
            </PrimaryButton>
          </>
        )}

        {analysis && (
          <SecondaryButton onClick={handleReset} startIcon={<Refresh />}>
            Analyze Another
          </SecondaryButton>
        )}

        {!videoPreview && !isRecording && (
          <SecondaryButton onClick={handleClose}>
            Cancel
          </SecondaryButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FormCorrectionAI;
