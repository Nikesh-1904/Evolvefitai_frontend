// src/components/VoiceWorkoutLogger.js - AI Voice Commands for Workout Logging

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Avatar,
  LinearProgress,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Close,
  CheckCircle,
  FitnessCenter,
  VolumeUp,
} from '@mui/icons-material';
import { Alert } from './design-system';

const VoiceWorkoutLogger = ({ onExerciseLogged, isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [command, setCommand] = useState(null);
  const [recentCommands, setRecentCommands] = useState([]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    synthRef.current = window.speechSynthesis;

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(interimTranscript || finalTranscript);

      if (finalTranscript) {
        processVoiceCommand(finalTranscript.trim());
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(`Voice recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      if (isListening) {
        // Restart if it stops while we want it to continue
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error('Failed to restart recognition:', err);
        }
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  // Voice feedback function
  const speak = (text) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      synthRef.current.speak(utterance);
    }
  };

  // Start/stop listening
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setFeedback('Voice commands stopped');
    } else {
      setError('');
      setTranscript('');
      setFeedback('Listening... Try saying "bench press 100 kg 8 reps"');
      speak('Ready for voice command');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        setError('Failed to start voice recognition');
        console.error(err);
      }
    }
  };

  // Parse voice command
  const processVoiceCommand = (text) => {
    setIsProcessing(true);
    setTranscript(text);

    try {
      const parsed = parseWorkoutCommand(text.toLowerCase());

      if (parsed) {
        setCommand(parsed);
        setFeedback(`Logged: ${parsed.exercise} - ${parsed.display}`);
        speak(`Logged ${parsed.exercise}`);

        // Add to recent commands
        setRecentCommands(prev => [
          { ...parsed, timestamp: new Date() },
          ...prev.slice(0, 4) // Keep last 5 commands
        ]);

        // Send to parent component
        if (onExerciseLogged) {
          onExerciseLogged(parsed);
        }

        // Clear after 3 seconds
        setTimeout(() => {
          setCommand(null);
          setTranscript('');
        }, 3000);
      } else {
        setFeedback('Command not recognized. Try: "exercise name, weight/reps"');
        speak('Command not recognized');
      }
    } catch (err) {
      console.error('Error processing command:', err);
      setError('Failed to process command');
    } finally {
      setIsProcessing(false);
    }
  };

  // Parse workout commands
  const parseWorkoutCommand = (text) => {
    // Pattern 1: "bench press 100 kg 8 reps"
    const weightRepsPattern = /(.+?)\s+(\d+(?:\.\d+)?)\s*(?:kg|kilos?|kilograms?|pounds?|lbs?)?\s+(\d+)\s*(?:reps?|repetitions?)/i;
    const weightRepsMatch = text.match(weightRepsPattern);

    if (weightRepsMatch) {
      return {
        exercise: weightRepsMatch[1].trim(),
        exercise_type: 'WEIGHT_BASED',
        sets: [{
          weight: parseFloat(weightRepsMatch[2]),
          reps: parseInt(weightRepsMatch[3], 10)
        }],
        display: `${weightRepsMatch[2]}kg × ${weightRepsMatch[3]} reps`
      };
    }

    // Pattern 2: "pushups 20 reps" or "pull-ups 15"
    const repsOnlyPattern = /(.+?)\s+(\d+)\s*(?:reps?|repetitions?)?/i;
    const repsOnlyMatch = text.match(repsOnlyPattern);

    if (repsOnlyMatch) {
      return {
        exercise: repsOnlyMatch[1].trim(),
        exercise_type: 'REPS_ONLY',
        sets: [{
          reps: parseInt(repsOnlyMatch[2], 10)
        }],
        display: `${repsOnlyMatch[2]} reps`
      };
    }

    // Pattern 3: "plank 60 seconds" or "running 30 minutes"
    const durationPattern = /(.+?)\s+(\d+)\s*(?:seconds?|secs?|minutes?|mins?)/i;
    const durationMatch = text.match(durationPattern);

    if (durationMatch) {
      const duration = text.includes('minute') || text.includes('min')
        ? parseInt(durationMatch[2], 10) * 60
        : parseInt(durationMatch[2], 10);

      return {
        exercise: durationMatch[1].trim(),
        exercise_type: 'DURATION',
        sets: [{
          duration_seconds: duration
        }],
        display: `${durationMatch[2]} ${text.includes('minute') ? 'minutes' : 'seconds'}`
      };
    }

    // Pattern 4: "running 5k in 25 minutes" or "run 3 km 15 minutes"
    const distancePattern = /(.+?)\s+(\d+(?:\.\d+)?)\s*(?:k|km|kilometers?|miles?)\s+(?:in\s+)?(\d+)\s*(?:minutes?|mins?)/i;
    const distanceMatch = text.match(distancePattern);

    if (distanceMatch) {
      return {
        exercise: distanceMatch[1].trim(),
        exercise_type: 'DISTANCE_DURATION',
        sets: [{
          distance_km: parseFloat(distanceMatch[2]),
          duration_seconds: parseInt(distanceMatch[3], 10) * 60
        }],
        display: `${distanceMatch[2]}km in ${distanceMatch[3]} minutes`
      };
    }

    return null;
  };

  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
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
            background: isListening
              ? 'linear-gradient(135deg, #FF3366 0%, #FF6B9D 100%)'
              : 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
          }}>
            {isListening ? <VolumeUp /> : <Mic />}
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
              Voice Workout Logger
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              {isListening ? 'Listening for commands...' : 'Click the mic to start'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#94A3B8' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Microphone Button */}
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Tooltip title={isListening ? 'Stop listening' : 'Start listening'}>
            <IconButton
              onClick={toggleListening}
              disabled={!!error}
              sx={{
                width: 120,
                height: 120,
                background: isListening
                  ? 'linear-gradient(135deg, #FF3366 0%, #FF6B9D 100%)'
                  : 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                fontSize: '3rem',
                boxShadow: isListening
                  ? '0 0 40px rgba(255, 51, 102, 0.5)'
                  : '0 0 40px rgba(0, 212, 255, 0.3)',
                transition: 'all 0.3s ease',
                animation: isListening ? 'pulse 1.5s infinite' : 'none',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
                '@keyframes pulse': {
                  '0%, 100%': { boxShadow: '0 0 40px rgba(255, 51, 102, 0.5)' },
                  '50%': { boxShadow: '0 0 60px rgba(255, 51, 102, 0.8)' },
                },
              }}
            >
              {isListening ? <MicOff sx={{ fontSize: '3rem' }} /> : <Mic sx={{ fontSize: '3rem' }} />}
            </IconButton>
          </Tooltip>

          {isListening && (
            <LinearProgress
              sx={{
                mt: 3,
                borderRadius: '8px',
                height: 6,
                background: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #FF3366 0%, #00D4FF 100%)',
                }
              }}
            />
          )}
        </Box>

        {/* Transcript Display */}
        {transcript && (
          <Fade in timeout={300}>
            <Box
              sx={{
                p: 3,
                borderRadius: '16px',
                background: 'rgba(0, 212, 255, 0.1)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                mb: 3,
              }}
            >
              <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
                You said:
              </Typography>
              <Typography variant="h6" sx={{ color: '#00D4FF', fontWeight: 600 }}>
                "{transcript}"
              </Typography>
              {isProcessing && (
                <Typography variant="caption" sx={{ color: '#94A3B8', mt: 1, display: 'block' }}>
                  Processing...
                </Typography>
              )}
            </Box>
          </Fade>
        )}

        {/* Feedback */}
        {feedback && (
          <Alert
            severity={command ? "success" : "info"}
            icon={command ? <CheckCircle /> : undefined}
            sx={{ mb: 3 }}
          >
            {feedback}
          </Alert>
        )}

        {/* Example Commands */}
        <Box
          sx={{
            p: 3,
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            mb: 3,
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 2 }}>
            Try saying:
          </Typography>
          <Stack spacing={1}>
            <Chip
              label="Bench press 100 kg 8 reps"
              size="small"
              sx={{
                background: 'rgba(0, 212, 255, 0.1)',
                color: '#00D4FF',
                justifyContent: 'flex-start',
              }}
            />
            <Chip
              label="Push-ups 20 reps"
              size="small"
              sx={{
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
                justifyContent: 'flex-start',
              }}
            />
            <Chip
              label="Plank 60 seconds"
              size="small"
              sx={{
                background: 'rgba(124, 58, 237, 0.1)',
                color: '#7C3AED',
                justifyContent: 'flex-start',
              }}
            />
            <Chip
              label="Running 5k in 25 minutes"
              size="small"
              sx={{
                background: 'rgba(255, 51, 102, 0.1)',
                color: '#FF3366',
                justifyContent: 'flex-start',
              }}
            />
          </Stack>
        </Box>

        {/* Recent Commands */}
        {recentCommands.length > 0 && (
          <Box
            sx={{
              p: 3,
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 2 }}>
              Recent Commands:
            </Typography>
            <Stack spacing={2}>
              {recentCommands.map((cmd, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.1)',
                  }}
                >
                  <CheckCircle sx={{ color: '#10B981', fontSize: '1.25rem' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                      {cmd.exercise}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      {cmd.display}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    {timeAgo(cmd.timestamp)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VoiceWorkoutLogger;
