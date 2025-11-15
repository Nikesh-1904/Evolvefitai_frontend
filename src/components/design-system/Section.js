// src/components/design-system/Section.js - Standardized Content Sections

import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

/**
 * Standardized Section component for organizing page content
 *
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {string} props.description - Optional section description
 * @param {React.ReactNode} props.children - Section content
 * @param {React.ReactNode} props.actions - Optional action buttons in section header
 * @param {boolean} props.divider - Show divider at bottom
 * @param {Object} props.sx - Additional MUI sx styling
 */
const Section = ({
  title,
  description,
  children,
  actions,
  divider = false,
  sx = {},
  ...props
}) => {
  return (
    <Box
      component="section"
      sx={{
        mb: 4,
        ...sx,
      }}
      {...props}
    >
      {/* Section Header */}
      {(title || actions) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: description ? 1 : 3,
            gap: 2,
          }}
        >
          {title && (
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 600,
                flex: 1,
              }}
            >
              {title}
            </Typography>
          )}
          {actions && (
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              {actions}
            </Box>
          )}
        </Box>
      )}

      {/* Section Description */}
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: '800px' }}
        >
          {description}
        </Typography>
      )}

      {/* Section Content */}
      <Box>{children}</Box>

      {/* Optional Divider */}
      {divider && <Divider sx={{ mt: 4 }} />}
    </Box>
  );
};

export default Section;
