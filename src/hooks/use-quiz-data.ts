"use client";

import { useState, useEffect, useCallback } from "react";
import { Quiz as QuizType } from "@/shared/schemas/quiz";
import { QuestionTypes } from "@/shared/schemas/base-question";
import { ReadingComprehensionQuestion } from "@/shared/schemas/rc";

interface UseQuizDataReturn {
  quiz: QuizType | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  totalQuestions: number;
}

export const useQuizData = (): UseQuizDataReturn => {
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Calculate effective question count (including RC sub-questions)
  const calculateTotalQuestions = useCallback((quizData: QuizType): number => {
    let count = 0;
    quizData.questions.forEach((question) => {
      if (question.type === QuestionTypes.RC) {
        const rcQuestion = question as ReadingComprehensionQuestion;
        count += rcQuestion.relatedQuestions.length;
      } else {
        count += 1;
      }
    });
    return count;
  }, []);

  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/v1/quiz");

      if (!response.ok) {
        throw new Error(`Error fetching quiz: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Quiz data fetched:", data);

      // Debug: Log the structure of questions to understand the data
      console.log(
        "Questions structure:",
        data.questions.map((q: any) => ({
          id: q.id,
          type: q.type,
          rightAnswer: q.rightAnswer,
          correctAnswer: q.correctAnswer,
          answer: q.answer,
        })),
      );

      setQuiz(data);
      setTotalQuestions(calculateTotalQuestions(data));
    } catch (err) {
      console.error("Failed to fetch quiz:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch quiz");
    } finally {
      setLoading(false);
    }
  }, [calculateTotalQuestions]);

  const refetch = useCallback(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  return {
    quiz,
    loading,
    error,
    refetch,
    totalQuestions,
  };
};
