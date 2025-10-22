/* src/theme/lightTheme.js - Modern Light Fitness Theme with Gravitas One */

import { createTheme } from '@mui/material/styles';

// Modern Fitness Color Palette - Light Mode
export const fitnessColorsLight = {
  // Light Base Colors
  background: {
    primary: '#F8FAFC',      // Soft cool gray
    secondary: '#FFFFFF',    // Pure white for cards
    tertiary: '#F1F5F9',     // Light slate for elevated elements
  },

  // Vibrant Accent Colors (kept consistent for brand identity)
  accent: {
    primary: '#0EA5E9',      // Sky blue - main CTAs
    secondary: '#EC4899',    // Pink - secondary actions
    tertiary: '#8B5CF6',     // Purple - AI/premium features
    success: '#10B981',      // Green - success states
    warning: '#F59E0B',      // Orange - warnings
    error: '#EF4444',        // Red - errors
  },

  // Gradient Colors
  gradients: {
    primary: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
    secondary: 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    light: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
  },

  // Text Colors
  text: {
    primary: '#0F172A',      // Dark slate for headings
    secondary: '#475569',    // Medium slate for body text
    tertiary: '#64748B',     // Light slate for secondary text
    inverse: '#FFFFFF',      // White text on dark backgrounds
  },

  // Surface Colors
  surface: {
    glass: 'rgba(255, 255, 255, 0.8)',     // Glassmorphism effect
    border: 'rgba(15, 23, 42, 0.1)',       // Subtle borders
    hover: 'rgba(14, 165, 233, 0.08)',     // Hover states
    active: 'rgba(14, 165, 233, 0.15)',    // Active states
  },
};

// Create the Material-UI theme with Gravitas One typography
const modernFitnessThemeLight = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: fitnessColorsLight.accent.primary,
      dark: '#0284C7',
      light: '#38BDF8',
      contrastText: fitnessColorsLight.text.inverse,
    },
    secondary: {
      main: fitnessColorsLight.accent.secondary,
      dark: '#DB2777',
      light: '#F472B6',
      contrastText: fitnessColorsLight.text.inverse,
    },
    background: {
      default: fitnessColorsLight.background.primary,
      paper: fitnessColorsLight.background.secondary,
    },
    text: {
      primary: fitnessColorsLight.text.primary,
      secondary: fitnessColorsLight.text.secondary,
    },
    success: {
      main: fitnessColorsLight.accent.success,
    },
    warning: {
      main: fitnessColorsLight.accent.warning,
    },
    error: {
      main: fitnessColorsLight.accent.error,
    },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    
    // Brand/Header Typography with Gravitas One
    h1: {
      fontFamily: '"Gravitas One", "Montserrat", "Inter", sans-serif',
      fontWeight: 400, // Gravitas One is naturally bold
      fontSize: '2.75rem',
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontFamily: '"Gravitas One", "Montserrat", "Inter", sans-serif',
      fontWeight: 400,
      fontSize: '2.25rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: '"Gravitas One", "Montserrat", "Inter", sans-serif',
      fontWeight: 400,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontFamily: '"Gravitas One", "Montserrat", "Inter", sans-serif',
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    h5: {
      fontFamily: '"Montserrat", "Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Montserrat", "Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },

    // Body typography stays with Inter for readability
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

    // Custom variants for brand text
    brandTitle: {
      fontFamily: '"Gravitas One", "Montserrat", sans-serif',
      fontWeight: 400,
      fontSize: '3rem',
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
    },
    brandSubtitle: {
      fontFamily: '"Gravitas One", "Montserrat", sans-serif',
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: fitnessColorsLight.background.primary,
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '14px 28px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(14, 165, 233, 0.2)',
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: fitnessColorsLight.gradients.primary,
          color: fitnessColorsLight.text.inverse,
          '&:hover': {
            background: fitnessColorsLight.gradients.primary,
            filter: 'brightness(1.05)',
          },
        },
        outlined: {
          border: `1px solid ${fitnessColorsLight.surface.border}`,
          backgroundColor: fitnessColorsLight.background.secondary,
          '&:hover': {
            backgroundColor: fitnessColorsLight.surface.hover,
            borderColor: fitnessColorsLight.accent.primary,
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          background: fitnessColorsLight.background.secondary,
          border: `1px solid ${fitnessColorsLight.surface.border}`,
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 12px 40px rgba(14, 165, 233, 0.15)',
            borderColor: fitnessColorsLight.surface.hover,
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          background: fitnessColorsLight.background.secondary,
          border: `1px solid ${fitnessColorsLight.surface.border}`,
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
        },
        filled: {
          background: fitnessColorsLight.surface.glass,
          border: `1px solid ${fitnessColorsLight.surface.border}`,
        },
        outlined: {
          border: `1px solid ${fitnessColorsLight.surface.border}`,
          backgroundColor: 'transparent',
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
          backgroundColor: fitnessColorsLight.background.tertiary,
        },
        bar: {
          borderRadius: 8,
          background: fitnessColorsLight.gradients.primary,
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          background: fitnessColorsLight.background.secondary,
          border: `1px solid ${fitnessColorsLight.surface.border}`,
          borderRadius: 24,
          boxShadow: '0 20px 60px rgba(15, 23, 42, 0.15)',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: fitnessColorsLight.surface.glass,
          backdropFilter: 'blur(20px)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
        },
      },
    },

    // Custom Typography components for brand text
    MuiTypography: {
      variants: [
        {
          props: { variant: 'brandTitle' },
          style: {
            fontFamily: '"Gravitas One", "Montserrat", sans-serif',
            fontWeight: 400,
            fontSize: '3rem',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          },
        },
        {
          props: { variant: 'brandSubtitle' },
          style: {
            fontFamily: '"Gravitas One", "Montserrat", sans-serif',
            fontWeight: 400,
            fontSize: '1.5rem',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
          },
        },
      ],
    },
  },
});

export default modernFitnessThemeLight;