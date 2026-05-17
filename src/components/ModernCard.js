// src/components/ModernCard.js — flat hairline container. API preserved.

import React from 'react';
import { Box } from '@mui/material';
import { ev } from '../theme/evolveDarkTheme';

const monoLabel = {
  fontFamily: ev.mono,
  fontSize: 11,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: ev.chalkDim,
};

const ModernCard = ({
  children,
  title,
  subtitle,
  headerAction,
  cardActions,
  variant = 'default', // kept for API parity; not rendered differently
  elevation = 'medium',
  hover = true,
  onClick,
  sx = {},
  contentSx = {},
  ...props
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        backgroundColor: ev.ink,
        color: ev.chalk,
        border: `1px solid ${ev.rule}`,
        borderRadius: 0,
        boxShadow: 'none',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color .2s ease',
        '&:hover': hover ? { borderColor: ev.chalkMute } : {},
        ...sx,
      }}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
            p: 3,
            pb: 2,
            borderBottom: `1px solid ${ev.rule}`,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {title && (
              <Box sx={{
                fontFamily: ev.display,
                fontWeight: 400,
                fontSize: 22,
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                color: ev.chalk,
              }}>
                {title}
              </Box>
            )}
            {subtitle && (
              <Box sx={{ ...monoLabel, mt: 1.25, color: ev.chalkMute }}>
                {subtitle}
              </Box>
            )}
          </Box>
          {headerAction && <Box sx={{ flexShrink: 0 }}>{headerAction}</Box>}
        </Box>
      )}

      <Box sx={{ p: 3, ...contentSx }}>
        {children}
      </Box>

      {cardActions && (
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            justifyContent: 'flex-end',
            p: 3,
            pt: 0,
          }}
        >
          {cardActions}
        </Box>
      )}
    </Box>
  );
};

// Stat tile — large numeral, mono label
export const StatCard = ({ icon, label, value, change, changeColor, ...props }) => (
  <ModernCard hover={true} contentSx={{ p: 3 }} {...props}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <Box sx={monoLabel}>{label}</Box>
      {icon && (
        <Box sx={{ color: ev.chalkMute, display: 'inline-flex', '& > *': { fontSize: 18 } }}>{icon}</Box>
      )}
    </Box>
    <Box sx={{
      fontFamily: ev.display,
      fontSize: 'clamp(40px, 4vw, 56px)',
      lineHeight: 0.95,
      letterSpacing: '-0.025em',
      color: ev.chalk,
      mt: 2.5,
    }}>
      {value}
    </Box>
    {change && (
      <Box sx={{
        mt: 2,
        fontFamily: ev.mono,
        fontSize: 11,
        letterSpacing: '0.06em',
        color: changeColor === '#EF4444' ? ev.warn : ev.accent,
      }}>
        {change}
      </Box>
    )}
  </ModernCard>
);

// Quick-action tile — title + description, anchored arrow
export const QuickActionCard = ({ icon, title, description, onClick, gradient, ...props }) => (
  <ModernCard hover={true} onClick={onClick} {...props}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
      {icon && (
        <Box sx={{
          color: ev.chalkDim,
          display: 'inline-flex',
          '& > *': { fontSize: 22 },
          mt: '4px',
        }}>
          {icon}
        </Box>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{
          fontFamily: ev.display,
          fontSize: 22,
          letterSpacing: '-0.01em',
          color: ev.chalk,
          lineHeight: 1.15,
        }}>
          {title}
        </Box>
        <Box sx={{ mt: 1.5, fontFamily: ev.body, fontWeight: 300, fontSize: 13, lineHeight: 1.55, color: ev.chalkDim }}>
          {description}
        </Box>
      </Box>
      <Box sx={{ ...monoLabel, color: ev.chalkMute, alignSelf: 'flex-end' }}>↗</Box>
    </Box>
  </ModernCard>
);

export default ModernCard;
