// src/components/ModernCard.js - Reusable Modern Card Component for All Pages

import React from 'react';
import { Card, CardContent, CardHeader, CardActions, Typography, Box } from '@mui/material';

const ModernCard = ({
  children,
  title,
  subtitle,
  headerAction,
  cardActions,
  variant = 'default', // 'default', 'glass', 'stat', 'feature'
  elevation = 'medium', // 'low', 'medium', 'high'
  hover = true,
  onClick,
  sx = {},
  contentSx = {},
  ...props
}) => {
  
  // Card variant configurations
  const getVariantStyles = (variant) => {
    const baseStyles = {
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      position: 'relative',
    };

    switch (variant) {
      case 'glass':
        return {
          ...baseStyles,
          background: 'rgba(26, 31, 46, 0.4)', // More transparent for glass effect
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        };
      
      case 'stat':
        return {
          ...baseStyles,
          background: 'rgba(37, 42, 61, 0.8)',
          borderRadius: '16px',
          textAlign: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
          }
        };
      
      case 'feature':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.95) 0%, rgba(37, 42, 61, 0.95) 100%)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          borderRadius: '24px',
        };
      
      default:
        return {
          ...baseStyles,
          background: 'rgba(26, 31, 46, 0.8)',
        };
    }
  };

  // Elevation configurations
  const getElevationStyles = (elevation) => {
    switch (elevation) {
      case 'low':
        return {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        };
      case 'high':
        return {
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        };
      default: // medium
        return {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
        };
    }
  };

  // Hover effect configurations
  const getHoverStyles = (hover, variant) => {
    if (!hover) return {};
    
    const baseHover = {
      transform: 'translateY(-6px)',
      borderColor: 'rgba(0, 212, 255, 0.3)',
    };

    switch (variant) {
      case 'stat':
        return {
          ...baseHover,
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: '0 12px 40px rgba(0, 212, 255, 0.2)',
        };
      case 'feature':
        return {
          ...baseHover,
          borderColor: 'rgba(0, 212, 255, 0.5)',
          boxShadow: '0 20px 60px rgba(0, 212, 255, 0.15)',
        };
      default:
        return {
          ...baseHover,
          boxShadow: '0 20px 60px rgba(0, 212, 255, 0.15)',
        };
    }
  };

  const cardStyles = {
    ...getVariantStyles(variant),
    ...getElevationStyles(elevation),
    cursor: onClick ? 'pointer' : 'default',
    '&:hover': hover ? getHoverStyles(hover, variant) : {},
    ...sx,
  };

  return (
    <Card
      sx={cardStyles}
      onClick={onClick}
      {...props}
    >
      {/* Modern Card Header */}
      {(title || subtitle || headerAction) && (
        <CardHeader
          title={
            title && (
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: '#FFFFFF',
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em',
                }}
              >
                {title}
              </Typography>
            )
          }
          subheader={
            subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: '#94A3B8', // text.tertiary
                  fontWeight: 500,
                  marginTop: '4px',
                  lineHeight: 1.4,
                }}
              >
                {subtitle}
              </Typography>
            )
          }
          action={headerAction}
          sx={{
            pb: title || subtitle ? 1 : 0,
            '& .MuiCardHeader-content': {
              overflow: 'hidden',
            }
          }}
        />
      )}

      {/* Modern Card Content */}
      <CardContent
        sx={{
          padding: '20px 24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
          ...contentSx,
        }}
      >
        {children}
      </CardContent>

      {/* Modern Card Actions */}
      {cardActions && (
        <CardActions
          sx={{
            padding: '16px 24px 20px',
            gap: 1,
            justifyContent: 'flex-end',
          }}
        >
          {cardActions}
        </CardActions>
      )}

      {/* Subtle gradient overlay for enhanced depth */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, 0.5) 50%, transparent 100%)',
          opacity: variant === 'feature' ? 1 : 0.7,
        }}
      />
    </Card>
  );
};

// Specialized Card Components for common use cases

// Stats Card with number display
export const StatCard = ({ icon, label, value, change, changeColor, ...props }) => (
  <ModernCard
    variant="stat"
    hover={true}
    contentSx={{ textAlign: 'center', py: 2 }}
    {...props}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
      {/* Icon with gradient background */}
      {icon && (
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '24px',
          }}
        >
          {icon}
        </Box>
      )}

      {/* Value */}
      <Typography
        variant="h4"
        sx={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 800,
          fontSize: '2rem',
          color: '#FFFFFF',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </Typography>

      {/* Label */}
      <Typography
        variant="body2"
        sx={{
          color: '#CBD5E1', // text.secondary
          fontWeight: 500,
          fontSize: '0.875rem',
          textAlign: 'center',
        }}
      >
        {label}
      </Typography>

      {/* Change indicator */}
      {change && (
        <Typography
          variant="caption"
          sx={{
            color: changeColor || '#10B981', // success color
            fontWeight: 600,
            fontSize: '0.75rem',
            background: `rgba(${changeColor === '#EF4444' ? '239, 68, 68' : '16, 185, 129'}, 0.1)`,
            padding: '2px 8px',
            borderRadius: '12px',
          }}
        >
          {change}
        </Typography>
      )}
    </Box>
  </ModernCard>
);

// Quick Action Card for dashboard
export const QuickActionCard = ({ icon, title, description, onClick, gradient, ...props }) => (
  <ModernCard
    variant="feature"
    hover={true}
    onClick={onClick}
    {...props}
  >
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      {/* Icon */}
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '16px',
          background: gradient || 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontSize: '28px',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontWeight: 700,
            fontSize: '1.125rem',
            color: '#FFFFFF',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            marginBottom: '4px',
          }}
        >
          {title}
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            color: '#CBD5E1', // text.secondary
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  </ModernCard>
);

export default ModernCard;