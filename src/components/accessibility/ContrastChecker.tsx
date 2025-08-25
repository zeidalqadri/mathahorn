'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Check, X, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { calculateContrastRatio, meetsContrastStandard, validateColorCombinations } from '@/lib/accessibility';

// Test our current color combinations
const testCombinations = [
  { foreground: '#1a1a1a', background: '#ffffff', context: 'Main text on white' },
  { foreground: '#ffffff', background: '#0ea5e9', context: 'White text on primary blue' },
  { foreground: '#ffffff', background: '#22c55e', context: 'White text on success green' },
  { foreground: '#ffffff', background: '#f59e0b', context: 'White text on warning orange' },
  { foreground: '#ffffff', background: '#ef4444', context: 'White text on danger red' },
  { foreground: '#374151', background: '#f9fafb', context: 'Dark gray on light gray' },
  { foreground: '#0ea5e9', background: '#ffffff', context: 'Primary blue on white' },
  { foreground: '#059669', background: '#f0fdf4', context: 'Success text on success bg' },
];

export const ContrastChecker: React.FC = () => {
  const [customForeground, setCustomForeground] = useState('#000000');
  const [customBackground, setCustomBackground] = useState('#ffffff');
  const [showDetails, setShowDetails] = useState(false);

  const validatedCombinations = validateColorCombinations(testCombinations);
  const customRatio = calculateContrastRatio(customForeground, customBackground);
  const customPassesAA = meetsContrastStandard(customForeground, customBackground, 'AA');
  const customPassesAAA = meetsContrastStandard(customForeground, customBackground, 'AAA');

  const getStatusIcon = (passesAA: boolean, passesAAA: boolean) => {
    if (passesAAA) return <Check className="text-green-600" size={20} />;
    if (passesAA) return <AlertTriangle className="text-yellow-600" size={20} />;
    return <X className="text-red-600" size={20} />;
  };

  const getStatusText = (passesAA: boolean, passesAAA: boolean) => {
    if (passesAAA) return 'AAA (Excellent)';
    if (passesAA) return 'AA (Good)';
    return 'Fails (Poor)';
  };

  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold">Contrast Checker</h2>
        </div>

        {/* Custom Color Test */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Test Custom Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customForeground}
                  onChange={(e) => setCustomForeground(e.target.value)}
                  className="w-12 h-10 rounded border"
                />
                <input
                  type="text"
                  value={customForeground}
                  onChange={(e) => setCustomForeground(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#000000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customBackground}
                  onChange={(e) => setCustomBackground(e.target.value)}
                  className="w-12 h-10 rounded border"
                />
                <input
                  type="text"
                  value={customBackground}
                  onChange={(e) => setCustomBackground(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>

          {/* Custom Color Preview */}
          <div className="mb-4">
            <div
              className="p-6 rounded-lg border-2"
              style={{
                backgroundColor: customBackground,
                color: customForeground,
                borderColor: customForeground + '40'
              }}
            >
              <h4 className="text-xl font-bold mb-2">Sample Text</h4>
              <p className="mb-2">This is how your text will look with these colors.</p>
              <p className="text-lg">Large text example for accessibility testing.</p>
            </div>
          </div>

          {/* Custom Results */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(customPassesAA, customPassesAAA)}
              <span className="font-semibold">
                Contrast Ratio: {customRatio.toFixed(2)}:1
              </span>
              <span className={`px-2 py-1 rounded text-sm ${
                customPassesAAA ? 'bg-green-100 text-green-800' :
                customPassesAA ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {getStatusText(customPassesAA, customPassesAAA)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Normal Text (16px):</strong>
                <div>AA: {customPassesAA ? '✅ Pass' : '❌ Fail'} (4.5:1 required)</div>
                <div>AAA: {customPassesAAA ? '✅ Pass' : '❌ Fail'} (7:1 required)</div>
              </div>
              <div>
                <strong>Large Text (18px+):</strong>
                <div>AA: {customRatio >= 3 ? '✅ Pass' : '❌ Fail'} (3:1 required)</div>
                <div>AAA: {customRatio >= 4.5 ? '✅ Pass' : '❌ Fail'} (4.5:1 required)</div>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={() => setShowDetails(!showDetails)}
          className="mb-4"
        >
          {showDetails ? 'Hide' : 'Show'} Current App Colors
        </Button>

        {/* Current App Colors Analysis */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="text-lg font-semibold mb-3">Math Learning Adventure Colors</h3>
            <div className="space-y-3">
              {validatedCombinations.map((combo, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded border flex-shrink-0"
                      style={{ backgroundColor: combo.background }}
                    >
                      <div
                        className="w-full h-full rounded flex items-center justify-center text-xs font-bold"
                        style={{ color: combo.foreground }}
                      >
                        Aa
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{combo.context}</div>
                      <div className="text-xs text-gray-500">
                        {combo.foreground} on {combo.background}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(combo.passesAA, combo.passesAAA)}
                    <span className="text-sm font-medium">
                      {combo.ratio.toFixed(2)}:1
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      combo.passesAAA ? 'bg-green-100 text-green-800' :
                      combo.passesAA ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {getStatusText(combo.passesAA, combo.passesAAA)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Summary</h4>
              <div className="text-sm text-blue-700">
                <div>✅ AAA Compliant: {validatedCombinations.filter(c => c.passesAAA).length}/{validatedCombinations.length}</div>
                <div>✅ AA Compliant: {validatedCombinations.filter(c => c.passesAA).length}/{validatedCombinations.length}</div>
                <div>❌ Non-Compliant: {validatedCombinations.filter(c => !c.passesAA).length}/{validatedCombinations.length}</div>
              </div>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Guidelines */}
      <Card variant="default" padding="lg">
        <h3 className="text-lg font-semibold mb-3">WCAG 2.1 Guidelines</h3>
        <div className="space-y-2 text-sm">
          <div><strong>AA Standard (Minimum):</strong></div>
          <div>• Normal text: 4.5:1 contrast ratio</div>
          <div>• Large text (18pt+): 3:1 contrast ratio</div>
          <div className="mt-3"><strong>AAA Standard (Enhanced):</strong></div>
          <div>• Normal text: 7:1 contrast ratio</div>
          <div>• Large text (18pt+): 4.5:1 contrast ratio</div>
          <div className="mt-3 p-3 bg-yellow-50 rounded">
            <strong>Note:</strong> For children's educational apps, AAA compliance is recommended for better accessibility and reduced eye strain.
          </div>
        </div>
      </Card>
    </div>
  );
};