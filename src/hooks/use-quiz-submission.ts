import { useState, useCallback } from "react";
import { Quiz as QuizType } from "@/shared/schemas/quiz";

interface UseQuizSubmissionProps {
  quiz: QuizType | null;
  answers: Record<string, string[]>;
  calculateScore: () => number;
}

interface UseQuizSubmissionReturn {
  submitted: boolean;
  score: number | null;
  handleSubmit: () => void;
}

export const useQuizSubmission = ({
  quiz,
  answers,
  calculateScore,
}: UseQuizSubmissionProps): UseQuizSubmissionReturn => {
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSubmit = useCallback(() => {
    console.log("=== SUBMIT DEBUG ===");
    console.log("All answers before submit:", answers);
    console.log("Quiz data:", quiz);

    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setSubmitted(true);
    console.log("Quiz answers submitted:", answers);
    console.log("Score:", calculatedScore);
  }, [answers, calculateScore, quiz]);

  return {
    submitted,
    score,
    handleSubmit,
  };
};
