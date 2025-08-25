'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { designTokens } from '@/lib/design-tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles = {
  primary: {
    background: `linear-gradient(135deg, ${designTokens.colors.primary[500]}, ${designTokens.colors.primary[600]})`,
    color: 'white',
    borderColor: designTokens.colors.primary[600],
    hoverBackground: `linear-gradient(135deg, ${designTokens.colors.primary[600]}, ${designTokens.colors.primary[700]})`,
  },
  secondary: {
    background: designTokens.colors.neutral[100],
    color: designTokens.colors.neutral[700],
    borderColor: designTokens.colors.neutral[300],
    hoverBackground: designTokens.colors.neutral[200],
  },
  success: {
    background: `linear-gradient(135deg, ${designTokens.colors.success[500]}, ${designTokens.colors.success[600]})`,
    color: 'white',
    borderColor: designTokens.colors.success[600],
    hoverBackground: `linear-gradient(135deg, ${designTokens.colors.success[600]}, ${designTokens.colors.success[700]})`,
  },
  warning: {
    background: `linear-gradient(135deg, ${designTokens.colors.warning[500]}, ${designTokens.colors.warning[600]})`,
    color: 'white',
    borderColor: designTokens.colors.warning[600],
    hoverBackground: `linear-gradient(135deg, ${designTokens.colors.warning[600]}, ${designTokens.colors.warning[700]})`,
  },
  danger: {
    background: `linear-gradient(135deg, ${designTokens.colors.danger[500]}, ${designTokens.colors.danger[600]})`,
    color: 'white',
    borderColor: designTokens.colors.danger[600],
    hoverBackground: `linear-gradient(135deg, ${designTokens.colors.danger[600]}, ${designTokens.colors.danger[700]})`,
  },
};

const sizeStyles = {
  sm: {
    padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
    fontSize: designTokens.typography.fontSize.sm[0],
    borderRadius: designTokens.borderRadius.md,
  },
  md: {
    padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
    fontSize: designTokens.typography.fontSize.base[0],
    borderRadius: designTokens.borderRadius.lg,
  },
  lg: {
    padding: `${designTokens.spacing.lg} ${designTokens.spacing.xl}`,
    fontSize: designTokens.typography.fontSize.lg[0],
    borderRadius: designTokens.borderRadius.xl,
  },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        relative inline-flex items-center justify-center gap-2
        font-medium transition-all duration-200
        border border-solid
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:scale-105 active:scale-95
        ${className}
      `}
      style={{
        background: variantStyle.background,
        color: variantStyle.color,
        borderColor: variantStyle.borderColor,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        borderRadius: sizeStyle.borderRadius,
        boxShadow: designTokens.shadows.sm,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.background = variantStyle.hoverBackground;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.background = variantStyle.background;
        }
      }}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {leftIcon && !isLoading && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && !isLoading && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};