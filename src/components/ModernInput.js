// src/components/ModernInput.js - Reusable Modern Input Component for All Pages

import React from 'react';
import { 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Typography,
  Chip,
  OutlinedInput,
  FormHelperText
} from '@mui/material';

const ModernInput = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  variant = 'outlined', // 'outlined', 'glass', 'minimal'
  size = 'medium', // 'small', 'medium', 'large'
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

  // Input variant configurations
  const getVariantStyles = (variant, size) => {
    const baseBorderRadius = {
      small: '8px',
      medium: '12px',
      large: '14px'
    };

    const basePadding = {
      small: '12px 14px',
      medium: '16px 18px',
      large: '18px 20px'
    };

    const baseFontSize = {
      small: '0.8125rem',
      medium: '0.875rem',
      large: '1rem'
    };

    const baseHeight = {
      small: '40px',
      medium: '48px',
      large: '56px'
    };

    const baseStyles = {
      '& .MuiOutlinedInput-root': {
        borderRadius: baseBorderRadius[size],
        fontSize: baseFontSize[size],
        fontFamily: '"Inter", sans-serif',
        fontWeight: 500,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        
        ...(multiline ? {} : { minHeight: baseHeight[size] }),
        
        '& fieldset': {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },

        '&:hover:not(.Mui-disabled) fieldset': {
          borderColor: 'rgba(0, 212, 255, 0.5)',
        },

        '&.Mui-focused fieldset': {
          borderColor: '#00D4FF',
          borderWidth: '2px',
          boxShadow: '0 0 0 4px rgba(0, 212, 255, 0.1)',
        },

        '&.Mui-error fieldset': {
          borderColor: '#EF4444',
        },

        '&.Mui-disabled': {
          opacity: 0.6,
        },

        '& input, & textarea': {
          color: '#FFFFFF',
          '&::placeholder': {
            color: '#94A3B8', // text.tertiary
            opacity: 1,
          }
        }
      },

      '& .MuiInputLabel-root': {
        color: '#CBD5E1', // text.secondary
        fontFamily: '"Inter", sans-serif',
        fontWeight: 500,
        fontSize: baseFontSize[size],
        
        '&.Mui-focused': {
          color: '#00D4FF',
        },
        
        '&.Mui-error': {
          color: '#EF4444',
        }
      },

      '& .MuiFormHelperText-root': {
        fontFamily: '"Inter", sans-serif',
        fontSize: '0.75rem',
        marginTop: '6px',
        marginLeft: '4px',
        
        '&.Mui-error': {
          color: '#EF4444',
        }
      }
    };

    switch (variant) {
      case 'glass':
        return {
          ...baseStyles,
          '& .MuiOutlinedInput-root': {
            ...baseStyles['& .MuiOutlinedInput-root'],
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            
            '& fieldset': {
              ...baseStyles['& .MuiOutlinedInput-root']['& fieldset'],
              border: 'none',
            },

            '&:hover:not(.Mui-disabled)': {
              background: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'rgba(0, 212, 255, 0.3)',
            },

            '&.Mui-focused': {
              background: 'rgba(255, 255, 255, 0.1)',
              borderColor: '#00D4FF',
              boxShadow: '0 0 0 4px rgba(0, 212, 255, 0.1)',
            }
          }
        };

      case 'minimal':
        return {
          ...baseStyles,
          '& .MuiOutlinedInput-root': {
            ...baseStyles['& .MuiOutlinedInput-root'],
            background: 'transparent',
            borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0px',
            
            '& fieldset': {
              border: 'none',
            },

            '&:hover:not(.Mui-disabled)': {
              borderBottom: '2px solid rgba(0, 212, 255, 0.5)',
            },

            '&.Mui-focused': {
              borderBottom: '2px solid #00D4FF',
              boxShadow: 'none',
            }
          }
        };

      default: // outlined
        return {
          ...baseStyles,
          '& .MuiOutlinedInput-root': {
            ...baseStyles['& .MuiOutlinedInput-root'],
            background: 'rgba(37, 42, 61, 0.6)',
            
            '& fieldset': {
              ...baseStyles['& .MuiOutlinedInput-root']['& fieldset'],
              borderColor: 'rgba(255, 255, 255, 0.15)',
            }
          }
        };
    }
  };

  const inputStyles = {
    ...getVariantStyles(variant, size),
    ...sx,
  };

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
        sx={inputStyles}
        InputProps={{
          startAdornment: startIcon && (
            <Box sx={{ mr: 1, color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
              {startIcon}
            </Box>
          ),
          endAdornment: endIcon && (
            <Box sx={{ ml: 1, color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
              {endIcon}
            </Box>
          ),
        }}
        {...props}
      />
    </Box>
  );
};

// Modern Select Component
export const ModernSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
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
  
  const selectStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: size === 'small' ? '8px' : size === 'large' ? '14px' : '12px',
      fontSize: size === 'small' ? '0.8125rem' : size === 'large' ? '1rem' : '0.875rem',
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      background: variant === 'glass' 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(37, 42, 61, 0.6)',
      backdropFilter: variant === 'glass' ? 'blur(10px)' : 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      color: '#FFFFFF',
      minHeight: size === 'small' ? '40px' : size === 'large' ? '56px' : '48px',
      
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },

      '&:hover:not(.Mui-disabled) fieldset': {
        borderColor: 'rgba(0, 212, 255, 0.5)',
      },

      '&.Mui-focused fieldset': {
        borderColor: '#00D4FF',
        borderWidth: '2px',
        boxShadow: '0 0 0 4px rgba(0, 212, 255, 0.1)',
      },

      '& .MuiSelect-icon': {
        color: '#94A3B8',
      }
    },

    '& .MuiInputLabel-root': {
      color: '#CBD5E1',
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      
      '&.Mui-focused': {
        color: '#00D4FF',
      },
    },

    '& .MuiFormHelperText-root': {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem',
      marginTop: '6px',
      marginLeft: '4px',
    },
    
    ...sx,
  };

  const menuProps = {
    PaperProps: {
      sx: {
        background: 'rgba(26, 31, 46, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        maxHeight: 300,
        '& .MuiMenuItem-root': {
          color: '#FFFFFF',
          fontFamily: '"Inter", sans-serif',
          fontSize: size === 'small' ? '0.8125rem' : size === 'large' ? '1rem' : '0.875rem',
          padding: '12px 16px',
          '&:hover': {
            background: 'rgba(0, 212, 255, 0.1)',
          },
          '&.Mui-selected': {
            background: 'rgba(0, 212, 255, 0.2)',
            '&:hover': {
              background: 'rgba(0, 212, 255, 0.3)',
            }
          }
        }
      }
    }
  };

  const renderValue = (selected) => {
    if (!selected || (Array.isArray(selected) && selected.length === 0)) {
      return <span style={{ color: '#94A3B8' }}>{placeholder}</span>;
    }
    
    if (multiple) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selected.map((value) => (
            <Chip
              key={value}
              label={options.find(opt => opt.value === value)?.label || value}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                height: '24px',
                '& .MuiChip-deleteIcon': {
                  color: '#FFFFFF',
                  fontSize: '16px',
                }
              }}
            />
          ))}
        </Box>
      );
    }
    
    return options.find(opt => opt.value === selected)?.label || selected;
  };

  return (
    <FormControl fullWidth={fullWidth} error={error} sx={selectStyles}>
      <InputLabel required={required}>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        multiple={multiple}
        displayEmpty={!!placeholder}
        renderValue={renderValue}
        input={<OutlinedInput label={label} />}
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