import { useState, useCallback } from "react";
import { Quiz as QuizType } from "@/shared/schemas/quiz";

/**
 * Props for the useQuizSubmission hook.
 * @property {QuizType | null} quiz - The quiz object to submit.
 * @property {Record<string, string[]>} answers - Map of question IDs to selected answer indices.
 * @property {() => number} calculateScore - Function to calculate the quiz score.
 */
interface UseQuizSubmissionProps {
  quiz: QuizType | null;
  answers: Record<string, string[]>;
  calculateScore: () => number;
}

/**
 * Return value of the useQuizSubmission hook.
 * @property {boolean} submitted - True if the quiz has been submitted.
 * @property {number | null} score - The calculated score after submission.
 * @property {() => void} handleSubmit - Function to trigger quiz submission.
 */
interface UseQuizSubmissionReturn {
  submitted: boolean;
  score: number | null;
  handleSubmit: () => void;
}

/**
 * React hook to handle quiz submission, updating submission state and score.
 *
 * @param {UseQuizSubmissionProps} props - Quiz data, answers, and scoring function.
 * @returns {UseQuizSubmissionReturn} Submission state and handler.
 */
export const useQuizSubmission = ({
  quiz,
  answers,
  calculateScore,
}: UseQuizSubmissionProps): UseQuizSubmissionReturn => {
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  /**
   * Handle quiz submission: calculate score and set submitted flag.
   */
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
