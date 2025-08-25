'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Type, Zap, Palette, Settings } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAccessibility } from './AccessibilityProvider';
import { designTokens } from '@/lib/design-tokens';

interface AccessibilitySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  isOpen,
  onClose
}) => {
  const { settings, updateSettings, getContrastColors } = useAccessibility();

  if (!isOpen) return null;

  const contrastColors = getContrastColors('primary');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card variant="elevated" padding="xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Eye className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold">Accessibility Settings</h2>
            </div>
            <Button variant="secondary" onClick={onClose}>
              ✕
            </Button>
          </div>

          <div className="space-y-6">
            {/* Visual Settings */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Palette size={20} />
                Visual Settings
              </h3>
              
              <div className="space-y-4">
                {/* High Contrast Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">High Contrast Mode</h4>
                    <p className="text-sm text-gray-600">
                      Increases contrast for better readability
                    </p>
                  </div>
                  <button
                    onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                    className={`
                      w-12 h-6 rounded-full transition-colors duration-200
                      ${settings.highContrast ? 'bg-blue-600' : 'bg-gray-300'}
                    `}
                  >
                    <div
                      className={`
                        w-5 h-5 bg-white rounded-full transition-transform duration-200
                        ${settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'}
                      `}
                    />
                  </button>
                </div>

                {/* Font Size */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Type size={16} />
                    Font Size
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {(['normal', 'large', 'extra-large'] as const).map((size) => (
                      <Button
                        key={size}
                        variant={settings.fontSize === size ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => updateSettings({ fontSize: size })}
                      >
                        {size === 'normal' ? 'Normal' : 
                         size === 'large' ? 'Large' : 'Extra Large'}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Color Blind Support */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Color Vision Support</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { key: 'none', label: 'Standard Colors' },
                      { key: 'protanopia', label: 'Red-Blind Friendly' },
                      { key: 'deuteranopia', label: 'Green-Blind Friendly' },
                      { key: 'tritanopia', label: 'Blue-Blind Friendly' }
                    ] as const).map((mode) => (
                      <Button
                        key={mode.key}
                        variant={settings.colorBlindMode === mode.key ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => updateSettings({ colorBlindMode: mode.key })}
                      >
                        {mode.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Motion Settings */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap size={20} />
                Motion & Animation
              </h3>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Reduce Motion</h4>
                  <p className="text-sm text-gray-600">
                    Minimizes animations and transitions
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                  className={`
                    w-12 h-6 rounded-full transition-colors duration-200
                    ${settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-300'}
                  `}
                >
                  <div
                    className={`
                      w-5 h-5 bg-white rounded-full transition-transform duration-200
                      ${settings.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'}
                    `}
                  />
                </button>
              </div>
            </section>

            {/* Contrast Preview */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div 
                className="p-6 rounded-lg border-2"
                style={{
                  backgroundColor: contrastColors.background,
                  color: contrastColors.foreground,
                  borderColor: contrastColors.foreground + '40'
                }}
              >
                <h4 className="text-xl font-bold mb-2">Sample Math Problem</h4>
                <p className="mb-4">What is 5 + 3?</p>
                <div className="flex gap-2">
                  <button 
                    className="px-4 py-2 rounded border"
                    style={{
                      backgroundColor: contrastColors.foreground + '10',
                      borderColor: contrastColors.foreground + '40'
                    }}
                  >
                    7
                  </button>
                  <button 
                    className="px-4 py-2 rounded border"
                    style={{
                      backgroundColor: contrastColors.foreground + '10',
                      borderColor: contrastColors.foreground + '40'
                    }}
                  >
                    8
                  </button>
                  <button 
                    className="px-4 py-2 rounded border"
                    style={{
                      backgroundColor: contrastColors.foreground + '10',
                      borderColor: contrastColors.foreground + '40'
                    }}
                  >
                    9
                  </button>
                </div>
              </div>
            </section>

            {/* Reset Button */}
            <div className="pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => updateSettings({
                  contrastMode: 'standard',
                  fontSize: 'normal',
                  reducedMotion: false,
                  highContrast: false,
                  colorBlindMode: 'none'
                })}
                leftIcon={<Settings size={16} />}
              >
                Reset to Defaults
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};