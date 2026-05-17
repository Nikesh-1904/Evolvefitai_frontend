/*
 * src/theme/evolveDarkTheme.js
 * Jet-black, minimal, gallery-grade. Companion to src/index.css.
 */

import { createTheme } from '@mui/material/styles';

export const ev = {
  ink:        '#050505',
  ink2:       '#0c0c0c',
  rule:       '#1a1a1a',
  ruleSoft:   '#141414',
  chalk:      '#ece9e2',
  chalkDim:   '#6e6c66',
  chalkMute:  '#3f3e3a',
  accent:     '#c9ff4a',
  accentDeep: '#a8e600',
  warn:       '#ff5b1f',
  display:    '"DM Serif Display", "Times New Roman", serif',
  body:       '"Inter Tight", system-ui, -apple-system, "Segoe UI", sans-serif',
  mono:       '"JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, monospace',
};

const evolveDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: ev.chalk,  contrastText: ev.ink },
    secondary: { main: ev.accent, contrastText: ev.ink },
    background: { default: ev.ink, paper: ev.ink },
    text: {
      primary:   ev.chalk,
      secondary: ev.chalkDim,
      disabled:  ev.chalkMute,
    },
    divider: ev.rule,
    success: { main: ev.accent },
    warning: { main: ev.warn },
    error:   { main: ev.warn },
  },

  shape: { borderRadius: 0 },
  spacing: 8,

  typography: {
    fontFamily: ev.body,
    htmlFontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,

    h1: {
      fontFamily: ev.display,
      fontWeight: 400,
      fontSize: 'clamp(80px, 12vw, 180px)',
      lineHeight: 0.88,
      letterSpacing: '-0.025em',
      color: ev.chalk,
    },
    h2: {
      fontFamily: ev.display,
      fontWeight: 400,
      fontSize: 'clamp(40px, 5vw, 64px)',
      lineHeight: 1,
      letterSpacing: '-0.02em',
      color: ev.chalk,
    },
    h3: {
      fontFamily: ev.display,
      fontWeight: 400,
      fontSize: 'clamp(32px, 3.6vw, 48px)',
      lineHeight: 1.05,
      letterSpacing: '-0.015em',
      color: ev.chalk,
    },
    h4: {
      fontFamily: ev.display,
      fontWeight: 400,
      fontSize: 'clamp(24px, 2.4vw, 32px)',
      lineHeight: 1.1,
      letterSpacing: '-0.01em',
      color: ev.chalk,
    },
    h5: {
      fontFamily: ev.display,
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.005em',
      color: ev.chalk,
    },
    h6: {
      fontFamily: ev.mono,
      fontWeight: 500,
      fontSize: '0.6875rem',
      lineHeight: 1.3,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: ev.chalkDim,
    },
    body1: {
      fontFamily: ev.body,
      fontWeight: 400,
      fontSize: '0.9375rem',
      lineHeight: 1.55,
      color: ev.chalkDim,
    },
    body2: {
      fontFamily: ev.body,
      fontWeight: 300,
      fontSize: '0.8125rem',
      lineHeight: 1.55,
      color: ev.chalkDim,
    },
    caption: {
      fontFamily: ev.mono,
      fontWeight: 400,
      fontSize: '0.6875rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: ev.chalkMute,
    },
    overline: {
      fontFamily: ev.mono,
      fontWeight: 500,
      fontSize: '0.625rem',
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: ev.chalkDim,
    },
    button: {
      fontFamily: ev.mono,
      fontWeight: 500,
      fontSize: '0.75rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: ev.ink,
          color: ev.chalk,
          minHeight: '100vh',
        },
        a: { color: 'inherit', textDecoration: 'none' },
        hr: { borderColor: ev.rule, borderTop: 0, borderBottomWidth: 1 },
      },
    },

    MuiContainer: {
      styleOverrides: {
        root: { paddingLeft: 0, paddingRight: 0 },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: ev.ink,
          backgroundImage: 'none',
          color: ev.chalk,
          borderRadius: 0,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: ev.ink,
          backgroundImage: 'none',
          color: ev.chalk,
          border: `1px solid ${ev.rule}`,
          borderRadius: 0,
          boxShadow: 'none',
          transition: 'border-color .2s ease, background-color .2s ease',
          '&:hover': { borderColor: ev.chalkMute },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: ev.rule },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: false },
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '14px 22px',
          fontFamily: ev.mono,
          fontWeight: 500,
          fontSize: '0.75rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          transition: 'color .15s ease, background-color .15s ease, border-color .15s ease',
        },
        contained: {
          backgroundColor: ev.chalk,
          color: ev.ink,
          '&:hover': { backgroundColor: ev.accent, color: ev.ink },
        },
        outlined: {
          border: `1px solid ${ev.rule}`,
          color: ev.chalk,
          backgroundColor: 'transparent',
          '&:hover': { borderColor: ev.accent, color: ev.accent, backgroundColor: 'transparent' },
        },
        text: {
          color: ev.chalkDim,
          padding: '8px 4px',
          '&:hover': { color: ev.chalk, backgroundColor: 'transparent' },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          color: ev.chalkDim,
          borderRadius: 0,
          '&:hover': { color: ev.accent, backgroundColor: 'transparent' },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: 'transparent',
          border: `1px solid ${ev.rule}`,
          color: ev.chalkDim,
          fontFamily: ev.mono,
          fontSize: '0.6875rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          height: 26,
        },
        filled: { backgroundColor: ev.chalk, color: ev.ink, borderColor: ev.chalk },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: `1px solid ${ev.rule}`,
          backgroundColor: ev.ink,
          color: ev.chalk,
          padding: '14px 18px',
        },
        standardInfo:    { borderColor: ev.rule },
        standardSuccess: { borderColor: ev.accent, color: ev.accent },
        standardWarning: { borderColor: ev.warn,   color: ev.warn },
        standardError:   { borderColor: ev.warn,   color: ev.warn },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: { backgroundColor: ev.rule, height: 1 },
        bar:  { backgroundColor: ev.accent },
      },
    },

    MuiCircularProgress: {
      styleOverrides: {
        root: { color: ev.accent },
      },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: { backgroundColor: ev.rule, borderRadius: 0 },
      },
    },

    MuiTextField: {
      defaultProps: { variant: 'standard' },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          fontFamily: ev.body,
          color: ev.chalk,
          '&:before': { borderBottomColor: ev.rule },
          '&:after':  { borderBottomColor: ev.accent },
          '&:hover:not(.Mui-disabled):before': { borderBottomColor: ev.chalkDim },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: ev.mono,
          fontSize: '0.6875rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: ev.chalkDim,
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: ev.ink,
          border: `1px solid ${ev.rule}`,
          color: ev.chalk,
          fontFamily: ev.display,
          fontWeight: 400,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: ev.chalk,
          color: ev.ink,
          borderRadius: 0,
          fontFamily: ev.mono,
          fontSize: '0.625rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          padding: '6px 10px',
        },
      },
    },
  },
});

export default evolveDarkTheme;
