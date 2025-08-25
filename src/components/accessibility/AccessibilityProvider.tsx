'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { accessibilityModes, ContrastLevel, accessibleColors } from '@/lib/accessibility';

interface AccessibilitySettings {
  contrastMode: keyof typeof accessibilityModes;
  fontSize: 'normal' | 'large' | 'extra-large';
  reducedMotion: boolean;
  highContrast: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  getContrastColors: (variant: string) => { foreground: string; background: string };
  respectsReducedMotion: boolean;
}

const defaultSettings: AccessibilitySettings = {
  contrastMode: 'standard',
  fontSize: 'normal',
  reducedMotion: false,
  highContrast: false,
  colorBlindMode: 'none'
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [respectsReducedMotion, setRespectsReducedMotion] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('mathhorn-accessibility');
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch (error) {
        console.warn('Failed to load accessibility settings:', error);
      }
    }

    // Check for system reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setRespectsReducedMotion(mediaQuery.matches || settings.reducedMotion);
    
    const handleChange = () => setRespectsReducedMotion(mediaQuery.matches || settings.reducedMotion);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.reducedMotion]);

  // Save settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem('mathhorn-accessibility', JSON.stringify(settings));
    applyGlobalStyles(settings);
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const getContrastColors = (variant: string) => {
    if (settings.highContrast) {
      return {
        foreground: accessibleColors.highContrast.darkOnLight.foreground,
        background: accessibleColors.highContrast.darkOnLight.background
      };
    }

    switch (variant) {
      case 'primary':
        return {
          foreground: accessibleColors.children.primary.foreground,
          background: accessibleColors.children.primary.background
        };
      case 'success':
        return {
          foreground: accessibleColors.children.success.foreground,
          background: accessibleColors.children.success.background
        };
      case 'warning':
        return {
          foreground: accessibleColors.children.warning.foreground,
          background: accessibleColors.children.warning.background
        };
      case 'danger':
        return {
          foreground: accessibleColors.children.danger.foreground,
          background: accessibleColors.children.danger.background
        };
      default:
        return {
          foreground: accessibleColors.highContrast.darkOnLight.foreground,
          background: accessibleColors.highContrast.darkOnLight.background
        };
    }
  };

  const contextValue: AccessibilityContextType = {
    settings,
    updateSettings,
    getContrastColors,
    respectsReducedMotion
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      <div 
        className={`
          ${getFontSizeClass(settings.fontSize)}
          ${settings.highContrast ? 'high-contrast-mode' : ''}
          ${settings.colorBlindMode !== 'none' ? `colorblind-${settings.colorBlindMode}` : ''}
        `}
        style={{
          '--motion-duration': respectsReducedMotion ? '0ms' : '300ms',
          '--motion-scale': respectsReducedMotion ? '1' : '1.05'
        } as React.CSSProperties}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

function getFontSizeClass(fontSize: AccessibilitySettings['fontSize']): string {
  switch (fontSize) {
    case 'large': return 'text-lg';
    case 'extra-large': return 'text-xl';
    default: return 'text-base';
  }
}

function applyGlobalStyles(settings: AccessibilitySettings) {
  const root = document.documentElement;
  
  // Apply font size scaling
  const fontScales = {
    normal: '1',
    large: '1.125',
    'extra-large': '1.25'
  };
  root.style.setProperty('--font-scale', fontScales[settings.fontSize]);
  
  // Apply high contrast styles
  if (settings.highContrast) {
    root.style.setProperty('--text-primary', accessibleColors.highContrast.darkOnLight.foreground);
    root.style.setProperty('--bg-primary', accessibleColors.highContrast.darkOnLight.background);
    root.style.setProperty('--border-primary', '#000000');
  } else {
    root.style.setProperty('--text-primary', '#374151');
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--border-primary', '#d1d5db');
  }
  
  // Apply motion settings
  root.style.setProperty('--motion-duration', settings.reducedMotion ? '0ms' : '300ms');
}