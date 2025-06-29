import { useState, useCallback } from "react";
import { Quiz as QuizType } from "@/shared/schemas/quiz";

/**
 * Props for the useQuestionNavigation hook.
 * @property {QuizType | null} quiz - The quiz object containing questions to navigate.
 */
interface UseQuestionNavigationProps {
  quiz: QuizType | null;
}

/**
 * Return value of the useQuestionNavigation hook.
 * @property {number} currentQuestionIndex - Index of the current question.
 * @property {() => void} handlePrevious - Function to navigate to the previous question.
 * @property {() => void} handleNext - Function to navigate to the next question.
 * @property {boolean} isFirstQuestion - True if the current question is the first.
 * @property {boolean} isLastQuestion - True if the current question is the last.
 */
interface UseQuestionNavigationReturn {
  currentQuestionIndex: number;
  handlePrevious: () => void;
  handleNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

/**
 * React hook to manage navigation through quiz questions.
 *
 * @param {UseQuestionNavigationProps} props - Configuration including the quiz data.
 * @returns {UseQuestionNavigationReturn} Navigation state and handlers.
 */
export const useQuestionNavigation = ({
  quiz,
}: UseQuestionNavigationProps): UseQuestionNavigationReturn => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handlePrevious = useCallback(() => {
    setCurrentQuestionIndex((prevIndex) => Math.max(0, prevIndex - 1));
  }, []);

  const handleNext = useCallback(() => {
    if (quiz) {
      setCurrentQuestionIndex((prevIndex) =>
        Math.min(quiz.questions.length - 1, prevIndex + 1)
      );
    }
  }, [quiz]);

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = quiz
    ? currentQuestionIndex === quiz.questions.length - 1
    : false;

  return {
    currentQuestionIndex,
    handlePrevious,
    handleNext,
    isFirstQuestion,
    isLastQuestion,
  };
};
