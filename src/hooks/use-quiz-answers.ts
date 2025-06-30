import { useState, useCallback, useEffect } from "react";
import { Quiz as QuizType } from "@/shared/schemas/quiz";
import { Question as QuestionType } from "@/shared/schemas/question";
import { QuestionTypes } from "@/shared/schemas/base-question";
import { ReadingComprehensionQuestion } from "@/shared/schemas/rc";

/**
 * Props for the useQuizAnswers hook.
 * @property {QuizType | null} quiz - The quiz object containing questions and answers.
 */
interface UseQuizAnswersProps {
  quiz: QuizType | null;
}

/**
 * Return value of the useQuizAnswers hook.
 * @property {Record<string, string[]>} answers - Map of question IDs to selected answers.
 * @property {Record<string, boolean>} questionStatus - Map of question IDs to completion status.
 * @property {number} completedCount - Number of completed questions.
 * @property {(questionId: string, selectedAnswers: string[]) => void} handleAnswerChange - Function to update answers for a question.
 */
interface UseQuizAnswersReturn {
  answers: Record<string, string[]>;
  questionStatus: Record<string, boolean>;
  completedCount: number;
  handleAnswerChange: (questionId: string, selectedAnswers: string[]) => void;
}

/**
 * React hook to manage quiz answers and their status.
 *
 * @param {UseQuizAnswersProps} props - The quiz data.
 * @returns {UseQuizAnswersReturn} The current answers, status, completed count, and answer changer.
 */
export const useQuizAnswers = ({
  quiz,
}: UseQuizAnswersProps): UseQuizAnswersReturn => {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [questionStatus, setQuestionStatus] = useState<Record<string, boolean>>(
    {},
  );
  const [completedCount, setCompletedCount] = useState(0);

  // Initialize question status when quiz changes
  useEffect(() => {
    if (quiz) {
      const initialStatus: Record<string, boolean> = {};
      quiz.questions.forEach((question: QuestionType) => {
        if (question.type === QuestionTypes.RC) {
          const rcQuestion = question as ReadingComprehensionQuestion;
          rcQuestion.relatedQuestions.forEach((_, index) => {
            initialStatus[`${question.id}-${index}`] = false;
          });
        } else {
          initialStatus[question.id] = false;
        }
      });
      setQuestionStatus(initialStatus);
    }
  }, [quiz]);

  // Update completed count when question status changes
  useEffect(() => {
    const completed = Object.values(questionStatus).filter(Boolean).length;
    setCompletedCount(completed);
  }, [questionStatus]);

  const handleAnswerChange = useCallback(
    (questionId: string, selectedAnswers: string[]) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: selectedAnswers,
      }));

      setQuestionStatus((prev) => ({
        ...prev,
        [questionId]: selectedAnswers.length > 0,
      }));
    },
    [],
  );

  return {
    answers,
    questionStatus,
    completedCount,
    handleAnswerChange,
  };
};
