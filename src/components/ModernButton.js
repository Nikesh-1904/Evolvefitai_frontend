// src/components/ModernButton.js — flat, mono, hairline. API preserved.

import React from 'react';
import { Button, Box, CircularProgress } from '@mui/material';
import { ev } from '../theme/evolveDarkTheme';

const SIZE_PX = {
  small:  { padX: 16, padY: 10, font: 11, minH: 34 },
  medium: { padX: 22, padY: 14, font: 12, minH: 44 },
  large:  { padX: 28, padY: 18, font: 13, minH: 56 },
};

const variantStyle = (variant) => {
  switch (variant) {
    case 'gradient':
      return {
        background: ev.chalk,
        color: ev.ink,
        border: `1px solid ${ev.chalk}`,
        '&:hover:not(:disabled)': { background: ev.accent, borderColor: ev.accent, color: ev.ink },
      };
    case 'outlined':
      return {
        background: 'transparent',
        color: ev.chalk,
        border: `1px solid ${ev.rule}`,
        '&:hover:not(:disabled)': { borderColor: ev.accent, color: ev.accent },
      };
    case 'glass':
      return {
        background: 'transparent',
        color: ev.chalkDim,
        border: `1px solid ${ev.rule}`,
        '&:hover:not(:disabled)': { color: ev.chalk, borderColor: ev.chalkMute },
      };
    case 'minimal':
    default:
      return {
        background: 'transparent',
        color: ev.chalkDim,
        border: '1px solid transparent',
        '&:hover:not(:disabled)': { color: ev.chalk, background: 'transparent' },
      };
  }
};

const ModernButton = ({
  children,
  variant = 'gradient',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  sx = {},
  ...props
}) => {
  const s = SIZE_PX[size] || SIZE_PX.medium;

  const buttonStyles = {
    borderRadius: 0,
    fontFamily: ev.mono,
    fontWeight: 500,
    fontSize: s.font,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    padding: `${s.padY}px ${s.padX}px`,
    minHeight: s.minH,
    boxShadow: 'none',
    transition: 'color .15s ease, background-color .15s ease, border-color .15s ease',
    width: fullWidth ? '100%' : 'auto',
    '&:focus-visible': { outline: `1px solid ${ev.accent}`, outlineOffset: 3 },
    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
    ...variantStyle(variant),
    ...sx,
  };

  const spinnerSize = size === 'small' ? 14 : size === 'large' ? 20 : 16;

  return (
    <Button
      disabled={disabled || loading}
      onClick={onClick}
      sx={buttonStyles}
      {...props}
    >
      {loading && (
        <CircularProgress
          size={spinnerSize}
          sx={{ color: 'inherit', mr: children ? 1.25 : 0 }}
        />
      )}
      {startIcon && !loading && (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', mr: children ? 1.25 : 0, '& > *': { fontSize: 16 } }}>
          {startIcon}
        </Box>
      )}
      {children && (
        <Box component="span" sx={{ opacity: loading ? 0.7 : 1 }}>
          {children}
        </Box>
      )}
      {endIcon && !loading && (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: children ? 1.25 : 0, '& > *': { fontSize: 16 } }}>
          {endIcon}
        </Box>
      )}
    </Button>
  );
};

export const PrimaryButton   = ({ children, ...p }) => <ModernButton variant="gradient" size="medium" {...p}>{children}</ModernButton>;
export const SecondaryButton = ({ children, ...p }) => <ModernButton variant="outlined" size="medium" {...p}>{children}</ModernButton>;
export const GhostButton     = ({ children, ...p }) => <ModernButton variant="minimal"  size="medium" {...p}>{children}</ModernButton>;
export const GlassButton     = ({ children, ...p }) => <ModernButton variant="glass"    size="medium" {...p}>{children}</ModernButton>;

export const IconButton = ({ icon, tooltip, size = 'medium', ...props }) => (
  <ModernButton
    variant="glass"
    size={size}
    sx={{
      minWidth: size === 'small' ? 34 : size === 'large' ? 56 : 44,
      padding: 0,
      ...props.sx,
    }}
    {...props}
  >
    {icon}
  </ModernButton>
);

export default ModernButton;
