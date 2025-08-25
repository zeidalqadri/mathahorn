import { Level, Challenge, Badge, MathTopic, DifficultyLevel, AgeGroup, ChallengeType } from './schemas';

// Sample Challenges Data
export const sampleChallenges: Challenge[] = [
  // Addition - Beginner (Ages 6-8)
  {
    id: 'add-1',
    type: 'timed_drill',
    topic: 'addition',
    difficulty: 'beginner',
    ageGroup: '6-8',
    question: 'What is 3 + 5?',
    options: ['6', '7', '8', '9'],
    correctAnswer: '8',
    explanation: 'Count forward from 3: 4, 5, 6, 7, 8',
    timeLimit: 30,
    points: 10,
    hints: ['Try counting on your fingers', 'Start with the bigger number and count up'],
  },
  {
    id: 'add-2',
    type: 'visual_matching',
    topic: 'addition',
    difficulty: 'beginner',
    ageGroup: '6-8',
    question: 'Match the picture to the equation: 🍎🍎 + 🍎🍎🍎 = ?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '5',
    explanation: '2 apples + 3 apples = 5 apples',
    timeLimit: 45,
    points: 15,
    hints: ['Count all the apples in the picture', 'Add the groups together'],
  },
  
  // Multiplication - Intermediate (Ages 9-10)
  {
    id: 'mult-1',
    type: 'timed_drill',
    topic: 'multiplication',
    difficulty: 'intermediate',
    ageGroup: '9-10',
    question: 'What is 7 × 8?',
    options: ['54', '56', '58', '63'],
    correctAnswer: '56',
    explanation: '7 × 8 = 56. Think: 7 × 8 is like adding 7 eight times.',
    timeLimit: 20,
    points: 20,
    hints: ['Remember: 7 × 8 = 56', 'Use the multiplication table'],
  },
  
  // Word Problems - Advanced (Ages 11-12)
  {
    id: 'word-1',
    type: 'word_problem',
    topic: 'word_problems',
    difficulty: 'advanced',
    ageGroup: '11-12',
    question: 'Sarah has 24 stickers. She gives 1/3 of them to her friend. How many stickers does she have left?',
    options: ['8', '12', '16', '18'],
    correctAnswer: '16',
    explanation: '1/3 of 24 = 8 stickers given away. 24 - 8 = 16 stickers left.',
    timeLimit: 60,
    points: 30,
    hints: ['First find 1/3 of 24', 'Then subtract from the original amount'],
  },
  
  // Fractions - Intermediate
  {
    id: 'frac-1',
    type: 'puzzle',
    topic: 'fractions',
    difficulty: 'intermediate',
    ageGroup: '9-10',
    question: 'Which fraction is equivalent to 1/2?',
    options: ['2/4', '3/5', '4/7', '5/8'],
    correctAnswer: '2/4',
    explanation: '2/4 = 1/2 because 2 ÷ 4 = 0.5 and 1 ÷ 2 = 0.5',
    timeLimit: 40,
    points: 25,
    hints: ['Think about pizza slices - 1 out of 2 is the same as 2 out of 4', 'Multiply both top and bottom by the same number'],
  },
];

