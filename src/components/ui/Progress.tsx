'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { designTokens } from '@/lib/design-tokens';

interface ProgressProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

const variantStyles = {
  primary: {
    background: designTokens.colors.primary[500],
    trackBackground: designTokens.colors.primary[100],
  },
  success: {
    background: designTokens.colors.success[500],
    trackBackground: designTokens.colors.success[100],
  },
  warning: {
    background: designTokens.colors.warning[500],
    trackBackground: designTokens.colors.warning[100],
  },
  danger: {
    background: designTokens.colors.danger[500],
    trackBackground: designTokens.colors.danger[100],
  },
};

const sizeStyles = {
  sm: {
    height: '0.25rem',
    fontSize: designTokens.typography.fontSize.xs[0],
  },
  md: {
    height: '0.5rem',
    fontSize: designTokens.typography.fontSize.sm[0],
  },
  lg: {
    height: '0.75rem',
    fontSize: designTokens.typography.fontSize.base[0],
  },
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  label,
  animated = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span 
            className="font-medium text-gray-700"
            style={{ fontSize: sizeStyle.fontSize }}
          >
            {label || 'Progress'}
          </span>
          <span 
            className="font-semibold"
            style={{ 
              fontSize: sizeStyle.fontSize,
              color: variantStyle.background,
            }}
          >
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div
        className="relative overflow-hidden"
        style={{
          height: sizeStyle.height,
          backgroundColor: variantStyle.trackBackground,
          borderRadius: designTokens.borderRadius.full,
        }}
      >
        <motion.div
          className="absolute left-0 top-0 h-full"
          style={{
            background: `linear-gradient(90deg, ${variantStyle.background}, ${variantStyle.background}dd)`,
            borderRadius: designTokens.borderRadius.full,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 0.8 : 0,
            type: 'spring',
            stiffness: 80,
          }}
        />
        
        {/* Shimmer effect for active progress */}
        {animated && percentage > 0 && percentage < 100 && (
          <motion.div
            className="absolute left-0 top-0 h-full w-full"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
              width: '30%',
            }}
            animate={{
              x: ['-100%', '400%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}
      </div>
    </div>
  );
};