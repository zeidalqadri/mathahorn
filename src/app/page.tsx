'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Settings, BarChart3, Award, User, BookOpen, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LevelSelector } from '@/components/game/LevelSelector';
import { ChallengeInterface } from '@/components/game/ChallengeInterface';
import { ProgressDashboard } from '@/components/dashboard/ProgressDashboard';
import { RewardSystem } from '@/components/game/RewardSystem';
import { AccessibilitySettings } from '@/components/accessibility/AccessibilitySettings';
import { 
  sampleLevels, 
  sampleChallenges, 
  sampleBadges, 
  getLevelById, 
  getChallengeById 
} from '@/lib/game-data';
import { 
  PlayerProgress, 
  Level, 
  Challenge, 
  Badge as GameBadge, 
  AgeGroup,
  ProgressEntry 
} from '@/lib/schemas';
import { designTokens } from '@/lib/design-tokens';

type GameMode = 'welcome' | 'levels' | 'challenge' | 'dashboard' | 'rewards';

// Mock player data - in real app this would come from database/auth
const mockPlayerProgress: PlayerProgress = {
  playerId: 'player-1',
  currentLevel: 'add-basics',
  totalPointsEarned: 1250,
  streakDays: 5,
  lastPlayedAt: new Date(),
  completedLevels: [],
  unlockedLevels: ['add-basics'],
  badges: [],
  topicMastery: {
    addition: {
      totalChallenges: 15,
      correctChallenges: 12,
      averageTime: 25.5,
      lastPracticed: new Date('2024-01-20'),
    },
    subtraction: {
      totalChallenges: 8,
      correctChallenges: 6,
      averageTime: 32.2,
      lastPracticed: new Date('2024-01-18'),
    },
    multiplication: {
      totalChallenges: 5,
      correctChallenges: 3,
      averageTime: 45.1,
      lastPracticed: new Date('2024-01-15'),
    },
    fractions: {
      totalChallenges: 3,
      correctChallenges: 2,
      averageTime: 55.8,
      lastPracticed: new Date('2024-01-12'),
    },
    division: {
      totalChallenges: 0,
      correctChallenges: 0,
      averageTime: 0,
    },
    geometry: {
      totalChallenges: 2,
      correctChallenges: 1,
      averageTime: 48.5,
      lastPracticed: new Date('2024-01-10'),
    },
    word_problems: {
      totalChallenges: 1,
      correctChallenges: 1,
      averageTime: 75.0,
      lastPracticed: new Date('2024-01-08'),
    },
  },
  adaptiveSettings: {
    currentDifficulty: 'beginner',
    consecutiveCorrect: 3,
    consecutiveIncorrect: 0,
    needsSupport: false,
  },
};

