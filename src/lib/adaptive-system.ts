import { DifficultyLevel, PlayerProgress, ProgressEntry, Challenge, MathTopic } from './schemas';

// Adaptive Difficulty Configuration
const ADAPTIVE_CONFIG = {
  CONSECUTIVE_CORRECT_THRESHOLD: 3,
  CONSECUTIVE_INCORRECT_THRESHOLD: 3,
  MIN_ACCURACY_FOR_ADVANCEMENT: 0.8,
  TIME_BONUS_THRESHOLD: 0.7, // 70% of time limit
  SUPPORT_TRIGGER_ACCURACY: 0.5,
} as const;

export class AdaptiveDifficultySystem {
  /**
   * Analyzes player performance and suggests difficulty adjustment
   */
  static analyzeDifficultyAdjustment(
    progress: PlayerProgress,
    recentEntries: ProgressEntry[]
  ): {
    suggestedDifficulty: DifficultyLevel;
    reasoning: string;
    needsSupport: boolean;
  } {
    const { adaptiveSettings } = progress;
    const currentDifficulty = adaptiveSettings.currentDifficulty;
    
    // Calculate recent performance metrics
    const recentAccuracy = this.calculateAccuracy(recentEntries);
    const consecutiveCorrect = this.getConsecutiveCorrect(recentEntries);
    const consecutiveIncorrect = this.getConsecutiveIncorrect(recentEntries);
    const averageSpeed = this.calculateAverageSpeed(recentEntries);

    // Determine if player needs support
    const needsSupport = recentAccuracy < ADAPTIVE_CONFIG.SUPPORT_TRIGGER_ACCURACY;

    // Difficulty adjustment logic
    let suggestedDifficulty = currentDifficulty;
    let reasoning = 'Maintaining current difficulty';

    // Check for advancement
    if (
      consecutiveCorrect >= ADAPTIVE_CONFIG.CONSECUTIVE_CORRECT_THRESHOLD &&
      recentAccuracy >= ADAPTIVE_CONFIG.MIN_ACCURACY_FOR_ADVANCEMENT &&
      !needsSupport
    ) {
      if (currentDifficulty === 'beginner') {
        suggestedDifficulty = 'intermediate';
        reasoning = 'Strong performance - advancing to intermediate';
      } else if (currentDifficulty === 'intermediate') {
        suggestedDifficulty = 'advanced';
        reasoning = 'Excellent mastery - advancing to advanced';
      }
    }

    // Check for regression
    if (
      consecutiveIncorrect >= ADAPTIVE_CONFIG.CONSECUTIVE_INCORRECT_THRESHOLD ||
      needsSupport
    ) {
      if (currentDifficulty === 'advanced') {
        suggestedDifficulty = 'intermediate';
        reasoning = 'Providing more support - moving to intermediate';
      } else if (currentDifficulty === 'intermediate') {
        suggestedDifficulty = 'beginner';
        reasoning = 'Need additional practice - returning to beginner';
      }
    }

    return {
      suggestedDifficulty,
      reasoning,
      needsSupport,
    };
  }

  /**
   * Generates personalized challenge recommendations
   */
  static getPersonalizedRecommendations(
    progress: PlayerProgress,
    recentEntries: ProgressEntry[]
  ): {
    recommendedTopics: MathTopic[];
    focusAreas: string[];
    encouragementMessage: string;
  } {
    const topicPerformance = this.analyzeTopicPerformance(progress, recentEntries);
    
    // Find topics that need improvement
    const weakTopics = Object.entries(topicPerformance)
      .filter(([_, performance]) => performance.accuracy < 0.7)
      .map(([topic]) => topic as MathTopic)
      .slice(0, 3);

    // Find strong topics for confidence building
    const strongTopics = Object.entries(topicPerformance)
      .filter(([_, performance]) => performance.accuracy > 0.85)
      .map(([topic]) => topic as MathTopic);

    // Generate recommendations
    const recommendedTopics = weakTopics.length > 0 
      ? [...weakTopics, ...strongTopics.slice(0, 2)]
      : Object.keys(topicPerformance).slice(0, 3) as MathTopic[];

    const focusAreas = weakTopics.map(topic => 
      this.getTopicFocusMessage(topic, topicPerformance[topic])
    );

    const encouragementMessage = this.generateEncouragementMessage(progress, recentEntries);

    return {
      recommendedTopics,
      focusAreas,
      encouragementMessage,
    };
  }

  /**
   * Calculates mastery level for a specific topic
   */
  static calculateTopicMastery(
    topic: MathTopic,
    entries: ProgressEntry[]
  ): {
    masteryLevel: number; // 0-1 scale
    confidence: 'low' | 'medium' | 'high';
    recommendation: string;
  } {
    const topicEntries = entries.filter(entry => 
      // We would need to look up challenge topic from entry.challengeId
      // For now, assume we have this information
      true
    );

    if (topicEntries.length === 0) {
      return {
        masteryLevel: 0,
        confidence: 'low',
        recommendation: `Start practicing ${topic} to build foundational skills`,
      };
    }

    const accuracy = this.calculateAccuracy(topicEntries);
    const consistency = this.calculateConsistency(topicEntries);
    const speed = this.calculateSpeedScore(topicEntries);

    const masteryLevel = (accuracy * 0.5) + (consistency * 0.3) + (speed * 0.2);
    
    let confidence: 'low' | 'medium' | 'high' = 'low';
    if (masteryLevel > 0.8) confidence = 'high';
    else if (masteryLevel > 0.6) confidence = 'medium';

    const recommendation = this.generateMasteryRecommendation(topic, masteryLevel, confidence);

    return {
      masteryLevel,
      confidence,
      recommendation,
    };
  }

