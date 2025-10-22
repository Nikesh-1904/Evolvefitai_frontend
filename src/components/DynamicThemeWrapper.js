// src/components/DynamicThemeWrapper.js

import React, { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { usePreferences } from '../contexts/PreferencesContext';

// Import your themes
import modernFitnessTheme from '../theme/modernFitnessTheme'; // Your Dark Theme
import modernFitnessThemeLight from '../theme/lightTheme'; // Your Light Theme (using the filename you provided)

export default function DynamicThemeWrapper({ children }) {
  const { preferences } = usePreferences();

  // useMemo ensures the theme object is only recalculated when the preference changes
  const theme = useMemo(() => {
    console.log("Applying theme:", preferences.theme); // Add log to check
    switch (preferences.theme) {
      case 'light':
        return modernFitnessThemeLight;
      case 'dark':
        return modernFitnessTheme;
      case 'auto':
        // Basic check for system preference (you can enhance this)
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? modernFitnessTheme : modernFitnessThemeLight;
      default:
        // Default to dark if the setting is somehow invalid
        return modernFitnessTheme;
    }
  }, [preferences.theme]); // Dependency array: only re-run when theme preference changes

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline applies background color and resets styles based on the CURRENT theme */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}