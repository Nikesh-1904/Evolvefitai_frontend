/* src/theme/modernFitnessTheme.js - Enhanced Dark Fitness Theme */

import { createTheme } from '@mui/material/styles';

// Enhanced Modern Fitness Color Palette - Dark Mode
export const fitnessColors = {
  // Dark Base Colors - Improved readability
  background: {
    primary: '#0A0E1A', // Deep space blue-black
    secondary: '#1A1F2E', // Darker slate for cards
    tertiary: '#252A3D', // Lighter slate for elevated elements
    paper: '#141824', // Alternative card background
  },
  // Vibrant Accent Colors
  accent: {
    primary: '#00D4FF', // Electric cyan - main CTAs
    secondary: '#FF3366', // Vibrant pink - secondary actions
    tertiary: '#7C3AED', // Purple - AI/premium features
    success: '#10B981', // Green - success states
    warning: '#F59E0B', // Orange - warnings
    error: '#EF4444', // Red - errors
  },
  // Gradient Colors
  gradients: {
    primary: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
    secondary: 'linear-gradient(135deg, #FF3366 0%, #FF6B35 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    dark: 'linear-gradient(135deg, #1A1F2E 0%, #252A3D 100%)',
    background: 'linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 50%, #141824 100%)',
  },
  // Text Colors - Improved contrast for better readability
  text: {
    primary: '#FFFFFF', // Pure white for headings (21:1 contrast)
    secondary: '#E2E8F0', // Lighter slate for body text (14:1 contrast) - improved from #CBD5E1
    tertiary: '#CBD5E1', // Medium-light slate for secondary text (9:1 contrast) - improved from #94A3B8
    muted: '#94A3B8', // For less important text (5.5:1 contrast)
    inverse: '#0A0E1A', // Dark text on light backgrounds
  },
  // Surface Colors
  surface: {
    glass: 'rgba(255, 255, 255, 0.05)', // Glassmorphism effect
    glassLight: 'rgba(255, 255, 255, 0.08)', // Slightly more visible glass
    border: 'rgba(255, 255, 255, 0.1)', // Subtle borders
    borderStrong: 'rgba(255, 255, 255, 0.15)', // More visible borders
    hover: 'rgba(0, 212, 255, 0.1)', // Hover states
    active: 'rgba(0, 212, 255, 0.2)', // Active states
    overlay: 'rgba(0, 0, 0, 0.5)', // For modals/overlays
  }
};

// Create the Material-UI theme with Gravitas One typography
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
    // Brand/Header Typography with Gravitas One
    h1: {
      fontFamily: '"Gravitas One", "Montserrat", "Inter", sans-serif',
      fontWeight: 400, // Gravitas One is naturally bold
      fontSize: '2.75rem',
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
      color: fitnessColors.text.primary,
    },
    h2: {
      fontFamily: '"Gravitas One", "Montserrat", "Inter", sans-serif',
      fontWeight: 400,
      fontSize: '2.25rem',
      lineHeight: 1.2,
      letterSpacing: '-0.015em',
      color: fitnessColors.text.primary,
    },
    h3: {
      fontFamily: '"Gravitas One", "Montserrat", "Inter", sans-serif',
      fontWeight: 400,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: fitnessColors.text.primary,
    },
    h4: {
      fontFamily: '"Montserrat", "Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.35,
      letterSpacing: '-0.005em',
      color: fitnessColors.text.primary,
    },
    h5: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: fitnessColors.text.primary,
    },
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
      color: fitnessColors.text.primary,
    },
    // Body typography stays with Inter for readability
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.65,
      letterSpacing: '0.005em',
      color: fitnessColors.text.secondary,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.005em',
      color: fitnessColors.text.tertiary,
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: fitnessColors.text.muted,
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: '0.9375rem',
      letterSpacing: '0.015em',
      textTransform: 'none',
    },
    // Custom variants for brand text
    brandTitle: {
      fontFamily: '"Gravitas One", "Montserrat", sans-serif',
      fontWeight: 400,
      fontSize: '3rem',
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
      color: fitnessColors.text.primary,
    },
    brandSubtitle: {
      fontFamily: '"Gravitas One", "Montserrat", sans-serif',
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: fitnessColors.text.secondary,
    },
  },
  spacing: 8, // 8px base spacing for consistency
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: fitnessColors.gradients.background,
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          transition: 'background 0.3s ease-in-out',
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${fitnessColors.accent.primary} ${fitnessColors.background.tertiary}`,
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: fitnessColors.background.tertiary,
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb': {
          background: fitnessColors.accent.primary,
          borderRadius: '4px',
          '&:hover': {
            background: fitnessColors.accent.secondary,
          },
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
          borderRadius: 20, // Increased for more modern look
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 20px 60px rgba(0, 212, 255, 0.15)',
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
          borderRadius: 10, // More rounded
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
          borderRadius: 24, // More rounded for modern look
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

export default modernFitnessTheme;