// Sample Levels Data
export const sampleLevels: Level[] = [
  {
    id: 'add-basics',
    name: 'Addition Basics',
    description: 'Learn to add numbers up to 10',
    topic: 'addition',
    difficulty: 'beginner',
    ageGroup: '6-8',
    challenges: ['add-1', 'add-2'],
    prerequisites: [],
    unlocked: true,
    completed: false,
    completionRequirement: {
      minAccuracy: 0.8,
      minChallengesCompleted: 2,
    },
  },
  {
    id: 'mult-tables',
    name: 'Multiplication Tables',
    description: 'Master the times tables',
    topic: 'multiplication',
    difficulty: 'intermediate',
    ageGroup: '9-10',
    challenges: ['mult-1'],
    prerequisites: ['add-basics'],
    unlocked: false,
    completed: false,
    completionRequirement: {
      minAccuracy: 0.85,
      minChallengesCompleted: 1,
    },
  },
  {
    id: 'word-problems',
    name: 'Real World Problems',
    description: 'Apply math to everyday situations',
    topic: 'word_problems',
    difficulty: 'advanced',
    ageGroup: '11-12',
    challenges: ['word-1'],
    prerequisites: ['mult-tables'],
    unlocked: false,
    completed: false,
    completionRequirement: {
      minAccuracy: 0.75,
      minChallengesCompleted: 1,
    },
  },
  {
    id: 'fractions-intro',
    name: 'Understanding Fractions',
    description: 'Learn what fractions represent',
    topic: 'fractions',
    difficulty: 'intermediate',
    ageGroup: '9-10',
    challenges: ['frac-1'],
    prerequisites: ['add-basics'],
    unlocked: false,
    completed: false,
    completionRequirement: {
      minAccuracy: 0.8,
      minChallengesCompleted: 1,
    },
  },
];

// Sample Badges Data
export const sampleBadges: Badge[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first challenge!',
    icon: '🎯',
    category: 'special',
    requirement: {
      type: 'challenges_completed',
      threshold: 1,
    },
    earned: false,
  },
  {
    id: 'addition-master',
    name: 'Addition Master',
    description: 'Complete 10 addition challenges',
    icon: '➕',
    category: 'mastery',
    requirement: {
      type: 'challenges_completed',
      threshold: 10,
      topic: 'addition',
    },
    earned: false,
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete 5 challenges in under 15 seconds each',
    icon: '⚡',
    category: 'speed',
    requirement: {
      type: 'speed_bonus',
      threshold: 5,
    },
    earned: false,
  },
  {
    id: 'perfect-streak',
    name: 'Perfect Streak',
    description: 'Get 10 answers correct in a row',
    icon: '🔥',
    category: 'streak',
    requirement: {
      type: 'accuracy_rate',
      threshold: 10,
    },
    earned: false,
  },
  {
    id: 'daily-learner',
    name: 'Daily Learner',
    description: 'Practice for 7 days in a row',
    icon: '📚',
    category: 'streak',
    requirement: {
      type: 'streak_days',
      threshold: 7,
    },
    earned: false,
  },
];

// Helper functions
export const getLevelsByAgeGroup = (ageGroup: AgeGroup): Level[] => {
  return sampleLevels.filter(level => level.ageGroup === ageGroup);
};

export const getChallengesByTopic = (topic: MathTopic): Challenge[] => {
  return sampleChallenges.filter(challenge => challenge.topic === topic);
};

export const getChallengesByDifficulty = (difficulty: DifficultyLevel): Challenge[] => {
  return sampleChallenges.filter(challenge => challenge.difficulty === difficulty);
};

export const getLevelById = (id: string): Level | undefined => {
  return sampleLevels.find(level => level.id === id);
};

export const getChallengeById = (id: string): Challenge | undefined => {
  return sampleChallenges.find(challenge => challenge.id === id);
};

export const getNextLevel = (currentLevelId: string, ageGroup: AgeGroup): Level | null => {
  const currentLevel = getLevelById(currentLevelId);
  if (!currentLevel) return null;
  
  const levelsInGroup = getLevelsByAgeGroup(ageGroup);
  const currentIndex = levelsInGroup.findIndex(level => level.id === currentLevelId);
  
  if (currentIndex === -1 || currentIndex === levelsInGroup.length - 1) {
    return null;
  }
  
  return levelsInGroup[currentIndex + 1];
};

export const calculateLevelProgress = (level: Level, completedChallenges: string[]): {
  completed: number;
  total: number;
  percentage: number;
} => {
  const completed = level.challenges.filter(challengeId => 
    completedChallenges.includes(challengeId)
  ).length;
  const total = level.challenges.length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  return { completed, total, percentage };
};