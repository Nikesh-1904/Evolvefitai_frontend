/* src/theme/modernFitnessTheme.js - Modern Dark Fitness Theme */

import { createTheme } from '@mui/material/styles';

// Modern Fitness Color Palette
export const fitnessColors = {
  // Dark Base Colors
  background: {
    primary: '#0A0E1A',      // Deep space blue-black
    secondary: '#1A1F2E',    // Darker slate for cards
    tertiary: '#252A3D',     // Lighter slate for elevated elements
  },

  // Vibrant Accent Colors
  accent: {
    primary: '#00D4FF',      // Electric cyan - main CTAs
    secondary: '#FF3366',    // Vibrant pink - secondary actions
    tertiary: '#7C3AED',     // Purple - AI/premium features
    success: '#10B981',      // Green - success states
    warning: '#F59E0B',      // Orange - warnings
    error: '#EF4444',        // Red - errors
  },

  // Gradient Colors
  gradients: {
    primary: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
    secondary: 'linear-gradient(135deg, #FF3366 0%, #FF6B35 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    dark: 'linear-gradient(135deg, #1A1F2E 0%, #252A3D 100%)',
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',      // Pure white for headings
    secondary: '#CBD5E1',    // Light slate for body text
    tertiary: '#94A3B8',     // Medium slate for secondary text
    inverse: '#0A0E1A',      // Dark text on light backgrounds
  },

  // Surface Colors
  surface: {
    glass: 'rgba(255, 255, 255, 0.05)', // Glassmorphism effect
    border: 'rgba(255, 255, 255, 0.1)',  // Subtle borders
    hover: 'rgba(0, 212, 255, 0.1)',     // Hover states
    active: 'rgba(0, 212, 255, 0.2)',    // Active states
  }
};

// Create the Material-UI theme
const modernFitnessTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: fitnessColors.accent.primary,
      dark: '#0099CC',
      light: '#33DDFF',
      contrastText: fitnessColors.text.inverse,
    },
    secondary: {
      main: fitnessColors.accent.secondary,
      dark: '#CC1A44',
      light: '#FF5577',
      contrastText: fitnessColors.text.primary,
    },
    background: {
      default: fitnessColors.background.primary,
      paper: fitnessColors.background.secondary,
    },
    text: {
      primary: fitnessColors.text.primary,
      secondary: fitnessColors.text.secondary,
    },
    success: {
      main: fitnessColors.accent.success,
    },
    warning: {
      main: fitnessColors.accent.warning,
    },
    error: {
      main: fitnessColors.accent.error,
    },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Montserrat", "Inter", sans-serif',
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Montserrat", "Inter", sans-serif',
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Montserrat", "Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: '"Montserrat", "Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"Montserrat", "Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: '"Montserrat", "Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: fitnessColors.gradients.dark,
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0, 212, 255, 0.3)',
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: fitnessColors.gradients.primary,
          color: fitnessColors.text.primary,
          '&:hover': {
            background: fitnessColors.gradients.primary,
            filter: 'brightness(1.1)',
          },
        },
        outlined: {
          border: `1px solid ${fitnessColors.surface.border}`,
          backdropFilter: 'blur(10px)',
          backgroundColor: fitnessColors.surface.glass,
          '&:hover': {
            backgroundColor: fitnessColors.surface.hover,
            borderColor: fitnessColors.accent.primary,
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          background: fitnessColors.background.secondary,
          border: `1px solid ${fitnessColors.surface.border}`,
          borderRadius: 16,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px rgba(0, 212, 255, 0.1)',
            borderColor: fitnessColors.surface.hover,
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          background: fitnessColors.background.secondary,
          border: `1px solid ${fitnessColors.surface.border}`,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          background: fitnessColors.surface.glass,
          border: `1px solid ${fitnessColors.surface.border}`,
          backdropFilter: 'blur(10px)',
        },
        outlined: {
          border: `1px solid ${fitnessColors.surface.border}`,
          backgroundColor: 'transparent',
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
          backgroundColor: fitnessColors.background.tertiary,
        },
        bar: {
          borderRadius: 8,
          background: fitnessColors.gradients.primary,
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          background: fitnessColors.background.secondary,
          border: `1px solid ${fitnessColors.surface.border}`,
          backdropFilter: 'blur(40px)',
          borderRadius: 20,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: fitnessColors.surface.glass,
          backdropFilter: 'blur(20px)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default modernFitnessTheme;
