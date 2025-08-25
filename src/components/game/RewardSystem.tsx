'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Calendar, Gift, Crown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Badge as GameBadge, PlayerProgress } from '@/lib/schemas';
import { designTokens } from '@/lib/design-tokens';

interface RewardSystemProps {
  playerProgress: PlayerProgress;
  earnedBadges: GameBadge[];
  availableBadges: GameBadge[];
  onClaimReward?: (badgeId: string) => void;
}

interface BadgeCardProps {
  badge: GameBadge;
  progress?: number;
  isEarned: boolean;
  onClaim?: () => void;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, progress = 0, isEarned, onClaim }) => {
  const categoryColors = {
    mastery: designTokens.colors.primary[500],
    speed: designTokens.colors.warning[500],
    streak: designTokens.colors.danger[500],
    special: designTokens.colors.success[500],
  };

  const categoryIcons = {
    mastery: Trophy,
    speed: Zap,
    streak: Calendar,
    special: Star,
  };

  const IconComponent = categoryIcons[badge.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={isEarned ? { scale: 1.05 } : {}}
      className="relative"
    >
      <Card
        variant={isEarned ? 'elevated' : 'default'}
        padding="lg"
        className={`
          transition-all duration-300
          ${isEarned ? 'bg-gradient-to-br from-yellow-50 to-yellow-100' : 'opacity-75'}
          ${!isEarned ? 'grayscale' : ''}
        `}
      >
        {/* Badge icon and earned indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <span className="text-4xl">{badge.icon}</span>
            {isEarned && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
              >
                <Trophy size={12} className="text-white" />
              </motion.div>
            )}
          </div>

          <Badge
            variant={isEarned ? 'success' : 'secondary'}
            size="sm"
            icon={<IconComponent size={14} />}
          >
            {badge.category}
          </Badge>
        </div>

        {/* Badge info */}
        <h3 className="font-bold text-lg mb-2" style={{ color: designTokens.colors.neutral[800] }}>
          {badge.name}
        </h3>
        <p className="text-sm mb-4" style={{ color: designTokens.colors.neutral[600] }}>
          {badge.description}
        </p>

        {/* Progress bar for unearned badges */}
        {!isEarned && progress > 0 && (
          <div className="mb-4">
            <Progress
              value={(progress / badge.requirement.threshold) * 100}
              size="sm"
              variant="primary"
              showLabel
              label={`${Math.min(progress, badge.requirement.threshold)}/${badge.requirement.threshold}`}
            />
          </div>
        )}

        {/* Earned date or claim button */}
        {isEarned ? (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {badge.earnedAt ? `Earned ${badge.earnedAt.toLocaleDateString()}` : 'Just earned!'}
            </span>
            {onClaim && !badge.earnedAt && (
              <Button size="sm" variant="success" onClick={onClaim}>
                Claim
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <span className="text-xs text-gray-400">
              Keep going to earn this badge!
            </span>
          </div>
        )}

        {/* Shimmer effect for newly earned badges */}
        {isEarned && !badge.earnedAt && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(255,215,0,0.3), transparent)',
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        )}
      </Card>
    </motion.div>
  );
};

export const RewardSystem: React.FC<RewardSystemProps> = ({
  playerProgress,
  earnedBadges,
  availableBadges,
  onClaimReward,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showEarnedOnly, setShowEarnedOnly] = useState(false);

  const categories = ['all', 'mastery', 'speed', 'streak', 'special'];
  
  const filteredBadges = availableBadges.filter(badge => {
    if (selectedCategory !== 'all' && badge.category !== selectedCategory) return false;
    if (showEarnedOnly && !badge.earned) return false;
    return true;
  });

  const getProgressForBadge = (badge: GameBadge): number => {
    // Mock progress calculation - in real app would calculate based on player stats
    switch (badge.requirement.type) {
      case 'challenges_completed':
        return Math.min(20, badge.requirement.threshold); // Mock current challenges completed
      case 'accuracy_rate':
        return Math.min(8, badge.requirement.threshold); // Mock current streak
      case 'streak_days':
        return Math.min(playerProgress.streakDays, badge.requirement.threshold);
      case 'speed_bonus':
        return Math.min(3, badge.requirement.threshold); // Mock speed bonuses
      default:
        return 0;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <Trophy className="text-yellow-500" size={32} />
          <h2 className="text-3xl font-bold" style={{ color: designTokens.colors.neutral[800] }}>
            Achievements
          </h2>
        </motion.div>
        
        <p className="text-lg mb-6" style={{ color: designTokens.colors.neutral[600] }}>
          Collect badges and rewards as you master math skills!
        </p>

        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card variant="gradient" padding="md">
            <div className="text-center">
              <Crown className="text-yellow-500 mx-auto mb-2" size={24} />
              <div className="text-2xl font-bold" style={{ color: designTokens.colors.neutral[800] }}>
                {earnedBadges.length}
              </div>
              <div className="text-sm" style={{ color: designTokens.colors.neutral[600] }}>
                Badges Earned
              </div>
            </div>
          </Card>

          <Card variant="gradient" padding="md">
            <div className="text-center">
              <Star className="text-blue-500 mx-auto mb-2" size={24} />
              <div className="text-2xl font-bold" style={{ color: designTokens.colors.neutral[800] }}>
                {playerProgress.totalPointsEarned.toLocaleString()}
              </div>
              <div className="text-sm" style={{ color: designTokens.colors.neutral[600] }}>
                Total Points
              </div>
            </div>
          </Card>

          <Card variant="gradient" padding="md">
            <div className="text-center">
              <Calendar className="text-green-500 mx-auto mb-2" size={24} />
              <div className="text-2xl font-bold" style={{ color: designTokens.colors.neutral[800] }}>
                {playerProgress.streakDays}
              </div>
              <div className="text-sm" style={{ color: designTokens.colors.neutral[600] }}>
                Day Streak
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        <Button
          variant={showEarnedOnly ? 'success' : 'secondary'}
          size="sm"
          onClick={() => setShowEarnedOnly(!showEarnedOnly)}
          leftIcon={<Trophy size={16} />}
        >
          Earned Only
        </Button>
      </div>

      {/* Badge grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredBadges.map(badge => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              progress={getProgressForBadge(badge)}
              isEarned={badge.earned}
              onClaim={onClaimReward ? () => onClaimReward(badge.id) : undefined}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredBadges.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Gift size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-600">
            No badges found
          </h3>
          <p className="text-gray-500">
            {showEarnedOnly 
              ? "You haven't earned any badges in this category yet. Keep playing to unlock them!"
              : "Try adjusting your filters to see more badges."
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};