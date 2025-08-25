import { z } from 'zod';

// Core Game Schemas
export const DifficultyLevel = z.enum(['beginner', 'intermediate', 'advanced']);
export const AgeGroup = z.enum(['6-8', '9-10', '11-12']);
export const ChallengeType = z.enum(['timed_drill', 'puzzle', 'word_problem', 'visual_matching']);
export const MathTopic = z.enum(['addition', 'subtraction', 'multiplication', 'division', 'fractions', 'geometry', 'word_problems']);

// Player Schema
export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50),
  ageGroup: AgeGroup,
  avatar: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  preferences: z.object({
    soundEnabled: z.boolean().default(true),
    animationsEnabled: z.boolean().default(true),
    difficultyPreference: DifficultyLevel.optional(),
  }).default({}),
});

// Challenge Schema
export const ChallengeSchema = z.object({
  id: z.string(),
  type: ChallengeType,
  topic: MathTopic,
  difficulty: DifficultyLevel,
  ageGroup: AgeGroup,
  question: z.string(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.number()]),
  explanation: z.string().optional(),
  timeLimit: z.number().optional(), // in seconds
  points: z.number().min(1).max(100),
  hints: z.array(z.string()).default([]),
});

// Progress Entry Schema
export const ProgressEntrySchema = z.object({
  challengeId: z.string(),
  playerId: z.string(),
  isCorrect: z.boolean(),
  timeSpent: z.number(), // in seconds
  hintsUsed: z.number().default(0),
  attempts: z.number().min(1),
  completedAt: z.date(),
  pointsEarned: z.number().min(0),
});

// Level Schema
export const LevelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  topic: MathTopic,
  difficulty: DifficultyLevel,
  ageGroup: AgeGroup,
  challenges: z.array(z.string()), // Challenge IDs
  prerequisites: z.array(z.string()).default([]), // Level IDs
  unlocked: z.boolean().default(false),
  completed: z.boolean().default(false),
  completionRequirement: z.object({
    minAccuracy: z.number().min(0).max(1), // 0.8 = 80%
    minChallengesCompleted: z.number().min(1),
  }),
});

// Badge Schema
export const BadgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  category: z.enum(['mastery', 'speed', 'streak', 'special']),
  requirement: z.object({
    type: z.enum(['challenges_completed', 'accuracy_rate', 'streak_days', 'speed_bonus']),
    threshold: z.number(),
    topic: MathTopic.optional(),
  }),
  earned: z.boolean().default(false),
  earnedAt: z.date().optional(),
});

// Player Progress Schema
export const PlayerProgressSchema = z.object({
  playerId: z.string(),
  currentLevel: z.string(),
  totalPointsEarned: z.number().default(0),
  streakDays: z.number().default(0),
  lastPlayedAt: z.date().optional(),
  completedLevels: z.array(z.string()).default([]),
  unlockedLevels: z.array(z.string()).default([]),
  badges: z.array(BadgeSchema).default([]),
  topicMastery: z.record(MathTopic, z.object({
    totalChallenges: z.number().default(0),
    correctChallenges: z.number().default(0),
    averageTime: z.number().default(0),
    lastPracticed: z.date().optional(),
  })).default({}),
  adaptiveSettings: z.object({
    currentDifficulty: DifficultyLevel.default('beginner'),
    consecutiveCorrect: z.number().default(0),
    consecutiveIncorrect: z.number().default(0),
    needsSupport: z.boolean().default(false),
  }).default({}),
});

// Session Schema
export const SessionSchema = z.object({
  id: z.string(),
  playerId: z.string(),
  startTime: z.date(),
  endTime: z.date().optional(),
  challengesCompleted: z.array(ProgressEntrySchema).default([]),
  totalPoints: z.number().default(0),
  accuracy: z.number().min(0).max(1).default(0),
});

// Game State Schema
export const GameStateSchema = z.object({
  currentChallenge: ChallengeSchema.optional(),
  currentLevel: LevelSchema.optional(),
  timeRemaining: z.number().optional(),
  score: z.number().default(0),
  streak: z.number().default(0),
  hintsAvailable: z.number().default(3),
  isPaused: z.boolean().default(false),
  showHint: z.boolean().default(false),
});

// Type exports
export type DifficultyLevel = z.infer<typeof DifficultyLevel>;
export type AgeGroup = z.infer<typeof AgeGroup>;
export type ChallengeType = z.infer<typeof ChallengeType>;
export type MathTopic = z.infer<typeof MathTopic>;
export type Player = z.infer<typeof PlayerSchema>;
export type Challenge = z.infer<typeof ChallengeSchema>;
export type ProgressEntry = z.infer<typeof ProgressEntrySchema>;
export type Level = z.infer<typeof LevelSchema>;
export type Badge = z.infer<typeof BadgeSchema>;
export type PlayerProgress = z.infer<typeof PlayerProgressSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type GameState = z.infer<typeof GameStateSchema>;