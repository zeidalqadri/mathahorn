'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Lightbulb, CheckCircle, XCircle, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Challenge } from '@/lib/schemas';
import { designTokens } from '@/lib/design-tokens';

interface ChallengeInterfaceProps {
  challenge: Challenge;
  onAnswer: (answer: string, timeSpent: number, hintsUsed: number) => void;
  onSkip?: () => void;
  hintsAvailable?: number;
}

export const ChallengeInterface: React.FC<ChallengeInterfaceProps> = ({
  challenge,
  onAnswer,
  onSkip,
  hintsAvailable = 3,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [currentHint, setCurrentHint] = useState<string>('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(challenge.timeLimit || 0);
  const [startTime] = useState(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answered, setAnswered] = useState(false);

  // Reset states when challenge changes
  useEffect(() => {
    setSelectedAnswer('');
    setCurrentHint('');
    setHintsUsed(0);
    setTimeRemaining(challenge.timeLimit || 0);
    setShowFeedback(false);
    setIsCorrect(false);
    setAnswered(false);
  }, [challenge.id, challenge.timeLimit]);

  // Timer effect
  useEffect(() => {
    if (!challenge.timeLimit || answered) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [challenge.timeLimit, answered]);

  const handleTimeUp = () => {
    if (!answered) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      setAnswered(true);
      onAnswer('', timeSpent, hintsUsed);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || answered) return;

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const correct = selectedAnswer === String(challenge.correctAnswer);
    
    setIsCorrect(correct);
    setShowFeedback(true);
    setAnswered(true);

    // Delay the callback to show feedback, then hide modal
    setTimeout(() => {
      setShowFeedback(false);
      onAnswer(selectedAnswer, timeSpent, hintsUsed);
    }, 3000);
  };

  const handleShowHint = () => {
    if (hintsUsed < hintsAvailable && hintsUsed < challenge.hints.length) {
      setCurrentHint(challenge.hints[hintsUsed]);
      setHintsUsed(prev => prev + 1);
    }
  };

  const getTimeProgress = () => {
    if (!challenge.timeLimit) return 100;
    return (timeRemaining / challenge.timeLimit) * 100;
  };

  const getTimeVariant = () => {
    const progress = getTimeProgress();
    if (progress > 50) return 'success';
    if (progress > 25) return 'warning';
    return 'danger';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header with timer and progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Badge variant="primary" size="lg">
            {challenge.type.replace('_', ' ').toUpperCase()}
          </Badge>
          <Badge variant="secondary">
            {challenge.points} points
          </Badge>
        </div>

        {challenge.timeLimit && (
          <div className="flex items-center gap-2">
            <Clock size={20} style={{ color: designTokens.colors.neutral[600] }} />
            <span 
              className="font-mono text-lg font-semibold"
              style={{ 
                color: getTimeVariant() === 'danger' ? designTokens.colors.danger[600] : 
                       designTokens.colors.neutral[700] 
              }}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>

      {/* Timer progress bar */}
      {challenge.timeLimit && (
        <div className="mb-6">
          <Progress
            value={getTimeProgress()}
            variant={getTimeVariant()}
            size="sm"
            animated
          />
        </div>
      )}

      {/* Main challenge card */}
      <Card variant="elevated" padding="xl" className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Question */}
          <div className="text-center mb-8">
            <h2 
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: designTokens.colors.neutral[800] }}
            >
              {challenge.question}
            </h2>
            {challenge.type === 'visual_matching' && (
              <div className="text-4xl mb-4">
                {/* Visual elements would be rendered here */}
                🎯
              </div>
            )}
          </div>

          {/* Answer options */}
          {challenge.options && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {challenge.options.map((option, index) => (
                <motion.div
                  key={option}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant={selectedAnswer === option ? 'primary' : 'secondary'}
                    size="lg"
                    onClick={() => !answered && setSelectedAnswer(option)}
                    disabled={answered}
                    className="w-full text-left justify-start"
                  >
                    <span className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3 font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Text input for word problems */}
          {challenge.type === 'word_problem' && !challenge.options && (
            <div className="mb-6">
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => !answered && setSelectedAnswer(e.target.value)}
                disabled={answered}
                placeholder="Enter your answer..."
                className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                style={{ borderRadius: designTokens.borderRadius.lg }}
              />
            </div>
          )}

          {/* Current hint display */}
          <AnimatePresence>
            {currentHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Card variant="gradient" padding="md">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-medium text-sm mb-1">Hint:</p>
                      <p className="text-sm">{currentHint}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleShowHint}
                disabled={hintsUsed >= hintsAvailable || hintsUsed >= challenge.hints.length || answered}
                leftIcon={<Lightbulb size={16} />}
              >
                Hint ({hintsAvailable - hintsUsed} left)
              </Button>
              {onSkip && (
                <Button
                  variant="secondary"
                  onClick={onSkip}
                  disabled={answered}
                >
                  Skip
                </Button>
              )}
            </div>

            <Button
              variant="success"
              size="lg"
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer || answered}
              leftIcon={answered ? <CheckCircle size={20} /> : <Zap size={20} />}
            >
              {answered ? 'Submitted' : 'Submit Answer'}
            </Button>
          </div>
        </motion.div>
      </Card>

      {/* Feedback modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
                className="mb-4"
              >
                {isCorrect ? (
                  <CheckCircle size={64} className="text-green-500 mx-auto" />
                ) : (
                  <XCircle size={64} className="text-red-500 mx-auto" />
                )}
              </motion.div>

              <h3 className="text-2xl font-bold mb-2">
                {isCorrect ? '🎉 Correct!' : '😊 Not quite!'}
              </h3>

              <p className="text-gray-600 mb-4">
                {isCorrect 
                  ? `Great job! You earned ${challenge.points} points!`
                  : `The correct answer was: ${challenge.correctAnswer}`
                }
              </p>

              {challenge.explanation && (
                <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-700">{challenge.explanation}</p>
                </div>
              )}

              <Button
                variant="primary"
                onClick={() => {
                  setShowFeedback(false);
                  onAnswer(selectedAnswer, timeSpent, hintsUsed);
                }}
                className="mt-4"
              >
                Continue
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};