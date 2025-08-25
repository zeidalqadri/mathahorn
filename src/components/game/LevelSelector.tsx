'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Trophy, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Level, AgeGroup } from '@/lib/schemas';
import { designTokens, gameTheme } from '@/lib/design-tokens';
import { calculateLevelProgress } from '@/lib/game-data';

interface LevelSelectorProps {
  levels: Level[];
  ageGroup: AgeGroup;
  completedChallenges: string[];
  onSelectLevel: (level: Level) => void;
  currentLevel?: string;
}

const difficultyConfig = {
  beginner: { color: '#22c55e', icon: '🌱', label: 'Beginner' },
  intermediate: { color: '#f59e0b', icon: '🌟', label: 'Intermediate' },
  advanced: { color: '#ef4444', icon: '🚀', label: 'Advanced' },
};

const topicIcons = {
  addition: '➕',
  subtraction: '➖',
  multiplication: '✖️',
  division: '➗',
  fractions: '🍰',
  geometry: '📐',
  word_problems: '📖',
};

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  levels,
  ageGroup,
  completedChallenges,
  onSelectLevel,
  currentLevel,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold text-center mb-2"
          style={{ color: designTokens.colors.neutral[800] }}
        >
          Choose Your Adventure!
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-center text-lg"
          style={{ color: designTokens.colors.neutral[600] }}
        >
          Select a level to start learning math in a fun way
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {levels.map((level, index) => {
          const progress = calculateLevelProgress(level, completedChallenges);
          const difficultyInfo = difficultyConfig[level.difficulty];
          const topicIcon = topicIcons[level.topic];
          const isLocked = !level.unlocked;
          const isCompleted = level.completed;
          const isCurrent = currentLevel === level.id;

          return (
            <motion.div key={level.id} variants={itemVariants}>
              <Card
                variant={isCurrent ? 'gradient' : isCompleted ? 'elevated' : 'default'}
                padding="lg"
                hoverable={!isLocked}
                onClick={() => !isLocked && onSelectLevel(level)}
                className={`
                  relative transition-all duration-300
                  ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${isCurrent ? 'ring-2 ring-blue-400' : ''}
                `}
              >
                {/* Lock overlay for locked levels */}
                {isLocked && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-center">
                      <Lock size={32} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Complete previous levels to unlock
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Level header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{topicIcon}</span>
                    <Badge
                      variant={level.difficulty === 'beginner' ? 'success' : 
                               level.difficulty === 'intermediate' ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {difficultyInfo.label}
                    </Badge>
                  </div>
                  
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                    >
                      <Trophy className="text-yellow-500" size={24} />
                    </motion.div>
                  )}
                  
                  {isCurrent && (
                    <Badge variant="primary" size="sm">
                      Current
                    </Badge>
                  )}
                </div>

                {/* Level info */}
                <h3 className="text-xl font-bold mb-2" style={{ color: designTokens.colors.neutral[800] }}>
                  {level.name}
                </h3>
                <p className="text-sm mb-4" style={{ color: designTokens.colors.neutral[600] }}>
                  {level.description}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <Progress
                    value={progress.percentage}
                    size="sm"
                    variant={isCompleted ? 'success' : 'primary'}
                    showLabel
                    label={`${progress.completed}/${progress.total} challenges`}
                  />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1" style={{ color: designTokens.colors.neutral[600] }}>
                    <Clock size={14} />
                    <span>{level.challenges.length} challenges</span>
                  </div>
                  
                  <div className="flex items-center gap-1" style={{ color: designTokens.colors.neutral[600] }}>
                    <Star size={14} />
                    <span>{Math.round(level.completionRequirement.minAccuracy * 100)}% to pass</span>
                  </div>
                </div>

                {/* Prerequisites indicator */}
                {level.prerequisites.length > 0 && !level.unlocked && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Requires: {level.prerequisites.length} previous level{level.prerequisites.length > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Age group info */}
      <motion.div
        variants={itemVariants}
        className="mt-8 text-center"
      >
        <p className="text-sm" style={{ color: designTokens.colors.neutral[500] }}>
          Designed for ages {ageGroup.replace('-', ' to ')} • {levels.length} levels available
        </p>
      </motion.div>
    </div>
  );
};