export default function MathLearningGame() {
  const [gameMode, setGameMode] = useState<GameMode>('welcome');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('6-8');
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(mockPlayerProgress);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);

  // Get available levels and badges
  const availableLevels = sampleLevels.filter(level => level.ageGroup === selectedAgeGroup);
  const availableBadges = sampleBadges.map(badge => ({ ...badge, earned: Math.random() > 0.7 }));
  const earnedBadges = availableBadges.filter(badge => badge.earned);

  const handleSelectLevel = (level: Level) => {
    setCurrentLevel(level);
    // Start with first challenge in the level
    const firstChallengeId = level.challenges[0];
    const firstChallenge = getChallengeById(firstChallengeId);
    if (firstChallenge) {
      setCurrentChallenge(firstChallenge);
      setGameMode('challenge');
    }
  };

  const handleAnswerChallenge = (
    answer: string, 
    timeSpent: number, 
    hintsUsed: number
  ) => {
    if (!currentChallenge) return;

    const isCorrect = answer === String(currentChallenge.correctAnswer);
    const pointsEarned = isCorrect ? Math.max(currentChallenge.points - (hintsUsed * 5), 5) : 0;

    // Create progress entry
    const progressEntry: ProgressEntry = {
      challengeId: currentChallenge.id,
      playerId: playerProgress.playerId,
      isCorrect,
      timeSpent,
      hintsUsed,
      attempts: 1,
      completedAt: new Date(),
      pointsEarned,
    };

    // Update player progress
    setPlayerProgress(prev => ({
      ...prev,
      totalPointsEarned: prev.totalPointsEarned + pointsEarned,
    }));

    if (isCorrect) {
      setCompletedChallenges(prev => [...prev, currentChallenge.id]);
    }

    // Move to next challenge or back to level selection
    if (currentLevel) {
      const currentChallengeIndex = currentLevel.challenges.indexOf(currentChallenge.id);
      if (currentChallengeIndex < currentLevel.challenges.length - 1) {
        // Next challenge
        const nextChallengeId = currentLevel.challenges[currentChallengeIndex + 1];
        const nextChallenge = getChallengeById(nextChallengeId);
        if (nextChallenge) {
          setCurrentChallenge(nextChallenge);
        }
      } else {
        // Level completed
        setGameMode('levels');
        setCurrentLevel(null);
        setCurrentChallenge(null);
      }
    }
  };

  const navigationItems = [
    { 
      id: 'levels', 
      label: 'Play', 
      icon: Play, 
      description: 'Choose levels and start playing' 
    },
    { 
      id: 'dashboard', 
      label: 'Progress', 
      icon: BarChart3, 
      description: 'View your learning analytics' 
    },
    { 
      id: 'rewards', 
      label: 'Achievements', 
      icon: Award, 
      description: 'See badges and rewards earned' 
    },
  ];

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {/* Welcome Screen */}
        {gameMode === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-8"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Logo/Hero */}
              <div className="text-8xl mb-6">🎯</div>
              <h1 
                className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                style={{ fontFamily: designTokens.typography.fontFamily.sans.join(',') }}
              >
                Math Learning Adventure
              </h1>
              <p 
                className="text-xl mb-8 max-w-2xl mx-auto"
                style={{ color: designTokens.colors.neutral[600] }}
              >
                Transform math learning into an exciting journey! Adaptive challenges, 
                personalized progress tracking, and fun rewards await.
              </p>

              {/* Age Group Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Choose Your Age Group:</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {(['6-8', '9-10', '11-12'] as AgeGroup[]).map(age => (
                    <Button
                      key={age}
                      variant={selectedAgeGroup === age ? 'primary' : 'secondary'}
                      size="lg"
                      onClick={() => setSelectedAgeGroup(age)}
                    >
                      Ages {age.replace('-', ' to ')}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card variant="gradient" padding="lg">
                  <div className="text-center">
                    <div className="text-3xl mb-3">🧠</div>
                    <h3 className="font-bold mb-2">Adaptive Learning</h3>
                    <p className="text-sm" style={{ color: designTokens.colors.neutral[600] }}>
                      Difficulty adjusts to your skill level for optimal challenge
                    </p>
                  </div>
                </Card>
                
                <Card variant="gradient" padding="lg">
                  <div className="text-center">
                    <div className="text-3xl mb-3">📊</div>
                    <h3 className="font-bold mb-2">Progress Tracking</h3>
                    <p className="text-sm" style={{ color: designTokens.colors.neutral[600] }}>
                      Detailed analytics show strengths and areas for improvement
                    </p>
                  </div>
                </Card>
                
                <Card variant="gradient" padding="lg">
                  <div className="text-center">
                    <div className="text-3xl mb-3">🏆</div>
                    <h3 className="font-bold mb-2">Gamified Rewards</h3>
                    <p className="text-sm" style={{ color: designTokens.colors.neutral[600] }}>
                      Earn badges, unlock levels, and celebrate achievements
                    </p>
                  </div>
                </Card>
              </div>

              <Button
                size="lg"
                variant="primary"
                onClick={() => setGameMode('levels')}
                leftIcon={<Play size={24} />}
                className="text-lg px-8 py-4"
              >
                Start Learning Adventure!
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Navigation Header for Game Modes */}
        {gameMode !== 'welcome' && gameMode !== 'challenge' && (
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4"
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-2xl">🎯</div>
                <h1 className="text-xl font-bold" style={{ color: designTokens.colors.primary[600] }}>
                  Math Adventure
                </h1>
              </div>

              <nav className="flex gap-2">
                {navigationItems.map(item => {
                  const IconComponent = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={gameMode === item.id ? 'primary' : 'secondary'}
                      onClick={() => setGameMode(item.id as GameMode)}
                      leftIcon={<IconComponent size={16} />}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </nav>

              <div className="flex items-center gap-4">
                <Badge variant="success" icon={<User size={14} />}>
                  Level {playerProgress.completedLevels.length + 1}
                </Badge>
                <Badge variant="primary" icon={<Award size={14} />}>
                  {playerProgress.totalPointsEarned.toLocaleString()} XP
                </Badge>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAccessibilitySettings(true)}
                  leftIcon={<Eye size={16} />}
                  aria-label="Open accessibility settings"
                >
                  Accessibility
                </Button>
              </div>
            </div>
          </motion.header>
        )}

        {/* Level Selection */}
        {gameMode === 'levels' && (
          <motion.div
            key="levels"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <LevelSelector
              levels={availableLevels}
              ageGroup={selectedAgeGroup}
              completedChallenges={completedChallenges}
              onSelectLevel={handleSelectLevel}
              currentLevel={playerProgress.currentLevel}
            />
          </motion.div>
        )}

        {/* Challenge Interface */}
        {gameMode === 'challenge' && currentChallenge && (
          <motion.div
            key="challenge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="min-h-screen flex items-center justify-center"
          >
            <ChallengeInterface
              challenge={currentChallenge}
              onAnswer={handleAnswerChallenge}
              onSkip={() => {
                setGameMode('levels');
                setCurrentLevel(null);
                setCurrentChallenge(null);
              }}
            />
          </motion.div>
        )}

        {/* Progress Dashboard */}
        {gameMode === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <ProgressDashboard playerProgress={playerProgress} />
          </motion.div>
        )}

        {/* Rewards System */}
        {gameMode === 'rewards' && (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <RewardSystem
              playerProgress={playerProgress}
              earnedBadges={earnedBadges}
              availableBadges={availableBadges}
              onClaimReward={(badgeId) => {
                console.log('Claiming reward:', badgeId);
                // Handle reward claiming
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility Settings Modal */}
      <AccessibilitySettings
        isOpen={showAccessibilitySettings}
        onClose={() => setShowAccessibilitySettings(false)}
      />
    </div>
  );
}