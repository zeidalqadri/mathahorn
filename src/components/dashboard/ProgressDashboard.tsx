'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Award, 
  Brain, 
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PlayerProgress, MathTopic } from '@/lib/schemas';
import { designTokens } from '@/lib/design-tokens';

interface ProgressDashboardProps {
  playerProgress: PlayerProgress;
  recentSessions?: Array<{
    date: string;
    accuracy: number;
    challengesCompleted: number;
    timeSpent: number;
  }>;
}

interface TopicMasteryCardProps {
  topic: MathTopic;
  mastery: {
    totalChallenges: number;
    correctChallenges: number;
    averageTime: number;
    lastPracticed?: Date;
  };
}

const topicDisplayNames = {
  addition: 'Addition',
  subtraction: 'Subtraction',
  multiplication: 'Multiplication',
  division: 'Division',
  fractions: 'Fractions',
  geometry: 'Geometry',
  word_problems: 'Word Problems',
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

const TopicMasteryCard: React.FC<TopicMasteryCardProps> = ({ topic, mastery }) => {
  const accuracy = mastery.totalChallenges > 0 ? (mastery.correctChallenges / mastery.totalChallenges) * 100 : 0;
  const masteryLevel = accuracy >= 90 ? 'Expert' : accuracy >= 70 ? 'Proficient' : accuracy >= 50 ? 'Learning' : 'Beginner';
  
  const masteryColors = {
    Expert: designTokens.colors.success[500],
    Proficient: designTokens.colors.primary[500],
    Learning: designTokens.colors.warning[500],
    Beginner: designTokens.colors.neutral[400],
  };

  return (
    <Card variant="default" padding="md" hoverable>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{topicIcons[topic]}</span>
          <h4 className="font-semibold" style={{ color: designTokens.colors.neutral[800] }}>
            {topicDisplayNames[topic]}
          </h4>
        </div>
        <Badge 
          variant={masteryLevel === 'Expert' ? 'success' : masteryLevel === 'Proficient' ? 'primary' : masteryLevel === 'Learning' ? 'warning' : 'secondary'} 
          size="sm"
        >
          {masteryLevel}
        </Badge>
      </div>
      
      <Progress
        value={accuracy}
        variant={masteryLevel === 'Expert' ? 'success' : masteryLevel === 'Proficient' ? 'primary' : 'warning'}
        size="sm"
        showLabel
        label={`${Math.round(accuracy)}% accuracy`}
        className="mb-3"
      />
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Problems:</span>
          <div className="font-semibold">{mastery.totalChallenges}</div>
        </div>
        <div>
          <span className="text-gray-500">Avg. Time:</span>
          <div className="font-semibold">{mastery.averageTime}s</div>
        </div>
      </div>
      
      {mastery.lastPracticed && (
        <div className="mt-2 text-xs text-gray-500">
          Last practiced: {mastery.lastPracticed.toLocaleDateString()}
        </div>
      )}
    </Card>
  );
};

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  playerProgress,
  recentSessions = [],
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  // Calculate overall statistics
  const totalTopics = Object.keys(playerProgress.topicMastery).length;
  const masteredTopics = Object.values(playerProgress.topicMastery).filter(
    mastery => mastery.totalChallenges > 0 && (mastery.correctChallenges / mastery.totalChallenges) >= 0.9
  ).length;

  const averageAccuracy = Object.values(playerProgress.topicMastery).reduce((acc, mastery) => {
    if (mastery.totalChallenges === 0) return acc;
    return acc + (mastery.correctChallenges / mastery.totalChallenges);
  }, 0) / Math.max(totalTopics, 1);

  const totalChallenges = Object.values(playerProgress.topicMastery).reduce(
    (acc, mastery) => acc + mastery.totalChallenges, 0
  );

  // Mock recent activity data
  const mockRecentActivity = [
    { day: 'Mon', challenges: 5, accuracy: 85 },
    { day: 'Tue', challenges: 8, accuracy: 92 },
    { day: 'Wed', challenges: 6, accuracy: 78 },
    { day: 'Thu', challenges: 10, accuracy: 95 },
    { day: 'Fri', challenges: 7, accuracy: 88 },
    { day: 'Sat', challenges: 12, accuracy: 90 },
    { day: 'Sun', challenges: 9, accuracy: 93 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: designTokens.colors.neutral[800] }}>
              Progress Dashboard
            </h1>
            <p className="text-lg" style={{ color: designTokens.colors.neutral[600] }}>
              Track your math learning journey and achievements
            </p>
          </div>
          
          <div className="flex gap-2">
            {(['week', 'month', 'all'] as const).map(range => (
              <Button
                key={range}
                variant={timeRange === range ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="gradient" padding="lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: designTokens.colors.neutral[800] }}>
                  {Math.round(averageAccuracy * 100)}%
                </div>
                <div className="text-sm" style={{ color: designTokens.colors.neutral[600] }}>
                  Overall Accuracy
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="gradient" padding="lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="text-green-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: designTokens.colors.neutral[800] }}>
                  {totalChallenges}
                </div>
                <div className="text-sm" style={{ color: designTokens.colors.neutral[600] }}>
                  Challenges Completed
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="gradient" padding="lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Brain className="text-yellow-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: designTokens.colors.neutral[800] }}>
                  {masteredTopics}/{totalTopics}
                </div>
                <div className="text-sm" style={{ color: designTokens.colors.neutral[600] }}>
                  Topics Mastered
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="gradient" padding="lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: designTokens.colors.neutral[800] }}>
                  {playerProgress.streakDays}
                </div>
                <div className="text-sm" style={{ color: designTokens.colors.neutral[600] }}>
                  Day Streak
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="elevated" padding="lg">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={20} style={{ color: designTokens.colors.primary[600] }} />
              <h3 className="text-lg font-semibold" style={{ color: designTokens.colors.neutral[800] }}>
                Recent Activity
              </h3>
            </div>
            
            <div className="space-y-3">
              {mockRecentActivity.map((day, index) => (
                <div key={day.day} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium" style={{ color: designTokens.colors.neutral[600] }}>
                    {day.day}
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={(day.challenges / 15) * 100} // Normalize to max 15 challenges
                      size="sm"
                      variant="primary"
                      animated
                    />
                  </div>
                  <div className="w-16 text-sm text-right">
                    <span className="font-medium">{day.challenges}</span>
                    <span className="text-gray-500 ml-1">({day.accuracy}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card variant="elevated" padding="lg">
            <div className="flex items-center gap-2 mb-4">
              <Award size={20} style={{ color: designTokens.colors.success[600] }} />
              <h3 className="text-lg font-semibold" style={{ color: designTokens.colors.neutral[800] }}>
                Level Progress
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: designTokens.colors.primary[600] }}>
                  Level {playerProgress.completedLevels.length + 1}
                </div>
                <p className="text-sm" style={{ color: designTokens.colors.neutral[600] }}>
                  {playerProgress.completedLevels.length} levels completed
                </p>
              </div>
              
              <Progress
                value={(playerProgress.totalPointsEarned % 1000) / 10} // Mock progress to next level
                size="lg"
                variant="primary"
                showLabel
                label={`${playerProgress.totalPointsEarned % 1000}/1000 XP to next level`}
              />
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold" style={{ color: designTokens.colors.neutral[800] }}>
                    {playerProgress.totalPointsEarned.toLocaleString()}
                  </div>
                  <div className="text-sm" style={{ color: designTokens.colors.neutral[600] }}>
                    Total XP
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold" style={{ color: designTokens.colors.neutral[800] }}>
                    {playerProgress.unlockedLevels.length}
                  </div>
                  <div className="text-sm" style={{ color: designTokens.colors.neutral[600] }}>
                    Unlocked Levels
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Topic Mastery Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <PieChart size={20} style={{ color: designTokens.colors.warning[600] }} />
          <h3 className="text-lg font-semibold" style={{ color: designTokens.colors.neutral[800] }}>
            Topic Mastery
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(playerProgress.topicMastery).map(([topic, mastery]) => (
            <motion.div
              key={topic}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + Math.random() * 0.2 }}
            >
              <TopicMasteryCard 
                topic={topic as MathTopic} 
                mastery={mastery} 
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-8"
      >
        <Card variant="gradient" padding="lg">
          <h3 className="text-lg font-semibold mb-4" style={{ color: designTokens.colors.neutral[800] }}>
            🎯 Recommended Next Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🔥</div>
              <h4 className="font-medium mb-1">Keep Your Streak!</h4>
              <p className="text-sm" style={{ color: designTokens.colors.neutral[600] }}>
                You're on a {playerProgress.streakDays} day streak. Practice today to keep it going!
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📈</div>
              <h4 className="font-medium mb-1">Improve Weak Areas</h4>
              <p className="text-sm" style={{ color: designTokens.colors.neutral[600] }}>
                Focus on topics where your accuracy is below 80%.
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🏆</div>
              <h4 className="font-medium mb-1">Unlock New Levels</h4>
              <p className="text-sm" style={{ color: designTokens.colors.neutral[600] }}>
                Complete current challenges to unlock advanced content.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};