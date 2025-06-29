import { useCallback, useMemo, useEffect } from "react";
import { Quiz } from "@/shared/schemas/quiz";
import { useQuizData } from "@/hooks/use-quiz-data";
import { useQuizScoring } from "@/hooks/use-quiz-scoring";
import { useQuestionNavigation } from "@/hooks/use-question-navigation";
import { useQuizAnswers } from "@/hooks/use-quiz-answers";
import { useQuizSubmission } from "@/hooks/use-quiz-submission";

/**
 * State object returned by the useQuizContainer hook.
 * @property {Quiz | null} quiz - Loaded quiz data.
 * @property {boolean} loading - Loading status of quiz data.
 * @property {string | null} error - Error message if loading failed.
 * @property {number} totalQuestions - Total count of questions in the quiz.
 * @property {Record<string, any>} answers - Map of question IDs to current answers.
 * @property {Record<string, true|false>} questionStatus - Completion status for each question.
 * @property {number} completedCount - Number of questions answered so far.
 * @property {number} currentQuestionIndex - Index of the current question.
 * @property {any} currentQuestion - The current question object.
 * @property {boolean} isFirstQuestion - True if on the first question.
 * @property {boolean} isLastQuestion - True if on the last question.
 * @property {boolean} submitted - True if the quiz has been submitted.
 * @property {number | null} score - Final score after submission.
 * @property {boolean} canSubmit - True if submission is allowed.
 * @property {boolean} isComplete - True if quiz is complete or submitted.
 * @property {(questionId: string, answer: any) => void} handleAnswerChange - Update handler for answers.
 * @property {() => void} handlePrevious - Navigate to the previous question.
 * @property {() => void} handleNext - Navigate to the next question.
 * @property {() => void} handleSubmit - Submit the quiz.
 * @property {() => void} refetch - Refetch quiz data.
 * @property {() => void} resetQuiz - Reset or reload the quiz.
 * @property {number} progressPercentage - Percentage of progress completed.
 * @property {number} [timeSpent] - Time spent on the quiz if tracking enabled.
 */
export interface QuizContainerState {
  // Quiz data
  quiz: Quiz | null;
  loading: boolean;
  error: string | null;
  totalQuestions: number;

  // Answers and progress
  answers: Record<string, any>;
  questionStatus: Record<string, true | false>;
  completedCount: number;

  // Navigation
  currentQuestionIndex: number;
  currentQuestion: any;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;

  // Submission and scoring
  submitted: boolean;
  score: number | null;
  canSubmit: boolean;
  isComplete: boolean;

  // Actions
  handleAnswerChange: (questionId: string, answer: any) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  refetch: () => void;
  resetQuiz: () => void;

  // Computed values
  progressPercentage: number;
  timeSpent?: number;
}

/**
 * Options for the useQuizContainer hook.
 * @property {boolean} [autoSave=true] - Automatically save progress when answers change.
 * @property {boolean} [persistProgress=true] - Persist progress to storage.
 * @property {boolean} [trackTime=false] - Track time spent on the quiz.
 * @property {(results: { score: number; answers: Record<string, any> }) => void} [onComplete] - Callback when quiz completes successfully.
 * @property {(error: string) => void} [onError] - Callback when an error occurs.
 */
export interface UseQuizContainerOptions {
  autoSave?: boolean;
  persistProgress?: boolean;
  trackTime?: boolean;
  onComplete?: (results: {
    score: number;
    answers: Record<string, any>;
  }) => void;
  onError?: (error: string) => void;
}

/**
 * React hook that manages quiz data fetching, navigation, answers, scoring,
 * submission, time tracking, and persistence.
 *
 * @param {UseQuizContainerOptions} [options={}] - Configuration options for quiz behavior.
 * @returns {QuizContainerState} The current quiz state and action handlers.
 */
export const useQuizContainer = (
  options: UseQuizContainerOptions = {}
): QuizContainerState => {
  const {
    autoSave = true,
    persistProgress = true,
    trackTime = false,
    onComplete,
    onError,
  } = options;

  // Core hooks
  const { quiz, loading, error, refetch, totalQuestions } = useQuizData();

  const {
    answers,
    questionStatus,
    completedCount,
    handleAnswerChange: baseHandleAnswerChange,
  } = useQuizAnswers({ quiz });

  const { calculateScore } = useQuizScoring({ quiz, answers });

  const {
    currentQuestionIndex,
    handlePrevious,
    handleNext,
    isFirstQuestion,
    isLastQuestion,
  } = useQuestionNavigation({ quiz });

  const {
    submitted,
    score,
    handleSubmit: baseHandleSubmit,
  } = useQuizSubmission({
    quiz,
    answers,
    calculateScore,
  });

  // Computed values
  const currentQuestion = useMemo(() => {
    return quiz?.questions?.[currentQuestionIndex] || null;
  }, [quiz, currentQuestionIndex]);

  const canSubmit = useMemo(() => {
    return (
      completedCount === totalQuestions && totalQuestions > 0 && !submitted
    );
  }, [completedCount, totalQuestions, submitted]);

  const isComplete = useMemo(() => {
    return submitted || canSubmit;
  }, [submitted, canSubmit]);

  const progressPercentage = useMemo(() => {
    return totalQuestions > 0
      ? Math.round((completedCount / totalQuestions) * 100)
      : 0;
  }, [completedCount, totalQuestions]);

  // Enhanced handlers with additional logic
  const handleAnswerChange = useCallback(
    (questionId: string, answer: any) => {
      baseHandleAnswerChange(questionId, answer);

      // Auto-save logic could be added here
      if (autoSave) {
        // Implementation would depend on your auto-save strategy
        console.log("Auto-saving progress...", { questionId, answer });
      }
    },
    [baseHandleAnswerChange, autoSave]
  );

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    try {
      baseHandleSubmit();

      // Call completion callback if provided
      if (onComplete && score !== null) {
        onComplete({ score, answers });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Submission failed";
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [baseHandleSubmit, canSubmit, onComplete, onError, score, answers]);

  const resetQuiz = useCallback(() => {
    // This would need to be implemented in your individual hooks
    // or you could trigger a refetch and reset local state
    window.location.reload();
  }, []);

  // Error handling
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Time tracking (optional)
  const timeSpent = useMemo(() => {
    if (!trackTime) return undefined;
    // Implementation would depend on your time tracking strategy
    // This is a placeholder
    return 0;
  }, [trackTime]);

  // Progress persistence (optional)
  useEffect(() => {
    if (!persistProgress || !quiz) return;

    const progressData = {
      answers,
      currentQuestionIndex,
      completedCount,
      timestamp: Date.now(),
    };

    // Save to localStorage or your persistence layer
    try {
      localStorage.setItem(`quiz-progress`, JSON.stringify(progressData));
    } catch (error) {
      console.warn("Failed to persist quiz progress:", error);
    }
  }, [answers, currentQuestionIndex, completedCount, persistProgress, quiz]);

  // Return the complete state object
  return {
    // Quiz data
    quiz,
    loading,
    error,
    totalQuestions,

    // Answers and progress
    answers,
    questionStatus,
    completedCount,

    // Navigation
    currentQuestionIndex,
    currentQuestion,
    isFirstQuestion,
    isLastQuestion,

    // Submission and scoring
    submitted,
    score,
    canSubmit,
    isComplete,

    // Actions
    handleAnswerChange,
    handlePrevious,
    handleNext,
    handleSubmit,
    refetch,
    resetQuiz,

    // Computed values
    progressPercentage,
    timeSpent,
  };
};

// Export types for use in components
export type QuizContainerHook = ReturnType<typeof useQuizContainer>;
