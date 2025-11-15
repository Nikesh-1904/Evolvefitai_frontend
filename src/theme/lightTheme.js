/* src/theme/lightTheme.js - Enhanced Light Fitness Theme */

import { createTheme } from '@mui/material/styles';

// Enhanced Modern Fitness Color Palette - Light Mode
export const fitnessColorsLight = {
  // Light Base Colors - Warm and comfortable
  background: {
    primary: '#FAFAFA',      // Soft warm gray (reduced blue tint)
    secondary: '#FFFFFF',    // Pure white for cards
    tertiary: '#F5F5F5',     // Light gray for elevated elements
    paper: '#FCFCFC',        // Alternative card background
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
    background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 50%, #F5F5F5 100%)',
  },

  // Text Colors - Optimized for readability
  text: {
    primary: '#0F172A',      // Dark slate for headings (14:1 contrast)
    secondary: '#334155',    // Darker slate for body text (10:1 contrast) - improved from #475569
    tertiary: '#64748B',     // Medium slate for secondary text (7:1 contrast)
    muted: '#94A3B8',        // For less important text (4.5:1 contrast)
    inverse: '#FFFFFF',      // White text on dark backgrounds
  },

  // Surface Colors
  surface: {
    glass: 'rgba(255, 255, 255, 0.8)',     // Glassmorphism effect
    glassLight: 'rgba(255, 255, 255, 0.95)', // More opaque glass
    border: 'rgba(15, 23, 42, 0.12)',       // Subtle borders - slightly more visible
    borderStrong: 'rgba(15, 23, 42, 0.2)',  // More visible borders
    hover: 'rgba(14, 165, 233, 0.08)',     // Hover states
    active: 'rgba(14, 165, 233, 0.15)',    // Active states
    overlay: 'rgba(0, 0, 0, 0.4)',         // For modals/overlays
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
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
      color: fitnessColorsLight.text.primary,
    },
    h2: {
      fontFamily: '"Gravitas One", "Montserrat", "Inter", sans-serif',
      fontWeight: 400,
      fontSize: '2.25rem',
      lineHeight: 1.2,
      letterSpacing: '-0.015em',
      color: fitnessColorsLight.text.primary,
    },
    h3: {
      fontFamily: '"Gravitas One", "Montserrat", "Inter", sans-serif',
      fontWeight: 400,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: fitnessColorsLight.text.primary,
    },
    h4: {
      fontFamily: '"Montserrat", "Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.35,
      letterSpacing: '-0.005em',
      color: fitnessColorsLight.text.primary,
    },
    h5: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: fitnessColorsLight.text.primary,
    },
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
      color: fitnessColorsLight.text.primary,
    },

    // Body typography stays with Inter for readability
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.65,
      letterSpacing: '0.005em',
      color: fitnessColorsLight.text.secondary,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.005em',
      color: fitnessColorsLight.text.tertiary,
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: fitnessColorsLight.text.muted,
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
      color: fitnessColorsLight.text.primary,
    },
    brandSubtitle: {
      fontFamily: '"Gravitas One", "Montserrat", sans-serif',
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: fitnessColorsLight.text.secondary,
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
          background: fitnessColorsLight.gradients.background,
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          transition: 'background 0.3s ease-in-out',
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${fitnessColorsLight.accent.primary} ${fitnessColorsLight.background.tertiary}`,
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: fitnessColorsLight.background.tertiary,
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb': {
          background: fitnessColorsLight.accent.primary,
          borderRadius: '4px',
          '&:hover': {
            background: fitnessColorsLight.accent.secondary,
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