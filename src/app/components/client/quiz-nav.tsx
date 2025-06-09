"use client";

import React from "react";

interface QuizNavProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

const QuizNav: React.FC<QuizNavProps> = ({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  isFirstQuestion,
  isLastQuestion,
}) => {
  return (
    <div className="flex justify-between mt-6">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
          ${
            isFirstQuestion
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
      >
        Previous
      </button>

      <div className="text-sm text-gray-500 self-center">
        {currentQuestion} of {totalQuestions}
      </div>

      {isLastQuestion ? (
        <button
          type="button"
          onClick={onSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Submit Quiz
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default QuizNav;
