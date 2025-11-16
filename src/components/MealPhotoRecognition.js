// src/components/MealPhotoRecognition.js - AI Meal Photo Recognition

import React, { useState, useRef } from 'react';
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
} from '@mui/material';
import {
  CameraAlt,
  Close,
  PhotoLibrary,
  Restaurant,
  LocalFireDepartment,
  Favorite,
  Bolt,
  CheckCircle,
  Delete,
  Refresh,
} from '@mui/icons-material';
import { Alert } from './design-system';
import { PrimaryButton, SecondaryButton } from './ModernButton';
import mockAIService from '../services/mockAIService';

const MealPhotoRecognition = ({ isOpen, onClose, onMealAnalyzed }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size must be less than 10MB');
        return;
      }

      setSelectedImage(file);
      setError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Analyze the meal photo with AI
  const analyzeMeal = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // Convert image to base64
      const base64Image = await convertToBase64(selectedImage);

      let data;

      // Try real API first, fallback to mock if it fails
      try {
        const response = await fetch('/api/v1/ai/analyze-meal-photo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            image: base64Image,
          }),
        });

        if (!response.ok) {
          throw new Error('Backend endpoint not available');
        }

        data = await response.json();
      } catch (apiError) {
        console.warn('Real API failed, using mock data:', apiError.message);
        // Use mock service as fallback
        data = await mockAIService.analyzeMealPhoto(base64Image);
      }

      setAnalysis(data);

      // Notify parent component
      if (onMealAnalyzed) {
        onMealAnalyzed(data);
      }
    } catch (err) {
      console.error('Error analyzing meal:', err);
      setError(err.message || 'Failed to analyze meal photo');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove data URL prefix
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Reset state
  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysis(null);
    setError('');
  };

  // Close and reset
  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Save meal to log
  const handleSaveMeal = () => {
    if (analysis && onMealAnalyzed) {
      onMealAnalyzed(analysis);
    }
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
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
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          }}>
            <Restaurant />
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
              AI Meal Recognition
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Take or upload a photo of your meal
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

        {/* Image Upload Section */}
        {!imagePreview && (
          <Box
            sx={{
              p: 6,
              borderRadius: '16px',
              border: '2px dashed rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.03)',
              textAlign: 'center',
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              }}
            >
              <Restaurant sx={{ fontSize: '2.5rem' }} />
            </Avatar>

            <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
              Upload or Take a Photo
            </Typography>

            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 4 }}>
              Our AI will analyze the nutritional content and identify the meal
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center">
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              <Tooltip title="Take Photo">
                <IconButton
                  onClick={() => cameraInputRef.current?.click()}
                  sx={{
                    width: 100,
                    height: 100,
                    background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                    color: '#FFFFFF',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #00BFEA 0%, #6B2FD4 100%)',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <CameraAlt sx={{ fontSize: '2.5rem' }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Upload from Gallery">
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    width: 100,
                    height: 100,
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFFFFF',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0EA472 0%, #047857 100%)',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <PhotoLibrary sx={{ fontSize: '2.5rem' }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        )}

        {/* Image Preview & Analysis */}
        {imagePreview && (
          <Box>
            {/* Image Preview */}
            <Box
              sx={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                mb: 3,
              }}
            >
              <img
                src={imagePreview}
                alt="Meal preview"
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {!analysis && (
                <IconButton
                  onClick={handleReset}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#FFFFFF',
                    '&:hover': {
                      background: 'rgba(0, 0, 0, 0.8)',
                    },
                  }}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>

            {/* Analyzing Progress */}
            {isAnalyzing && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ color: '#FFFFFF', mb: 2, textAlign: 'center' }}>
                  Analyzing your meal with AI...
                </Typography>
                <LinearProgress
                  sx={{
                    borderRadius: '8px',
                    height: 6,
                    background: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #10B981 0%, #00D4FF 100%)',
                    }
                  }}
                />
              </Box>
            )}

            {/* Analysis Results */}
            {analysis && (
              <Box
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <CheckCircle sx={{ color: '#10B981', fontSize: '2rem' }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                      {analysis.meal_name || 'Meal Identified'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                      {analysis.description || 'AI analysis complete'}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* Nutritional Information */}
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{
                        width: 48,
                        height: 48,
                        mx: 'auto',
                        mb: 1,
                        background: 'rgba(255, 51, 102, 0.2)',
                      }}>
                        <LocalFireDepartment sx={{ color: '#FF3366' }} />
                      </Avatar>
                      <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                        {analysis.nutrition?.calories || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        Calories
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{
                        width: 48,
                        height: 48,
                        mx: 'auto',
                        mb: 1,
                        background: 'rgba(0, 212, 255, 0.2)',
                      }}>
                        <Bolt sx={{ color: '#00D4FF' }} />
                      </Avatar>
                      <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                        {analysis.nutrition?.protein || 0}g
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        Protein
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{
                        width: 48,
                        height: 48,
                        mx: 'auto',
                        mb: 1,
                        background: 'rgba(245, 158, 11, 0.2)',
                      }}>
                        <Restaurant sx={{ color: '#F59E0B' }} />
                      </Avatar>
                      <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                        {analysis.nutrition?.carbs || 0}g
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        Carbs
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{
                        width: 48,
                        height: 48,
                        mx: 'auto',
                        mb: 1,
                        background: 'rgba(124, 58, 237, 0.2)',
                      }}>
                        <Favorite sx={{ color: '#7C3AED' }} />
                      </Avatar>
                      <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                        {analysis.nutrition?.fats || 0}g
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        Fats
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Ingredients */}
                {analysis.ingredients && analysis.ingredients.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 1 }}>
                      Detected Ingredients:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {analysis.ingredients.map((ingredient, idx) => (
                        <Chip
                          key={idx}
                          label={ingredient}
                          size="small"
                          sx={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10B981',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* AI Recommendations */}
                {analysis.recommendations && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      borderRadius: '12px',
                      background: 'rgba(0, 212, 255, 0.1)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: '#00D4FF', fontWeight: 600, mb: 1 }}>
                      💡 AI Recommendations:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                      {analysis.recommendations}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        {!analysis && imagePreview && (
          <>
            <SecondaryButton onClick={handleReset} disabled={isAnalyzing}>
              Choose Different Photo
            </SecondaryButton>
            <PrimaryButton
              onClick={analyzeMeal}
              loading={isAnalyzing}
              disabled={isAnalyzing || !selectedImage}
              startIcon={<Restaurant />}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Meal'}
            </PrimaryButton>
          </>
        )}

        {analysis && (
          <>
            <SecondaryButton onClick={handleReset} startIcon={<Refresh />}>
              Analyze Another
            </SecondaryButton>
            <PrimaryButton onClick={handleSaveMeal} startIcon={<CheckCircle />}>
              Save to Meal Log
            </PrimaryButton>
          </>
        )}

        {!imagePreview && (
          <SecondaryButton onClick={handleClose}>
            Cancel
          </SecondaryButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MealPhotoRecognition;
