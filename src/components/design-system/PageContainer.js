// src/components/design-system/PageContainer.js - Standardized Page Layout Container

import React from 'react';
import { Container, Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

/**
 * Standardized Page Container for consistent layout across all pages
 *
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Optional page subtitle/description
 * @param {React.ReactNode} props.children - Page content
 * @param {Array} props.breadcrumbs - Optional breadcrumb navigation [{label, href}]
 * @param {React.ReactNode} props.actions - Optional action buttons in header
 * @param {string} props.maxWidth - Container max width ('xs' | 'sm' | 'md' | 'lg' | 'xl')
 * @param {boolean} props.disableGutters - Remove container padding
 * @param {Object} props.sx - Additional MUI sx styling
 */
const PageContainer = ({
  title,
  subtitle,
  children,
  breadcrumbs,
  actions,
  maxWidth = 'lg',
  disableGutters = false,
  sx = {},
  ...props
}) => {
  return (
    <Container
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      sx={{
        py: { xs: 3, sm: 4, md: 5 },
        px: { xs: 2, sm: 3 },
        ...sx,
      }}
      {...props}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast ? (
              <Typography key={index} color="text.primary" variant="body2">
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={index}
                underline="hover"
                color="text.secondary"
                href={crumb.href}
                variant="body2"
              >
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      {/* Page Header */}
      {(title || actions) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {title && (
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: subtitle ? 1 : 0,
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: '800px' }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {actions && (
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              {actions}
            </Box>
          )}
        </Box>
      )}

      {/* Page Content */}
      <Box>{children}</Box>
    </Container>
  );
};

export default PageContainer;
