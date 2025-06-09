"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Quiz as QuizType } from "@/shared/schemas/quiz";
import { Question as QuestionType } from "@/shared/schemas/question";
import ProgressBar from "./progress-bar";
import QuizNav from "./quiz-nav";
import Question from "../inputs/question";
import { QuestionTypes } from "@/shared/schemas/base-question";
import { ReadingComprehensionQuestion } from "@/shared/schemas/rc";

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
  const [questionStatus, setQuestionStatus] = useState<Record<string, boolean>>({});
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
    []
  );

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

  const calculateScore = useCallback(() => {
    if (!quiz) return 0;
    
    let totalQuestions = 0;
    let correctAnswers = 0;
    
    quiz.questions.forEach(question => {
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
    
    return totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  }, [quiz, answers]);
  
  // Helper function to compare arrays regardless of order
  const compareArrays = (arr1: string[], arr2: string[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((val, idx) => val === sorted2[idx]);
  };

  const handleSubmit = useCallback(() => {
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
            <h3 className="text-xl font-semibold text-green-800 mb-2">Your Results</h3>
            {score !== null && (
              <div className="mb-4">
                <p className="text-lg mb-1">Score: <span className="font-bold">{score}%</span></p>
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
