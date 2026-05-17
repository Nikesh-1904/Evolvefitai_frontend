// src/components/DynamicThemeWrapper.js

import React, { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { usePreferences } from '../contexts/PreferencesContext';

import evolveDarkTheme from '../theme/evolveDarkTheme';
import modernFitnessThemeLight from '../theme/lightTheme';

export default function DynamicThemeWrapper({ children }) {
  const { preferences } = usePreferences();

  const theme = useMemo(() => {
    switch (preferences.theme) {
      case 'light':
        return modernFitnessThemeLight;
      case 'dark':
        return evolveDarkTheme;
      case 'auto': {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? evolveDarkTheme : modernFitnessThemeLight;
      }
      default:
        return evolveDarkTheme;
    }
  }, [preferences.theme]);

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline applies background color and resets styles based on the CURRENT theme */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}