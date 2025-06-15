import { useState, useCallback } from "react";
import { Quiz as QuizType } from "@/shared/schemas/quiz";

interface UseQuestionNavigationProps {
  quiz: QuizType | null;
}

interface UseQuestionNavigationReturn {
  currentQuestionIndex: number;
  handlePrevious: () => void;
  handleNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

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
