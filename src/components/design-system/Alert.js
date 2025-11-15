// src/components/design-system/Alert.js - Standardized Alert Component

import React from 'react';
import { Alert as MuiAlert, AlertTitle, Collapse, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

/**
 * Standardized Alert component for consistent error/success/warning/info messages
 *
 * @param {Object} props
 * @param {string} props.severity - 'error' | 'warning' | 'info' | 'success'
 * @param {string} props.title - Optional alert title
 * @param {React.ReactNode} props.children - Alert message content
 * @param {boolean} props.closable - Whether the alert can be dismissed
 * @param {function} props.onClose - Callback when alert is closed
 * @param {string} props.variant - 'filled' | 'outlined' | 'standard'
 * @param {Object} props.sx - Additional MUI sx styling
 */
const Alert = ({
  severity = 'info',
  title,
  children,
  closable = false,
  onClose,
  variant = 'filled',
  sx = {},
  ...props
}) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Collapse in={open}>
      <MuiAlert
        severity={severity}
        variant={variant}
        action={
          closable && (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          )
        }
        sx={{
          borderRadius: 2,
          mb: 2,
          '& .MuiAlert-icon': {
            fontSize: '1.5rem',
          },
          ...sx,
        }}
        {...props}
      >
        {title && <AlertTitle sx={{ fontWeight: 600 }}>{title}</AlertTitle>}
        {children}
      </MuiAlert>
    </Collapse>
  );
};

export default Alert;
