"use client";

import React from "react";
//import { Quiz as QuizType } from "@/shared/schemas/quiz";
import ProgressBar from "./progress-bar";
import QuizNav from "./quiz-nav";
import Question from "../inputs/question";
import { useQuizData } from "@/hooks/use-quiz-data";
import { useQuizScoring } from "@/hooks/use-quiz-scoring";
import { useQuestionNavigation } from "@/hooks/use-question-navigation";
import { useQuizAnswers } from "@/hooks/use-quiz-answers";
import { useQuizSubmission } from "@/hooks/use-quiz-submission";

const QuizContainer: React.FC = () => {
  const { quiz, loading, error, refetch, totalQuestions } = useQuizData();

  const { answers, questionStatus, completedCount, handleAnswerChange } =
    useQuizAnswers({ quiz });

  const { calculateScore } = useQuizScoring({ quiz, answers });
  const {
    currentQuestionIndex,
    handlePrevious,
    handleNext,
    isFirstQuestion,
    isLastQuestion,
  } = useQuestionNavigation({ quiz });

  const { submitted, score, handleSubmit } = useQuizSubmission({
    quiz,
    answers,
    calculateScore,
  });

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
