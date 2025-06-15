import { useState, useCallback, useEffect } from "react";
import { Quiz as QuizType } from "@/shared/schemas/quiz";
import { Question as QuestionType } from "@/shared/schemas/question";
import { QuestionTypes } from "@/shared/schemas/base-question";
import { ReadingComprehensionQuestion } from "@/shared/schemas/rc";

interface UseQuizAnswersProps {
  quiz: QuizType | null;
}

interface UseQuizAnswersReturn {
  answers: Record<string, string[]>;
  questionStatus: Record<string, boolean>;
  completedCount: number;
  handleAnswerChange: (questionId: string, selectedAnswers: string[]) => void;
}

export const useQuizAnswers = ({
  quiz,
}: UseQuizAnswersProps): UseQuizAnswersReturn => {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [questionStatus, setQuestionStatus] = useState<Record<string, boolean>>(
    {}
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
    console.log(`completed count log`, completed);
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
    []
  );

  return {
    answers,
    questionStatus,
    completedCount,
    handleAnswerChange,
  };
};
