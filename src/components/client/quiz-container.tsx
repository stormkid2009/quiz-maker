"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Quiz as QuizType } from "@/shared/schemas/quiz";
import { Question as QuestionType } from "@/shared/schemas/question";
import ProgressBar from "./progress-bar";
import QuizNav from "./quiz-nav";
import Question from "../inputs/question";
import { QuestionTypes } from "@/shared/schemas/base-question";
import { ReadingComprehensionQuestion } from "@/shared/schemas/rc";
import getCorrectAnswer from "@/utils/get-correct-answer";
import useQuizData from "@/hooks/use-quiz-data";

const QuizContainer: React.FC = () => {
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Calculate effective question count (including RC sub-questions)
  const calculateTotalQuestions = useCallback((quizData: QuizType) => {
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

  // Track completion status
  const [questionStatus, setQuestionStatus] = useState<Record<string, boolean>>(
    {},
  );
  const [completedCount, setCompletedCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        setLoading(true);
        const response = await fetch("/api/v1/quiz");

        if (!response.ok) {
          throw new Error(`Error fetching quiz: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`this is api fetched data `, data);

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

        // Initialize status tracking for all questions
        const initialStatus: Record<string, boolean> = {};
        data.questions.forEach((question: QuestionType) => {
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
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch quiz");
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [calculateTotalQuestions]);

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

      // Mark question as completed if it has answers
      setQuestionStatus((prev) => ({
        ...prev,
        [questionId]: selectedAnswers.length > 0,
      }));
    },
    [],
  );

  const handlePrevious = useCallback(() => {
    setCurrentQuestionIndex((prevIndex) => Math.max(0, prevIndex - 1));
  }, []);

  const handleNext = useCallback(() => {
    if (quiz) {
      setCurrentQuestionIndex((prevIndex) =>
        Math.min(quiz.questions.length - 1, prevIndex + 1),
      );
    }
  }, [quiz]);

  // Helper function to get the correct answer from a question
  const getCorrectAnswerX = (question: any): string[] => {
    // Try different possible property names for the correct answer
    const possibleAnswerProps = ["rightAnswer", "answer"];

    for (const prop of possibleAnswerProps) {
      if (question[prop] !== undefined && question[prop] !== null) {
        // Ensure it's always an array
        return Array.isArray(question[prop])
          ? question[prop]
          : [question[prop]];
      }
    }

    console.warn(
      `No correct answer found for question ${question.id}`,
      question,
    );
    return [];
  };

  const calculateScore = useCallback(() => {
    if (!quiz) return 0;

    let totalQuestions = 0;
    let correctAnswers = 0;

    console.log("=== SCORE CALCULATION DEBUG ===");
    console.log("Current answers:", answers);

    quiz.questions.forEach((question) => {
      if (
        question.type === QuestionTypes.MCQ ||
        question.type === QuestionTypes.MULTI_MCQ
      ) {
        totalQuestions++;
        const userAnswerIndices = answers[question.id] || [];
        const rightAnswer = getCorrectAnswer(question);

        // Convert indices to actual option values
        const userAnswerValues = userAnswerIndices.map((index) => {
          const idx = parseInt(index);
          return question.options[idx] || index;
        });

        console.log(`Question ${question.id}:`);
        console.log(`  User selected indices:`, userAnswerIndices);
        console.log(`  User actual values:`, userAnswerValues);
        console.log(`  Correct answer:`, rightAnswer);

        const isCorrect = compareArrays(userAnswerValues, rightAnswer);
        console.log(`  Is correct:`, isCorrect);

        if (isCorrect) {
          correctAnswers++;
        }
      } else if (question.type === QuestionTypes.RC) {
        const rcQuestion = question as ReadingComprehensionQuestion;
        rcQuestion.relatedQuestions.forEach((subQuestion, index) => {
          totalQuestions++;
          const subQuestionId = `${question.id}-${index}`;
          const userAnswerIndices = answers[subQuestionId] || [];
          const rightAnswer = getCorrectAnswer(subQuestion);

          // Convert indices to actual option values
          const userAnswerValues = userAnswerIndices.map((index) => {
            const idx = parseInt(index);
            return subQuestion.options[idx] || index;
          });

          console.log(`RC Sub-question ${subQuestionId}:`);
          console.log(`  User selected indices:`, userAnswerIndices);
          console.log(`  User actual values:`, userAnswerValues);
          console.log(`  Correct answer:`, rightAnswer);

          const isCorrect = compareArrays(userAnswerValues, rightAnswer);
          console.log(`  Is correct:`, isCorrect);

          if (isCorrect) {
            correctAnswers++;
          }
        });
      }
    });

    console.log(`Total questions processed: ${totalQuestions}`);
    console.log(`Correct answers: ${correctAnswers}`);

    const calculatedScore =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;
    console.log(`Final score: ${calculatedScore}%`);

    return calculatedScore;
  }, [quiz, answers]);

  // Helper function to compare arrays regardless of order
  const compareArrays = (arr1: string[], arr2: string[]): boolean => {
    if (!arr1 || !arr2) return false;
    if (arr1.length !== arr2.length) return false;

    // Convert to strings and sort for comparison
    const sorted1 = [...arr1].map(String).sort();
    const sorted2 = [...arr2].map(String).sort();

    const result = sorted1.every((val, idx) => val === sorted2[idx]);
    console.log(
      `    Comparing arrays: ${JSON.stringify(sorted1)} vs ${JSON.stringify(sorted2)} = ${result}`,
    );
    return result;
  };

  const handleSubmit = useCallback(() => {
    console.log("=== SUBMIT DEBUG ===");
    console.log("All answers before submit:", answers);
    console.log("Quiz data:", quiz);

    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setSubmitted(true);
    console.log("Quiz answers submitted:", answers);
    console.log("Score:", calculatedScore);
  }, [answers, calculateScore]);

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

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="quiz-container max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      {submitted ? (
        <div className="result-screen">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed</h2>

          <div className="p-6 bg-green-50 border border-green-200 rounded-lg mb-6">
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Your Results
            </h3>
            {score !== null && (
              <div className="mb-4">
                <p className="text-lg mb-1">
                  Score: <span className="font-bold">{score}%</span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-600 h-4 rounded-full"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            )}

            <p className="text-green-700">
              You've answered {completedCount} of {totalQuestions} questions.
            </p>
          </div>

          {/* Debug information in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6">
              <h4 className="font-semibold mb-2">Debug Information</h4>
              <details>
                <summary className="cursor-pointer">
                  View detailed results
                </summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {JSON.stringify({ answers, quiz: quiz?.questions }, null, 2)}
                </pre>
              </details>
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Take Another Quiz
          </button>
        </div>
      ) : (
        <div className="active-quiz">
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={quiz.questions.length}
          />

          <div className="question-completion mt-2 mb-4">
            <div className="text-sm text-gray-600">
              Completed: {completedCount} of {totalQuestions} questions
            </div>
          </div>

          <div className="question-container p-6 border border-gray-200 rounded-lg">
            <div className="text-sm text-gray-500 mb-2 flex justify-between">
              <span>Question {currentQuestionIndex + 1}</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                {currentQuestion.type}
              </span>
            </div>

            <Question
              question={currentQuestion}
              onAnswerChange={handleAnswerChange}
            />
          </div>

          <QuizNav
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={quiz.questions.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
          />
        </div>
      )}
    </div>
  );
};

export default QuizContainer;
