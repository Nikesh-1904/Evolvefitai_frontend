// src/components/design-system/PageContainer.js — ev page shell. API preserved.

import React from 'react';
import { Box } from '@mui/material';
import { ev } from '../../theme/evolveDarkTheme';

const PAGE_X = 'clamp(28px, 6vw, 96px)';

const monoLabel = {
  fontFamily: ev.mono,
  fontSize: 11,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: ev.chalkDim,
};

const PageContainer = ({
  title,
  subtitle,
  children,
  breadcrumbs,
  actions,
  maxWidth, // kept for API parity but ignored
  disableGutters = false,
  sx = {},
  ...props
}) => {
  const px = disableGutters ? 0 : PAGE_X;

  return (
    <Box component="section" sx={{ animation: 'ev-rise .45s ease both', ...sx }} {...props}>

      {breadcrumbs && breadcrumbs.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px,
            pt: 4,
            ...monoLabel,
            color: ev.chalkMute,
          }}
        >
          {breadcrumbs.map((c, i) => {
            const last = i === breadcrumbs.length - 1;
            return (
              <React.Fragment key={i}>
                {i > 0 && <Box component="span" sx={{ color: ev.chalkMute }}>/</Box>}
                {last ? (
                  <Box component="span" sx={{ color: ev.chalk }}>{c.label}</Box>
                ) : (
                  <Box
                    component="a"
                    href={c.href}
                    sx={{ color: ev.chalkMute, cursor: 'pointer', '&:hover': { color: ev.chalk } }}
                  >
                    {c.label}
                  </Box>
                )}
              </React.Fragment>
            );
          })}
        </Box>
      )}

      {(title || actions) && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
            alignItems: 'end',
            gap: 4,
            px,
            pt: 'clamp(64px, 10vh, 120px)',
            pb: 'clamp(48px, 8vh, 96px)',
            borderBottom: `1px solid ${ev.rule}`,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            {title && (
              <Box
                component="h1"
                sx={{
                  m: 0,
                  fontFamily: ev.display,
                  fontWeight: 400,
                  fontSize: 'clamp(48px, 7vw, 96px)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.025em',
                  color: ev.chalk,
                }}
              >
                {title}
                <Box component="span" sx={{ color: ev.accent }}>.</Box>
              </Box>
            )}
            {subtitle && (
              <Box
                sx={{
                  mt: 3,
                  maxWidth: '60ch',
                  fontFamily: ev.body,
                  fontWeight: 300,
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: ev.chalkDim,
                }}
              >
                {subtitle}
              </Box>
            )}
          </Box>

          {actions && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifySelf: { md: 'end' } }}>
              {actions}
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ px, py: 'clamp(48px, 8vh, 96px)' }}>
        {children}
      </Box>

    </Box>
  );
};

export default PageContainer;
