// src/components/ModernButton.js - Reusable Modern Button Component for All Pages

import React from 'react';
import { Button, Box, CircularProgress } from '@mui/material';

const ModernButton = ({
  children,
  variant = 'gradient', // 'gradient', 'outlined', 'glass', 'minimal'
  size = 'medium', // 'small', 'medium', 'large'
  loading = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  sx = {},
  ...props
}) => {

  // Button variant configurations
  const getVariantStyles = (variant, size) => {
    const basePadding = {
      small: '10px 20px',
      medium: '14px 28px',
      large: '18px 36px'
    };

    const baseFontSize = {
      small: '0.8125rem',
      medium: '0.875rem',
      large: '1rem'
    };

    const baseHeight = {
      small: '36px',
      medium: '44px',
      large: '52px'
    };

    const baseStyles = {
      borderRadius: '12px',
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: baseFontSize[size],
      padding: basePadding[size],
      minHeight: baseHeight[size],
      textTransform: 'none',
      letterSpacing: '0.01em',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'none',
      border: 'none',
      
      '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
        transform: 'none',
      },

      '&:focus-visible': {
        outline: '2px solid #00D4FF',
        outlineOffset: '2px',
      }
    };

    switch (variant) {
      case 'gradient':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
          color: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
          
          '&:hover:not(:disabled)': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(0, 212, 255, 0.4)',
            filter: 'brightness(1.1)',
          },
          
          '&:active:not(:disabled)': {
            transform: 'translateY(-1px)',
            transition: 'all 0.1s ease',
          },

          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            transition: 'left 0.6s ease',
          },

          '&:hover:not(:disabled)::before': {
            left: '100%',
          }
        };

      case 'outlined':
        return {
          ...baseStyles,
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          color: '#00D4FF',
          backdropFilter: 'blur(10px)',
          
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            borderColor: '#00D4FF',
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 24px rgba(0, 212, 255, 0.2)',
          },
          
          '&:active:not(:disabled)': {
            backgroundColor: 'rgba(0, 212, 255, 0.2)',
          }
        };

      case 'glass':
        return {
          ...baseStyles,
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: '#FFFFFF',
          backdropFilter: 'blur(20px)',
          
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 24px rgba(255, 255, 255, 0.1)',
          }
        };

      case 'minimal':
        return {
          ...baseStyles,
          background: 'transparent',
          color: '#CBD5E1', // text.secondary
          border: 'none',
          
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            color: '#00D4FF',
          },
          
          '&:active:not(:disabled)': {
            backgroundColor: 'rgba(0, 212, 255, 0.2)',
          }
        };

      default:
        return baseStyles;
    }
  };

  // Loading spinner configuration
  const getSpinnerSize = (size) => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20;
    }
  };

  const buttonStyles = {
    ...getVariantStyles(variant, size),
    width: fullWidth ? '100%' : 'auto',
    ...sx,
  };

  return (
    <Button
      disabled={disabled || loading}
      onClick={onClick}
      sx={buttonStyles}
      {...props}
    >
      {/* Loading State */}
      {loading && (
        <CircularProgress
          size={getSpinnerSize(size)}
          sx={{
            color: 'inherit',
            marginRight: children ? 1 : 0,
          }}
        />
      )}
      
      {/* Start Icon */}
      {startIcon && !loading && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginRight: children ? 1 : 0,
            fontSize: 'inherit',
          }}
        >
          {startIcon}
        </Box>
      )}

      {/* Button Text */}
      {children && (
        <span style={{ 
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.2s ease'
        }}>
          {children}
        </span>
      )}

      {/* End Icon */}
      {endIcon && !loading && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: children ? 1 : 0,
            fontSize: 'inherit',
          }}
        >
          {endIcon}
        </Box>
      )}
    </Button>
  );
};

// Specialized Button Components

// Primary Action Button - main CTAs
export const PrimaryButton = ({ children, ...props }) => (
  <ModernButton variant="gradient" size="medium" {...props}>
    {children}
  </ModernButton>
);

// Secondary Button - alternative actions
export const SecondaryButton = ({ children, ...props }) => (
  <ModernButton variant="outlined" size="medium" {...props}>
    {children}
  </ModernButton>
);

// Ghost Button - subtle actions
export const GhostButton = ({ children, ...props }) => (
  <ModernButton variant="minimal" size="medium" {...props}>
    {children}
  </ModernButton>
);

// Glass Button - for overlay contexts
export const GlassButton = ({ children, ...props }) => (
  <ModernButton variant="glass" size="medium" {...props}>
    {children}
  </ModernButton>
);

// Icon Button wrapper for single icons
export const IconButton = ({ icon, tooltip, size = 'medium', ...props }) => (
  <ModernButton 
    variant="glass"
    size={size}
    sx={{
      minWidth: size === 'small' ? '36px' : size === 'large' ? '52px' : '44px',
      padding: 0,
      borderRadius: '12px',
      ...props.sx
    }}
    {...props}
  >
    {icon}
  </ModernButton>
);

export default ModernButton;