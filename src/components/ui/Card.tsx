'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { designTokens } from '@/lib/design-tokens';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  animated?: boolean;
}

const variantStyles = {
  default: {
    background: 'white',
    border: `1px solid ${designTokens.colors.neutral[200]}`,
    boxShadow: designTokens.shadows.sm,
  },
  elevated: {
    background: 'white',
    border: 'none',
    boxShadow: designTokens.shadows.lg,
  },
  outlined: {
    background: 'white',
    border: `2px solid ${designTokens.colors.neutral[300]}`,
    boxShadow: 'none',
  },
  gradient: {
    background: `linear-gradient(135deg, ${designTokens.colors.primary[50]}, ${designTokens.colors.primary[100]})`,
    border: `1px solid ${designTokens.colors.primary[200]}`,
    boxShadow: designTokens.shadows.sm,
  },
};

const paddingStyles = {
  none: '0',
  sm: designTokens.spacing.sm,
  md: designTokens.spacing.md,
  lg: designTokens.spacing.lg,
  xl: designTokens.spacing.xl,
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hoverable = false,
  animated = true,
}) => {
  const variantStyle = variantStyles[variant];
  const isClickable = !!onClick || hoverable;

  const cardContent = (
    <div
      className={`
        transition-all duration-200
        ${isClickable ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        background: variantStyle.background,
        border: variantStyle.border,
        boxShadow: variantStyle.boxShadow,
        borderRadius: designTokens.borderRadius.xl,
        padding: paddingStyles[padding],
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );

  if (animated && isClickable) {
    return (
      <motion.div
        whileHover={{
          scale: 1.02,
          boxShadow: designTokens.shadows.xl,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{
          duration: parseFloat(designTokens.animation.duration.base.replace('ms', '')) / 1000,
          type: 'spring',
          stiffness: 100,
        }}
      >
        {cardContent}
      </motion.div>
    );
  }

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: parseFloat(designTokens.animation.duration.base.replace('ms', '')) / 1000,
          type: 'spring',
          stiffness: 100,
        }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};