  // Helper methods
  private static calculateAccuracy(entries: ProgressEntry[]): number {
    if (entries.length === 0) return 0;
    const correct = entries.filter(entry => entry.isCorrect).length;
    return correct / entries.length;
  }

  private static getConsecutiveCorrect(entries: ProgressEntry[]): number {
    let consecutive = 0;
    for (let i = entries.length - 1; i >= 0; i--) {
      if (entries[i].isCorrect) {
        consecutive++;
      } else {
        break;
      }
    }
    return consecutive;
  }

  private static getConsecutiveIncorrect(entries: ProgressEntry[]): number {
    let consecutive = 0;
    for (let i = entries.length - 1; i >= 0; i--) {
      if (!entries[i].isCorrect) {
        consecutive++;
      } else {
        break;
      }
    }
    return consecutive;
  }

  private static calculateAverageSpeed(entries: ProgressEntry[]): number {
    if (entries.length === 0) return 0;
    const totalTime = entries.reduce((sum, entry) => sum + entry.timeSpent, 0);
    return totalTime / entries.length;
  }

  private static analyzeTopicPerformance(
    progress: PlayerProgress,
    entries: ProgressEntry[]
  ): Record<string, { accuracy: number; averageTime: number; count: number }> {
    // This would analyze performance by topic
    // For now, return mock data
    return Object.keys(progress.topicMastery).reduce((acc, topic) => {
      const mastery = progress.topicMastery[topic as MathTopic];
      acc[topic] = {
        accuracy: mastery?.correctChallenges ? mastery.correctChallenges / Math.max(mastery.totalChallenges || 1, 1) : 0,
        averageTime: mastery?.averageTime || 0,
        count: mastery?.totalChallenges || 0,
      };
      return acc;
    }, {} as Record<string, { accuracy: number; averageTime: number; count: number }>);
  }

  private static calculateConsistency(entries: ProgressEntry[]): number {
    if (entries.length < 3) return 0;
    
    const accuracies = entries.map(entry => entry.isCorrect ? 1 : 0);
    const windowSize = Math.min(5, entries.length);
    let consistencyScore = 0;
    
    for (let i = 0; i <= accuracies.length - windowSize; i++) {
      const window = accuracies.slice(i, i + windowSize);
      const windowAccuracy = window.reduce((sum, val) => sum + val, 0) / windowSize;
      consistencyScore += windowAccuracy;
    }
    
    return consistencyScore / (accuracies.length - windowSize + 1);
  }

  private static calculateSpeedScore(entries: ProgressEntry[]): number {
    // Calculate speed score based on time spent relative to average
    const avgTime = this.calculateAverageSpeed(entries);
    const fastEntries = entries.filter(entry => entry.timeSpent < avgTime * 0.8);
    return fastEntries.length / entries.length;
  }

  private static getTopicFocusMessage(
    topic: MathTopic,
    performance: { accuracy: number; averageTime: number; count: number }
  ): string {
    if (performance.accuracy < 0.5) {
      return `${topic}: Focus on understanding core concepts with step-by-step practice`;
    } else if (performance.accuracy < 0.7) {
      return `${topic}: Practice more problems to build confidence and accuracy`;
    } else if (performance.averageTime > 60) {
      return `${topic}: Work on solving problems more quickly while maintaining accuracy`;
    }
    return `${topic}: Continue regular practice to maintain strong performance`;
  }

  private static generateEncouragementMessage(
    progress: PlayerProgress,
    recentEntries: ProgressEntry[]
  ): string {
    const recentAccuracy = this.calculateAccuracy(recentEntries);
    const streakDays = progress.streakDays;
    const totalPoints = progress.totalPointsEarned;

    if (recentAccuracy > 0.8) {
      return "🌟 Amazing work! You're mastering these concepts beautifully!";
    } else if (recentAccuracy > 0.6) {
      return "👍 Good progress! Keep practicing and you'll see improvement!";
    } else if (streakDays > 3) {
      return "🔥 Great consistency! Your daily practice is paying off!";
    } else if (totalPoints > 1000) {
      return "🏆 Look how many points you've earned! You're becoming a math champion!";
    } else {
      return "💪 Every expert was once a beginner. Keep going - you've got this!";
    }
  }

  private static generateMasteryRecommendation(
    topic: MathTopic,
    masteryLevel: number,
    confidence: 'low' | 'medium' | 'high'
  ): string {
    if (masteryLevel > 0.8) {
      return `Excellent mastery of ${topic}! Ready for advanced challenges.`;
    } else if (masteryLevel > 0.6) {
      return `Good understanding of ${topic}. Practice more to build confidence.`;
    } else {
      return `${topic} needs more attention. Focus on fundamentals first.`;
    }
  }
}

export default AdaptiveDifficultySystem;