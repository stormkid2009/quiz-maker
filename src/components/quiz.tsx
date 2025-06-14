"use client";

import React from "react";
import Question from "./inputs/question";
import { Quiz as QuizType } from "@/shared/schemas/quiz";
import { QuestionTypes } from "@/shared/schemas/base-question";
import { ReadingComprehensionQuestion } from "@/shared/schemas/rc";

export default function Quiz() {
  const [quiz, setQuiz] = React.useState<QuizType | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [answers, setAnswers] = React.useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [score, setScore] = React.useState<number | null>(null);

  React.useEffect(() => {
    async function fetchQuiz() {
      try {
        setLoading(true);
        const response = await fetch("/api/v1/quiz");

        if (!response.ok) {
          throw new Error(`Error fetching quiz: ${response.statusText}`);
        }

        const data = await response.json();
        setQuiz(data);
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch quiz");
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, []);

  const handleAnswerChange = React.useCallback(
    (questionId: string, selectedAnswers: string[]) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: selectedAnswers,
      }));
    },
    []
  );

  const calculateScore = React.useCallback(() => {
    if (!quiz) return 0;

    let totalQuestions = 0;
    let correctAnswers = 0;

    quiz.questions.forEach((question) => {
      if (question.type === QuestionTypes.MCQ) {
        totalQuestions++;
        const userAnswer = answers[question.id] || [];
        const rightAnswer = question.rightAnswer || [];

        if (compareArrays(userAnswer, rightAnswer)) {
          correctAnswers++;
        }
      } else if (question.type === QuestionTypes.MULTI_MCQ) {
        totalQuestions++;
        const userAnswer = answers[question.id] || [];
        const rightAnswer = question.rightAnswer || [];

        if (compareArrays(userAnswer, rightAnswer)) {
          correctAnswers++;
        }
      } else if (question.type === QuestionTypes.RC) {
        const rcQuestion = question as ReadingComprehensionQuestion;
        rcQuestion.relatedQuestions.forEach((subQuestion, index) => {
          totalQuestions++;
          const subQuestionId = `${question.id}-${index}`;
          const userAnswer = answers[subQuestionId] || [];
          const rightAnswer = subQuestion.rightAnswer || [];

          if (compareArrays(userAnswer, rightAnswer)) {
            correctAnswers++;
          }
        });
      }
      // For open-ended questions, we can't automatically grade them
    });

    return totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;
  }, [quiz, answers]);

  // Helper function to compare arrays regardless of order
  const compareArrays = (arr1: string[], arr2: string[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((val, idx) => val === sorted2[idx]);
  };

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const calculatedScore = calculateScore();
      setScore(calculatedScore);
      setSubmitted(true);
      console.log("Quiz answers submitted:", answers);
      console.log("Score:", calculatedScore);
    },
    [answers, calculateScore]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded">
        <h3 className="font-bold mb-2">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-600 rounded">
        <p>No quiz data available.</p>
      </div>
    );
  }

  return (
    <div className="quiz-container max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Quiz</h1>

      {submitted ? (
        <div className="p-4 bg-green-50 text-green-600 rounded">
          <h3 className="font-bold mb-2">Quiz Submitted</h3>
          {score !== null && (
            <p className="mb-2">
              Your score: <span className="font-bold">{score}%</span>
            </p>
          )}
          <p>Thank you for completing the quiz!</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Take Another Quiz
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {quiz.questions.map((question, index) => (
              <div
                key={question.id}
                className="p-6 border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="text-sm text-gray-500 mb-2">
                  Question {index + 1}
                  <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                    {question.type}
                  </span>
                </div>
                <Question
                  question={question}
                  onAnswerChange={handleAnswerChange}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Quiz
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
