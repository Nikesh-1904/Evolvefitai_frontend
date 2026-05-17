// src/components/ModernInput.js — flat hairline input, underline focus. API preserved.

import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import { ev } from '../theme/evolveDarkTheme';

const baseFieldSx = (size = 'medium') => {
  const fontSize = size === 'small' ? 13 : size === 'large' ? 16 : 14;
  return {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      fontFamily: ev.body,
      fontSize,
      color: ev.chalk,
      backgroundColor: 'transparent',
      transition: 'border-color .15s ease',
      '& fieldset': { border: 'none' },
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0, right: 0, bottom: 0,
        height: '1px',
        background: ev.rule,
      },
      '&:hover:not(.Mui-disabled)::before': { background: ev.chalkDim },
      '&.Mui-focused::before': { background: ev.accent, height: '1px' },
      '& input, & textarea': {
        color: ev.chalk,
        padding: '14px 0',
        '&::placeholder': { color: ev.chalkMute, opacity: 1 },
      },
    },
    '& .MuiInputLabel-root': {
      fontFamily: ev.mono,
      fontSize: 10,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: ev.chalkDim,
      transform: 'translate(0, -8px) scale(1)',
      '&.Mui-focused': { color: ev.accent },
      '&.Mui-error': { color: ev.warn },
    },
    '& .MuiFormHelperText-root': {
      fontFamily: ev.mono,
      fontSize: 10,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: ev.chalkMute,
      marginTop: '8px',
      marginLeft: 0,
      '&.Mui-error': { color: ev.warn },
    },
  };
};

const ModernInput = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
  error = false,
  helperText,
  required = false,
  disabled = false,
  multiline = false,
  rows = 4,
  startIcon,
  endIcon,
  sx = {},
  ...props
}) => {
  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={type}
        variant="outlined"
        size={size}
        fullWidth={fullWidth}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        sx={{ ...baseFieldSx(size), ...sx }}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          startAdornment: startIcon && (
            <Box sx={{ mr: 1.5, color: ev.chalkMute, display: 'inline-flex', alignItems: 'center', '& > *': { fontSize: 16 } }}>
              {startIcon}
            </Box>
          ),
          endAdornment: endIcon && (
            <Box sx={{ ml: 1.5, color: ev.chalkMute, display: 'inline-flex', alignItems: 'center', '& > *': { fontSize: 16 } }}>
              {endIcon}
            </Box>
          ),
        }}
        {...props}
      />
    </Box>
  );
};

export const ModernSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  multiple = false,
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
  error = false,
  helperText,
  required = false,
  disabled = false,
  sx = {},
  ...props
}) => {
  const selectSx = {
    ...baseFieldSx(size),
    '& .MuiSelect-icon': { color: ev.chalkMute },
    ...sx,
  };

  const menuProps = {
    PaperProps: {
      sx: {
        backgroundColor: ev.ink,
        border: `1px solid ${ev.rule}`,
        borderRadius: 0,
        boxShadow: 'none',
        maxHeight: 320,
        mt: 0.5,
        '& .MuiMenuItem-root': {
          fontFamily: ev.body,
          fontSize: 13,
          color: ev.chalkDim,
          py: 1.25,
          px: 2,
          '&:hover': { backgroundColor: ev.ruleSoft, color: ev.chalk },
          '&.Mui-selected': {
            backgroundColor: 'transparent',
            color: ev.accent,
            '&:hover': { backgroundColor: ev.ruleSoft },
          },
        },
      },
    },
  };

  const renderValue = (selected) => {
    if (!selected || (Array.isArray(selected) && selected.length === 0)) {
      return <Box component="span" sx={{ color: ev.chalkMute }}>{placeholder}</Box>;
    }
    if (multiple) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selected.map((v) => (
            <Chip
              key={v}
              label={options.find((o) => o.value === v)?.label || v}
              size="small"
              sx={{
                backgroundColor: ev.chalk,
                color: ev.ink,
                borderRadius: 0,
                fontFamily: ev.mono,
                fontSize: 10,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                height: 22,
              }}
            />
          ))}
        </Box>
      );
    }
    return options.find((o) => o.value === selected)?.label || selected;
  };

  return (
    <FormControl fullWidth={fullWidth} error={error} sx={selectSx}>
      <InputLabel required={required} shrink>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        multiple={multiple}
        displayEmpty={!!placeholder}
        renderValue={renderValue}
        input={<OutlinedInput label={label} notched={false} />}
        MenuProps={menuProps}
        disabled={disabled}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default ModernInput;
