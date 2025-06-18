"use client";

import React from "react";
import ProgressBar from "./progress-bar";
import QuizNav from "./quiz-nav";
import Question from "../inputs/question";
import { useQuizContainer } from "@/hooks/use-quiz-container";

const QuizContainer: React.FC = () => {
  const {
    // State
    quiz,
    loading,
    error,
    submitted,
    score,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    completedCount,
    progressPercentage,

    // Flags
    isFirstQuestion,
    isLastQuestion,
    canSubmit,

    // Actions
    handleAnswerChange,
    handlePrevious,
    handleNext,
    handleSubmit,
    resetQuiz,
  } = useQuizContainer({
    autoSave: true,
    persistProgress: true,
    trackTime: true,
    onComplete: (results) => {
      console.log("Quiz completed!", results);
      // You could send analytics, show toast, etc.
    },
    onError: (error) => {
      console.error("Quiz error:", error);
      // You could show error toast, send to error reporting, etc.
    },
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded">
        <h3 className="font-bold mb-2">Error</h3>
        <p>{error}</p>
        <button
          onClick={resetQuiz}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // No quiz data
  if (!quiz) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-600 rounded">
        <p>No quiz data available.</p>
      </div>
    );
  }

  return (
    <div className="quiz-container max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      {submitted ? (
        <QuizResults
          score={score}
          completedCount={completedCount}
          totalQuestions={totalQuestions}
          progressPercentage={progressPercentage}
          onRetake={resetQuiz}
        />
      ) : (
        <ActiveQuiz
          quiz={quiz}
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          completedCount={completedCount}
          progressPercentage={progressPercentage}
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
          canSubmit={canSubmit}
          onAnswerChange={handleAnswerChange}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

// Extracted components for better organization
const QuizResults: React.FC<{
  score: number | null;
  completedCount: number;
  totalQuestions: number;
  progressPercentage: number;
  onRetake: () => void;
}> = ({
  score,
  completedCount,
  totalQuestions,
  progressPercentage,
  onRetake,
}) => (
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
              className="bg-green-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      )}

      <p className="text-green-700">
        You've answered {completedCount} of {totalQuestions} questions.
      </p>
    </div>

    <button
      onClick={onRetake}
      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
    >
      Take Another Quiz
    </button>
  </div>
);

const ActiveQuiz: React.FC<{
  quiz: any;
  currentQuestion: any;
  currentQuestionIndex: number;
  totalQuestions: number;
  completedCount: number;
  progressPercentage: number;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  canSubmit: boolean;
  onAnswerChange: (questionId: string, answer: any) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}> = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  completedCount,
  progressPercentage,
  isFirstQuestion,
  isLastQuestion,
  canSubmit,
  onAnswerChange,
  onPrevious,
  onNext,
  onSubmit,
}) => (
  <div className="active-quiz">
    <ProgressBar
      current={currentQuestionIndex + 1}
      total={totalQuestions}
      percentage={progressPercentage}
    />

    <div className="question-completion mt-2 mb-4">
      <div className="text-sm text-gray-600 flex justify-between">
        <span>
          Completed: {completedCount} of {totalQuestions} questions
        </span>
        <span className="text-blue-600">{progressPercentage}% complete</span>
      </div>
    </div>

    <div className="question-container p-6 border border-gray-200 rounded-lg">
      <div className="text-sm text-gray-500 mb-2 flex justify-between">
        <span>Question {currentQuestionIndex + 1}</span>
        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
          {currentQuestion.type}
        </span>
      </div>

      <Question question={currentQuestion} onAnswerChange={onAnswerChange} />
    </div>

    <QuizNav
      currentQuestion={currentQuestionIndex + 1}
      totalQuestions={totalQuestions}
      onPrevious={onPrevious}
      onNext={onNext}
      onSubmit={onSubmit}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      canSubmit={canSubmit}
    />
  </div>
);

export default QuizContainer;
