'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { designTokens } from '@/lib/design-tokens';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  animated?: boolean;
}

const variantStyles = {
  primary: {
    background: designTokens.colors.primary[100],
    color: designTokens.colors.primary[800],
    border: designTokens.colors.primary[200],
  },
  secondary: {
    background: designTokens.colors.neutral[100],
    color: designTokens.colors.neutral[700],
    border: designTokens.colors.neutral[200],
  },
  success: {
    background: designTokens.colors.success[100],
    color: designTokens.colors.success[800],
    border: designTokens.colors.success[200],
  },
  warning: {
    background: designTokens.colors.warning[100],
    color: designTokens.colors.warning[800],
    border: designTokens.colors.warning[200],
  },
  danger: {
    background: designTokens.colors.danger[100],
    color: designTokens.colors.danger[800],
    border: designTokens.colors.danger[200],
  },
  neutral: {
    background: designTokens.colors.neutral[200],
    color: designTokens.colors.neutral[700],
    border: designTokens.colors.neutral[300],
  },
};

const sizeStyles = {
  sm: {
    padding: `${designTokens.spacing.xs} ${designTokens.spacing.sm}`,
    fontSize: designTokens.typography.fontSize.xs[0],
    gap: designTokens.spacing.xs,
  },
  md: {
    padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
    fontSize: designTokens.typography.fontSize.sm[0],
    gap: designTokens.spacing.sm,
  },
  lg: {
    padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
    fontSize: designTokens.typography.fontSize.base[0],
    gap: designTokens.spacing.sm,
  },
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  animated = true,
}) => {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  const badgeContent = (
    <span
      className={`
        inline-flex items-center justify-center
        font-medium border
        ${className}
      `}
      style={{
        backgroundColor: variantStyle.background,
        color: variantStyle.color,
        borderColor: variantStyle.border,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        gap: sizeStyle.gap,
        borderRadius: designTokens.borderRadius.full,
      }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: parseFloat(designTokens.animation.duration.base.replace('ms', '')) / 1000,
          type: 'spring',
          stiffness: 150,
        }}
        className="inline-block"
      >
        {badgeContent}
      </motion.div>
    );
  }

  return badgeContent;
};